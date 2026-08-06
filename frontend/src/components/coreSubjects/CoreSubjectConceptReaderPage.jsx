/**
 * CoreSubjectConceptReaderPage.jsx  —  Core Subjects Concept Reader
 *
 * Same section-per-card layout as aptitude ConceptReaderPage.
 * For OS there may be 8–12 sub-topics (Process, Thread, Deadlock…).
 * Each ## heading becomes its own isolated card so students can focus
 * on one concept at a time.
 *
 * Fetches: GET /api/core-subjects/topic/:slug
 * Response shape: { title, category, conceptArticle: string (markdown) }
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { BookOpen, Zap } from 'lucide-react';

const slugify = t =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

/* Category accent colours */
const CATEGORY_ACCENT = {
  OS:   'var(--cyan)',
  DBMS: 'var(--amber)',
  CN:   'var(--green)',
  OOPS: 'var(--violet)',
};
const CATEGORY_PILL = {
  OS:   'pill-cyan',
  DBMS: 'pill-amber',
  CN:   'pill-green',
  OOPS: 'pill-violet',
};

/* Split markdown at ## headings */
function splitIntoSections(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line.trim());
    if (h2) {
      if (current) sections.push(current);
      current = { heading: h2[1].trim(), id: slugify(h2[1].trim()), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  const introContent = lines.slice(0, lines.findIndex(l => /^##\s/.test(l.trim()))).join('\n').trim();
  if (introContent) sections.unshift({ heading: null, id: 'overview', lines: introContent.split('\n') });

  return sections.map(s => ({ ...s, markdown: s.lines.join('\n').trim() }));
}

/* Reading progress */
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

export function CoreSubjectConceptReaderPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const [topicData, setTopicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState('');
  const [activeId,  setActiveId]  = useState('');

  useEffect(() => {
    if (!token || !slug) return;
    setIsLoading(true);
    setError('');
    apiRequest(`/api/core-subjects/topic/${slug}`, { token })
      .then(r => setTopicData(r.data))
      .catch(e => setError(e.message || 'Unable to load concept article'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const article  = topicData?.conceptArticle || '';
  const sections = useMemo(() => splitIntoSections(article), [article]);

  /* Separate Neural Summary */
  const neuralSection   = sections.find(s => /neural\s*summary/i.test(s.heading || ''));
  const contentSections = sections.filter(s => s.heading && !/neural\s*summary/i.test(s.heading));
  const introSection    = sections.find(s => !s.heading);

  /* Intersection observer for active TOC */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); } },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('.concept-section-card[id]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const mdComponents = useMemo(() => ({
    h3: ({ children }) => (
      <h3 id={slugify(String(children?.[0] ?? ''))}>{children}</h3>
    ),
  }), []);

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;
  if (error || !topicData) return (
    <div className="card soft-card"><p className="error-text">{error || 'Topic not found'}</p></div>
  );

  const category = topicData.category || '';
  const accent   = CATEGORY_ACCENT[category] || 'var(--indigo)';
  const pillCls  = CATEGORY_PILL[category]   || 'pill-primary';

  return (
    <>
      <ReadingProgress />

      {/* Header */}
      <div className="page-header-block">
        <div className="row wrap gap-sm" style={{ marginBottom: '0.75rem' }}>
          <div className="breadcrumb-chip"><BookOpen size={12} strokeWidth={2}/><span>Core · Concept</span></div>
          
        </div>
        <h1 className="page-main-title">{topicData.title}</h1>
        <p className="muted-text" style={{ marginTop: '0.4rem' }}>
          Interview-focused concept guide. Each section covers one key topic — read sequentially
          or jump directly using the Table of Contents.
        </p>

        {/* Section count chip */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 0.85rem', borderRadius: 'var(--r-full)',
            background: 'rgba(11,15,26,0.6)', border: '1px solid var(--b-1)',
            fontSize: '0.82rem', color: 'var(--tx-3)'
          }}>
            {contentSections.length} topic{contentSections.length !== 1 ? 's' : ''}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 0.85rem', borderRadius: 'var(--r-full)',
            background: 'rgba(11,15,26,0.6)', border: '1px solid var(--b-1)',
            fontSize: '0.82rem', color: 'var(--tx-3)'
          }}>
            ⏱ ~{Math.max(1, Math.round(article.split(' ').length / 200))} min read
          </div>
        </div>
      </div>

      <div className="concept-layout">
        {/* TOC */}
        <aside className="concept-toc">
          <p className="card-title" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Contents</p>
          <p className="t-xs" style={{ marginBottom: '0.65rem' }}>{contentSections.length} sections</p>
          <nav className="toc-list">
            {introSection && (
              <a href="#overview"
                className={activeId === 'overview' ? 'active' : ''}
                onClick={e => { e.preventDefault(); document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span style={{ color: 'var(--indigo-light)', marginRight: '0.4rem', fontSize: '0.7rem' }}>00</span>
                Overview
              </a>
            )}
            {contentSections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`}
                className={activeId === s.id ? 'active' : ''}
                onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); setActiveId(s.id); }}>
                <span style={{ color: accent, marginRight: '0.4rem', fontSize: '0.7rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>

        {/* Article body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Neural summary callout */}
          {neuralSection?.markdown && (
            <div className="neural-summary-box">
              <div className="neural-summary-header">
                <span><Zap size={13} strokeWidth={2} style={{color:'var(--amber)'}}/></span>
                <span className="neural-summary-title">Quick Summary</span>
                <span className="t-xs">— 30-second overview before diving in</span>
              </div>
              <div className="concept-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {neuralSection.markdown}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Intro section (before first ##) */}
          {introSection?.markdown && (
            <div id="overview" className="concept-section-card">
              <div className="concept-section-title">
                <span className="concept-section-num" style={{ background: `${accent}20`, borderColor: `${accent}40`, color: accent }}>
                  #
                </span>
                <span className="concept-section-name">Overview</span>
              </div>
              <div className="concept-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {introSection.markdown}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* One card per ## section */}
          {contentSections.map((section, i) => (
            <div key={section.id} id={section.id} className="concept-section-card">
              <div className="concept-section-title">
                <span className="concept-section-num"
                  style={{ background: `${accent}18`, borderColor: `${accent}35`, color: accent }}>
                  {i + 1}
                </span>
                <span className="concept-section-name">{section.heading}</span>
              </div>
              {section.markdown ? (
                <div className="concept-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {section.markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="t-sm">No content for this section.</p>
              )}
            </div>
          ))}

          {contentSections.length === 0 && !neuralSection && !introSection && (
            <div className="concept-section-card">
              <p className="muted-text">No concept content is available for this topic yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}