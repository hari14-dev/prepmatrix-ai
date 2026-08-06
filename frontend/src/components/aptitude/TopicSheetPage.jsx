/**
 * TopicSheetPage.jsx  —  Aptitude Topic Sheet
 *
 * Layout:
 *  ┌── Concept Article (collapsible) ──────────────────────┐
 *  │  Full markdown article — sections collapsed by default │
 *  └───────────────────────────────────────────────────────┘
 *  ┌── Pattern 1 ──────────────────────────────────────────┐
 *  │  Problem cards — click any to go to solving interface  │
 *  └───────────────────────────────────────────────────────┘
 *  ┌── Pattern 2 ──────────────────────────────────────────┐
 *  └───────────────────────────────────────────────────────┘
 *
 * Data: GET /api/aptitude/topic/:slug
 * Returns: { title, conceptArticle, problemsByPattern: [{ name, problems[] }] }
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSetBreadcrumb } from '../../context/BreadcrumbContext.jsx';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Calculator, CheckCircle2 } from 'lucide-react';

const DIFF_COLORS = {
  easy:   'var(--green)',
  medium: 'var(--amber)',
  hard:   'var(--rose)',
};

/** Small progress ring for pattern completion */
function PatternProgress({ solved, total }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  const color = pct === 100 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--indigo)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem', fontWeight: 700, color: 'var(--tx-1)',
        }}>
          {pct}%
        </div>
      </div>
      <span className="t-sm">{solved}/{total}</span>
    </div>
  );
}

/** Collapsible concept article */
function ConceptPanel({ article }) {
  const [open, setOpen] = useState(false);
  if (!article) return null;
  return (
    <div className="card soft-card" style={{ marginBottom: '1.5rem' }}>
      <button
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: 0,
        }}
        onClick={() => setOpen(v => !v)}
      >
        <div className="row gap-sm">
          
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--tx-1)' }}>
              Concept Article
            </p>
            <p className="t-sm">Study this before attempting the problems</p>
          </div>
        </div>
        <span style={{
          fontSize: '1.2rem', color: 'var(--indigo-light)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          flexShrink: 0,
        }}>
          ▾
        </span>
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

/** Single problem card */
function ProblemCard({ problem, topicSlug }) {
  const diff = (problem.difficulty || '').toLowerCase();
  const color = DIFF_COLORS[diff] || 'var(--tx-3)';
  return (
    <Link
      to={`/dashboard/aptitude/solve/${topicSlug}/${problem.id}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--r-md)',
        border: `1px solid ${problem.isSolved ? 'rgba(26,156,107,0.25)' : 'var(--b-1)'}`,
        background: problem.isSolved ? 'rgba(26,156,107,0.04)' : 'rgba(11,15,26,0.4)',
        transition: 'all 0.18s var(--ease)',
        cursor: 'pointer',
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
        {/* Left: solved indicator + title */}
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
            fontSize: '0.9rem', fontWeight: problem.isSolved ? 500 : 600,
            color: problem.isSolved ? 'var(--tx-3)' : 'var(--tx-1)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {problem.title}
          </span>
        </div>

        {/* Right: difficulty + arrow */}
        <div className="row gap-sm" style={{ flexShrink: 0 }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.55rem',
            borderRadius: 'var(--r-full)',
            background: `${color}18`, color,
            border: `1px solid ${color}30`,
          }}>
            {problem.difficulty}
          </span>
          <span style={{ color: 'var(--tx-4)', fontSize: '0.85rem' }}>→</span>
        </div>
      </div>
    </Link>
  );
}

/** Pattern section with header + problem list */
function PatternSection({ pattern, topicSlug }) {
  const [collapsed, setCollapsed] = useState(false);
  const solved = pattern.problems.filter(p => p.isSolved).length;
  const total  = pattern.problems.length;

  return (
    <div className="card soft-card" style={{ marginBottom: '1rem' }}>
      {/* Pattern header */}
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
            width: 32, height: 32, borderRadius: 'var(--r-sm)',
            background: 'var(--indigo-dim)', border: '1px solid rgba(58,92,216,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', flexShrink: 0,
          }}>
            
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--tx-1)' }}>
              {pattern.name}
            </p>
            <p className="t-sm">{total} problem{total !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="row gap-sm">
          <PatternProgress solved={solved} total={total} />
          <span style={{
            fontSize: '1.1rem', color: 'var(--tx-4)',
            transform: collapsed ? 'rotate(-90deg)' : 'none',
            transition: 'transform 0.2s',
          }}>▾</span>
        </div>
      </button>

      {/* Problems */}
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {pattern.problems.map(problem => (
            <ProblemCard key={problem.id} problem={problem} topicSlug={topicSlug} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────

export function TopicSheetPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const [topicData, setTopicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    apiRequest(`/api/aptitude/topic/${slug}`, { token })
      .then(r => setTopicData(r.data))
      .catch(e => setError(e.message || 'Failed to load topic'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const setBreadcrumb = useSetBreadcrumb();
  useEffect(() => {
    if (topicData) {
      setBreadcrumb([
        { label: 'Aptitude', to: '/dashboard/aptitude' },
        { label: topicData.title },
      ]);
    }
    return () => setBreadcrumb([]);
  }, [topicData, setBreadcrumb]);

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;
  if (error) return (
    <div className="card soft-card">
      <p className="error-text">{error}</p>
    </div>
  );
  if (!topicData) return null;

  const patterns   = topicData.problemsByPattern || [];
  const allProbs   = patterns.flatMap(p => p.problems);
  const totalSolved = allProbs.filter(p => p.isSolved).length;
  const totalProbs  = allProbs.length;
  const pct = totalProbs === 0 ? 0 : Math.round((totalSolved / totalProbs) * 100);

  return (
    <div className="animate-in">
      {/* ── Header ── */}
      <div className="page-header-block">
        <div className="breadcrumb-chip">
          <Calculator size={12} strokeWidth={2} />
          <span>Aptitude · {topicData.category}</span>
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

      {/* ── Concept Article (collapsible) ── */}
      <ConceptPanel article={topicData.conceptArticle} />

      {/* ── Pattern Sections ── */}
      {patterns.length === 0 ? (
        <div className="card soft-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <p className="t-sm">No problems available for this topic yet.</p>
        </div>
      ) : (
        patterns.map(pattern => (
          <PatternSection
            key={pattern.name}
            pattern={pattern}
            topicSlug={slug}
          />
        ))
      )}
    </div>
  );
}