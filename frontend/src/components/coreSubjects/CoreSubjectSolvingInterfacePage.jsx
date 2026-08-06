/**
 * CoreSubjectSolvingInterfacePage.jsx
 * Identical UX to SolvingInterfacePage but for Core Subject MCQs.
 * Uses /api/core-subjects/submit-problem and /api/core-subjects/ai-assistant.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Bot, FileText } from 'lucide-react';
import { useNeuralAssistant } from '../../hooks/useNeuralAssistant.js';
import { useSetBreadcrumb } from '../../context/BreadcrumbContext.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function buildExplanationSteps(problem, submitResult) {
  if (!submitResult) return [];
  const raw = (submitResult.explanation || problem?.explanation || problem?.hintText || '').trim();
  if (!raw) return [];
  const numbered = raw.split(/\n?\d+\.\s+/).filter(Boolean);
  if (numbered.length >= 2) {
    return numbered.map((text, i) => ({
      heading: `Step ${i + 1}`, text: text.trim(), highlight: i === 0
    }));
  }
  const paras = raw.split(/\n\n+/).filter(Boolean);
  if (paras.length >= 2) {
    return paras.map(text => ({ heading: null, text: text.trim(), highlight: false }));
  }
  return [
    { heading: 'What the question tests', text: raw, highlight: false },
    {
      heading: 'Core concept to remember',
      text: problem?.concept || 'Review the formal definition of this concept and trace through the options by elimination.',
      highlight: true
    },
    {
      heading: 'Why the correct answer works',
      text: problem?.correctOptionIndex !== undefined && problem?.options
        ? `Option ${LETTERS[problem.correctOptionIndex]}: "${problem.options[problem.correctOptionIndex]}" is the textbook-accurate answer.`
        : 'The correct option precisely matches the definition taught in this topic.',
    },
  ];
}

export function CoreSubjectSolvingInterfacePage() {
  const { slug, problemId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [topicData,     setTopicData]     = useState(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [selectedIdx,   setSelectedIdx]   = useState(-1);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitResult,  setSubmitResult]  = useState(null);
  const [error,         setError]         = useState('');
  const [assistantInput,setAssistantInput]= useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    setSubmitResult(null);
    setSelectedIdx(-1);
    apiRequest(`/api/core-subjects/topic/${slug}`, { token })
      .then(r => setTopicData(r.data))
      .catch(e => setError(e.message || 'Unable to load problem'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const problem = useMemo(() => {
    const pid = String(problemId || '').trim();
    return topicData?.problemList?.find(p => p.id === pid) ?? null;
  }, [topicData, problemId]);

  const setBreadcrumb = useSetBreadcrumb();
  useEffect(() => {
    if (topicData) {
      setBreadcrumb([
        { label: 'Core Subjects', to: '/dashboard/core' },
        { label: topicData.title, to: `/dashboard/core/topic/${slug}` },
        { label: problem?.title || 'Problem' },
      ]);
    }
    return () => setBreadcrumb([]);
  }, [topicData, problem, slug, setBreadcrumb]);

  const { messages, isThinking, askHint, stopGenerating } = useNeuralAssistant(
    problem
      ? { questionText: problem.questionText, options: problem.options, hintText: problem.hintText }
      : { questionText: '', options: [], hintText: '' },
    '/api/core-subjects/ai-assistant'
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = async () => {
    if (!problem || selectedIdx < 0) return;
    setIsSubmitting(true);
    setError('');
    try {
      const res = await apiRequest('/api/core-subjects/submit-problem', {
        method: 'POST', token,
        body: { problemId: problem.id, selectedOptionIndex: selectedIdx }
      });
      setSubmitResult({
        isCorrect:   res.data.isCorrect,
        explanation: res.data.explanation || problem.explanation || problem.hintText || ''
      });
      if (res.data.isCorrect) {
      }
    } catch (e) {
      setError(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAsk = async () => {
    const q = assistantInput.trim();
    if (!q || isThinking) return;
    setAssistantInput('');
    await askHint(q);
  };

  if (isLoading) return <main className="center-screen"><span className="spinner" /></main>;
  if (!problem) return (
    <div className="main-panel">
      <p className="error-text">{error || 'Problem not found.'}</p>
    </div>
  );

  const optionClass = (idx) => {
    if (!submitResult) return selectedIdx === idx ? 'mcq-option selected' : 'mcq-option';
    if (idx === problem.correctOptionIndex) return 'mcq-option correct';
    if (idx === selectedIdx) return 'mcq-option incorrect';
    return 'mcq-option';
  };

  const explanationSteps = buildExplanationSteps(problem, submitResult);

  return (
    <div className="mcq-solve-page">
      {/* Header */}
      <div className="mcq-solve-header">
        <div className="row gap-sm wrap">
          <span className="pill pill-violet" style={{ fontSize: '0.7rem' }}>
            {topicData?.title}
          </span>
          {topicData?.category && (
            <span className="pill pill-cyan" style={{ fontSize: '0.7rem' }}>
              {topicData.category}
            </span>
          )}
        </div>
        <span className="t-sm">Problem #{problem.id?.slice(-4) || '—'}</span>
      </div>

      <div className="mcq-solve-body" style={{ flex: 1, overflow: 'hidden', display: 'grid' }}>
        {/* LEFT */}
        <div className="mcq-solve-left">
          <div className="mcq-question-scroll">
            <div className="mcq-question-label"><FileText size={14} strokeWidth={1.75}/> Question</div>
            <p className="mcq-question-text">{problem.questionText}</p>

            <div className="mcq-options">
              {(problem.options || []).map((opt, idx) => (
                <button key={`${problem.id}-${idx}`} className={optionClass(idx)}
                  onClick={() => !submitResult && setSelectedIdx(idx)}
                  disabled={!!submitResult} type="button">
                  <span className="mcq-option-letter">{LETTERS[idx]}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {submitResult && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={`mcq-result-box ${submitResult.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="mcq-result-title">
                    {submitResult.isCorrect ? 'Correct!' : 'Incorrect — see explanation below.'}
                  </div>
                  {!submitResult.isCorrect && problem.correctOptionIndex !== undefined && (
                    <p className="t-sm">
                      Correct answer:{' '}
                      <strong style={{ color: 'var(--green)' }}>
                        {LETTERS[problem.correctOptionIndex]}: {problem.options?.[problem.correctOptionIndex]}
                      </strong>
                    </p>
                  )}
                  {submitResult.isCorrect && <p className="t-sm">Returning to sheet shortly…</p>}
                </div>

                {explanationSteps.length > 0 && (
                  <div>
                    <div className="mcq-explanation-label">Explanation</div>
                    <div className="mcq-explanation">
                      {explanationSteps.map((step, i) => (
                        <div key={i} className={`mcq-explanation-step${step.highlight ? ' highlight' : ''}`}>
                          {step.heading && (
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em',
                              textTransform: 'uppercase', color: 'var(--indigo-light)', marginBottom: '0.35rem' }}>
                              {step.heading}
                            </div>
                          )}
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

                <div className="row gap-sm wrap">
                  <button className="btn btn-primary"
                    onClick={() => navigate(`/dashboard/core/topic/${slug}`)}>Back to Sheet</button>
                  <button className="btn btn-outline"
                    onClick={() => { setSubmitResult(null); setSelectedIdx(-1); }}>Try Again</button>
                </div>
              </div>
            )}

            {error && <p className="error-text" style={{ marginTop: '1rem' }}>{error}</p>}
          </div>

          {!submitResult && (
            <div className="mcq-solve-footer">
              <button className="btn btn-primary" disabled={isSubmitting || selectedIdx < 0} onClick={handleSubmit}>
                {isSubmitting ? 'Checking…' : 'Submit Answer'}
              </button>
              <span className="t-sm">{selectedIdx < 0 ? 'Select an option' : `Selected: ${LETTERS[selectedIdx]}`}</span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="mcq-solve-right">
          <div className="neural-panel-header">
            <span className="neural-panel-icon"><Bot size={18} strokeWidth={1.75}/></span>
            <div>
              <div className="neural-panel-title">Neural Assistant</div>
              <div className="neural-panel-sub">Ask anything — hint, explanation, or full answer.</div>
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
                    <div className="neural-dot" /><div className="neural-dot" /><div className="neural-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="neural-input-bar">
            <input className="input" style={{ fontSize: '0.875rem' }}
              placeholder={isThinking ? "AI is generating response…" : "Ask anything about this problem…"}
              value={assistantInput}
              disabled={isThinking}
              onChange={e => setAssistantInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !isThinking && handleAsk()}
            />
            {isThinking ? (
              <button className="btn btn-danger btn-sm" onClick={stopGenerating} title="Stop generating">
                Stop
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleAsk} disabled={!assistantInput.trim()}>
                Ask
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}