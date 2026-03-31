# CCA-F Study Plan — 4 Weeks to 900+

A structured, interactive study plan for the **Claude Certified Architect – Foundations** exam. Built as a single-file React app you can run locally or deploy anywhere.

## What this is

A week-by-week battle plan covering all 5 exam domains, organized into 4 phases:

| Week | Phase | Goal |
|------|-------|------|
| 1 | Foundation Sprint | Build mental models for all 5 domains + take baseline diagnostic |
| 2 | Build Sprint | 4 hands-on projects mapped to all 6 exam scenarios |
| 3 | Depth Sprint | Close gaps, master tradeoffs, drill weak domains |
| 4 | Exam Sprint | Full practice exams, speed drilling, exam day |

## Exam quick facts

- 60 multiple-choice questions, 1 correct + 3 distractors
- Scaled score 100–1000, passing is 720, target is 900+
- 4 of 6 scenarios chosen randomly — you must be strong everywhere
- Domains: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code Config (20%), Prompt Engineering & Output (20%), Context & Reliability (15%)

## How to use this

### The 4 tabs

**Weekly Plan** — Expand any week, then expand individual days. Each day lists exactly what to study, what to build, and which domain it targets. The colored left border tells you the domain at a glance. Days with a build deliverable show a highlighted card at the bottom.

**Concepts** — A complete knowledge tree of every testable concept. Organized by domain with weight percentages. Expand a domain to see its concept clusters, each with 4 leaf nodes. Your self-test: pick any leaf node and explain it from memory. If you can't, that's a gap.

**Projects** — 4 production-style apps you build during Week 2. Each one maps to specific exam scenarios and lists the exact skills it exercises. These aren't optional — the exam tests judgment about tradeoffs, and you only develop judgment by making real decisions under real constraints.

**Decision Rules** — 7 meta-rules that eliminate ~60% of distractors. Each rule includes what it means, why it matters, and the signal words to watch for in exam questions. The most important one: "Programmatic enforcement beats prompt-based guidance when compliance must be guaranteed."

### Study sequence

1. **Week 1**: Go day-by-day through the plan. Complete the Anthropic Skilljar courses first, then study the exam guide task statements. End with a baseline diagnostic on CertSafari.
2. **Week 2**: Build all 4 projects. Don't skip any — each covers different scenarios and domains. Use Claude Code Desktop as your primary tool since the exam tests Claude Code-specific features.
3. **Week 3**: Open the Concepts tab. Systematically check every leaf node. Study tradeoffs and edge cases for your weak domains. Take a mid-check diagnostic.
4. **Week 4**: Take the official 60-question practice exam via Claude Partner Network. Drill remaining weak domains. Review the Decision Rules tab the night before.

### Free resources used

All resources in this plan are free:

- [Anthropic Skilljar](https://anthropic.skilljar.com) — 13 self-paced courses
- [CertSafari](https://certsafari.com/anthropic/claude-certified-architect) — 360 questions, domain-selectable, no signup
- [ClaudeCertifications](https://claudecertifications.com) — 33+ questions with explanations
- [ReadRoost](https://readroo.st) — 300+ questions + flashcards, free account required
- [Claude Partner Network](https://partnernet.anthropic.com) — Official 60-question practice exam
- [Anthropic GitHub](https://github.com/anthropics) — Jupyter notebook courses

## Run locally

```bash
# Clone it
git clone https://github.com/YOUR_USERNAME/cca-study-plan.git
cd cca-study-plan

# Install and run
npm install
npm run dev
```

Opens at `http://localhost:5173`. Works on desktop and mobile.

## Deploy

Works out of the box on Vercel, Netlify, or GitHub Pages:

```bash
npm run build
# Deploy the dist/ folder
```

## Project structure

```
cca-study-plan/
├── index.html          # Entry point
├── package.json        # Dependencies (React + Vite)
├── vite.config.js      # Build config
├── src/
│   ├── main.jsx        # React mount
│   └── App.jsx         # Entire app (single file)
└── README.md
```

## Stack

React 18 + Vite. No external UI libraries. No build-time CSS tools. Everything is inline styles in a single component file — easy to fork, modify, or extract data from.

## License

MIT — use it however you want.
