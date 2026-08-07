/**
 * LoginForm.jsx
 * Login page — wrapped inside AuthLayout.
 * Calls POST /api/auth/login and hands the token+user to onSuccess().
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { GoogleLoginButton } from './GoogleLoginButton.jsx';

export function LoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      title="Welcome back to PrepMatrix AI"
      subtitle="Sign in to your candidate portal to practice DSA, CS subjects, and track your readiness score."
    >
      <form onSubmit={handleSubmit} className="auth-card" style={{ border: '1px solid var(--b-2)', borderRadius: 'var(--r-xl)', background: 'var(--bg-card)', padding: '2rem' }}>
        <div>
          <h2 className="section-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Sign In</h2>
          <p className="muted-text small" style={{ marginTop: '0.25rem', color: 'var(--tx-4)' }}>
            Enter your email and password to access your dashboard
          </p>
        </div>

        <GoogleLoginButton
          onSuccess={(data) => { onSuccess(data); navigate('/dashboard'); }}
          onError={setErrorMessage}
        />

        <div className="row" style={{ alignItems: 'center', gap: '0.6rem', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--b-2)' }} />
          <span className="muted-text small" style={{ color: 'var(--tx-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>or email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--b-2)' }} />
        </div>

        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#fca5a5', fontSize: '0.82rem' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <label className="field">
          <span className="label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx-2)' }}>Email Address</span>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-4)' }} />
            <input
              className="input"
              type="email"
              placeholder="name@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ paddingLeft: 38 }}
            />
          </div>
        </label>

        <label className="field">
          <span className="label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx-2)' }}>Password</span>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-4)' }} />
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
              style={{ paddingLeft: 38, paddingRight: 38 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--tx-4)', cursor: 'pointer', padding: 0 }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <button
          className="btn btn-primary btn-glow"
          disabled={isSubmitting}
          type="submit"
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}
        >
          {isSubmitting ? 'Signing in…' : 'Sign In to Dashboard →'}
        </button>

        <p className="helper-text" style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--tx-3)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="btn-link" style={{ fontWeight: 700 }}>
            Sign up for free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
