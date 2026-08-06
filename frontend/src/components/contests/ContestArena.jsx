/**
 * ContestArena.jsx  —  Live contest-taking UI
 *
 * Layout:
 *  ┌── Topbar: title | question counter | countdown timer | Submit ──┐
 *  ├── Question panel (left 65%) ──────────────────────────────────── ┤
 *  │   Question text + MCQ options                                    │
 *  ├── Navigator panel (right 35%) ──────────────────────────────────┤
 *  │   Grid of question number buttons (colour: answered/unanswered)  │
 *  │   + module filter chips                                           │
 *  └──────────────────────────────────────────────────────────────────┘
 *
 * After submission → shows ContestResult inline.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ContestResult } from './ContestResult.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/* Countdown timer — returns formatted MM:SS string */
function useCountdown(startedAt, timeLimitMinutes, onExpire) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startedAt || !timeLimitMinutes) return;
    const endTime = new Date(startedAt).getTime() + timeLimitMinutes * 60_000;

    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setRemaining(0);
        onExpire();
        return;
      }
      setRemaining(Math.ceil(diff / 1000));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, timeLimitMinutes, onExpire]);

  if (remaining === null) return '--:--';
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── Main Component ──────────────────────────────────────── */
export function ContestArena({ contestId, onExit }) {
  const { token } = useAuth();

  const [contest,     setContest]     = useState(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState('');
  const [currentIdx,  setCurrentIdx]  = useState(0);
  // answers: Map<questionId, selectedIndex>
  const [answers,     setAnswers]     = useState(new Map());
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [startedAt,   setStartedAt]   = useState(null);
  const [result,      setResult]      = useState(null); // set after submission
  const [showConfirm, setShowConfirm] = useState(false);
  const hasExpiredRef = useRef(false);
  const hasStartedRef = useRef(false); // guards against React Strict Mode double-invoking this effect in dev

  /* Load contest + start attempt */
  useEffect(() => {
    if (!token || !contestId) return;
    if (hasStartedRef.current) return; // already fired for this mount — avoid a duplicate /start call
    hasStartedRef.current = true;

    setIsLoading(true);
    setError('');

    Promise.all([
      apiRequest(`/api/contests/${contestId}`, { token }),
      apiRequest(`/api/contests/${contestId}/start`, { method: 'POST', token }),
    ])
      .then(([contestRes, startRes]) => {
        setContest(contestRes.data);
        setStartedAt(startRes.data.startedAt);

        // Restore any saved answers
        if (Array.isArray(contestRes.data.savedAnswers)) {
          const m = new Map();
          for (const a of contestRes.data.savedAnswers) {
            if (a.selectedAnswerIndex >= 0) m.set(a.questionId, a.selectedAnswerIndex);
          }
          setAnswers(m);
        }
      })
      .catch(e => setError(e.message || 'Failed to load contest'))
      .finally(() => setIsLoading(false));
  }, [contestId, token]);

  /* Submit answers to backend */
  const submitAnswers = useCallback(async (isTimeout = false) => {
    if (!contest || isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirm(false);
    try {
      const payload = contest.questions.map(q => ({
        questionId:          q.id,
        selectedAnswerIndex: answers.get(q.id) ?? -1,
      }));
      const res = await apiRequest(`/api/contests/${contestId}/submit`, {
        method: 'POST', token,
        body: { answers: payload },
      });
      setResult(res.data);
    } catch (e) {
      setError(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [contest, answers, contestId, token, isSubmitting]);

  /* Timer expiry callback */
  const handleExpire = useCallback(() => {
    if (!hasExpiredRef.current) {
      hasExpiredRef.current = true;
      submitAnswers(true);
    }
  }, [submitAnswers]);

  const timeDisplay = useCountdown(startedAt, contest?.timeLimit, handleExpire);

  /* Answer an option */
  const selectOption = (questionId, idx) => {
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(questionId, idx);
      return next;
    });
  };

  /* ── Render ──────────────────────────────────────────── */
  if (isLoading) return <main className="center-screen"><span className="spinner" /></main>;
  if (error && !contest) return (
    <div style={{ padding: '2rem' }}>
      <p className="error-text">{error}</p>
      <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={onExit}>
        ← Back
      </button>
    </div>
  );

  /* Show result screen after submission */
  if (result) {
    return <ContestResult result={result} contestTitle={contest?.title} onExit={onExit} />;
  }

  const questions = contest?.questions || [];
  const current   = questions[currentIdx];
  const answered  = answers.size;
  const total     = questions.length;

  /* Timer colour: green → amber → rose as time runs out */
  const [mStr] = timeDisplay.split(':');
  const mLeft  = parseInt(mStr, 10) || 0;
  const timerColor =
    mLeft <= 5  ? 'var(--rose)' :
    mLeft <= 15 ? 'var(--amber)' :
    'var(--green)';

  const MODULE_COLOR = {
    Aptitude: 'var(--cyan)',
    Core:     'var(--violet)',
    DSA:      'var(--indigo-light)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h))', overflow: 'hidden' }}>

      {/* ── Contest Topbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--b-1)',
        gap: '1rem', flexShrink: 0, flexWrap: 'wrap',
      }}>
        {/* Left: title + progress */}
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--tx-1)' }}>
            {contest?.title}
          </p>
          <p className="t-sm">
            {answered}/{total} answered
            {' · '}
            <span style={{ color: 'var(--indigo-light)' }}>
              Q{currentIdx + 1} of {total}
            </span>
          </p>
        </div>

        {/* Centre: countdown */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: `${timerColor}15`,
          border: `1px solid ${timerColor}35`,
          borderRadius: 'var(--r-full)',
        }}>
          <span style={{ fontSize: '0.8rem', color: timerColor }}>⏱</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '1.15rem',
            fontWeight: 800, color: timerColor, letterSpacing: '0.05em',
          }}>
            {timeDisplay}
          </span>
        </div>

        {/* Right: submit */}
        <div className="row gap-sm">
          <button className="btn btn-outline btn-sm" onClick={onExit}>
            Exit
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : `Submit (${answered}/${total})`}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Question Panel (left) ── */}
        <div style={{
          flex: '1 1 65%', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-page)',
          borderRight: '1px solid var(--b-1)',
        }}>
          {current && (
            <>
              {/* Question scroll area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>

                {/* Question meta */}
                <div className="row wrap gap-sm" style={{ marginBottom: '0.85rem' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em',
                    textTransform: 'uppercase', color: 'var(--indigo-light)',
                    background: 'var(--indigo-dim)', padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--r-full)', border: '1px solid rgba(58,92,216,0.25)',
                  }}>
                    Q{currentIdx + 1}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    color: MODULE_COLOR[current.module] || 'var(--tx-3)',
                    background: `${MODULE_COLOR[current.module] || 'var(--tx-4)'}15`,
                    padding: '0.2rem 0.6rem', borderRadius: 'var(--r-full)',
                    border: `1px solid ${MODULE_COLOR[current.module] || 'var(--b-1)'}30`,
                  }}>
                    {current.module} · {current.topic}
                  </span>
                  <span className={`tag tag-${(current.difficulty || '').toLowerCase()}`}>
                    {current.difficulty}
                  </span>
                </div>

                {/* Question text */}
                <p style={{
                  fontSize: '1.05rem', fontWeight: 600,
                  color: 'var(--tx-1)', lineHeight: 1.7, marginBottom: '1.5rem',
                }}>
                  {current.questionText}
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(current.options || []).map((opt, idx) => {
                    const isSelected = answers.get(current.id) === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectOption(current.id, idx)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
                          padding: '0.9rem 1.1rem',
                          borderRadius: 'var(--r-md)',
                          border: `1.5px solid ${isSelected ? 'var(--indigo)' : 'var(--b-2)'}`,
                          background: isSelected ? 'var(--indigo-dim)' : 'var(--bg-card)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'all 0.15s var(--ease)',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--indigo)';
                            e.currentTarget.style.background = 'var(--indigo-dim)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--b-2)';
                            e.currentTarget.style.background = 'var(--bg-card)';
                          }
                        }}
                      >
                        {/* Letter badge */}
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: 28, height: 28, borderRadius: '50%',
                          background: isSelected ? 'var(--indigo)' : 'rgba(255,255,255,0.07)',
                          fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, marginTop: 1,
                          color: isSelected ? '#fff' : 'var(--tx-3)',
                        }}>
                          {LETTERS[idx]}
                        </span>
                        <span style={{
                          fontSize: '0.9375rem', lineHeight: 1.6,
                          color: isSelected ? 'var(--tx-1)' : 'var(--tx-2)',
                          fontWeight: isSelected ? 500 : 400,
                        }}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question navigation footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1.75rem',
                borderTop: '1px solid var(--b-1)',
                background: 'var(--bg-card)',
                gap: '0.75rem', flexShrink: 0,
              }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(i => i - 1)}
                >
                  ← Previous
                </button>
                <span className="t-sm">
                  {answers.has(current.id)
                    ? <span style={{ color: 'var(--green)', fontSize:'0.8rem', fontWeight:600 }}>Answered</span>
                    : <span style={{ color: 'var(--tx-4)' }}>Not answered</span>}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx(i => i + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Navigator Panel (right) ── */}
        <div style={{
          flex: '0 0 240px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)',
        }}>
          <div style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid var(--b-1)',
            flexShrink: 0,
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--tx-1)' }}>
              Question Navigator
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Current',  color: 'var(--indigo)' },
                { label: 'Answered', color: 'var(--green)' },
                { label: 'Skipped',  color: 'var(--b-2)' },
              ].map(l => (
                <div key={l.label} className="row gap-sm">
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                  <span className="t-xs">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem' }}>
            {/* Module breakdown */}
            {['Aptitude', 'Core', 'DSA'].map(mod => {
              const modQs = questions.filter(q => q.module === mod);
              if (modQs.length === 0) return null;
              return (
                <div key={mod} style={{ marginBottom: '1rem' }}>
                  <p style={{
                    fontSize: '0.68rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: MODULE_COLOR[mod] || 'var(--tx-4)',
                    marginBottom: '0.5rem',
                  }}>
                    {mod} ({modQs.filter(q => answers.has(q.id)).length}/{modQs.length})
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {modQs.map((q) => {
                      const realIdx = questions.indexOf(q);
                      const isCurrent  = realIdx === currentIdx;
                      const isAnswered = answers.has(q.id);
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIdx(realIdx)}
                          style={{
                            width: 34, height: 34,
                            borderRadius: 'var(--r-sm)',
                            border: `1.5px solid ${
                              isCurrent  ? 'var(--indigo)' :
                              isAnswered ? 'var(--green)' :
                              'var(--b-2)'
                            }`,
                            background:
                              isCurrent  ? 'var(--indigo)' :
                              isAnswered ? 'var(--green-dim)' :
                              'var(--bg-elevated)',
                            color:
                              isCurrent  ? '#fff' :
                              isAnswered ? 'var(--green)' :
                              'var(--tx-3)',
                            fontSize: '0.78rem', fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {realIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div style={{
            padding: '0.85rem 1rem',
            borderTop: '1px solid var(--b-1)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="t-sm">Answered</span>
              <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: '0.875rem' }}>
                {answered}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="t-sm">Unanswered</span>
              <span style={{ fontWeight: 700, color: 'var(--tx-3)', fontSize: '0.875rem' }}>
                {total - answered}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Submit Modal ── */}
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="modal-title">Submit Contest?</p>
            <p className="t-body" style={{ color: 'var(--tx-3)' }}>
              You have answered <strong style={{ color: 'var(--tx-1)' }}>{answered}</strong> out of{' '}
              <strong style={{ color: 'var(--tx-1)' }}>{total}</strong> questions.
              {answered < total && (
                <span style={{ color: 'var(--amber)' }}>
                  {' '}{total - answered} question{total - answered !== 1 ? 's' : ''} unanswered
                  will be scored as wrong.
                </span>
              )}
            </p>
            <p className="t-sm">This action cannot be undone.</p>
            <div className="row gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>
                Go Back
              </button>
              <button className="btn btn-primary" onClick={() => submitAnswers(false)} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// expose for ContestArena internal use
const MODULE_COLOR = {
  Aptitude: 'var(--cyan)',
  Core:     'var(--violet)',
  DSA:      'var(--indigo-light)',
};