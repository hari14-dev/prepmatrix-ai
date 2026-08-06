/**
 * CodingIDEPage.jsx  —  LeetCode/CodeChef-style Coding IDE
 *
 * Three-pane layout:
 *  ┌──────────────────┬───────────────────────────┬──────────────┐
 *  │  Problem         │  Code Editor              │  AI          │
 *  │  Description     │  (Monaco)                 │  Assistant   │
 *  │                  ├───────────────────────────┤  (collapsible│
 *  │  • Statement     │  Console / Test Results   │   panel)     │
 *  │  • Examples      │                           │              │
 *  │  • Constraints   │                           │              │
 *  └──────────────────┴───────────────────────────┴──────────────┘
 *
 * Key improvements over previous version:
 *  • Monaco uses a CUSTOM dark theme (not vs-dark) that matches the app
 *  • Console shows PASS/FAIL chips per test case
 *  • Problem description is well-formatted markdown
 *  • Language selector is styled (not raw <select>)
 *  • "Reset Code" button added
 *  • Keyboard shortcut: Ctrl+Enter = Run
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { Bot, Lightbulb, Lock, CheckCircle2 } from 'lucide-react';
import { streamMessageInto } from '../../lib/streamText.js';
import { useAuth } from '../../context/AuthContext.jsx';

/* ── Language options ── */
const LANGUAGES = [
  { value: 'cpp',     label: 'C++',    monacoId: 'cpp' },
  { value: 'java',    label: 'Java',   monacoId: 'java' },
  { value: 'python3', label: 'Python', monacoId: 'python' },
];

/* ── Starter templates ── */
const TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Write your solution here

    return 0;
}
`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}
`,
  python3: `import sys
input = sys.stdin.readline

def solve():
    # Write your solution here
    pass

solve()
`,
};

/* Slugify for back-navigation */
function slugify(v) {
  return String(v ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* ── IDE Theme definition ── */
const IDE_THEME_NAME = 'sp3-dark';
function defineTheme(monaco) {
  monaco.editor.defineTheme(IDE_THEME_NAME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '',              foreground: 'cbd5e1' },
      { token: 'comment',      foreground: '64748b', fontStyle: 'italic' },
      { token: 'keyword',      foreground: '818cf8', fontStyle: 'bold' },
      { token: 'string',       foreground: '86efac' },
      { token: 'number',       foreground: 'fbbf24' },
      { token: 'type',         foreground: '7dd3fc' },
      { token: 'function',     foreground: 'a5f3fc' },
      { token: 'variable',     foreground: 'e2e8f0' },
      { token: 'operator',     foreground: 'f472b6' },
    ],
    colors: {
      'editor.background':           '#0b0f1a',
      'editor.foreground':           '#cbd5e1',
      'editor.lineHighlightBackground': '#141e30',
      'editorLineNumber.foreground': '#3f4966',
      'editorLineNumber.activeForeground': '#6366f1',
      'editor.selectionBackground': '#3730a3',
      'editorCursor.foreground':    '#818cf8',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
      'scrollbarSlider.background': '#1e293b',
      'scrollbarSlider.hoverBackground': '#334155',
    },
  });
}

/* ── Main component ───────────────────────────────────── */
export function CodingIDEPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const navigate  = useNavigate();
  const monaco    = useMonaco();
  const assistantPanelRef = useRef(null);

  const [problem,         setProblem]         = useState(null);
  const [isLoading,       setIsLoading]       = useState(true);
  const [error,           setError]           = useState('');
  const [language,        setLanguage]        = useState('cpp');
  const [codeMap,         setCodeMap]         = useState({ ...TEMPLATES });
  const [runReport,       setRunReport]       = useState(null);
  const [submitReport,    setSubmitReport]    = useState(null);
  const [consoleMode,     setConsoleMode]     = useState(null); // 'run' | 'submit'
  const [isRunning,       setIsRunning]       = useState(false);
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [aiMessages,      setAiMessages]      = useState([{
    id: 'init', role: 'assistant',
    text: "Hi! I'm your coding assistant. Ask me for a logic hint, edge case ideas, or time-complexity analysis. I won't give you the full solution directly."
  }]);
  const [aiInput,         setAiInput]         = useState('');
  const [isAiThinking,    setIsAiThinking]    = useState(false);
  const [assistantOpen,   setAssistantOpen]   = useState(true);
  const aiEndRef = useRef(null);

  /* ── Register Monaco theme once ── */
  useEffect(() => {
    if (monaco) {
      defineTheme(monaco);
      monaco.editor.setTheme(IDE_THEME_NAME);
    }
  }, [monaco]);

  /* ── Fetch problem ── */
  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    apiRequest(`/api/dsa/problem/${slug}`, { token })
      .then(r => {
        setProblem(r.data);
        setCodeMap({ ...TEMPLATES });
        setRunReport(null);
        setSubmitReport(null);
        setConsoleMode(null);
        setAiMessages([{
          id: 'init', role: 'assistant',
          text: `Problem loaded: **${r.data?.title}**. Ask me anything about the approach!`
        }]);
      })
      .catch(e => setError(e.message || 'Failed to load problem'))
      .finally(() => setIsLoading(false));
  }, [slug, token]);

  /* Auto-scroll AI chat */
  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiThinking]);

  const currentCode = useMemo(() => codeMap[language] ?? '', [codeMap, language]);
  const publicSamples = useMemo(() => {
    const tc = Array.isArray(problem?.testCases) ? problem.testCases : [];
    return tc.filter(t => typeof t.isPublic === 'boolean' ? t.isPublic : !t.isHidden).slice(0, 3);
  }, [problem]);

  /* ── Run code ── */
  const runCode = useCallback(async () => {
    if (!problem || !currentCode.trim()) return;
    setIsRunning(true);
    setConsoleMode('run');
    setError('');
    try {
      const res = await apiRequest('/api/dsa/execute', {
        method: 'POST', token,
        body: { userCode: currentCode, language, useCustomInput: false, problemId: problem.id }
      });
      setRunReport(res.data?.data ?? res.data);
    } catch (e) {
      setError(e.message || 'Run failed');
    } finally {
      setIsRunning(false);
    }
  }, [problem, currentCode, language, token]);

  /* ── Submit code ── */
  const submitCode = useCallback(async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setConsoleMode('submit');
    setError('');
    try {
      const res = await apiRequest('/api/dsa/submit', {
        method: 'POST', token,
        body: { userCode: currentCode, language, problemId: problem.id }
      });
      setSubmitReport(res);
    } catch (e) {
      setError(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, currentCode, language, token]);

  /* ── Ask AI ── */
  const askAI = useCallback(async () => {
    const q = aiInput.trim();
    if (!q || !problem) return;
    setAiMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', text: q }]);
    setAiInput('');
    setIsAiThinking(true);
    try {
      const res = await apiRequest('/api/dsa/neural-pair-programmer', {
        method: 'POST', token,
        body: {
          userQuery: q,
          userCode: currentCode,
          currentProblem: { title: problem.title, description: problem.description,
            pattern: problem.pattern, difficulty: problem.difficulty, hintText: problem.hintText },
          errorReport: runReport
            ? `Run status: ${runReport.status}, passed: ${runReport.totalPassed}/${runReport.totalCases}`
            : 'No run yet'
        }
      });
      await streamMessageInto(`a-${Date.now()}`, res.data.analysis, setAiMessages);
    } catch (e) {
      setAiMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'assistant', text: e.message || 'Unable to fetch hint' }]);
    } finally {
      setIsAiThinking(false);
    }
  }, [aiInput, problem, currentCode, token, runReport]);

  /* ── Keyboard shortcut: Ctrl/Cmd + Enter = Run ── */
  const handleEditorKeyDown = useCallback(e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  }, [runCode]);

  /* ── Loading state ── */
  if (isLoading) return <main className="center-screen"><span className="spinner" /></main>;
  if (!problem) return (
    <div style={{ padding: '2rem' }}>
      <p className="error-text">{error || 'Problem not found.'}</p>
    </div>
  );

  const diffClass = `tag tag-${(problem.difficulty || '').toLowerCase()}`;

  return (
    <section className="dsa-ide-shell">

      {/* ── IDE Topbar ── */}
      <div className="dsa-ide-topbar">
        <div className="dsa-ide-topbar-left">
          <Link to="/dsa" className="breadcrumb-text t-sm" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>
            DSA
          </Link>
          {problem.pattern && (
            <>
              <span className="breadcrumb-sep" style={{ color: 'var(--tx-4)' }}>/</span>
              <Link
                to={`/dsa/topic/${slugify(problem.pattern)}`}
                className="breadcrumb-text t-sm"
                style={{ color: 'var(--tx-3)', textDecoration: 'none' }}
              >
                {problem.pattern}
              </Link>
            </>
          )}
          <span className="breadcrumb-sep" style={{ color: 'var(--tx-4)' }}>/</span>
          <span className="t-sm" style={{
            color: 'var(--tx-1)', fontWeight: 600, maxWidth: '180px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {problem.title}
          </span>
          <span className={diffClass}>{problem.difficulty}</span>
        </div>

        <div className="dsa-ide-top-controls">
          {/* Language selector */}
          <select
            className="lang-select"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Reset */}
          <button className="btn btn-outline btn-sm"
            title="Reset code to template"
            onClick={() => setCodeMap(prev => ({ ...prev, [language]: TEMPLATES[language] }))}>
            ↺ Reset
          </button>

          {/* Toggle AI */}
          <button className="btn btn-outline btn-sm"
            onClick={() => setAssistantOpen(v => !v)}>
            {assistantOpen ? 'Hide AI' : <><Bot size={14} strokeWidth={1.75} style={{marginRight:'0.3rem'}}/>AI</>}
          </button>

          {/* Run */}
          <button className="btn btn-secondary btn-sm" onClick={runCode} disabled={isRunning}>
            {isRunning
              ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Running…</>
              : '▶ Run'}
          </button>

          {/* Submit */}
          <button className="btn btn-primary btn-sm" onClick={submitCode} disabled={isSubmitting}>
            {isSubmitting
              ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Submitting…</>
              : 'Submit'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.4rem 1rem', background: 'var(--rose-dim)',
          borderBottom: '1px solid rgba(209,73,91,0.25)', fontSize: '0.82rem', color: 'var(--rose)' }}>
          {error}
        </div>
      )}

      {/* ── Three-pane layout ── */}
      <div className="dsa-ide-layout">
        <PanelGroup className="dsa-resizable-group" direction="horizontal" autoSaveId="sp3-ide-v2">

          {/* ── Pane 1: Problem Description ── */}
          <Panel defaultSize={28} minSize={20} maxSize={42} className="dsa-panel-shell">
            <div className="problem-desc-pane">
              <div className="problem-desc-scroll">

                {/* Meta */}
                <div className="problem-meta-row">
                  <span className={diffClass}>{problem.difficulty}</span>
                  {problem.pattern && <span className="pill pill-primary" style={{ fontSize: '0.68rem' }}>{problem.pattern}</span>}
                  {problem.tags?.map(t => (
                    <span key={t} className="pill" style={{ fontSize: '0.65rem' }}>{t}</span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="problem-title">{problem.title}</h2>

                {/* Statement */}
                <div className="problem-statement markdown-view">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {problem.description || ''}
                  </ReactMarkdown>
                </div>

                {/* Input / Output format */}
                {(problem.inputFormat || problem.outputFormat) && (
                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {problem.inputFormat && (
                      <div>
                        <div className="problem-section-label">Input Format</div>
                        <p className="t-body">{problem.inputFormat}</p>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div>
                        <div className="problem-section-label">Output Format</div>
                        <p className="t-body">{problem.outputFormat}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Constraints */}
                {Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
                  <div style={{ marginTop: '1.25rem' }}>
                    <div className="problem-section-label">Constraints</div>
                    <ul className="constraints-list">
                      {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {publicSamples.length > 0 && (
                  <div style={{ marginTop: '1.25rem' }}>
                    <div className="problem-section-label">
                      Examples ({publicSamples.length})
                    </div>
                    {publicSamples.map((s, i) => (
                      <div key={i} className="sample-block">
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--tx-4)',
                          marginBottom: '0.5rem' }}>
                          Example {i + 1}
                        </div>
                        <div className="sample-io-row">
                          <div>
                            <div className="sample-io-label">Input</div>
                            <pre className="sample-io-pre">{s.input || '(empty)'}</pre>
                          </div>
                          <div>
                            <div className="sample-io-label">Output</div>
                            <pre className="sample-io-pre">{s.expectedOutput || '(empty)'}</pre>
                          </div>
                        </div>
                        {s.explanation && (
                          <p style={{ marginTop: '0.5rem', fontSize: '0.82rem',
                            color: 'var(--tx-3)', lineHeight: 1.55 }}>
                            {s.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hint */}
                {problem.hintText && (
                  <details style={{ marginTop: '1.25rem' }}>
                    <summary style={{ fontSize: '0.82rem', color: 'var(--indigo-light)',
                      cursor: 'pointer', fontWeight: 600 }}>
                      <Lightbulb size={14} strokeWidth={1.75} style={{marginRight:'0.35rem'}}/>Show Hint
                    </summary>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem',
                      color: 'var(--tx-2)', lineHeight: 1.65,
                      padding: '0.75rem', background: 'var(--indigo-dim)',
                      borderRadius: 'var(--r-md)', border: '1px solid rgba(58,92,216,0.2)' }}>
                      {problem.hintText}
                    </p>
                  </details>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="panel-resize-handle" />

          {/* ── Pane 2: Editor + Console ── */}
          <Panel defaultSize={assistantOpen ? 50 : 72} minSize={35} className="dsa-panel-shell">
            <PanelGroup className="dsa-editor-console-group" direction="vertical">

              {/* Monaco Editor */}
              <Panel defaultSize={70} minSize={40} className="dsa-panel-shell">
                <div className="editor-pane">
                  <div className="editor-toolbar">
                    <span className="t-xs" style={{ color: 'var(--tx-4)' }}>
                      {LANGUAGES.find(l => l.value === language)?.label} — Ctrl+Enter to run
                    </span>
                    <div className="editor-actions">
                      <span className="t-xs" style={{ color: isRunning || isSubmitting ? 'var(--amber)' : 'var(--tx-4)' }}>
                        {isRunning ? '⏳ Running…' : isSubmitting ? '⏳ Submitting…' : '●'}
                      </span>
                    </div>
                  </div>
                  <div className="editor-monaco-wrap" onKeyDown={handleEditorKeyDown}>
                    <Editor
                      height="100%"
                      language={LANGUAGES.find(l => l.value === language)?.monacoId || 'cpp'}
                      value={currentCode}
                      onChange={val => setCodeMap(prev => ({ ...prev, [language]: val ?? '' }))}
                      theme={IDE_THEME_NAME}
                      options={{
                        fontSize: 14,
                        lineHeight: 22,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        fontLigatures: true,
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        padding: { top: 12, bottom: 12 },
                        renderLineHighlight: 'all',
                        cursorBlinking: 'smooth',
                        smoothScrolling: true,
                        tabSize: 4,
                        bracketPairColorization: { enabled: true },
                        scrollbar: { vertical: 'auto', horizontal: 'auto' },
                      }}
                    />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="panel-resize-handle-horizontal" />

              {/* Console */}
              <Panel defaultSize={30} minSize={15} className="dsa-panel-shell">
                <div className="console-pane">
                  <div className="console-header">
                    <span>Console</span>
                    {consoleMode && (
                      <span style={{ color: 'var(--tx-3)', fontWeight: 400, textTransform: 'none',
                        letterSpacing: 0 }}>
                        {consoleMode === 'run' ? 'Run result' : 'Submission result'}
                      </span>
                    )}
                  </div>
                  <div className="console-body">
                    {!consoleMode && (
                      <p className="t-sm">Press <strong>Run</strong> to test against sample cases, or <strong>Submit</strong> to evaluate all test cases.</p>
                    )}

                    {/* Run result */}
                    {consoleMode === 'run' && runReport && (
                      <ConsoleRunResult report={runReport} />
                    )}

                    {/* Submit result */}
                    {consoleMode === 'submit' && submitReport && (
                      <ConsoleSubmitResult report={submitReport} />
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {/* ── Pane 3: AI Assistant (collapsible) ── */}
          {assistantOpen && (
            <>
              <PanelResizeHandle className="panel-resize-handle" />
              <Panel
                ref={assistantPanelRef}
                defaultSize={22} minSize={16} maxSize={32}
                className="dsa-panel-shell"
              >
                <div className="ide-assistant-pane">
                  <div className="ide-assistant-header">
                    <div className="row gap-sm">
                      <Bot size={16} strokeWidth={1.75}/>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--tx-1)' }}>
                          AI Assistant
                        </p>
                        <p className="t-xs">Ask anything — explain, hint, or full solution</p>
                      </div>
                    </div>
                  </div>

                  <div className="ide-assistant-messages">
                    {aiMessages.map(msg => (
                      <div key={msg.id}
                        style={{ display: 'flex', flexDirection: 'column',
                          alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '90%', padding: '0.6rem 0.8rem',
                          borderRadius: msg.role === 'user'
                            ? 'var(--r-md) var(--r-sm) var(--r-md) var(--r-md)'
                            : 'var(--r-sm) var(--r-md) var(--r-md) var(--r-md)',
                          background: msg.role === 'user'
                            ? 'var(--indigo-dim)'
                            : 'var(--bg-elevated)',
                          border: `1px solid ${msg.role === 'user'
                            ? 'rgba(58,92,216,0.25)' : 'var(--b-2)'}`,
                          fontSize: '0.8125rem', lineHeight: 1.6,
                          color: msg.role === 'user' ? 'var(--tx-1)' : 'var(--tx-2)',
                        }}>
                          {msg.role === 'assistant' ? (
                            <div className="markdown-chat">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          ) : msg.text}
                        </div>
                      </div>
                    ))}
                    {isAiThinking && (
                      <div>
                        <div style={{ padding: '0.5rem 0.8rem', background: 'var(--bg-elevated)',
                          border: '1px solid var(--b-2)', borderRadius: 'var(--r-md)',
                          display: 'inline-block' }}>
                          <div className="neural-thinking">
                            <div className="neural-dot" />
                            <div className="neural-dot" />
                            <div className="neural-dot" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={aiEndRef} />
                  </div>

                  <div className="ide-assistant-input">
                    <input
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                      placeholder="Ask for a hint…"
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && askAI()}
                    />
                    <button className="btn btn-primary btn-sm" onClick={askAI}>Ask</button>
                  </div>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </section>
  );
}

/* ── Console sub-components ── */

function ConsoleRunResult({ report }) {
  if (!report) return null;
  const allPass = report.status === 'Accepted' || report.totalPassed === report.totalCases;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div className="console-status-row">
        <span className={`console-status-badge ${allPass ? 'pass' : 'fail'}`}>
          {allPass ? 'All Passed' : 'Failed'}
        </span>
        {typeof report.totalPassed === 'number' && (
          <span className="t-sm">{report.totalPassed}/{report.totalCases} sample cases</span>
        )}
        {report.time && (
          <span className="t-sm">⏱ {Math.round(Number(report.time) * 1000)}ms</span>
        )}
      </div>

      {Array.isArray(report.results) && report.results.length > 0 && (
        <div className="test-case-grid">
          {report.results.map(r => (
            <div key={r.caseNumber} className={`test-case-chip ${r.passed ? 'pass' : 'fail'}`}>
              <span>Case {r.caseNumber}</span>
              <span style={{fontSize:'0.75rem',fontWeight:700}}>{r.passed ? 'PASS' : r.status || 'FAIL'}</span>
            </div>
          ))}
        </div>
      )}

      {report.stdout && !Array.isArray(report.results) && (
        <div>
          <div className="problem-section-label">Output</div>
          <pre className="console-pre">{report.stdout}</pre>
        </div>
      )}

      {report.compile_output && (
        <div>
          <div className="problem-section-label" style={{ color: 'var(--rose)' }}>Compiler Error</div>
          <pre className="console-pre" style={{ color: 'var(--rose)' }}>{report.compile_output}</pre>
        </div>
      )}
    </div>
  );
}

function ConsoleSubmitResult({ report }) {
  if (!report) return null;
  const status   = report.status ?? report.data?.status ?? 'Unknown';
  const passed   = report.passedCount ?? report.data?.passedCount;
  const total    = report.totalCount  ?? report.data?.totalCount;
  const accepted = /accept/i.test(status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div className="console-status-row">
        <span className={`console-status-badge ${accepted ? 'pass' : 'fail'}`}>
          {accepted ? <><CheckCircle2 size={13} strokeWidth={2} style={{marginRight:'0.3rem'}}/>Accepted</> : status}
        </span>
        {typeof passed === 'number' && typeof total === 'number' && (
          <span className="t-sm">{passed}/{total} test cases passed</span>
        )}
      </div>

      {!accepted && Array.isArray(report.results) && report.results.length > 0 && (
        <div className="test-case-grid">
          {report.results.slice(0, 8).map(r => (
            <div key={r.caseNumber} className={`test-case-chip ${r.passed ? 'pass' : r.skipped ? '' : 'fail'}`}>
              <span>Case {r.caseNumber}{r.visibility === 'hidden' ? <Lock size={11} strokeWidth={2} style={{marginLeft:'0.25rem',verticalAlign:'middle'}}/> : null}</span>
              <span style={{fontSize:'0.7rem',fontWeight:700}}>{r.passed ? 'pass' : r.skipped ? '—' : 'fail'}</span>
            </div>
          ))}
          {report.results.length > 8 && (
            <p className="t-xs">…and {report.results.length - 8} more</p>
          )}
        </div>
      )}

      {report.compile_output && (
        <div>
          <div className="problem-section-label" style={{ color: 'var(--rose)' }}>Compiler Error</div>
          <pre className="console-pre" style={{ color: 'var(--rose)' }}>{report.compile_output}</pre>
        </div>
      )}

      {accepted && (
        <p className="t-sm" style={{ color: 'var(--green)' }}>
          Your solution passed all test cases.
        </p>
      )}
    </div>
  );
}