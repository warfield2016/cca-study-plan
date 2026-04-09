import { useState, useEffect, useCallback } from "react";
import { d1Questions } from "./data/d1-agentic-architecture";
import { d2Questions } from "./data/d2-tool-design-mcp";
import { d3Questions } from "./data/d3-claude-code-config";
import { d4Questions } from "./data/d4-prompt-engineering";
import { d5Questions } from "./data/d5-context-reliability";
import { saveUserProgress } from "./firebase.js";

const ALL_QUESTIONS = [...d1Questions, ...d2Questions, ...d3Questions, ...d4Questions, ...d5Questions];

const QUIZ_STORAGE_KEY = "cca-quiz-progress";
function loadQuizState() {
  try { return JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY)) || { history: {}, sessions: [] }; }
  catch { return { history: {}, sessions: [] }; }
}
function saveQuizState(s) { localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(s)); }

const DOMAINS = [
  { id: "D1", name: "Agentic Architecture", weight: "27%", color: "#c0392b", count: 0 },
  { id: "D2", name: "Tool Design & MCP", weight: "18%", color: "#d35400", count: 0 },
  { id: "D3", name: "Config & Workflows", weight: "20%", color: "#27ae60", count: 0 },
  { id: "D4", name: "Prompt Eng & Output", weight: "20%", color: "#2980b9", count: 0 },
  { id: "D5", name: "Context & Reliability", weight: "15%", color: "#8e44ad", count: 0 },
];
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
    result.push(...(byDomain[d] || []).slice(0, count));
  });
  while (result.length < n) {
    const remaining = questions.filter(q => !result.includes(q));
    if (remaining.length === 0) break;
    result.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }
  return shuffle(result.slice(0, n));
}

const domainColor = (d) => DOMAINS.find(dom => dom.id === d)?.color || "#555";

/* ─── QuizEngine Component ─── */
export default function QuizEngine({ userEmail }) {
  const [view, setView] = useState("home");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizMode, setQuizMode] = useState("");
  const [quizLabel, setQuizLabel] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [questionStart, setQuestionStart] = useState(null);
  const [state, setState] = useState(loadQuizState);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimed, setIsTimed] = useState(false);

  useEffect(() => {
    if (!isTimed || view !== "quiz") return;
    const interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimed, view]);

  const syncToFirebase = useCallback((nextState) => {
    if (userEmail) {
      saveUserProgress(userEmail, {
        quizHistory: nextState.history,
        quizSessions: nextState.sessions,
      });
    }
  }, [userEmail]);

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
    setAnswers(prev => ({ ...prev, [q.id]: { selected, correct: isCorrect, time: elapsed } }));
    setSubmitted(true);
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
      saveQuizState(next);
      syncToFirebase(next);
      return next;
    });
  }, [selected, quizQuestions, currentIdx, questionStart, syncToFirebase]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= quizQuestions.length) {
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
        saveQuizState(next);
        syncToFirebase(next);
        return next;
      });
      setView("results");
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setSubmitted(false);
    setQuestionStart(Date.now());
  }, [currentIdx, quizQuestions, answers, quizMode, quizLabel, startTime, selected, syncToFirebase]);

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
    const weakTs = Object.entries(tsScores)
      .map(([ts, s]) => ({ ts, pct: s.total ? s.correct / s.total : 0 }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 10)
      .map(s => s.ts);
    if (weakTs.length === 0) return shuffle(ALL_QUESTIONS).slice(0, 30);
    return shuffle(ALL_QUESTIONS.filter(q => weakTs.includes(q.taskStatement))).slice(0, 40);
  }, [state.history]);

  const getMistakeQuestions = useCallback(() => {
    const wrong = Object.entries(state.history)
      .filter(([_, d]) => !d.correct)
      .map(([id]) => ALL_QUESTIONS.find(q => q.id === id))
      .filter(Boolean);
    return shuffle(wrong).slice(0, 50);
  }, [state.history]);

  const q = quizQuestions[currentIdx];
  const totalCorrect = Object.values(answers).filter(a => a.correct).length;
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ─── HOME VIEW ─── */
  if (view === "home") {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            500 Architect-Level Questions
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-faint)", margin: "0 0 20px" }}>
          Enterprise scenarios &middot; Detailed explanations &middot; Weighted by exam domain
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Questions", value: ALL_QUESTIONS.length },
            { label: "Attempted", value: Object.keys(state.history).length },
            { label: "Sessions", value: state.sessions.length },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: 8, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <SectionLabel>Full Exam</SectionLabel>
        <ModeCard title="Full Exam Simulation" desc="60 weighted random questions, timed — matches real exam format" color="#c0392b"
          onClick={() => startQuiz(weightedSample(ALL_QUESTIONS, 60), "exam", "Full Exam Simulation", true)} />

        <SectionLabel>Domain Drill</SectionLabel>
        {DOMAINS.map(d => (
          <ModeCard key={d.id} title={`${d.id}: ${d.name}`} desc={`${d.count} questions · ${d.weight} of exam`} color={d.color}
            onClick={() => startQuiz(shuffle(ALL_QUESTIONS.filter(q => q.domain === d.id)).slice(0, 40), "domain", `${d.id} Domain Drill`)} />
        ))}

        <SectionLabel>Task Statement Drill</SectionLabel>
        {Object.entries(TASK_STATEMENTS).map(([ts, name]) => {
          const count = ALL_QUESTIONS.filter(q => q.taskStatement === ts).length;
          if (count === 0) return null;
          return (
            <ModeCard key={ts} title={`${ts}: ${name}`} desc={`${count} questions`} color={domainColor(`D${ts.split(".")[0]}`)} small
              onClick={() => startQuiz(shuffle(ALL_QUESTIONS.filter(q => q.taskStatement === ts)), "task", `Task ${ts}: ${name}`)} />
          );
        })}

        <SectionLabel>Scenario Mode</SectionLabel>
        {[
          { s: 1, name: "Customer Support Agent", domains: "D1, D2, D5" },
          { s: 2, name: "Code Gen with Tooling", domains: "D3, D5" },
          { s: 3, name: "Multi-Agent Research", domains: "D1, D2, D5" },
          { s: 4, name: "Developer Productivity", domains: "D2, D3, D1" },
          { s: 5, name: "CI/CD Pipeline", domains: "D3, D4" },
          { s: 6, name: "Structured Data Extraction", domains: "D4, D5" },
        ].map(sc => {
          const count = ALL_QUESTIONS.filter(q => q.scenario === sc.s).length;
          return (
            <ModeCard key={sc.s} title={`Scenario ${sc.s}: ${sc.name}`} desc={`${count} questions · ${sc.domains}`} color="#95a5a6" small
              onClick={() => startQuiz(shuffle(ALL_QUESTIONS.filter(q => q.scenario === sc.s)).slice(0, 30), "scenario", `Scenario ${sc.s}: ${sc.name}`)} />
          );
        })}

        <SectionLabel>Adaptive</SectionLabel>
        <ModeCard title="Weak Spots" desc="Targets your lowest-scoring task statements" color="#f39c12"
          onClick={() => startQuiz(getWeakSpotQuestions(), "weak", "Weak Spots")} />
        <ModeCard title="Review Mistakes" desc={`${Object.values(state.history).filter(h => !h.correct).length} previously incorrect questions`} color="#e74c3c"
          onClick={() => { const qs = getMistakeQuestions(); if (qs.length > 0) startQuiz(qs, "mistakes", "Review Mistakes"); }} />

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button
            onClick={() => { if (confirm("Reset all quiz progress? This cannot be undone.")) { setState({ history: {}, sessions: [] }); saveQuizState({ history: {}, sessions: [] }); } }}
            style={{ fontSize: 12, color: "var(--text-dim)", background: "none", border: "1px solid var(--border-soft)", borderRadius: 4, padding: "8px 18px", cursor: "pointer", fontFamily: "inherit" }}
          >Reset Progress</button>
        </div>
      </div>
    );
  }

  /* ─── QUIZ VIEW ─── */
  if (view === "quiz" && q) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <button onClick={() => setView("home")} style={{ fontSize: 12, color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
            ← Back
          </button>
          <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{quizLabel}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 4, background: "var(--border-soft)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentIdx + 1) / quizQuestions.length) * 100}%`, background: "#c0392b", transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap" }}>{currentIdx + 1}/{quizQuestions.length}</span>
          {isTimed && <span style={{ fontSize: 12, color: "#f39c12", whiteSpace: "nowrap" }}>{formatTime(timerSeconds)}</span>}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, fontSize: 12, color: "var(--text-faint)" }}>
          <span>Score: {totalCorrect}/{Object.keys(answers).length}</span>
          <span style={{ color: domainColor(q.domain) }}>{q.domain}: {q.topic}</span>
          <span>Task {q.taskStatement}</span>
        </div>

        <div style={{ padding: "12px 16px", background: "#f39c120a", border: "1px solid #f39c1218", borderRadius: 8, marginBottom: 14, fontSize: 12, color: "#f39c12", lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 0.5 }}>WHY THIS MATTERS: </span>
          {q.importance}
        </div>

        <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, marginBottom: 18, fontWeight: 500 }}>
          {q.question}
        </div>

        {["A", "B", "C", "D"].map(letter => {
          const isSelected = selected === letter;
          const isCorrect = submitted && letter === q.correct;
          const isWrong = submitted && isSelected && letter !== q.correct;
          let borderColor = "var(--border-soft)";
          let bg = "var(--bg-panel)";
          if (isSelected && !submitted) { borderColor = "#c0392b"; bg = "#c0392b0a"; }
          if (isCorrect) { borderColor = "#27ae60"; bg = "#27ae600a"; }
          if (isWrong) { borderColor = "#e74c3c"; bg = "#e74c3c0a"; }
          return (
            <div key={letter}>
              <button onClick={() => !submitted && setSelected(letter)} disabled={submitted}
                style={{
                  width: "100%", padding: "14px 18px", background: bg, border: `1px solid ${borderColor}`,
                  borderRadius: 8, cursor: submitted ? "default" : "pointer", textAlign: "left",
                  fontFamily: "inherit", color: isCorrect ? "#27ae60" : isWrong ? "#e74c3c" : "var(--text-body)",
                  marginBottom: 8, fontSize: 13, lineHeight: 1.7, display: "flex", gap: 12,
                }}>
                <span style={{ fontWeight: 700, color: isCorrect ? "#27ae60" : isWrong ? "#e74c3c" : "#c0392b", flexShrink: 0 }}>{letter})</span>
                <span>{q.choices[letter]}</span>
              </button>
              {submitted && (
                <div style={{
                  marginLeft: 28, marginBottom: 10, padding: "10px 14px",
                  background: letter === q.correct ? "#27ae600a" : "#e74c3c0a",
                  borderLeft: `3px solid ${letter === q.correct ? "#27ae60" : "#e74c3c"}`,
                  borderRadius: "0 6px 6px 0", fontSize: 12, color: letter === q.correct ? "#27ae60" : "var(--text-muted)", lineHeight: 1.7,
                }}>{q.explanations[letter]}</div>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          {!submitted ? (
            <button onClick={handleSubmit} disabled={selected === null}
              style={{ padding: "12px 28px", background: selected ? "#c0392b" : "var(--border-soft)", color: selected ? "#fff" : "var(--text-faint)", border: "none", borderRadius: 8, cursor: selected ? "pointer" : "default", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNext}
              style={{ padding: "12px 28px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>
              {currentIdx + 1 >= quizQuestions.length ? "View Results" : "Next Question"}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ─── RESULTS VIEW ─── */
  if (view === "results") {
    const total = quizQuestions.length;
    const correct = Object.values(answers).filter(a => a.correct).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const avgTime = total ? Math.round(Object.values(answers).reduce((s, a) => s + (a.time || 0), 0) / total) : 0;

    const byDomain = {};
    quizQuestions.forEach(q => {
      if (!byDomain[q.domain]) byDomain[q.domain] = { correct: 0, total: 0 };
      byDomain[q.domain].total++;
      if (answers[q.id]?.correct) byDomain[q.domain].correct++;
    });

    const byTs = {};
    quizQuestions.forEach(q => {
      if (!byTs[q.taskStatement]) byTs[q.taskStatement] = { correct: 0, total: 0 };
      byTs[q.taskStatement].total++;
      if (answers[q.id]?.correct) byTs[q.taskStatement].correct++;
    });

    return (
      <div>
        <div style={{ fontSize: 11, letterSpacing: 2.5, color: "#c0392b", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Results</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>{quizLabel}</h2>

        <div style={{ display: "flex", gap: 10, marginTop: 18, marginBottom: 24 }}>
          <div style={{ flex: 1, background: pct >= 72 ? "#27ae600a" : "#e74c3c0a", border: `1px solid ${pct >= 72 ? "#27ae6022" : "#e74c3c22"}`, borderRadius: 8, padding: "18px", textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: pct >= 72 ? "#27ae60" : "#e74c3c" }}>{pct}%</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{correct}/{total} correct</div>
            <div style={{ fontSize: 11, color: pct >= 72 ? "#27ae60" : "#e74c3c", marginTop: 4 }}>
              {pct >= 90 ? "EXCEPTIONAL" : pct >= 80 ? "STRONG" : pct >= 72 ? "PASSING" : "BELOW PASSING"}
            </div>
          </div>
          <div style={{ flex: 1, background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: 8, padding: "18px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>{formatTime(totalTime)}</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Total time</div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{avgTime}s avg per question</div>
          </div>
        </div>

        <SectionLabel>Per Domain</SectionLabel>
        {DOMAINS.map(d => {
          const data = byDomain[d.id];
          if (!data) return null;
          const dp = Math.round((data.correct / data.total) * 100);
          return (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderLeft: `3px solid ${d.color}`, borderRadius: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: d.color, width: 28 }}>{d.id}</span>
              <div style={{ flex: 1, height: 5, background: "var(--border-soft)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${dp}%`, background: d.color }} />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-body)", width: 80, textAlign: "right" }}>{data.correct}/{data.total} ({dp}%)</span>
            </div>
          );
        })}

        <SectionLabel>Per Task Statement</SectionLabel>
        {Object.entries(byTs).sort((a, b) => {
          const pctA = a[1].total ? a[1].correct / a[1].total : 0;
          const pctB = b[1].total ? b[1].correct / b[1].total : 0;
          return pctA - pctB;
        }).map(([ts, data]) => {
          const tsPct = Math.round((data.correct / data.total) * 100);
          return (
            <div key={ts} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", fontSize: 12, color: tsPct < 60 ? "#e74c3c" : tsPct < 80 ? "#f39c12" : "var(--text-muted)" }}>
              <span style={{ width: 32, color: domainColor(`D${ts.split(".")[0]}`), fontWeight: 600 }}>{ts}</span>
              <span style={{ flex: 1, color: "var(--text-faint)" }}>{TASK_STATEMENTS[ts]}</span>
              <span style={{ fontWeight: 600 }}>{tsPct}%</span>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={() => setView("home")}
            style={{ flex: 1, padding: "12px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text-body)", fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>
            Back to Quiz Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>
      {children}
    </div>
  );
}

function ModeCard({ title, desc, color, onClick, small }) {
  return (
    <button onClick={onClick}
      style={{
        width: "100%", padding: small ? "10px 14px" : "14px 18px",
        background: "var(--bg-panel)", border: `1px solid ${color}22`,
        borderLeft: `3px solid ${color}`, borderRadius: 8, cursor: "pointer",
        textAlign: "left", fontFamily: "inherit", color: "var(--text-primary)", marginBottom: 6,
      }}>
      <div style={{ fontSize: small ? 13 : 15, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 3 }}>{desc}</div>
    </button>
  );
}
