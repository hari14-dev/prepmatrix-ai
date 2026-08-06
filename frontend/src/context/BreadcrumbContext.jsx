/**
 * BreadcrumbContext.jsx
 *
 * AppShell (the header/sidebar wrapper) and the actual page content live
 * at different levels of the component tree — AppShell wraps the page as
 * `children` at the route level, so a deep page (e.g. a specific topic
 * sheet or a solving screen) can't just pass a prop "up" to it.
 *
 * This context lets any page publish a breadcrumb trail once it knows its
 * own data (e.g. once a topic's title has loaded), and AppShell reads that
 * trail to render clickable breadcrumbs in the header.
 *
 * Usage in a page component:
 *   const setBreadcrumb = useSetBreadcrumb();
 *   useEffect(() => {
 *     if (topicData) {
 *       setBreadcrumb([
 *         { label: 'Aptitude', to: '/dashboard/aptitude' },
 *         { label: topicData.title, to: `/dashboard/aptitude/topic/${slug}` },
 *       ]);
 *     }
 *     return () => setBreadcrumb([]); // clear on unmount
 *   }, [topicData]);
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const BreadcrumbContext = createContext({
  trail: [],
  setTrail: () => {},
});

export function BreadcrumbProvider({ children }) {
  const [trail, setTrail] = useState([]);

  const value = useMemo(() => ({ trail, setTrail }), [trail]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// Read the current trail (used by AppShell)
export function useBreadcrumbTrail() {
  return useContext(BreadcrumbContext).trail;
}

// Set the trail (used by individual pages). Returns a stable setter you
// can safely call inside a useEffect without an exhaustive-deps warning.
export function useSetBreadcrumb() {
  const { setTrail } = useContext(BreadcrumbContext);
  return useCallback((items) => setTrail(items || []), [setTrail]);
}