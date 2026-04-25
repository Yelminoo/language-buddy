const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/lessons — list all lessons for user
router.get('/', async (req, res) => {
  try {
    const { language, lesson_type, completed } = req.query;
    let query = 'SELECT * FROM lessons WHERE user_id = $1';
    const params = [req.user.id];

    if (language) {
      params.push(language);
      query += ` AND language = $${params.length}`;
    }
    if (lesson_type) {
      params.push(lesson_type);
      query += ` AND lesson_type = $${params.length}`;
    }
    if (completed !== undefined) {
      params.push(completed === 'true');
      query += ` AND completed = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ lessons: result.rows });
  } catch (err) {
    console.error('Get lessons error:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// GET /api/lessons/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lessons WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ lesson: result.rows[0] });
  } catch (err) {
    console.error('Get lesson error:', err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// POST /api/lessons — create a lesson
router.post('/', async (req, res) => {
  const { title, content, language, lesson_type } = req.body;

  if (!title || !content || !language) {
    return res.status(400).json({ error: 'title, content, and language are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO lessons (user_id, title, content, language, lesson_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, title, content, language, lesson_type || 'vocabulary']
    );
    res.status(201).json({ lesson: result.rows[0] });
  } catch (err) {
    console.error('Create lesson error:', err);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// PUT /api/lessons/:id — update a lesson
router.put('/:id', async (req, res) => {
  const { title, content, language, lesson_type, completed, score } = req.body;

  try {
    const result = await pool.query(
      `UPDATE lessons
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           language = COALESCE($3, language),
           lesson_type = COALESCE($4, lesson_type),
           completed = COALESCE($5, completed),
           score = COALESCE($6, score)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, content, language, lesson_type, completed, score, req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ lesson: result.rows[0] });
  } catch (err) {
    console.error('Update lesson error:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// DELETE /api/lessons/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM lessons WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    console.error('Delete lesson error:', err);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

module.exports = router;
