import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function DSAPatternProblemsPage() {
  const { pattern } = useParams();
  const decodedPattern = decodeURIComponent(String(pattern || ''));
  const { token } = useAuth();
  const [data, setData] = useState({ pattern: decodedPattern, problems: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !decodedPattern) {
      return;
    }

    setIsLoading(true);
    setError('');
    apiRequest(`/api/dsa/problems/${encodeURIComponent(decodedPattern)}`, { token })
      .then((response) => setData(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load problems'))
      .finally(() => setIsLoading(false));
  }, [decodedPattern, token]);

  if (isLoading) {
    return (
      <main className="center-screen">
        <span className="spinner" />
      </main>
    );
  }

  if (error) {
    return (
      <article className="card soft-card">
        <h2 className="card-title">Pattern Arena</h2>
        <p className="error-text">{error}</p>
      </article>
    );
  }

  return (
    <>
      <div className="section-header">
        <h1 className="hero-title">{data.pattern} Arena</h1>
        <p className="muted-text">Pick a problem and enter the coding workspace.</p>
      </div>

      <article className="card soft-card">
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.problems.map((problem) => (
                <tr key={problem.id}>
                  <td>
                    <label className="status-check" title={problem.isSolved ? 'Accepted' : 'Not accepted'}>
                      <input
                        aria-label={problem.isSolved ? 'Accepted' : 'Not accepted'}
                        checked={problem.isSolved}
                        className="checkbox"
                        disabled
                        readOnly
                        type="checkbox"
                      />
                    </label>
                  </td>
                  <td>{problem.title}</td>
                  <td>{problem.difficulty}</td>
                  <td>
                    <Link className="btn btn-primary" to={`/dashboard/dsa/problem/${problem.slug}`}>
                      Open IDE
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
