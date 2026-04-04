import { useState, useEffect, useMemo, useCallback } from "react";
import { d1Questions } from "./data/d1-agentic-architecture";
import { d2Questions } from "./data/d2-tool-design-mcp";
import { d3Questions } from "./data/d3-claude-code-config";
import { d4Questions } from "./data/d4-prompt-engineering";
import { d5Questions } from "./data/d5-context-reliability";

/* ─── All Questions ─── */
const ALL_QUESTIONS = [...d1Questions, ...d2Questions, ...d3Questions, ...d4Questions, ...d5Questions];

/* ─── localStorage ─── */
const STORAGE_KEY = "cca-quiz-progress";
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { history: {}, sessions: [] }; }
  catch { return { history: {}, sessions: [] }; }
}
function saveState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

/* ─── Domain Info ─── */
const DOMAINS = [
  { id: "D1", name: "Agentic Architecture", weight: "27%", color: "#c0392b", count: 0 },
  { id: "D2", name: "Tool Design & MCP", weight: "18%", color: "#d35400", count: 0 },
  { id: "D3", name: "Claude Code Config", weight: "20%", color: "#27ae60", count: 0 },
  { id: "D4", name: "Prompt Eng & Output", weight: "20%", color: "#2980b9", count: 0 },
  { id: "D5", name: "Context & Reliability", weight: "15%", color: "#8e44ad", count: 0 },
];
// Populate counts
DOMAINS.forEach(d => { d.count = ALL_QUESTIONS.filter(q => q.domain === d.id).length; });

const TASK_STATEMENTS = {
  "1.1": "Agentic Loops", "1.2": "Multi-Agent Orchestration", "1.3": "Subagent Context & Spawning",
  "1.4": "Workflow Enforcement", "1.5": "Agent SDK Hooks", "1.6": "Task Decomposition", "1.7": "Session State & Forking",
  "2.1": "Tool Interface Design", "2.2": "Structured Error Responses", "2.3": "Tool Distribution & tool_choice",
  "2.4": "MCP Integration", "2.5": "Built-in Tools",
  "3.1": "CLAUDE.md Hierarchy", "3.2": "Commands & Skills", "3.3": "Path-Specific Rules",
  "3.4": "Plan vs Direct Execution", "3.5": "Iterative Refinement", "3.6": "CI/CD Integration",
  "4.1": "Explicit Criteria", "4.2": "Few-Shot Prompting", "4.3": "Structured Output & Schemas",
  "4.4": "Validation & Retry Loops", "4.5": "Batch Processing", "4.6": "Multi-Pass Review",
  "5.1": "Context Preservation", "5.2": "Escalation Patterns", "5.3": "Error Propagation",
  "5.4": "Codebase Exploration Context", "5.5": "Confidence & Human Review", "5.6": "Provenance & Uncertainty",
};

/* ─── Shuffle ─── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Weighted sample for exam simulation ─── */
function weightedSample(questions, n) {
  const weights = { D1: 0.27, D2: 0.18, D3: 0.20, D4: 0.20, D5: 0.15 };
  const result = [];
  const byDomain = {};
  questions.forEach(q => {
    if (!byDomain[q.domain]) byDomain[q.domain] = [];
    byDomain[q.domain].push(q);
  });
  Object.keys(byDomain).forEach(d => { byDomain[d] = shuffle(byDomain[d]); });
  Object.entries(weights).forEach(([d, w]) => {
    const count = Math.round(n * w);
    const available = byDomain[d] || [];
    result.push(...available.slice(0, count));
  });
  while (result.length < n) {
    const remaining = questions.filter(q => !result.includes(q));
    if (remaining.length === 0) break;
    result.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }
  return shuffle(result.slice(0, n));
}

/* ─── Styles ─── */
const font = "'IBM Plex Mono', 'Menlo', 'Consolas', monospace";
const domainColor = (d) => DOMAINS.find(dom => dom.id === d)?.color || "#555";

/* ─── APP ─── */
export default function App() {
  const [view, setView] = useState("home"); // home | quiz | results
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({}); // { questionId: { selected, correct, time } }
  const [quizMode, setQuizMode] = useState("");
  const [quizLabel, setQuizLabel] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [questionStart, setQuestionStart] = useState(null);
  const [state, setState] = useState(loadState);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimed, setIsTimed] = useState(false);

  // Timer for exam simulation
  useEffect(() => {
    if (!isTimed || view !== "quiz") return;
    const interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimed, view]);

  const startQuiz = useCallback((questions, mode, label, timed = false) => {
    setQuizQuestions(questions);
    setCurrentIdx(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers({});
    setQuizMode(mode);
    setQuizLabel(label);
    setStartTime(Date.now());
    setQuestionStart(Date.now());
    setTimerSeconds(0);
    setIsTimed(timed);
    setView("quiz");
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    const q = quizQuestions[currentIdx];
    const elapsed = Math.round((Date.now() - questionStart) / 1000);
    const isCorrect = selected === q.correct;
    setAnswers(prev => ({
      ...prev,
      [q.id]: { selected, correct: isCorrect, time: elapsed },
    }));
    setSubmitted(true);
    // Update persistent state
    setState(prev => {
      const next = {
        ...prev,
        history: {
          ...prev.history,
          [q.id]: {
            lastAnswer: selected,
            correct: isCorrect,
            attempts: (prev.history[q.id]?.attempts || 0) + 1,
            lastAttempt: new Date().toISOString(),
          },
        },
      };
      saveState(next);
      return next;
    });
  }, [selected, quizQuestions, currentIdx, questionStart]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= quizQuestions.length) {
      // Save session
      const correct = Object.values(answers).filter(a => a.correct).length;
      setState(prev => {
        const next = {
          ...prev,
          sessions: [...prev.sessions, {
            date: new Date().toISOString(),
            mode: quizMode,
            label: quizLabel,
            total: quizQuestions.length,
            correct: correct + (selected === quizQuestions[currentIdx]?.correct ? 1 : 0),
            time: Math.round((Date.now() - startTime) / 1000),
          }],
        };
        saveState(next);
        return next;
      });
      setView("results");
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setSubmitted(false);
    setQuestionStart(Date.now());
  }, [currentIdx, quizQuestions, answers, quizMode, quizLabel, startTime, selected]);

  // Question filters for modes
  const getWeakSpotQuestions = useCallback(() => {
    const tsScores = {};
    Object.entries(state.history).forEach(([qId, data]) => {
      const q = ALL_QUESTIONS.find(q => q.id === qId);
      if (!q) return;
      const ts = q.taskStatement;
      if (!tsScores[ts]) tsScores[ts] = { correct: 0, total: 0 };
      tsScores[ts].total++;
      if (data.correct) tsScores[ts].correct++;
    });
    // Sort task statements by accuracy (lowest first)
    const weakTs = Object.entries(tsScores)
      .map(([ts, s]) => ({ ts, pct: s.total ? s.correct / s.total : 0 }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 10)
      .map(s => s.ts);
    if (weakTs.length === 0) return shuffle(ALL_QUESTIONS).slice(0, 30);
    const weak = ALL_QUESTIONS.filter(q => weakTs.includes(q.taskStatement));
    return shuffle(weak).slice(0, 40);
  }, [state.history]);

  const getMistakeQuestions = useCallback(() => {
    const wrong = Object.entries(state.history)
      .filter(([_, d]) => !d.correct)
      .map(([id]) => ALL_QUESTIONS.find(q => q.id === id))
      .filter(Boolean);
    return shuffle(wrong).slice(0, 50);
  }, [state.history]);

  // Current question
  const q = quizQuestions[currentIdx];
  const totalCorrect = Object.values(answers).filter(a => a.correct).length;

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ fontFamily: font, background: "#0c0c10", color: "#c8c8d0", minHeight: "100vh", maxWidth: 640, margin: "0 auto" }}>
      {/* ── HOME ── */}
      {view === "home" && (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#c0392b", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
            CCA-F Quiz Engine
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f0f0f0", margin: "0 0 4px" }}>
            500 Architect-Level Questions
          </h1>
          <p style={{ fontSize: 11, color: "#555", margin: "0 0 20px" }}>
            Elite difficulty &middot; Enterprise scenarios &middot; Detailed explanations
          </p>

          {/* Stats summary */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { label: "Questions", value: ALL_QUESTIONS.length },
              { label: "Attempted", value: Object.keys(state.history).length },
              { label: "Sessions", value: state.sessions.length },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "#0f0f16", border: "1px solid #1a1a26", borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quiz Modes */}
          <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Quiz Modes</div>

          {/* Full Exam Simulation */}
          <ModeCard
            title="Full Exam Simulation"
            desc="60 weighted random questions, timed — matches real CCA-F exam format"
            color="#c0392b"
            onClick={() => startQuiz(weightedSample(ALL_QUESTIONS, 60), "exam", "Full Exam Simulation", true)}
          />

          {/* Domain Drill */}
          <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px" }}>Domain Drill</div>
          {DOMAINS.map(d => (
            <ModeCard
              key={d.id}
              title={`${d.id}: ${d.name}`}
              desc={`${d.count} questions · ${d.weight} of exam`}
              color={d.color}
              onClick={() => startQuiz(shuffle(ALL_QUESTIONS.filter(q => q.domain === d.id)).slice(0, 40), "domain", `${d.id} Domain Drill`)}
            />
          ))}

          {/* Task Statement Drill */}
          <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px" }}>Task Statement Drill</div>
          {Object.entries(TASK_STATEMENTS).map(([ts, name]) => {
            const count = ALL_QUESTIONS.filter(q => q.taskStatement === ts).length;
            if (count === 0) return null;
            const dom = ts.split(".")[0];
            return (
              <ModeCard
                key={ts}
                title={`${ts}: ${name}`}
                desc={`${count} questions`}
                color={domainColor(`D${dom}`)}
                small
                onClick={() => startQuiz(shuffle(ALL_QUESTIONS.filter(q => q.taskStatement === ts)), "task", `Task ${ts}: ${name}`)}
              />
            );
          })}

          {/* Scenario Mode */}
          <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px" }}>Scenario Mode</div>
          {[
            { s: 1, name: "Customer Support Agent", domains: "D1, D2, D5" },
            { s: 2, name: "Code Gen with Claude Code", domains: "D3, D5" },
            { s: 3, name: "Multi-Agent Research", domains: "D1, D2, D5" },
            { s: 4, name: "Developer Productivity", domains: "D2, D3, D1" },
            { s: 5, name: "CI/CD Pipeline", domains: "D3, D4" },
            { s: 6, name: "Structured Data Extraction", domains: "D4, D5" },
          ].map(sc => {
            const count = ALL_QUESTIONS.filter(q => q.scenario === sc.s).length;
            return (
              <ModeCard
                key={sc.s}
                title={`Scenario ${sc.s}: ${sc.name}`}
                desc={`${count} questions · ${sc.domains}`}
                color="#95a5a6"
                small
                onClick={() => startQuiz(shuffle(ALL_QUESTIONS.filter(q => q.scenario === sc.s)).slice(0, 30), "scenario", `Scenario ${sc.s}: ${sc.name}`)}
              />
            );
          })}

          {/* Adaptive Modes */}
          <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px" }}>Adaptive</div>
          <ModeCard
            title="Weak Spots"
            desc="Targets your lowest-scoring task statements"
            color="#f39c12"
            onClick={() => { const qs = getWeakSpotQuestions(); startQuiz(qs, "weak", "Weak Spots"); }}
          />
          <ModeCard
            title="Review Mistakes"
            desc={`${Object.values(state.history).filter(h => !h.correct).length} previously incorrect questions`}
            color="#e74c3c"
            onClick={() => { const qs = getMistakeQuestions(); if (qs.length > 0) startQuiz(qs, "mistakes", "Review Mistakes"); }}
          />

          {/* Reset */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              onClick={() => { if (confirm("Reset all quiz progress? This cannot be undone.")) { setState({ history: {}, sessions: [] }); saveState({ history: {}, sessions: [] }); } }}
              style={{ fontSize: 10, color: "#555", background: "none", border: "1px solid #1a1a26", borderRadius: 4, padding: "6px 14px", cursor: "pointer", fontFamily: font }}
            >
              Reset Progress
            </button>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {view === "quiz" && q && (
        <div style={{ padding: "16px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button onClick={() => setView("home")} style={{ fontSize: 10, color: "#4a4a58", background: "none", border: "none", cursor: "pointer", fontFamily: font, padding: 0 }}>
              ← Back
            </button>
            <div style={{ fontSize: 10, color: "#4a4a58" }}>
              {quizLabel}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 3, background: "#1a1a26", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((currentIdx + 1) / quizQuestions.length) * 100}%`, background: "#c0392b", transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 10, color: "#4a4a58", whiteSpace: "nowrap" }}>
              {currentIdx + 1}/{quizQuestions.length}
            </span>
            {isTimed && (
              <span style={{ fontSize: 10, color: "#f39c12", whiteSpace: "nowrap" }}>
                {formatTime(timerSeconds)}
              </span>
            )}
          </div>

          {/* Score */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, fontSize: 10, color: "#4a4a58" }}>
            <span>Score: {totalCorrect}/{Object.keys(answers).length}</span>
            <span style={{ color: domainColor(q.domain) }}>{q.domain}: {q.topic}</span>
            <span>Task {q.taskStatement}</span>
          </div>

          {/* Importance */}
          <div style={{
            padding: "10px 12px",
            background: "#f39c120a",
            border: "1px solid #f39c1218",
            borderRadius: 6,
            marginBottom: 12,
            fontSize: 10,
            color: "#f39c12",
            lineHeight: 1.6,
          }}>
            <span style={{ fontWeight: 700, fontSize: 9, letterSpacing: 0.5 }}>WHY THIS MATTERS: </span>
            {q.importance}
          </div>

          {/* Question */}
          <div style={{
            fontSize: 13,
            color: "#e0e0e8",
            lineHeight: 1.7,
            marginBottom: 16,
            fontWeight: 500,
          }}>
            {q.question}
          </div>

          {/* Choices */}
          {["A", "B", "C", "D"].map(letter => {
            const isSelected = selected === letter;
            const isCorrect = submitted && letter === q.correct;
            const isWrong = submitted && isSelected && letter !== q.correct;
            let borderColor = "#1a1a26";
            let bg = "#0f0f16";
            if (isSelected && !submitted) { borderColor = "#c0392b"; bg = "#c0392b0a"; }
            if (isCorrect) { borderColor = "#27ae60"; bg = "#27ae600a"; }
            if (isWrong) { borderColor = "#e74c3c"; bg = "#e74c3c0a"; }

            return (
              <div key={letter}>
                <button
                  onClick={() => !submitted && setSelected(letter)}
                  disabled={submitted}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: bg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 6,
                    cursor: submitted ? "default" : "pointer",
                    textAlign: "left",
                    fontFamily: font,
                    color: isCorrect ? "#27ae60" : isWrong ? "#e74c3c" : "#c8c8d0",
                    marginBottom: 6,
                    fontSize: 11,
                    lineHeight: 1.6,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <span style={{
                    fontWeight: 700,
                    color: isCorrect ? "#27ae60" : isWrong ? "#e74c3c" : "#c0392b",
                    flexShrink: 0,
                  }}>
                    {letter})
                  </span>
                  <span>{q.choices[letter]}</span>
                </button>

                {/* Explanation (shown after submit) */}
                {submitted && (
                  <div style={{
                    marginLeft: 24,
                    marginBottom: 8,
                    padding: "8px 12px",
                    background: letter === q.correct ? "#27ae600a" : "#e74c3c0a",
                    borderLeft: `3px solid ${letter === q.correct ? "#27ae60" : "#e74c3c"}`,
                    borderRadius: "0 4px 4px 0",
                    fontSize: 10,
                    color: letter === q.correct ? "#27ae60" : "#7a7a8a",
                    lineHeight: 1.6,
                  }}>
                    {q.explanations[letter]}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit / Next */}
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                style={{
                  padding: "10px 24px",
                  background: selected ? "#c0392b" : "#1a1a26",
                  color: selected ? "#fff" : "#4a4a58",
                  border: "none",
                  borderRadius: 6,
                  cursor: selected ? "pointer" : "default",
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: "10px 24px",
                  background: "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {currentIdx + 1 >= quizQuestions.length ? "View Results" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {view === "results" && (
        <ResultsView
          answers={answers}
          questions={quizQuestions}
          mode={quizMode}
          label={quizLabel}
          totalTime={Math.round((Date.now() - startTime) / 1000)}
          onHome={() => setView("home")}
          state={state}
        />
      )}
    </div>
  );
}

/* ─── ModeCard ─── */
function ModeCard({ title, desc, color, onClick, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: small ? "8px 12px" : "12px 14px",
        background: "#0f0f16",
        border: `1px solid ${color}22`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: font,
        color: "#e0e0e8",
        marginBottom: 4,
      }}
    >
      <div style={{ fontSize: small ? 11 : 13, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 10, color: "#4a4a58", marginTop: 2 }}>{desc}</div>
    </button>
  );
}

/* ─── ResultsView ─── */
function ResultsView({ answers, questions, mode, label, totalTime, onHome, state }) {
  const total = questions.length;
  const correct = Object.values(answers).filter(a => a.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const avgTime = total ? Math.round(Object.values(answers).reduce((s, a) => s + (a.time || 0), 0) / total) : 0;

  // Per-domain breakdown
  const byDomain = {};
  questions.forEach(q => {
    if (!byDomain[q.domain]) byDomain[q.domain] = { correct: 0, total: 0 };
    byDomain[q.domain].total++;
    if (answers[q.id]?.correct) byDomain[q.domain].correct++;
  });

  // Per task statement
  const byTs = {};
  questions.forEach(q => {
    if (!byTs[q.taskStatement]) byTs[q.taskStatement] = { correct: 0, total: 0 };
    byTs[q.taskStatement].total++;
    if (answers[q.id]?.correct) byTs[q.taskStatement].correct++;
  });

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#c0392b", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
        Results
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0", margin: "0 0 4px" }}>{label}</h2>

      {/* Score card */}
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 16,
        marginBottom: 20,
      }}>
        <div style={{ flex: 1, background: pct >= 72 ? "#27ae600a" : "#e74c3c0a", border: `1px solid ${pct >= 72 ? "#27ae6022" : "#e74c3c22"}`, borderRadius: 6, padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: pct >= 72 ? "#27ae60" : "#e74c3c" }}>{pct}%</div>
          <div style={{ fontSize: 10, color: "#4a4a58" }}>{correct}/{total} correct</div>
          <div style={{ fontSize: 9, color: pct >= 72 ? "#27ae60" : "#e74c3c", marginTop: 4 }}>
            {pct >= 90 ? "EXCEPTIONAL" : pct >= 80 ? "STRONG" : pct >= 72 ? "PASSING" : "BELOW PASSING"}
          </div>
        </div>
        <div style={{ flex: 1, background: "#0f0f16", border: "1px solid #1a1a26", borderRadius: 6, padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#f0f0f0" }}>{formatTime(totalTime)}</div>
          <div style={{ fontSize: 10, color: "#4a4a58" }}>Total time</div>
          <div style={{ fontSize: 9, color: "#4a4a58", marginTop: 4 }}>{avgTime}s avg per question</div>
        </div>
      </div>

      {/* Domain breakdown */}
      <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
        Per Domain
      </div>
      {DOMAINS.map(d => {
        const data = byDomain[d.id];
        if (!data) return null;
        const dp = Math.round((data.correct / data.total) * 100);
        return (
          <div key={d.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "#0f0f16",
            border: "1px solid #1a1a26",
            borderLeft: `3px solid ${d.color}`,
            borderRadius: 4,
            marginBottom: 4,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: d.color, width: 24 }}>{d.id}</span>
            <div style={{ flex: 1, height: 4, background: "#1a1a26", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${dp}%`, background: d.color }} />
            </div>
            <span style={{ fontSize: 10, color: "#c8c8d0", width: 60, textAlign: "right" }}>
              {data.correct}/{data.total} ({dp}%)
            </span>
          </div>
        );
      })}

      {/* Task statement breakdown */}
      <div style={{ fontSize: 9, color: "#4a4a58", letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px" }}>
        Per Task Statement
      </div>
      {Object.entries(byTs).sort((a, b) => {
        const pctA = a[1].total ? a[1].correct / a[1].total : 0;
        const pctB = b[1].total ? b[1].correct / b[1].total : 0;
        return pctA - pctB; // worst first
      }).map(([ts, data]) => {
        const tsPct = Math.round((data.correct / data.total) * 100);
        const dom = `D${ts.split(".")[0]}`;
        return (
          <div key={ts} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            fontSize: 10,
            color: tsPct < 60 ? "#e74c3c" : tsPct < 80 ? "#f39c12" : "#7a7a8a",
          }}>
            <span style={{ width: 28, color: domainColor(dom), fontWeight: 600 }}>{ts}</span>
            <span style={{ flex: 1, color: "#5a5a68" }}>{TASK_STATEMENTS[ts]}</span>
            <span style={{ fontWeight: 600 }}>{tsPct}%</span>
          </div>
        );
      })}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button
          onClick={onHome}
          style={{
            flex: 1,
            padding: "10px",
            background: "#0f0f16",
            border: "1px solid #1a1a26",
            borderRadius: 6,
            color: "#c8c8d0",
            fontFamily: font,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          ← Home
        </button>
      </div>
    </div>
  );
}
