/**
 * DashboardHome — real data from /api/auth/dashboard-stats
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Code2, BookOpen, Bot, Flame, ChevronRight, TrendingUp, Target, Layers, Trophy } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ACTIONS = [
  { title:'Aptitude Practice',   sub:'Quant, Logical & Verbal',      Icon:Calculator, to:'/dashboard/aptitude', accent:'var(--cyan)'         },
  { title:'DSA Workspace',       sub:'Pattern-based problems + IDE',  Icon:Code2,      to:'/dsa',               accent:'var(--indigo-light)'  },
  { title:'Core Subjects Vault', sub:'OS, DBMS, CN, OOPS',           Icon:BookOpen,   to:'/dashboard/core',    accent:'var(--violet)'        },
  { title:'AI Career Suite',     sub:'Resume audit + mock interview', Icon:Bot,        to:'/dashboard/ai',      accent:'var(--green)'         },
];

const HM_BG=['rgba(58,92,216,0.05)','rgba(58,92,216,0.2)','rgba(58,92,216,0.45)','rgba(58,92,216,0.7)','var(--indigo)'];
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAY_ROW_LABELS = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };
const LEVEL_LABELS = ['No activity', 'Some activity', 'Moderate activity', 'High activity', 'Peak activity'];

// Turns the flat 182-entry `heatmap` array (oldest → today, from the backend)
// into GitHub/LeetCode-style weeks: columns = calendar weeks (Sun–Sat),
// rows = day of week. The backend only sends activity *levels*, so we
// recompute each day's actual date client-side using the same "last N
// days ending today, in UTC" logic the backend uses — that's enough to
// pair every level with a real calendar date without an API change.
function buildHeatmapWeeks(heatmap) {
  const DAYS = heatmap.length;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const days = heatmap.map((level, idx) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (DAYS - 1 - idx));
    return { date: d, level };
  });

  // Pad the front with nulls so day 0 lands in its correct Sun–Sat row —
  // otherwise columns wouldn't line up with real calendar weeks.
  const leadingPad = days.length ? days[0].date.getUTCDay() : 0; // 0 = Sunday
  const padded = [...Array(leadingPad).fill(null), ...days];

  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // Label a column with a month name only when a new month first appears in it.
  const monthLabels = weeks.map((week, colIdx) => {
    const firstDay = week.find(Boolean);
    if (!firstDay) return null;
    const prevFirstDay = weeks[colIdx - 1]?.find(Boolean);
    if (!prevFirstDay) return MONTH_LABELS[firstDay.date.getUTCMonth()];
    return firstDay.date.getUTCMonth() !== prevFirstDay.date.getUTCMonth()
      ? MONTH_LABELS[firstDay.date.getUTCMonth()]
      : null;
  });

  return { weeks, monthLabels };
}

function dayTooltip(day) {
  if (!day) return undefined;
  const dateStr = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  return `${LEVEL_LABELS[day.level]} on ${dateStr}`;
}

// Builds a personalized "what to work on" message from real per-module
// percentages instead of one static sentence shown to every user.
function buildMilestoneMessage(modules) {
  if (!modules) return 'Start practicing to see a personalized recommendation here.';
  const { aptitude, core, dsa, contests } = modules;

  if (contests.attempted === 0) {
    return 'You haven\'t attempted a mock contest yet — take one this week to see where you stand under time pressure.';
  }

  const candidates = [
    { label: 'Aptitude', percent: aptitude.percent, to: '/dashboard/aptitude' },
    { label: 'Core Subjects', percent: core.percent, to: '/dashboard/core' },
    { label: 'DSA', percent: dsa.percent, to: '/dsa' },
  ];
  const weakest = candidates.reduce((a, b) => (b.percent < a.percent ? b : a));

  if (weakest.percent >= 75) {
    return 'Great progress across the board — keep up a daily streak and take another mock contest to stress-test your prep.';
  }
  return `${weakest.label} is your lowest-scoring area at ${weakest.percent}% — spend focused time there this week to bring your overall readiness up.`;
}

export function DashboardHome({ user }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(()=>{
    if(!token) return;
    apiRequest('/api/auth/dashboard-stats',{token}).then(r=>setStats(r.data)).catch(()=>{});
  },[token]);

  const name      = user?.fullName?.split(' ')[0]||'there';
  const streak    = stats?.streakDays ?? 0;
  const readiness = stats?.readinessScore ?? 0;
  const modules   = stats?.modules ?? null;
  const heatmap   = stats?.heatmap ?? Array.from({ length: 182 }, () => 0);

  const totalSolved = (modules?.aptitude.solved ?? 0) + (modules?.core.solved ?? 0) + (modules?.dsa.solved ?? 0);
  const totalProblems = (modules?.aptitude.total ?? 0) + (modules?.core.total ?? 0) + (modules?.dsa.total ?? 0);

  const { weeks, monthLabels } = useMemo(() => buildHeatmapWeeks(heatmap), [heatmap]);

  const milestoneMessage = buildMilestoneMessage(modules);

  return (
    <div className="animate-in">
      {/* Welcome */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--tx-1)', marginBottom:'0.3rem' }}>
            Welcome back, <span style={{ color: 'var(--indigo-light)' }}>{name}</span>
          </h1>
          <p style={{ color:'var(--tx-3)', fontSize:'0.9rem' }}>Your placement prep command centre.</p>
        </div>
        {streak>0 && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.4rem 0.9rem', borderRadius:'var(--r-full)', background:'var(--amber-dim)', border:'1px solid rgba(193,127,17,0.25)', fontSize:'0.82rem', fontWeight:700, color:'var(--amber)', flexShrink:0 }}>
            <Flame size={14} strokeWidth={2}/>{streak}-day streak
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.85rem', marginBottom:'1rem' }}>
        {[
          { label:'Readiness',   value:`${readiness}%`, sub:'Overall score',            Icon:TrendingUp, accent:'var(--indigo-light)' },
          { label:'Problems Solved',  value:`${totalSolved}/${totalProblems}`, sub:'Aptitude + Core + DSA', Icon:Code2, accent:'var(--cyan)' },
          { label:'Streak',      value:streak>0?`${streak} days`:'Start today', sub:'Daily practice', Icon:Flame, accent:'var(--amber)' },
          { label:'Target',      value:'75%', sub:`+${Math.max(0,75-readiness)}% to go`, Icon:Target, accent:'var(--green)' },
        ].map(s=>(
          <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem', background:'var(--bg-elevated)', border:'1px solid var(--b-2)', borderRadius:'var(--r-lg)', boxShadow:'var(--sh-sm)' }}>
            <div style={{ width:34, height:34, borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', background:`${s.accent}15`, border:`1px solid ${s.accent}25`, flexShrink:0 }}>
              <s.Icon size={15} strokeWidth={1.75} style={{ color:s.accent }}/>
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:'0.7rem', fontWeight:600, color:'var(--tx-4)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.15rem' }}>{s.label}</p>
              <p style={{ fontSize:'1.15rem', fontWeight:800, letterSpacing:'-0.03em', color:s.accent, lineHeight:1.1 }}>{s.value}</p>
              <p style={{ fontSize:'0.7rem', color:'var(--tx-4)', marginTop:'0.1rem' }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Readiness bar */}
      <div style={{ padding:'1rem 1.25rem', background:'var(--bg-elevated)', border:'1px solid var(--b-2)', borderRadius:'var(--r-lg)', marginBottom:'1.25rem', boxShadow:'var(--sh-sm)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.6rem' }}>
          <span style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--tx-2)' }}>
            <TrendingUp size={13} strokeWidth={1.75} style={{ marginRight:'0.35rem', verticalAlign:'middle', color:'var(--indigo-light)' }}/>Overall Readiness
          </span>
          <span style={{ fontSize:'0.9rem', fontWeight:800, color:'var(--indigo-light)' }}>{readiness}%</span>
        </div>
        <div style={{ position:'relative', height:8, background:'rgba(255,255,255,0.06)', borderRadius:99, marginBottom:'0.4rem' }}>
          <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,var(--indigo),var(--cyan))', width:`${readiness}%`, transition:'width 0.8s' }}/>
          <div style={{ position:'absolute', top:-3, left:'75%', transform:'translateX(-50%)', width:2, height:14, background:'var(--amber)', borderRadius:1 }}>
            <span style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', fontSize:'0.6rem', fontWeight:700, color:'var(--amber)', whiteSpace:'nowrap' }}>Target</span>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--tx-4)' }}>
          <span>0%</span><span style={{ color:'var(--amber)', fontWeight:600 }}>75% target</span><span>100%</span>
        </div>
      </div>

      {/* Per-module breakdown — real numbers for every module, not just DSA */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.85rem', marginBottom:'1.25rem' }}>
        {[
          { label:'Aptitude',      Icon:Calculator, accent:'var(--cyan)',
            value: modules ? `${modules.aptitude.solved}/${modules.aptitude.total}` : '—',
            sub: modules ? `${modules.aptitude.percent}% solved` : 'Loading…' },
          { label:'Core Subjects', Icon:BookOpen,   accent:'var(--violet)',
            value: modules ? `${modules.core.solved}/${modules.core.total}` : '—',
            sub: modules ? `${modules.core.percent}% solved` : 'Loading…' },
          { label:'DSA',           Icon:Code2,      accent:'var(--indigo-light)',
            value: modules ? `${modules.dsa.solved}/${modules.dsa.total}` : '—',
            sub: modules ? `${modules.dsa.percent}% solved` : 'Loading…' },
          { label:'Contests',      Icon:Trophy,     accent:'var(--amber)',
            value: modules ? `${modules.contests.attempted}/${modules.contests.total}` : '—',
            sub: modules ? `${modules.contests.avgPercent}% avg score` : 'Loading…' },
        ].map(m=>(
          <div key={m.label} style={{ padding:'0.9rem 1rem', background:'var(--bg-elevated)', border:'1px solid var(--b-2)', borderRadius:'var(--r-lg)', boxShadow:'var(--sh-sm)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
              <m.Icon size={14} strokeWidth={1.75} style={{ color:m.accent }}/>
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--tx-3)' }}>{m.label}</span>
            </div>
            <p style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--tx-1)', letterSpacing:'-0.02em' }}>{m.value}</p>
            <p style={{ fontSize:'0.72rem', color:'var(--tx-4)', marginTop:'0.1rem' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Actions + Heatmap */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.15fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        <section>
          <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--tx-4)', marginBottom:'0.6rem' }}>
            <Layers size={12} strokeWidth={1.75} style={{ marginRight:'0.35rem', verticalAlign:'middle' }}/>Modules
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
            {ACTIONS.map(({title,sub,Icon,to,accent})=>(
              <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.8rem 1rem', background:'var(--bg-elevated)', border:'1px solid var(--b-2)', borderRadius:'var(--r-lg)', textDecoration:'none', boxShadow:'var(--sh-sm)', transition:'all 0.15s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateX(3px)';e.currentTarget.style.borderColor='var(--b-3)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--b-2)';}}>
                <div style={{ width:36, height:36, borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', background:`${accent}12`, border:`1px solid ${accent}22`, flexShrink:0 }}>
                  <Icon size={16} strokeWidth={1.75} style={{ color:accent }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--tx-1)' }}>{title}</p>
                  <p style={{ fontSize:'0.73rem', color:'var(--tx-4)', marginTop:'0.1rem' }}>{sub}</p>
                </div>
                <ChevronRight size={15} style={{ color:'var(--tx-4)', flexShrink:0 }}/>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--tx-4)', marginBottom:'0.6rem' }}>
            <Flame size={12} strokeWidth={1.75} style={{ marginRight:'0.35rem', verticalAlign:'middle' }}/>Activity — last 6 months
          </p>
          <div style={{ padding:'1rem', background:'var(--bg-elevated)', border:'1px solid var(--b-2)', borderRadius:'var(--r-lg)', boxShadow:'var(--sh-sm)', overflowX:'auto' }}>
            {/* Month labels, aligned above their matching week column */}
            <div style={{ display:'grid', gridTemplateColumns:`22px repeat(${weeks.length},1fr)`, gap:3, marginBottom:'0.3rem', minWidth:weeks.length*13+22 }}>
              <div />
              {monthLabels.map((label,i)=>(
                <span key={i} style={{ fontSize:'0.62rem', fontWeight:600, color:'var(--tx-4)', whiteSpace:'nowrap' }}>{label ?? ''}</span>
              ))}
            </div>
            {/* Weekday labels + week columns */}
            <div style={{ display:'grid', gridTemplateColumns:`22px repeat(${weeks.length},1fr)`, gap:3, minWidth:weeks.length*13+22 }}>
              <div style={{ display:'grid', gridTemplateRows:'repeat(7,1fr)', gap:3 }}>
                {[0,1,2,3,4,5,6].map(row=>(
                  <span key={row} style={{ fontSize:'0.6rem', color:'var(--tx-4)', display:'flex', alignItems:'center' }}>
                    {WEEKDAY_ROW_LABELS[row] ?? ''}
                  </span>
                ))}
              </div>
              {weeks.map((week,wi)=>(
                <div key={wi} style={{ display:'grid', gridTemplateRows:'repeat(7,1fr)', gap:3 }}>
                  {week.map((day,di)=>(
                    <div
                      key={di}
                      title={dayTooltip(day)}
                      style={{ aspectRatio:'1', borderRadius:2, background: day ? HM_BG[day.level] : 'transparent' }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end', marginTop:'0.6rem', fontSize:'0.68rem', color:'var(--tx-4)' }}>
              <span>Less</span>
              {HM_BG.map((bg,i)=><div key={i} style={{ width:12, height:12, borderRadius:2, background:bg }}/>)}
              <span>More</span>
            </div>
          </div>
        </section>
      </div>

      {/* Milestone */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.5rem', padding:'1.25rem 1.5rem', background:'linear-gradient(135deg,rgba(58,92,216,0.08),rgba(74,155,143,0.04))', border:'1px solid rgba(58,92,216,0.2)', borderRadius:'var(--r-lg)', flexWrap:'wrap' }}>
        <div>
          <p style={{ fontSize:'0.9375rem', fontWeight:700, color:'var(--tx-1)', marginBottom:'0.3rem' }}>Next Milestone</p>
          <p style={{ fontSize:'0.82rem', color:'var(--tx-3)', lineHeight:1.6, maxWidth:480 }}>
            {milestoneMessage}
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.65rem', flexShrink:0 }}>
          <Link className="btn btn-primary" to="/dsa">Practice DSA</Link>
          <Link className="btn btn-secondary" to="/dashboard/contests">Try a Contest</Link>
        </div>
      </div>
    </div>
  );
}