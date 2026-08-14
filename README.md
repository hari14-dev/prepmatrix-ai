# PrepMatrix AI — Smart Placement Preparation Platform

An all-in-one placement preparation platform for engineering students — aptitude practice, DSA problem-solving, core CS subject revision, AI-powered resume auditing, voice-based mock interviews, and weekly contests, all with real progress tracking.

## Features

- **Auth** — Email/password or Google Sign-In
- **Aptitude & Logic** — Topic-wise Quant, Logical, and Verbal practice with AI-generated hints
- **DSA Practice** — Pattern-based curriculum with an in-browser code editor and live execution in C++, Java, and Python
- **Core Subjects Vault** — OS, DBMS, CN, and OOPS: concept articles, an MCQ bank, and an AI concept assistant
- **AI Resume Auditor** — Upload a PDF/DOCX resume (or paste the text directly), get an ATS-style score and a skill-gap breakdown
- **AI Mock Interview** — Voice-based interview simulator with real-time AI evaluation
- **Practice Contests** — Timed, mixed-format contests across Aptitude, Core Subjects, and DSA, scored instantly (a fixed seeded set — not auto-generated or weekly, and there's no cross-user leaderboard)
- **Progress Tracking** — Per-user readiness score, activity heatmap, and streaks, computed from real submission data

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router, Monaco Editor |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt, Google Sign-In (Google Identity Services + `google-auth-library`) |
| AI | Groq API (`llama-3.1-8b-instant`) — hints, concept explanations, resume audits, interview evaluation |
| Code Execution | OneCompiler API (via RapidAPI) |

## Project Structure

```
prepmatrix-ai/
├── backend/
│   ├── src/
│   │   ├── routes/       # API routes (auth, aptitude, dsa, coreSubjects, aiSuite, contests, public)
│   │   ├── models/       # Mongoose schemas
│   │   ├── config/       # env loading, Groq client
│   │   └── data/         # seed data generators
│   ├── seed.js           # seeds aptitude + core subject topics/problems
│   └── seedDSA.js        # seeds DSA problems
└── frontend/
    └── src/
        ├── components/   # feature modules (aptitude, dsa, coreSubjects, contests, aiSuite, dashboard, landing)
        ├── context/       # auth + breadcrumb context
        └── lib/           # API client
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))
- A [Groq API key](https://console.groq.com) (free tier) for AI features
- A [OneCompiler RapidAPI key](https://rapidapi.com/onecompiler-onecompiler-default/api/onecompiler-apis) for the DSA code runner
- (Optional) A Google OAuth Client ID for Google Sign-In — see below

### 1. Clone and install

```bash
git clone <repo-url>
cd prepmatrix-ai
npm install --workspaces
```

### 2. Configure environment variables

Copy the example files and fill them in:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env` needs `MONGODB_URI`, `JWT_SECRET`, and (for the DSA runner) `ONECOMPILER_RAPIDAPI_KEY` at minimum. `GROQ_API_KEY` and `GOOGLE_CLIENT_ID` are optional — the app runs without them, just with AI features and Google login turned off respectively.

#### Setting up Google Sign-In (optional)

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** of type **Web application**
3. Add `http://localhost:5173` (and your production frontend URL) under **Authorized JavaScript origins**
4. Copy the generated Client ID into **both**:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID`

Without this, the login/signup pages work normally with email+password — the Google button just doesn't render.

### 3. Seed the database

```bash
npm run seed:aptitude
npm run seed:dsa
```

### 4. Run the app

```bash
npm run dev:api    # backend  → http://localhost:5000
npm run dev:web    # frontend → http://localhost:5173
```

## API Overview

| Route | Description |
|---|---|
| `POST /api/auth/register`, `/login` | User signup and login |
| `POST /api/auth/google` | Google Sign-In (verifies a Google ID token, creates/links the account) |
| `GET /api/auth/dashboard-stats` | Readiness score, streaks, heatmap |
| `GET /api/public/stats` | Public platform stats (topics, problems, MCQs) for the landing page |
| `GET /api/aptitude/hub`, `/topic/:slug` | Aptitude topics and problems |
| `GET /api/core-subjects/hub`, `/topic/:slug` | Core subject topics and MCQs |
| `GET /api/dsa/patterns`, `/problem/:slug` | DSA problem catalogue |
| `POST /api/dsa/execute` | Run submitted code |
| `POST /api/ai-suite/resume-parse` | Extract text from an uploaded PDF/DOCX/TXT resume |
| `POST /api/ai-suite/resume-audit` | AI resume analysis |
| `POST /api/ai-suite/mock-interview/*` | Voice mock interview flow |
| `GET /api/contests/list`, `/:id/result` | Practice contests and results |

## Notes

- AI features degrade gracefully: if `GROQ_API_KEY` is not set, the app falls back to static hints instead of failing.
- Google Sign-In degrades gracefully too: if `GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID` aren't set, the button simply doesn't render and email/password auth is unaffected.
- All platform stats shown on the landing page and dashboard are computed live from the database — nothing is hardcoded.
- Uploaded resume files (PDF/DOCX/TXT, 5MB max) are parsed in memory for their text and are never written to disk or stored.

## License

MIT
