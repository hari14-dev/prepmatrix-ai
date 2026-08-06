/**
 * SignupForm.jsx
 * Registration page — wrapped inside AuthLayout.
 * Calls POST /api/auth/register with fullName, email, password.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { GoogleLoginButton } from './GoogleLoginButton.jsx';

export function SignupForm({ onSuccess }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { fullName, email, password }
      });
      onSuccess(response.data);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your SP3 account"
      subtitle="Start your guided placement preparation with trackable progress from day one."
    >
      <form onSubmit={handleSubmit} className="auth-card">
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>Sign Up</h2>
          <p className="muted-text small" style={{ marginTop: '0.25rem' }}>
            Free forever — no credit card needed
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
          <span className="label">Full name</span>
          <input
            className="input"
            type="text"
            placeholder="Arjun Kumar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
          />
        </label>

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

        <button
          className="btn btn-primary btn-glow"
          disabled={isSubmitting}
          type="submit"
          style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem' }}
        >
          {isSubmitting ? 'Creating account…' : 'Create account →'}
        </button>

        <p className="helper-text">
          Already have an account?{' '}
          <Link className="btn-link" to="/login">
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
