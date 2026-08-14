import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Code2, BookOpen, FileText, Mic, Trophy, Rocket, Sparkles } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';

const FEATURES = [
  { Icon:Calculator, title:'Aptitude & Logic',    desc:'Topic-wise quant, logical, and verbal preparation with curated mock tests.' },
  { Icon:Code2,      title:'DSA Practice',        desc:'Pattern-based DSA curriculum with a built-in IDE. Run code in C++, Java, Python.' },
  { Icon:BookOpen,   title:'Core Subjects Vault', desc:'OS, DBMS, CN, OOP — interview MCQs, concept articles, and an AI assistant.' },
  { Icon:FileText,   title:'AI Resume Auditor',   desc:'Paste your resume text, get an ATS score and skill gap analysis.' },
  { Icon:Mic,        title:'Mock Interview',       desc:'Voice-based AI interview simulator with real-time scoring.' },
  { Icon:Trophy,     title:'Practice Contests',    desc:'Timed, mixed-format contests across Aptitude, Core Subjects, and DSA, scored instantly.' },
];

// Falls back to '—' rather than a made-up number if the API call hasn't
// resolved yet (or fails), so the page never shows a fabricated stat.
function StatBox({ label, value }) {
  return (
    <div className="metric-box">
      <p className="muted-text small">{label}</p>
      <p style={{ fontSize:"1.5rem", fontWeight:800, color:"var(--indigo-light)", marginTop:"0.2rem" }}>
        {value ?? '—'}
      </p>
    </div>
  );
}

export function LandingPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiRequest('/api/public/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <main className="page">
      <div className="container">
        <nav className="topbar card soft-card">
          <span className="brand">PrepMatrix <span style={{ color: 'var(--indigo-light)' }}>AI</span></span>
          <div className="row">
            <Link className="btn btn-outline" to="/login">Login</Link>
            <Link className="btn btn-primary btn-glow" to="/signup">Get Started</Link>
          </div>
        </nav>

        <section className="hero-grid animate-in">
          <div>
            <span className="pill" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', marginBottom:'1rem' }}>
              <Rocket size={13} strokeWidth={2}/>Smart Placement Preparation Platform
            </span>
            <h1 className="hero-title" style={{ marginBottom:'1rem' }}>
              Everything you need to{" "}
              <span style={{ color: 'var(--indigo-light)' }}>
                crack placements
              </span>
            </h1>
            <p className="muted-text" style={{ fontSize:"1.05rem", maxWidth:480 }}>
              PrepMatrix AI combines AI-powered interview prep, DSA practice, aptitude training, and core subject revision — all trackable in one platform.
            </p>
            <div className="row wrap gap-md" style={{ marginTop:"2rem" }}>
              <Link className="btn btn-primary btn-glow" to="/signup" style={{ padding:"0.75rem 1.75rem", fontSize:"1rem" }}>
                Create Free Account
              </Link>
              <Link className="btn btn-outline" to="/login">Already a member?</Link>
            </div>
          </div>
          <div className="card metrics-card soft-card feature-card">
            <p className="pill pill-green" style={{ marginBottom:"1rem", width:"fit-content" }}>Platform Content</p>
            <h2 className="section-title">Platform at a Glance</h2>
            <div className="metrics-grid">
              <StatBox label="Topics Covered" value={stats && `${stats.topicsCovered}+`} />
              <StatBox label="DSA Problems"   value={stats && `${stats.dsaProblems}+`} />
              <StatBox label="MCQ Bank"       value={stats && `${stats.mcqBank}+`} />
              <StatBox label="AI Features"    value={stats?.aiFeatures} />
            </div>
            <div className="row" style={{ marginTop:"0.9rem", gap:"0.4rem", alignItems:"center" }}>
              <Sparkles size={14} style={{ color:"var(--indigo-light)" }}/>
              <span style={{ fontSize:"0.8rem", color:"var(--tx-3)" }}>
                Your own Readiness Score builds up as you practice, right from your dashboard.
              </span>
            </div>
          </div>
        </section>

        <section style={{ marginTop:"4rem" }}>
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <h2 className="hero-title" style={{ fontSize:"1.8rem" }}>Everything in one platform</h2>
            <p className="muted-text">Six powerful modules, one preparation journey.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map(({Icon,title,desc})=>(
              <article key={title} className="card feature-card">
                <div className="feature-icon" style={{ background:"var(--indigo-dim)", border:"1px solid var(--b-3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon size={22} strokeWidth={1.75} style={{ color:"var(--indigo-light)" }}/>
                </div>
                <h3 className="card-title">{title}</h3>
                <p className="muted-text small">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ textAlign:"center", marginTop:"4rem", padding:"3rem 0" }}>
          <p className="pill" style={{ marginBottom:"1.5rem" }}>Start today — free</p>
          <h2 className="hero-title" style={{ fontSize:"2rem", marginBottom:"1rem" }}>Ready to begin?</h2>
          <p className="muted-text" style={{ marginBottom:"2rem" }}>Create an account and start building your placement readiness today.</p>
          <Link className="btn btn-primary btn-glow" to="/signup" style={{ padding:"0.85rem 2.5rem", fontSize:"1rem" }}>
            Create your free account →
          </Link>
        </section>
      </div>
    </main>
  );
}
