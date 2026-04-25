require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // DigitalOcean Managed Postgres requires SSL in production
  ...(process.env.NODE_ENV === 'production' && {
    ssl: { rejectUnauthorized: false },
  }),
});

async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        target_language TEXT NOT NULL DEFAULT 'Spanish',
        native_language TEXT NOT NULL DEFAULT 'English',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vocabulary (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word TEXT NOT NULL,
        translation TEXT NOT NULL,
        language TEXT NOT NULL,
        example_sentence TEXT,
        difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
        times_reviewed INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        last_reviewed TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        language TEXT NOT NULL,
        lesson_type TEXT NOT NULL DEFAULT 'vocabulary' CHECK (lesson_type IN ('vocabulary', 'grammar', 'reading')),
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS roadmap_levels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(2) NOT NULL UNIQUE,
        name TEXT NOT NULL,
        jlpt VARCHAR(5),
        kanji_count INTEGER,
        description TEXT,
        order_index INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS skill_guides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        level_id UUID NOT NULL REFERENCES roadmap_levels(id) ON DELETE CASCADE,
        skill TEXT NOT NULL CHECK (skill IN ('reading', 'writing', 'listening', 'speaking')),
        goals TEXT[] DEFAULT '{}',
        tips TEXT[] DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        skill_guide_id UUID NOT NULL REFERENCES skill_guides(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        url TEXT,
        type TEXT NOT NULL CHECK (type IN ('app', 'book', 'website', 'youtube', 'podcast', 'textbook', 'tool')),
        description TEXT,
        is_free BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS checklist_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        skill_guide_id UUID NOT NULL REFERENCES skill_guides(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        order_index INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        checklist_item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMPTZ,
        UNIQUE(user_id, checklist_item_id)
      );

      CREATE TABLE IF NOT EXISTS user_resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        saved_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, resource_id)
      );

      CREATE TABLE IF NOT EXISTS discovered_resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        skill TEXT,
        level_code TEXT,
        search_query TEXT,
        discovered_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, url)
      );

      CREATE TABLE IF NOT EXISTS user_roadmaps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        preferences JSONB DEFAULT '{}',
        generated_content JSONB,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id)
      );
    `);
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Schema initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initSchema };
