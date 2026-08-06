/**
 * DSAHubPage — clean grid, skeleton loading, no circular gauges.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

function slugify(v) {
  return String(v??'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

function PatternCard({ card }) {
  const pct = card.masteryPercentage || 0;
  const accent = pct>=75 ? 'var(--green)' : pct>=40 ? 'var(--amber)' : 'var(--indigo-light)';
  return (
    <Link to={`/dsa/topic/${card.slug}`} className="pattern-card">
      <div className="pattern-card-top">
        <p className="pattern-card-name">{card.pattern}</p>
        <span style={{ fontSize:'0.82rem', fontWeight:800, color:accent, flexShrink:0 }}>{pct}%</span>
      </div>
      <p style={{ fontSize:'0.75rem', color:'var(--tx-4)', marginBottom:'0.7rem' }}>
        {card.solvedCount} / {card.totalCount} solved
      </p>
      <div className="mini-bar-wrap">
        <div className="mini-bar-fill" style={{ width:`${pct}%`, background:accent }} />
      </div>
    </Link>
  );
}

export function DSAHubPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setIsLoading(true); setError('');
    apiRequest('/api/dsa/patterns', { token })
      .then(r => setRows(Array.isArray(r.data) ? r.data : []))
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const cards = useMemo(() => rows.map(r => ({ ...r, slug: slugify(r.pattern) })), [rows]);
  const totalSolved = cards.reduce((s,c)=>s+(c.solvedCount||0),0);
  const totalProbs  = cards.reduce((s,c)=>s+(c.totalCount||0),0);

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div className="page-header-block">
        <div className="breadcrumb-chip"><Code2 size={12} strokeWidth={2} /><span>DSA Module</span></div>
        <h1 className="page-main-title">DSA Hub</h1>
        <p style={{ color:'var(--tx-3)', fontSize:'0.9rem', marginTop:'0.3rem', marginBottom:'0.75rem' }}>
          Pattern-based problem solving. Click any card to open its problem sheet.
        </p>
        {!isLoading && totalProbs>0 && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', flexWrap:'wrap' }}>
            <div className="solved-chip">
              <CheckCircle2 size={12} strokeWidth={2} style={{ color:'var(--green)' }} />
              <span>{totalSolved} / {totalProbs} solved</span>
            </div>
            <div className="mini-bar-wrap" style={{ maxWidth:180 }}>
              <div className="mini-bar-fill" style={{ width:`${Math.round(totalSolved/totalProbs*100)}%` }} />
            </div>
            <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--indigo-light)' }}>
              {Math.round(totalSolved/totalProbs*100)}%
            </span>
          </div>
        )}
      </div>

      {error && <p className="error-text" style={{ marginBottom:'1rem' }}>{error}</p>}

      <div className="pattern-grid">
        {cards.length===0
          ? <p style={{ color:'var(--tx-4)', fontSize:'0.875rem', padding:'2rem 0' }}>No DSA patterns loaded.</p>
          : cards.map(c => <PatternCard key={c.pattern} card={c} />)
        }
      </div>
    </div>
  );
}