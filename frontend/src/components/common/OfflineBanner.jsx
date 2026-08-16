import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showRestored) {
    return (
      <div style={{
        background: 'rgba(34,197,94,0.92)',
        color: '#fff',
        padding: '0.45rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        zIndex: 1100,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease'
      }}>
        <Wifi size={15} />
        <span>Internet connection restored! You are back online.</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div style={{
      background: 'rgba(239,68,68,0.92)',
      color: '#fff',
      padding: '0.5rem 1rem',
      fontSize: '0.82rem',
      fontWeight: 600,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      zIndex: 1100,
      backdropFilter: 'blur(8px)'
    }}>
      <WifiOff size={15} />
      <span>You are currently offline. Check your internet connection for real-time AI and practice features.</span>
    </div>
  );
}
