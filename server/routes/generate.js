const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/generate/roadmap — fetch user's saved preferences + generated roadmap
router.get('/roadmap', async (req, res) => {
  try {
    const { rows: [roadmap] } = await pool.query(
      'SELECT * FROM user_roadmaps WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ roadmap: roadmap || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// POST /api/generate/preferences — save user's goals/preferences for AI generation
router.post('/preferences', async (req, res) => {
  try {
    const { hoursPerDay, budget, currentLevel, targetGoal, learningStyle } = req.body;
    const preferences = { hoursPerDay, budget, currentLevel, targetGoal, learningStyle };

    const { rows: [roadmap] } = await pool.query(`
      INSERT INTO user_roadmaps (user_id, preferences, status)
      VALUES ($1, $2::jsonb, 'draft')
      ON CONFLICT (user_id) DO UPDATE
        SET preferences = $2::jsonb,
            updated_at  = NOW()
      RETURNING *
    `, [req.user.id, JSON.stringify(preferences)]);

    res.json({ roadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// POST /api/generate/roadmap — trigger AI generation
// Placeholder now — Claude API will be wired in here when key is added.
// Accepts preferences + saved resources, returns structured roadmap JSON.
router.post('/roadmap', async (req, res) => {
  try {
    const userId = req.user.id;

    // Gather context for AI (already built, ready for Claude)
    const [{ rows: [existing] }, { rows: saved }] = await Promise.all([
      pool.query('SELECT * FROM user_roadmaps WHERE user_id = $1', [userId]),
      pool.query(`
        SELECT r.title, r.type, r.url, r.is_free, sg.skill, rl.code AS level_code
        FROM user_resources ur
        JOIN resources r      ON r.id = ur.resource_id
        JOIN skill_guides sg  ON sg.id = r.skill_guide_id
        JOIN roadmap_levels rl ON rl.id = sg.level_id
        WHERE ur.user_id = $1
        ORDER BY rl.order_index, sg.skill
      `, [userId]),
    ]);

    const preferences = existing?.preferences || {};

    // ─── Claude integration hook ──────────────────────────────────────────────
    // When ANTHROPIC_API_KEY is added, replace the placeholder below with:
    //
    // const Anthropic = require('@anthropic-ai/sdk');
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    //
    // const message = await anthropic.messages.create({
    //   model: 'claude-haiku-4-5',
    //   max_tokens: 4096,
    //   messages: [{
    //     role: 'user',
    //     content: buildPrompt(preferences, saved),  // builds the generation prompt
    //   }],
    // });
    //
    // const generatedContent = JSON.parse(message.content[0].text);
    // ─────────────────────────────────────────────────────────────────────────

    const placeholder = {
      ai_ready: false,
      message: 'Add your ANTHROPIC_API_KEY to .env to enable AI generation.',
      preferences,
      savedResources: saved,
      savedCount: saved.length,
    };

    const { rows: [roadmap] } = await pool.query(`
      INSERT INTO user_roadmaps (user_id, preferences, generated_content, status)
      VALUES ($1, $2::jsonb, $3::jsonb, 'draft')
      ON CONFLICT (user_id) DO UPDATE
        SET generated_content = $3::jsonb,
            updated_at        = NOW()
      RETURNING *
    `, [userId, JSON.stringify(preferences), JSON.stringify(placeholder)]);

    res.json({ roadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

module.exports = router;
