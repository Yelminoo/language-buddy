import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const SKILLS = ['reading', 'writing', 'listening', 'speaking'];
const SKILL_ICONS = { reading: '📖', writing: '✍️', listening: '👂', speaking: '🗣️' };
const SKILL_COLORS = { reading: '#2563eb', writing: '#7c3aed', listening: '#0891b2', speaking: '#16a34a' };

const LEVEL_COLORS = {
  A1: '#16a34a', A2: '#059669',
  B1: '#2563eb', B2: '#0284c7',
  C1: '#7c3aed', C2: '#db2777',
};

const RESOURCE_TYPE_STYLES = {
  app:      { bg: '#e0e7ff', color: '#4338ca', label: 'App' },
  book:     { bg: '#fef9c3', color: '#a16207', label: 'Book' },
  textbook: { bg: '#fef3c7', color: '#b45309', label: 'Textbook' },
  website:  { bg: '#dcfce7', color: '#15803d', label: 'Website' },
  youtube:  { bg: '#fee2e2', color: '#dc2626', label: 'YouTube' },
  podcast:  { bg: '#fce7f3', color: '#be185d', label: 'Podcast' },
  tool:     { bg: '#f0fdf4', color: '#166534', label: 'Tool' },
};

function ProgressRing({ percent, color, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
    </svg>
  );
}

export default function LevelPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [activeSkill, setActiveSkill] = useState('reading');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [levelRes, progressRes] = await Promise.all([
          api.get(`/roadmap/${code}`),
          api.get('/progress'),
        ]);
        setLevel(levelRes.data.level);
        setCompletedItems(new Set(progressRes.data.completedItems));
      } catch (err) {
        if (err.response?.status === 404) navigate('/roadmap');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code, navigate]);

  const toggleItem = useCallback(async (itemId) => {
    if (toggling.has(itemId)) return;
    setToggling(prev => new Set([...prev, itemId]));

    // Optimistic update
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

    try {
      await api.post(`/progress/toggle/${itemId}`);
    } catch (err) {
      // Revert on failure
      setCompletedItems(prev => {
        const next = new Set(prev);
        if (next.has(itemId)) next.delete(itemId);
        else next.add(itemId);
        return next;
      });
      console.error(err);
    } finally {
      setToggling(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }, [toggling]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#4f46e5', fontSize: 16 }}>
        Loading level...
      </div>
    );
  }

  if (!level) return null;

  const accentColor = LEVEL_COLORS[level.code] || '#4f46e5';
  const guide = level.skills[activeSkill];

  // Compute per-skill completion
  const skillStats = {};
  for (const skill of SKILLS) {
    const g = level.skills[skill];
    if (!g) continue;
    const total = g.checklist.length;
    const done = g.checklist.filter(item => completedItems.has(item.id)).length;
    skillStats[skill] = { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  // Overall level completion
  const allItems = SKILLS.flatMap(s => level.skills[s]?.checklist || []);
  const totalItems = allItems.length;
  const doneItems = allItems.filter(item => completedItems.has(item.id)).length;
  const overallPercent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      {/* Back link */}
      <Link to="/roadmap" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#6b7280', marginBottom: 20, textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.style.color = accentColor}
        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
      >
        ← Back to Roadmap
      </Link>

      {/* Level header */}
      <div className="card" style={{
        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
        color: '#fff',
        marginBottom: 24,
        padding: '28px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 6, padding: '4px 12px',
                fontSize: 14, fontWeight: 700,
              }}>
                {level.code}
              </span>
              {level.jlpt && (
                <span style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 6, padding: '4px 10px',
                  fontSize: 13, fontWeight: 600,
                }}>
                  JLPT {level.jlpt}
                </span>
              )}
              {level.kanji_count && (
                <span style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 6, padding: '4px 10px',
                  fontSize: 13,
                }}>
                  {level.kanji_count} kanji
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{level.name}</h1>
            <p style={{ opacity: 0.88, fontSize: 14, maxWidth: 520, lineHeight: 1.6 }}>{level.description}</p>
          </div>
          {/* Overall ring */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <ProgressRing percent={overallPercent} color="rgba(255,255,255,0.9)" size={72} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{overallPercent}%</span>
              </div>
            </div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{doneItems}/{totalItems} tasks</div>
          </div>
        </div>
      </div>

      {/* Skill tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {SKILLS.map(skill => {
          const stats = skillStats[skill] || { percent: 0 };
          const isActive = skill === activeSkill;
          const skillColor = SKILL_COLORS[skill];
          return (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 8, border: 'none',
                background: isActive ? skillColor : '#fff',
                color: isActive ? '#fff' : '#374151',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                boxShadow: isActive ? `0 2px 8px ${skillColor}44` : '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.15s',
                minWidth: 130,
              }}
            >
              <span style={{ fontSize: 17 }}>{SKILL_ICONS[skill]}</span>
              <span style={{ textTransform: 'capitalize', flex: 1, textAlign: 'left' }}>{skill}</span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: isActive ? 'rgba(255,255,255,0.25)' : `${skillColor}18`,
                color: isActive ? '#fff' : skillColor,
                padding: '2px 7px', borderRadius: 999,
              }}>
                {stats.percent}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Skill content */}
      {guide && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Goals */}
          <Section title="Goals" icon="🎯" accentColor={SKILL_COLORS[activeSkill]}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guide.goals.map((goal, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.55 }}>
                  <span style={{ color: SKILL_COLORS[activeSkill], flexShrink: 0, fontWeight: 700, marginTop: 1 }}>→</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Tips */}
          <Section title="Key Tips &amp; Insights" icon="💡" accentColor="#d97706">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guide.tips.map((tip, i) => (
                <div key={i} style={{
                  background: '#fffbeb', border: '1px solid #fde68a',
                  borderRadius: 8, padding: '12px 16px',
                  fontSize: 14, color: '#78350f', lineHeight: 1.55,
                  display: 'flex', gap: 10,
                }}>
                  <span style={{ flexShrink: 0, opacity: 0.7 }}>💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Resources */}
          <Section title="Recommended Resources" icon="🔗" accentColor={SKILL_COLORS[activeSkill]}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {guide.resources.map(resource => {
                const typeStyle = RESOURCE_TYPE_STYLES[resource.type] || RESOURCE_TYPE_STYLES.website;
                return (
                  <div key={resource.id} style={{
                    background: '#fafafa',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#111827', lineHeight: 1.4, flex: 1 }}>
                        {resource.title}
                      </span>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                          background: typeStyle.bg, color: typeStyle.color,
                        }}>
                          {typeStyle.label}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                          background: resource.is_free ? '#dcfce7' : '#fee2e2',
                          color: resource.is_free ? '#15803d' : '#dc2626',
                        }}>
                          {resource.is_free ? 'Free' : 'Paid'}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, flex: 1 }}>
                      {resource.description}
                    </p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 13, fontWeight: 600, color: SKILL_COLORS[activeSkill],
                          textDecoration: 'none', marginTop: 2,
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Open resource ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Checklist */}
          <Section title="Milestone Checklist" icon="✅" accentColor={SKILL_COLORS[activeSkill]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {guide.checklist.map(item => {
                const done = completedItems.has(item.id);
                const isToggling = toggling.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '14px 16px',
                      background: done ? `${SKILL_COLORS[activeSkill]}08` : '#fff',
                      border: `1px solid ${done ? SKILL_COLORS[activeSkill] + '44' : '#e5e7eb'}`,
                      borderRadius: 8,
                      cursor: isToggling ? 'wait' : 'pointer',
                      transition: 'all 0.15s',
                      opacity: isToggling ? 0.7 : 1,
                    }}
                    onMouseEnter={e => !isToggling && (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${done ? SKILL_COLORS[activeSkill] : '#d1d5db'}`,
                      background: done ? SKILL_COLORS[activeSkill] : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {done && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{
                      fontSize: 14, color: done ? '#6b7280' : '#374151',
                      lineHeight: 1.55,
                      textDecoration: done ? 'line-through' : 'none',
                      transition: 'all 0.15s',
                    }}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Skill completion bar */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{activeSkill} progress</span>
                <span style={{ fontWeight: 600, color: SKILL_COLORS[activeSkill] }}>
                  {skillStats[activeSkill]?.done || 0}/{skillStats[activeSkill]?.total || 0} completed
                </span>
              </div>
              <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${skillStats[activeSkill]?.percent || 0}%`,
                  background: SKILL_COLORS[activeSkill],
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          </Section>

          {/* Level navigation */}
          <LevelNav currentCode={level.code} accentColor={accentColor} />
        </div>
      )}
    </div>
  );
}

function Section({ title, icon, accentColor, children }) {
  return (
    <div className="card" style={{ padding: '24px 28px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 18,
        paddingBottom: 14,
        borderBottom: `2px solid ${accentColor}22`,
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_NAMES = { A1: 'Absolute Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Mastery' };

function LevelNav({ currentCode, accentColor }) {
  const navigate = useNavigate();
  const idx = LEVEL_ORDER.indexOf(currentCode);
  const prev = LEVEL_ORDER[idx - 1];
  const next = LEVEL_ORDER[idx + 1];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 12 }}>
      {prev ? (
        <button onClick={() => navigate(`/roadmap/${prev}`)} style={{
          flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
          background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
          transition: 'box-shadow 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>← Previous</span>
          <span>{prev} · {LEVEL_NAMES[prev]}</span>
        </button>
      ) : <div style={{ flex: 1 }} />}

      {next ? (
        <button onClick={() => navigate(`/roadmap/${next}`)} style={{
          flex: 1, padding: '12px 16px', borderRadius: 8, border: `1px solid ${accentColor}44`,
          background: `${accentColor}08`, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: accentColor,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
          transition: 'box-shadow 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Next →</span>
          <span>{next} · {LEVEL_NAMES[next]}</span>
        </button>
      ) : <div style={{ flex: 1 }} />}
    </div>
  );
}
