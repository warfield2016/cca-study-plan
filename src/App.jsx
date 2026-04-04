import { useState, useEffect, useMemo } from "react";

/* ─── localStorage progress tracking ─── */
const STORAGE_KEY = "cca-study-progress";
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

/* ─── WEEKS ─── */
const WEEKS = [
  {
    id: 1,
    title: "Foundation Sprint",
    subtitle: "Core mental models + baseline diagnostic",
    theme: "Build the skeleton — understand HOW Claude thinks",
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
          "Study tool descriptions as THE mechanism for LLM tool selection",
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
      { name: "Tool Interface Design", children: ["descriptions drive LLM tool selection", "include input formats, examples, edge cases, boundaries", "rename + update descriptions to eliminate overlap", "splitting generic → purpose-specific tools"] },
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
      { name: "Iterative Refinement", children: ["concrete input/output examples > prose descriptions", "test-driven: write tests first, share failures to iterate", "interview pattern: Claude asks questions before implementing", "single message for interacting issues; sequential for independent"] },
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
    detail: "Make schema fields optional/nullable when the source may not contain the info. Required fields on absent data forces the model to fabricate values to satisfy the schema.",
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
    detail: "A model retains reasoning context from generation, making it less likely to question its own decisions. A separate Claude instance (without prior reasoning) catches issues the generator misses.",
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
    desc: "Claude Code in non-interactive CI mode with structured output, explicit review criteria, and multi-pass architecture",
    skills: ["-p flag non-interactive mode", "--output-format json", "Explicit review criteria", "Multi-pass: per-file + cross-file", "False positive category management"],
  },
  {
    name: "Claude Code Team Workflow",
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
      "Compliance MUST be guaranteed → programmatic hooks/prerequisites, never prompt-only",
      "Style/tone/formatting → prompt instructions are sufficient",
      "Complex multi-file changes → plan mode; single-file fix → direct execution",
      "Verbose discovery phase → Explore subagent to isolate context",
      "Single agent hitting limits → decompose into coordinator + scoped subagents",
      "Fixed known steps → prompt chaining; open-ended investigation → adaptive decomposition",
    ],
  },
  {
    category: "Tool Design Decisions",
    items: [
      "Generic tool confusing the model → split into purpose-specific tools with distinct descriptions",
      "Similar tools misrouted → rename + expand descriptions with boundaries and examples",
      "Agent has 18 tools → scope to 4-5 per role; add cross-role tools for high-frequency needs only",
      "MCP tools = actions (create, update, query); MCP resources = content catalogs (browse without calling)",
      "Project-shared tooling → .mcp.json; personal/experimental → ~/.claude.json",
      "Need guaranteed first tool call → tool_choice forced; need any tool → 'any'; flexible → 'auto'",
    ],
  },
  {
    category: "Context Management",
    items: [
      "Long conversation losing facts → extract amounts/dates/IDs into persistent case facts block",
      "Tool returns 40 fields → trim to 5 relevant fields BEFORE accumulation",
      "Key findings getting missed → put summaries at START; critical data at END (lost-in-the-middle)",
      "Subagent output → structured data (facts, citations, scores), NOT verbose reasoning chains",
      "Extended session degrading → use scratchpad files + /compact to manage context",
      "Resuming session → fresh + summary if tool results stale; --resume if context mostly valid",
    ],
  },
  {
    category: "Error & Escalation",
    items: [
      "Customer demands human → honor immediately, no investigation first",
      "Policy gap/exception → escalate (not within agent capability by design)",
      "Sentiment-based escalation → anti-pattern (doesn't correlate with complexity)",
      "Multiple customer matches → ask for identifiers, never heuristic selection",
      "Subagent error → return structured context (type + query + partial results + alternatives)",
      "Access failure vs empty result → different; coordinator must distinguish for recovery",
      "Transient failure → local retry in subagent; only propagate if unresolvable",
    ],
  },
  {
    category: "Output & Review",
    items: [
      "Guaranteed schema compliance → tool_use + JSON schema (eliminates syntax errors, NOT semantic)",
      "Source may lack info → make field nullable/optional (required forces fabrication)",
      "enum categories → add 'other' + detail string for extensibility",
      "Same-session self-review → limited (retained reasoning context); use independent instance",
      "Large PR (14+ files) → per-file local passes + separate cross-file integration pass",
      "Few-shot: 2-4 examples targeting ambiguous cases, showing WHY one choice beats alternatives",
      "Vague criteria ('be conservative') → replace with specific categorical criteria",
    ],
  },
  {
    category: "Config & CI/CD",
    items: [
      "Team-wide command → .claude/commands/ (version-controlled); personal → ~/.claude/commands/",
      "Cross-directory convention (all test files) → .claude/rules/ with glob, NOT directory CLAUDE.md",
      "Skill produces verbose output → context: fork to isolate from main conversation",
      "CI pipeline → -p flag (non-interactive); --output-format json for machine parsing",
      "Self-review in CI → use separate instance (not the generator) for code review",
      "Batch processing → overnight reports (50% cost); sync API → pre-merge blocking checks",
      "Re-running review after commits → include prior findings; report only new/unaddressed issues",
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
  const [progress, setProgress] = useState(loadProgress);

  const toggleProgress = (key) => {
    setProgress(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });
  };

  const tasksDone = countCompleted(progress, "t-");
  const tasksTotal = countItems("tasks");
  const conceptsDone = countCompleted(progress, "c-");
  const conceptsTotal = countItems("concepts");

  const tabs = [
    { id: "plan", label: "Weekly Plan" },
    { id: "tree", label: "Concepts" },
    { id: "builds", label: "Projects" },
    { id: "rules", label: "Decision Rules" },
    { id: "cheat", label: "Cheat Sheet" },
  ];

  const s = {
    root: {
      fontFamily: "'IBM Plex Mono', 'Menlo', 'Consolas', monospace",
      background: "#0c0c10",
      color: "#c8c8d0",
      minHeight: "100vh",
      maxWidth: 520,
      margin: "0 auto",
    },
    header: {
      padding: "20px 16px 12px",
      borderBottom: "1px solid #1c1c28",
    },
    tag: {
      display: "inline-block",
      fontSize: 9,
      letterSpacing: 2.5,
      color: "#c0392b",
      textTransform: "uppercase",
      fontWeight: 600,
      marginBottom: 6,
    },
    h1: {
      fontSize: 18,
      fontWeight: 700,
      color: "#f0f0f0",
      margin: 0,
      lineHeight: 1.3,
    },
    sub: {
      fontSize: 11,
      color: "#555",
      marginTop: 4,
    },
    tabs: {
      display: "flex",
      borderBottom: "1px solid #1c1c28",
      padding: "0 4px",
      overflowX: "auto",
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: "10px 4px",
      fontSize: 9,
      fontFamily: "inherit",
      fontWeight: active ? 600 : 400,
      background: "none",
      color: active ? "#f0f0f0" : "#4a4a58",
      border: "none",
      borderBottom: active ? "2px solid #c0392b" : "2px solid transparent",
      cursor: "pointer",
      textAlign: "center",
      letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }),
    content: {
      padding: "12px 16px 24px",
    },
    progressBar: {
      height: 3,
      background: "#1a1a26",
      borderRadius: 2,
      overflow: "hidden",
      marginTop: 8,
    },
  };

  const overallDone = tasksDone + conceptsDone;
  const overallTotal = tasksTotal + conceptsTotal;
  const pct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.tag}>CCA-F Study Plan</div>
        <h1 style={s.h1}>4 Weeks to 900+</h1>
        <p style={s.sub}>Scaled 100–1000 / 720 pass / 60 questions / 4 random scenarios</p>
        <div style={s.progressBar}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#c0392b", transition: "width 0.3s" }} />
        </div>
        <div style={{ fontSize: 9, color: "#4a4a58", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
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

      <div style={s.content}>
        {tab === "plan" && <PlanTab weeks={WEEKS} openWeek={openWeek} setOpenWeek={setOpenWeek} openDay={openDay} setOpenDay={setOpenDay} progress={progress} toggle={toggleProgress} />}
        {tab === "tree" && <TreeTab domains={CONCEPT_TREE} openDomain={openDomain} setOpenDomain={setOpenDomain} progress={progress} toggle={toggleProgress} />}
        {tab === "builds" && <BuildsTab projects={PROJECTS} />}
        {tab === "rules" && <RulesTab rules={RULES} />}
        {tab === "cheat" && <CheatSheetTab data={CHEAT_SHEET} />}
      </div>

      <div style={{
        padding: "16px",
        borderTop: "1px solid #1c1c28",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 9, color: "#3a3a48", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Free resources only
        </div>
        <div style={{ fontSize: 10, color: "#3a3a48", lineHeight: 1.6 }}>
          Anthropic Skilljar &middot; CertSafari &middot; ClaudeCertifications &middot; ReadRoost &middot; Claude Partner Network &middot; Anthropic GitHub
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
        fontSize: 9,
        color: checked ? "#c0392b" : "transparent",
        marginRight: 8,
        transition: "all 0.15s",
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

/* ─── PlanTab ─── */
function PlanTab({ weeks, openWeek, setOpenWeek, openDay, setOpenDay, progress, toggle }) {
  return (
    <div>
      {/* Weight bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          Domain weights
        </div>
        <div style={{ display: "flex", gap: 2, height: 4, borderRadius: 2, overflow: "hidden" }}>
          {[
            { w: 27, c: "#c0392b" }, { w: 18, c: "#d35400" }, { w: 20, c: "#27ae60" },
            { w: 20, c: "#2980b9" }, { w: 15, c: "#8e44ad" },
          ].map((d, i) => <div key={i} style={{ width: `${d.w}%`, background: d.c }} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "#3a3a48" }}>
          <span>D1 27%</span><span>D2 18%</span><span>D3 20%</span><span>D4 20%</span><span>D5 15%</span>
        </div>
      </div>

      {weeks.map(week => {
        const isOpen = openWeek === week.id;
        return (
          <div key={week.id} style={{ marginBottom: 8 }}>
            <button
              onClick={() => setOpenWeek(isOpen ? null : week.id)}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: isOpen ? "#12121a" : "#0f0f16",
                border: isOpen ? "1px solid #262636" : "1px solid #1a1a26",
                borderRadius: 6,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "#f0f0f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 9, color: "#c0392b", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
                    Week {week.id}
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}>{week.title}</div>
                  <div style={{ fontSize: 11, color: "#5a5a68", marginTop: 2 }}>{week.subtitle}</div>
                </div>
                <span style={{ fontSize: 14, color: "#3a3a48", marginTop: 2 }}>{isOpen ? "−" : "+"}</span>
              </div>
              <div style={{ fontSize: 10, color: "#c0392b55", marginTop: 6, fontStyle: "italic" }}>
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
                          padding: "10px 12px",
                          background: dayOpen ? "#141420" : "#0e0e15",
                          border: `1px solid ${dayOpen ? "#262636" : "#1a1a26"}`,
                          borderLeft: `3px solid ${dc}`,
                          borderRadius: 4,
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          color: "#d0d0d8",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: 10, color: dc, fontWeight: 600 }}>{day.day}</span>
                            <span style={{ fontSize: 10, color: "#3a3a48", marginLeft: 8 }}>{day.domain}</span>
                          </div>
                          <span style={{ fontSize: 12, color: "#3a3a48" }}>{dayOpen ? "−" : "+"}</span>
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
                                color: progress[key] ? "#4a4a58" : "#7a7a8a",
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
                              fontSize: 10,
                              color: "#f39c12",
                              lineHeight: 1.5,
                            }}>
                              <span style={{ fontWeight: 700, fontSize: 9, letterSpacing: 0.5 }}>KPI: </span>
                              {day.kpi}
                            </div>
                          )}

                          {/* Daily Closure / Quiz Reference */}
                          {day.closure && (
                            <div style={{
                              marginTop: 6,
                              padding: "8px 10px",
                              background: "#2980b90a",
                              border: "1px solid #2980b918",
                              borderRadius: 4,
                              fontSize: 10,
                              color: "#2980b9",
                              lineHeight: 1.5,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}>
                              <span>{day.closure.label}</span>
                              <span style={{
                                fontSize: 9,
                                background: "#2980b922",
                                padding: "2px 6px",
                                borderRadius: 3,
                                fontWeight: 600,
                              }}>
                                Target: {day.closure.target}%
                              </span>
                            </div>
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
      <p style={{ fontSize: 11, color: "#5a5a68", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
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
                padding: "11px 14px",
                background: "#0f0f16",
                border: `1px solid ${d.accent}22`,
                borderLeft: `3px solid ${d.accent}`,
                borderRadius: 5,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "#e0e0e8",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{d.domain}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: d.accent, fontWeight: 400 }}>{d.weight}</span>
                  <span style={{ fontSize: 9, color: "#4a4a58" }}>{domainDone}/{domainTotal}</span>
                  <span style={{ color: "#3a3a48", fontSize: 14 }}>{isOpen ? "−" : "+"}</span>
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
                            fontSize: 10,
                            color: progress[key] ? "#3a3a48" : "#6a6a78",
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

/* ─── BuildsTab ─── */
function BuildsTab({ projects }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#5a5a68", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        Each project maps to exam scenarios. Building these gives you muscle memory for the tradeoffs the exam tests.
      </p>
      {projects.map((p, pi) => (
        <div key={pi} style={{
          padding: "14px",
          background: "#0f0f16",
          border: "1px solid #1a1a26",
          borderRadius: 6,
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e8" }}>{p.name}</div>
          <div style={{ fontSize: 10, color: "#4a4a58", marginTop: 3 }}>
            {p.scenario} &middot; {p.domains}
          </div>
          <div style={{ fontSize: 11, color: "#7a7a8a", marginTop: 8, lineHeight: 1.5 }}>
            {p.desc}
          </div>
          <div style={{ marginTop: 10, borderTop: "1px solid #1a1a26", paddingTop: 8 }}>
            {p.skills.map((sk, si) => (
              <div key={si} style={{
                fontSize: 10,
                color: "#5a5a68",
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
      <p style={{ fontSize: 11, color: "#5a5a68", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        These 11 decision rules help eliminate distractors instantly. Internalize them as reflexes.
      </p>
      {rules.map((r) => (
        <div key={r.num} style={{
          padding: "14px",
          background: "#0f0f16",
          border: "1px solid #1a1a26",
          borderRadius: 6,
          marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 9,
              color: "#0c0c10",
              background: "#c0392b",
              padding: "2px 5px",
              borderRadius: 3,
              fontWeight: 700,
            }}>
              {r.num}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e8" }}>{r.rule}</span>
          </div>
          <div style={{ fontSize: 11, color: "#7a7a8a", lineHeight: 1.6, marginBottom: 8 }}>
            {r.detail}
          </div>
          <div style={{
            fontSize: 10,
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

/* ─── CheatSheetTab ─── */
function CheatSheetTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#5a5a68", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        Quick-scan decision reference aligned with the 30 exam task statements. If X → then Y.
      </p>
      {data.map((section, si) => (
        <div key={si} style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#c0392b",
            letterSpacing: 0.5,
            marginBottom: 6,
            textTransform: "uppercase",
          }}>
            {section.category}
          </div>
          <div style={{
            background: "#0f0f16",
            border: "1px solid #1a1a26",
            borderRadius: 6,
            padding: "10px 12px",
          }}>
            {section.items.map((item, ii) => (
              <div key={ii} style={{
                fontSize: 10,
                color: "#7a7a8a",
                padding: "4px 0 4px 10px",
                borderLeft: "2px solid #c0392b22",
                marginBottom: 2,
                lineHeight: 1.5,
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
