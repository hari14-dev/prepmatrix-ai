/**
 * ConceptReaderPage.jsx  —  Aptitude Concept Reader
 *
 * Improved layout:
 *  • Left sticky Table of Contents (desktop)
 *  • Main area: each H2 section rendered as its OWN card with a numbered
 *    section header — so students read one chunk at a time, not a wall of text
 *  • "Neural Summary" (if present) shown as a highlighted callout at the top
 *  • Clean typography — body text is 15px, high contrast
 *  • Reading progress bar at the top
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiRequest } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Zap, Calculator } from 'lucide-react';

/* Convert heading text → URL-safe id */
const slugify = t =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

/* ── Markdown → section array ────────────────────────────
   Splits the raw markdown at every ## heading so each section
   can be displayed as its own card.
 ──────────────────────────────────────────────────────── */
function splitIntoSections(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const h2Match = /^##\s+(.+)$/.exec(line.trim());
    if (h2Match) {
      if (current) sections.push(current);
      current = { heading: h2Match[1].trim(), id: slugify(h2Match[1].trim()), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  // Handle content before first ##
  const beforeFirstH2 = lines.slice(0, lines.findIndex(l => /^##\s/.test(l))).join('\n').trim();
  if (beforeFirstH2) {
    sections.unshift({ heading: null, id: 'intro', lines: beforeFirstH2.split('\n') });
  }

  return sections.map(s => ({ ...s, markdown: s.lines.join('\n').trim() }));
}

/* ── Reading Progress ─────────────────────────────────── */
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = document.querySelector('.main-panel');
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setPct(max > 0 ? Math.round((scrollTop / max) * 100) : 100);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, height: '3px',
      background: 'var(--bg-card)', marginBottom: '0.5rem' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--indigo), var(--cyan))',
        transition: 'width 0.1s', borderRadius: '0 2px 2px 0'
      }} />
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export function ConceptReaderPage() {
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
    apiRequest(`/api/aptitude/topic/${slug}`, { token })
      .then(r => setTopicData(r.data))
      .catch(e => setError(e.message || 'Unable to load concept article'))
      .finally(() => setIsLoading(false));
  }, [token, slug]);

  const article  = topicData?.conceptArticle || '';
  const sections = useMemo(() => splitIntoSections(article), [article]);

  /* Separate Neural Summary section if present */
  const neuralIdx = sections.findIndex(s => /neural\s*summary/i.test(s.heading || ''));
  const neuralSection = neuralIdx >= 0 ? sections[neuralIdx] : null;
  const contentSections = sections.filter((s, i) => i !== neuralIdx && s.heading !== null);

  /* Track which section is in view for TOC highlight */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('.concept-section-card[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  /* Shared markdown components — give headings anchor IDs */
  const mdComponents = useMemo(() => ({
    h3: ({ children }) => (
      <h3 id={slugify(String(children?.[0] ?? ''))} style={{ scrollMarginTop: 'calc(var(--topbar-h) + 1rem)' }}>
        {children}
      </h3>
    ),
  }), []);

  if (isLoading) return <div className="center-screen"><span className="spinner" /></div>;
  if (error || !topicData) return (
    <div className="card soft-card">
      <p className="card-title">Concept Reader</p>
      <p className="error-text">{error || 'Topic not found'}</p>
    </div>
  );

  /* Sections for TOC (skip neural summary) */
  const tocSections = sections.filter(s => s.heading && !/neural\s*summary/i.test(s.heading));

  return (
    <>
      <ReadingProgress />

      {/* ── Page header ── */}
      <div className="page-header-block">
        <div className="row wrap gap-sm" style={{ marginBottom: '0.75rem' }}>
          <div className="breadcrumb-chip"><Calculator size={12} strokeWidth={2}/><span>Aptitude · Concept</span></div>
          
        </div>
        <h1 className="page-main-title">{topicData.title}</h1>
        <p className="muted-text" style={{ marginTop: '0.4rem' }}>
          Read each section carefully. Use the Table of Contents to navigate or review specific parts.
        </p>
      </div>

      <div className="concept-layout">
        {/* ── TOC sidebar ── */}
        <aside className="concept-toc">
          <p className="card-title" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
            Contents
          </p>
          <p className="t-xs" style={{ marginBottom: '0.6rem' }}>
            {tocSections.length} section{tocSections.length !== 1 ? 's' : ''}
          </p>
          <nav className="toc-list">
            {tocSections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={activeId === s.id ? 'active' : ''}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(s.id);
                }}
              >
                <span style={{ color: 'var(--indigo-light)', marginRight: '0.4rem', fontSize: '0.7rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Content area ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Neural Summary callout */}
          {neuralSection?.markdown && (
            <div className="neural-summary-box">
              <div className="neural-summary-header">
                <span><Zap size={13} strokeWidth={2} style={{color:'var(--amber)'}}/></span>
                <span className="neural-summary-title">Quick Summary</span>
                <span className="t-xs">— read this first for a 30-second overview</span>
              </div>
              <div className="concept-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {neuralSection.markdown}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Each section as its own card */}
          {sections
            .filter(s => s.heading && !/neural\s*summary/i.test(s.heading))
            .map((section, i) => (
              <div
                key={section.id}
                id={section.id}
                className="concept-section-card"
              >
                {/* Section title bar */}
                <div className="concept-section-title">
                  <span className="concept-section-num">{i + 1}</span>
                  <span className="concept-section-name">{section.heading}</span>
                </div>

                {/* Section body */}
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

          {/* Intro block (before first ##) */}
          {sections[0]?.heading === null && sections[0]?.markdown && (
            <div className="concept-section-card" id="intro"
              style={{ order: -1 }}>
              <div className="concept-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {sections[0].markdown}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {sections.filter(s => s.heading).length === 0 && !neuralSection && (
            <div className="concept-section-card">
              <p className="muted-text">No concept content is available for this topic yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}