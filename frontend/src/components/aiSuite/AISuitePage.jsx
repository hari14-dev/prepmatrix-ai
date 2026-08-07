/**
 * AISuitePage.jsx — AI Career Suite
 *
 * Two sections, each as a full-experience page:
 *
 * 1. ATS Resume Analyzer
 *    - Paste resume text + target role + optional JD
 *    - AI returns: ATS score (0-100), strengths, skill gaps,
 *      rewrite suggestions, predicted interview questions
 *    - Results shown as a clean report card
 *
 * 2. Voice Mock Interview
 *    - Configure role, focus area, difficulty, question count
 *    - Optionally paste resume so AI tailors questions to it
 *    - Interviewer speaks each question via SpeechSynthesis
 *    - User answers via microphone (SpeechRecognition) or keyboard
 *    - AI scores each answer live (technical / communication / confidence)
 *    - Final scorecard with strengths, growth areas, next-week plan
 *
 * All API calls go to /api/ai-suite/*.
 * SpeechSynthesis and SpeechRecognition are free browser APIs — no key needed.
 * Best experienced on Chrome desktop.
 */
import { useEffect, useRef, useState } from 'react';
import { apiRequest, apiUpload } from '../../lib/api.js';
import { Bot, Mic, MicOff, BarChart2, Trophy, TrendingUp, BookOpen, CheckCircle2, XCircle, Square, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

/* ── Score ring component ─────────────────────────────── */
function ScoreRing({ value, size = 80, label }) {
  const safe  = Math.max(0, Math.min(100, value || 0));
  const color = safe >= 75 ? 'var(--green)' : safe >= 50 ? 'var(--amber)' : 'var(--rose)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: `conic-gradient(${color} ${safe * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: size * 0.72, height: size * 0.72, borderRadius: '50%',
          background: 'var(--bg-elevated)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontWeight: 800, fontSize: size * 0.22, color, lineHeight: 1 }}>{safe}</span>
          <span style={{ fontSize: size * 0.12, color: 'var(--tx-4)', lineHeight: 1 }}>/ 100</span>
        </div>
      </div>
      {label && <span className="t-xs" style={{ textAlign: 'center' }}>{label}</span>}
    </div>
  );
}

/* ── Info list block ──────────────────────────────────── */
function InfoList({ title, items = [], color = 'var(--indigo-light)', icon = '•' }) {
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', color, marginBottom: '0.5rem',
      }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
            padding: '0.6rem 0.9rem',
            background: `${color}0f`, border: `1px solid ${color}22`,
            borderRadius: 'var(--r-md)', fontSize: '0.875rem',
            color: 'var(--tx-2)', lineHeight: 1.6,
          }}>
            <span style={{ color, flexShrink: 0, marginTop: '0.1rem', fontSize: '0.8rem' }}>{icon}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 1 — ATS Resume Analyzer
   ══════════════════════════════════════════════════════ */
function ResumeAnalyzer({ sharedResumeText, onResumeChange }) {
  const { token } = useAuth();
  const [targetRole,      setTargetRole]      = useState('Software Development Engineer (SDE)');
  const [jobDescription,  setJobDescription]  = useState('');
  const [isRunning,       setIsRunning]       = useState(false);
  const [error,           setError]           = useState('');
  const [result,          setResult]          = useState(null);

  const [isUploading,     setIsUploading]     = useState(false);
  const [uploadError,     setUploadError]     = useState('');
  const [uploadedFileName,setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  const runAudit = async () => {
    if (isRunning) return;
    if (!sharedResumeText.trim()) { setError('Paste your resume content first.'); return; }
    if (sharedResumeText.trim().length < 100) { setError('Resume is too short — paste at least 100 characters.'); return; }
    setError(''); setIsRunning(true); setResult(null);
    try {
      const res = await apiRequest('/api/ai-suite/resume-audit', {
        method: 'POST', token,
        body: { resumeText: sharedResumeText, targetRole, jobDescription },
      });
      setResult(res.data);
    } catch (e) {
      setError(e.message || 'Audit failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setUploadError(''); setIsUploading(true); setUploadedFileName('');
    try {
      const formData = new FormData();
      formData.append('resumeFile', file);
      const res = await apiUpload('/api/ai-suite/resume-parse', formData, { token });
      onResumeChange(res.data.resumeText);
      setUploadedFileName(res.data.fileName);
    } catch (err) {
      setUploadError(err.message || 'Could not read this file. Try pasting the text instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const scoreColor = !result ? null :
    result.atsScore >= 75 ? 'var(--green)' :
    result.atsScore >= 50 ? 'var(--amber)' : 'var(--rose)';

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>

      {/* Input card */}
      <div className="card soft-card">
        <div className="row gap-sm" style={{ marginBottom: '1.25rem' }}>
          <FileText size={20} strokeWidth={1.75} style={{color:'var(--indigo-light)'}}/>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--tx-1)' }}>
              ATS Resume Analyzer
            </h2>
            <p className="t-sm">Upload or paste your resume and get an ATS score, skill gaps, and rewrite suggestions powered by Groq AI.</p>
          </div>
        </div>

        {/* Resume input — shared with interview section */}
        <div className="field" style={{ marginBottom: '1rem' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span className="label" style={{ marginBottom: 0 }}>Resume Content</span>
            <div className="row gap-sm" style={{ alignItems: 'center' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                style={{ display: 'none' }}
                onChange={handleFileSelected}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Reading file…' : 'Upload PDF / DOCX / TXT'}
              </button>
            </div>
          </div>
          <textarea
            className="textarea"
            style={{ minHeight: 160 }}
            placeholder="Paste your full resume text here, or upload a file above…"
            value={sharedResumeText}
            onChange={e => onResumeChange(e.target.value)}
          />
          {uploadedFileName && !uploadError && (
            <p className="t-xs" style={{ marginTop: '0.3rem', color: 'var(--green)' }}>
              Loaded text from "{uploadedFileName}" — you can edit it above before running the analysis.
            </p>
          )}
          {uploadError && (
            <p className="t-xs" style={{ marginTop: '0.3rem', color: 'var(--rose)' }}>{uploadError}</p>
          )}
          <p className="t-xs" style={{ marginTop: '0.3rem' }}>
            This resume is also used by the Mock Interview section below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="field">
            <span className="label">Target Role</span>
            <input
              className="input"
              placeholder="e.g. Software Engineer Intern"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
          </div>
          <div className="field">
            <span className="label">Job Description (optional)</span>
            <input
              className="input"
              placeholder="Paste JD for sharper gap analysis…"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary btn-glow"
          style={{ width: '100%' }}
          disabled={isRunning}
          onClick={runAudit}
        >
          {isRunning
            ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing with AI…</>
            : 'Run ATS Analysis'}
        </button>

        {error && <p className="error-text" style={{ marginTop: '0.75rem' }}>{error}</p>}
      </div>

      {/* Result card */}
      {result && (
        <div className="card soft-card animate-in">
          {/* Header with score */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem',
            paddingBottom: '1.25rem', borderBottom: '1px solid var(--b-1)',
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--tx-1)', marginBottom: '0.2rem' }}>
                ATS Analysis Report
              </p>
              <p className="t-sm">Target: {targetRole}</p>
              {result.source === 'local-fallback' && (
                <p className="t-xs" style={{ color: 'var(--amber)', marginTop: '0.2rem' }}>
                  AI unavailable — showing local estimate
                </p>
              )}
            </div>
            <ScoreRing value={result.atsScore} size={90} label="ATS Score" />
          </div>

          {/* Score interpretation */}
          <div style={{
            padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
            background: `${scoreColor}10`, border: `1px solid ${scoreColor}30`,
            marginBottom: '1.25rem',
          }}>
            <p style={{ fontWeight: 700, color: scoreColor, fontSize: '0.875rem' }}>
              {result.atsScore >= 75
                ? 'Strong Resume — likely ATS pass'
                : result.atsScore >= 50
                ? 'Average — some gaps to fill'
                : 'Weak ATS match — improvements needed'}
            </p>
          </div>

          <InfoList
            title="Strengths"
            items={result.strengths}
            color="var(--green)"
            icon="ok"
          />
          <InfoList
            title="Skill Gaps to Address"
            items={result.skillGaps}
            color="var(--rose)"
            icon="fail"
          />
          <InfoList
            title="Rewrite Suggestions"
            items={result.rewriteSuggestions}
            color="var(--indigo-light)"
            icon="→"
          />
          <InfoList
            title="Predicted Interview Questions (based on your resume)"
            items={result.predictedQuestions}
            color="var(--violet)"
            icon="?"
          />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 2 — Voice Mock Interview (Real Conversation Flow)
   ══════════════════════════════════════════════════════ */
function MockInterview({ sharedResumeText, onResumeChange }) {
  const { token } = useAuth();

  // Config
  const [targetRole,    setTargetRole]    = useState('Software Development Engineer (SDE)');
  const [focusArea,     setFocusArea]     = useState('mixed');
  const [difficulty,    setDifficulty]    = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);

  // Resume Upload states
  const [isUploading,      setIsUploading]      = useState(false);
  const [uploadError,      setUploadError]      = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showPasteText,    setShowPasteText]    = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(''); setIsUploading(true); setUploadedFileName('');
    try {
      const formData = new FormData();
      formData.append('resumeFile', file);
      const res = await apiUpload('/api/ai-suite/resume-parse', formData, { token });
      onResumeChange?.(res.data.resumeText);
      setUploadedFileName(res.data.fileName);
    } catch (err) {
      setUploadError(err.message || 'Could not read this file. Try pasting the text instead.');
    } finally {
      setIsUploading(false);
    }
  };

  // Session state
  const [sessionId,       setSessionId]       = useState('');
  const [questions,       setQuestions]        = useState([]);
  const [turns,           setTurns]            = useState([]);
  const [activeQuestion,  setActiveQuestion]   = useState(null);
  const [flowComplete,    setFlowComplete]     = useState(false);
  const [answerDraft,     setAnswerDraft]      = useState('');
  const [lastEval,        setLastEval]         = useState(null);
  const [finalReport,     setFinalReport]      = useState(null);
  const [isStarting,      setIsStarting]       = useState(false);
  const [isSubmitting,    setIsSubmitting]     = useState(false);
  const [isFinishing,     setIsFinishing]      = useState(false);
  const [isSpeaking,      setIsSpeaking]       = useState(false);
  const [isListening,     setIsListening]      = useState(false);
  const [voiceMode,       setVoiceMode]        = useState(true);  // true = voice-first, false = text mode
  const [interimText,     setInterimText]      = useState('');    // live transcript while speaking
  const [error,           setError]            = useState('');
  const [statusMsg,       setStatusMsg]        = useState('');    // e.g. "Listening...", "AI is thinking..."

  const recognitionRef   = useRef(null);
  const answerStartRef   = useRef(Date.now());
  const chatEndRef       = useRef(null);
  const autoListenTimer  = useRef(null);
  const silenceTimerRef  = useRef(null);
  const isListeningRef   = useRef(false);  // stable ref for callbacks
  const submitRef        = useRef(null);

  const canSpeak  = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const canListen = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  /* ── Keep refs in sync ── */
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { submitRef.current = submitAnswer; });

  /* ── Set up SpeechRecognition ── */
  useEffect(() => {
    if (!canListen) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec  = new Ctor();
    rec.lang            = 'en-IN';
    rec.continuous      = true;   // keep listening until we explicitly stop
    rec.interimResults  = true;   // show live transcript

    rec.onresult = e => {
      let interim = '';
      let final   = '';
      for (const result of Array.from(e.results)) {
        if (result.isFinal) final   += result[0]?.transcript || '';
        else                interim += result[0]?.transcript || '';
      }
      if (interim) setInterimText(interim);
      if (final)   {
        setAnswerDraft(prev => (prev ? `${prev} ${final}` : final).trim());
        setInterimText('');
      }

      // Hands-Free VAD Silence Detection (ChatGPT Voice Mode):
      // Reset silence timer on every detected speech snippet.
      // If 1.8 seconds pass with no further speech, auto-submit the answer!
      clearTimeout(silenceTimerRef.current);
      if (voiceMode) {
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            submitRef.current?.();
          }
        }, 1800);
      }
    };
    rec.onend  = () => {
      clearTimeout(silenceTimerRef.current);
      setIsListening(false);
      setInterimText('');
    };
    rec.onerror = () => {
      clearTimeout(silenceTimerRef.current);
      setIsListening(false);
      setInterimText('');
    };
    recognitionRef.current = rec;
    return () => {
      clearTimeout(silenceTimerRef.current);
      try { rec.stop(); } catch {}
    };
  }, [voiceMode]);

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, interimText]);

  /* ── Cleanup timers on unmount ── */
  useEffect(() => {
    return () => {
      clearTimeout(autoListenTimer.current);
      if (canSpeak) window.speechSynthesis.cancel();
    };
  }, []);

  /* ── Speak text then auto-start listening ── */
  const speakAndListen = (text, autoListen = true) => {
    if (!canSpeak) {
      // No TTS — just auto-listen after a short delay
      if (autoListen && voiceMode && canListen) {
        autoListenTimer.current = setTimeout(() => startListening(), 600);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const u       = new SpeechSynthesisUtterance(text);
    u.lang        = 'en-IN';
    u.rate        = 0.92;
    u.pitch       = 1.05;
    u.volume      = 1;

    u.onstart = () => { setIsSpeaking(true); setStatusMsg('Interviewer is speaking…'); };
    u.onend   = () => {
      setIsSpeaking(false);
      setStatusMsg('');
      if (autoListen && voiceMode && canListen) {
        // Small pause then auto-start listening
        setStatusMsg('Get ready to answer…');
        autoListenTimer.current = setTimeout(() => {
          setStatusMsg('');
          startListening();
        }, 900);
      }
    };
    u.onerror = () => { setIsSpeaking(false); setStatusMsg(''); };

    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    clearTimeout(autoListenTimer.current);
    if (canSpeak) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setStatusMsg('');
  };

  const startListening = () => {
    const rec = recognitionRef.current;
    if (!rec || isListeningRef.current) return;
    setAnswerDraft('');
    setInterimText('');
    setError('');
    setIsListening(true);
    setStatusMsg('Listening… speak your answer');
    try { rec.start(); } catch {}
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) try { rec.stop(); } catch {}
    setIsListening(false);
    setInterimText('');
    setStatusMsg('');
  };

  /* ── Start interview ── */
  const startInterview = async () => {
    setIsStarting(true); setError(''); setFinalReport(null); setLastEval(null);
    try {
      const res = await apiRequest('/api/ai-suite/mock-interview/start', {
        method: 'POST', token,
        body: { targetRole, focusArea, difficulty, resumeText: sharedResumeText, questionCount },
      });
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions || []);
      setTurns(res.data.conversationTurns || []);
      setActiveQuestion(res.data.activeQuestion || null);
      setFlowComplete(false);
      setAnswerDraft('');
      answerStartRef.current = Date.now();

      // Speak opening message → then auto-listen
      const allTurns  = res.data.conversationTurns || [];
      const opening   = [...allTurns].reverse().find(t => t.role === 'interviewer');
      if (opening?.text) {
        setTimeout(() => speakAndListen(opening.text, voiceMode), 500);
      }
    } catch (e) {
      setError(e.message || 'Failed to start interview');
    } finally {
      setIsStarting(false);
    }
  };

  /* ── Submit answer (works for both voice and text) ── */
  const submitAnswer = async () => {
    if (!sessionId || !activeQuestion || flowComplete) return;
    const answer = (answerDraft + (interimText ? ` ${interimText}` : '')).trim();
    if (!answer) { setError('Please speak or type an answer first.'); return; }

    stopListening();
    stopSpeaking();
    setError(''); setIsSubmitting(true);
    setStatusMsg('AI is evaluating your answer…');

    const elapsed = Math.max(0, Math.round((Date.now() - answerStartRef.current) / 1000));
    try {
      const res = await apiRequest('/api/ai-suite/mock-interview/answer', {
        method: 'POST', token,
        body: { sessionId, questionIndex: activeQuestion.index, answerText: answer, durationSeconds: elapsed },
      });
      setTurns(res.data.conversationTurns || []);
      setLastEval(res.data);
      setActiveQuestion(res.data.activeQuestion || null);
      setFlowComplete(Boolean(res.data.isQuestionFlowComplete));
      setAnswerDraft('');
      setInterimText('');
      answerStartRef.current = Date.now();
      setStatusMsg('');

      // Speak interviewer response → auto-listen for next answer (unless complete)
      const interviewerMsg = res.data.interviewerMessage;
      if (interviewerMsg) {
        setTimeout(() => speakAndListen(interviewerMsg, voiceMode && !res.data.isQuestionFlowComplete), 300);
      }
    } catch (e) {
      setError(e.message || 'Failed to evaluate answer');
      setStatusMsg('');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Finish interview ── */
  const finishInterview = async () => {
    if (!sessionId) return;
    stopListening(); stopSpeaking();
    setIsFinishing(true); setError(''); setStatusMsg('Generating your report…');
    try {
      const res = await apiRequest('/api/ai-suite/mock-interview/finish', {
        method: 'POST', token, body: { sessionId },
      });
      setFinalReport(res.data.report);
    } catch (e) {
      setError(e.message || 'Failed to generate report');
    } finally {
      setIsFinishing(false); setStatusMsg('');
    }
  };

  const resetInterview = () => {
    stopListening(); stopSpeaking();
    setSessionId(''); setQuestions([]); setTurns([]);
    setActiveQuestion(null); setFlowComplete(false);
    setAnswerDraft(''); setInterimText(''); setLastEval(null);
    setFinalReport(null); setError(''); setStatusMsg('');
  };

  const answeredCount = turns.filter(t => t.role === 'candidate').length;

  /* ── Render: not started ── */
  if (!sessionId) {
    return (
      <div className="card soft-card">
        <div className="row gap-sm" style={{ marginBottom: '1.25rem' }}>
          <Mic size={20} strokeWidth={1.75} style={{color:'var(--green)'}}/>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--tx-1)' }}>
              Voice Mock Interview
            </h2>
            <p className="t-sm">
              A real voice conversation — the AI interviewer speaks, you answer by voice.
              It auto-listens after each question, just like a real interview call.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
          background: voiceMode ? 'rgba(74,155,143,0.07)' : 'rgba(58,92,216,0.07)',
          border: `1px solid ${voiceMode ? 'rgba(74,155,143,0.25)' : 'rgba(58,92,216,0.25)'}`,
          marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--tx-1)', marginBottom: '0.1rem' }}>
              {voiceMode ? 'Voice Mode' : 'Text Mode'}
            </p>
            <p className="t-xs">
              {voiceMode
                ? 'AI speaks → auto-listens for your answer → you speak → repeat. Natural conversation flow.'
                : 'AI speaks questions. You type answers manually. Good if mic is unavailable.'}
            </p>
          </div>
          {canListen && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setVoiceMode(v => !v)}
              style={{ flexShrink: 0 }}
            >
              Switch to {voiceMode ? 'Text' : 'Voice'} Mode
            </button>
          )}
          {!canListen && (
            <span className="t-xs" style={{ color: 'var(--amber)' }}>Mic not available — text mode only</span>
          )}
        </div>

        {/* Config grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="field">
            <span className="label">Target Role</span>
            <input className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Software Engineer Intern" />
          </div>
          <div className="field">
            <span className="label">Focus Area</span>
            <select className="select" value={focusArea} onChange={e => setFocusArea(e.target.value)}>
              <option value="mixed">Mixed (recommended)</option>
              <option value="technical">Technical</option>
              <option value="hr">HR / Behavioural</option>
              <option value="project">Project Deep Dive</option>
            </select>
          </div>
          <div className="field">
            <span className="label">Difficulty</span>
            <select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="field">
            <span className="label">No. of Questions</span>
            <input className="input" type="number" min={3} max={8} value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value) || 5)} />
          </div>
        </div>

        {/* Resume Upload & Text Input Card */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--r-md)',
          background: 'var(--bg-input)',
          border: '1px solid var(--b-2)',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: 'var(--indigo-light)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--tx-1)' }}>
                Tailor Questions to Your Resume
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileSelected}
              />
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Parsing PDF/DOCX…</>
                ) : (
                  '📁 Upload Resume (PDF / DOCX)'
                )}
              </button>
              <button
                className="btn btn-outline btn-sm"
                type="button"
                onClick={() => setShowPasteText(v => !v)}
              >
                {showPasteText ? 'Hide Text' : 'Paste Text'}
              </button>
            </div>
          </div>

          {uploadError && <p className="error-text" style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>{uploadError}</p>}

          {uploadedFileName && (
            <p className="t-xs" style={{ color: 'var(--green)', fontWeight: 600 }}>
              ✅ Uploaded: {uploadedFileName} ({sharedResumeText.length} characters parsed) — Questions will be tailored to your experience!
            </p>
          )}

          {(!uploadedFileName && sharedResumeText.trim()) && (
            <p className="t-xs" style={{ color: 'var(--green)', fontWeight: 600 }}>
              ✅ Resume content detected ({sharedResumeText.length} characters) — Questions will be tailored to your experience!
            </p>
          )}

          {(!sharedResumeText.trim() && !uploadedFileName) && (
            <p className="t-xs" style={{ color: 'var(--tx-4)' }}>
              Upload a PDF/DOCX resume or paste text so the AI interviewer asks tailored questions about your projects and skills.
            </p>
          )}

          {showPasteText && (
            <textarea
              className="textarea"
              style={{ minHeight: 90, fontSize: '0.82rem', marginTop: '0.25rem' }}
              placeholder="Paste your resume text here..."
              value={sharedResumeText}
              onChange={e => onResumeChange?.(e.target.value)}
            />
          )}
        </div>

        <button className="btn btn-primary btn-glow" style={{ width: '100%' }}
          disabled={isStarting} onClick={startInterview}>
          {isStarting
            ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating Interview…</>
            : 'Start Mock Interview'}
        </button>

        {error && <p className="error-text" style={{ marginTop: '0.75rem' }}>{error}</p>}
      </div>
    );
  }

  /* ── Render: Final Report ── */
  if (finalReport) {
    return (
      <div className="card soft-card animate-in" style={{ display: 'grid', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {finalReport.overallScore >= 75 ? <Trophy size={22} strokeWidth={1.75}/> : finalReport.overallScore >= 50 ? <TrendingUp size={22} strokeWidth={1.75}/> : <BookOpen size={22} strokeWidth={1.75}/>}
          </div>
          <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--tx-1)', marginBottom: '0.35rem' }}>
            Interview Complete!
          </p>
          <ScoreRing value={finalReport.overallScore} size={100} label="Overall Score" />
          {finalReport.source === 'local-fallback' && (
            <p className="t-xs" style={{ color: 'var(--amber)', marginTop: '0.5rem' }}>
              AI unavailable — showing local report estimate
            </p>
          )}
        </div>

        <InfoList title="Strengths" items={finalReport.strengths} color="var(--green)" icon="ok" />
        <InfoList title="Growth Areas" items={finalReport.growthAreas} color="var(--amber)" icon="→" />
        <InfoList title="7-Day Action Plan" items={finalReport.nextWeekPlan} color="var(--indigo-light)" icon="→" />

        <button className="btn btn-outline" style={{ width: '100%' }} onClick={resetInterview}>
          ↺ Start New Interview
        </button>
      </div>
    );
  }

  /* ── Render: Active Interview ── */
  const showSubmit = !flowComplete && (answerDraft.trim() || interimText.trim());

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>

      {/* Status bar */}
      <div className="card soft-card" style={{ padding: '0.9rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="row wrap gap-sm">
            <span className="pill">{targetRole}</span>
            <span className={`pill ${voiceMode ? 'pill-cyan' : ''}`}>{voiceMode ? 'Voice Mode (Hands-Free)' : 'Text Mode'}</span>
            <span className={`pill ${difficulty === 'hard' ? 'pill-rose' : difficulty === 'medium' ? 'pill-amber' : 'pill-green'}`}>
              {difficulty}
            </span>
          </div>
          <div className="row gap-sm">
            <span className="t-sm">
              {flowComplete
                ? <span style={{ color: 'var(--green)' }}>All questions done</span>
                : <>Q{answeredCount + 1}/{questions.length}</>}
            </span>
            <button className="btn btn-outline btn-sm" onClick={resetInterview}>Reset</button>
          </div>
        </div>
      </div>

      {/* ── ChatGPT Voice Mode Orb & Wave Stage ── */}
      {voiceMode && (
        <div className={`voice-orb-stage ${isSpeaking ? 'speaking' : isListening ? 'listening' : isSubmitting ? 'evaluating' : 'idle'}`}>
          <div className="voice-orb-glow" />
          <div className="voice-orb-core">
            {isSpeaking ? <Bot size={44} style={{ color: '#ffffff' }} /> :
             isListening ? <Mic size={44} style={{ color: '#ffffff' }} /> :
             isSubmitting ? <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3, borderTopColor: 'var(--amber)' }} /> :
             <Bot size={44} style={{ color: 'var(--indigo-light)' }} />}
          </div>

          {/* Animated Audio Equalizer Wave Bars */}
          <div className="voice-wave-bars">
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
          </div>

          <div style={{ marginTop: '0.85rem', textAlign: 'center', zIndex: 2 }}>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', letterSpacing: '-0.01em' }}>
              {isSpeaking ? 'Interviewer Speaking…' :
               isListening ? 'Listening to You (Hands-Free)…' :
               isSubmitting ? 'Evaluating Your Answer…' :
               statusMsg || 'Ready for Conversation'}
            </p>
            <p className="t-xs" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>
              {isListening
                ? 'Speak naturally — 1.8s of silence automatically submits your response'
                : isSpeaking
                ? 'Listen to the interviewer question'
                : 'Continuous voice interaction active'}
            </p>
          </div>

          {(isSpeaking || isListening) && (
            <button
              className="btn btn-outline btn-sm"
              style={{ position: 'absolute', right: 16, top: 16, borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
              onClick={() => { stopSpeaking(); stopListening(); }}
            >
              Interrupt / Stop
            </button>
          )}
        </div>
      )}

      {/* Conversation */}
      <div className="card soft-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.75rem 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--tx-1)' }}>
            Interview Room
          </p>
          <div className="row gap-sm">
            {!isSpeaking && turns.length > 0 && (
              <button className="btn btn-secondary btn-sm"
                onClick={() => {
                  const last = [...turns].reverse().find(t => t.role === 'interviewer');
                  if (last) speakAndListen(last.text, false);
                }}>
                Replay
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          minHeight: 240, maxHeight: 380, overflowY: 'auto',
          padding: '0.85rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '0.6rem',
        }}>
          {turns.map((turn, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: turn.role === 'interviewer' ? 'flex-start' : 'flex-end',
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: turn.role === 'interviewer'
                  ? 'var(--r-sm) var(--r-lg) var(--r-lg) var(--r-lg)'
                  : 'var(--r-lg) var(--r-sm) var(--r-lg) var(--r-lg)',
                background: turn.role === 'interviewer' ? 'var(--bg-elevated)' : 'var(--indigo-dim)',
                border: `1px solid ${turn.role === 'interviewer' ? 'var(--b-2)' : 'rgba(58,92,216,0.3)'}`,
                fontSize: '0.9rem', lineHeight: 1.65,
                color: turn.role === 'interviewer' ? 'var(--tx-2)' : 'var(--tx-1)',
              }}>
                {turn.role === 'interviewer' && (
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--indigo-light)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
                    <Bot size={13} strokeWidth={1.75} style={{marginRight:'0.3rem',verticalAlign:'middle'}}/>Interviewer
                  </p>
                )}
                {turn.role === 'candidate' && (
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
                    <Mic size={13} strokeWidth={2} style={{marginRight:'0.3rem',verticalAlign:'middle'}}/>You
                  </p>
                )}
                {turn.text}
              </div>
            </div>
          ))}

          {/* Live interim transcript bubble */}
          {interimText && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                maxWidth: '80%', padding: '0.65rem 1rem',
                borderRadius: 'var(--r-lg) var(--r-sm) var(--r-lg) var(--r-lg)',
                background: 'rgba(74,155,143,0.08)', border: '1px dashed rgba(74,155,143,0.35)',
                fontSize: '0.88rem', color: 'var(--tx-3)', fontStyle: 'italic',
              }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--cyan)',
                  textTransform: 'uppercase', marginBottom: '0.2rem' }}><Mic size={12} strokeWidth={2} style={{marginRight:'0.25rem'}}/>Speaking…</p>
                {interimText}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Answer controls */}
        {!flowComplete && (
          <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--b-1)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

            {/* Text input (always visible in text mode; shown as supplement in voice mode) */}
            {(!voiceMode || answerDraft) && (
              <textarea
                className="textarea"
                style={{ minHeight: 80, resize: 'vertical' }}
                placeholder={voiceMode ? 'Your spoken answer appears here. Edit if needed…' : 'Type your answer here… (Ctrl+Enter to submit)'}
                value={answerDraft}
                onChange={e => setAnswerDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); submitAnswer(); }
                }}
              />
            )}

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Mic button */}
              {canListen && (
                <button
                  className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking || isSubmitting}
                  style={{ minWidth: 140 }}
                >
                  {isListening ? <><Square size={12} strokeWidth={2} style={{marginRight:'0.3rem'}}/>Stop</> : <><Mic size={12} strokeWidth={2} style={{marginRight:'0.3rem'}}/>Speak Answer</>}
                </button>
              )}

              {/* Submit — shown when there's something to submit */}
              {(showSubmit || !voiceMode) && (
                <button
                  className="btn btn-primary"
                  disabled={isSubmitting || (!answerDraft.trim() && !interimText.trim())}
                  onClick={submitAnswer}
                  style={{ flex: 1 }}
                >
                  {isSubmitting
                    ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Evaluating…</>
                    : 'Submit Answer ↵'}
                </button>
              )}
            </div>

            {voiceMode && !isListening && !answerDraft && (
              <p className="t-xs" style={{ color: 'var(--tx-4)', textAlign: 'center' }}>
                The mic will auto-start after the interviewer finishes speaking. Or tap "Speak Answer" anytime.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Live evaluation card */}
      {lastEval && (
        <div className="card soft-card animate-in">
          <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--tx-1)', marginBottom: '0.85rem' }}>
            <BarChart2 size={14} strokeWidth={1.75} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/>Last Answer Scores
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[
              { label: 'Overall',       value: lastEval.score },
              { label: 'Technical',     value: lastEval.technicalScore },
              { label: 'Communication', value: lastEval.communicationScore },
              { label: 'Confidence',    value: lastEval.confidenceScore },
            ].map(s => (
              <ScoreRing key={s.label} value={Math.round(s.value)} size={62} label={s.label} />
            ))}
          </div>
          <div style={{
            padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
            background: 'var(--indigo-dim)', border: '1px solid rgba(58,92,216,0.2)',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-2)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--indigo-light)' }}>Feedback: </strong>
              {lastEval.feedback}
            </p>
            {lastEval.followUpQuestion && (
              <p style={{ fontSize: '0.82rem', color: 'var(--tx-3)', marginTop: '0.4rem' }}>
                <strong>Follow-up to think about: </strong>{lastEval.followUpQuestion}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Finish button */}
      {(flowComplete || answeredCount > 0) && !finalReport && (
        <div className="card soft-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p className="t-sm" style={{ marginBottom: '0.85rem' }}>
            {flowComplete
              ? 'All questions answered! Generate your full performance report.'
              : `Answered ${answeredCount}/${questions.length} — you can finish early to see your report.`}
          </p>
          <button className="btn btn-primary btn-glow" style={{ width: '100%', maxWidth: 320 }}
            disabled={isFinishing} onClick={finishInterview}>
            {isFinishing
              ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating Report…</>
              : 'Finish & Get Report'}
          </button>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
/* ══════════════════════════════════════════════════════
   MAIN PAGE — Tab switcher between the two sections
   ══════════════════════════════════════════════════════ */
export function AISuitePage() {
  const [activeTab,      setActiveTab]      = useState('resume'); // 'resume' | 'interview'
  const [sharedResume,   setSharedResume]   = useState('');

  return (
    <div className="animate-in">

      {/* ── Page Header ── */}
      <div className="section-header">
        <span className="pill pill-violet" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
          <Bot size={18} strokeWidth={1.75} style={{marginRight:'0.5rem',verticalAlign:'middle'}}/>AI Career Suite
        </span>
        <h1 className="hero-title">AI Career Suite</h1>
        <p className="muted-text" style={{ marginTop: '0.4rem', maxWidth: 560 }}>
          AI-powered tools to prepare for real placements. Analyze your resume and
          practice with a voice-enabled AI interviewer.
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div style={{
        display: 'flex', gap: '0', marginBottom: '1.5rem',
        background: 'var(--bg-elevated)', border: '1px solid var(--b-2)',
        borderRadius: 'var(--r-lg)', padding: '0.3rem', width: 'fit-content',
      }}>
        {[
          { id: 'resume',    label: 'ATS Resume Analyzer' },
          { id: 'interview', label: 'Voice Mock Interview' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--r-md)',
              border: 'none',
              background: activeTab === tab.id ? 'var(--indigo)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--tx-3)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.18s var(--ease)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Active section ── */}
      {activeTab === 'resume'
        ? <ResumeAnalyzer sharedResumeText={sharedResume} onResumeChange={setSharedResume} />
        : <MockInterview sharedResumeText={sharedResume} onResumeChange={setSharedResume} />
      }
    </div>
  );
}