/**
 * GoogleLoginButton.jsx
 * Renders Google's official "Sign in with Google" button using Google
 * Identity Services (the accounts.google.com/gsi/client script loaded in
 * index.html). On success it POSTs the returned ID token credential to
 * /api/auth/google, which verifies it server-side and returns the same
 * { token, user } shape as email/password login — so it plugs straight
 * into the existing onSuccess() flow used by LoginForm/SignupForm.
 *
 * If VITE_GOOGLE_CLIENT_ID isn't set, this renders nothing rather than a
 * broken button — Google login is an optional feature, not a hard
 * requirement to run the app.
 */
import { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../lib/api.js';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export function GoogleLoginButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    let cancelled = false;

    const handleCredentialResponse = async (response) => {
      try {
        const result = await apiRequest('/api/auth/google', {
          method: 'POST',
          body: { credential: response.credential }
        });
        onSuccess(result.data);
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'Google sign-in failed');
      }
    };

    // The GSI script loads async — poll briefly until window.google is available.
    const tryInit = () => {
      if (cancelled) return;
      if (!window.google?.accounts?.id) {
        setTimeout(tryInit, 100);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          shape: 'rectangular',
          text: 'continue_with'
        });
      }
      setIsReady(true);
    };

    tryInit();
    return () => { cancelled = true; };
  }, [onSuccess, onError]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: isReady ? 'auto' : 44 }}>
      <div ref={buttonRef} />
    </div>
  );
}
