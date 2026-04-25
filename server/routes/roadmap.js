const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/roadmap — all levels (overview cards)
router.get('/', async (req, res) => {
  try {
    const { rows: levels } = await pool.query(
      'SELECT * FROM roadmap_levels ORDER BY order_index'
    );
    res.json({ levels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// GET /api/roadmap/:code — full detail for one level (A1, B2, etc.)
router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();

    const { rows: [level] } = await pool.query(
      'SELECT * FROM roadmap_levels WHERE code = $1',
      [code]
    );
    if (!level) return res.status(404).json({ error: 'Level not found' });

    const { rows: guides } = await pool.query(
      'SELECT * FROM skill_guides WHERE level_id = $1',
      [level.id]
    );

    const skills = {};
    for (const guide of guides) {
      const { rows: resources } = await pool.query(
        'SELECT * FROM resources WHERE skill_guide_id = $1 ORDER BY id',
        [guide.id]
      );
      const { rows: checklist } = await pool.query(
        'SELECT * FROM checklist_items WHERE skill_guide_id = $1 ORDER BY order_index',
        [guide.id]
      );
      skills[guide.skill] = {
        id: guide.id,
        goals: guide.goals,
        tips: guide.tips,
        resources,
        checklist,
      };
    }

    res.json({ level: { ...level, skills } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch level' });
  }
});

module.exports = router;
