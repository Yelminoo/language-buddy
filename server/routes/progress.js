const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/progress — user's completed item IDs + per-level summary
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // All completed item IDs for this user
    const { rows: progressRows } = await pool.query(
      `SELECT checklist_item_id FROM user_progress
       WHERE user_id = $1 AND completed = TRUE`,
      [userId]
    );
    const completedItems = progressRows.map(r => r.checklist_item_id);

    // Per-level totals and completion counts
    const { rows: summaryRows } = await pool.query(
      `SELECT
         rl.code,
         COUNT(ci.id)::int AS total,
         COUNT(up.id) FILTER (WHERE up.completed = TRUE)::int AS completed
       FROM roadmap_levels rl
       JOIN skill_guides sg ON sg.level_id = rl.id
       JOIN checklist_items ci ON ci.skill_guide_id = sg.id
       LEFT JOIN user_progress up ON up.checklist_item_id = ci.id AND up.user_id = $1
       GROUP BY rl.code, rl.order_index
       ORDER BY rl.order_index`,
      [userId]
    );

    const levelSummary = {};
    for (const row of summaryRows) {
      levelSummary[row.code] = {
        total: row.total,
        completed: row.completed,
        percent: row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0,
      };
    }

    res.json({ completedItems, levelSummary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/progress/toggle/:itemId — toggle a checklist item on/off
router.post('/toggle/:itemId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Upsert: if row exists toggle it, if not create it as completed
    const { rows: [existing] } = await pool.query(
      `SELECT id, completed FROM user_progress
       WHERE user_id = $1 AND checklist_item_id = $2`,
      [userId, itemId]
    );

    let completed;
    if (existing) {
      completed = !existing.completed;
      await pool.query(
        `UPDATE user_progress
         SET completed = $1, completed_at = $2
         WHERE id = $3`,
        [completed, completed ? new Date() : null, existing.id]
      );
    } else {
      completed = true;
      await pool.query(
        `INSERT INTO user_progress (user_id, checklist_item_id, completed, completed_at)
         VALUES ($1, $2, TRUE, NOW())`,
        [userId, itemId]
      );
    }

    res.json({ itemId, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
