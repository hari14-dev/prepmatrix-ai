import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calculator, Code2, BookOpen, Trophy, Bot, ChevronRight } from 'lucide-react';
import { useBreadcrumbTrail } from '../../context/BreadcrumbContext.jsx';

const navItems = [
  { label: 'Home',     path: '/dashboard',          Icon: LayoutDashboard },
  { label: 'Aptitude', path: '/dashboard/aptitude', Icon: Calculator },
  { label: 'DSA',      path: '/dsa',                Icon: Code2 },
  { label: 'Core',     path: '/dashboard/core',     Icon: BookOpen },
  { label: 'Contests', path: '/dashboard/contests', Icon: Trophy },
  { label: 'AI Suite', path: '/dashboard/ai',       Icon: Bot },
];

export function AppShell({ user, onLogout, children, hideSidebar=false, mainOverflow=null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbTrail = useBreadcrumbTrail();
  const handleLogout = () => { onLogout(); navigate('/'); };

  // Only zero out padding for full-focus IDE/solving mode (explicit mainOverflow).
  // hideSidebar alone (topic sheets) should keep normal main-panel padding.
  const mainStyle = mainOverflow === 'hidden'
    ? { padding:0, overflow:'hidden' }
    : hideSidebar
      ? { overflow: mainOverflow || 'auto' }
      : undefined;

  return (
    <div className={mainOverflow === 'hidden' ? 'dashboard-page focus-mode' : 'dashboard-page'}
      style={mainOverflow === 'hidden' ? { height:'100vh', overflow:'hidden' } : undefined}>

      <header className={mainOverflow === 'hidden' ? 'dashboard-topbar focus-topbar' : 'dashboard-topbar'}>
        <div className="row">
          <Link to="/dashboard" style={{ textDecoration:'none' }}>
            <span className="brand">SP3</span>
          </Link>
        </div>
        <div className="row">
          <span style={{ fontSize:'0.875rem', color:'var(--tx-3)' }} className="user-name-display">
            {user?.fullName}
          </span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {breadcrumbTrail.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap',
            gap: '0.35rem', padding: '0.6rem 1.5rem',
            borderBottom: '1px solid var(--border-1, rgba(255,255,255,0.06))',
            fontSize: '0.82rem',
          }}
        >
          {breadcrumbTrail.map((crumb, i) => {
            const isLast = i === breadcrumbTrail.length - 1;
            return (
              <span key={`${crumb.label}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {i > 0 && <ChevronRight size={13} strokeWidth={2} style={{ color: 'var(--tx-3)', opacity: 0.6 }} />}
                {isLast || !crumb.to ? (
                  <span style={{ color: 'var(--tx-2)', fontWeight: 600 }}>{crumb.label}</span>
                ) : (
                  <Link to={crumb.to} style={{ color: 'var(--tx-3)', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--tx-1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--tx-3)'; }}>
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      )}

      <div className={mainOverflow === 'hidden' ? 'dashboard-layout focus-layout' : 'dashboard-layout'}>
        {!hideSidebar && (
          <aside className="sidebar">
            <p className="sidebar-title">Navigation</p>
            <ul style={{ display:'flex', flexDirection:'column', gap:'0.15rem' }}>
              {navItems.map(({ label, path, Icon }) => {
                const isActive = path==='/dashboard' ? location.pathname==='/dashboard' : location.pathname.startsWith(path);
                return (
                  <li key={path}>
                    <Link className={isActive ? 'menu-link active' : 'menu-link'} to={path}>
                      <span className="menu-icon"><Icon size={16} strokeWidth={1.75} /></span>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
        <main className={mainOverflow === 'hidden' ? 'main-panel focus-main-panel' : 'main-panel'} style={mainStyle}>
          {children}
        </main>
      </div>

      {!hideSidebar && (
        <nav className="mobile-nav">
          {navItems.map(({ label, path, Icon }) => {
            const isActive = path==='/dashboard' ? location.pathname==='/dashboard' : location.pathname.startsWith(path);
            return (
              <Link key={path} className={isActive ? 'mobile-nav-item active' : 'mobile-nav-item'} to={path}>
                <span className="icon"><Icon size={20} strokeWidth={1.75} /></span>
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}