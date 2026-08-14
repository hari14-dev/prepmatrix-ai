/**
 * DSA TopicSheetPage — clean rewrite with lucide icons, no emojis,
 * proper loading skeleton (no "topic not found" flash), fixed notes modal.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Code2, CheckCircle2, StickyNote, Plus, Search, RotateCcw } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSetBreadcrumb } from '../../context/BreadcrumbContext.jsx';

const DIFF = {
  easy:   { label: 'Easy',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  hard:   { label: 'Hard',   color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
};

function SolvedDot({ solved }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      border: `2px solid ${solved ? 'var(--green)' : 'rgba(255,255,255,0.18)'}`,
      background: solved ? 'rgba(16,185,129,0.15)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {solved && (
        <svg width="10" height="8" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.2 5.5L8 1" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

export function TopicSheetPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const [topicData,     setTopicData]     = useState(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState('');
  const [noteProblemId, setNoteProblemId] = useState('');
  const [noteText,      setNoteText]      = useState('');
  const [noteSaving,    setNoteSaving]    = useState(false);
  const [noteError,     setNoteError]     = useState('');

  // Search & Filter state for best UX
  const [searchQuery,  setSearchQuery]  = useState('');
  const [diffFilter,   setDiffFilter]   = useState('all');   // 'all'|'easy'|'medium'|'hard'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all'|'solved'|'unsolved'

  const fetchTopic = async () => {
    const r = await apiRequest(`/api/dsa/topic/${slug}`, { token });
    setTopicData(r.data);
  };

  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true); setError('');
    fetchTopic()
      .catch(e => setError(e.message || 'Failed to load topic'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const setBreadcrumb = useSetBreadcrumb();
  useEffect(() => {
    if (topicData) {
      setBreadcrumb([
        { label: 'DSA', to: '/dsa' },
        { label: topicData.title },
      ]);
    }
    return () => setBreadcrumb([]);
  }, [topicData, setBreadcrumb]);

  const problemMap = useMemo(() => {
    const m = new Map();
    for (const p of topicData?.problems || []) m.set(p.id, p);
    return m;
  }, [topicData]);

  const openNote = id => {
    setNoteProblemId(id);
    setNoteText(problemMap.get(id)?.personalNote || '');
    setNoteError('');
  };

  const saveNote = async () => {
    if (!noteProblemId) return;
    setNoteSaving(true); setNoteError('');
    try {
      await apiRequest('/api/dsa/update-note', {
        method: 'PATCH', token,
        body: { problemId: noteProblemId, personalNote: noteText }
      });
      await fetchTopic();
      setNoteProblemId(''); setNoteText('');
    } catch (e) {
      setNoteError(e.message || 'Failed to save note');
    } finally {
      setNoteSaving(false);
    }
  };

  // Filtered problems list
  const problems = topicData?.problems || [];
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // Title search
      if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Difficulty filter
      if (diffFilter !== 'all' && (p.difficulty || '').toLowerCase() !== diffFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'solved' && !p.isSolved) return false;
      if (statusFilter === 'unsolved' && p.isSolved) return false;
      return true;
    });
  }, [problems, searchQuery, diffFilter, statusFilter]);

  /* ── Spinner while loading ── */
  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;

  if (error) return (
    <div className="card soft-card">
      <p className="error-text">{error}</p>
      <button className="btn btn-secondary btn-sm" style={{ marginTop:'0.75rem' }}
        onClick={() => { setIsLoading(true); setError(''); fetchTopic().catch(e=>setError(e.message)).finally(()=>setIsLoading(false)); }}>
        Retry
      </button>
    </div>
  );

  if (!topicData) return null;

  const solved = problems.filter(p => p.isSolved).length;
  const pct    = problems.length > 0 ? Math.round((solved/problems.length)*100) : 0;

  return (
    <div className="animate-in">
      {/* ── Header ── */}
      <div className="page-header-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-main-title">{topicData.title}</h1>
            <p style={{ color:'var(--tx-3)', fontSize:'0.9rem', marginTop:'0.25rem' }}>
              Practice pattern-based problems with real test cases & AI guidance.
            </p>
          </div>
          <Link className="btn btn-secondary btn-sm" to={`/dsa/concepts/${slug}`}>
            Study Concepts
          </Link>
        </div>

        {/* Stats & Progress */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.85rem', flexWrap:'wrap' }}>
          <div className="solved-chip">
            <CheckCircle2 size={13} strokeWidth={2} style={{ color: solved===problems.length && problems.length>0 ? 'var(--green)' : 'var(--tx-4)' }} />
            <span>{solved} / {problems.length} solved</span>
          </div>
          <div className="mini-bar-wrap" style={{ maxWidth: 220 }}>
            <div className="mini-bar-fill" style={{ width:`${pct}%` }} />
          </div>
          <span style={{ fontSize:'0.85rem', fontWeight:800, color:'var(--indigo-light)' }}>{pct}%</span>
        </div>
      </div>

      {/* ── Search & Filter Control Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem',
        padding: '0.85rem 1.15rem', background: 'var(--bg-elevated)', border: '1px solid var(--b-2)',
        borderRadius: 'var(--r-lg)', marginBottom: '1.25rem'
      }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', border: '1px solid var(--b-2)', borderRadius: 'var(--r-md)', padding: '0.4rem 0.75rem', minWidth: 260, flex: 1 }}>
          <Search size={15} style={{ color: 'var(--tx-4)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search problems by title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              background: 'transparent',
              padding: 0,
              fontSize: '0.85rem',
              color: 'var(--tx-1)',
              width: '100%'
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tx-4)', marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Difficulty:</span>
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              style={{
                padding: '0.3rem 0.65rem', borderRadius: 'var(--r-sm)', fontSize: '0.78rem', fontWeight: 600,
                border: diffFilter === d ? '1px solid var(--indigo)' : '1px solid var(--b-2)',
                background: diffFilter === d ? 'var(--indigo-dim)' : 'transparent',
                color: diffFilter === d ? 'var(--indigo-light)' : 'var(--tx-3)',
                cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tx-4)', marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status:</span>
          {['all', 'solved', 'unsolved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '0.3rem 0.65rem', borderRadius: 'var(--r-sm)', fontSize: '0.78rem', fontWeight: 600,
                border: statusFilter === s ? '1px solid var(--indigo)' : '1px solid var(--b-2)',
                background: statusFilter === s ? 'var(--indigo-dim)' : 'transparent',
                color: statusFilter === s ? 'var(--indigo-light)' : 'var(--tx-3)',
                cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Reset Filters button */}
        {(searchQuery || diffFilter !== 'all' || statusFilter !== 'all') && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setDiffFilter('all'); setStatusFilter('all'); }}
            style={{ fontSize: '0.78rem', gap: '0.3rem' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* ── Problem Table ── */}
      <article className="card soft-card" style={{ padding:0, overflow:'hidden', borderRadius: 'var(--r-lg)', border: '1px solid var(--b-2)' }}>
        <table className="prepmatrix-table">
          <colgroup>
            <col style={{ width: 54 }} />
            <col />
            <col style={{ width: 110 }} />
            <col style={{ width: 64 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'rgba(11,15,26,0.6)' }}>
              <th style={{ textAlign:'center' }}>Status</th>
              <th>Problem Title</th>
              <th>Difficulty</th>
              <th style={{ textAlign:'center' }}>Notes</th>
              <th style={{ textAlign:'right', paddingRight: '1.25rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign:'center', padding:'2.5rem', color:'var(--tx-4)', fontSize:'0.875rem' }}>
                  {problems.length === 0 ? 'No problems available for this topic yet.' : 'No problems match your current search or filter criteria.'}
                </td>
              </tr>
            ) : filteredProblems.map(problem => {
              const dk = (problem.difficulty||'').toLowerCase();
              const d  = DIFF[dk] || { label: problem.difficulty, color:'var(--tx-3)', bg: 'transparent' };
              return (
                <tr key={problem.id} className={problem.isSolved ? 'row-solved' : ''}>
                  <td style={{ textAlign:'center' }}>
                    <SolvedDot solved={Boolean(problem.isSolved)} />
                  </td>
                  <td>
                    <Link className="table-problem-link" to={`/dsa/problem/${encodeURIComponent(problem.slug)}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {problem.title}
                    </Link>
                  </td>
                  <td>
                    <span className="diff-badge" style={{ color: d.color, background: d.bg, border: `1px solid ${d.color}35`, fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--r-sm)' }}>
                      {d.label}
                    </span>
                  </td>
                  <td style={{ textAlign:'center' }}>
                    <button
                      className={`note-btn ${problem.personalNote ? 'note-btn--has' : ''}`}
                      onClick={() => openNote(problem.id)}
                      title={problem.personalNote ? 'Edit note' : 'Add note'}
                      type="button"
                    >
                      {problem.personalNote
                        ? <StickyNote size={14} strokeWidth={1.75} style={{ color: 'var(--indigo-light)' }} />
                        : <Plus size={14} strokeWidth={2} />}
                    </button>
                  </td>
                  <td style={{ textAlign:'right', paddingRight: '1.25rem' }}>
                    <Link className="btn btn-primary btn-sm" to={`/dsa/problem/${encodeURIComponent(problem.slug)}`} style={{ fontSize: '0.8rem' }}>
                      Solve →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </article>

      {/* ── Note Modal ── */}
      {noteProblemId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="modal-title">Note — {problemMap.get(noteProblemId)?.title}</p>
            <p className="t-sm" style={{ marginBottom:'0.75rem', color: 'var(--tx-3)' }}>
              Write your approach, edge cases, or key observations.
            </p>
            <textarea
              className="textarea" rows={7}
              placeholder="E.g. Use sliding window of size k. Edge case: empty array…"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
            {noteError && <p className="error-text" style={{ marginTop:'0.5rem' }}>{noteError}</p>}
            <div className="row end gap-sm" style={{ marginTop:'0.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setNoteProblemId('')}
                disabled={noteSaving}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={saveNote}
                disabled={noteSaving}
              >
                {noteSaving ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}