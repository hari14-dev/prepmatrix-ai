/**
 * DSA TopicSheetPage — clean rewrite with lucide icons, no emojis,
 * proper loading skeleton (no "topic not found" flash), fixed notes modal.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Code2, CheckCircle2, StickyNote, Plus } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSetBreadcrumb } from '../../context/BreadcrumbContext.jsx';

const DIFF = {
  easy:   { label: 'Easy',   color: 'var(--green)'  },
  medium: { label: 'Medium', color: 'var(--amber)'  },
  hard:   { label: 'Hard',   color: 'var(--rose)'   },
};

function SolvedDot({ solved }) {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
      border: `2px solid ${solved ? 'var(--green)' : 'rgba(255,255,255,0.15)'}`,
      background: solved ? 'rgba(26,156,107,0.15)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {solved && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.2 5.5L8 1" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

  const problems = topicData.problems || [];
  const solved   = problems.filter(p => p.isSolved).length;
  const pct      = problems.length > 0 ? Math.round((solved/problems.length)*100) : 0;

  return (
    <div className="animate-in">
      {/* ── Header ── */}
      <div className="page-header-block">
        <div className="breadcrumb-chip">
          <Code2 size={12} strokeWidth={2} />
          <span>DSA · {topicData.title}</span>
        </div>
        <h1 className="page-main-title">{topicData.title}</h1>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.6rem', flexWrap:'wrap' }}>
          <div className="solved-chip">
            <CheckCircle2 size={13} strokeWidth={2} style={{ color: solved===problems.length && problems.length>0 ? 'var(--green)' : 'var(--tx-4)' }} />
            <span>{solved} / {problems.length} solved</span>
          </div>
          <div className="mini-bar-wrap">
            <div className="mini-bar-fill" style={{ width:`${pct}%` }} />
          </div>
          <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--indigo-light)' }}>{pct}%</span>
          <Link className="btn btn-secondary btn-sm" to={`/dsa/concepts/${slug}`} style={{ marginLeft:'auto' }}>
            Study Concepts
          </Link>
        </div>
      </div>

      {/* ── Problem Table ── */}
      <article className="card soft-card" style={{ padding:0, overflow:'hidden' }}>
        <table className="sp3-table">
          <colgroup>
            <col style={{ width:48 }} />
            <col />
            <col style={{ width:100 }} />
            <col style={{ width:56 }} />
            <col style={{ width:100 }} />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>Problem</th>
              <th>Difficulty</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--tx-4)', fontSize:'0.875rem' }}>
                No problems available for this topic yet.
              </td></tr>
            ) : problems.map(problem => {
              const dk = (problem.difficulty||'').toLowerCase();
              const d  = DIFF[dk] || { label: problem.difficulty, color:'var(--tx-3)' };
              return (
                <tr key={problem.id} className={problem.isSolved ? 'row-solved' : ''}>
                  <td style={{ textAlign:'center' }}>
                    <SolvedDot solved={Boolean(problem.isSolved)} />
                  </td>
                  <td>
                    <Link className="table-problem-link" to={`/dsa/problem/${encodeURIComponent(problem.slug)}`}>
                      {problem.title}
                    </Link>
                  </td>
                  <td>
                    <span className="diff-badge" style={{ color:d.color, background:`${d.color}15`, border:`1px solid ${d.color}30` }}>
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
                        ? <StickyNote size={13} strokeWidth={1.75} />
                        : <Plus size={13} strokeWidth={2} />}
                    </button>
                  </td>
                  <td>
                    <Link className="btn btn-primary btn-sm" to={`/dsa/problem/${encodeURIComponent(problem.slug)}`}>
                      Solve →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </article>

      {/* ── Note modal ── */}
      {noteProblemId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="modal-title">Note — {problemMap.get(noteProblemId)?.title}</p>
            <p className="t-sm" style={{ marginBottom:'0.75rem' }}>
              Write your approach, edge cases, or key observations.
            </p>
            <textarea
              className="textarea" rows={7}
              placeholder="E.g. Use sliding window of size k. Edge case: empty array…"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
            {noteError && <p className="error-text" style={{ marginTop:'0.5rem' }}>{noteError}</p>}
            <div className="row gap-sm" style={{ marginTop:'0.75rem' }}>
              <button className="btn btn-primary" onClick={saveNote} type="button" disabled={noteSaving}>
                {noteSaving ? 'Saving…' : 'Save Note'}
              </button>
              <button className="btn btn-outline" onClick={() => { setNoteProblemId(''); setNoteError(''); }} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}