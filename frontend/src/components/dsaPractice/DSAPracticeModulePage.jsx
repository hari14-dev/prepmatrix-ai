import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { TopicList } from './TopicList.jsx';
import { ProblemList } from './ProblemList.jsx';
import { ProblemDetail } from './ProblemDetail.jsx';
import { CodeEditor } from './CodeEditor.jsx';

function normalizePatternParam(pattern) {
  return encodeURIComponent(String(pattern || '').trim());
}

export function DSAPracticeModulePage() {
  const { token } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [problemDetail, setProblemDetail] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [language, setLanguage] = useState('cpp');
  const [codeByLanguage, setCodeByLanguage] = useState({ cpp: '', java: '', python3: '' });

  const [runReport, setRunReport] = useState(null);
  const [submitReport, setSubmitReport] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCode = codeByLanguage[language] ?? '';

  const selectedTopicRow = useMemo(
    () => topics.find((t) => t.pattern === selectedPattern) || null,
    [topics, selectedPattern]
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError('');

    apiRequest('/api/dsa/patterns', { token })
      .then((response) => {
        const rows = Array.isArray(response.data) ? response.data : [];
        setTopics(rows);
        if (!selectedPattern && rows.length > 0) {
          setSelectedPattern(rows[0].pattern);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load patterns'))
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedPattern) {
      return;
    }

    setError('');
    setProblems([]);
    setSelectedSlug('');
    setProblemDetail(null);
    setRunReport(null);
    setSubmitReport(null);

    apiRequest(`/api/dsa/problems/${normalizePatternParam(selectedPattern)}`, { token })
      .then((response) => {
        const list = response.data?.problems;
        const safe = Array.isArray(list) ? list : [];
        setProblems(safe);
        if (safe.length > 0) {
          setSelectedSlug(safe[0].slug);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load problems'));
  }, [token, selectedPattern]);

  useEffect(() => {
    if (!token || !selectedSlug) {
      return;
    }

    setError('');
    setProblemDetail(null);
    setRunReport(null);
    setSubmitReport(null);

    apiRequest(`/api/dsa/problem/${encodeURIComponent(selectedSlug)}`, { token })
      .then((response) => setProblemDetail(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load problem detail'));
  }, [token, selectedSlug]);

  const onSelectPattern = (pattern) => {
    setSelectedPattern(pattern);
  };

  const onSelectProblem = (slug) => {
    setSelectedSlug(slug);
  };

  const onChangeLanguage = (next) => {
    setLanguage(next);
  };

  const onChangeCode = (nextCode) => {
    setCodeByLanguage((prev) => ({ ...prev, [language]: nextCode }));
  };

  const runCode = async () => {
    if (!problemDetail) {
      return;
    }
    if (!currentCode.trim()) {
      setError('Please write code before running.');
      return;
    }

    setIsRunning(true);
    setError('');
    setRunReport(null);

    try {
      const response = await apiRequest('/api/dsa/execute', {
        method: 'POST',
        token,
        body: {
          userCode: currentCode,
          language,
          useCustomInput: false,
          problemId: problemDetail.id
        }
      });

      setRunReport(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Run failed');
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!problemDetail) {
      return;
    }
    if (!currentCode.trim()) {
      setError('Please write code before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSubmitReport(null);

    try {
      const response = await apiRequest('/api/dsa/submit', {
        method: 'POST',
        token,
        body: {
          userCode: currentCode,
          language,
          problemId: problemDetail.id
        }
      });

      setSubmitReport(response);

      // Refresh progress (solved flags + mastery) after a submit.
      const [patternsResp, problemsResp] = await Promise.all([
        apiRequest('/api/dsa/patterns', { token }),
        apiRequest(`/api/dsa/problems/${normalizePatternParam(selectedPattern)}`, { token })
      ]);
      setTopics(Array.isArray(patternsResp.data) ? patternsResp.data : []);
      setProblems(Array.isArray(problemsResp.data?.problems) ? problemsResp.data.problems : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRunResults = () => {
    if (!runReport) {
      return <p className="muted-text small">Run code to see sample test results.</p>;
    }

    const results = Array.isArray(runReport.results) ? runReport.results : [];

    return (
      <>
        <div className="dsa-practice-result-meta">
          <span>Status: {runReport.status}</span>
          {typeof runReport.totalPassed === 'number' && typeof runReport.totalCases === 'number' ? (
            <span>
              Passed: {runReport.totalPassed}/{runReport.totalCases}
            </span>
          ) : null}
          <span>Runtime: {Math.round((Number(runReport.time || 0) * 1000) || 0)}ms</span>
        </div>
        {results.length > 0 ? (
          <div className="dsa-practice-result-list">
            {results.map((row) => (
              <div key={`run-${row.caseNumber}`} className={row.passed ? 'dsa-practice-result-row pass' : 'dsa-practice-result-row fail'}>
                <div className="dsa-practice-result-row-title">
                  Sample #{row.caseNumber} — {row.passed ? 'PASS' : 'FAIL'}
                </div>
                <div className="dsa-practice-result-row-body">
                  <div>
                    <div className="muted-text small">Input</div>
                    <pre className="dsa-practice-pre">{row.input || '(empty)'}</pre>
                  </div>
                  <div>
                    <div className="muted-text small">Expected</div>
                    <pre className="dsa-practice-pre">{row.expectedOutput || '(empty)'}</pre>
                  </div>
                  <div>
                    <div className="muted-text small">Actual</div>
                    <pre className="dsa-practice-pre">{row.actualOutput || '(empty)'}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <pre className="dsa-practice-pre">{runReport.stdout || runReport.compile_output || 'No output'}</pre>
        )}
        {runReport.compile_output ? (
          <div className="dsa-practice-compile">
            <div className="muted-text small">Compiler / Runtime Output</div>
            <pre className="dsa-practice-pre">{runReport.compile_output}</pre>
          </div>
        ) : null}
      </>
    );
  };

  const renderSubmitResults = () => {
    if (!submitReport) {
      return <p className="muted-text small">Submit to run all test cases (samples + hidden).</p>;
    }

    const results = Array.isArray(submitReport.results) ? submitReport.results : [];

    return (
      <>
        <div className={submitReport.success ? 'dsa-practice-verdict ok' : 'dsa-practice-verdict bad'}>
          {submitReport.success ? 'Accepted' : `Verdict: ${submitReport.status}`}
          {typeof submitReport.passedCount === 'number' && typeof submitReport.totalCount === 'number' ? (
            <span className="muted-text small">
              {' '}
              ({submitReport.passedCount}/{submitReport.totalCount} passed)
            </span>
          ) : null}
        </div>

        {results.length > 0 ? (
          <div className="dsa-practice-result-list">
            {results.map((row) => {
              const isHidden = row.visibility === 'hidden';
              const passed = Boolean(row.passed);
              return (
                <div key={`submit-${row.caseNumber}`} className={passed ? 'dsa-practice-result-row pass' : 'dsa-practice-result-row fail'}>
                  <div className="dsa-practice-result-row-title">
                    Case #{row.caseNumber} — {passed ? 'PASS' : 'FAIL'} {isHidden ? '(hidden)' : '(public)'}
                  </div>

                  {!isHidden && !passed ? (
                    <div className="dsa-practice-result-row-body">
                      <div>
                        <div className="muted-text small">Input</div>
                        <pre className="dsa-practice-pre">{row.input || '(empty)'}</pre>
                      </div>
                      <div>
                        <div className="muted-text small">Expected</div>
                        <pre className="dsa-practice-pre">{row.expectedOutput || '(empty)'}</pre>
                      </div>
                      <div>
                        <div className="muted-text small">Actual</div>
                        <pre className="dsa-practice-pre">{row.actualOutput || '(empty)'}</pre>
                      </div>
                    </div>
                  ) : null}

                  {!isHidden && passed ? (
                    <div className="muted-text small">Passed.</div>
                  ) : null}

                  {isHidden ? (
                    <div className="muted-text small">Hidden test case details are not shown.</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {submitReport.compile_output ? (
          <div className="dsa-practice-compile">
            <div className="muted-text small">Compiler / Runtime Output</div>
            <pre className="dsa-practice-pre">{submitReport.compile_output}</pre>
          </div>
        ) : null}
      </>
    );
  };

  if (isLoading) {
    return (
      <main className="center-screen">
        <span className="spinner" />
      </main>
    );
  }

  return (
    <section className="dsa-practice-shell">
      <div className="section-header">
        <h1 className="hero-title">DSA Practice</h1>
        <p className="muted-text">Codeforces-style practice: run samples, submit hidden tests, track progress.</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="dsa-practice-layout">
        <aside className="dsa-practice-left">
          <div className="card soft-card dsa-practice-left-card">
            <TopicList topics={topics} selectedKey={selectedPattern} onSelect={onSelectPattern} />
            <div className="dsa-practice-divider" />
            <ProblemList problems={problems} selectedSlug={selectedSlug} onSelect={onSelectProblem} />
            {selectedTopicRow ? (
              <div className="dsa-practice-progress muted-text small">
                Progress: {selectedTopicRow.solvedCount}/{selectedTopicRow.totalCount} solved
              </div>
            ) : null}
          </div>
        </aside>

        <main className="dsa-practice-center">
          <ProblemDetail problem={problemDetail} />
        </main>

        <aside className="dsa-practice-right">
          <CodeEditor
            language={language}
            onChangeLanguage={onChangeLanguage}
            code={currentCode}
            onChangeCode={onChangeCode}
            onRun={() => void runCode()}
            onSubmit={() => void submitCode()}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />

          <article className="card soft-card dsa-practice-results">
            <h2 className="card-title">Run (Samples)</h2>
            {renderRunResults()}
          </article>

          <article className="card soft-card dsa-practice-results">
            <h2 className="card-title">Submit (All Tests)</h2>
            {renderSubmitResults()}
          </article>
        </aside>
      </div>
    </section>
  );
}
