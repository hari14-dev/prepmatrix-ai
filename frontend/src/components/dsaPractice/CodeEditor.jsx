const languageOptions = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python3', label: 'Python' }
];

export function CodeEditor({ language, onChangeLanguage, code, onChangeCode, onRun, onSubmit, isRunning, isSubmitting }) {
  return (
    <article className="card soft-card dsa-practice-editor">
      <div className="dsa-practice-editor-header">
        <h2 className="card-title">Editor</h2>
        <div className="row wrap">
          <select className="input dsa-practice-select" value={language} onChange={(e) => onChangeLanguage(e.target.value)}>
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" type="button" onClick={onRun} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button className="btn btn-primary" type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <textarea
        className="textarea dsa-practice-textarea"
        value={code}
        onChange={(e) => onChangeCode(e.target.value)}
        placeholder="Write full code from scratch here (read stdin, write stdout)."
        rows={18}
        spellCheck={false}
      />

      <p className="muted-text small">No boilerplate is provided. Your solution must include full I/O handling.</p>
    </article>
  );
}
