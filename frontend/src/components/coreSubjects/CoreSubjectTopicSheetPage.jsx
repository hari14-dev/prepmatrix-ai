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
import { BookOpen, CheckCircle2, Layers, ChevronDown } from 'lucide-react';

const CATEGORY_ACCENT = {
  OS:   'var(--cyan)',
  DBMS: 'var(--amber)',
  CN:   'var(--green)',
  OOPS: 'var(--violet)',
};

const DIFF_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#f43f5e' };

/** Clean progress bar for pattern completion */
function PatternProgress({ solved, total }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ width: 80, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: pct === 100 ? 'var(--green)' : 'var(--indigo-light)', transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: pct === 100 ? 'var(--green)' : 'var(--tx-3)' }}>
        {solved}/{total}
      </span>
    </div>
  );
}

function ConceptPanel({ article }) {
  const [open, setOpen] = useState(false);
  if (!article) return null;
  return (
    <div className="card soft-card" style={{ marginBottom: '1.5rem', borderRadius: 'var(--r-lg)', border: '1px solid var(--b-2)' }}>
      <button
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
        onClick={() => setOpen(v => !v)}
      >
        <div className="row gap-sm" style={{ alignItems: 'center' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--r-md)',
            background: 'var(--indigo-dim)', border: '1px solid var(--b-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <BookOpen size={16} style={{ color: 'var(--indigo-light)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--tx-1)' }}>
              Concept Article & Core Notes
            </p>
            <p className="t-sm" style={{ color: 'var(--tx-4)' }}>Tap to read theory concepts before attempting the MCQs</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          style={{
            color: 'var(--tx-4)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        />
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
          gap: '0.85rem', padding: '0.75rem 1rem',
          borderRadius: 'var(--r-md)',
          border: `1px solid ${problem.isSolved ? 'rgba(16,185,129,0.3)' : 'var(--b-2)'}`,
          background: problem.isSolved ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)',
          transition: 'all 0.18s var(--ease)',
          cursor: 'pointer'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--indigo)';
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = problem.isSolved ? 'rgba(16,185,129,0.3)' : 'var(--b-2)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
            background: problem.isSolved ? 'rgba(16,185,129,0.15)' : 'transparent',
            border: `2px solid ${problem.isSolved ? 'var(--green)' : 'rgba(255,255,255,0.18)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {problem.isSolved && (
              <CheckCircle2 size={13} style={{ color: 'var(--green)' }} />
            )}
          </div>
          <span style={{
            fontWeight: problem.isSolved ? 500 : 600, fontSize: '0.88rem',
            color: problem.isSolved ? 'var(--tx-3)' : 'var(--tx-1)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {problem.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem',
            borderRadius: 'var(--r-sm)', background: `${color}18`, color, border: `1px solid ${color}30`,
            textTransform: 'capitalize'
          }}>
            {problem.difficulty}
          </span>
          <span className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}>Solve →</span>
        </div>
      </div>
    </Link>
  );
}

function PatternSection({ pattern, topicSlug }) {
  const [collapsed, setCollapsed] = useState(false);
  const solved = pattern.problems.filter(p => p.isSolved).length;
  const total  = pattern.problems.length;

  return (
    <div className="card soft-card" style={{ marginBottom: '1.25rem', borderRadius: 'var(--r-lg)', border: '1px solid var(--b-2)' }}>
      <button
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          marginBottom: collapsed ? 0 : '1rem',
        }}
        onClick={() => setCollapsed(v => !v)}
      >
        <div className="row gap-sm" style={{ alignItems: 'center' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--r-md)', flexShrink: 0,
            background: 'var(--indigo-dim)', border: '1px solid var(--b-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={16} style={{ color: 'var(--indigo-light)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--tx-1)' }}>{pattern.name}</p>
            <p className="t-sm" style={{ color: 'var(--tx-4)' }}>{total} MCQ{total !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="row gap-md" style={{ alignItems: 'center' }}>
          <PatternProgress solved={solved} total={total} />
          <ChevronDown
            size={18}
            style={{
              color: 'var(--tx-4)',
              transform: collapsed ? 'rotate(-90deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
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
        <h1 className="page-main-title">{topicData.title}</h1>
        <p style={{ color:'var(--tx-3)', fontSize:'0.9rem', marginTop:'0.25rem' }}>
          Interview concept breakdown & high-yield practice MCQs with detailed explanations.
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
          <div className="solved-chip">
            <CheckCircle2 size={13} strokeWidth={2} style={{ color:'var(--green)' }} />
            <span>{totalSolved} / {totalProbs} completed</span>
          </div>
          <div className="mini-bar-wrap" style={{ maxWidth: 200 }}>
            <div className="mini-bar-fill" style={{ width:`${pct}%` }} />
          </div>
          <span style={{ fontSize:'0.85rem', fontWeight:800, color:'var(--indigo-light)' }}>{pct}%</span>
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