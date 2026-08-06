/**
 * DSAConceptPage.jsx  —  DSA Pattern Concept Reader
 *
 * Reads concept content from: GET /api/dsa/concept/:slug
 * Response: { pattern, conceptArticle: string (markdown) }
 *
 * If the API has no concept for this pattern, shows a structured
 * fallback with the pattern name and a note to check back later.
 *
 * Layout is identical to the Aptitude/Core concept reader:
 *  • Sticky TOC sidebar (desktop)
 *  • Each ## section = its own card with numbered header
 *  • Reading progress bar
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Code2, Zap, BookOpen } from 'lucide-react';

const slugify = t =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

/* Un-slug: "two-pointers" → "Two Pointers" */
const prettySlug = s =>
  String(s || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function splitIntoSections(md) {
  if (!md) return [];
  const lines = md.split('\n');
  const sections = [];
  let cur = null;
  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line.trim());
    if (h2) {
      if (cur) sections.push(cur);
      cur = { heading: h2[1].trim(), id: slugify(h2[1].trim()), lines: [] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) sections.push(cur);
  const intro = lines.slice(0, Math.max(0, lines.findIndex(l => /^##\s/.test(l.trim())))).join('\n').trim();
  if (intro) sections.unshift({ heading: null, id: 'intro', lines: intro.split('\n') });
  return sections.map(s => ({ ...s, markdown: s.lines.join('\n').trim() }));
}

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = document.querySelector('.main-panel');
    if (!el) return;
    const fn = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setPct(max > 0 ? Math.round((scrollTop / max) * 100) : 100);
    };
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, height: '3px', background: 'var(--bg-card)' }}>
      <div style={{ height: '100%', width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--indigo), var(--cyan))',
        transition: 'width 0.1s', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
}

export function DSAConceptPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const [data,     setData]     = useState(null);
  const [isLoading,setIsLoading]= useState(true);
  const [error,    setError]    = useState('');
  const [activeId, setActiveId] = useState('');

  const patternName = useMemo(() => data?.pattern || prettySlug(slug), [data, slug]);

  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    apiRequest(`/api/dsa/concept/${slug}`, { token })
      .then(r => setData(r.data))
      .catch(e => setError(e.message || 'Concept not found'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const sections = useMemo(() => splitIntoSections(data?.conceptArticle || ''), [data]);
  const neuralSection   = sections.find(s => /neural\s*summary/i.test(s.heading || ''));
  const contentSections = sections.filter(s => s.heading && !/neural\s*summary/i.test(s.heading));
  const introSection    = sections.find(s => !s.heading);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('.concept-section-card[id]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const mdComponents = useMemo(() => ({
    h3: ({ children }) => <h3 id={slugify(String(children?.[0] ?? ''))}>{children}</h3>,
  }), []);

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;

  /* If no concept exists, show a friendly placeholder */
  if (error || !data?.conceptArticle) {
    return (
      <div className="animate-in">
        <div className="page-header-block">
          <div className="breadcrumb-chip"><Code2 size={12} strokeWidth={2}/><span>DSA Concepts</span></div>
          <h1 className="page-main-title">{patternName}</h1>
        </div>
        <div className="concept-section-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ marginBottom:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}><BookOpen size={32} strokeWidth={1.5} style={{color:'var(--indigo-light)'}}/></div>
          <p className="t-h2" style={{ marginBottom: '0.5rem' }}>Concept Article Coming Soon</p>
          <p className="t-body" style={{ color: 'var(--tx-3)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            The concept guide for <strong>{patternName}</strong> is being prepared.
            For now, jump straight into the problems — learning by doing is equally powerful!
          </p>
          <Link className="btn btn-primary" to={`/dsa/topic/${slug}`}>
            View Problems →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />

      <div className="page-header-block">
        <div className="row wrap gap-sm" style={{ marginBottom: '0.75rem' }}>
          <div className="breadcrumb-chip"><Code2 size={12} strokeWidth={2}/><span>DSA Pattern</span></div>
          
        </div>
        <h1 className="page-main-title">{patternName}</h1>
        <p className="muted-text" style={{ marginTop: '0.4rem' }}>
          Master the pattern, then tackle the problems. Read sequentially or jump to any section.
        </p>
        <div className="row wrap gap-sm" style={{ marginTop: '0.75rem' }}>
          <div style={{ padding: '0.4rem 0.85rem', borderRadius: 'var(--r-full)',
            background: 'rgba(11,15,26,0.6)', border: '1px solid var(--b-1)',
            fontSize: '0.82rem', color: 'var(--tx-3)' }}>
            {contentSections.length} section{contentSections.length !== 1 ? 's' : ''}
          </div>
          <Link className="btn btn-outline btn-sm" to={`/dsa/topic/${slug}`}>
            Problems →
          </Link>
        </div>
      </div>

      <div className="concept-layout">
        {/* TOC */}
        <aside className="concept-toc">
          <p className="card-title" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Contents</p>
          <nav className="toc-list">
            {introSection && (
              <a href="#intro" className={activeId === 'intro' ? 'active' : ''}
                onClick={e => { e.preventDefault(); document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span style={{ color: 'var(--indigo-light)', marginRight: '0.4rem', fontSize: '0.7rem' }}>00</span>
                Introduction
              </a>
            )}
            {contentSections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className={activeId === s.id ? 'active' : ''}
                onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); setActiveId(s.id); }}>
                <span style={{ color: 'var(--indigo-light)', marginRight: '0.4rem', fontSize: '0.7rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {neuralSection?.markdown && (
            <div className="neural-summary-box">
              <div className="neural-summary-header">
                <span><Zap size={13} strokeWidth={2} style={{color:'var(--amber)'}}/></span>
                <span className="neural-summary-title">Pattern Summary</span>
              </div>
              <div className="concept-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {neuralSection.markdown}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {introSection?.markdown && (
            <div id="intro" className="concept-section-card">
              <div className="concept-section-title">
                <span className="concept-section-num">#</span>
                <span className="concept-section-name">Introduction</span>
              </div>
              <div className="concept-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {introSection.markdown}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {contentSections.map((s, i) => (
            <div key={s.id} id={s.id} className="concept-section-card">
              <div className="concept-section-title">
                <span className="concept-section-num">{i + 1}</span>
                <span className="concept-section-name">{s.heading}</span>
              </div>
              {s.markdown ? (
                <div className="concept-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {s.markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="t-sm">No content for this section.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}