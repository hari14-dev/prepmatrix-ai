/**
 * CoreSubjectTopicSheetPage.jsx
 * Same layout as Aptitude TopicSheetPage:
 *  - Collapsible concept article at top
 *  - Pattern-grouped problem cards below
 *
 * GET /api/core-subjects/topic/:slug
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSetBreadcrumb } from '../../context/BreadcrumbContext.jsx';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const CATEGORY_ACCENT = {
  OS:   'var(--cyan)',
  DBMS: 'var(--amber)',
  CN:   'var(--green)',
  OOPS: 'var(--violet)',
};

const DIFF_COLORS = { easy: 'var(--green)', medium: 'var(--amber)', hard: 'var(--rose)' };

function ConceptPanel({ article }) {
  const [open, setOpen] = useState(false);
  if (!article) return null;
  return (
    <div className="card soft-card" style={{ marginBottom: '1.5rem' }}>
      <button
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
        onClick={() => setOpen(v => !v)}
      >
        <div className="row gap-sm">
          
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--tx-1)' }}>
              Concept Article
            </p>
            <p className="t-sm">Tap to read before attempting the MCQs</p>
          </div>
        </div>
        <span style={{
          fontSize: '1.2rem', color: 'var(--indigo-light)',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0,
        }}>▾</span>
      </button>

      {open && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--b-1)' }}>
          <div className="concept-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function ProblemCard({ problem, topicSlug }) {
  const diff = (problem.difficulty || '').toLowerCase();
  const color = DIFF_COLORS[diff] || 'var(--tx-3)';
  return (
    <Link to={`/dashboard/core/solve/${topicSlug}/${problem.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.75rem', padding: '0.85rem 1rem',
          borderRadius: 'var(--r-md)',
          border: `1px solid ${problem.isSolved ? 'rgba(26,156,107,0.25)' : 'var(--b-1)'}`,
          background: problem.isSolved ? 'rgba(26,156,107,0.04)' : 'rgba(11,15,26,0.4)',
          transition: 'all 0.18s var(--ease)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--indigo)';
          e.currentTarget.style.background = 'var(--indigo-dim)';
          e.currentTarget.style.transform = 'translateX(3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = problem.isSolved ? 'rgba(26,156,107,0.25)' : 'var(--b-1)';
          e.currentTarget.style.background = problem.isSolved ? 'rgba(26,156,107,0.04)' : 'rgba(11,15,26,0.4)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <div className="row gap-sm" style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
            background: problem.isSolved ? 'var(--green)' : 'var(--bg-elevated)',
            border: `1.5px solid ${problem.isSolved ? 'var(--green)' : 'var(--b-2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', color: '#fff',
          }}>
            {problem.isSolved ? (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" style={{marginRight:'0.35rem',flexShrink:0}}>
                            <path d="M1 4.5L4 7.5L10 1" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : null}
          </div>
          <span style={{
            fontWeight: problem.isSolved ? 500 : 600, fontSize: '0.9rem',
            color: problem.isSolved ? 'var(--tx-3)' : 'var(--tx-1)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {problem.title}
          </span>
        </div>
        <div className="row gap-sm" style={{ flexShrink: 0 }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.55rem',
            borderRadius: 'var(--r-full)', background: `${color}18`, color, border: `1px solid ${color}30`,
          }}>
            {problem.difficulty}
          </span>
          <span style={{ color: 'var(--tx-4)', fontSize: '0.85rem' }}>→</span>
        </div>
      </div>
    </Link>
  );
}

function PatternSection({ pattern, topicSlug }) {
  const [collapsed, setCollapsed] = useState(false);
  const solved = pattern.problems.filter(p => p.isSolved).length;
  const total  = pattern.problems.length;
  const pct    = total === 0 ? 0 : Math.round((solved / total) * 100);

  return (
    <div className="card soft-card" style={{ marginBottom: '1rem' }}>
      <button
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          marginBottom: collapsed ? 0 : '1rem',
        }}
        onClick={() => setCollapsed(v => !v)}
      >
        <div className="row gap-sm">
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--r-sm)', flexShrink: 0,
            background: 'var(--indigo-dim)', border: '1px solid rgba(58,92,216,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
          }}>
            
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--tx-1)' }}>{pattern.name}</p>
            <p className="t-sm">{total} MCQ{total !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="row gap-sm">
          <span style={{
            fontSize: '0.8rem', fontWeight: 700,
            color: pct === 100 ? 'var(--green)' : 'var(--tx-3)',
          }}>
            {solved}/{total}
          </span>
          <span style={{
            fontSize: '1.1rem', color: 'var(--tx-4)',
            transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s',
          }}>▾</span>
        </div>
      </button>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {pattern.problems.map(p => (
            <ProblemCard key={p.id} problem={p} topicSlug={topicSlug} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CoreSubjectTopicSheetPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const [topicData, setTopicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    apiRequest(`/api/core-subjects/topic/${slug}`, { token })
      .then(r => setTopicData(r.data))
      .catch(e => setError(e.message || 'Failed to load topic'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const setBreadcrumb = useSetBreadcrumb();
  useEffect(() => {
    if (topicData) {
      setBreadcrumb([
        { label: 'Core Subjects', to: '/dashboard/core' },
        { label: topicData.title },
      ]);
    }
    return () => setBreadcrumb([]);
  }, [topicData, setBreadcrumb]);

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;
  if (error) return (<div className="card soft-card"><p className="error-text">{error}</p></div>);
  if (!topicData) return null;

  const patterns    = topicData.problemsByPattern || [];
  const allProbs    = patterns.flatMap(p => p.problems);
  const totalSolved = allProbs.filter(p => p.isSolved).length;
  const totalProbs  = allProbs.length;
  const pct = totalProbs === 0 ? 0 : Math.round((totalSolved / totalProbs) * 100);
  const accent = CATEGORY_ACCENT[topicData.category] || 'var(--indigo)';

  return (
    <div className="animate-in">
      <div className="page-header-block">
        <div className="breadcrumb-chip">
          <BookOpen size={12} strokeWidth={2} />
          <span>Core · {topicData.category}</span>
        </div>
        <h1 className="page-main-title">{topicData.title}</h1>
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginTop:'0.6rem', flexWrap:'wrap' }}>
          <div className="solved-chip">
            <CheckCircle2 size={12} strokeWidth={2} style={{ color:'var(--green)' }} />
            <span>{totalSolved} / {totalProbs} solved</span>
          </div>
          <div className="mini-bar-wrap" style={{ maxWidth:180 }}>
            <div className="mini-bar-fill" style={{ width:`${pct}%` }} />
          </div>
          <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--indigo-light)' }}>{pct}%</span>
        </div>
      </div>

      <ConceptPanel article={topicData.conceptArticle} />

      {patterns.length === 0 ? (
        <div className="card soft-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <p className="t-sm">No problems available yet.</p>
        </div>
      ) : (
        patterns.map(pattern => (
          <PatternSection key={pattern.name} pattern={pattern} topicSlug={slug} />
        ))
      )}
    </div>
  );
}