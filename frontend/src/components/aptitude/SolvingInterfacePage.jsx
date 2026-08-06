/**
 * SolvingInterfacePage.jsx  —  Aptitude MCQ Solving Interface
 *
 * Layout (desktop):
 *  ┌─────────────────────────────────┬──────────────────────┐
 *  │  Question + Options + Result    │  Neural AI Assistant │
 *  │  (scrollable)                   │  (chat + hints)      │
 *  └─────────────────────────────────┴──────────────────────┘
 *
 * After the user submits an answer we show:
 *  • Correct / Incorrect banner
 *  • Step-by-step explanation (not just a vague one-liner)
 *  • Key formula or trick highlighted
 *  • Auto-navigate back to sheet after 3 s if correct
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Bot, FileText } from 'lucide-react';
import { useNeuralAssistant } from '../../hooks/useNeuralAssistant.js';
import { useSetBreadcrumb } from '../../context/BreadcrumbContext.jsx';

/* Option letter labels A B C D E */
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/* ── Component ─────────────────────────────────────────── */
export function SolvingInterfacePage() {
  const { slug, problemId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [topicData,          setTopicData]          = useState(null);
  const [isLoading,          setIsLoading]           = useState(true);
  const [selectedIdx,        setSelectedIdx]         = useState(-1);
  const [isSubmitting,       setIsSubmitting]        = useState(false);
  const [submitResult,       setSubmitResult]        = useState(null); // { isCorrect, explanation }
  const [error,              setError]               = useState('');
  const [assistantInput,     setAssistantInput]      = useState('');
  const messagesEndRef = useRef(null);

  /* ── fetch topic on mount ── */
  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    setSubmitResult(null);
    setSelectedIdx(-1);
    apiRequest(`/api/aptitude/topic/${slug}`, { token })
      .then(r => setTopicData(r.data))
      .catch(e => setError(e.message || 'Unable to load problem'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  /* ── find the current problem inside topic's problemList ── */
  const problem = useMemo(() => {
    const pid = String(problemId || '').trim();
    return topicData?.problemList?.find(p => p.id === pid) ?? null;
  }, [topicData, problemId]);

  /* ── publish breadcrumb trail once we know the topic/problem ── */
  const setBreadcrumb = useSetBreadcrumb();
  useEffect(() => {
    if (topicData) {
      setBreadcrumb([
        { label: 'Aptitude', to: '/dashboard/aptitude' },
        { label: topicData.title, to: `/dashboard/aptitude/topic/${slug}` },
        { label: problem?.title || 'Problem' },
      ]);
    }
    return () => setBreadcrumb([]);
  }, [topicData, problem, slug, setBreadcrumb]);

  /* ── Neural assistant hook ── */
  const { messages, isThinking, askHint } = useNeuralAssistant(
    problem
      ? { questionText: problem.questionText, options: problem.options, hintText: problem.hintText }
      : { questionText: '', options: [], hintText: '' }
  );

  /* Auto-scroll assistant chat */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  /* ── Submit answer ── */
  const handleSubmit = async () => {
    if (!problem || selectedIdx < 0) return;
    setIsSubmitting(true);
    setError('');
    try {
      const res = await apiRequest('/api/aptitude/submit-problem', {
        method: 'POST', token,
        body: { problemId: problem.id, selectedOptionIndex: selectedIdx }
      });
      setSubmitResult({
        isCorrect:   res.data.isCorrect,
        explanation: res.data.explanation || problem.explanation || problem.hintText || ''
      });

    } catch (e) {
      setError(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Ask assistant ── */
  const handleAsk = async () => {
    const q = assistantInput.trim();
    if (!q) return;
    setAssistantInput('');
    await askHint(q);
  };

  /* ── Loading / Error states ── */
  if (isLoading) return <main className="center-screen"><span className="spinner" /></main>;
  if (error && !problem) return (
    <div className="main-panel">
      <p className="error-text" style={{ marginBottom: '1rem' }}>{error}</p>
    </div>
  );
  if (!problem) return (
    <div className="main-panel">
      <p className="error-text">Problem not found.</p>
    </div>
  );

  /* ── Option state class ── */
  const optionClass = (idx) => {
    if (!submitResult) {
      return selectedIdx === idx ? 'mcq-option selected' : 'mcq-option';
    }
    if (idx === problem.correctOptionIndex) return 'mcq-option correct';
    if (idx === selectedIdx) return 'mcq-option incorrect';
    return 'mcq-option';
  };

  /* ── Build structured explanation steps ── */
  const explanationSteps = buildExplanationSteps(problem, submitResult);

  return (
    <div className="mcq-solve-page">

      {/* ── Header bar ── */}
      <div className="mcq-solve-header">
        <div className="row gap-sm wrap">
          <span className="pill pill-cyan" style={{ fontSize: '0.7rem' }}>
            {topicData?.title}
          </span>
          {problem.difficulty && (
            <span className={`tag tag-${(problem.difficulty || '').toLowerCase()}`}>
              {problem.difficulty}
            </span>
          )}
        </div>
        <span className="t-sm" style={{ flexShrink: 0 }}>
          Problem #{problem.id?.slice(-4) || '—'}
        </span>
      </div>

      {/* ── Main two-column body ── */}
      <div className="mcq-solve-body" style={{ flex: 1, overflow: 'hidden', display: 'grid' }}>

        {/* ── LEFT: Question + Options + Explanation ── */}
        <div className="mcq-solve-left">
          <div className="mcq-question-scroll">

            {/* Question */}
            <div className="mcq-question-label">
              <FileText size={14} strokeWidth={1.75}/> Question
            </div>
            <p className="mcq-question-text">{problem.questionText}</p>

            {/* Options */}
            <div className="mcq-options">
              {(problem.options || []).map((opt, idx) => (
                <button
                  key={`${problem.id}-${idx}`}
                  className={optionClass(idx)}
                  onClick={() => !submitResult && setSelectedIdx(idx)}
                  disabled={!!submitResult}
                  type="button"
                >
                  <span className="mcq-option-letter">{LETTERS[idx]}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* ── Post-submit result + explanation ── */}
            {submitResult && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Result banner */}
                <div className={`mcq-result-box ${submitResult.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="mcq-result-title">
                    {submitResult.isCorrect
                      ? 'Correct!'
                      : 'Incorrect — review the explanation below.'}
                  </div>
                  {!submitResult.isCorrect && problem.correctOptionIndex !== undefined && (
                    <p className="t-sm">
                      The correct answer is{' '}
                      <strong style={{ color: 'var(--green)' }}>
                        {LETTERS[problem.correctOptionIndex]}: {problem.options?.[problem.correctOptionIndex]}
                      </strong>
                    </p>
                  )}
                  {submitResult.isCorrect && (
                    <p className="t-sm" style={{ color: 'var(--tx-3)' }}>
                      Returning to sheet in a few seconds…
                    </p>
                  )}
                </div>

                {/* Step-by-step explanation */}
                {explanationSteps.length > 0 && (
                  <div>
                    <div className="mcq-explanation-label">Step-by-Step Explanation</div>
                    <div className="mcq-explanation">
                      {explanationSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`mcq-explanation-step${step.highlight ? ' highlight' : ''}`}
                        >
                          {step.heading && (
                            <div style={{
                              fontWeight: 700, fontSize: '0.82rem',
                              letterSpacing: '0.04em', textTransform: 'uppercase',
                              color: 'var(--indigo-light)', marginBottom: '0.35rem'
                            }}>
                              {step.heading}
                            </div>
                          )}
                          {/* Render \n as line breaks */}
                          {step.text.split('\n').map((line, li) => (
                            <p key={li} style={{ margin: li > 0 ? '0.3rem 0 0' : 0, fontSize: '0.9375rem', lineHeight: 1.65 }}>
                              {line}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation actions */}
                <div className="row gap-sm wrap" style={{ marginTop: '0.5rem' }}>
                  <button className="btn btn-primary"
                    onClick={() => navigate(`/dashboard/aptitude/topic/${slug}`)}>
                    Back to Sheet
                  </button>
                  <button className="btn btn-outline"
                    onClick={() => { setSubmitResult(null); setSelectedIdx(-1); }}>
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {error && <p className="error-text" style={{ marginTop: '1rem' }}>{error}</p>}
          </div>

          {/* Submit footer */}
          {!submitResult && (
            <div className="mcq-solve-footer">
              <button
                className="btn btn-primary"
                disabled={isSubmitting || selectedIdx < 0}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Checking…' : 'Submit Answer'}
              </button>
              <span className="t-sm">
                {selectedIdx < 0
                  ? 'Select an option above'
                  : `Selected: ${LETTERS[selectedIdx]}`}
              </span>
            </div>
          )}
        </div>

        {/* ── RIGHT: Neural Assistant ── */}
        <div className="mcq-solve-right">
          <div className="neural-panel-header">
            <span className="neural-panel-icon"><Bot size={18} strokeWidth={1.75}/></span>
            <div>
              <div className="neural-panel-title">Neural Assistant</div>
              <div className="neural-panel-sub">
                Ask anything — hint, explanation, or full answer.
              </div>
            </div>
          </div>

          <div className="neural-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`neural-msg-wrap ${msg.role}`}>
                <div className={`neural-bubble ${msg.role}`}>{msg.text}</div>
              </div>
            ))}
            {isThinking && (
              <div className="neural-msg-wrap assistant">
                <div className="neural-bubble assistant">
                  <div className="neural-thinking">
                    <div className="neural-dot" />
                    <div className="neural-dot" />
                    <div className="neural-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="neural-input-bar">
            <input
              className="input"
              style={{ fontSize: '0.875rem' }}
              placeholder="Ask anything about this problem…"
              value={assistantInput}
              onChange={e => setAssistantInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAsk()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleAsk}>
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * buildExplanationSteps
 * Converts raw explanation text into structured, readable steps.
 * Tries to parse numbered lines; otherwise wraps into clean blocks.
 */
function buildExplanationSteps(problem, submitResult) {
  if (!submitResult) return [];

  const raw = (submitResult.explanation || problem?.explanation || problem?.hintText || '').trim();
  if (!raw) return [];

  // Try to detect if the text already has numbered steps "1. " "2. " etc.
  const numbered = raw.split(/\n?\d+\.\s+/).filter(Boolean);
  if (numbered.length >= 2) {
    return numbered.map((text, i) => ({
      heading: `Step ${i + 1}`,
      text: text.trim(),
      highlight: i === 0, // highlight the first step
    }));
  }

  // Fallback: split on double-newlines or sentences, group into blocks
  const paras = raw.split(/\n\n+/).filter(Boolean);
  if (paras.length >= 2) {
    return paras.map((text, i) => ({ heading: null, text: text.trim(), highlight: false }));
  }

  // Single block — split at ~90 chars for readability
  const APPROACH_HEADINGS = [
    { heading: 'What the question asks', text: raw },
    {
      heading: 'Key concept / formula',
      text: problem?.concept
        || `Focus on the logic pattern — eliminate wrong options by substitution or contradiction.`,
      highlight: true
    },
    {
      heading: 'Why the correct answer works',
      text: problem?.correctOptionIndex !== undefined && problem?.options
        ? `Option ${LETTERS[problem.correctOptionIndex]}: "${problem.options[problem.correctOptionIndex]}" satisfies all given conditions.`
        : 'The correct option satisfies every constraint stated in the question.',
    },
  ];

  return APPROACH_HEADINGS;
}