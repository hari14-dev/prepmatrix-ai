import { Calculator, Bot, BarChart2, Trophy, Cpu } from 'lucide-react';

const HIGHLIGHTS = [
  { Icon:Calculator, text:'Comprehensive Aptitude, DSA & Core CS Vault' },
  { Icon:Bot,        text:'ATS Resume Auditor & Voice Mock Interviewer' },
  { Icon:BarChart2,  text:'Personalized Placement Readiness Index (75% Threshold)' },
  { Icon:Trophy,     text:'Timed Placement Assessment Contests' },
];

export function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="brand" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--tx-1)' }}>
              PrepMatrix <span style={{ color: 'var(--indigo-light)' }}>AI</span>
            </span>
          </div>
          <h1 className="auth-title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>{title}</h1>
          <p className="auth-subtitle" style={{ fontSize: '0.92rem', color: 'var(--tx-3)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{subtitle}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {HIGHLIGHTS.map(({Icon,text})=>(
              <div key={text} className="row" style={{ gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: 'var(--r-sm)', background: 'var(--indigo-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} strokeWidth={2} style={{ color: 'var(--indigo-light)' }}/>
                </div>
                <span className="muted-text small" style={{ fontSize: '0.85rem', color: 'var(--tx-2)', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
