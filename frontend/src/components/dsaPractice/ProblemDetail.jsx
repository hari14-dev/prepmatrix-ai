import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ProblemDetail({ problem }) {
  if (!problem) {
    return (
      <article className="card soft-card">
        <h2 className="card-title">Problem</h2>
        <p className="muted-text">Select a problem to see details.</p>
      </article>
    );
  }

  return (
    <article className="card soft-card dsa-practice-detail">
      <div className="dsa-practice-detail-header">
        <div>
          <h2 className="card-title">{problem.title}</h2>
          <p className="muted-text small">
            Pattern: {problem.pattern} • Difficulty: {problem.difficulty}
          </p>
        </div>
      </div>

      <div className="markdown-view">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description || ''}</ReactMarkdown>
      </div>

      <div className="dsa-practice-meta-grid">
        <div className="dsa-practice-meta">
          <h3 className="dsa-practice-section-title">Constraints</h3>
          {Array.isArray(problem.constraints) && problem.constraints.length > 0 ? (
            <ul className="dsa-list">
              {problem.constraints.map((c, idx) => (
                <li key={`${c}-${idx}`}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="muted-text small">No constraints provided.</p>
          )}
        </div>

        <div className="dsa-practice-meta">
          <h3 className="dsa-practice-section-title">Input Format</h3>
          <p className="muted-text">{problem.inputFormat}</p>
          <h3 className="dsa-practice-section-title">Output Format</h3>
          <p className="muted-text">{problem.outputFormat}</p>
        </div>
      </div>

      <h3 className="dsa-practice-section-title">Sample Test Cases</h3>
      {Array.isArray(problem.testCases) && problem.testCases.length > 0 ? (
        <div className="dsa-practice-samples">
          {problem.testCases.map((tc, idx) => (
            <div key={`sample-${idx}`} className="dsa-practice-sample card soft-card">
              <div className="dsa-practice-sample-grid">
                <div>
                  <div className="muted-text small">Input</div>
                  <pre className="dsa-practice-pre">{tc.input || '(empty)'}</pre>
                </div>
                <div>
                  <div className="muted-text small">Output</div>
                  <pre className="dsa-practice-pre">{tc.expectedOutput || '(empty)'}</pre>
                </div>
              </div>
              {tc.explanation ? (
                <p className="muted-text small dsa-practice-explanation">Explanation: {tc.explanation}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-text">No sample cases provided.</p>
      )}

      {problem.hintText ? (
        <div className="dsa-practice-hint">
          <h3 className="dsa-practice-section-title">Hint</h3>
          <p className="muted-text">{problem.hintText}</p>
        </div>
      ) : null}

      {typeof problem.totalTestCaseCount === 'number' ? (
        <p className="muted-text small">Submit will run {problem.totalTestCaseCount} total test cases (samples + hidden).</p>
      ) : null}
    </article>
  );
}
