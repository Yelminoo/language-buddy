const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/vocabulary — list all vocabulary for user
router.get('/', async (req, res) => {
  try {
    const { language, difficulty } = req.query;
    let query = 'SELECT * FROM vocabulary WHERE user_id = $1';
    const params = [req.user.id];

    if (language) {
      params.push(language);
      query += ` AND language = $${params.length}`;
    }
    if (difficulty) {
      params.push(parseInt(difficulty));
      query += ` AND difficulty = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ vocabulary: result.rows });
  } catch (err) {
    console.error('Get vocabulary error:', err);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// GET /api/vocabulary/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vocabulary WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Word not found' });
    res.json({ word: result.rows[0] });
  } catch (err) {
    console.error('Get word error:', err);
    res.status(500).json({ error: 'Failed to fetch word' });
  }
});

// POST /api/vocabulary — add a new word
router.post('/', async (req, res) => {
  const { word, translation, language, example_sentence, difficulty } = req.body;

  if (!word || !translation || !language) {
    return res.status(400).json({ error: 'word, translation, and language are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO vocabulary (user_id, word, translation, language, example_sentence, difficulty)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, word, translation, language, example_sentence || null, difficulty || 1]
    );
    res.status(201).json({ word: result.rows[0] });
  } catch (err) {
    console.error('Add word error:', err);
    res.status(500).json({ error: 'Failed to add word' });
  }
});

// PUT /api/vocabulary/:id — update a word
router.put('/:id', async (req, res) => {
  const { word, translation, language, example_sentence, difficulty } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vocabulary
       SET word = COALESCE($1, word),
           translation = COALESCE($2, translation),
           language = COALESCE($3, language),
           example_sentence = COALESCE($4, example_sentence),
           difficulty = COALESCE($5, difficulty)
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [word, translation, language, example_sentence, difficulty, req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Word not found' });
    res.json({ word: result.rows[0] });
  } catch (err) {
    console.error('Update word error:', err);
    res.status(500).json({ error: 'Failed to update word' });
  }
});

// POST /api/vocabulary/:id/review — record a review attempt
router.post('/:id/review', async (req, res) => {
  const { correct } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vocabulary
       SET times_reviewed = times_reviewed + 1,
           correct_count = correct_count + $1,
           last_reviewed = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [correct ? 1 : 0, req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Word not found' });
    res.json({ word: result.rows[0] });
  } catch (err) {
    console.error('Review word error:', err);
    res.status(500).json({ error: 'Failed to record review' });
  }
});

// DELETE /api/vocabulary/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM vocabulary WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Word not found' });
    res.json({ message: 'Word deleted' });
  } catch (err) {
    console.error('Delete word error:', err);
    res.status(500).json({ error: 'Failed to delete word' });
  }
});

module.exports = router;
