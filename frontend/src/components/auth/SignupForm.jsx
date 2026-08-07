/**
 * SignupForm.jsx  —  Step 1: Details -> Step 2: 6-Digit OTP Verification
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { GoogleLoginButton } from './GoogleLoginButton.jsx';

export function SignupForm({ onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP Verification
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await apiRequest('/api/auth/send-otp', {
        method: 'POST',
        body: { fullName, email, password }
      });
      if (response.otp) {
        setDevOtp(response.otp);
      }
      setStep(2);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        body: { email, otp: otpCode }
      });
      onSuccess(response.data);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your PrepMatrix AI Account"
      subtitle="Start your guided placement preparation with trackable readiness metrics from day one."
    >
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="auth-card" style={{ border: '1px solid var(--b-2)', borderRadius: 'var(--r-xl)', background: 'var(--bg-card)', padding: '2rem' }}>
          <div>
            <h2 className="section-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Sign Up</h2>
            <p className="muted-text small" style={{ marginTop: '0.25rem', color: 'var(--tx-4)' }}>
              Step 1 of 2: Create account credentials
            </p>
          </div>

          <GoogleLoginButton
            onSuccess={(data) => { onSuccess(data); navigate('/dashboard'); }}
            onError={setErrorMessage}
          />

          <div className="row" style={{ alignItems: 'center', gap: '0.6rem', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--b-2)' }} />
            <span className="muted-text small" style={{ color: 'var(--tx-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>or register email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--b-2)' }} />
          </div>

          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#fca5a5', fontSize: '0.82rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <label className="field">
            <span className="label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx-2)' }}>Full Name</span>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-4)' }} />
              <input
                className="input"
                type="text"
                placeholder="Arjun Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                autoComplete="name"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </label>

          <label className="field">
            <span className="label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx-2)' }}>Email Address</span>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-4)' }} />
              <input
                className="input"
                type="email"
                placeholder="you@institution.edu"
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
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
            {isSubmitting ? 'Generating Verification Code…' : 'Send Verification Code →'}
          </button>

          <p className="helper-text" style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--tx-3)' }}>
            Already have an account?{' '}
            <Link to="/login" className="btn-link" style={{ fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        /* ── Step 2: 6-Digit OTP Verification ── */
        <form onSubmit={handleVerifyOtp} className="auth-card" style={{ border: '1px solid var(--b-2)', borderRadius: 'var(--r-xl)', background: 'var(--bg-card)', padding: '2rem' }}>
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'var(--tx-3)', fontSize: '0.82rem', cursor: 'pointer', padding: 0, marginBottom: '0.75rem' }}
            >
              <ArrowLeft size={14} /> Back to details
            </button>
            <h2 className="section-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Verify Email</h2>
            <p className="muted-text small" style={{ marginTop: '0.25rem', color: 'var(--tx-4)' }}>
              Step 2 of 2: Enter the 6-digit verification code sent to <strong style={{ color: 'var(--tx-1)' }}>{email}</strong>
            </p>
          </div>

          {devOtp && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--indigo-light)', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>Local Dev Verification Code:</span>
                <strong style={{ fontSize: '1.1rem', letterSpacing: '0.15em' }}>{devOtp}</strong>
              </div>
            </div>
          )}

          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#fca5a5', fontSize: '0.82rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <label className="field">
            <span className="label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx-2)' }}>6-Digit Verification Code</span>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-4)' }} />
              <input
                className="input"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                required
                style={{ paddingLeft: 38, fontSize: '1.1rem', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase' }}
              />
            </div>
          </label>

          <button
            className="btn btn-primary btn-glow"
            disabled={isSubmitting || otpCode.length < 6}
            type="submit"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}
          >
            {isSubmitting ? 'Verifying Code…' : 'Verify & Create Account →'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
