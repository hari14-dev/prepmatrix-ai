export function TopicList({ topics, selectedKey, onSelect }) {
  return (
    <div className="dsa-practice-topics">
      <h2 className="card-title">Patterns</h2>
      {topics.length === 0 ? <p className="muted-text small">No patterns found.</p> : null}
      <div className="dsa-practice-topic-list">
        {topics.map((topic) => {
          const active = topic.pattern === selectedKey;
          return (
            <button
              key={topic.pattern}
              type="button"
              className={active ? 'dsa-practice-topic-btn active' : 'dsa-practice-topic-btn'}
              onClick={() => onSelect(topic.pattern)}
            >
              <div>
                <div className="dsa-practice-topic-title">{topic.pattern}</div>
                <div className="muted-text small">
                  {topic.solvedCount}/{topic.totalCount} solved
                </div>
              </div>
              <div className="dsa-practice-topic-score">{topic.masteryPercentage}%</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
