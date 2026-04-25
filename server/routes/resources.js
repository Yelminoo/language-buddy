const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/resources — all roadmap resources with user's saved status + counts
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill, level, type, free } = req.query;

    let query = `
      SELECT
        r.id, r.title, r.url, r.type, r.description, r.is_free,
        sg.skill,
        rl.code AS level_code,
        rl.name AS level_name,
        rl.order_index,
        CASE WHEN ur.id IS NOT NULL THEN true ELSE false END AS is_saved
      FROM resources r
      JOIN skill_guides sg ON sg.id = r.skill_guide_id
      JOIN roadmap_levels rl ON rl.id = sg.level_id
      LEFT JOIN user_resources ur ON ur.resource_id = r.id AND ur.user_id = $1
      WHERE 1=1
    `;
    const params = [userId];
    let p = 2;

    if (skill)  { query += ` AND sg.skill = $${p++}`;              params.push(skill); }
    if (level)  { query += ` AND rl.code = $${p++}`;               params.push(level.toUpperCase()); }
    if (type)   { query += ` AND r.type = $${p++}`;                params.push(type); }
    if (free === 'true') { query += ` AND r.is_free = true`; }

    query += ` ORDER BY rl.order_index, sg.skill, r.id`;

    const { rows } = await pool.query(query, params);
    const savedCount = rows.filter(r => r.is_saved).length;

    res.json({ resources: rows, total: rows.length, savedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET /api/resources/stats — per-level/skill breakdown of total vs saved
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(`
      SELECT
        rl.code  AS level_code,
        rl.name  AS level_name,
        rl.order_index,
        sg.skill,
        COUNT(r.id)::int                                         AS total,
        COUNT(ur.id)::int                                        AS saved
      FROM roadmap_levels rl
      JOIN skill_guides sg  ON sg.level_id       = rl.id
      JOIN resources r      ON r.skill_guide_id  = sg.id
      LEFT JOIN user_resources ur ON ur.resource_id = r.id AND ur.user_id = $1
      GROUP BY rl.code, rl.name, rl.order_index, sg.skill
      ORDER BY rl.order_index, sg.skill
    `, [userId]);

    res.json({ stats: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resource stats' });
  }
});

// GET /api/resources/mine — only the user's saved roadmap resources
router.get('/mine', async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(`
      SELECT
        r.id, r.title, r.url, r.type, r.description, r.is_free,
        sg.skill,
        rl.code AS level_code,
        rl.name AS level_name,
        rl.order_index,
        ur.saved_at
      FROM user_resources ur
      JOIN resources r      ON r.id            = ur.resource_id
      JOIN skill_guides sg  ON sg.id           = r.skill_guide_id
      JOIN roadmap_levels rl ON rl.id          = sg.level_id
      WHERE ur.user_id = $1
      ORDER BY rl.order_index, sg.skill
    `, [userId]);

    res.json({ resources: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved resources' });
  }
});

// GET /api/resources/discovered — user's saved Brave Search discoveries
router.get('/discovered', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM discovered_resources WHERE user_id = $1 ORDER BY discovered_at DESC`,
      [req.user.id]
    );
    res.json({ resources: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch discoveries' });
  }
});

// POST /api/resources/save/:resourceId — save a roadmap resource
router.post('/save/:resourceId', async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO user_resources (user_id, resource_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, req.params.resourceId]
    );
    res.json({ saved: true, resourceId: req.params.resourceId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save resource' });
  }
});

// DELETE /api/resources/save/:resourceId — unsave a roadmap resource
router.delete('/save/:resourceId', async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM user_resources WHERE user_id = $1 AND resource_id = $2`,
      [req.user.id, req.params.resourceId]
    );
    res.json({ saved: false, resourceId: req.params.resourceId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsave resource' });
  }
});

// POST /api/resources/discover/save — pin a Brave Search result to user's discoveries
router.post('/discover/save', async (req, res) => {
  try {
    const { title, url, description, skill, level_code, search_query } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'title and url required' });

    const { rows: [row] } = await pool.query(
      `INSERT INTO discovered_resources (user_id, title, url, description, skill, level_code, search_query)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, url) DO NOTHING
       RETURNING *`,
      [req.user.id, title, url, description, skill || null, level_code || null, search_query || null]
    );
    res.json({ saved: true, resource: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save discovery' });
  }
});

// DELETE /api/resources/discover/:id — remove a discovery
router.delete('/discover/:id', async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM discovered_resources WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete discovery' });
  }
});

// GET /api/resources/search?q= — Brave Search for new Japanese learning resources
router.get('/search', async (req, res) => {
  try {
    const { q, skill, level } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'BRAVE_SEARCH_API_KEY not configured in .env' });
    }

    // Build a Japanese-learning-specific query
    const skillLabel = skill ? `${skill} practice` : '';
    const levelLabel = level ? `for ${level} level` : '';
    const fullQuery = `Japanese language learning resources ${skillLabel} ${levelLabel} ${q}`.trim();

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(fullQuery)}&count=12`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Brave API ${response.status}: ${text}`);
    }

    const data = await response.json();
    const results = (data.web?.results || []).map(r => ({
      title:       r.title,
      url:         r.url,
      description: r.description || '',
      source:      (() => { try { return new URL(r.url).hostname.replace('www.', ''); } catch { return r.url; } })(),
      thumbnail:   r.thumbnail?.src || null,
    }));

    res.json({ results, query: fullQuery, total: results.length });
  } catch (err) {
    console.error('Brave Search error:', err.message);
    res.status(500).json({ error: 'Search failed', message: err.message });
  }
});

module.exports = router;
