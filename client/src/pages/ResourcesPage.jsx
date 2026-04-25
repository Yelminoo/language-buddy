import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = ['Knowledge Base', 'My Plan', 'Discover'];
const SKILLS = ['reading', 'writing', 'listening', 'speaking'];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TYPES  = ['app', 'book', 'textbook', 'website', 'youtube', 'podcast', 'tool'];

const SKILL_ICONS  = { reading: '📖', writing: '✍️', listening: '👂', speaking: '🗣️' };
const SKILL_COLORS = { reading: '#2563eb', writing: '#7c3aed', listening: '#0891b2', speaking: '#16a34a' };
const LEVEL_COLORS = { A1: '#16a34a', A2: '#059669', B1: '#2563eb', B2: '#0284c7', C1: '#7c3aed', C2: '#db2777' };

const TYPE_LABELS  = { app: 'App', book: 'Book', textbook: 'Textbook', website: 'Website', youtube: 'YouTube', podcast: 'Podcast', tool: 'Tool' };
const TYPE_COLORS  = {
  app:      { bg: '#e0e7ff', color: '#4338ca' },
  book:     { bg: '#fef9c3', color: '#a16207' },
  textbook: { bg: '#fef3c7', color: '#b45309' },
  website:  { bg: '#dcfce7', color: '#15803d' },
  youtube:  { bg: '#fee2e2', color: '#dc2626' },
  podcast:  { bg: '#fce7f3', color: '#be185d' },
  tool:     { bg: '#f0fdf4', color: '#166534' },
};

const HOURS_OPTIONS  = ['30 min/day', '1 hr/day', '2 hrs/day', '3+ hrs/day'];
const BUDGET_OPTIONS = ['Free only', 'Some paid OK', 'No limit'];
const GOAL_OPTIONS   = ['JLPT N5', 'JLPT N4', 'JLPT N3', 'JLPT N2', 'JLPT N1', 'Conversational', 'Business Japanese', 'Full Fluency'];
const STYLE_OPTIONS  = ['Visual learner', 'Audio-focused', 'Reading-heavy', 'Balanced mix'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [tab, setTab]             = useState(0);
  const [resources, setResources] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [stats, setStats]         = useState([]);
  const [discovered, setDiscovered] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [roadmap, setRoadmap]     = useState(null);

  // filters
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType,  setFilterType]  = useState('');
  const [freeOnly,    setFreeOnly]    = useState(false);

  // search
  const [searchQ,      setSearchQ]      = useState('');
  const [searchSkill,  setSearchSkill]  = useState('');
  const [searchLevel,  setSearchLevel]  = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching,    setSearching]    = useState(false);
  const [searchError,  setSearchError]  = useState('');

  // preferences
  const [prefs, setPrefs] = useState({ hoursPerDay: '', budget: '', currentLevel: '', targetGoal: '', learningStyle: '' });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved,  setPrefsSaved]  = useState(false);

  // toggling
  const [toggling, setToggling] = useState(new Set());
  const [savingDiscover, setSavingDiscover] = useState(new Set());

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [resRes, statsRes, discRes, roadmapRes] = await Promise.all([
        api.get('/resources'),
        api.get('/resources/stats'),
        api.get('/resources/discovered'),
        api.get('/generate/roadmap'),
      ]);
      setResources(resRes.data.resources);
      setSavedCount(resRes.data.savedCount);
      setStats(statsRes.data.stats);
      setDiscovered(discRes.data.resources);
      const rm = roadmapRes.data.roadmap;
      if (rm) {
        setRoadmap(rm);
        setPrefs(rm.preferences || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filtered resources for Knowledge Base tab
  const filtered = resources.filter(r => {
    if (filterSkill && r.skill !== filterSkill) return false;
    if (filterLevel && r.level_code !== filterLevel) return false;
    if (filterType  && r.type  !== filterType)  return false;
    if (freeOnly    && !r.is_free)               return false;
    return true;
  });

  // Toggle save/unsave a roadmap resource
  const toggleSave = useCallback(async (resource) => {
    if (toggling.has(resource.id)) return;
    setToggling(prev => new Set([...prev, resource.id]));

    const wasSaved = resource.is_saved;
    // optimistic
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, is_saved: !wasSaved } : r));
    setSavedCount(prev => wasSaved ? prev - 1 : prev + 1);

    try {
      if (wasSaved) await api.delete(`/resources/save/${resource.id}`);
      else          await api.post(`/resources/save/${resource.id}`);
    } catch {
      // revert
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, is_saved: wasSaved } : r));
      setSavedCount(prev => wasSaved ? prev + 1 : prev - 1);
    } finally {
      setToggling(prev => { const n = new Set(prev); n.delete(resource.id); return n; });
    }
  }, [toggling]);

  // Brave Search
  async function runSearch(e) {
    e.preventDefault();
    if (!searchQ.trim()) return;
    setSearching(true);
    setSearchError('');
    setSearchResults([]);
    try {
      const params = new URLSearchParams({ q: searchQ });
      if (searchSkill) params.append('skill', searchSkill);
      if (searchLevel) params.append('level', searchLevel);
      const res = await api.get(`/resources/search?${params}`);
      setSearchResults(res.data.results);
      if (res.data.results.length === 0) setSearchError('No results found. Try different keywords.');
    } catch (err) {
      setSearchError(err.response?.data?.error || 'Search failed — check your BRAVE_SEARCH_API_KEY in .env');
    } finally {
      setSearching(false);
    }
  }

  // Save a Brave result to discovered
  async function saveDiscovery(result) {
    if (savingDiscover.has(result.url)) return;
    setSavingDiscover(prev => new Set([...prev, result.url]));
    try {
      await api.post('/resources/discover/save', {
        title: result.title,
        url: result.url,
        description: result.description,
        skill: searchSkill || null,
        level_code: searchLevel || null,
        search_query: searchQ,
      });
      // add to local discovered list
      setDiscovered(prev => [{
        title: result.title, url: result.url, description: result.description,
        skill: searchSkill, level_code: searchLevel,
      }, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingDiscover(prev => { const n = new Set(prev); n.delete(result.url); return n; });
    }
  }

  async function removeDiscovery(id) {
    try {
      await api.delete(`/resources/discover/${id}`);
      setDiscovered(prev => prev.filter(r => r.id !== id));
    } catch (err) { console.error(err); }
  }

  async function savePrefs() {
    setSavingPrefs(true);
    try {
      await api.post('/generate/preferences', prefs);
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 2500);
    } catch (err) { console.error(err); }
    finally { setSavingPrefs(false); }
  }

  // Saved resources grouped by level for My Plan tab
  const savedResources = resources.filter(r => r.is_saved);
  const savedByLevel = LEVELS.reduce((acc, code) => {
    const items = savedResources.filter(r => r.level_code === code);
    if (items.length > 0) acc[code] = items;
    return acc;
  }, {});
  const totalSavedDiscovered = savedResources.length + discovered.length;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#4f46e5', fontSize: 16 }}>
      Loading resources...
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
          🔗 Knowledge Base
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Browse {resources.length} curated Japanese learning resources, build your personal plan, and discover new sources.
        </p>
        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <Chip icon="📚" label={`${resources.length} total resources`} color="#4f46e5" />
          <Chip icon="🔖" label={`${savedCount} saved to plan`} color="#16a34a" />
          <Chip icon="🔍" label={`${discovered.length} discovered`} color="#0891b2" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e5e7eb', marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
            color: tab === i ? '#4f46e5' : '#6b7280',
            borderBottom: tab === i ? '2px solid #4f46e5' : '2px solid transparent',
            marginBottom: -2, transition: 'all 0.15s',
          }}>
            {t === 'Knowledge Base' && '📚 '}
            {t === 'My Plan'        && '🗺️ '}
            {t === 'Discover'       && '🔍 '}
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB 0: Knowledge Base ─────────────────────────────────────── */}
      {tab === 0 && (
        <div>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
            <FilterPill label="All Skills" options={SKILLS} value={filterSkill} onChange={setFilterSkill}
              renderLabel={s => `${SKILL_ICONS[s]} ${s}`} />
            <FilterPill label="All Levels" options={LEVELS} value={filterLevel} onChange={setFilterLevel} />
            <FilterPill label="All Types"  options={TYPES}  value={filterType}  onChange={setFilterType}
              renderLabel={t => TYPE_LABELS[t]} />
            <button onClick={() => setFreeOnly(f => !f)} style={{
              padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: freeOnly ? '#dcfce7' : '#f3f4f6',
              color: freeOnly ? '#15803d' : '#6b7280',
              transition: 'all 0.15s',
            }}>
              {freeOnly ? '✅ Free only' : '💰 Free only'}
            </button>
            {(filterSkill || filterLevel || filterType || freeOnly) && (
              <button onClick={() => { setFilterSkill(''); setFilterLevel(''); setFilterType(''); setFreeOnly(false); }}
                style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#6b7280' }}>
                Clear filters
              </button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9ca3af' }}>
              {filtered.length} of {resources.length}
            </span>
          </div>

          {/* Resource grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {filtered.map(r => (
              <ResourceCard key={r.id} resource={r} onToggle={toggleSave} toggling={toggling.has(r.id)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
              No resources match your filters.
            </div>
          )}
        </div>
      )}

      {/* ── TAB 1: My Plan ────────────────────────────────────────────── */}
      {tab === 1 && (
        <div>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
            <MiniStat icon="🔖" value={savedResources.length} label="Saved resources" color="#4f46e5" />
            <MiniStat icon="🔍" value={discovered.length}     label="Discovered links" color="#0891b2" />
            <MiniStat icon="📊" value={Object.keys(savedByLevel).length} label="Levels covered" color="#16a34a" />
            <MiniStat icon="🎯" value={SKILLS.filter(s => savedResources.some(r => r.skill === s)).length}
              label="Skills covered" color="#d97706" />
          </div>

          {/* Per-level saved resources */}
          {totalSavedDiscovered === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔖</div>
              <p style={{ color: '#6b7280', fontSize: 15 }}>No resources saved yet.</p>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Go to <strong>Knowledge Base</strong> and hit Save on resources you want to follow.</p>
            </div>
          ) : (
            <>
              {Object.entries(savedByLevel).map(([code, items]) => {
                const color = LEVEL_COLORS[code] || '#4f46e5';
                const bySkill = SKILLS.reduce((acc, s) => {
                  const si = items.filter(r => r.skill === s);
                  if (si.length) acc[s] = si;
                  return acc;
                }, {});
                return (
                  <div key={code} style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: '50%', background: color,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>{code}</span>
                      <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>
                        {({ A1: 'Absolute Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Mastery' })[code]}
                      </span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{items.length} resource{items.length > 1 ? 's' : ''}</span>
                    </div>
                    {Object.entries(bySkill).map(([skill, skillItems]) => (
                      <div key={skill} style={{ marginLeft: 46, marginBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: SKILL_COLORS[skill], marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{SKILL_ICONS[skill]}</span>
                          <span style={{ textTransform: 'capitalize' }}>{skill}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {skillItems.map(r => (
                            <div key={r.id} style={{
                              background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                              padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                            }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', marginBottom: 2 }}>{r.title}</div>
                                <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', gap: 8 }}>
                                  <TypeBadge type={r.type} />
                                  <span>{r.is_free ? '✅ Free' : '💰 Paid'}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer"
                                  style={{ fontSize: 12, fontWeight: 600, color: SKILL_COLORS[skill], textDecoration: 'none' }}>Open ↗</a>}
                                <button onClick={() => toggleSave(r)} style={{
                                  fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb',
                                  background: '#fff', cursor: 'pointer', color: '#dc2626', fontWeight: 600,
                                }}>Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Discovered resources */}
              {discovered.length > 0 && (
                <div style={{ marginTop: 8, marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>🔍</span>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Discovered via Search</span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{discovered.length} link{discovered.length > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 30 }}>
                    {discovered.map(r => (
                      <div key={r.id || r.url} style={{
                        background: '#fff', border: '1px solid #e0f2fe', borderRadius: 8,
                        padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', marginBottom: 2 }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', gap: 8 }}>
                            {r.skill && <span style={{ textTransform: 'capitalize' }}>{SKILL_ICONS[r.skill]} {r.skill}</span>}
                            {r.level_code && <span>{r.level_code}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                          <a href={r.url} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, fontWeight: 600, color: '#0891b2', textDecoration: 'none' }}>Open ↗</a>
                          {r.id && <button onClick={() => removeDiscovery(r.id)} style={{
                            fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb',
                            background: '#fff', cursor: 'pointer', color: '#dc2626', fontWeight: 600,
                          }}>Remove</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* AI Roadmap Generation Frame */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe, #fce7f3)',
            border: '1px solid #c4b5fd',
            borderRadius: 12, padding: '28px 28px', marginTop: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#3730a3' }}>AI-Generated Roadmap</h2>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb',
              }}>Claude API — coming soon</span>
            </div>
            <p style={{ fontSize: 14, color: '#4c1d95', marginBottom: 20, lineHeight: 1.6 }}>
              Set your goals below. When you add your <strong>ANTHROPIC_API_KEY</strong> to <code style={{ background: '#ede9fe', padding: '1px 5px', borderRadius: 4 }}>.env</code>,
              Claude will read these preferences and your saved resources to generate a fully personalized Japanese learning roadmap.
            </p>

            {/* Preferences form */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              <PrefSelect label="⏱ Hours per day" options={HOURS_OPTIONS} value={prefs.hoursPerDay}
                onChange={v => setPrefs(p => ({ ...p, hoursPerDay: v }))} />
              <PrefSelect label="💰 Budget" options={BUDGET_OPTIONS} value={prefs.budget}
                onChange={v => setPrefs(p => ({ ...p, budget: v }))} />
              <PrefSelect label="📍 Current level" options={LEVELS} value={prefs.currentLevel}
                onChange={v => setPrefs(p => ({ ...p, currentLevel: v }))} />
              <PrefSelect label="🎯 Target goal" options={GOAL_OPTIONS} value={prefs.targetGoal}
                onChange={v => setPrefs(p => ({ ...p, targetGoal: v }))} />
              <PrefSelect label="🧠 Learning style" options={STYLE_OPTIONS} value={prefs.learningStyle}
                onChange={v => setPrefs(p => ({ ...p, learningStyle: v }))} />
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={savePrefs} disabled={savingPrefs} style={{
                padding: '10px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#7c3aed', color: '#fff', fontWeight: 600, fontSize: 14,
                opacity: savingPrefs ? 0.7 : 1, transition: 'opacity 0.15s',
              }}>
                {savingPrefs ? 'Saving...' : '💾 Save Preferences'}
              </button>
              {prefsSaved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✅ Preferences saved!</span>}

              <button disabled title="Add ANTHROPIC_API_KEY to .env to enable" style={{
                padding: '10px 22px', borderRadius: 8, border: '1px dashed #c4b5fd', cursor: 'not-allowed',
                background: '#f5f3ff', color: '#a78bfa', fontWeight: 600, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                🤖 Generate My Roadmap
                <span style={{ fontSize: 11, background: '#ede9fe', padding: '2px 7px', borderRadius: 999, color: '#7c3aed' }}>
                  Add API key to unlock
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Discover ───────────────────────────────────────────── */}
      {tab === 2 && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
              🔍 Discover New Resources via Brave Search
            </h2>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              Search the web for Japanese learning resources. Save anything useful directly to your plan.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={runSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Search keywords
              </label>
              <input
                value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="e.g. free Japanese podcast, kanji app, shadowing practice..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db',
                  fontSize: 14, background: '#fff', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Skill</label>
              <select value={searchSkill} onChange={e => setSearchSkill(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, background: '#fff', cursor: 'pointer' }}>
                <option value="">All skills</option>
                {SKILLS.map(s => <option key={s} value={s}>{SKILL_ICONS[s]} {s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Level</label>
              <select value={searchLevel} onChange={e => setSearchLevel(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, background: '#fff', cursor: 'pointer' }}>
                <option value="">All levels</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <button type="submit" disabled={searching || !searchQ.trim()} style={{
              padding: '10px 22px', borderRadius: 8, border: 'none', cursor: searching ? 'wait' : 'pointer',
              background: '#4f46e5', color: '#fff', fontWeight: 600, fontSize: 14,
              opacity: (searching || !searchQ.trim()) ? 0.6 : 1, transition: 'opacity 0.15s',
            }}>
              {searching ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </form>

          {searchError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#dc2626' }}>
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
                {searchResults.length} results — click <strong>Save to Plan</strong> to add any to your personal knowledge base.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {searchResults.map((r, i) => {
                  const alreadySaved = discovered.some(d => d.url === r.url);
                  const isSaving = savingDiscover.has(r.url);
                  return (
                    <div key={i} style={{
                      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px',
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          style={{ fontWeight: 700, fontSize: 15, color: '#1d4ed8', textDecoration: 'none', display: 'block', marginBottom: 4 }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                          {r.title}
                        </a>
                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{r.source}</div>
                        {r.description && (
                          <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.55, margin: 0 }}>
                            {r.description.length > 200 ? r.description.slice(0, 200) + '…' : r.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => !alreadySaved && saveDiscovery(r)}
                        disabled={alreadySaved || isSaving}
                        style={{
                          flexShrink: 0,
                          padding: '8px 14px', borderRadius: 8, border: 'none', cursor: alreadySaved ? 'default' : 'pointer',
                          background: alreadySaved ? '#dcfce7' : '#4f46e5',
                          color: alreadySaved ? '#15803d' : '#fff',
                          fontWeight: 600, fontSize: 13,
                          opacity: isSaving ? 0.6 : 1,
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}>
                        {alreadySaved ? '✅ Saved' : isSaving ? 'Saving…' : '+ Save to Plan'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!searching && searchResults.length === 0 && !searchError && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 15, marginBottom: 4 }}>Search for anything Japanese-learning related.</p>
              <p style={{ fontSize: 13 }}>Try: "best free kanji app", "JLPT N3 listening practice", "Japanese grammar podcast"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ResourceCard({ resource: r, onToggle, toggling }) {
  const typeStyle = TYPE_COLORS[r.type] || TYPE_COLORS.website;
  const levelColor = LEVEL_COLORS[r.level_code] || '#4f46e5';
  const skillColor = SKILL_COLORS[r.skill] || '#4f46e5';

  return (
    <div style={{
      background: '#fff', border: `1px solid ${r.is_saved ? '#a5b4fc' : '#e5e7eb'}`,
      borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: r.is_saved ? '0 0 0 2px #e0e7ff' : '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 0.15s',
    }}>
      {/* Top badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: typeStyle.bg, color: typeStyle.color }}>
          {TYPE_LABELS[r.type] || r.type}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${levelColor}18`, color: levelColor }}>
          {r.level_code}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: `${skillColor}12`, color: skillColor }}>
          {SKILL_ICONS[r.skill]} {r.skill}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, marginLeft: 'auto',
          background: r.is_free ? '#dcfce7' : '#fee2e2', color: r.is_free ? '#15803d' : '#dc2626' }}>
          {r.is_free ? 'Free' : 'Paid'}
        </span>
      </div>

      {/* Title + description */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 4 }}>{r.title}</div>
        {r.description && (
          <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
            {r.description.length > 120 ? r.description.slice(0, 120) + '…' : r.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {r.url && (
          <a href={r.url} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 7,
            border: '1px solid #e5e7eb', background: '#fafafa',
            fontSize: 12, fontWeight: 600, color: '#374151', textDecoration: 'none',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}>
            Open ↗
          </a>
        )}
        <button onClick={() => onToggle(r)} disabled={toggling} style={{
          flex: 1, padding: '7px 0', borderRadius: 7, border: 'none', cursor: toggling ? 'wait' : 'pointer',
          background: r.is_saved ? '#e0e7ff' : '#4f46e5',
          color: r.is_saved ? '#4f46e5' : '#fff',
          fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
          opacity: toggling ? 0.7 : 1,
        }}>
          {r.is_saved ? '🔖 Saved' : '+ Save'}
        </button>
      </div>
    </div>
  );
}

function FilterPill({ label, options, value, onChange, renderLabel }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      padding: '6px 12px', borderRadius: 999, border: '1px solid #e5e7eb',
      background: value ? '#e0e7ff' : '#fff',
      color: value ? '#4338ca' : '#6b7280',
      fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none',
    }}>
      <option value="">{label}</option>
      {options.map(o => <option key={o} value={o}>{renderLabel ? renderLabel(o) : o}</option>)}
    </select>
  );
}

function TypeBadge({ type }) {
  const s = TYPE_COLORS[type] || TYPE_COLORS.website;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: s.bg, color: s.color }}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

function Chip({ icon, label, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 14px', borderRadius: 999,
      background: color + '12', color, border: `1px solid ${color}30`,
      fontSize: 13, fontWeight: 600,
    }}>
      <span>{icon}</span><span>{label}</span>
    </div>
  );
}

function MiniStat({ icon, value, label, color }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '18px 12px' }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function PrefSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4c1d95', marginBottom: 6 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '9px 12px', borderRadius: 8,
        border: '1px solid #c4b5fd', background: '#faf5ff', fontSize: 13, cursor: 'pointer', outline: 'none',
        color: value ? '#3730a3' : '#8b5cf6',
      }}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
