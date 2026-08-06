export function ProblemList({ problems, selectedSlug, onSelect }) {
  return (
    <div className="dsa-practice-problems">
      <h2 className="card-title">Problems</h2>
      {problems.length === 0 ? <p className="muted-text small">No problems for this pattern yet.</p> : null}
      <div className="dsa-practice-problem-list">
        {problems.map((problem) => {
          const active = problem.slug === selectedSlug;
          return (
            <button
              key={problem.id}
              type="button"
              className={active ? 'dsa-practice-problem-btn active' : 'dsa-practice-problem-btn'}
              onClick={() => onSelect(problem.slug)}
              title={problem.title}
            >
              <span className={problem.isSolved ? 'dsa-practice-status solved' : 'dsa-practice-status'}>
                {problem.isSolved ? '●' : '·'}
              </span>
              <span className="dsa-practice-problem-title">{problem.title}</span>
              <span className="pill">{problem.difficulty}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
