/**
 * AppRoutes.jsx
 * Central routing configuration for the PrepMatrix AI app.
 *
 * Route guards:
 *  - PublicOnlyRoute: redirects to /dashboard if already logged in (login/signup)
 *  - ProtectedRoute: redirects to /login if not authenticated (all app pages)
 *
 * All authenticated pages are wrapped in <AppShell> which provides
 * the topbar and sidebar navigation.
 */
import { Navigate, Route, Routes } from 'react-router-dom';

// Auth
import { LoginForm }  from '../components/auth/LoginForm.jsx';
import { SignupForm } from '../components/auth/SignupForm.jsx';

// Landing
import { LandingPage } from '../components/landing/LandingPage.jsx';

// Layout shell
import { AppShell } from '../components/layout/AppShell.jsx';

// Dashboard
import { DashboardHome } from '../components/dashboard/DashboardHome.jsx';
import { UserProfilePage } from '../components/dashboard/UserProfilePage.jsx';

// Aptitude module
import { AptitudeHubPage }    from '../components/aptitude/AptitudeHubPage.jsx';
import { TopicSheetPage as AptitudeTopicSheetPage } from '../components/aptitude/TopicSheetPage.jsx';
import { SolvingInterfacePage } from '../components/aptitude/SolvingInterfacePage.jsx';

// DSA module
import { DSAHubPage }     from '../components/dsa/DSAHubPage.jsx';
import { DSAConceptPage } from '../components/dsa/DSAConceptPage.jsx';
import { TopicSheetPage as DSATopicSheetPage } from '../components/dsa/TopicSheetPage.jsx';
import { CodingIDEPage }  from '../components/dsa/CodingIDEPage.jsx';

// Core Subjects module
import { CoreSubjectsHubPage }            from '../components/coreSubjects/CoreSubjectsHubPage.jsx';
import { CoreSubjectTopicSheetPage }      from '../components/coreSubjects/CoreSubjectTopicSheetPage.jsx';
import { CoreSubjectSolvingInterfacePage } from '../components/coreSubjects/CoreSubjectSolvingInterfacePage.jsx';

// Contests module
import { ContestsPage } from '../components/contests/ContestsPage.jsx';

// AI Suite module
import { AISuitePage } from '../components/aiSuite/AISuitePage.jsx';

// Auth context
import { useAuth } from '../context/AuthContext.jsx';

/* ─────────────────────────────────────────────
   Route guard: only for unauthenticated users.
   If logged in → redirect to /dashboard.
───────────────────────────────────────────── */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return (
      <main className="center-screen">
        <span className="spinner" />
      </main>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

/* ─────────────────────────────────────────────
   Route guard: only for authenticated users.
   If logged out → redirect to /login.
───────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return (
      <main className="center-screen">
        <span className="spinner" />
      </main>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/* ─────────────────────────────────────────────
   Helper to wrap a page inside AppShell with
   ProtectedRoute. Reduces repetition below.
   Options: hideSidebar, mainOverflow
───────────────────────────────────────────── */
function ShellPage({ user, onLogout, children, hideSidebar = false, mainOverflow = null }) {
  return (
    <ProtectedRoute>
      <AppShell
        user={user}
        onLogout={onLogout}
        hideSidebar={hideSidebar}
        mainOverflow={mainOverflow}
      >
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}

/* ─────────────────────────────────────────────
   Main routing tree
───────────────────────────────────────────── */
export function AppRoutes() {
  const { login, logout, user } = useAuth();

  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginForm onSuccess={login} />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupForm onSuccess={login} />
          </PublicOnlyRoute>
        }
      />

      {/* ── Dashboard ── */}
      <Route
        path="/dashboard"
        element={
          <ShellPage user={user} onLogout={logout}>
            <DashboardHome user={user} />
          </ShellPage>
        }
      />

      <Route
        path="/dashboard/profile"
        element={
          <ShellPage user={user} onLogout={logout}>
            <UserProfilePage />
          </ShellPage>
        }
      />

      {/* ── Aptitude module ── */}
      <Route
        path="/dashboard/aptitude"
        element={
          <ShellPage user={user} onLogout={logout}>
            <AptitudeHubPage />
          </ShellPage>
        }
      />
      <Route
        path="/dashboard/aptitude/topic/:slug"
        element={
          <ShellPage user={user} onLogout={logout}>
            <AptitudeTopicSheetPage />
          </ShellPage>
        }
      />
      {/* Solving interface hides sidebar for focus mode */}
      <Route
        path="/dashboard/aptitude/solve/:slug/:problemId"
        element={
          <ShellPage
            user={user}
            onLogout={logout}
            hideSidebar
            mainOverflow="hidden"
          >
            <SolvingInterfacePage />
          </ShellPage>
        }
      />

      {/* ── DSA module ── */}
      <Route
        path="/dsa"
        element={
          <ShellPage user={user} onLogout={logout}>
            <DSAHubPage />
          </ShellPage>
        }
      />
      <Route
        path="/dsa/topic/:slug"
        element={
          <ShellPage user={user} onLogout={logout} hideSidebar>
            <DSATopicSheetPage />
          </ShellPage>
        }
      />
      <Route
        path="/dsa/concepts/:slug"
        element={
          <ShellPage user={user} onLogout={logout}>
            <DSAConceptPage />
          </ShellPage>
        }
      />
      <Route
        path="/dsa/problem/:slug"
        element={
          <ShellPage
            user={user}
            onLogout={logout}
            hideSidebar
            mainOverflow="hidden"
          >
            <CodingIDEPage />
          </ShellPage>
        }
      />
      {/* Legacy routes — keep them working */}
      <Route path="/dashboard/dsa" element={<Navigate to="/dsa" replace />} />
      <Route
        path="/dashboard/dsa/topic/:slug"
        element={
          <ShellPage user={user} onLogout={logout} hideSidebar>
            <DSATopicSheetPage />
          </ShellPage>
        }
      />
      <Route
        path="/dashboard/dsa/problem/:slug"
        element={
          <ShellPage
            user={user}
            onLogout={logout}
            hideSidebar
            mainOverflow="hidden"
          >
            <CodingIDEPage />
          </ShellPage>
        }
      />

      {/* ── Core Subjects module ── */}
      <Route
        path="/dashboard/core"
        element={
          <ShellPage user={user} onLogout={logout}>
            <CoreSubjectsHubPage />
          </ShellPage>
        }
      />
      <Route
        path="/dashboard/core/topic/:slug"
        element={
          <ShellPage user={user} onLogout={logout}>
            <CoreSubjectTopicSheetPage />
          </ShellPage>
        }
      />
      <Route
        path="/dashboard/core/solve/:slug/:problemId"
        element={
          <ShellPage
            user={user}
            onLogout={logout}
            hideSidebar
            mainOverflow="hidden"
          >
            <CoreSubjectSolvingInterfacePage />
          </ShellPage>
        }
      />

      {/* ── Contests module ── */}
      <Route
        path="/dashboard/contests"
        element={
          <ShellPage user={user} onLogout={logout}>
            <ContestsPage />
          </ShellPage>
        }
      />

      {/* ── AI Suite module ── */}
      <Route
        path="/dashboard/ai"
        element={
          <ShellPage user={user} onLogout={logout}>
            <AISuitePage />
          </ShellPage>
        }
      />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}