import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Japanese',
  'Korean', 'Chinese', 'Arabic', 'Portuguese', 'Italian',
];

const DIFFICULTY_LABELS = { 1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };
const DIFFICULTY_COLORS = { 1: '#16a34a', 2: '#0891b2', 3: '#d97706', 4: '#dc2626', 5: '#7c3aed' };

function AddWordModal({ onClose, onAdded, defaultLanguage }) {
  const [form, setForm] = useState({
    word: '',
    translation: '',
    language: defaultLanguage || 'Spanish',
    example_sentence: '',
    difficulty: 1,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.post('/vocabulary', {
        ...form,
        difficulty: parseInt(form.difficulty),
      });
      onAdded(data.word);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save word.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Add new word</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Word / Phrase</label>
              <input name="word" value={form.word} onChange={handleChange} placeholder="e.g. Hola" required autoFocus />
            </div>
            <div className="form-group">
              <label>Translation</label>
              <input name="translation" value={form.translation} onChange={handleChange} placeholder="e.g. Hello" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Language</label>
              <select name="language" value={form.language} onChange={handleChange}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Example sentence <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
            <input name="example_sentence" value={form.example_sentence} onChange={handleChange}
              placeholder="e.g. ¡Hola, cómo estás?" />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save word'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FlashcardMode({ words, onExit, onReview }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = words[index];

  async function handleAnswer(correct) {
    try {
      await onReview(current.id, correct);
    } catch { /* swallow */ }
    const newScore = { correct: score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(newScore);
    if (index + 1 >= words.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
    }
  }

  if (done) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Session complete!</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          You got <strong>{score.correct}</strong> out of <strong>{score.total}</strong> correct ({pct}%)
        </p>
        <button className="btn btn-primary" onClick={onExit}>Back to word list</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button className="btn btn-ghost" onClick={onExit}>← Exit review</button>
        <span style={{ fontSize: 14, color: '#6b7280' }}>{index + 1} / {words.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, marginBottom: 32 }}>
        <div style={{ height: '100%', background: '#4f46e5', borderRadius: 2, width: `${((index) / words.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          padding: '60px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          minHeight: 240,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 24,
          transition: 'box-shadow 0.15s',
          userSelect: 'none',
        }}
      >
        <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>
          {flipped ? 'Translation' : 'Word'}
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#1f2937' }}>
          {flipped ? current.translation : current.word}
        </div>
        {flipped && current.example_sentence && (
          <div style={{ fontSize: 15, color: '#6b7280', fontStyle: 'italic', marginTop: 8 }}>
            "{current.example_sentence}"
          </div>
        )}
        {!flipped && (
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 12 }}>Tap to reveal translation</div>
        )}
        <span className="badge badge-indigo" style={{ marginTop: 8 }}>{current.language}</span>
      </div>

      {flipped && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 15 }}
            onClick={() => handleAnswer(false)}
          >
            ✗ Got it wrong
          </button>
          <button
            className="btn btn-success"
            style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 15 }}
            onClick={() => handleAnswer(true)}
          >
            ✓ Got it right
          </button>
        </div>
      )}
    </div>
  );
}

export default function VocabularyPage() {
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [filterLang, setFilterLang] = useState('');
  const [search, setSearch] = useState('');

  const fetchWords = useCallback(async () => {
    try {
      const { data } = await api.get('/vocabulary');
      setWords(data.vocabulary);
    } catch {
      /* swallow */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  function handleAdded(word) {
    setWords(w => [word, ...w]);
    setShowAdd(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this word?')) return;
    try {
      await api.delete(`/vocabulary/${id}`);
      setWords(w => w.filter(v => v.id !== id));
    } catch { /* swallow */ }
  }

  async function handleReview(id, correct) {
    const { data } = await api.post(`/vocabulary/${id}/review`, { correct });
    setWords(w => w.map(v => v.id === id ? data.word : v));
  }

  const filtered = words.filter(w => {
    const matchLang = !filterLang || w.language === filterLang;
    const matchSearch = !search ||
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchSearch;
  });

  if (reviewMode && filtered.length > 0) {
    return (
      <div className="page-container">
        <FlashcardMode
          words={filtered}
          onExit={() => setReviewMode(false)}
          onReview={handleReview}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      {showAdd && (
        <AddWordModal
          onClose={() => setShowAdd(false)}
          onAdded={handleAdded}
          defaultLanguage={user?.target_language}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Vocabulary</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {filtered.length > 0 && (
            <button className="btn btn-ghost" onClick={() => setReviewMode(true)}>
              🃏 Review flashcards
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Add word
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db',
            fontSize: 14, background: '#fff', minWidth: 200,
          }}
        />
        <select
          value={filterLang}
          onChange={e => setFilterLang(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db',
            fontSize: 14, background: '#fff',
          }}
        >
          <option value="">All languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>Loading vocabulary...</p>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#1f2937' }}>
            {words.length === 0 ? 'No words yet' : 'No results found'}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>
            {words.length === 0 ? 'Start building your vocabulary by adding your first word.' : 'Try adjusting your search or filter.'}
          </p>
          {words.length === 0 && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add your first word</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(word => (
            <WordCard key={word.id} word={word} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 16, textAlign: 'right' }}>
          Showing {filtered.length} of {words.length} words
        </p>
      )}
    </div>
  );
}

function WordCard({ word, onDelete }) {
  const diffColor = DIFFICULTY_COLORS[word.difficulty] || '#4f46e5';
  const diffLabel = DIFFICULTY_LABELS[word.difficulty] || 'Unknown';
  const accuracy = word.times_reviewed > 0
    ? Math.round((word.correct_count / word.times_reviewed) * 100)
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{word.word}</div>
          <div style={{ fontSize: 16, color: '#4b5563', marginTop: 2 }}>{word.translation}</div>
        </div>
        <button
          onClick={() => onDelete(word.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#d1d5db', padding: 4, lineHeight: 1 }}
          title="Delete word"
          onMouseEnter={e => e.target.style.color = '#dc2626'}
          onMouseLeave={e => e.target.style.color = '#d1d5db'}
        >
          ✕
        </button>
      </div>

      {word.example_sentence && (
        <p style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic', borderLeft: '3px solid #e5e7eb', paddingLeft: 10 }}>
          {word.example_sentence}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge badge-indigo">{word.language}</span>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 9999,
            fontSize: 12, fontWeight: 600, background: diffColor + '18', color: diffColor,
          }}>{diffLabel}</span>
        </div>
        {accuracy !== null && (
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            {accuracy}% accuracy ({word.times_reviewed} reviews)
          </span>
        )}
      </div>
    </div>
  );
}
