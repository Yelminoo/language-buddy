import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LEVEL_COLORS = {
  A1: { bg: '#dcfce7', border: '#16a34a', text: '#15803d', badge: '#16a34a' },
  A2: { bg: '#d1fae5', border: '#059669', text: '#047857', badge: '#059669' },
  B1: { bg: '#dbeafe', border: '#2563eb', text: '#1d4ed8', badge: '#2563eb' },
  B2: { bg: '#e0f2fe', border: '#0284c7', text: '#0369a1', badge: '#0284c7' },
  C1: { bg: '#ede9fe', border: '#7c3aed', text: '#6d28d9', badge: '#7c3aed' },
  C2: { bg: '#fce7f3', border: '#db2777', text: '#be185d', badge: '#db2777' },
};

const SKILL_ICONS = { reading: '📖', writing: '✍️', listening: '👂', speaking: '🗣️' };

export default function RoadmapPage() {
  const [levels, setLevels] = useState([]);
  const [levelSummary, setLevelSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [roadmapRes, progressRes] = await Promise.all([
          api.get('/roadmap'),
          api.get('/progress'),
        ]);
        setLevels(roadmapRes.data.levels);
        setLevelSummary(progressRes.data.levelSummary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#4f46e5', fontSize: 16 }}>
        Loading roadmap...
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 780 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 36 }}>🇯🇵</span>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
              Japanese Learning Roadmap
            </h1>
            <p style={{ fontSize: 15, color: '#6b7280' }}>
              From absolute beginner to mastery — covering Reading, Writing, Listening &amp; Speaking
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
          {Object.entries(SKILL_ICONS).map(([skill, icon]) => (
            <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
              <span>{icon}</span>
              <span style={{ textTransform: 'capitalize' }}>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level path */}
      <div style={{ position: 'relative' }}>
        {levels.map((level, idx) => {
          const colors = LEVEL_COLORS[level.code] || LEVEL_COLORS.A1;
          const summary = levelSummary[level.code] || { total: 0, completed: 0, percent: 0 };
          const isLast = idx === levels.length - 1;

          return (
            <div key={level.id} style={{ display: 'flex', gap: 20, marginBottom: isLast ? 0 : 0 }}>
              {/* Timeline column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 48 }}>
                {/* Badge */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: colors.badge, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  boxShadow: `0 0 0 4px ${colors.bg}`,
                  flexShrink: 0,
                  zIndex: 1,
                }}>
                  {level.code}
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div style={{
                    width: 2,
                    flex: 1,
                    minHeight: 32,
                    background: `linear-gradient(to bottom, ${colors.badge}, ${Object.values(LEVEL_COLORS)[idx + 1]?.badge || '#9ca3af'})`,
                    opacity: 0.4,
                    margin: '4px 0',
                  }} />
                )}
              </div>

              {/* Level card */}
              <div
                onClick={() => navigate(`/roadmap/${level.code}`)}
                style={{
                  flex: 1,
                  background: '#fff',
                  border: `1px solid ${colors.border}22`,
                  borderLeft: `4px solid ${colors.border}`,
                  borderRadius: 10,
                  padding: '20px 24px',
                  marginBottom: isLast ? 0 : 20,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s, transform 0.15s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{level.name}</span>
                      {level.jlpt && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px',
                          borderRadius: 999, background: colors.bg, color: colors.text,
                          border: `1px solid ${colors.border}44`,
                        }}>
                          JLPT {level.jlpt}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, maxWidth: 480 }}>
                      {level.description}
                    </p>
                  </div>

                  {/* Kanji count */}
                  {level.kanji_count && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: colors.badge }}>{level.kanji_count}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>kanji target</div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {Object.entries(SKILL_ICONS).map(([skill, icon]) => (
                        <span key={skill} style={{ fontSize: 16, opacity: 0.7 }} title={skill}>{icon}</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: summary.percent === 100 ? '#16a34a' : colors.text }}>
                      {summary.completed}/{summary.total} tasks · {summary.percent}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${summary.percent}%`,
                      background: summary.percent === 100
                        ? '#16a34a'
                        : `linear-gradient(90deg, ${colors.badge}, ${colors.border})`,
                      borderRadius: 999,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: colors.text, fontSize: 13, fontWeight: 600 }}>
                  {summary.percent === 100
                    ? <span>✅ Level complete — click to review</span>
                    : summary.completed > 0
                      ? <span>Continue →</span>
                      : <span>Start {level.code} →</span>
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 40, padding: '16px 20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
        <strong>💡 Tip:</strong> The JLPT (Japanese Language Proficiency Test) is Japan's official proficiency exam. Each level on this roadmap maps to the corresponding JLPT level. Passing N5 → N4 → N3 → N2 → N1 is a concrete way to verify your progress.
      </div>
    </div>
  );
}
