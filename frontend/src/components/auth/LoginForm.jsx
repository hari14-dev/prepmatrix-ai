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

  // Password Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & New Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetSending, setResetSending] = useState(false);

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

  const openResetModal = () => {
    setShowResetModal(true);
    setResetStep(1);
    setResetEmail(email);
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setDevOtpHint('');
    setResetMsg('');
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setResetSending(true);
    setResetMsg('');
    setDevOtpHint('');

    try {
      const res = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: resetEmail }
      });
      setResetMsg(res.message || 'Verification code sent to your email.');
      if (res.dev && res.otp) {
        setDevOtpHint(res.otp);
      }
      setResetStep(2);
    } catch (err) {
      setResetMsg(err.message || 'Failed to send reset code. Try again.');
    } finally {
      setResetSending(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');

    if (newPassword.length < 6) {
      setResetMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetMsg('Passwords do not match.');
      return;
    }

    setResetSending(true);
    try {
      const res = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: {
          email: resetEmail,
          otp: resetOtp,
          newPassword
        }
      });
      setResetMsg('Password reset successfully! Redirecting to login…');
      setEmail(resetEmail);
      setTimeout(() => {
        setShowResetModal(false);
        setResetStep(1);
      }, 1500);
    } catch (err) {
      setResetMsg(err.message || 'Failed to reset password. Please check your verification code.');
    } finally {
      setResetSending(false);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx-2)' }}>Password</span>
            <button
              type="button"
              onClick={openResetModal}
              style={{ background: 'none', border: 'none', color: 'var(--indigo-light)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Forgot password?
            </button>
          </div>
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

      {/* 2-Step Forgot Password Modal */}
      {showResetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card soft-card" style={{ maxWidth: 440, width: '100%', padding: '1.75rem', borderRadius: 'var(--r-xl)', background: 'var(--bg-elevated)', border: '1px solid var(--b-2)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--tx-1)', marginBottom: '0.35rem' }}>
              {resetStep === 1 ? 'Forgot Password?' : 'Enter Code & New Password'}
            </h3>
            <p className="t-xs" style={{ color: 'var(--tx-3)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {resetStep === 1
                ? 'Enter your registered email address to receive a 6-digit verification code.'
                : `Enter the verification code sent to ${resetEmail} along with your new password.`}
            </p>

            {devOtpHint && (
              <div style={{ background: 'rgba(58,92,216,0.15)', border: '1px dashed var(--indigo-light)', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--tx-1)' }}>
                <strong>Dev Mode Code:</strong> <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--indigo-light)' }}>{devOtpHint}</code>
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email Address</label>
                  <input
                    type="email" className="input"
                    value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@institution.edu" required
                  />
                </div>

                {resetMsg && (
                  <p className="t-xs" style={{ color: resetMsg.includes('sent') || resetMsg.includes('success') ? 'var(--green)' : 'var(--amber)' }}>
                    {resetMsg}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="button" className="btn btn-secondary btn-sm"
                    onClick={() => setShowResetModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" className="btn btn-primary btn-sm"
                    disabled={resetSending}
                  >
                    {resetSending ? 'Sending Code…' : 'Send Verification Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>6-Digit Verification Code</label>
                  <input
                    type="text" className="input"
                    value={resetOtp} onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="e.g. 123456" maxLength={6} required
                    style={{ letterSpacing: '2px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className="input"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters" minLength={6} required
                      style={{ paddingRight: 38 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--tx-4)', cursor: 'pointer', padding: 0 }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Confirm New Password</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="input"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password" minLength={6} required
                  />
                </div>

                {resetMsg && (
                  <p className="t-xs" style={{ color: resetMsg.includes('successfully') ? 'var(--green)' : 'var(--amber)' }}>
                    {resetMsg}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button
                    type="button" className="btn-link" style={{ fontSize: '0.8rem' }}
                    onClick={() => setResetStep(1)}
                  >
                    ← Change Email
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button" className="btn btn-secondary btn-sm"
                      onClick={() => setShowResetModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" className="btn btn-primary btn-sm"
                      disabled={resetSending}
                    >
                      {resetSending ? 'Resetting Password…' : 'Reset Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

