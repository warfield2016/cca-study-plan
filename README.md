# CCA-F Study Plan & Quiz Engine

Two companion apps for the **CCA Foundations** exam: a structured 4-week study plan and a 500-question quiz engine. Built to get you from zero to 900+ on the scaled score.

**Live site:** https://warfield2016.github.io/cca-study-plan/
**Quiz engine:** https://warfield2016.github.io/cca-study-plan/quiz/

---

## How to use this effectively

### Step 1 — Sign in with your email

When you first visit the site, you'll be asked for your email. This saves your progress to the cloud so you can pick up from any device. The site owner can track overall engagement and help identify where people get stuck.

### Step 2 — Start with the Weekly Plan tab

The 4-week schedule is designed to build on itself:

| Week | Phase | What you're doing | Target |
|------|-------|-------------------|--------|
| 1 | Foundation Sprint | Build mental models for all 5 domains. Take a baseline diagnostic. | 70% |
| 2 | Build Sprint | 4 hands-on projects mapped to all 6 exam scenarios. | 80% |
| 3 | Depth Sprint | Close gaps. Master tradeoffs. Drill your weakest domains hard. | 85% |
| 4 | Exam Sprint | Full practice exams, speed drilling, exam day. | 90%+ |

Expand each week, then each day. Every day has:
- **Tasks** — what to study, with checkboxes to track completion
- **KPI** — a measurable deliverable so you know you actually learned it
- **Closure quiz** — links to the quiz engine filtered to that day's topics

### Step 3 — Use the Brain Map to see the big picture

The **Brain Map** tab shows all 30 concepts across 5 domains as a radial graph. Arcs connect related concepts across domains — this is how the exam tests you (scenario questions touch 2-3 domains at once).

Click any concept to see:
- **Why it matters** — what breaks in production if you get this wrong
- **Used in** — real-world applications (support agents, extraction pipelines, CI/CD)
- **Connects to** — related concepts in other domains (click to jump there)
- **Learn more** — curated links to docs and courses
- **Watch for** — common failure modes and anti-patterns
- **Exam signals** — phrases in exam questions that point to this concept

### Step 4 — Drill with the Quiz Engine

500 questions across all 5 domains, weighted to match the actual exam. No easy questions — every one tests architectural judgment, not memorization. Each question has detailed explanations for all 4 choices.

**Six modes to match your study phase:**

| Mode | When to use it |
|------|----------------|
| Full Exam Simulation | Week 4. 60 weighted questions, timed. Closest to the real thing. |
| Domain Drill | Weeks 1-2. Deep-dive one domain at a time. |
| Task Statement Drill | Week 3. Target specific task statements (e.g., "1.3: Subagent Context"). |
| Scenario Mode | Week 3-4. Filter by exam scenario (1-6). |
| Weak Spots | Any time. Auto-identifies your lowest-scoring task statements. |
| Review Mistakes | Before the exam. Only questions you've gotten wrong before. |

### Step 5 — Use the Cheat Sheet and Decision Rules on exam day

The **Decision Rules** tab has 11 meta-rules that eliminate distractors instantly. Internalize these as reflexes — they're the difference between second-guessing and instant recognition.

The **Cheat Sheet** tab has 30+ one-liners aligned to all 30 official task statements. Review these the morning of your exam.

### Maximizing your score

- **Don't skip the projects** (Week 2). Building the customer support agent and extraction pipeline makes the abstract concepts concrete. You'll recognize the patterns instantly on the exam.
- **Use Weak Spots mode aggressively** from Week 3 onward. The exam doesn't care if you're 95% on your strongest domain — it cares if you're below 70% on any domain.
- **Study the Brain Map arcs, not just the nodes.** Scenario questions always cross domains. If you can trace the path from "Agentic Loop" through "Structured Errors" to "Error Propagation," you'll nail the multi-domain questions.
- **Time yourself.** 60 questions in 120 minutes = 2 minutes per question. Use Full Exam Simulation in timed mode to build that rhythm.

---

## Exam quick facts

- 60 multiple-choice questions, 1 correct + 3 distractors
- Scaled score 100-1000, passing is 720
- 4 of 6 scenarios chosen randomly per exam
- 5 domains: Agentic Architecture (27%), Tool Design & MCP (18%), Config & Workflows (20%), Prompt Engineering (20%), Context & Reliability (15%)

---

## Features

- **6 tabs**: Weekly Plan, Brain Map, Concepts, Projects, Decision Rules, Cheat Sheet
- **Theme toggle**: grey (default) or light mode
- **Email-based accounts**: sign in to save progress across devices
- **Cloud sync**: progress stored in Firebase, accessible from any browser
- **Daily KPIs** with measurable targets for each study day
- **Progress tracking** with checkboxes on tasks, concepts, and brain map nodes

---

## Progress tracking (for site owners)

User progress is stored in Firebase Firestore. To monitor engagement:

1. Open the [Firestore Console](https://console.firebase.google.com/project/cca-study-plan/firestore/databases/-default-/data)
2. Browse the `users` collection — each document is one user
3. Each user document contains:
   - `email` — their identifier
   - `firstSeen` / `lastSeen` — when they started and last visited
   - `studyProgress` — which tasks and concepts they've completed

No custom admin dashboard needed — the Firebase Console gives you filtering, sorting, and export.

---

## Question distribution

| Domain | Weight | Questions | Task Statements |
|--------|--------|-----------|----------------|
| D1: Agentic Architecture & Orchestration | 27% | 135 | 1.1-1.7 |
| D2: Tool Design & MCP Integration | 18% | 90 | 2.1-2.5 |
| D3: Configuration & Workflows | 20% | 100 | 3.1-3.6 |
| D4: Prompt Engineering & Structured Output | 20% | 100 | 4.1-4.6 |
| D5: Context Management & Reliability | 15% | 75 | 5.1-5.6 |

---

## Run locally

```bash
git clone https://github.com/warfield2016/cca-study-plan.git
cd cca-study-plan

# Study Plan
npm install
npm run dev

# Quiz Engine (separate app)
cd quiz
npm install
npm run dev
```

## Project structure

```
cca-study-plan/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── firebase.js          # Firebase config + Firestore helpers
│   └── App.jsx              # Study plan (single file, all content inline)
├── quiz/
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
├── docs/
│   └── CLI_MIGRATION_GUIDE.md
└── README.md
```

## Stack

React 18 + Vite + Firebase (Firestore). No external UI libraries. Inline styles. Auto-deploys to GitHub Pages on push to main.

## Free study resources

- [Skilljar Academy](https://anthropic.skilljar.com) — 16 self-paced courses
- [CertSafari](https://certsafari.com/anthropic/claude-certified-architect) — 360 practice questions
- [CCA Certifications](https://claudecertifications.com) — 33+ questions with explanations
- [ReadRoost](https://readroo.st) — 300+ questions + flashcards

## License

MIT
