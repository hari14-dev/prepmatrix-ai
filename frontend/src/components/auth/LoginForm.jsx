/**
 * LoginForm.jsx
 * Login page — wrapped inside AuthLayout.
 * Calls POST /api/auth/login and hands the token+user to onSuccess().
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { GoogleLoginButton } from './GoogleLoginButton.jsx';

export function LoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      onSuccess(response.data);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back to SP3"
      subtitle="Login to continue your preparation journey and track your readiness score."
    >
      <form onSubmit={handleSubmit} className="auth-card">
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>Login</h2>
          <p className="muted-text small" style={{ marginTop: '0.25rem' }}>
            Enter your credentials to continue
          </p>
        </div>

        <GoogleLoginButton
          onSuccess={(data) => { onSuccess(data); navigate('/dashboard'); }}
          onError={setErrorMessage}
        />

        <div className="row" style={{ alignItems: 'center', gap: '0.6rem', margin: '0.25rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--b-2)' }} />
          <span className="muted-text small">or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--b-2)' }} />
        </div>

        <label className="field">
          <span className="label">Email address</span>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="current-password"
          />
        </label>

        {/* Error message shown on failed login */}
        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

        <button
          className="btn btn-primary btn-glow"
          disabled={isSubmitting}
          type="submit"
          style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem' }}
        >
          {isSubmitting ? 'Logging in…' : 'Login →'}
        </button>

        <p className="helper-text">
          New here?{' '}
          <Link className="btn-link" to="/signup">
            Create your free account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
