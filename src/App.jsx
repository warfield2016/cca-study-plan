import { useState, useEffect, useMemo, useCallback } from "react";
import { loadUserProgress, saveUserProgress, isFirebaseConfigured } from "./firebase.js";
import QuizEngine from "./QuizEngine.jsx";
import { d1Questions } from "./data/d1-agentic-architecture";
import { d2Questions } from "./data/d2-tool-design-mcp";
import { d3Questions } from "./data/d3-claude-code-config";
import { d4Questions } from "./data/d4-prompt-engineering";
import { d5Questions } from "./data/d5-context-reliability";

/* ─── localStorage helpers ─── */
const STORAGE_KEY = "cca-study-progress";
const THEME_KEY = "cca-theme";
const EMAIL_KEY = "cca-user-email";
function loadLocalProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveLocalProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
function loadTheme() {
  try { return localStorage.getItem(THEME_KEY) || "grey"; }
  catch { return "grey"; }
}
function saveTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch {} }
function loadEmail() {
  try { return localStorage.getItem(EMAIL_KEY) || ""; }
  catch { return ""; }
}
function saveEmail(e) { try { localStorage.setItem(EMAIL_KEY, e); } catch {} }

/* ─── THEMES: grey + light ─── */
const THEMES = {
  grey: {
    bgRoot: "#1f2026", bgPanel: "#24252e", bgPanelAlt: "#2c2d36",
    border: "#363742", borderSoft: "#323340", borderMed: "#3e3f4c",
    textPrimary: "#f5f5f7", textBody: "#e0e0e6", textSoft: "#b8b8c2",
    textMuted: "#9a9aa6", textFaint: "#8a8a96", textDim: "#6a6a76",
  },
  light: {
    bgRoot: "#fafafa", bgPanel: "#ffffff", bgPanelAlt: "#f2f2f4",
    border: "#d8d8dd", borderSoft: "#e4e4e8", borderMed: "#c8c8d0",
    textPrimary: "#0c0c10", textBody: "#2a2a32", textSoft: "#4a4a55",
    textMuted: "#6a6a75", textFaint: "#8a8a95", textDim: "#b0b0b8",
  },
};

function themeVars(theme) {
  const t = THEMES[theme] || THEMES.grey;
  return {
    "--bg-root": t.bgRoot, "--bg-panel": t.bgPanel, "--bg-panel-alt": t.bgPanelAlt,
    "--border": t.border, "--border-soft": t.borderSoft, "--border-med": t.borderMed,
    "--text-primary": t.textPrimary, "--text-body": t.textBody, "--text-soft": t.textSoft,
    "--text-muted": t.textMuted, "--text-faint": t.textFaint, "--text-dim": t.textDim,
  };
}

/* ─── WEEKS ─── */
const WEEKS = [
  {
    id: 1,
    title: "Foundation Sprint",
    subtitle: "Core mental models + baseline diagnostic",
    theme: "Build the skeleton — understand HOW the system thinks",
    days: [
      {
        day: "Days 1–2",
        focus: "Agentic Loop Mastery",
        domain: "D1",
        tasks: [
          "Complete Anthropic Skilljar: 'Agentic Patterns' + 'Tool Use' courses",
          "Study stop_reason lifecycle: tool_use → execute → append → loop vs end_turn → terminate",
          "Learn anti-patterns: never parse NL for termination, never use iteration caps as primary stop",
          "Key insight: Model-driven decisions, NOT pre-configured decision trees",
        ],
        build: null,
        kpi: "Can diagram the full stop_reason lifecycle and identify 3 anti-patterns without reference",
        closure: { label: "Quiz: D1 Agentic Loop (15 Qs)", mode: "topic", domain: "D1", topic: "Agentic Loop", target: 70 },
      },
      {
        day: "Days 3–4",
        focus: "Tool Design + MCP Foundations",
        domain: "D2",
        tasks: [
          "Study tool descriptions as THE mechanism for tool selection",
          "Learn tool splitting: generic → purpose-specific (analyze_document → extract_data_points + summarize_content + verify_claim)",
          "MCP: tools (actions) vs resources (content catalogs) — resources reduce exploratory calls",
          "Config: .mcp.json (project/shared) vs ~/.claude.json (user/personal), env var expansion ${TOKEN}",
        ],
        build: null,
        kpi: "Can differentiate tools vs resources, explain when to split/consolidate tools, configure MCP scoping",
        closure: { label: "Quiz: D2 Tool Design (15 Qs)", mode: "topic", domain: "D2", topic: "Tool Interface Design", target: 70 },
      },
      {
        day: "Day 5",
        focus: "Claude Code Config",
        domain: "D3",
        tasks: [
          "CLAUDE.md hierarchy: user → project → directory (most specific wins)",
          ".claude/rules/ with YAML frontmatter glob patterns for path-scoping",
          ".claude/commands/ for slash commands, .claude/skills/ with context: fork + allowed-tools",
          "Plan mode (complexity/architecture) vs direct execution (single-file changes)",
          "Path-specific rules: glob patterns for conventions that span directories (e.g., **/*.test.tsx)",
        ],
        build: null,
        kpi: "Can configure CLAUDE.md hierarchy, create path-scoped rules, explain plan vs direct mode",
        closure: { label: "Quiz: D3 Config (15 Qs)", mode: "domain", domain: "D3", topic: null, target: 70 },
      },
      {
        day: "Day 6",
        focus: "Prompt Engineering + Structured Output",
        domain: "D4",
        tasks: [
          "tool_use with JSON schemas = guaranteed schema compliance (eliminates syntax errors, NOT semantic errors)",
          "tool_choice: auto vs any vs forced — know exactly when each applies",
          "Few-shot: 2–4 examples targeting ambiguous cases, showing WHY one action beats alternatives",
          "Validation-retry loops: document + failed extraction + specific error → retry",
          "Multi-pass review: independent instance catches what same-session self-review misses",
        ],
        build: null,
        kpi: "Can explain tool_choice modes, design few-shot for ambiguous cases, articulate self-review limitation",
        closure: { label: "Quiz: D4 Prompt Eng (15 Qs)", mode: "domain", domain: "D4", topic: null, target: 70 },
      },
      {
        day: "Day 7",
        focus: "Context + Reliability + BASELINE TEST",
        domain: "D5",
        tasks: [
          "Progressive summarization risks: losing numbers, dates, percentages",
          "Lost-in-the-middle: put key findings at START and END, not middle",
          "Trim verbose tool outputs BEFORE they accumulate (40 fields → 5 relevant)",
          "Scratchpad files for persisting findings across context boundaries in long sessions",
          "Take CertSafari diagnostic: 60 questions, all domains → establish baseline scores",
        ],
        build: "BASELINE: CertSafari 60-question diagnostic across all domains",
        kpi: "Score ≥50% on baseline diagnostic; can explain lost-in-the-middle and context trimming patterns",
        closure: { label: "Take CCA Quiz Engine: Full Exam Baseline (60 Qs)", mode: "exam", domain: "ALL", topic: null, target: 50 },
      },
    ],
  },
  {
    id: 2,
    title: "Build Sprint",
    subtitle: "Hands-on projects that cover every exam scenario",
    theme: "You don't understand it until you build it",
    days: [
      {
        day: "Days 8–9",
        focus: "BUILD: Customer Support Agent",
        domain: "D1+D2",
        tasks: [
          "Implement full agentic loop with get_customer → lookup_order → process_refund flow",
          "Add PostToolUse hook to normalize data formats (timestamps, status codes)",
          "Add tool call interception hook: block refunds > $500, redirect to escalation",
          "Implement programmatic prerequisite: BLOCK lookup_order until get_customer returns verified ID",
        ],
        build: "Customer Support Resolution Agent with hooks, escalation, error handling",
        kpi: "Working agent with hooks enforcing identity verification + refund limits programmatically",
        closure: { label: "Quiz: D1 Hooks & Enforcement (15 Qs)", mode: "topic", domain: "D1", topic: "Workflow Enforcement", target: 80 },
      },
      {
        day: "Days 10–11",
        focus: "BUILD: Multi-Agent Research System",
        domain: "D1+D5",
        tasks: [
          "Build coordinator with allowedTools including Task for subagent spawning",
          "Implement explicit context passing — subagents don't inherit parent context",
          "Parallel subagent execution: multiple Task calls in single coordinator response",
          "Structured error propagation: failure_type + attempted_query + partial_results",
        ],
        build: "Multi-Agent Research Pipeline with coordinator, 2+ subagents, provenance tracking",
        kpi: "Working multi-agent system with explicit context passing and structured error propagation",
        closure: { label: "Quiz: D1 Multi-Agent + D5 Error Propagation (20 Qs)", mode: "topic", domain: "D1", topic: "Multi-Agent Orchestration", target: 80 },
      },
      {
        day: "Days 12–13",
        focus: "BUILD: Structured Data Extraction",
        domain: "D4+D5",
        tasks: [
          "Design JSON schema: required vs optional fields, enum + other + detail string pattern",
          "Implement validation-retry loop with Pydantic semantic validation",
          "Batch processing with Message Batches API: handle failures by custom_id",
          "Human review routing: field-level confidence scores → low-confidence → human review",
        ],
        build: "Document Extraction Pipeline with schemas, validation-retry, batch processing",
        kpi: "Working extraction pipeline with nullable fields, validation-retry, and confidence routing",
        closure: { label: "Quiz: D4 Schemas + Batch (15 Qs)", mode: "topic", domain: "D4", topic: "Structured Output", target: 80 },
      },
      {
        day: "Day 14",
        focus: "BUILD: Claude Code CI/CD Integration",
        domain: "D3+D4",
        tasks: [
          "Use -p / --print flag for non-interactive CI mode",
          "--output-format json + --json-schema for structured CI output",
          "Design review prompts with explicit criteria (not 'be conservative')",
          "Multi-pass review: per-file local analysis → cross-file integration pass",
          "Iterative refinement: input/output examples, test-driven iteration, interview pattern",
        ],
        build: "CI/CD code review pipeline using Claude Code CLI flags",
        kpi: "Working CI pipeline with -p flag, structured output, and multi-pass review architecture",
        closure: { label: "Quiz: D3 CI/CD + D4 Review (15 Qs)", mode: "topic", domain: "D3", topic: "CLI for CI/CD", target: 80 },
      },
    ],
  },
  {
    id: 3,
    title: "Depth Sprint",
    subtitle: "Close gaps, master tradeoffs, drill weak domains",
    theme: "The exam tests JUDGMENT, not just knowledge",
    days: [
      {
        day: "Days 15–16",
        focus: "Master the Meta-Principle + Tradeoffs",
        domain: "ALL",
        tasks: [
          "CORE RULE: Programmatic enforcement beats prompt-based guidance when compliance must be guaranteed",
          "Know when hooks > prompts (financial operations, identity verification, policy rules)",
          "Know when prompts ARE sufficient (style guidance, tone, formatting preferences)",
          "Practice: For every scenario question, first ask 'Does this need deterministic guarantees?'",
          "Scoped tool access: 4-5 tools per agent beats 18 overloaded tools — reduced selection degrades reliability",
        ],
        build: null,
        kpi: "Can instantly categorize any scenario as programmatic-vs-prompt; articulate tool scoping principle",
        closure: { label: "Quiz: All Domains Tradeoffs (20 Qs)", mode: "exam", domain: "ALL", topic: null, target: 85 },
      },
      {
        day: "Days 17–18",
        focus: "Escalation + Error Handling Patterns",
        domain: "D5",
        tasks: [
          "Escalation triggers: customer demands human, policy gap exists, agent can't progress",
          "Anti-patterns: sentiment-based escalation, self-reported confidence scores, heuristic customer matching",
          "Structured errors: errorCategory (transient/validation/permission) + isRetryable + description",
          "Error propagation: structured context enables recovery; generic 'unavailable' hides context",
          "Access failure vs valid empty result — the coordinator needs to distinguish these for recovery",
        ],
        build: null,
        kpi: "Can list 3 escalation triggers, 3 anti-patterns, and explain structured vs generic error tradeoff",
        closure: { label: "Quiz: D5 Escalation + Error (15 Qs)", mode: "topic", domain: "D5", topic: "Escalation Patterns", target: 85 },
      },
      {
        day: "Days 19–20",
        focus: "Context Window + Session Management",
        domain: "D3+D5",
        tasks: [
          "Case facts block: extract amounts/dates/IDs into persistent block outside summarized history",
          "Session mgmt: --resume, fork_session for parallel exploration, fresh + summary vs stale resume",
          "Subagent output design: structured data (facts, citations, scores) NOT verbose reasoning chains",
          "Different content types get different rendering: financial=tables, news=prose, technical=structured lists",
          "Codebase exploration: scratchpad files, /compact for context, Explore subagent for verbose discovery",
          "Crash recovery: structured agent state exports (manifests) loaded on coordinator resume",
        ],
        build: null,
        kpi: "Can design a context management strategy for a 200k-token session with multiple tool calls",
        closure: { label: "Quiz: D5 Context + D3 Sessions (15 Qs)", mode: "topic", domain: "D5", topic: "Context Management", target: 85 },
      },
      {
        day: "Day 21",
        focus: "Gap Analysis + Targeted Drilling",
        domain: "WEAK",
        tasks: [
          "Take CertSafari: 60 questions domain-filtered to your 2 weakest domains",
          "Review every wrong answer — identify if error was: concept gap, misread, or tradeoff misjudgment",
          "For concept gaps: re-read exam guide task statement + build a mini-exercise",
          "For tradeoff errors: practice applying the programmatic-vs-prompt filter first",
        ],
        build: "MID-CHECK: Domain-specific drilling on weak areas",
        kpi: "Score ≥85% on weakest domain quiz; all concept gaps identified and addressed",
        closure: { label: "Quiz: Weak Spots Mode (30 Qs)", mode: "weak", domain: "WEAK", topic: null, target: 85 },
      },
    ],
  },
  {
    id: 4,
    title: "Exam Sprint",
    subtitle: "Full practice exams, speed drilling, exam-day readiness",
    theme: "Simulate the real thing until it feels routine",
    days: [
      {
        day: "Days 22–23",
        focus: "Full Practice Exam (Claude Partner Network)",
        domain: "ALL",
        tasks: [
          "Take the official 60-question practice exam — full timed simulation",
          "Score by domain — identify any remaining weak spots",
          "For each wrong answer: write a 1-sentence 'why I was wrong' note",
          "Cross-reference with exam guide task statements for systematic coverage",
        ],
        build: "Official 60-question practice exam via Claude Partner Network",
        kpi: "Score ≥80% on official practice exam; all 5 domains above 70%",
        closure: { label: "Quiz: Full Exam Simulation (60 Qs)", mode: "exam", domain: "ALL", topic: null, target: 80 },
      },
      {
        day: "Days 24–25",
        focus: "Scenario Simulation Drilling",
        domain: "ALL",
        tasks: [
          "For each of the 6 exam scenarios: write out the decision tree you'd use",
          "Practice: given a scenario description, identify which domains are tested",
          "Speed drill: CertSafari random 20-question sets, target < 30 seconds per question",
          "Review ClaudeCertifications.com 33 questions with explanations for edge cases",
        ],
        build: null,
        kpi: "Can map all 6 scenarios to their primary domains in <10 seconds each",
        closure: { label: "Quiz: Scenario Mode — all 6 scenarios (20 Qs each)", mode: "scenario", domain: "ALL", topic: null, target: 85 },
      },
      {
        day: "Days 26–27",
        focus: "Final Weak Domain Assault + Mental Models",
        domain: "WEAK",
        tasks: [
          "Build a 1-page cheat sheet of decision rules (writing cements recall even if you can't use it in exam)",
          "Key decisions: hooks vs prompts, split vs consolidate tools, escalate vs resolve",
          "ReadRoost 300+ questions: flashcard mode for rapid pattern recognition",
          "Re-take any CertSafari domains where you scored below 85%",
        ],
        build: null,
        kpi: "Score ≥90% on CCA Quiz Engine weak spots mode; cheat sheet written from memory",
        closure: { label: "Quiz: Review Mistakes + Weak Spots (all remaining)", mode: "weak", domain: "WEAK", topic: null, target: 90 },
      },
      {
        day: "Day 28",
        focus: "EXAM DAY",
        domain: "—",
        tasks: [
          "Light review only — read your cheat sheet once",
          "Review the 12 sample questions from the exam guide (you should get all 12 right by now)",
          "Mental rehearsal: scenario → domains tested → meta-principle filter → eliminate distractors",
          "Rest. You've done the work. Trust the preparation.",
        ],
        build: "SIT THE EXAM",
        kpi: "Confident on all 30 task statements; decision rules are reflexes, not recall",
        closure: { label: "Final confidence check: 12 sample Qs from exam guide", mode: "exam", domain: "ALL", topic: null, target: 95 },
      },
    ],
  },
];

/* ─── CONCEPT TREE ─── */
const CONCEPT_TREE = [
  {
    domain: "D1: Agentic Architecture",
    weight: "27%",
    accent: "#c0392b",
    concepts: [
      { name: "Agentic Loop", children: ["stop_reason handling (tool_use vs end_turn)", "tool result appending to conversation", "loop termination conditions", "anti-patterns: NL parsing, iteration caps, text-content checking"] },
      { name: "Multi-Agent Orchestration", children: ["hub-and-spoke architecture", "coordinator manages all inter-agent communication", "dynamic subagent selection by query complexity", "risks of overly narrow task decomposition"] },
      { name: "Subagent Management", children: ["Task tool + allowedTools must include 'Task'", "explicit context passing (no auto-inheritance)", "parallel spawning: multiple Task calls in single response", "AgentDefinition: descriptions, system prompts, tool restrictions"] },
      { name: "Workflow Enforcement", children: ["programmatic prerequisites vs prompt guidance", "hooks for deterministic compliance", "structured handoff: customer ID, root cause, recommended action", "decomposing multi-concern requests into parallel investigations"] },
      { name: "Agent SDK Hooks", children: ["PostToolUse for data normalization", "tool call interception for policy enforcement", "hooks > prompts when business rules require guaranteed compliance", "redirecting blocked actions to alternative workflows"] },
      { name: "Task Decomposition", children: ["prompt chaining (fixed sequential)", "adaptive decomposition based on findings", "per-file + cross-file passes for reviews", "open-ended tasks: map structure → identify high-impact → prioritized plan"] },
      { name: "Session State & Forking", children: ["--resume session-name for continuation", "fork_session for divergent exploration from shared baseline", "fresh + summary vs stale resume tradeoff", "inform resumed session about specific file changes"] },
    ],
  },
  {
    domain: "D2: Tool Design & MCP",
    weight: "18%",
    accent: "#d35400",
    concepts: [
      { name: "Tool Interface Design", children: ["descriptions drive tool selection", "include input formats, examples, edge cases, boundaries", "rename + update descriptions to eliminate overlap", "splitting generic → purpose-specific tools"] },
      { name: "Structured Error Responses", children: ["errorCategory: transient/validation/permission", "isRetryable boolean prevents wasted retries", "isError flag in MCP for tool failures", "access failure vs valid empty result distinction"] },
      { name: "Tool Distribution & tool_choice", children: ["4-5 tools per agent; 18 degrades selection", "scoped cross-role tools for high-frequency needs", "tool_choice: auto / any / forced selection", "forced tool for sequencing (extract before enrich)"] },
      { name: "MCP Integration", children: [".mcp.json (project) vs ~/.claude.json (user)", "env var expansion ${TOKEN} for credentials", "community servers over custom for standard integrations", "resources = content catalogs; tools = actions"] },
      { name: "Built-in Tools", children: ["Grep: content search across codebase", "Glob: file path pattern matching", "Read/Write/Edit: file operations", "Edit fails → Read + Write fallback; incremental Grep → Read tracing"] },
    ],
  },
  {
    domain: "D3: Claude Code Config",
    weight: "20%",
    accent: "#27ae60",
    concepts: [
      { name: "CLAUDE.md Hierarchy", children: ["user (~/.claude/) → project (.claude/ or root) → directory", "user-level NOT shared via version control", "@import for modular standards files", ".claude/rules/ as alternative to monolithic CLAUDE.md"] },
      { name: "Commands & Skills", children: [".claude/commands/ (project) vs ~/.claude/commands/ (personal)", ".claude/skills/ + SKILL.md with frontmatter config", "context: fork isolates verbose skill output", "allowed-tools + argument-hint in frontmatter"] },
      { name: "Path-Specific Rules", children: [".claude/rules/ with YAML frontmatter glob patterns", "paths: ['src/api/**/*'] for conditional loading", "glob patterns span directories (e.g., **/*.test.tsx)", "path rules > directory CLAUDE.md for cross-directory conventions"] },
      { name: "Plan vs Direct Execution", children: ["plan mode: large-scale, multiple approaches, architectural", "direct: well-scoped single-file changes", "Explore subagent isolates verbose discovery", "combine: plan for investigation, direct for implementation"] },
      { name: "Iterative Refinement", children: ["concrete input/output examples > prose descriptions", "test-driven: write tests first, share failures to iterate", "interview pattern: agent asks questions before implementing", "single message for interacting issues; sequential for independent"] },
      { name: "CLI for CI/CD", children: ["-p / --print: non-interactive mode", "--output-format json + --json-schema", "CLAUDE.md provides project context to CI-invoked Claude", "session isolation: separate instance for review vs generation"] },
    ],
  },
  {
    domain: "D4: Prompt Eng & Output",
    weight: "20%",
    accent: "#2980b9",
    concepts: [
      { name: "Explicit Criteria", children: ["specific categorical criteria > vague instructions", "'flag when claimed behavior contradicts actual' > 'be conservative'", "false positive rates destroy developer trust", "disable high-FP categories while improving prompts"] },
      { name: "Few-Shot Prompting", children: ["2–4 examples targeting ambiguous scenarios", "show reasoning for WHY one action beats alternatives", "demonstrate desired output format consistently", "enables generalization to novel patterns beyond pre-specified cases"] },
      { name: "Structured Output", children: ["tool_use + JSON schema = guaranteed schema compliance", "eliminates syntax errors; semantic errors persist", "tool_choice: auto (may skip) / any (must call) / forced (specific)", "nullable/optional fields prevent fabrication on absent data"] },
      { name: "Schema Design", children: ["required vs optional fields", "enum + 'other' + detail string for extensible categories", "nullable fields when source may lack info", "Pydantic for semantic validation beyond schema"] },
      { name: "Batch & Validation", children: ["Message Batches API: 50% cost, up to 24hr, no latency SLA", "custom_id for request/response correlation", "batch: overnight reports; sync: pre-merge blocking checks", "validation-retry: include document + failed extraction + specific error"] },
      { name: "Multi-Pass Review", children: ["self-review limited by retained reasoning context", "independent review instance > same-session self-review", "per-file local passes + cross-file integration pass", "confidence self-reporting for calibrated review routing"] },
    ],
  },
  {
    domain: "D5: Context & Reliability",
    weight: "15%",
    accent: "#8e44ad",
    concepts: [
      { name: "Context Management", children: ["case facts block: amounts/dates/IDs outside summarized history", "trim verbose tool outputs to relevant fields BEFORE accumulation", "lost-in-the-middle: key findings at START and END", "structured issue data in separate context layer for multi-issue sessions"] },
      { name: "Escalation Patterns", children: ["triggers: customer demands human, policy gaps, can't progress", "honor explicit human requests immediately", "sentiment-based escalation is unreliable anti-pattern", "ask for identifiers on multiple matches, not heuristic selection"] },
      { name: "Error Propagation", children: ["structured: failure_type + attempted_query + partial_results + alternatives", "access failure vs valid empty result distinction", "local recovery for transient; propagate only unresolvable", "coverage annotations: well-supported findings vs gaps from unavailable sources"] },
      { name: "Codebase Exploration Context", children: ["context degradation: inconsistent answers, 'typical patterns' references", "scratchpad files persist key findings across context boundaries", "/compact reduces context during verbose exploration", "crash recovery: agent state manifests loaded on coordinator resume"] },
      { name: "Confidence & Review", children: ["aggregate 97% accuracy can mask poor performance on specific doc types", "stratified random sampling for ongoing error rate measurement", "field-level confidence calibrated with labeled validation sets", "validate accuracy by doc type and field before automating"] },
      { name: "Provenance", children: ["claim-source mappings preserved through synthesis", "temporal data: require publication/collection dates", "conflict annotation with source attribution, not arbitrary selection", "structured reports: well-established vs contested findings sections"] },
    ],
  },
];

/* ─── ENRICHED_CONCEPTS: brain-map metadata (why/production/links/failures/signals) ─── */
const ENRICHED_CONCEPTS = [
  // ═══════════════════════════════════════════════════════════
  // D1 — Agentic Architecture (7 concepts, 27% weight)
  // ═══════════════════════════════════════════════════════════
  {
    id: "d1-agentic-loop", name: "Agentic Loop", domain: "D1", task: "1.1",
    whyItMatters: "The loop is the core execution model. Check text content instead of stop_reason and your agent stops mid-workflow — claims don't get approved, support tickets sit half-resolved, extraction pipelines go silent. Tested heavily because it breaks quietly in prod.",
    productionExamples: ["Customer support ticket resolution", "Insurance claims processing (retrieve → assess → approve)", "Document extraction pipelines"],
    relatedConcepts: ["d2-structured-errors", "d4-structured-output", "d5-error-propagation"],
    resources: [
      { label: "Building with the API (Skilljar Course)", url: "https://anthropic.skilljar.com", type: "course" },
      { label: "SDK Overview", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
    ],
    failureModes: ["Checking text content for termination → stops before tools finish", "NL parsing of tool results → brittle, unreliable routing", "Iteration cap without monitoring → silent task truncation"],
    examSignals: ["agent stops mid-workflow", "reliability issue", "loop termination", "not calling expected tool"],
  },
  {
    id: "d1-multi-agent", name: "Multi-Agent Orchestration", domain: "D1", task: "1.2",
    whyItMatters: "Complex work exceeds one agent's context and tool budget. Hub-and-spoke — a coordinator delegating to specialized subagents — scales to research, investigation, and cross-source synthesis. Overly narrow decomposition recreates the problem: fragmented context, no one can synthesize.",
    productionExamples: ["Research systems querying multiple sources", "Codebase-wide refactors (per-file + cross-file passes)", "Compliance sweeps across heterogeneous datastores"],
    relatedConcepts: ["d1-subagent-mgmt", "d1-task-decomp", "d5-context-mgmt"],
    resources: [
      { label: "Subagent Docs", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
      { label: "Full Stack Guide (alexop.dev)", url: "https://alexop.dev/posts/understanding-claude-code-full-stack/", type: "blog" },
    ],
    failureModes: ["Too-narrow subagents → fragmented context, no synthesis possible", "Coordinator doing execution work instead of delegating", "Bypassing the coordinator for inter-subagent chat"],
    examSignals: ["hub-and-spoke", "coordinator", "subagent selection", "complex investigation"],
  },
  {
    id: "d1-subagent-mgmt", name: "Subagent Management", domain: "D1", task: "1.3",
    whyItMatters: "Subagents don't inherit parent context. If you don't pass complete findings explicitly in the subagent's prompt, the synthesis step sees half a story. This is the #1 multi-agent bug: the synthesis agent has no idea what was already found.",
    productionExamples: ["Parallel codebase investigations", "Cross-department research (legal + finance + ops)", "Per-file review + cross-file integration review"],
    relatedConcepts: ["d1-multi-agent", "d5-context-mgmt", "d5-provenance"],
    resources: [
      { label: "Task Tool Docs", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
    ],
    failureModes: ["Assuming context inheritance → synthesis agent lacks info", "Sequential Task calls when they could run in parallel", "Over-broad allowedTools → subagent drifts out of scope"],
    examSignals: ["subagent", "context passing", "synthesis agent lacks info", "parallel Task"],
  },
  {
    id: "d1-workflow-enforce", name: "Workflow Enforcement", domain: "D1", task: "1.4",
    whyItMatters: "For financial ops, identity verification, or policy rules, prompts like 'always check X first' have non-zero failure rates. Hooks and programmatic prerequisites enforce these deterministically. The exam loves this distractor: 'occasionally fails' means you need a hook, not better wording.",
    productionExamples: ["KYC checks before account creation", "Policy validation before refund", "PII redaction before logging"],
    relatedConcepts: ["d1-hooks", "d2-tool-design", "d3-claude-md"],
    resources: [
      { label: "Hooks Docs", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
    ],
    failureModes: ["Relying on prompts for compliance → 5% failure rate compounds", "Hook runs after the tool, not before → irreversible damage done", "Redundant prompt-and-hook instructions → confusion, not safety"],
    examSignals: ["reliability issue", "occasionally", "non-zero failure rate", "compliance must be guaranteed"],
  },
  {
    id: "d1-hooks", name: "Agent SDK Hooks", domain: "D1", task: "1.5",
    whyItMatters: "Hooks (PostToolUse, PreToolUse) run deterministic code around every tool call. They're how you intercept, normalize, enforce, and redirect — without relying on the model. The desktop app can't do this; the Agent SDK can.",
    productionExamples: ["PII scrubbing on every file read", "Audit logging every DB write", "Blocking writes to protected paths"],
    relatedConcepts: ["d1-workflow-enforce", "d3-claude-md", "d2-tool-design"],
    resources: [
      { label: "Hooks Reference", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
      { label: "Features Explained (Medium)", url: "https://muneebsa.medium.com/claude-code-extensions-explained-skills-mcp-hooks-subagents-agent-teams-plugins-9294907e84ff", type: "blog" },
    ],
    failureModes: ["Using prompts to enforce what hooks should enforce", "Hooks with side effects + retries → double writes", "Forgetting hooks run in subagents too"],
    examSignals: ["policy enforcement", "deterministic compliance", "tool call interception", "data normalization"],
  },
  {
    id: "d1-task-decomp", name: "Task Decomposition", domain: "D1", task: "1.6",
    whyItMatters: "Fixed prompt chains work for predictable flows; adaptive decomposition (map structure → identify high-impact → prioritized plan) works for open-ended tasks. Choosing wrong costs tokens and time, or worse, misses the high-impact issues entirely.",
    productionExamples: ["Codebase security audits (adaptive)", "ETL pipelines (fixed chain)", "Incident investigations (adaptive)"],
    relatedConcepts: ["d1-multi-agent", "d3-plan-vs-direct", "d4-multi-pass-review"],
    resources: [
      { label: "Prompt Chaining Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Fixed chain on open-ended task → misses the point", "Adaptive decomposition on a deterministic pipeline → wasted planning", "Per-file only (no cross-file pass) → integration bugs missed"],
    examSignals: ["adaptive decomposition", "per-file + cross-file", "prompt chaining", "map structure first"],
  },
  {
    id: "d1-session-state", name: "Session State & Forking", domain: "D1", task: "1.7",
    whyItMatters: "Long sessions degrade — answers get vague, context fills up. `fork_session` lets you explore alternatives from a shared baseline. `--resume` vs fresh + summary is a real tradeoff: resume keeps reasoning but compounds degradation; fresh loses nuance but starts clean.",
    productionExamples: ["Architecture exploration (fork for alternatives)", "Long debugging sessions", "A/B comparing refactors from a checkpoint"],
    relatedConcepts: ["d5-context-mgmt", "d5-codebase-exploration", "d3-iterative-refinement"],
    resources: [
      { label: "Resume Sessions Docs", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Always resuming → context degrades permanently", "Always starting fresh → losing valuable context repeatedly", "Forking without informing about diverged changes"],
    examSignals: ["--resume", "fork_session", "divergent exploration", "session merging"],
  },
  // ═══════════════════════════════════════════════════════════
  // D2 — Tool Design & MCP (5 concepts, 18% weight)
  // ═══════════════════════════════════════════════════════════
  {
    id: "d2-tool-design", name: "Tool Interface Design", domain: "D2", task: "2.1",
    whyItMatters: "Tools are selected based on DESCRIPTIONS, not names. If two tools have overlapping descriptions, selection becomes unreliable and wrong tools fire. Splitting a generic tool into purpose-specific ones (with boundaries spelled out) fixes this.",
    productionExamples: ["Billing API with separate refund/adjustment/dispute endpoints", "Knowledge base tools split by authoritativeness", "Split read-only vs write-allowed file tools"],
    relatedConcepts: ["d2-tool-distribution", "d2-structured-errors", "d1-hooks"],
    resources: [
      { label: "Tool Design Docs", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
    ],
    failureModes: ["Overlapping tool descriptions → wrong tool called", "Ghost associations from system prompt keywords", "Generic tools used in specialized contexts → incorrect operations"],
    examSignals: ["wrong tool called", "tool selection unreliable", "descriptions drive selection", "tool boundaries"],
  },
  {
    id: "d2-structured-errors", name: "Structured Error Responses", domain: "D2", task: "2.2",
    whyItMatters: "`errorCategory + isRetryable + description` lets the coordinator decide: retry, fall back, or escalate. Generic 'unavailable' hides information. The big one: access failure vs valid empty result — if the agent can't distinguish 'DB down' from 'no matching rows', it reports all-clear on broken infra.",
    productionExamples: ["Compliance monitoring (empty ≠ access failure)", "Retry logic with exponential backoff", "Escalation routing by error category"],
    relatedConcepts: ["d5-error-propagation", "d1-agentic-loop", "d5-escalation"],
    resources: [
      { label: "Error Handling Docs", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
    ],
    failureModes: ["Access failure reported as 'no results' → false all-clear", "isRetryable=true on deterministic failures → infinite loops", "Generic errors → coordinator makes blind decisions"],
    examSignals: ["error handling", "recovery", "coordinator decisions", "access failure vs empty"],
  },
  {
    id: "d2-tool-distribution", name: "Tool Distribution & tool_choice", domain: "D2", task: "2.3",
    whyItMatters: "4-5 tools per agent works; 18 degrades selection reliability. Scope tools to the agent's role. `tool_choice` (auto/any/forced) controls when a call is required — forced tool is how you sequence (extract before enrich, verify before act).",
    productionExamples: ["Customer support agent (5 tools)", "Research agent (7 scoped tools)", "Forced 'verify_identity' before 'process_refund'"],
    relatedConcepts: ["d2-tool-design", "d4-structured-output", "d1-subagent-mgmt"],
    resources: [
      { label: "tool_choice Docs", url: "https://platform.claude.com/docs/en/agent-sdk/overview", type: "docs" },
    ],
    failureModes: ["18+ tools per agent → selection unreliable", "tool_choice='any' when you need 'forced'", "Cross-role tools everywhere → drift from role"],
    examSignals: ["too many tools", "tool selection unreliable", "wrong tool called", "forced tool sequencing"],
  },
  {
    id: "d2-mcp", name: "MCP Integration", domain: "D2", task: "2.4",
    whyItMatters: "`.mcp.json` (project-level, version-controlled) vs `~/.claude.json` (user-level, private). Env var expansion `${TOKEN}` keeps credentials out of config. Key distinction: MCP **tools** perform actions; MCP **resources** expose content catalogs — resources reduce exploratory tool calls.",
    productionExamples: ["Shared team MCP servers (via .mcp.json)", "Personal tokens in ~/.claude.json", "Doc catalog exposed as MCP resources (no tool call needed to list)"],
    relatedConcepts: ["d2-tool-design", "d3-claude-md", "d2-builtin-tools"],
    resources: [
      { label: "Model Context Protocol Docs", url: "https://modelcontextprotocol.io/docs", type: "docs" },
      { label: "MCP: Universal Connectivity (ZenML)", url: "https://www.zenml.io/llmops-database/model-context-protocol-mcp-building-universal-connectivity-for-llms-in-production", type: "blog" },
    ],
    failureModes: ["Credentials in .mcp.json committed to git", "Custom MCP server for standard integration → maintenance burden", "Using tools when resources would work better"],
    examSignals: ["content catalog", "reduce tool calls", "give visibility", "project vs user config"],
  },
  {
    id: "d2-builtin-tools", name: "Built-in Tools", domain: "D2", task: "2.5",
    whyItMatters: "Grep for content search, Glob for paths, Read/Write/Edit for files. Edit fails → fall back to Read + Write. Incremental Grep → Read tracing beats loading whole directories. Knowing the fallback patterns keeps sessions efficient.",
    productionExamples: ["Codebase search workflows", "Large-file editing via surgical Edits", "Tracing symbol usage via Grep chains"],
    relatedConcepts: ["d2-tool-distribution", "d3-plan-vs-direct", "d5-codebase-exploration"],
    resources: [
      { label: "Built-in Tools Docs", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Reading whole files instead of Grep → context waste", "Edit when string not unique → silent failure, use Read+Write", "Glob for content search (wrong tool)"],
    examSignals: ["Grep", "Glob", "Edit fails", "fallback pattern", "incremental tracing"],
  },
  // ═══════════════════════════════════════════════════════════
  // D3 — Config & Workflows (6 concepts, 20% weight)
  // ═══════════════════════════════════════════════════════════
  {
    id: "d3-claude-md", name: "CLAUDE.md Hierarchy", domain: "D3", task: "3.1",
    whyItMatters: "User (~/.claude/) → project (.claude/) → directory CLAUDE.md files merge into working context. User-level is NOT version-controlled (private, per-dev). Project-level is team-shared. Get this wrong and teammates diverge silently.",
    productionExamples: ["60-person team with shared .claude/ rules", "Personal tool preferences in ~/.claude/", "Directory-scoped rules for legacy code"],
    relatedConcepts: ["d3-path-rules", "d3-commands-skills", "d1-workflow-enforce"],
    resources: [
      { label: "CLAUDE.md Reference", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Committing ~/.claude/ config to git", "Relying on user-level for team standards", "Monolithic CLAUDE.md when modular @imports would be cleaner"],
    examSignals: ["CLAUDE.md hierarchy", "version control", "team-shared rules", "merging behavior"],
  },
  {
    id: "d3-commands-skills", name: "Commands & Skills", domain: "D3", task: "3.2",
    whyItMatters: ".claude/commands/ holds reusable slash commands; .claude/skills/ holds skills with SKILL.md frontmatter. `context: fork` isolates verbose skill output so it doesn't pollute the parent conversation. Project-level vs user-level matters for team sharing.",
    productionExamples: ["Custom /commit slash command", "A /review-pr skill forked to avoid context bloat", "Personal ~/.claude/commands/ for solo workflows"],
    relatedConcepts: ["d3-claude-md", "d3-cli-cicd", "d1-subagent-mgmt"],
    resources: [
      { label: "Skills & Commands Docs", url: "https://code.claude.com/docs", type: "docs" },
      { label: "Extensions Explained (Medium)", url: "https://muneebsa.medium.com/claude-code-extensions-explained-skills-mcp-hooks-subagents-agent-teams-plugins-9294907e84ff", type: "blog" },
    ],
    failureModes: ["Verbose skill without context: fork → parent conversation drowns", "Personal commands committed to project repo", "Missing allowed-tools frontmatter → permission errors"],
    examSignals: ["context: fork", "allowed-tools", "argument-hint", "SKILL.md"],
  },
  {
    id: "d3-path-rules", name: "Path-Specific Rules", domain: "D3", task: "3.3",
    whyItMatters: ".claude/rules/ files with YAML frontmatter glob patterns conditionally load rules based on which file is being touched. Cross-directory conventions (e.g., all **/*.test.tsx) work here better than scattered directory-level CLAUDE.md files.",
    productionExamples: ["Test-file conventions across entire repo", "API-layer rules for src/api/**/*", "Security rules only for auth code"],
    relatedConcepts: ["d3-claude-md", "d3-commands-skills", "d1-workflow-enforce"],
    resources: [
      { label: "Path-Specific Rules Docs", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Monolithic CLAUDE.md with rules for every path → noise", "Globs too broad → rules fire in wrong contexts", "Directory CLAUDE.md duplicates path-rule content"],
    examSignals: ["glob patterns", "path-scoped", "cross-directory conventions", "conditional loading"],
  },
  {
    id: "d3-plan-vs-direct", name: "Plan vs Direct Execution", domain: "D3", task: "3.4",
    whyItMatters: "Plan mode is for architecture and multi-file changes where you need alignment before coding. Direct mode is for well-scoped single-file fixes. The Explore subagent isolates verbose discovery from the main conversation.",
    productionExamples: ["Architecture refactor → plan mode", "Typo fix → direct", "Research task → Explore subagent, then plan"],
    relatedConcepts: ["d1-task-decomp", "d3-iterative-refinement", "d1-subagent-mgmt"],
    resources: [
      { label: "Planning Mode Docs", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Plan mode for trivial fixes → overhead", "Direct mode for architectural changes → half-done work", "Skipping Explore → verbose output pollutes plan context"],
    examSignals: ["plan mode", "direct execution", "architectural", "single-file change", "Explore subagent"],
  },
  {
    id: "d3-iterative-refinement", name: "Iterative Refinement", domain: "D3", task: "3.5",
    whyItMatters: "Concrete input/output examples beat prose descriptions. Test-driven iteration (write tests first, share failures) makes ambiguity visible. Interview pattern (agent asks clarifying questions before implementing) avoids wrong assumptions. Independent issues → sequential messages; interacting issues → one combined message.",
    productionExamples: ["TDD loops with agents writing to pass your tests", "Interview pattern for underspecified tickets", "Concrete JSON examples over prose schema descriptions"],
    relatedConcepts: ["d4-explicit-criteria", "d4-few-shot", "d3-plan-vs-direct"],
    resources: [
      { label: "Best Practices Docs", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Prose descriptions when examples would clarify", "Skipping interview → wrong assumptions baked in", "Batched independent issues → tangled fixes"],
    examSignals: ["input/output examples", "test-driven", "interview pattern", "sequential vs single message"],
  },
  {
    id: "d3-cli-cicd", name: "CLI for CI/CD", domain: "D3", task: "3.6",
    whyItMatters: "`-p` / `--print` runs the CLI non-interactively. `--output-format json` + `--json-schema` makes output machine-parseable. CLAUDE.md still applies. Session isolation matters: separate instance for generation vs review prevents self-confirmation bias.",
    productionExamples: ["PR review bot", "Release notes generator", "Automated test-failure triage"],
    relatedConcepts: ["d4-multi-pass-review", "d4-structured-output", "d3-claude-md"],
    resources: [
      { label: "CLI Reference Docs", url: "https://code.claude.com/docs", type: "docs" },
      { label: "Deployment Patterns (AWS Blog)", url: "https://aws.amazon.com/blogs/machine-learning/claude-code-deployment-patterns-and-best-practices-with-amazon-bedrock/", type: "blog" },
    ],
    failureModes: ["Same session for generate + review → biased review", "No --output-format json → unparseable output in CI", "Forgetting CLAUDE.md still loads in -p mode"],
    examSignals: ["-p", "--print", "non-interactive", "--output-format json", "CI/CD integration"],
  },
  // ═══════════════════════════════════════════════════════════
  // D4 — Prompt Engineering & Structured Output (6 concepts, 20% weight)
  // ═══════════════════════════════════════════════════════════
  {
    id: "d4-explicit-criteria", name: "Explicit Criteria", domain: "D4", task: "4.1",
    whyItMatters: "Specific categorical criteria ('flag only when claimed behavior directly contradicts actual behavior') beats vague ones ('be conservative'). False positives destroy developer trust — a 5% FP rate in code review means 100 spurious warnings/week nobody reads.",
    productionExamples: ["Static analysis rules", "Content moderation thresholds", "Code review linters"],
    relatedConcepts: ["d4-few-shot", "d4-schema-design", "d5-confidence-review"],
    resources: [
      { label: "Prompt Engineering Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Vague 'be careful' instructions → inconsistent output", "High FP rate destroys trust even at high recall", "Disabling whole categories instead of tightening criteria"],
    examSignals: ["improve precision", "reduce false positives", "developer trust", "vague instructions"],
  },
  {
    id: "d4-few-shot", name: "Few-Shot Prompting", domain: "D4", task: "4.2",
    whyItMatters: "2-4 examples targeting AMBIGUOUS scenarios teach generalization. Show WHY one action beats alternatives — demonstrate reasoning, not just format. This is how you handle edge cases you can't pre-enumerate.",
    productionExamples: ["Classification with unusual edge cases", "Format demonstrations for custom output", "Reasoning patterns for judgment calls"],
    relatedConcepts: ["d4-explicit-criteria", "d4-schema-design", "d3-iterative-refinement"],
    resources: [
      { label: "Few-Shot Prompting Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Examples only showing easy cases → fails on hard ones", "Examples showing output without reasoning → no generalization", "Too many examples (20+) → context bloat + overfitting"],
    examSignals: ["ambiguous cases", "show reasoning", "demonstrate format", "generalize to novel patterns"],
  },
  {
    id: "d4-structured-output", name: "Structured Output", domain: "D4", task: "4.3",
    whyItMatters: "`tool_use` + JSON schema guarantees schema compliance (eliminates SYNTAX errors). Semantic errors persist — the field will be present but the value may be wrong. Nullable/optional fields prevent fabrication when source data is absent.",
    productionExamples: ["Document extraction to structured DBs", "API-response normalization", "Invoice field extraction"],
    relatedConcepts: ["d4-schema-design", "d2-tool-distribution", "d4-batch-validation"],
    resources: [
      { label: "Tool Use & Structured Outputs Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Required fields on optional data → fabricated values", "Trusting schema compliance for semantic correctness", "tool_choice='auto' when you need 'any' or 'forced'"],
    examSignals: ["JSON schema", "tool_use", "guaranteed compliance", "semantic errors persist"],
  },
  {
    id: "d4-schema-design", name: "Schema Design", domain: "D4", task: "4.4",
    whyItMatters: "Required vs optional fields matter: required fields on absent data force fabrication. Enum + 'other' + detail string keeps categories extensible. Pydantic (or similar) adds semantic validation the JSON schema can't.",
    productionExamples: ["Extensible categorization (enum + other + free text)", "Nullable fields for optional source data", "Pydantic models for cross-field validation"],
    relatedConcepts: ["d4-structured-output", "d4-batch-validation", "d5-error-propagation"],
    resources: [
      { label: "Pydantic Docs", url: "https://docs.pydantic.dev", type: "docs" },
    ],
    failureModes: ["Locked enums → categorization fails on novel cases", "All-required schemas → hallucination on absent data", "Schema without semantic validation → invalid data accepted"],
    examSignals: ["nullable fields", "enum + other", "required vs optional", "semantic validation"],
  },
  {
    id: "d4-batch-validation", name: "Batch & Validation", domain: "D4", task: "4.5",
    whyItMatters: "Message Batches API: 50% cost savings, up to 24-hour window, no latency SLA. Perfect for overnight reports, WRONG for pre-merge checks where devs wait. `custom_id` correlates requests to responses. Validation-retry loops need the document + failed extraction + specific error — not just 'try again'.",
    productionExamples: ["Overnight batch classification of tickets", "Pre-merge blocking checks (sync, not batch)", "Validation-retry on failed extractions"],
    relatedConcepts: ["d4-structured-output", "d4-schema-design", "d2-structured-errors"],
    resources: [
      { label: "Message Batches API Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Batch for blocking checks → devs wait 24hr", "Generic 'try again' retry → same failure", "Missing custom_id → can't correlate"],
    examSignals: ["cost savings", "pre-merge", "overnight", "batch processing", "validation-retry"],
  },
  {
    id: "d4-multi-pass-review", name: "Multi-Pass Review", domain: "D4", task: "4.6",
    whyItMatters: "The generator retains its reasoning context — it's biased toward its own work. An independent review instance (without that context) catches what the generator missed. Per-file passes catch local issues; a cross-file pass catches integration bugs.",
    productionExamples: ["Code review with a separate instance", "Per-file linting + cross-file consistency", "Confidence-based routing to human review"],
    relatedConcepts: ["d1-task-decomp", "d3-cli-cicd", "d5-confidence-review"],
    resources: [
      { label: "Self-Review Limitations Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Self-review in same session → confirms own reasoning", "Per-file only → integration bugs slip through", "No confidence routing → low-confidence outputs auto-accepted"],
    examSignals: ["review quality", "same session", "independent instance", "per-file + cross-file", "confidence routing"],
  },
  // ═══════════════════════════════════════════════════════════
  // D5 — Context & Reliability (6 concepts, 15% weight)
  // ═══════════════════════════════════════════════════════════
  {
    id: "d5-context-mgmt", name: "Context Management", domain: "D5", task: "5.1",
    whyItMatters: "Progressive summarization drops facts. Key facts (amounts, dates, IDs) belong in a case-facts block EXCLUDED from summarization. Trim verbose tool outputs BEFORE accumulation. Lost-in-the-middle: put findings at START and END of long inputs — the middle gets underweighted.",
    productionExamples: ["Support tickets with preserved case facts", "Long debugging sessions with distilled findings", "Multi-issue conversations with structured layers"],
    relatedConcepts: ["d5-codebase-exploration", "d5-provenance", "d1-session-state"],
    resources: [
      { label: "Long Context Handling Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Progressive summarization → refund amounts go vague", "Accumulating verbose tool output → token bloat", "Key findings buried in middle → ignored"],
    examSignals: ["case facts block", "lost-in-the-middle", "progressive summarization", "trim before accumulate"],
  },
  {
    id: "d5-escalation", name: "Escalation Patterns", domain: "D5", task: "5.2",
    whyItMatters: "Honor explicit human requests immediately. Escalate on policy gaps and when stuck. Do NOT escalate on sentiment (angry customer ≠ needs human) — that's an anti-pattern. On ambiguous matches, ask for the identifier; don't heuristic-guess.",
    productionExamples: ["Support agents with clear escalation triggers", "Claims systems escalating on policy gaps", "Identity systems asking for specific IDs on collision"],
    relatedConcepts: ["d5-error-propagation", "d2-structured-errors", "d4-explicit-criteria"],
    resources: [
      { label: "Escalation Patterns Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Sentiment-based escalation → unreliable", "Heuristic-matching on ambiguous identifiers → wrong records", "Not honoring explicit human requests immediately"],
    examSignals: ["escalation triggers", "customer demands human", "policy gaps", "sentiment-based anti-pattern"],
  },
  {
    id: "d5-error-propagation", name: "Error Propagation", domain: "D5", task: "5.3",
    whyItMatters: "Structured errors (failure_type + attempted_query + partial_results + alternatives) let coordinators decide. Generic errors hide everything. Recover transients locally; propagate unresolvables with coverage annotations — 'this finding was well-supported, this one came from unavailable sources'.",
    productionExamples: ["Research pipelines with coverage annotations", "Local retry + propagated-failure patterns", "Contested-findings sections in reports"],
    relatedConcepts: ["d2-structured-errors", "d5-provenance", "d1-agentic-loop"],
    resources: [
      { label: "Error Handling Patterns Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Generic 'failed' error → coordinator blind", "Propagating recoverable errors → unnecessary escalation", "No coverage annotations → findings indistinguishable from gaps"],
    examSignals: ["structured errors", "access failure vs empty", "local recovery", "coverage annotations"],
  },
  {
    id: "d5-codebase-exploration", name: "Codebase Exploration Context", domain: "D5", task: "5.4",
    whyItMatters: "Long exploration sessions degrade: answers start referencing 'typical patterns' instead of actual findings. Scratchpad files persist key findings across context boundaries. `/compact` reduces context mid-session. State manifests enable crash recovery.",
    productionExamples: ["Large codebase audits with scratchpads", "Long investigations using /compact", "Crash-recovery manifests for agent state"],
    relatedConcepts: ["d5-context-mgmt", "d1-session-state", "d2-builtin-tools"],
    resources: [
      { label: "Managing Context Docs", url: "https://code.claude.com/docs", type: "docs" },
    ],
    failureModes: ["No scratchpad → findings evaporate after /compact", "Inconsistent answers in extended sessions", "No crash recovery → restart from scratch"],
    examSignals: ["inconsistent answers", "typical patterns", "context degradation", "extended session", "scratchpad"],
  },
  {
    id: "d5-confidence-review", name: "Confidence & Review", domain: "D5", task: "5.5",
    whyItMatters: "Aggregate 97% accuracy can hide terrible performance on specific doc types. Stratified sampling by doc type measures true error rate. Field-level confidence needs calibration against labeled validation — not self-reported scores alone.",
    productionExamples: ["Stratified random sampling of extractions", "Per-doc-type accuracy dashboards", "Human review routing by confidence threshold"],
    relatedConcepts: ["d4-multi-pass-review", "d5-provenance", "d4-explicit-criteria"],
    resources: [
      { label: "Evaluating Outputs Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Aggregate accuracy hides per-type failures", "Trusting self-reported confidence without calibration", "No stratified sampling → systemic errors invisible"],
    examSignals: ["aggregate accuracy", "stratified sampling", "field-level confidence", "calibration"],
  },
  {
    id: "d5-provenance", name: "Provenance", domain: "D5", task: "5.6",
    whyItMatters: "Claim-source mappings must be preserved through synthesis. Temporal data needs publication/collection dates. Conflicts need source attribution — don't arbitrarily pick one. Structured reports separate well-supported from contested findings explicitly.",
    productionExamples: ["Research reports with citation tracking", "Temporal-sensitive analysis with dates", "Contested-findings sections for disputed claims"],
    relatedConcepts: ["d5-error-propagation", "d5-confidence-review", "d1-subagent-mgmt"],
    resources: [
      { label: "Provenance & Citations Docs", url: "https://platform.claude.com/docs", type: "docs" },
    ],
    failureModes: ["Synthesis drops source attribution → unverifiable claims", "Arbitrary conflict resolution → silent bias", "No temporal data → stale findings presented as current"],
    examSignals: ["claim-source mappings", "temporal data", "conflict annotation", "contested findings"],
  },
];

/* ─── DECISION RULES ─── */
const RULES = [
  {
    num: 1,
    rule: "Programmatic > Prompt",
    detail: "When compliance MUST be guaranteed (financial ops, identity verification, policy rules), hooks and prerequisites beat prompt instructions. Always. The exam loves this distractor.",
    signal: "Look for: 'reliability issue', 'occasionally', 'non-zero failure rate'",
  },
  {
    num: 2,
    rule: "Explicit > Vague",
    detail: "Specific categorical criteria ('flag only when claimed behavior contradicts actual behavior') beats vague ('be conservative', 'only high-confidence'). Tested heavily in prompt engineering questions.",
    signal: "Look for: 'improve precision', 'reduce false positives', 'developer trust'",
  },
  {
    num: 3,
    rule: "Structured > Generic Errors",
    detail: "errorCategory + isRetryable + description beats generic 'unavailable' status. Structured context enables intelligent recovery; generic hides information from the coordinator.",
    signal: "Look for: 'error handling', 'recovery', 'coordinator decisions'",
  },
  {
    num: 4,
    rule: "Tools = Actions, Resources = Catalogs",
    detail: "MCP tools perform actions (create, update, query). MCP resources expose content catalogs (docs, schemas, issue lists). Resources reduce exploratory tool calls because agents can browse what's available.",
    signal: "Look for: 'reduce tool calls', 'give visibility', 'content catalog'",
  },
  {
    num: 5,
    rule: "No Context Inheritance",
    detail: "Subagents don't automatically inherit parent context. You must explicitly pass complete findings in the subagent's prompt. This is the number one multi-agent gotcha on the exam.",
    signal: "Look for: 'subagent', 'context passing', 'synthesis agent lacks info'",
  },
  {
    num: 6,
    rule: "Nullable Prevents Hallucination",
    detail: "Make schema fields optional/nullable when the source may not contain the info. Required fields on absent data forces fabrication to satisfy the schema.",
    signal: "Look for: 'fabricated values', 'hallucination', 'missing information'",
  },
  {
    num: 7,
    rule: "Position Matters",
    detail: "Lost-in-the-middle: models process info best at the start and end of long inputs. Put key findings summaries at the beginning, detailed results with headers throughout, critical data at the end.",
    signal: "Look for: 'long documents', 'omitting findings', 'attention quality'",
  },
  {
    num: 8,
    rule: "Scoped Tools > Overloaded Agents",
    detail: "Giving an agent 18 tools instead of 4-5 degrades tool selection reliability. Agents with tools outside their specialization tend to misuse them. Scope to role; add cross-role tools only for high-frequency needs.",
    signal: "Look for: 'tool selection unreliable', 'wrong tool called', 'too many tools'",
  },
  {
    num: 9,
    rule: "Independent Review > Self-Review",
    detail: "The generator retains reasoning context, making it less likely to question its own decisions. A separate instance (without prior reasoning) catches issues the generator misses.",
    signal: "Look for: 'review quality', 'same session', 'missed issues', 'inconsistent feedback'",
  },
  {
    num: 10,
    rule: "Scratchpad for Long Sessions",
    detail: "In extended exploration sessions, models start giving inconsistent answers and referencing 'typical patterns' instead of specific findings. Persist key findings to scratchpad files; use /compact to manage context.",
    signal: "Look for: 'inconsistent answers', 'typical patterns', 'context degradation', 'extended session'",
  },
  {
    num: 11,
    rule: "Batch for Overnight, Sync for Blocking",
    detail: "Message Batches API: 50% cost savings, up to 24-hour window, no latency SLA. Perfect for overnight reports. Never use for pre-merge blocking checks where developers wait for results.",
    signal: "Look for: 'cost savings', 'pre-merge', 'overnight', 'batch processing'",
  },
];

/* ─── PROJECTS ─── */
const PROJECTS = [
  {
    name: "Customer Support Agent",
    scenario: "Scenarios 1 & 4",
    domains: "D1 + D2 + D5",
    desc: "Full agentic loop with hooks, escalation, programmatic prerequisites, and structured error handling",
    skills: ["Agentic loop with stop_reason", "PostToolUse hooks for normalization", "Tool call interception for policy", "Programmatic prerequisite gates", "Structured handoff summaries"],
  },
  {
    name: "Multi-Agent Research Pipeline",
    scenario: "Scenario 3",
    domains: "D1 + D2 + D5",
    desc: "Coordinator + subagents with parallel execution, context passing, error propagation, and provenance tracking",
    skills: ["Task tool + allowedTools", "Explicit context passing", "Parallel subagent execution", "Structured error propagation", "Source attribution + conflict annotation"],
  },
  {
    name: "Document Extraction Pipeline",
    scenario: "Scenario 6",
    domains: "D4 + D5",
    desc: "JSON schema extraction with validation-retry, batch processing, and confidence-based human review routing",
    skills: ["tool_use with JSON schemas", "Validation-retry loops", "Message Batches API", "Field-level confidence routing", "Nullable fields prevent hallucination"],
  },
  {
    name: "CI/CD Code Review Pipeline",
    scenario: "Scenario 5",
    domains: "D3 + D4",
    desc: "Non-interactive CI mode with structured output, explicit review criteria, and multi-pass architecture",
    skills: ["-p flag non-interactive mode", "--output-format json", "Explicit review criteria", "Multi-pass: per-file + cross-file", "False positive category management"],
  },
  {
    name: "Team Workflow",
    scenario: "Scenario 2",
    domains: "D3 + D5",
    desc: "Configure CLAUDE.md hierarchy, path-scoped rules, custom skills with context: fork, MCP server integration, and iterative refinement patterns",
    skills: ["CLAUDE.md hierarchy + @import", "Path-specific .claude/rules/ with globs", "Skills with context: fork + allowed-tools", "Plan mode vs direct execution selection", "Interview pattern + test-driven iteration"],
  },
];

/* ─── CHEAT SHEET ─── */
const CHEAT_SHEET = [
  {
    category: "Architecture Decisions",
    items: [
      { rule: "Compliance MUST be guaranteed → programmatic hooks/prerequisites, never prompt-only", detail: "Prompt-based instructions have a non-zero failure rate. For financial ops, identity checks, or policy enforcement, a hook that runs deterministic code is the only reliable path.", example: "KYC verification: a PreToolUse hook checks the ID API before create_account can execute." },
      { rule: "Style/tone/formatting → prompt instructions are sufficient", detail: "When the stakes are low (formatting, tone), prompt guidance works fine. Save hooks for compliance-critical flows.", example: "Asking for bullet-point output or a friendly tone — no hook needed." },
      { rule: "Complex multi-file changes → plan mode; single-file fix → direct execution", detail: "Plan mode prevents half-done refactors by getting alignment before writing code. Direct mode is faster for scoped changes.", example: "Renaming a variable across 20 files: plan. Fixing a typo in one file: direct." },
      { rule: "Verbose discovery → Explore subagent to isolate context", detail: "Exploration output (searching files, reading code) fills context fast. The Explore subagent runs in isolation so verbose results don't pollute the main conversation.", example: "Understanding a new codebase before planning a refactor — Explore first, then plan." },
      { rule: "Single agent hitting limits → decompose into coordinator + scoped subagents", detail: "One agent with 18 tools and a sprawling task will pick the wrong tool and lose track of context. A coordinator delegating to 3-4 focused subagents scales better.", example: "Research task: coordinator spawns legal-subagent, finance-subagent, ops-subagent in parallel." },
      { rule: "Fixed known steps → prompt chaining; open-ended investigation → adaptive decomposition", detail: "Prompt chains are deterministic pipelines for predictable flows. Adaptive decomposition maps the problem first, then decides what to investigate.", example: "ETL: fixed chain (extract → transform → load). Security audit: adaptive (scan → identify → prioritize)." },
    ],
  },
  {
    category: "Tool Design Decisions",
    items: [
      { rule: "Generic tool causing confusion → split into purpose-specific tools", detail: "Tools are selected by description, not name. If two tools sound similar, the wrong one gets called. Splitting a generic tool into purpose-specific ones with clear boundaries fixes this.", example: "One 'process_payment' tool → split into 'refund_payment', 'charge_payment', 'adjust_payment' with distinct descriptions." },
      { rule: "Similar tools misrouted → rename + expand descriptions with boundaries", detail: "When renaming isn't enough, add explicit boundaries: 'Use this tool ONLY for X. Do NOT use for Y.' in the description.", example: "'billing_lookup' description: 'Look up invoice status. Do NOT use for payment processing — use process_payment instead.'" },
      { rule: "Agent has 18 tools → scope to 4-5 per role", detail: "Selection reliability degrades sharply above 5 tools. Give each agent only the tools for its role. Add cross-role tools only for genuinely high-frequency needs.", example: "Support agent: lookup_customer, search_knowledge_base, create_ticket, escalate. Not 18 tools." },
      { rule: "MCP tools = actions; MCP resources = content catalogs", detail: "Tools perform operations (create, update, query). Resources expose browsable content (doc listings, schemas, issue catalogs) — they reduce unnecessary tool calls by letting the agent see what's available.", example: "Tool: create_jira_issue. Resource: list of all Jira projects and their schemas." },
      { rule: "Project-shared tooling → .mcp.json; personal → ~/.claude.json", detail: "Team tools go in .mcp.json (version-controlled, everyone gets them). Personal tokens and experimental tools go in ~/.claude.json (private, per-developer).", example: "Shared database MCP in .mcp.json. Your personal Notion integration in ~/.claude.json." },
      { rule: "Guaranteed first tool call → forced; any tool → 'any'; flexible → 'auto'", detail: "tool_choice modes control sequencing. 'Forced' makes a specific tool run first (verify before act). 'Any' requires at least one tool call. 'Auto' lets the agent decide.", example: "Forced verify_identity before process_refund ensures identity is always checked." },
    ],
  },
  {
    category: "Context Management",
    items: [
      { rule: "Losing facts in long conversations → persistent case facts block", detail: "Progressive summarization drops specifics. Key facts (amounts, dates, IDs, policy numbers) should be extracted into a structured block that's excluded from summarization.", example: "Support ticket with $2,340.56 refund amount — if summarized, it becomes 'a refund' with no amount." },
      { rule: "Tool returns 40 fields → trim to 5 relevant BEFORE accumulation", detail: "Verbose tool output fills the context window fast. Trim to only the fields you need before adding to the conversation. Accumulating raw output is the #1 context-budget killer.", example: "API returns full customer profile — trim to name, email, account status before passing to the next step." },
      { rule: "Key findings missed → put summaries at START; critical data at END", detail: "The lost-in-the-middle effect: content in the middle of long inputs gets underweighted. Structure important information at the beginning and end.", example: "Report structure: executive summary first, detailed findings in the body, critical recommendations last." },
      { rule: "Subagent output → structured data, NOT verbose reasoning", detail: "Subagents should return facts, citations, and scores — not their entire chain of thought. The coordinator needs data to synthesize, not reasoning to re-read.", example: "Research subagent returns { findings: [...], sources: [...], confidence: 0.85 } not a 500-word narrative." },
      { rule: "Extended session degrading → scratchpad files + /compact", detail: "When answers start referencing 'typical patterns' instead of actual findings, the context is saturated. Persist key findings to a scratchpad file and use /compact to reclaim space.", example: "After 2 hours of codebase exploration, save key findings to SCRATCHPAD.md, run /compact, continue." },
      { rule: "Resuming session → fresh + summary if stale; --resume if still valid", detail: "Stale sessions (tool results changed since last run) need a fresh start with a summary of prior findings. Recent sessions where context is still accurate benefit from --resume.", example: "Left a session overnight after code was merged → fresh + summary. Paused for lunch → --resume." },
    ],
  },
  {
    category: "Error & Escalation",
    items: [
      { rule: "Customer demands human → honor immediately", detail: "No investigation, no 'let me try one more thing.' When someone explicitly asks for a human, route them immediately. Anything else violates trust.", example: "Customer: 'I want to speak to a person.' Agent: routes to human queue instantly, no further questions." },
      { rule: "Policy gap/exception → escalate", detail: "If the situation falls outside the agent's designed capabilities or policy boundaries, escalate. Agents should not improvise on edge cases.", example: "Refund amount exceeds policy limit → escalate to supervisor, don't process anyway." },
      { rule: "Sentiment-based escalation → anti-pattern", detail: "Angry doesn't mean complex. Calm doesn't mean simple. Sentiment analysis is unreliable for routing decisions. Use explicit triggers (human request, policy gap, stuck) instead.", example: "Frustrated customer with a simple billing question → resolve, don't escalate. Calm customer with a regulatory exception → escalate." },
      { rule: "Multiple customer matches → ask for identifiers, never guess", detail: "When a name matches 3 accounts, ask for the account number or email. Never pick the 'most likely' one — heuristic selection causes wrong-account actions.", example: "'John Smith' matches 3 accounts. Ask: 'Can you share your account number or the email on file?'" },
      { rule: "Subagent error → return structured context for recovery", detail: "Return { failure_type, attempted_query, partial_results, alternatives } so the coordinator can decide: retry, fall back, or escalate. Generic 'failed' errors leave the coordinator blind.", example: "Database timeout → { failure_type: 'transient', attempted_query: 'SELECT ...', partial_results: null, alternatives: ['retry', 'cache'] }" },
      { rule: "Access failure ≠ empty result — must distinguish", detail: "If the database is down, that's an access failure (retry or escalate). If the query returned zero rows, that's a valid empty result (report it). Treating both as 'no results' hides infrastructure failures.", example: "Compliance check: DB timeout reported as 'no violations found' → $2.3M regulatory penalty." },
      { rule: "Transient failure → local retry; unresolvable → propagate", detail: "Transient errors (timeouts, rate limits) should be retried locally in the subagent. Only propagate to the coordinator if the error persists after retries.", example: "API rate limit → wait 2 seconds, retry. API key revoked → propagate immediately." },
    ],
  },
  {
    category: "Output & Review",
    items: [
      { rule: "tool_use + JSON schema → guaranteed schema compliance", detail: "Using tool_use with a JSON schema eliminates syntax/structural errors in the output. But it doesn't fix semantic errors — the fields will be present, but the values may still be wrong.", example: "Schema requires a 'date' field → it'll always be there. But it might contain the wrong date." },
      { rule: "Source may lack info → make fields nullable/optional", detail: "Required fields on absent data force fabrication. If the source document might not have a phone number, make the phone field nullable. Otherwise the output will contain an invented number.", example: "Invoice extraction: not all invoices have a PO number. Make po_number optional, not required." },
      { rule: "enum categories → add 'other' + detail string", detail: "Locked enums fail on novel cases. Adding an 'other' option with a free-text detail field keeps categorization extensible without losing structure.", example: "Issue type: ['bug', 'feature', 'improvement', 'other'] + detail_if_other: 'infrastructure migration'" },
      { rule: "Self-review in same session → biased; use independent instance", detail: "The generator retains its reasoning context and is unlikely to question its own decisions. A fresh instance without that context catches issues the generator missed.", example: "Code generation in session A → code review in session B (separate instance, no shared context)." },
      { rule: "Large PR → per-file passes + cross-file integration pass", detail: "Per-file reviews catch local issues (logic bugs, style). A separate cross-file pass catches integration bugs (broken imports, inconsistent naming, missing error handling across boundaries).", example: "14-file PR: review each file individually, then run a second pass looking at how they interact." },
      { rule: "Few-shot: 2-4 examples targeting ambiguous cases", detail: "Show WHY one choice beats alternatives, not just the output format. Examples should target the edge cases that are genuinely ambiguous, not the easy cases.", example: "Classification task: include an example where the category is non-obvious and explain the reasoning." },
      { rule: "Vague criteria → replace with specific categorical criteria", detail: "Instructions like 'be conservative' or 'only flag high-confidence issues' are subjective and produce inconsistent results. Specific criteria like 'flag when described behavior directly contradicts actual code behavior' are testable.", example: "'Be careful about false positives' → 'Flag only when the documented behavior directly contradicts the tested behavior.'" },
    ],
  },
  {
    category: "Config & CI/CD",
    items: [
      { rule: "Team commands → .claude/commands/ (versioned); personal → ~/.claude/commands/", detail: "Project-level commands are shared with the team via version control. Personal workflow commands (your own shortcuts) go in the user-level directory.", example: "Team /review-pr command in .claude/commands/. Your personal /quick-deploy in ~/.claude/commands/." },
      { rule: "Cross-directory convention → .claude/rules/ with glob patterns", detail: "Rules that apply across directories (e.g., all test files) work better as glob-patterned rules than scattered directory-level CLAUDE.md files. One rule file covers the whole pattern.", example: "Test conventions for **/*.test.tsx → one rule in .claude/rules/testing.md, not 15 directory CLAUDE.md files." },
      { rule: "Verbose skill output → context: fork to isolate", detail: "Skills that produce a lot of output (code generation, analysis) should run with context: fork so they don't pollute the parent conversation's context window.", example: "A /review-pr skill that reads 20 files and produces detailed feedback — fork it so the main conversation stays clean." },
      { rule: "CI pipeline → -p flag (non-interactive); --output-format json", detail: "The -p/--print flag runs non-interactively (no user prompts). Combined with --output-format json and --json-schema, the output is machine-parseable for CI integration.", example: "GitHub Action: claude -p 'review this PR' --output-format json | jq '.issues'" },
      { rule: "CI review → separate instance from generator", detail: "If the same agent generated the code AND reviews it, the review is biased. Use a separate instance for the review step so it evaluates the code without the reasoning context that produced it.", example: "Step 1: generate code (instance A). Step 2: review code (instance B, fresh context)." },
      { rule: "Batch → overnight reports (50% cost); sync → pre-merge blocking", detail: "The Message Batches API saves 50% but has up to 24-hour latency. Use it for overnight batch jobs (report generation, classification). Never use it for blocking checks where developers are waiting.", example: "Overnight ticket classification: batch. Pre-merge code review: sync (developers are waiting)." },
      { rule: "Re-running review → include prior findings; report only new issues", detail: "When a review runs again after commits, include the previous review's findings so the agent knows what was already flagged. Only report new or unaddressed issues.", example: "Second review pass: 'Previous review flagged X and Y. X was fixed. Y is still present. New issue: Z.'" },
    ],
  },
];

/* ─── Domain Colors ─── */
const domainColors = {
  "D1": "#c0392b",
  "D2": "#d35400",
  "D3": "#27ae60",
  "D4": "#2980b9",
  "D5": "#8e44ad",
  "D1+D2": "#c0392b",
  "D1+D5": "#c0392b",
  "D3+D4": "#27ae60",
  "D3+D5": "#27ae60",
  "D4+D5": "#2980b9",
  "ALL": "#95a5a6",
  "WEAK": "#f39c12",
  "—": "#555",
};

/* ─── Progress Helpers ─── */
function countItems(type) {
  if (type === "tasks") {
    let total = 0;
    WEEKS.forEach(w => w.days.forEach(d => { total += d.tasks.length; }));
    return total;
  }
  if (type === "concepts") {
    let total = 0;
    CONCEPT_TREE.forEach(d => d.concepts.forEach(c => { total += c.children.length; }));
    return total;
  }
  return 0;
}

function countCompleted(progress, prefix) {
  return Object.keys(progress).filter(k => k.startsWith(prefix) && progress[k]).length;
}

/* ─── APP ─── */
export default function App() {
  const [tab, setTab] = useState("plan");
  const [openWeek, setOpenWeek] = useState(1);
  const [openDomain, setOpenDomain] = useState(0);
  const [openDay, setOpenDay] = useState(null);
  const [progress, setProgress] = useState(loadLocalProgress);
  const [theme, setTheme] = useState(loadTheme);
  const [userEmail, setUserEmail] = useState(loadEmail);
  const [emailInput, setEmailInput] = useState("");
  const [showLogin, setShowLogin] = useState(!loadEmail());

  useEffect(() => { saveTheme(theme); }, [theme]);
  const cycleTheme = () => setTheme(t => t === "grey" ? "light" : "grey");

  // Load progress from Firestore on login
  useEffect(() => {
    if (!userEmail) return;
    loadUserProgress(userEmail).then(data => {
      if (data && data.studyProgress) {
        setProgress(prev => ({ ...prev, ...data.studyProgress }));
        saveLocalProgress({ ...loadLocalProgress(), ...data.studyProgress });
      }
    });
  }, [userEmail]);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return;
    saveEmail(email);
    setUserEmail(email);
    setShowLogin(false);
    // Record first visit
    saveUserProgress(email, { firstSeen: new Date().toISOString() });
  };

  const handleLogout = () => {
    localStorage.removeItem(EMAIL_KEY);
    setUserEmail("");
    setShowLogin(true);
  };


  const toggleProgress = (key) => {
    setProgress(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveLocalProgress(next);
      if (userEmail) {
        saveUserProgress(userEmail, { studyProgress: next });
      }
      return next;
    });
  };

  const tasksDone = countCompleted(progress, "t-");
  const tasksTotal = countItems("tasks");
  const conceptsDone = countCompleted(progress, "c-");
  const conceptsTotal = countItems("concepts");

  const tabs = [
    { id: "plan", label: "Weekly Plan" },
    { id: "brain", label: "Brain Map" },
    { id: "tree", label: "Concepts" },
    { id: "builds", label: "Projects" },
    { id: "rules", label: "Decision Rules" },
    { id: "cheat", label: "Cheat Sheet" },
    { id: "quiz", label: "Quiz" },
    { id: "cli", label: "CLI Guide" },
  ];

  const s = {
    root: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "var(--bg-root)",
      color: "var(--text-body)",
      minHeight: "100vh",
      fontSize: 16,
      lineHeight: 1.7,
      padding: "0 clamp(24px, 5vw, 80px)",
      letterSpacing: -0.01 + "em",
      WebkitFontSmoothing: "antialiased",
      ...themeVars(theme),
    },
    header: {
      padding: "40px 0 24px",
      borderBottom: "1px solid var(--border)",
      position: "relative",
    },
    tag: {
      display: "inline-block",
      fontSize: 13,
      letterSpacing: 3,
      color: "#c0392b",
      textTransform: "uppercase",
      fontWeight: 700,
      marginBottom: 12,
    },
    h1: {
      fontSize: 36,
      fontWeight: 800,
      color: "var(--text-primary)",
      margin: 0,
      lineHeight: 1.15,
      letterSpacing: -0.02 + "em",
    },
    sub: {
      fontSize: 17,
      color: "var(--text-faint)",
      marginTop: 10,
      fontWeight: 400,
    },
    tabs: {
      display: "flex",
      borderBottom: "2px solid var(--border)",
      padding: "0",
      overflowX: "auto",
      gap: 0,
      marginTop: 8,
    },
    tabBtn: (active) => ({
      padding: "16px 20px",
      fontSize: 15,
      fontFamily: "inherit",
      fontWeight: active ? 700 : 500,
      background: "none",
      color: active ? "var(--text-primary)" : "var(--text-faint)",
      border: "none",
      borderBottom: active ? "3px solid #c0392b" : "3px solid transparent",
      cursor: "pointer",
      textAlign: "center",
      whiteSpace: "nowrap",
      transition: "color 0.15s",
    }),
    content: {
      padding: "32px 0 48px",
    },
    progressBar: {
      height: 6,
      background: "var(--border-soft)",
      borderRadius: 3,
      overflow: "hidden",
      marginTop: 14,
    },
    themeBtn: {
      position: "absolute",
      top: 36,
      right: 0,
      padding: "8px 16px",
      fontSize: 14,
      fontFamily: "inherit",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontWeight: 600,
      background: "var(--bg-panel)",
      color: "var(--text-soft)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      cursor: "pointer",
    },
  };

  const overallDone = tasksDone + conceptsDone;
  const overallTotal = tasksTotal + conceptsTotal;
  const pct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

  if (showLogin) {
    return (
      <div style={{ ...themeVars("grey"), background: "var(--bg-root)", color: "var(--text-body)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "40px 32px", maxWidth: 400, width: "90%" }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: "#c0392b", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>CCA-F Study Plan</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>Welcome</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 24px", lineHeight: 1.5 }}>
            Enter your email to save progress across devices.
          </p>
          <input
            type="email"
            placeholder="you@example.com"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", fontSize: 14, fontFamily: "inherit",
              background: "var(--bg-panel-alt)", color: "var(--text-primary)",
              border: "1px solid var(--border)", borderRadius: 4, outline: "none",
              marginBottom: 16, boxSizing: "border-box",
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              width: "100%", padding: "10px", fontSize: 13, fontFamily: "inherit",
              fontWeight: 600, background: "#c0392b", color: "#fff", border: "none",
              borderRadius: 4, cursor: "pointer", marginBottom: 12,
            }}
          >Start studying</button>
        </form>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={{ position: "absolute", top: 24, right: 0, display: "flex", gap: 8, alignItems: "center" }}>
          {userEmail && (
            <>
              <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{userEmail}</span>
              <button onClick={handleLogout} style={{ ...s.themeBtn, padding: "4px 8px", fontSize: 10 }}>Log out</button>
            </>
          )}
          {!userEmail && (
            <button onClick={() => setShowLogin(true)} style={{ ...s.themeBtn, padding: "4px 8px", fontSize: 10 }}>Log in</button>
          )}
          <button
            onClick={cycleTheme}
            style={s.themeBtn}
            title="Toggle theme"
            aria-label={`Current theme: ${theme}. Click to toggle.`}
          >
            {theme === "grey" ? "◑ GREY" : "◯ LIGHT"}
          </button>
        </div>
        <div style={s.tag}>CCA-F Study Plan</div>
        <h1 style={s.h1}>4 Weeks to 900+</h1>
        <p style={s.sub}>Scaled 100–1000 / 720 pass / 60 questions / 4 random scenarios</p>
        <div style={s.progressBar}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#c0392b", transition: "width 0.3s" }} />
        </div>
        <div style={{ fontSize: 14, color: "var(--text-faint)", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
          <span>Overall: {overallDone}/{overallTotal} ({pct}%)</span>
          <span>Tasks: {tasksDone}/{tasksTotal} | Concepts: {conceptsDone}/{conceptsTotal}</span>
        </div>
      </div>

      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={s.tabBtn(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <HowToUse />

      <div style={s.content}>
        {tab === "plan" && <PlanTab weeks={WEEKS} openWeek={openWeek} setOpenWeek={setOpenWeek} openDay={openDay} setOpenDay={setOpenDay} progress={progress} toggle={toggleProgress} />}
        {tab === "brain" && <BrainMapTab progress={progress} toggle={toggleProgress} />}
        {tab === "tree" && <TreeTab domains={CONCEPT_TREE} openDomain={openDomain} setOpenDomain={setOpenDomain} progress={progress} toggle={toggleProgress} />}
        {tab === "builds" && <BuildsTab projects={PROJECTS} />}
        {tab === "rules" && <RulesTab rules={RULES} />}
        {tab === "cheat" && <CheatSheetTab data={CHEAT_SHEET} />}
        {tab === "quiz" && <QuizEngine userEmail={userEmail} />}
        {tab === "cli" && <CLIGuideTab />}
      </div>

      <div style={{
        padding: "24px 0",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
          Free resources only
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>
          Skilljar &middot; CertSafari &middot; CCA Certifications &middot; ReadRoost &middot; Partner Network &middot; GitHub
        </div>
      </div>
    </div>
  );
}

/* ─── Checkbox ─── */
function Check({ checked, onToggle }) {
  return (
    <span
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        borderRadius: 3,
        border: checked ? "1px solid #c0392b" : "1px solid #2a2a38",
        background: checked ? "#c0392b22" : "transparent",
        cursor: "pointer",
        flexShrink: 0,
        fontSize: 11,
        color: checked ? "#c0392b" : "transparent",
        marginRight: 8,
        transition: "all 0.15s",
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

/* ─── HowToUse ─── */
const GUIDE_DISMISSED_KEY = "cca-guide-dismissed";
function HowToUse() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(GUIDE_DISMISSED_KEY) === "1"; } catch { return false; }
  });
  const [open, setOpen] = useState(!dismissed);

  const dismiss = () => { setOpen(false); setDismissed(true); try { localStorage.setItem(GUIDE_DISMISSED_KEY, "1"); } catch {} };

  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: open ? "24px 0" : "12px 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
          fontSize: 14, fontWeight: 600, color: "var(--text-faint)",
          display: "flex", alignItems: "center", gap: 8, padding: 0, width: "100%",
        }}
      >
        <span style={{ color: "#c0392b", fontSize: 16 }}>{open ? "▾" : "▸"}</span>
        How to get the most out of this
      </button>

      {open && (
        <div style={{ marginTop: 20, fontSize: 15, color: "var(--text-body)", lineHeight: 1.8 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 6 }}>Start with the Weekly Plan</div>
            <p style={{ margin: 0 }}>
              This whole thing is designed as a 4-week sprint. Week 1 builds your mental models. Week 2 has you building real projects. Week 3 closes your gaps. Week 4 is pure exam prep. Follow the order — it compounds.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 6 }}>Each day has a quiz — use it</div>
            <p style={{ margin: 0 }}>
              Every day in the plan has a "Start Quiz" button at the bottom. That's your daily check. If you can't pass it, you didn't learn the material yet. Go back, re-read, try again. Don't skip ahead hoping it'll click later — it won't.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 6 }}>The Brain Map shows you how everything connects</div>
            <p style={{ margin: 0 }}>
              The exam doesn't test domains in isolation. It throws scenarios that touch 3 domains at once. The Brain Map tab shows those connections. Click any concept and you'll see what it relates to, why it matters in production, and what to watch for on the exam. Use this when you need the big picture.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 6 }}>Drill your weak spots, not your strengths</div>
            <p style={{ margin: 0 }}>
              Go to the Quiz tab and hit "Weak Spots" mode. It finds the task statements where you're scoring lowest and drills those specifically. The exam doesn't care if you're 95% on your best domain — it cares if you're below 70% on any domain. Fix your weak spots first.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 6 }}>The Cheat Sheet is your exam-day weapon</div>
            <p style={{ margin: 0 }}>
              Every rule in the Cheat Sheet tab is expandable. Click it to see the full reasoning and a concrete example. Review these the morning of your exam. They're the decision shortcuts that let you eliminate wrong answers in seconds instead of deliberating for minutes.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 16, marginBottom: 6 }}>Don't just read — build</div>
            <p style={{ margin: 0 }}>
              The Projects tab has 4 production-style builds mapped to exam scenarios. Do them in Week 2. You'll recognize the patterns on the exam because you already built them. Reading about agentic loops is one thing. Watching one break in your own code is how it sticks.
            </p>
          </div>

          <button
            onClick={dismiss}
            style={{
              marginTop: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600,
              background: "var(--bg-panel)", color: "var(--text-faint)",
              border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >Got it — don't show this again</button>
        </div>
      )}
    </div>
  );
}

/* ─── InlineDayQuiz: quiz that appears right inside the day card ─── */
const DAY_QUIZ_POOL = [...d1Questions, ...d2Questions, ...d3Questions, ...d4Questions, ...d5Questions];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function InlineDayQuiz({ closure, domainColor }) {
  const [active, setActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const startQuiz = () => {
    let pool = DAY_QUIZ_POOL;
    if (closure.domain && closure.domain !== "ALL" && closure.domain !== "WEAK") {
      pool = pool.filter(q => q.domain === closure.domain);
    }
    if (closure.topic) {
      const topicPool = pool.filter(q => q.topic === closure.topic);
      if (topicPool.length > 0) pool = topicPool;
    }
    const count = Math.min(parseInt(closure.label.match(/(\d+)\s*Qs/)?.[1]) || 15, pool.length);
    setQuestions(shuffleArray(pool).slice(0, count));
    setIdx(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setDone(false);
    setActive(true);
  };

  if (!active) {
    return (
      <button onClick={startQuiz} style={{
        marginTop: 10, padding: "12px 16px", background: "#2980b90a", border: "1px solid #2980b930",
        borderRadius: 8, fontSize: 14, color: "#2980b9", lineHeight: 1.5, display: "flex",
        justifyContent: "space-between", alignItems: "center", width: "100%", cursor: "pointer",
        fontFamily: "inherit", textAlign: "left",
      }}>
        <span>{closure.label}</span>
        <span style={{ fontSize: 13, background: "#2980b9", color: "#fff", padding: "5px 14px", borderRadius: 6, fontWeight: 600 }}>Start Quiz</span>
      </button>
    );
  }

  if (done) {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const passed = pct >= (closure.target || 70);
    return (
      <div style={{ marginTop: 10, padding: "20px", background: "var(--bg-panel)", border: `1px solid ${passed ? "#27ae6044" : "#e74c3c44"}`, borderRadius: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: passed ? "#27ae60" : "#e74c3c", marginBottom: 4 }}>{pct}%</div>
        <div style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 4 }}>{score}/{questions.length} correct</div>
        <div style={{ fontSize: 13, color: passed ? "#27ae60" : "#e74c3c", fontWeight: 600, marginBottom: 16 }}>
          {passed ? "Passed — nice work" : `Below target (${closure.target}%) — review and retry`}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={startQuiz} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, background: "var(--bg-panel-alt)", color: "var(--text-body)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Retry</button>
          <button onClick={() => setActive(false)} style={{ padding: "8px 16px", fontSize: 13, background: "none", color: "var(--text-faint)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Close</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  if (!q) return null;

  const handleChoice = (letter) => {
    if (submitted) return;
    setSelected(letter);
    setSubmitted(true);
    if (letter === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const isCorrect = submitted && selected === q.correct;
  const isWrong = submitted && selected !== q.correct;

  return (
    <div style={{ marginTop: 10, padding: "16px", background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 8 }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 13, color: "var(--text-faint)" }}>
        <span>Question {idx + 1} of {questions.length}</span>
        <span>{score}/{idx + (submitted ? 1 : 0)} correct</span>
      </div>
      <div style={{ height: 4, background: "var(--border-soft)", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((idx + 1) / questions.length) * 100}%`, background: domainColor || "#2980b9", transition: "width 0.3s" }} />
      </div>

      {/* Question */}
      <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, marginBottom: 16, fontWeight: 500 }}>{q.question}</div>

      {/* Choices */}
      {["A", "B", "C", "D"].map(letter => {
        const isThis = selected === letter;
        const isRight = letter === q.correct;
        let bg = "var(--bg-panel-alt)";
        let border = "var(--border-soft)";
        let color = "var(--text-body)";
        if (submitted && isRight) { bg = "#27ae600a"; border = "#27ae60"; color = "#27ae60"; }
        else if (submitted && isThis && !isRight) { bg = "#e74c3c0a"; border = "#e74c3c"; color = "#e74c3c"; }
        else if (!submitted && isThis) { bg = "#2980b90a"; border = "#2980b9"; }
        return (
          <div key={letter} style={{ marginBottom: 6 }}>
            <button onClick={() => handleChoice(letter)} style={{
              width: "100%", padding: "12px 16px", background: bg, border: `1px solid ${border}`,
              borderRadius: 6, cursor: submitted ? "default" : "pointer", textAlign: "left",
              fontFamily: "inherit", color, fontSize: 14, lineHeight: 1.6, display: "flex", gap: 10,
            }}>
              <span style={{ fontWeight: 700, flexShrink: 0, color: submitted && isRight ? "#27ae60" : submitted && isThis ? "#e74c3c" : "#c0392b" }}>{letter})</span>
              <span>{q.choices[letter]}</span>
            </button>
            {/* Show explanation only for the selected answer */}
            {submitted && isThis && (
              <div style={{
                marginLeft: 24, marginTop: 4, marginBottom: 4, padding: "10px 14px",
                background: isRight ? "#27ae600a" : "#e74c3c0a",
                borderLeft: `3px solid ${isRight ? "#27ae60" : "#e74c3c"}`,
                borderRadius: "0 6px 6px 0", fontSize: 13, color: isRight ? "#27ae60" : "var(--text-muted)", lineHeight: 1.7,
              }}>
                {q.explanations[letter]}
              </div>
            )}
            {/* If wrong, also show the correct answer's explanation */}
            {submitted && isWrong && isRight && (
              <div style={{
                marginLeft: 24, marginTop: 4, marginBottom: 4, padding: "10px 14px",
                background: "#27ae600a", borderLeft: "3px solid #27ae60",
                borderRadius: "0 6px 6px 0", fontSize: 13, color: "#27ae60", lineHeight: 1.7,
              }}>
                {q.explanations[letter]}
              </div>
            )}
          </div>
        );
      })}

      {/* Next button */}
      {submitted && (
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleNext} style={{
            padding: "10px 24px", background: "#27ae60", color: "#fff", border: "none",
            borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
          }}>
            {idx + 1 >= questions.length ? "See Results" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── PlanTab ─── */
function PlanTab({ weeks, openWeek, setOpenWeek, openDay, setOpenDay, progress, toggle }) {
  return (
    <div>
      {/* Weight bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          Domain weights
        </div>
        <div style={{ display: "flex", gap: 2, height: 4, borderRadius: 2, overflow: "hidden" }}>
          {[
            { w: 27, c: "#c0392b" }, { w: 18, c: "#d35400" }, { w: 20, c: "#27ae60" },
            { w: 20, c: "#2980b9" }, { w: 15, c: "#8e44ad" },
          ].map((d, i) => <div key={i} style={{ width: `${d.w}%`, background: d.c }} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "var(--text-dim)" }}>
          <span>D1 27%</span><span>D2 18%</span><span>D3 20%</span><span>D4 20%</span><span>D5 15%</span>
        </div>
      </div>

      {weeks.map(week => {
        const isOpen = openWeek === week.id;
        return (
          <div key={week.id} style={{ marginBottom: 10 }}>
            <button
              onClick={() => setOpenWeek(isOpen ? null : week.id)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: isOpen ? "var(--bg-panel-alt)" : "var(--bg-panel)",
                border: isOpen ? "1px solid var(--border-med)" : "1px solid var(--border-soft)",
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "var(--text-primary)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 11, color: "#c0392b", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
                    Week {week.id}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{week.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{week.subtitle}</div>
                </div>
                <span style={{ fontSize: 15, color: "var(--text-dim)", marginTop: 2 }}>{isOpen ? "−" : "+"}</span>
              </div>
              <div style={{ fontSize: 12, color: "#c0392b55", marginTop: 6, fontStyle: "italic" }}>
                {week.theme}
              </div>
            </button>

            {isOpen && (
              <div style={{ marginTop: 6, paddingLeft: 2 }}>
                {week.days.map((day, di) => {
                  const dayKey = `${week.id}-${di}`;
                  const dayOpen = openDay === dayKey;
                  const dc = domainColors[day.domain] || "#555";
                  return (
                    <div key={di} style={{ marginBottom: 4 }}>
                      <button
                        onClick={() => setOpenDay(dayOpen ? null : dayKey)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: dayOpen ? "var(--bg-panel-alt)" : "var(--bg-panel)",
                          border: `1px solid ${dayOpen ? "var(--border-med)" : "var(--border-soft)"}`,
                          borderLeft: `3px solid ${dc}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          color: "var(--text-body)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: 12, color: dc, fontWeight: 600 }}>{day.day}</span>
                            <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>{day.domain}</span>
                          </div>
                          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{dayOpen ? "−" : "+"}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4, color: "#b0b0bc" }}>
                          {day.focus}
                        </div>
                      </button>

                      {dayOpen && (
                        <div style={{ padding: "8px 12px 8px 16px" }}>
                          {/* Tasks with checkboxes */}
                          {day.tasks.map((task, ti) => {
                            const key = `t-${week.id}-${di}-${ti}`;
                            return (
                              <div key={ti} style={{
                                fontSize: 11,
                                color: progress[key] ? "var(--text-faint)" : "var(--text-muted)",
                                padding: "5px 0 5px 0",
                                borderLeft: `1px solid ${dc}33`,
                                paddingLeft: 10,
                                marginBottom: 2,
                                lineHeight: 1.5,
                                display: "flex",
                                alignItems: "flex-start",
                                textDecoration: progress[key] ? "line-through" : "none",
                              }}>
                                <Check checked={!!progress[key]} onToggle={() => toggle(key)} />
                                <span>{task}</span>
                              </div>
                            );
                          })}

                          {/* Build deliverable */}
                          {day.build && (
                            <div style={{
                              marginTop: 8,
                              padding: "8px 10px",
                              background: `${dc}0a`,
                              border: `1px solid ${dc}22`,
                              borderRadius: 4,
                              fontSize: 11,
                              color: dc,
                              fontWeight: 500,
                            }}>
                              ▸ {day.build}
                            </div>
                          )}

                          {/* Daily KPI */}
                          {day.kpi && (
                            <div style={{
                              marginTop: 8,
                              padding: "8px 10px",
                              background: "#f39c120a",
                              border: "1px solid #f39c1218",
                              borderRadius: 4,
                              fontSize: 12,
                              color: "#f39c12",
                              lineHeight: 1.5,
                            }}>
                              <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 0.5 }}>KPI: </span>
                              {day.kpi}
                            </div>
                          )}

                          {/* Inline Daily Quiz */}
                          {day.closure && (
                            <InlineDayQuiz closure={day.closure} domainColor={dc} />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── TreeTab ─── */
function TreeTab({ domains, openDomain, setOpenDomain, progress, toggle }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        Every testable concept organized by domain. Check off leaf nodes as you master them.
      </p>
      {domains.map((d, di) => {
        const isOpen = openDomain === di;
        const domainTotal = d.concepts.reduce((sum, c) => sum + c.children.length, 0);
        const domainDone = d.concepts.reduce((sum, c, ci) =>
          sum + c.children.filter((_, ki) => progress[`c-${di}-${ci}-${ki}`]).length, 0);
        return (
          <div key={di} style={{ marginBottom: 6 }}>
            <button
              onClick={() => setOpenDomain(isOpen ? null : di)}
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "var(--bg-panel)",
                border: `1px solid ${d.accent}22`,
                borderLeft: `3px solid ${d.accent}`,
                borderRadius: 5,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "var(--text-primary)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{d.domain}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: d.accent, fontWeight: 400 }}>{d.weight}</span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{domainDone}/{domainTotal}</span>
                  <span style={{ color: "var(--text-dim)", fontSize: 14 }}>{isOpen ? "−" : "+"}</span>
                </div>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: "8px 0 4px 14px" }}>
                {d.concepts.map((c, ci) => (
                  <div key={ci} style={{ marginBottom: 10 }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: d.accent,
                      marginBottom: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: d.accent, flexShrink: 0 }} />
                      {c.name}
                    </div>
                    <div style={{ paddingLeft: 11, borderLeft: `1px solid ${d.accent}18` }}>
                      {c.children.map((ch, ki) => {
                        const key = `c-${di}-${ci}-${ki}`;
                        return (
                          <div key={ki} style={{
                            fontSize: 12,
                            color: progress[key] ? "var(--text-dim)" : "var(--text-muted)",
                            padding: "2px 0",
                            lineHeight: 1.4,
                            display: "flex",
                            alignItems: "flex-start",
                            textDecoration: progress[key] ? "line-through" : "none",
                          }}>
                            <Check checked={!!progress[key]} onToggle={() => toggle(key)} />
                            <span>{ch}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── BrainMapTab ─── */
// Brighter label colors for contrast on dark bg (D1/D5 fail WCAG AA otherwise)
const LABEL_COLORS = {
  D1: "#e74c3c", D2: "#e67e22", D3: "#2ecc71", D4: "#3498db", D5: "#a569bd",
};
const DOMAIN_FILL = {
  D1: "#c0392b", D2: "#d35400", D3: "#27ae60", D4: "#2980b9", D5: "#8e44ad",
};
const DOMAIN_WEIGHTS = { D1: 27, D2: 18, D3: 20, D4: 20, D5: 15 };

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function computeLayout() {
  const cx = 360, cy = 320;
  const rDomain = 130, rConcept = 245;
  const domainIds = ["D1", "D2", "D3", "D4", "D5"];
  const totalWeight = 100;
  const gapDeg = 4;
  const availDeg = 360 - gapDeg * 5;

  const domains = {};
  let angleCursor = 0;
  domainIds.forEach(did => {
    const span = (DOMAIN_WEIGHTS[did] / totalWeight) * availDeg;
    const start = angleCursor;
    const mid = start + span / 2;
    domains[did] = { id: did, angleStart: start, angleEnd: start + span, angleMid: mid, span };
    angleCursor += span + gapDeg;
  });

  const conceptsByDomain = {};
  ENRICHED_CONCEPTS.forEach(c => {
    if (!conceptsByDomain[c.domain]) conceptsByDomain[c.domain] = [];
    conceptsByDomain[c.domain].push(c);
  });

  const concepts = {};
  domainIds.forEach(did => {
    const list = conceptsByDomain[did] || [];
    const { angleStart, angleEnd } = domains[did];
    const pad = 2;
    const usable = (angleEnd - angleStart) - pad * 2;
    const step = list.length > 1 ? usable / (list.length - 1) : 0;
    const base = angleStart + pad;
    list.forEach((c, i) => {
      const angle = list.length === 1 ? (angleStart + angleEnd) / 2 : base + step * i;
      const pos = polar(cx, cy, rConcept, angle);
      concepts[c.id] = { ...c, x: pos.x, y: pos.y, angle };
    });
    const midPos = polar(cx, cy, rDomain, domains[did].angleMid);
    domains[did].x = midPos.x;
    domains[did].y = midPos.y;
    domains[did].radius = 18 + (DOMAIN_WEIGHTS[did] / 27) * 16;
  });

  return { cx, cy, domains, concepts, domainIds };
}

const BRAIN_LAYOUT = computeLayout();

function BrainMapTab({ progress, toggle }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const { cx, cy, domains, concepts, domainIds } = BRAIN_LAYOUT;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selected = selectedId ? concepts[selectedId] : null;
  const activeId = hoveredId || selectedId;
  const activeConcept = activeId ? concepts[activeId] : null;
  const activeRelatedSet = activeConcept ? new Set(activeConcept.relatedConcepts) : null;

  const arcs = [];
  ENRICHED_CONCEPTS.forEach(c => {
    (c.relatedConcepts || []).forEach(rid => {
      if (c.id < rid) arcs.push({ a: c.id, b: rid });
    });
  });

  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 0, marginBottom: 10, lineHeight: 1.5 }}>
        Radial view of all 30 concepts across 5 domains. Arcs show cross-domain relationships. Click any concept for production context.
      </p>
      <div style={{ position: "relative" }}>
        <svg
          viewBox="0 0 720 640"
          width="100%"
          height="auto"
          style={{ display: "block", maxWidth: "100%", touchAction: "manipulation" }}
          role="tree"
          aria-label="CCA Foundations concept brain map"
        >
          {/* Background rings (faint guides) */}
          <circle cx={cx} cy={cy} r={245} fill="none" stroke="var(--border-soft)" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={130} fill="none" stroke="var(--border-soft)" strokeWidth={1} strokeDasharray="2 4" />

          {/* Cross-domain arcs */}
          {arcs.map((arc, i) => {
            const a = concepts[arc.a], b = concepts[arc.b];
            if (!a || !b) return null;
            const isActive = activeId && (activeId === arc.a || activeId === arc.b);
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const pullX = cx + (mx - cx) * 0.25;
            const pullY = cy + (my - cy) * 0.25;
            const stroke = isActive ? LABEL_COLORS[a.domain] : "var(--border-med)";
            const opacity = activeId ? (isActive ? 0.55 : 0.05) : 0.15;
            return (
              <path
                key={i}
                d={`M ${a.x} ${a.y} Q ${pullX} ${pullY} ${b.x} ${b.y}`}
                fill="none"
                stroke={stroke}
                strokeWidth={isActive ? 1.5 : 1}
                opacity={opacity}
                style={{ transition: "opacity 0.18s, stroke 0.18s" }}
              />
            );
          })}

          {/* Root node connector lines */}
          {domainIds.map(did => {
            const d = domains[did];
            const isDim = activeId && activeConcept && activeConcept.domain !== did;
            return (
              <line
                key={`rl-${did}`}
                x1={cx} y1={cy} x2={d.x} y2={d.y}
                stroke={DOMAIN_FILL[did]}
                strokeWidth={2}
                opacity={isDim ? 0.2 : 0.6}
                style={{ transition: "opacity 0.18s" }}
              />
            );
          })}

          {/* Domain → concept connector lines */}
          {Object.values(concepts).map(c => {
            const d = domains[c.domain];
            const dim = activeId && activeConcept && !(activeId === c.id || activeRelatedSet.has(c.id));
            return (
              <line
                key={`dl-${c.id}`}
                x1={d.x} y1={d.y} x2={c.x} y2={c.y}
                stroke={DOMAIN_FILL[c.domain]}
                strokeWidth={1}
                opacity={dim ? 0.08 : 0.3}
                style={{ transition: "opacity 0.18s" }}
              />
            );
          })}

          {/* Domain nodes */}
          {domainIds.map(did => {
            const d = domains[did];
            const dim = activeId && activeConcept && activeConcept.domain !== did;
            return (
              <g key={`d-${did}`} style={{ transition: "opacity 0.18s" }} opacity={dim ? 0.35 : 1}>
                <circle cx={d.x} cy={d.y} r={d.radius} fill={DOMAIN_FILL[did]} opacity={0.9} />
                <text x={d.x} y={d.y} textAnchor="middle" dominantBaseline="middle" fill="#f0f0f0" fontSize={14} fontWeight={700} style={{ pointerEvents: "none", fontFamily: "inherit" }}>
                  {did}
                </text>
                <text x={d.x} y={d.y + d.radius + 14} textAnchor="middle" fill={LABEL_COLORS[did]} fontSize={9} fontWeight={600} style={{ pointerEvents: "none", fontFamily: "inherit", letterSpacing: 0.5 }}>
                  {DOMAIN_WEIGHTS[did]}%
                </text>
              </g>
            );
          })}

          {/* Root node (center) */}
          <g>
            <circle cx={cx} cy={cy} r={36} fill="var(--bg-panel)" stroke="var(--border-med)" strokeWidth={1.5} />
            <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" fontSize={10} fontWeight={700} style={{ pointerEvents: "none", fontFamily: "inherit" }}>CCA-F</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text-muted)" fontSize={8} style={{ pointerEvents: "none", fontFamily: "inherit", letterSpacing: 0.5 }}>FOUNDATIONS</text>
          </g>

          {/* Concept nodes */}
          {Object.values(concepts).map(c => {
            const isSelected = selectedId === c.id;
            const isHovered = hoveredId === c.id;
            const isRelated = activeRelatedSet && activeRelatedSet.has(c.id);
            const dim = activeId && !(activeId === c.id || isRelated);
            const isComplete = !!progress[`bm-${c.id}`];
            const nodeR = isSelected ? 10 : isHovered ? 9 : 7;
            const fill = isComplete ? "var(--bg-root)" : DOMAIN_FILL[c.domain];
            const strokeW = isSelected ? 2.5 : isComplete ? 2 : 1;
            const labelOutside = c.x >= cx - 20;
            return (
              <g
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedId(c.id); } }}
                tabIndex={0}
                role="treeitem"
                aria-label={`${c.name}, domain ${c.domain}, task ${c.task}`}
                style={{ cursor: "pointer", outline: "none", transition: "opacity 0.18s" }}
                opacity={dim ? 0.25 : 1}
              >
                <circle cx={c.x} cy={c.y} r={nodeR} fill={fill} stroke={DOMAIN_FILL[c.domain]} strokeWidth={strokeW} />
                <text
                  x={c.x + (labelOutside ? nodeR + 4 : -(nodeR + 4))}
                  y={c.y}
                  textAnchor={labelOutside ? "start" : "end"}
                  dominantBaseline="middle"
                  fill={isSelected || isHovered ? "var(--text-primary)" : "var(--text-soft)"}
                  fontSize={9}
                  fontWeight={isSelected || isHovered ? 600 : 400}
                  style={{ pointerEvents: "none", fontFamily: "inherit" }}
                >
                  {c.task} {c.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, fontSize: 11, color: "var(--text-faint)" }}>
          {domainIds.map(did => (
            <span key={did} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOMAIN_FILL[did] }} />
              {did} {DOMAIN_WEIGHTS[did]}%
            </span>
          ))}
          <span style={{ marginLeft: "auto", color: "var(--text-dim)" }}>
            Hollow = mastered · Click a node
          </span>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <DetailPanel
          concept={selected}
          concepts={concepts}
          progress={progress}
          toggle={toggle}
          onClose={() => setSelectedId(null)}
          onNavigate={(id) => setSelectedId(id)}
        />
      )}
    </div>
  );
}

/* ─── DetailPanel: expands below SVG (mobile-first, no modal overlay) ─── */
function DetailPanel({ concept, concepts, progress, toggle, onClose, onNavigate }) {
  const domainFill = DOMAIN_FILL[concept.domain];
  const labelColor = LABEL_COLORS[concept.domain];
  const isComplete = !!progress[`bm-${concept.id}`];
  const related = (concept.relatedConcepts || []).map(id => concepts[id]).filter(Boolean);

  return (
    <div
      role="dialog"
      aria-labelledby={`bm-title-${concept.id}`}
      style={{
        marginTop: 20,
        padding: "20px 24px",
        background: "var(--bg-panel)",
        border: `1px solid ${domainFill}33`,
        borderLeft: `3px solid ${domainFill}`,
        borderRadius: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 8, letterSpacing: 1, fontWeight: 700,
              color: "#0c0c10", background: labelColor,
              padding: "2px 6px", borderRadius: 3,
            }}>{concept.domain}</span>
            <span style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: 0.5 }}>TASK {concept.task}</span>
          </div>
          <h3 id={`bm-title-${concept.id}`} style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>
            {concept.name}
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => toggle(`bm-${concept.id}`)}
            aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
            style={{
              fontSize: 11, padding: "4px 8px",
              background: isComplete ? `${domainFill}22` : "transparent",
              color: isComplete ? labelColor : "var(--text-faint)",
              border: `1px solid ${isComplete ? domainFill : "var(--border-med)"}`,
              borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {isComplete ? "✓ MASTERED" : "MARK MASTERED"}
          </button>
          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              fontSize: 15, padding: "2px 8px",
              background: "transparent", color: "var(--text-faint)",
              border: "1px solid #2a2a38", borderRadius: 3, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >×</button>
        </div>
      </div>

      <DetailSection label="Why it matters" color={labelColor}>
        <p style={{ fontSize: 11, color: "var(--text-body)", lineHeight: 1.55, margin: 0 }}>{concept.whyItMatters}</p>
      </DetailSection>

      <DetailSection label="Used in" color={labelColor}>
        <ul style={{ fontSize: 12, color: "var(--text-soft)", margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
          {concept.productionExamples.map((ex, i) => <li key={i}>{ex}</li>)}
        </ul>
      </DetailSection>

      {related.length > 0 && (
        <DetailSection label="Connects to" color={labelColor}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {related.map(r => (
              <button
                key={r.id}
                onClick={() => onNavigate(r.id)}
                style={{
                  fontSize: 11, padding: "3px 7px",
                  background: "transparent", color: LABEL_COLORS[r.domain],
                  border: `1px solid ${DOMAIN_FILL[r.domain]}55`,
                  borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {r.domain} · {r.name}
              </button>
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection label="Learn more" color={labelColor}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {concept.resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, color: "var(--text-body)",
                textDecoration: "none", lineHeight: 1.4,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{
                fontSize: 8, letterSpacing: 0.5, padding: "1px 5px",
                background: "var(--border-soft)", color: "var(--text-muted)",
                borderRadius: 2, textTransform: "uppercase", fontWeight: 600,
              }}>{r.type}</span>
              <span style={{ borderBottom: "1px dotted #3a3a48" }}>{r.label}</span>
              <span style={{ color: "var(--text-dim)", fontSize: 9 }}>↗</span>
            </a>
          ))}
        </div>
      </DetailSection>

      <DetailSection label="Watch for" color={labelColor}>
        <ul style={{ fontSize: 12, color: "var(--text-soft)", margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
          {concept.failureModes.map((fm, i) => <li key={i}>{fm}</li>)}
        </ul>
      </DetailSection>

      <DetailSection label="Exam signals" color={labelColor} last>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {concept.examSignals.map((sig, i) => (
            <span key={i} style={{
              fontSize: 11, padding: "2px 6px",
              background: `${domainFill}15`, color: "var(--text-soft)",
              border: `1px solid ${domainFill}33`,
              borderRadius: 2, fontFamily: "inherit",
            }}>"{sig}"</span>
          ))}
        </div>
      </DetailSection>
    </div>
  );
}

function DetailSection({ label, color, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 12 }}>
      <div style={{
        fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase",
        fontWeight: 600, color, marginBottom: 6,
      }}>{label}</div>
      {children}
    </div>
  );
}

/* ─── BuildsTab ─── */
function BuildsTab({ projects }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        Each project maps to exam scenarios. Building these gives you muscle memory for the tradeoffs the exam tests.
      </p>
      {projects.map((p, pi) => (
        <div key={pi} style={{
          padding: "18px",
          background: "var(--bg-panel)",
          border: "1px solid #1a1a26",
          borderRadius: 6,
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 3 }}>
            {p.scenario} &middot; {p.domains}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
            {p.desc}
          </div>
          <div style={{ marginTop: 10, borderTop: "1px solid #1a1a26", paddingTop: 8 }}>
            {p.skills.map((sk, si) => (
              <div key={si} style={{
                fontSize: 12,
                color: "var(--text-faint)",
                padding: "3px 0 3px 10px",
                borderLeft: "2px solid #c0392b22",
                marginBottom: 1,
              }}>
                {sk}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── RulesTab ─── */
function RulesTab({ rules }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        These 11 decision rules help eliminate distractors instantly. Internalize them as reflexes.
      </p>
      {rules.map((r) => (
        <div key={r.num} style={{
          padding: "18px",
          background: "var(--bg-panel)",
          border: "1px solid #1a1a26",
          borderRadius: 6,
          marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 11,
              color: "#0c0c10",
              background: "#c0392b",
              padding: "2px 5px",
              borderRadius: 3,
              fontWeight: 700,
            }}>
              {r.num}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{r.rule}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 8 }}>
            {r.detail}
          </div>
          <div style={{
            fontSize: 12,
            color: "#d35400",
            padding: "6px 10px",
            background: "#d354000a",
            border: "1px solid #d3540018",
            borderRadius: 4,
            lineHeight: 1.4,
          }}>
            {r.signal}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── CLIGuideTab ─── */
const CLI_GUIDE = [
  {
    title: "Why switch to the terminal?",
    content: [
      "Most of what the CCA exam tests — agentic loops, hooks, MCP, CLAUDE.md hierarchy, path-specific rules — happens in the CLI and the Agent SDK, not the desktop app.",
      "The desktop app is great for chatting. But when you need hooks, skills, subagents, session forking, or CI/CD integration, you need the terminal.",
      "Your Max subscription covers both. You're not paying extra — just changing the interface.",
    ],
  },
  {
    title: "Step 1 — Pick a terminal",
    content: [
      "macOS Terminal.app works fine out of the box. If you want something nicer:",
      "iTerm2 — free, mature, supports image pasting. Install: brew install --cask iterm2",
      "Warp — modern and fast. Install: brew install --cask warp",
      "Ghostty — lightweight and native. Install: brew install --cask ghostty",
      "Start with Terminal.app if you're unsure. You can always switch later.",
    ],
  },
  {
    title: "Step 2 — Install the CLI",
    content: [
      "The recommended install method (2026) is the native installer or Homebrew:",
      "Option 1 (recommended): curl -fsSL https://claude.ai/install.sh | bash",
      "Option 2 (Homebrew): brew install --cask claude-code",
      "Verify it works: claude --version",
      "The npm install method (npm install -g @anthropic-ai/claude-code) is deprecated.",
    ],
  },
  {
    title: "Step 3 — Sign in",
    content: [
      "Navigate to any project directory and run: claude",
      "A browser window opens for OAuth sign-in. Use the same account that holds your Max subscription.",
      "No API key needed. No separate payment. Your Max usage limits apply to the CLI automatically.",
    ],
  },
  {
    title: "Step 4 — Essential slash commands",
    commands: [
      { cmd: "/help", desc: "Lists every available command. Read this once." },
      { cmd: "/clear", desc: "Clears the conversation. Fresh start." },
      { cmd: "/compact", desc: "Summarises the conversation to reclaim context. Use at ~80% capacity." },
      { cmd: "/resume", desc: "Resumes a prior named session." },
      { cmd: "/model", desc: "Switches between available models." },
      { cmd: "/tasks", desc: "Lists background tasks." },
      { cmd: "/config", desc: "Adjusts settings for this session." },
      { cmd: "/init", desc: "Creates a CLAUDE.md from the current project." },
    ],
  },
  {
    title: "Step 5 — Desktop habits → terminal equivalents",
    translations: [
      { desktop: "Clicked 'New chat'", terminal: "/clear (or quit and re-run claude)" },
      { desktop: "Attached a file", terminal: "Just mention the file path — it gets read automatically" },
      { desktop: "Dragged in a screenshot", terminal: "Paste the image (iTerm2, Warp support this) or mention the file path" },
      { desktop: "Used the settings menu", terminal: "Edit ~/.claude/settings.json or .claude/settings.json in your project" },
      { desktop: "Saved custom instructions", terminal: "Create CLAUDE.md at the project root — same purpose, version-controllable" },
      { desktop: "Used Projects with context", terminal: "Use CLAUDE.md + .claude/rules/ with glob patterns" },
    ],
  },
  {
    title: "Step 6 — Set up your first CLAUDE.md",
    content: [
      "Inside any project directory, create a CLAUDE.md file:",
      "# Project context",
      "This is a [describe project] using [stack].",
      "",
      "## Conventions",
      "- Use [naming convention]",
      "- Tests live in [path]",
      "- Don't modify [file/dir] without asking",
      "",
      "Then run claude and ask: 'What conventions should you follow in this project?'",
      "If it reads them back, you've set up what the desktop app's custom instructions did — but in a file you own and can check into git.",
    ],
  },
  {
    title: "Antigravity (optional — Path B)",
    content: [
      "Google Antigravity is a free agent-first IDE that supports multiple models including Sonnet 4.6 and Opus 4.6.",
      "Download from antigravity.google for macOS. Import your VS Code or Cursor settings on first launch.",
      "Install the agy CLI tool so you can open projects with: agy .",
      "Use Agent-assisted mode (recommended) — handles safe automations, asks for risky ones.",
      "Open the integrated terminal (View → Terminal) and run claude there. You get two agent surfaces side by side.",
      "Use Antigravity's agents for inline editing and quick refactors. Use the CLI for longer sessions, hooks, skills, and MCP.",
    ],
  },
  {
    title: "Common gotchas",
    content: [
      "'command not found' after installing — restart your terminal or run: source ~/.zshrc",
      "Pasted images don't work — use iTerm2, Warp, or Ghostty. Terminal.app doesn't support image pasting.",
      "CLI feels slower than the desktop app — same speed, different rendering. The CLI streams character by character; the desktop app buffers.",
      "Context runs out faster — the desktop app does aggressive auto-compaction. In the CLI, you control it with /compact. Run it when the bar shows >80%.",
      "Not sure which model you're using — /model tells you.",
    ],
  },
  {
    title: "7-day onboarding plan",
    content: [
      "Day 1 — Install the CLI, run claude --version, open a toy project, have one conversation. Don't do anything important yet.",
      "Day 2 — Create a CLAUDE.md in one of your real projects. Have it follow your conventions.",
      "Day 3 — Learn /compact and /clear. Use both at least once today.",
      "Day 4 — Try .claude/commands/ — create one custom slash command for a repetitive task.",
      "Day 5 — Try a hook. Add a PostToolUse hook in .claude/settings.json that echoes a message after file edits. This is heavily tested on the exam.",
      "Day 6 — Install Antigravity if you want Path B. Otherwise, spend today in the terminal and notice what you miss from the desktop app.",
      "Day 7 — Decide: terminal, Antigravity, or keep the desktop app for some things? All three are fine. Many people keep the desktop app for quick chats and use the CLI for coding.",
    ],
  },
];

function CLIGuideTab() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div>
      <p style={{ fontSize: 16, color: "var(--text-body)", marginTop: 0, marginBottom: 24, lineHeight: 1.7 }}>
        A step-by-step guide to switching from the desktop app to the terminal — where hooks, skills, subagents, and everything the exam tests actually live.
      </p>
      {CLI_GUIDE.map((section, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} style={{ marginBottom: 8 }}>
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{
                width: "100%", padding: "16px 20px", background: isOpen ? "var(--bg-panel-alt)" : "var(--bg-panel)",
                border: "1px solid var(--border-soft)", borderRadius: 8, cursor: "pointer",
                textAlign: "left", fontFamily: "inherit", color: "var(--text-primary)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                <span style={{ color: "#c0392b", marginRight: 10, fontWeight: 700 }}>{i + 1}</span>
                {section.title}
              </span>
              <span style={{ color: "var(--text-dim)", fontSize: 18 }}>{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div style={{ padding: "16px 20px 20px", borderLeft: "3px solid #c0392b44", marginLeft: 10, marginTop: 4 }}>
                {/* Regular content */}
                {section.content && section.content.map((line, j) => (
                  <p key={j} style={{
                    fontSize: 15, color: line.startsWith("#") || line.startsWith("##") ? "var(--text-primary)" : "var(--text-body)",
                    fontWeight: line.startsWith("#") ? 700 : 400,
                    lineHeight: 1.8, margin: "0 0 8px",
                    fontFamily: line.includes("brew ") || line.includes("curl ") || line.includes("claude") || line.includes("npm ") || line.startsWith("Option") ? "'IBM Plex Mono', monospace" : "inherit",
                    fontSize: line.includes("brew ") || line.includes("curl ") || line.startsWith("Option") ? 14 : 15,
                    background: (line.includes("brew ") || line.includes("curl ") || line.includes("claude --version")) ? "var(--bg-panel)" : "transparent",
                    padding: (line.includes("brew ") || line.includes("curl ") || line.includes("claude --version")) ? "6px 10px" : 0,
                    borderRadius: 4,
                  }}>
                    {line || "\u00A0"}
                  </p>
                ))}

                {/* Commands table */}
                {section.commands && (
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 16px" }}>
                    {section.commands.map((c, j) => (
                      <div key={j} style={{ display: "contents" }}>
                        <span style={{ fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", color: "#c0392b", fontWeight: 600 }}>{c.cmd}</span>
                        <span style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.6 }}>{c.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Translations table */}
                {section.translations && (
                  <div>
                    {section.translations.map((t, j) => (
                      <div key={j} style={{
                        display: "flex", gap: 16, padding: "10px 0",
                        borderBottom: "1px solid var(--border-soft)",
                        fontSize: 15, lineHeight: 1.6,
                      }}>
                        <span style={{ flex: 1, color: "var(--text-faint)" }}>{t.desktop}</span>
                        <span style={{ color: "var(--text-dim)", flexShrink: 0 }}>→</span>
                        <span style={{ flex: 1, color: "var(--text-body)" }}>{t.terminal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── CheatSheetTab ─── */
function CheatSheetTab({ data }) {
  const [expandedKey, setExpandedKey] = useState(null);
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
        Quick-scan decision reference aligned with the 30 exam task statements. Click any rule for the full explanation and a concrete example.
      </p>
      {data.map((section, si) => (
        <div key={si} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#c0392b",
            letterSpacing: 0.5,
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
            {section.category}
          </div>
          <div style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-soft)",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            {section.items.map((item, ii) => {
              const key = `${si}-${ii}`;
              const isOpen = expandedKey === key;
              const rule = typeof item === "string" ? item : item.rule;
              const detail = typeof item === "object" ? item.detail : null;
              const example = typeof item === "object" ? item.example : null;
              return (
                <div key={ii}>
                  <button
                    onClick={() => setExpandedKey(isOpen ? null : key)}
                    style={{
                      width: "100%",
                      fontSize: 14,
                      color: "var(--text-body)",
                      padding: "12px 16px",
                      borderLeft: `3px solid ${isOpen ? "#c0392b" : "#c0392b44"}`,
                      borderBottom: `1px solid var(--border-soft)`,
                      background: isOpen ? "var(--bg-panel-alt)" : "transparent",
                      lineHeight: 1.6,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      border: "none",
                      borderLeft: `3px solid ${isOpen ? "#c0392b" : "#c0392b44"}`,
                      borderBottom: `1px solid var(--border-soft)`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <span>{rule}</span>
                    <span style={{ color: "var(--text-dim)", fontSize: 12, flexShrink: 0, marginTop: 2 }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && detail && (
                    <div style={{ padding: "12px 16px 14px 19px", borderLeft: "3px solid #c0392b", background: "var(--bg-panel-alt)" }}>
                      <div style={{ fontSize: 13, color: "var(--text-soft)", lineHeight: 1.7, marginBottom: example ? 10 : 0 }}>
                        {detail}
                      </div>
                      {example && (
                        <div style={{ fontSize: 13, color: "#2980b9", padding: "8px 12px", background: "#2980b90a", border: "1px solid #2980b918", borderRadius: 4, lineHeight: 1.6 }}>
                          <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>EXAMPLE: </span>
                          {example}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
