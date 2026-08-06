/**
 * ContestsPage.jsx  —  Practice Contest Hub
 *
 * Shows a grid of predefined practice contests.
 * Each card shows: company, difficulty, question count, time limit,
 * and the user's best score if they've attempted it.
 *
 * Clicking "Start" opens the ContestArena.
 */
import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Trophy } from 'lucide-react';
import { ContestArena } from './ContestArena.jsx';

const DIFF_COLOR = {
  Easy:   'var(--green)',
  Medium: 'var(--amber)',
  Hard:   'var(--rose)',
  Mixed:  'var(--violet)',
};

/* Score badge — green/amber/rose based on percentage */
function ScoreBadge({ score, max }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--rose)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.3rem 0.75rem', borderRadius: 'var(--r-full)',
      background: `${color}18`, border: `1px solid ${color}35`,
    }}>
      <span style={{ fontWeight: 800, fontSize: '0.9rem', color }}>
        {score}/{max}
      </span>
      <span style={{ fontSize: '0.75rem', color }}>({pct}%)</span>
    </div>
  );
}

/* Single contest card */
function ContestCard({ contest, onStart }) {
  const diff = DIFF_COLOR[contest.difficulty] || 'var(--tx-3)';
  const canRetry = contest.attempted;

  return (
    <article className="card soft-card feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Top: difficulty badge */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700,
          color: diff, padding: '0.25rem 0.6rem',
          background: `${diff}15`, borderRadius: 'var(--r-full)',
          border: `1px solid ${diff}30`,
        }}>
          {contest.difficulty}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 style={{
          fontWeight: 700, fontSize: '1rem',
          color: 'var(--tx-1)', marginBottom: '0.35rem', lineHeight: 1.3,
        }}>
          {contest.title}
        </h3>
        <p className="t-sm" style={{ lineHeight: 1.6, color: 'var(--tx-3)' }}>
          {contest.description}
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap',
        padding: '0.65rem 0.9rem',
        background: 'rgba(11,15,26,0.5)',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--b-1)',
      }}>
        {[
          { label: 'Questions', value: contest.questionCount },
          { label: 'Time Limit', value: `${contest.timeLimit} min` },
          { label: 'Max Score', value: contest.maxScore },
        ].map(item => (
          <div key={item.label} style={{ flex: 1, minWidth: 60 }}>
            <p className="t-xs">{item.label}</p>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--tx-1)', marginTop: '0.15rem' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Best score */}
      {contest.attempted && contest.bestScore !== null && (
        <div>
          <p className="t-xs" style={{ marginBottom: '0.3rem' }}>Your best score</p>
          <ScoreBadge score={contest.bestScore} max={contest.maxScore} />
        </div>
      )}

      {/* CTA button */}
      <button
        className={`btn ${contest.attempted ? 'btn-secondary' : 'btn-primary btn-glow'}`}
        style={{ width: '100%', marginTop: 'auto' }}
        onClick={() => onStart(contest.id)}
      >
        {canRetry ? '↺ Retry Contest' : '▶ Start Contest'}
      </button>
    </article>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export function ContestsPage() {
  const { token } = useAuth();
  const [contests,  setContests]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState('');
  const [activeId,  setActiveId]  = useState(null); // which contest is open in arena

  const loadContests = () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    apiRequest('/api/contests/list', { token })
      .then(r => setContests(r.data || []))
      .catch(e => setError(e.message || 'Failed to load contests'))
      .finally(() => setIsLoading(false));
  };

  useEffect(loadContests, [token]);

  // If an arena is active, render it instead of the list
  if (activeId) {
    return (
      <ContestArena
        contestId={activeId}
        onExit={() => { setActiveId(null); loadContests(); }}
      />
    );
  }

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;

  const attempted   = contests.filter(c => c.attempted);
  const unattempted = contests.filter(c => !c.attempted);

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="section-header">
        <span className="pill pill-amber" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
          <Trophy size={14} strokeWidth={1.75} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/>Contest Arena
        </span>
        <h1 className="hero-title">Practice Contests</h1>
        <p className="muted-text" style={{ marginTop: '0.4rem', maxWidth: 580 }}>
          Timed placement-style mock tests. Each contest mixes Aptitude,
          Core Subjects, and DSA questions. Scoring: +10 per correct answer.
        </p>
      </div>

      {error && <p className="error-text" style={{ marginBottom: '1rem' }}>{error}</p>}

      {/* Stats bar */}
      {attempted.length > 0 && (
        <div style={{
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
          padding: '0.85rem 1.25rem',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--b-2)',
          borderRadius: 'var(--r-lg)',
          marginBottom: '1.5rem',
        }}>
          {[
            { label: 'Attempted', value: attempted.length, color: 'var(--indigo-light)' },
            { label: 'Remaining', value: unattempted.length, color: 'var(--tx-3)' },
            {
              label: 'Best Score',
              value: `${Math.max(...attempted.map(c => c.bestScore || 0))} pts`,
              color: 'var(--amber)',
            },
          ].map(stat => (
            <div key={stat.label}>
              <p className="t-xs">{stat.label}</p>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', color: stat.color, lineHeight: 1.1 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Unattempted contests */}
      {unattempted.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">Available Contests</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {unattempted.map(c => (
              <ContestCard key={c.id} contest={c} onStart={setActiveId} />
            ))}
          </div>
        </section>
      )}

      {/* Attempted contests */}
      {attempted.length > 0 && (
        <section>
          <h2 className="section-title">Completed Contests</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {attempted.map(c => (
              <ContestCard key={c.id} contest={c} onStart={setActiveId} />
            ))}
          </div>
        </section>
      )}

      {contests.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="t-sm">No contests available.</p>
        </div>
      )}
    </div>
  );
}