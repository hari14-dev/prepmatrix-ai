import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ProblemDescription({ problem }) {
  if (!problem) {
    return null;
  }

  // Find the first public test case
  const firstPublicTestCase = (problem.testCases || []).find((test) =>
    typeof test.isPublic === 'boolean' ? test.isPublic : !test.isHidden
  );
  const sampleInput = problem.sampleInput || firstPublicTestCase?.input || '';
  const sampleOutput = problem.sampleOutput || firstPublicTestCase?.expectedOutput || '';

  return (
    <div className="problem-description-section">
      <div className="problem-description-block">
        <h3 className="dsa-section-heading">Statement</h3>
        <div className="markdown-view dsa-pane-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description || ''}</ReactMarkdown>
        </div>
      </div>

      {problem.inputFormat || problem.outputFormat ? (
        <div className="problem-formats-block">
          {problem.inputFormat ? (
            <div className="format-subsection">
              <h4 className="format-subheading">Input Format</h4>
              <p className="dsa-pane-body">{problem.inputFormat}</p>
            </div>
          ) : null}

          {problem.outputFormat ? (
            <div className="format-subsection">
              <h4 className="format-subheading">Output Format</h4>
              <p className="dsa-pane-body">{problem.outputFormat}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {sampleInput || sampleOutput ? (
        <div className="problem-sample-block">
          <h4 className="format-subheading">Sample Input</h4>
          <div className="mockup-code sample-code-block">
            <pre className="sample-input-pre">{sampleInput || '(empty)'}</pre>
          </div>
          <h4 className="format-subheading">Sample Output</h4>
          <div className="mockup-code sample-code-block">
            <pre className="sample-input-pre">{sampleOutput || '(empty)'}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
