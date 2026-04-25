import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useMobile } from '../hooks/useMobile';

const FLAG_MAP = {
  Spanish: '🇪🇸', French: '🇫🇷', German: '🇩🇪', Japanese: '🇯🇵',
  Korean: '🇰🇷', Chinese: '🇨🇳', Arabic: '🇸🇦', Portuguese: '🇵🇹',
  Italian: '🇮🇹', English: '🇬🇧',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const isMobile = useMobile();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [vocabRes, lessonRes] = await Promise.all([
          api.get('/vocabulary'),
          api.get('/lessons'),
        ]);
        const vocab = vocabRes.data.vocabulary;
        const lessons = lessonRes.data.lessons;
        const reviewed = vocab.filter(w => w.times_reviewed > 0);
        const totalCorrect = vocab.reduce((sum, w) => sum + (w.correct_count || 0), 0);
        const totalReviews = vocab.reduce((sum, w) => sum + (w.times_reviewed || 0), 0);
        setStats({
          totalWords: vocab.length,
          wordsReviewed: reviewed.length,
          accuracy: totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0,
          totalLessons: lessons.length,
          completedLessons: lessons.filter(l => l.completed).length,
        });
      } catch {
        setStats({ totalWords: 0, wordsReviewed: 0, accuracy: 0, totalLessons: 0, completedLessons: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const flag = FLAG_MAP[user?.target_language] || '🌐';

  return (
    <div className="page-container">
      {/* Welcome hero */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: '#fff',
        padding: isMobile ? '24px 18px' : '36px 32px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div>
          <p style={{ opacity: 0.85, fontSize: 13, marginBottom: 4 }}>Welcome back,</p>
          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, marginBottom: 6 }}>
            {user?.name} 👋
          </h1>
          <p style={{ opacity: 0.85, fontSize: isMobile ? 14 : 16 }}>
            You're learning <strong>{user?.target_language}</strong> — keep it up!
          </p>
        </div>
        {!isMobile && <div style={{ fontSize: 80, lineHeight: 1 }}>{flag}</div>}
      </div>

      {/* Stats row */}
      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center' }}>Loading your stats...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
            <StatCard
              label="Total vocabulary"
              value={stats.totalWords}
              icon="📚"
              sub={`words saved`}
              color="#4f46e5"
            />
            <StatCard
              label="Words reviewed"
              value={stats.wordsReviewed}
              icon="🔁"
              sub={`of ${stats.totalWords} words`}
              color="#0891b2"
            />
            <StatCard
              label="Accuracy"
              value={`${stats.accuracy}%`}
              icon="🎯"
              sub="correct answers"
              color="#16a34a"
            />
            <StatCard
              label="Lessons"
              value={stats.totalLessons}
              icon="📖"
              sub={`${stats.completedLessons} completed`}
              color="#d97706"
            />
          </div>

          {/* Quick actions */}
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 16 }}>Quick actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <ActionCard
              to="/roadmap"
              icon="🗺️"
              title="View your roadmap"
              desc="Follow the full A1→C2 Japanese learning path across all 4 skills"
              color="#16a34a"
            />
            <ActionCard
              to="/vocabulary"
              icon="📝"
              title="Add vocabulary"
              desc="Save new words with translations and examples"
              color="#4f46e5"
            />
            <ActionCard
              to="/vocabulary"
              icon="🃏"
              title="Review flashcards"
              desc="Practice your saved words with flashcards"
              color="#7c3aed"
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, sub, color }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 24, background: color + '18',
          borderRadius: 8, padding: '6px 10px',
        }}>{icon}</span>
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#9ca3af' }}>{sub}</div>
    </div>
  );
}

function ActionCard({ to, icon, title, desc, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        display: 'flex', gap: 16, alignItems: 'flex-start',
        transition: 'box-shadow 0.15s, transform 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.transform = '';
        }}
      >
        <span style={{
          fontSize: 28, background: color + '18',
          borderRadius: 8, padding: '8px 12px', flexShrink: 0,
        }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{desc}</div>
        </div>
      </div>
    </Link>
  );
}
