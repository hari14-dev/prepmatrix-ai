import { Calculator, Bot, BarChart2, Trophy } from 'lucide-react';

const HIGHLIGHTS = [
  { Icon:Calculator, text:'Aptitude, DSA & Core Subjects' },
  { Icon:Bot,        text:'AI Resume Audit & Mock Interview' },
  { Icon:BarChart2,  text:'Personalized Readiness Score' },
  { Icon:Trophy,     text:'Timed Practice Contests' },
];

export function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <span className="brand" style={{ fontSize:"1.6rem", display:"block", marginBottom:"0.75rem" }}>SP3</span>
          <span className="pill" style={{ display:"inline-block", marginBottom:"1rem" }}>Smart Placement Preparation Platform</span>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.55rem", marginTop:"1rem" }}>
            {HIGHLIGHTS.map(({Icon,text})=>(
              <div key={text} className="row" style={{ gap:"0.6rem" }}>
                <Icon size={14} strokeWidth={1.75} style={{ color:"var(--indigo-light)", flexShrink:0 }}/>
                <span className="muted-text small">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
