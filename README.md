# CCA-F Study Plan & Quiz Engine

Two companion apps for the **Claude Certified Architect -- Foundations** exam: a structured 4-week study plan and a 500-question quiz engine.

## Study Plan (`/`)

A week-by-week battle plan covering all 5 exam domains, organized into 4 phases:

| Week | Phase | Goal | Target Score |
|------|-------|------|-------------|
| 1 | Foundation Sprint | Build mental models for all 5 domains + baseline diagnostic | 70% |
| 2 | Build Sprint | 4 hands-on projects mapped to all 6 exam scenarios | 80% |
| 3 | Depth Sprint | Close gaps, master tradeoffs, drill weak domains | 85% |
| 4 | Exam Sprint | Full practice exams, speed drilling, exam day | 90%+ |

### Features

- **5 tabs**: Weekly Plan, Concepts (31 nodes), Projects, Decision Rules (11 rules), Cheat Sheet
- **Daily KPIs** with measurable targets for each study day
- **Daily closure assessments** linking to specific quiz engine modes
- **Progress tracking** with localStorage-persisted checkboxes on tasks and concepts
- **Completion percentages** per tab displayed in the header

### The 5 tabs

**Weekly Plan** -- Expand any week, then individual days. Each day lists what to study, a KPI, and a closure quiz reference. Colored borders indicate the domain.

**Concepts** -- 31 testable concepts organized by domain with weight percentages. Your self-test: explain any leaf node from memory.

**Projects** -- 4 production-style apps mapped to exam scenarios.

**Decision Rules** -- 11 meta-rules that eliminate distractors. Each includes what it means, why it matters, and signal words.

**Cheat Sheet** -- 30+ one-line decision rules grouped by category, aligned to the 30 official task statements.

---

## Quiz Engine (`/quiz`)

500 elite-difficulty multiple-choice questions grounded in the 6 official exam scenarios with detailed explanations.

### Question distribution

| Domain | Weight | Questions | Task Statements |
|--------|--------|-----------|----------------|
| D1: Agentic Architecture & Orchestration | 27% | 135 | 1.1--1.7 |
| D2: Tool Design & MCP Integration | 18% | 90 | 2.1--2.5 |
| D3: Claude Code Configuration & Workflows | 20% | 100 | 3.1--3.6 |
| D4: Prompt Engineering & Structured Output | 20% | 100 | 4.1--4.6 |
| D5: Context Management & Reliability | 15% | 75 | 5.1--5.6 |

### Difficulty

- ~64% hard, ~36% medium. No easy questions.
- Every question tests architectural judgment and tradeoffs, not memorization
- Distractors are deliberately tricky -- they sound correct to surface-level knowledge
- Each question includes detailed explanations for all 4 choices
- Each question has a "Why this matters" field tied to real business outcomes

### Quiz modes

- **Full Exam Simulation** -- 60 weighted random questions, timed
- **Domain Drill** -- All questions from a single domain
- **Task Statement Drill** -- Questions from a specific task statement (e.g., "1.3: Subagent Context")
- **Scenario Mode** -- Questions filtered by exam scenario (1--6)
- **Weak Spots** -- Prioritizes your lowest-scoring task statements
- **Review Mistakes** -- Only previously incorrect questions

### Analytics

- Per-domain and per-task-statement score tracking
- Weak spot identification across all 30 task statements
- Session history with accuracy trends
- All data persisted in localStorage

---

## Exam quick facts

- 60 multiple-choice questions, 1 correct + 3 distractors
- Scaled score 100--1000, passing is 720
- 4 of 6 scenarios chosen randomly per exam
- Domains: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code Config (20%), Prompt Engineering (20%), Context & Reliability (15%)

## Run locally

```bash
# Clone
git clone https://github.com/warfield2016/cca-study-plan.git
cd cca-study-plan

# Study Plan
npm install
npm run dev
# Opens at http://localhost:5173

# Quiz Engine (separate app)
cd quiz
npm install
npm run dev
# Opens at http://localhost:5174
```

## Deploy

Both apps build independently:

```bash
# Study Plan
npm run build    # Deploy dist/

# Quiz Engine
cd quiz
npm run build    # Deploy quiz/dist/
```

Works on Vercel, Netlify, or GitHub Pages.

## Project structure

```
cca-study-plan/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   └── App.jsx              # Study plan (single file)
├── quiz/                     # Quiz engine (separate app)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # Quiz engine UI + analytics
│       └── data/
│           ├── d1-agentic-architecture.js   (135 questions)
│           ├── d2-tool-design-mcp.js        (90 questions)
│           ├── d3-claude-code-config.js     (100 questions)
│           ├── d4-prompt-engineering.js     (100 questions)
│           └── d5-context-reliability.js    (75 questions)
└── README.md
```

## Stack

React 18 + Vite. No external UI libraries. Inline styles. Single component files -- easy to fork or extract data from.

## Free resources

- [Anthropic Skilljar](https://anthropic.skilljar.com) -- 13 self-paced courses
- [CertSafari](https://certsafari.com/anthropic/claude-certified-architect) -- 360 questions
- [ClaudeCertifications](https://claudecertifications.com) -- 33+ questions with explanations
- [ReadRoost](https://readroo.st) -- 300+ questions + flashcards
- [Claude Partner Network](https://partnernet.anthropic.com) -- Official 60-question practice exam
- [Anthropic GitHub](https://github.com/anthropics) -- Jupyter notebook courses

## License

MIT
