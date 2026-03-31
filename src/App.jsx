import { useState } from "react";

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
        ],
        build: null,
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
        ],
        build: null,
      },
      {
        day: "Day 7",
        focus: "Context + Reliability + BASELINE TEST",
        domain: "D5",
        tasks: [
          "Progressive summarization risks: losing numbers, dates, percentages",
          "Lost-in-the-middle: put key findings at START and END, not middle",
          "Trim verbose tool outputs BEFORE they accumulate (40 fields → 5 relevant)",
          "Take CertSafari diagnostic: 60 questions, all domains → establish baseline scores",
        ],
        build: "BASELINE: CertSafari 60-question diagnostic across all domains",
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
        ],
        build: "CI/CD code review pipeline using Claude Code CLI flags",
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
        ],
        build: null,
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
        ],
        build: null,
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
        ],
        build: null,
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
      },
    ],
  },
];

const CONCEPT_TREE = [
  {
    domain: "D1: Agentic Architecture",
    weight: "27%",
    accent: "#c0392b",
    concepts: [
      { name: "Agentic Loop", children: ["stop_reason handling", "tool result appending", "loop termination", "anti-patterns"] },
      { name: "Multi-Agent Orchestration", children: ["hub-and-spoke pattern", "coordinator role", "task decomposition", "parallel vs sequential"] },
      { name: "Subagent Management", children: ["Task tool + allowedTools", "explicit context passing", "no context inheritance", "fork_session"] },
      { name: "Workflow Enforcement", children: ["programmatic prerequisites", "hooks vs prompts", "PostToolUse normalization", "tool call interception"] },
      { name: "Task Decomposition", children: ["prompt chaining (fixed)", "adaptive decomposition", "per-file + cross-file passes", "iterative refinement"] },
    ],
  },
  {
    domain: "D2: Tool Design & MCP",
    weight: "18%",
    accent: "#d35400",
    concepts: [
      { name: "Tool Interface Design", children: ["descriptions drive selection", "splitting generic tools", "rename to disambiguate", "boundary docs"] },
      { name: "Error Design", children: ["errorCategory types", "isRetryable flag", "isError in MCP", "structured vs generic"] },
      { name: "tool_choice Config", children: ["auto (may skip tool)", "any (must call one)", "forced (specific tool)", "sequencing with forced"] },
      { name: "MCP Integration", children: [".mcp.json (project)", "~/.claude.json (user)", "env var expansion", "resources vs tools"] },
      { name: "Built-in Tools", children: ["Grep (content search)", "Glob (file patterns)", "Read/Write/Edit", "Edit fallback → Read+Write"] },
    ],
  },
  {
    domain: "D3: Claude Code Config",
    weight: "20%",
    accent: "#27ae60",
    concepts: [
      { name: "CLAUDE.md Hierarchy", children: ["user → project → directory", "@import patterns", ".claude/rules/ glob scoping", "most specific wins"] },
      { name: "Commands & Skills", children: [".claude/commands/", ".claude/skills/ + SKILL.md", "context: fork", "allowed-tools + argument-hint"] },
      { name: "Execution Modes", children: ["plan mode (complex/arch)", "direct execution (simple)", "when plan adds value", "complexity assessment"] },
      { name: "Session Management", children: ["--resume session-name", "fork_session", "fresh + summary vs stale resume", "inform about file changes"] },
      { name: "CLI for CI/CD", children: ["-p / --print (non-interactive)", "--output-format json", "--json-schema", "/compact, /memory"] },
    ],
  },
  {
    domain: "D4: Prompt Eng & Output",
    weight: "20%",
    accent: "#2980b9",
    concepts: [
      { name: "Explicit Criteria", children: ["specific beats vague", "categorical criteria", "false positive impact", "severity + code examples"] },
      { name: "Few-Shot Prompting", children: ["2–4 ambiguous examples", "show reasoning for choices", "format demonstration", "generalization ability"] },
      { name: "Structured Output", children: ["tool_use + JSON schema", "eliminates syntax errors", "semantic errors persist", "nullable prevents hallucination"] },
      { name: "Schema Design", children: ["required vs optional", "enum + other + detail", "nullable fields", "Pydantic validation"] },
      { name: "Batch & Validation", children: ["Message Batches API", "50% cost / 24hr window", "custom_id correlation", "validation-retry loops"] },
    ],
  },
  {
    domain: "D5: Context & Reliability",
    weight: "15%",
    accent: "#8e44ad",
    concepts: [
      { name: "Context Management", children: ["case facts block", "trim verbose outputs", "lost-in-the-middle effect", "position-aware ordering"] },
      { name: "Escalation Patterns", children: ["customer demands human", "policy gaps", "can't progress", "honor requests immediately"] },
      { name: "Error Propagation", children: ["structured error context", "access failure vs empty result", "partial results + gaps", "never suppress silently"] },
      { name: "Confidence & Review", children: ["field-level confidence", "stratified sampling", "accuracy by doc type", "calibration with labeled sets"] },
      { name: "Provenance", children: ["claim-source mappings", "temporal data handling", "conflict annotation", "coverage gap reporting"] },
    ],
  },
];

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
];

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
];

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

export default function App() {
  const [tab, setTab] = useState("plan");
  const [openWeek, setOpenWeek] = useState(1);
  const [openDomain, setOpenDomain] = useState(0);
  const [openDay, setOpenDay] = useState(null);

  const s = {
    root: {
      fontFamily: "'IBM Plex Mono', 'Menlo', 'Consolas', monospace",
      background: "#0c0c10",
      color: "#c8c8d0",
      minHeight: "100vh",
      maxWidth: 480,
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
      padding: "0 8px",
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: "10px 4px",
      fontSize: 10,
      fontFamily: "inherit",
      fontWeight: active ? 600 : 400,
      background: "none",
      color: active ? "#f0f0f0" : "#4a4a58",
      border: "none",
      borderBottom: active ? "2px solid #c0392b" : "2px solid transparent",
      cursor: "pointer",
      textAlign: "center",
      letterSpacing: 0.5,
    }),
    content: {
      padding: "12px 16px 24px",
    },
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.tag}>CCA-F Study Plan</div>
        <h1 style={s.h1}>4 Weeks to 900+</h1>
        <p style={s.sub}>Scaled 100–1000 / 720 pass / 60 questions / 4 random scenarios</p>
      </div>

      <div style={s.tabs}>
        {[
          { id: "plan", label: "Weekly Plan" },
          { id: "tree", label: "Concepts" },
          { id: "builds", label: "Projects" },
          { id: "rules", label: "Decision Rules" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={s.tabBtn(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {tab === "plan" && <PlanTab weeks={WEEKS} openWeek={openWeek} setOpenWeek={setOpenWeek} openDay={openDay} setOpenDay={setOpenDay} />}
        {tab === "tree" && <TreeTab domains={CONCEPT_TREE} openDomain={openDomain} setOpenDomain={setOpenDomain} />}
        {tab === "builds" && <BuildsTab projects={PROJECTS} />}
        {tab === "rules" && <RulesTab rules={RULES} />}
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

function PlanTab({ weeks, openWeek, setOpenWeek, openDay, setOpenDay }) {
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
                          {day.tasks.map((task, ti) => (
                            <div key={ti} style={{
                              fontSize: 11,
                              color: "#7a7a8a",
                              padding: "5px 0 5px 10px",
                              borderLeft: `1px solid ${dc}33`,
                              marginBottom: 2,
                              lineHeight: 1.5,
                            }}>
                              {task}
                            </div>
                          ))}
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

function TreeTab({ domains, openDomain, setOpenDomain }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#5a5a68", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        Every testable concept organized by domain. If you can explain every leaf node, you're ready.
      </p>
      {domains.map((d, di) => {
        const isOpen = openDomain === di;
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
                      {c.children.map((ch, ki) => (
                        <div key={ki} style={{ fontSize: 10, color: "#6a6a78", padding: "2px 0", lineHeight: 1.4 }}>
                          {ch}
                        </div>
                      ))}
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

function RulesTab({ rules }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#5a5a68", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        These 7 decision rules eliminate roughly 60% of distractors instantly. Internalize them as reflexes.
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
