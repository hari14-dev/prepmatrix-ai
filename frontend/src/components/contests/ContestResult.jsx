import { Trophy, TrendingUp, BookOpen, CheckCircle2 } from 'lucide-react';
/**
 * ContestResult.jsx  —  Post-submission result screen
 *
 * Shows:
 *  1. Score card (big number, percentage, grade badge)
 *  2. Module-wise breakdown (Aptitude / Core / DSA)
 *  3. Question-by-question review with correct answer + explanation
 */
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const MODULE_COLOR = {
  Aptitude: 'var(--cyan)',
  Core:     'var(--violet)',
  DSA:      'var(--indigo-light)',
};

/* Grade based on percentage */
function getGrade(pct) {
  if (pct >= 90) return { label: 'Excellent',  color: 'var(--green)',  emoji: <Trophy size={20} strokeWidth={1.75}/> };
  if (pct >= 75) return { label: 'Good',        color: 'var(--green)',  emoji: <CheckCircle2 size={20} strokeWidth={1.75}/> };
  if (pct >= 60) return { label: 'Average',     color: 'var(--amber)',  emoji: <TrendingUp size={20} strokeWidth={1.75}/> };
  if (pct >= 40) return { label: 'Below Avg',   color: 'var(--amber)',  emoji: null };
  return              { label: 'Needs Work',    color: 'var(--rose)',   emoji: <BookOpen size={20} strokeWidth={1.75}/> };
}

/* Single reviewed question block */
function ReviewQuestion({ q, index }) {
  const isCorrect = q.isCorrect;
  const modColor  = MODULE_COLOR[q.module] || 'var(--tx-3)';

  return (
    <div style={{
      border: `1px solid ${isCorrect ? 'rgba(26,156,107,0.25)' : 'rgba(209,73,91,0.25)'}`,
      borderRadius: 'var(--r-lg)',
      background: isCorrect ? 'rgba(26,156,107,0.03)' : 'rgba(209,73,91,0.03)',
      padding: '1.25rem 1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.85rem',
    }}>
      {/* Meta row */}
      <div className="row wrap gap-sm">
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem',
          background: `${modColor}18`, color: modColor,
          border: `1px solid ${modColor}30`, borderRadius: 'var(--r-full)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {q.module} · {q.topic}
        </span>
        <span className={`tag tag-${(q.difficulty || '').toLowerCase()}`}>{q.difficulty}</span>
        <span style={{
          marginLeft: 'auto', fontWeight: 700, fontSize: '0.9rem',
          color: isCorrect ? 'var(--green)' : 'var(--rose)',
        }}>
          {isCorrect ? '+10' : '0'}
        </span>
      </div>

      {/* Question text */}
      <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tx-1)', lineHeight: 1.65 }}>
        {index + 1}. {q.questionText}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {(q.options || []).map((opt, idx) => {
          const isCorrectOpt  = idx === q.correctAnswerIndex;
          const isUserAnswer  = idx === q.selectedAnswerIndex;
          const isWrongAnswer = isUserAnswer && !isCorrectOpt;

          let borderColor = 'var(--b-1)';
          let bgColor     = 'rgba(11,15,26,0.4)';
          let textColor   = 'var(--tx-3)';

          if (isCorrectOpt)  { borderColor = 'rgba(26,156,107,0.45)'; bgColor = 'var(--green-dim)';  textColor = 'var(--green)'; }
          if (isWrongAnswer) { borderColor = 'rgba(209,73,91,0.45)';  bgColor = 'var(--rose-dim)';   textColor = 'var(--rose)'; }

          return (
            <div key={idx} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              padding: '0.6rem 0.9rem',
              borderRadius: 'var(--r-sm)',
              border: `1px solid ${borderColor}`,
              background: bgColor,
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 22, height: 22, borderRadius: '50%',
                background: isCorrectOpt ? 'var(--green)' : isWrongAnswer ? 'var(--rose)' : 'rgba(255,255,255,0.07)',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {LETTERS[idx]}
              </span>
              <span style={{ fontSize: '0.875rem', color: textColor, lineHeight: 1.55 }}>
                {opt}
                {isCorrectOpt && <span style={{ marginLeft: '0.5rem', fontWeight: 700 }}>← Correct</span>}
                {isWrongAnswer && <span style={{ marginLeft: '0.5rem', fontWeight: 700 }}>← Your answer</span>}
                {isUserAnswer && isCorrectOpt && q.selectedAnswerIndex >= 0 && (
                  <span style={{ marginLeft: '0.5rem', fontWeight: 700 }}>← Your answer</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {q.explanation && (
        <div style={{
          padding: '0.85rem 1rem',
          background: 'var(--indigo-dim)',
          border: '1px solid rgba(58,92,216,0.25)',
          borderRadius: 'var(--r-md)',
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--indigo-light)', marginBottom: '0.4rem' }}>
            Explanation
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--tx-2)', lineHeight: 1.65 }}>
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export function ContestResult({ result, contestTitle, onExit }) {
  const { score, totalMarks, percentage, questions = [] } = result;
  const grade = getGrade(percentage);

  /* Module-wise breakdown */
  const modules = ['Aptitude', 'Core', 'DSA'];
  const moduleStats = modules.map(mod => {
    const modQs    = questions.filter(q => q.module === mod);
    const correct  = modQs.filter(q => q.isCorrect).length;
    return { mod, correct, total: modQs.length };
  }).filter(s => s.total > 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Score hero card */}
      <div className="card soft-card" style={{
        textAlign: 'center', padding: '2.5rem 2rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, var(--bg-elevated), rgba(58,92,216,0.06))',
        border: '1px solid var(--b-3)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{grade.emoji}</div>
        <h1 style={{ fontFamily: 'var(--font-body)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: grade.color,
          lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '0.35rem' }}>
          {score}
          <span style={{ fontSize: '1.5rem', color: 'var(--tx-3)', fontWeight: 400 }}>
            /{totalMarks}
          </span>
        </h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: grade.color, marginBottom: '0.25rem' }}>
          {percentage}% — {grade.label}
        </p>
        <p className="t-sm" style={{ marginBottom: '1.5rem' }}>{contestTitle}</p>

        {/* Module breakdown chips */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {moduleStats.map(s => {
            const modPct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const modColor = MODULE_COLOR[s.mod] || 'var(--tx-3)';
            return (
              <div key={s.mod} style={{
                padding: '0.5rem 1rem',
                background: `${modColor}12`,
                border: `1px solid ${modColor}30`,
                borderRadius: 'var(--r-md)',
                minWidth: 120,
              }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700,
                  color: modColor, textTransform: 'uppercase',
                  letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  {s.mod}
                </p>
                <p style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--tx-1)', lineHeight: 1 }}>
                  {s.correct}/{s.total}
                </p>
                <p style={{ fontSize: '0.75rem', color: modColor, marginTop: '0.15rem' }}>
                  {modPct}%
                </p>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={onExit} style={{ padding: '0.65rem 2rem' }}>
          ← Back to Contests
        </button>
      </div>

      {/* Question review */}
      <div>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          Question Review
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {questions.map((q, i) => (
            <ReviewQuestion key={q.id || i} q={q} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
