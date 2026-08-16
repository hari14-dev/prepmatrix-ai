import { useState, useEffect } from 'react';
import { User, UserCheck, Award, Flame, LogOut, Sparkles, FileText, Mic, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiRequest } from '../../lib/api.js';

export function UserProfilePage() {
  const { token, user, updateUser, logout } = useAuth();
  
  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');

  // Status & feedback
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;
    apiRequest('/api/auth/dashboard-stats', { token })
      .then(res => setStats(res.data))
      .catch(() => {});
  }, [token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');

    try {
      const res = await apiRequest('/api/auth/profile', {
        method: 'PUT',
        token,
        body: { fullName }
      });

      setProfileMsg('Profile updated successfully!');
      if (res.data?.user && updateUser) {
        updateUser(res.data.user);
      }
    } catch (err) {
      setProfileMsg(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const readinessScore = stats?.readinessScore ?? user?.readinessScore ?? 0;
  const streakDays = stats?.streakDays ?? user?.streakDays ?? 0;
  const dsaSolved = stats?.dsaSolved ?? 0;
  const aptitudeSolved = stats?.modules?.aptitude?.solved ?? 0;
  const coreSolved = stats?.modules?.core?.solved ?? 0;
  const isPlacementReady = readinessScore >= 75;

  return (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 960, margin: '0 auto', paddingBottom: '2rem' }}>
      
      {/* ── Header Profile Banner ── */}
      <div className="card soft-card animate-in" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 99,
            background: 'var(--indigo-dim)', border: '2px solid var(--indigo-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 800, color: 'var(--indigo-light)'
          }}>
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={36} />}
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--tx-1)', marginBottom: '0.2rem' }}>
              {user?.fullName || 'SDE Candidate'}
            </h1>
            <p className="muted-text small" style={{ fontSize: '0.88rem' }}>
              {user?.email}
            </p>
          </div>

          {/* Readiness Benchmark Pill */}
          <div style={{
            background: isPlacementReady ? 'rgba(74,155,143,0.12)' : 'rgba(58,92,216,0.12)',
            border: `1px solid ${isPlacementReady ? 'var(--green)' : 'rgba(58,92,216,0.3)'}`,
            padding: '0.75rem 1.25rem', borderRadius: 'var(--r-lg)',
            display: 'flex', alignItems: 'center', gap: '0.85rem'
          }}>
            <Award size={32} style={{ color: isPlacementReady ? 'var(--green)' : 'var(--indigo-light)' }} />
            <div>
              <span className="t-xs" style={{ color: 'var(--tx-3)', fontWeight: 600, display: 'block' }}>
                Placement Status
              </span>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: isPlacementReady ? 'var(--green)' : 'var(--tx-1)' }}>
                {isPlacementReady ? 'Placement Ready 🏆 (75%+)' : `Readiness: ${readinessScore}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2-Column Split Layout ── */}
      <div className="profile-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        
        {/* Left Column: Profile Form & AI Launchpad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Profile Information Form */}
          <form onSubmit={handleProfileSubmit} className="card soft-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={18} style={{ color: 'var(--indigo-light)' }} /> Profile Information
              </h2>
              <p className="muted-text small">Update your candidate display name for your portal profile.</p>
            </div>

            <div>
              <label className="label">Full Name</label>
              <input
                type="text" className="input"
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name" required
              />
            </div>

            {profileMsg && (
              <p className="t-xs" style={{ color: profileMsg.includes('successfully') ? 'var(--green)' : 'var(--amber)' }}>
                {profileMsg}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-glow" disabled={profileSaving} style={{ marginTop: '0.25rem' }}>
              {profileSaving ? 'Saving Profile…' : 'Save Profile'}
            </button>
          </form>

          {/* Quick AI Practice Launchpad */}
          <div className="card soft-card" style={{ padding: '1.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--indigo-light)' }} /> AI Practice Launchpad
            </h2>
            <p className="muted-text small" style={{ marginBottom: '1rem' }}>
              Elevate your placement readiness with AI-powered resume and voice evaluation.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <Link to="/dashboard/ai" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--b-1)', borderRadius: 'var(--r-md)',
                  padding: '1rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'transform 0.15s, border-color 0.15s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--indigo-light)', fontWeight: 700, fontSize: '0.88rem' }}>
                    <FileText size={16} /> Resume Audit
                  </div>
                  <span className="muted-text small" style={{ fontSize: '0.78rem' }}>ATS scoring & skill gap breakdown</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--indigo-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    Audit Now <ArrowRight size={13} />
                  </span>
                </div>
              </Link>

              <Link to="/dashboard/ai" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--b-1)', borderRadius: 'var(--r-md)',
                  padding: '1rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'transform 0.15s, border-color 0.15s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--cyan)', fontWeight: 700, fontSize: '0.88rem' }}>
                    <Mic size={16} /> Voice Interview
                  </div>
                  <span className="muted-text small" style={{ fontSize: '0.78rem' }}>Real-time voice AI interview practice</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    Start Voice AI <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Readiness Stats & Account Session */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Performance Summary Card */}
          <div className="card soft-card" style={{ padding: '1.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={18} style={{ color: 'var(--amber)' }} /> Performance Snapshot
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--b-1)' }}>
                <span className="muted-text small" style={{ fontSize: '0.78rem' }}>Daily Streak</span>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.2rem' }}>
                  {streakDays} Days 🔥
                </p>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--b-1)' }}>
                <span className="muted-text small" style={{ fontSize: '0.78rem' }}>DSA Solved</span>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--indigo-light)', marginTop: '0.2rem' }}>
                  {dsaSolved} Problems
                </p>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--b-1)' }}>
                <span className="muted-text small" style={{ fontSize: '0.78rem' }}>Aptitude Solved</span>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.2rem' }}>
                  {aptitudeSolved}
                </p>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--b-1)' }}>
                <span className="muted-text small" style={{ fontSize: '0.78rem' }}>Core CS Solved</span>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--violet)', marginTop: '0.2rem' }}>
                  {coreSolved}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Section Card */}
          <div className="card soft-card" style={{ padding: '1.25rem' }}>
            <h2 className="section-title" style={{ fontSize: '1rem', color: 'var(--tx-1)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <LogOut size={16} style={{ color: 'var(--tx-2)' }} /> Account Session
            </h2>
            <p className="muted-text small" style={{ margin: '0.3rem 0 0.85rem 0', fontSize: '0.82rem' }}>
              Safely log out of your candidate portal session on this device.
            </p>
            <button
              onClick={logout}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontWeight: 600 }}
            >
              Log Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}