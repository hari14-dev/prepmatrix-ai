/**
 * CoreSubjectsHubPage — 2×2 grid, no emojis, skeleton loading.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, Database, Network, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CATS = [
  { key:'OS',   label:'Operating Systems', sub:'Processes, Memory, Scheduling',     Icon:Cpu,      accent:'var(--cyan)',   dim:'var(--cyan-dim)'   },
  { key:'DBMS', label:'DBMS',              sub:'SQL, Normalization, Transactions',   Icon:Database, accent:'var(--amber)',  dim:'var(--amber-dim)'  },
  { key:'CN',   label:'Computer Networks', sub:'OSI, TCP/IP, Protocols',             Icon:Network,  accent:'var(--green)',  dim:'var(--green-dim)'  },
  { key:'OOP',  label:'OOP Concepts',      sub:'Polymorphism, Inheritance, Patterns',Icon:Layers,   accent:'var(--violet)', dim:'var(--violet-dim)' },
];

export function CoreSubjectsHubPage() {
  const { token } = useAuth();
  const [hub, setHub] = useState({ OS:[], DBMS:[], CN:[], OOP:[], OOPS:[] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    apiRequest('/api/core-subjects/hub', { token })
      .then(r => setHub(r.data))
      .catch(e => setError(e.message||'Failed to load'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const allTopics  = Object.values(hub).flat();
  const doneTopics = allTopics.filter(t=>t.completionPercentage===100).length;
  const totalPct   = allTopics.length>0 ? Math.round(doneTopics/allTopics.length*100) : 0;

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div className="page-header-block">
        <h1 className="page-main-title">Core Subjects Vault</h1>
        <p style={{ color:'var(--tx-3)', fontSize:'0.9rem', marginTop:'0.3rem', marginBottom:'0.75rem' }}>
          Concept articles + MCQ practice for every interview topic.
        </p>
        {!isLoading && allTopics.length>0 && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', flexWrap:'wrap' }}>
            <div className="solved-chip">
              <CheckCircle2 size={12} strokeWidth={2} style={{ color:'var(--green)' }} />
              <span>{doneTopics} / {allTopics.length} topics done</span>
            </div>
            <div className="mini-bar-wrap" style={{ maxWidth:180 }}>
              <div className="mini-bar-fill" style={{ width:`${totalPct}%` }} />
            </div>
            <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--indigo-light)' }}>{totalPct}%</span>
          </div>
        )}
      </div>

      {error && <p className="error-text" style={{ marginBottom:'1rem' }}>{error}</p>}

      <div className="subjects-grid">
        {CATS.map(cat => {
              const topics = hub[cat.key] || (cat.key === 'OOP' ? hub.OOPS : []) || [];
              const avg = topics.length>0 ? Math.round(topics.reduce((s,t)=>s+(t.completionPercentage||0),0)/topics.length) : 0;
              return (
                <article key={cat.key} className="subject-card">
                  {/* Header */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.6rem' }}>
                    <div style={{ width:38, height:38, borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', background:cat.dim, border:`1px solid ${cat.accent}30`, flexShrink:0 }}>
                      <cat.Icon size={18} strokeWidth={1.75} style={{ color:cat.accent }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:700, fontSize:'0.9375rem', color:'var(--tx-1)', lineHeight:1.3 }}>{cat.label}</p>
                      <p style={{ fontSize:'0.72rem', color:'var(--tx-4)', marginTop:2 }}>{cat.sub}</p>
                    </div>
                    <span style={{ fontSize:'1.05rem', fontWeight:800, color:cat.accent, flexShrink:0 }}>{avg}%</span>
                  </div>
                  <div className="mini-bar-wrap" style={{ marginBottom:'0.85rem' }}>
                    <div className="mini-bar-fill" style={{ width:`${avg}%`, background:cat.accent }} />
                  </div>
                  {/* Topic rows */}
                  <div className="subject-card-topics">
                    {topics.length===0
                      ? <p style={{ fontSize:'0.8rem', color:'var(--tx-4)', padding:'0.5rem 0' }}>No topics yet.</p>
                      : topics.map(t => (
                          <Link key={t.slug} to={`/dashboard/core/topic/${t.slug}`} className="topic-row">
                            <span className="topic-row-name">{t.title}</span>
                            <span style={{ display:'flex', alignItems:'center', gap:'0.3rem', flexShrink:0 }}>
                              {t.completionPercentage===100
                                ? <CheckCircle2 size={14} strokeWidth={2} style={{ color:'var(--green)' }} />
                                : <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--tx-4)' }}>{t.completionPercentage}%</span>
                              }
                              <ChevronRight size={13} strokeWidth={2} style={{ color:'var(--tx-4)' }} />
                            </span>
                          </Link>
                        ))
                    }
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );
}