// D1: Agentic Architecture & Orchestration — 135 questions
export const d1Questions = [
  {
    id: "d1-001",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 1,
    importance: "In a Fortune 500 insurance company's claims processing pipeline, incorrectly terminating the agentic loop means incomplete claims—costing millions in delayed payouts and regulatory penalties.",
    question: "Your customer support agent processes multi-step insurance claims by calling tools to verify policy details, assess damage estimates, and issue payouts. During testing, you discover the agent sometimes stops after retrieving policy details without proceeding to damage assessment. Logs show the agent produces a text summary after the first tool call. What is the most likely cause?",
    choices: {
      A: "The loop implementation checks for the presence of assistant text content as a completion indicator, causing premature termination when Claude generates intermediate reasoning alongside tool calls",
      B: "The agent's system prompt lacks explicit instructions to complete all claim steps before stopping",
      C: "The max_iterations parameter is set too low, capping the agent at one tool call per claim",
      D: "The tool definitions for damage assessment are missing, so Claude cannot discover the next step"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Checking for assistant text content as a completion indicator is a documented anti-pattern. Claude often generates intermediate reasoning text alongside tool_use blocks. The correct approach is to check stop_reason—if it is 'tool_use', the loop should continue regardless of any text content present.",
      B: "INCORRECT: While prompt improvements can help, the root cause is a control flow bug. If the loop correctly checks stop_reason='tool_use' and continues, the agent would proceed to the next tool call. Prompt instructions cannot fix a broken loop termination check.",
      C: "INCORRECT: Arbitrary iteration caps as the primary stopping mechanism is itself an anti-pattern. Moreover, the symptom described—stopping after generating text—points specifically to text-content-based termination, not an iteration cap.",
      D: "INCORRECT: If tool definitions were missing, Claude would report it cannot perform damage assessment in its text response. The issue is the loop stopping prematurely, not the agent being unable to reason about the next step."
    }
  },
  {
    id: "d1-002",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 3,
    importance: "A biotech research firm's multi-agent literature review system must reliably complete searches across 15+ databases—premature loop termination means missed drug interaction data that could affect patient safety.",
    question: "You are building a research agent that searches multiple scientific databases, synthesizes findings, and generates a cited report. The agentic loop must handle an unpredictable number of tool calls depending on query complexity. Which loop termination strategy is correct?",
    choices: {
      A: "Parse the assistant's response text for phrases like 'I have completed the research' or 'Here is the final report' to detect when the agent considers itself done",
      B: "Set max_iterations to 20 and terminate after that count regardless of stop_reason, as a safety measure against infinite loops",
      C: "Continue the loop when stop_reason is 'tool_use' and terminate when stop_reason is 'end_turn', with a high safety cap that logs warnings rather than silently truncating",
      D: "Count the number of unique tools called and terminate once all registered tools have been invoked at least once"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Parsing natural language signals to determine loop termination is a documented anti-pattern. Claude's text phrasing is non-deterministic—the same completion intent may be expressed differently across runs, leading to unreliable termination.",
      B: "INCORRECT: Using an arbitrary iteration cap as the PRIMARY stopping mechanism is an anti-pattern. Safety caps are appropriate as a secondary safeguard, but the primary mechanism must be stop_reason-based. A hard cap of 20 could silently truncate complex queries.",
      C: "CORRECT: The canonical agentic loop checks stop_reason='tool_use' to continue and 'end_turn' to stop. A generous safety cap that logs warnings (rather than silently terminating) serves as a secondary safeguard while keeping stop_reason as the primary control.",
      D: "INCORRECT: Not all tools need to be called for every query. Tool invocation is model-driven based on the specific task. A query might require the same tool multiple times or skip certain tools entirely. Counting unique tool calls imposes a rigid, incorrect termination condition."
    }
  },
  {
    id: "d1-003",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 1,
    importance: "An e-commerce platform's return processing agent handles 50,000 returns daily—a broken loop means stuck returns, chargebacks, and customer churn worth $2M monthly.",
    question: "Your support agent's agentic loop processes customer returns by calling verify_customer, lookup_order, and process_return sequentially. After each API response from Claude, what must your loop implementation do before sending the next request?",
    choices: {
      A: "Append the tool results to the conversation history so Claude can reason about the outcomes when deciding the next action",
      B: "Clear the conversation history and send only the tool result to reduce token usage and keep context focused",
      C: "Send the tool result as a new system prompt update to override Claude's previous instructions",
      D: "Store the tool result in a separate database and reference it by ID in the next message to minimize payload size"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Tool results must be appended to the conversation history so the model can reason about accumulated information when deciding the next action. This is fundamental to the agentic loop—Claude needs the full context of what has happened to make informed decisions about what to do next.",
      B: "INCORRECT: Clearing conversation history removes all context about previous steps. Claude would not know the customer was already verified or which order was looked up, leading to redundant tool calls or incorrect decisions.",
      C: "INCORRECT: Tool results are not system prompt updates. They belong in the conversation history as tool_result messages. Overwriting the system prompt with tool results would destroy the agent's core instructions.",
      D: "INCORRECT: Claude cannot access external databases by reference ID. The model needs the actual content in the conversation to reason about it. Referencing external storage would leave Claude without the information it needs to decide the next step."
    }
  },
  {
    id: "d1-004",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 5,
    importance: "In a CI/CD pipeline serving 200 developers, an agent that runs unnecessary tool calls on every PR adds 15 minutes of compute per PR—costing $40K monthly in wasted cloud resources.",
    question: "Your CI/CD agent reviews pull requests by calling tools to fetch diffs, run linters, execute tests, and post comments. A junior developer proposes adding logic that checks whether Claude's response contains any text content and, if so, treats that as the final answer without executing any tool calls present in the same response. What is wrong with this approach?",
    choices: {
      A: "Claude never produces text content alongside tool_use blocks, so the check would never trigger",
      B: "Claude frequently produces explanatory text alongside tool_use blocks in the same response; the check would cause the loop to skip legitimate tool calls that the model determined were necessary",
      C: "The approach is correct but should be combined with a regex pattern to distinguish summary text from intermediate reasoning",
      D: "Text content in a response always indicates an error condition that should trigger a retry rather than termination"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Claude regularly produces text content alongside tool_use blocks—for example, explaining its reasoning before calling a tool. This is normal behavior, not an exception.",
      B: "CORRECT: Claude often generates explanatory or reasoning text in the same response that contains tool_use blocks. The presence of text content does not indicate completion. The only reliable signal is stop_reason. If stop_reason is 'tool_use', the tool calls must be executed regardless of accompanying text.",
      C: "INCORRECT: No regex pattern can reliably distinguish between summary text and intermediate reasoning. Natural language classification of Claude's output is fundamentally unreliable for control flow decisions. The stop_reason field exists precisely to avoid this problem.",
      D: "INCORRECT: Text content alongside tool calls is normal, expected behavior—not an error condition. Treating it as an error would cause unnecessary retries on perfectly valid responses."
    }
  },
  {
    id: "d1-005",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 6,
    importance: "A healthcare data extraction pipeline processes 10,000 patient intake forms daily—model-driven decisions let the agent adapt to wildly varying form layouts without manual reconfiguration.",
    question: "Your structured data extraction agent processes diverse document formats. Some documents require OCR preprocessing, others need table extraction, and some need both. How should the agent determine which tools to invoke for each document?",
    choices: {
      A: "Implement a pre-configured decision tree that routes documents by file extension to specific tool sequences",
      B: "Let Claude inspect each document and reason about which tools to call based on the content it observes, using model-driven decision-making",
      C: "Always call every available tool in a fixed sequence and discard irrelevant results to ensure completeness",
      D: "Use a separate classifier model to categorize documents before passing them to the agent with prescribed tool sequences"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: File extensions do not reliably indicate content structure. A .pdf might contain tables, images, or pure text. Pre-configured decision trees based on surface metadata miss the nuance that model-driven reasoning captures.",
      B: "CORRECT: Model-driven decision-making is a core principle of agentic architecture. Claude reasons about which tool to call next based on the actual content and context, adapting dynamically to each document's unique characteristics rather than following rigid prescribed sequences.",
      C: "INCORRECT: Calling every tool on every document wastes compute, increases latency, and may produce conflicting or irrelevant results. The agent should reason about which tools are actually needed for each specific document.",
      D: "INCORRECT: Adding a separate classifier creates unnecessary complexity and reintroduces rigid categorization. Claude's ability to reason about tool selection based on document content eliminates the need for a separate classification step."
    }
  },
  {
    id: "d1-006",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 1,
    importance: "A telecom's billing dispute agent handles $15M in monthly disputes—if tool results are lost between iterations, agents re-query APIs redundantly, increasing costs and response latency by 300%.",
    question: "Your billing dispute agent calls get_account, get_charges, and apply_credit in sequence. After executing get_charges, you notice the agent calls get_account again on the next iteration despite having already retrieved account data. What architectural flaw most likely causes this?",
    choices: {
      A: "The conversation history is not being accumulated between iterations—each iteration sends only the latest tool result without previous context, causing the agent to lose track of earlier findings",
      B: "Claude's context window is too small to hold both the account data and charges data simultaneously",
      C: "The get_account tool definition is too broadly scoped, causing Claude to re-invoke it as a general-purpose lookup",
      D: "The system prompt does not explicitly tell the agent to avoid calling the same tool twice"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: The agentic loop must append each tool result to the accumulated conversation history. If only the latest result is sent (without prior context), Claude has no memory of having already retrieved account data and will re-request it. This is a fundamental implementation error in history management.",
      B: "INCORRECT: Claude's context windows (100K-200K tokens) are more than sufficient to hold account and charge data. Context window limits are not the issue for typical structured API responses.",
      C: "INCORRECT: Even a broadly scoped tool would not be re-invoked if Claude can see in its conversation history that the data was already retrieved. The redundant call points to missing history, not tool scope.",
      D: "INCORRECT: Claude naturally avoids redundant tool calls when it can see prior results in context. The need for explicit 'don't repeat' instructions indicates a history management problem, not a prompting gap."
    }
  },
  {
    id: "d1-007",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 4,
    importance: "Developer productivity tools that impose rigid tool sequences on Claude waste the model's reasoning capabilities and produce worse outcomes on novel codebases that don't fit the expected patterns.",
    question: "A developer is configuring a codebase exploration agent. They want the agent to always call list_files, then read_file on each result, then search_code, in that exact order. What is the architectural concern with this approach?",
    choices: {
      A: "This pre-configured tool sequence prevents Claude from using model-driven decision-making to adapt its exploration strategy based on what it discovers at each step",
      B: "Claude cannot call the same tool type more than once in a session, so reading multiple files would fail",
      C: "The sequence is correct but should be encoded in the system prompt rather than in application logic",
      D: "List_files should always be called last to confirm all relevant files were examined"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Enforcing a rigid tool sequence is a pre-configured decision tree, which undermines Claude's ability to reason about the optimal next action. For example, Claude might discover from the first file that a search_code call would be more efficient than reading every file sequentially. Model-driven decision-making produces better results.",
      B: "INCORRECT: Claude can call the same tool multiple times. There is no such limitation on tool invocation frequency.",
      C: "INCORRECT: Whether encoded in the prompt or application logic, rigid tool sequences still prevent adaptive reasoning. The issue is the rigid sequence itself, not where it is specified.",
      D: "INCORRECT: There is no universal rule about tool ordering. The optimal sequence depends on the specific task and what the agent discovers along the way."
    }
  },
  {
    id: "d1-008",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A pharmaceutical company's drug interaction research system uses 5 specialist subagents—if they communicate directly rather than through the coordinator, contradictory findings go undetected, risking patient safety.",
    question: "You are designing a multi-agent research system where a coordinator delegates to search, analysis, and synthesis subagents. The analysis subagent discovers a critical finding that the synthesis subagent needs. How should this information flow?",
    choices: {
      A: "The analysis subagent writes to a shared memory store that the synthesis subagent reads from directly, bypassing the coordinator for efficiency",
      B: "The analysis subagent returns its finding to the coordinator, which then includes it in the prompt when invoking the synthesis subagent",
      C: "The analysis subagent directly invokes the synthesis subagent via a Task tool call, passing the finding in the prompt",
      D: "The coordinator sets up a message queue between the analysis and synthesis subagents so they can communicate asynchronously"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Shared memory stores bypass the coordinator, eliminating observability and controlled information flow. The coordinator cannot track what data was shared, validate it, or handle errors in the transfer.",
      B: "CORRECT: In hub-and-spoke architecture, ALL inter-subagent communication routes through the coordinator. The analysis subagent returns findings to the coordinator, which then explicitly includes them in the synthesis subagent's prompt. This provides observability, consistent error handling, and controlled information flow.",
      C: "INCORRECT: Subagents should not directly invoke other subagents. This creates uncontrolled lateral communication that the coordinator cannot observe or manage, violating the hub-and-spoke pattern.",
      D: "INCORRECT: Asynchronous message queues between subagents bypass the coordinator and create complex, hard-to-debug communication patterns. The coordinator must mediate all information exchange."
    }
  },
  {
    id: "d1-009",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A consulting firm's research system must cover all aspects of a client's competitive landscape—overly narrow task decomposition means missing entire market segments worth millions in advisory fees.",
    question: "Your multi-agent research system's coordinator decomposes 'Analyze the competitive landscape of quantum computing startups' into 5 extremely narrow subagent tasks: one per specific company. After aggregation, the final report lacks analysis of market trends, funding patterns, and technology comparisons. What architectural flaw does this illustrate?",
    choices: {
      A: "The subagents should have been given broader tool access to discover additional research dimensions on their own",
      B: "The coordinator performed overly narrow task decomposition, failing to identify cross-cutting research dimensions that don't map to individual companies",
      C: "The synthesis subagent failed to infer the missing dimensions from the per-company data it received",
      D: "The system needs more subagents—one per additional dimension—to reach complete coverage"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Broader tool access for subagents would not fix a decomposition problem at the coordinator level. Subagents operate on the tasks they are given; they cannot correct for missing task dimensions.",
      B: "CORRECT: Overly narrow task decomposition by the coordinator is a documented risk. By decomposing only by company, the coordinator missed cross-cutting dimensions like market trends, funding patterns, and technology comparisons. The coordinator must analyze query requirements holistically to ensure complete coverage.",
      C: "INCORRECT: The synthesis subagent works with the data it receives. Expecting it to infer entirely new research dimensions from per-company data is unreasonable—the gap exists at the decomposition stage, not synthesis.",
      D: "INCORRECT: Simply adding more narrowly-scoped subagents does not fix the underlying decomposition flaw. The coordinator must identify the right dimensions (companies AND cross-cutting themes), not just add more of the same narrow type."
    }
  },
  {
    id: "d1-010",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 3,
    importance: "In a legal discovery system processing 500K documents, always invoking all subagents when only one is needed wastes $8K per unnecessary full-pipeline run.",
    question: "Your multi-agent system has subagents for legal search, financial analysis, technical review, and synthesis. A user asks a simple factual question: 'What was Company X's revenue in Q3 2024?' The coordinator routes this through all four subagents. What should the coordinator do differently?",
    choices: {
      A: "The coordinator should dynamically select which subagents to invoke based on query complexity, routing simple factual queries only to the relevant specialist",
      B: "The coordinator should always invoke all subagents to ensure comprehensive coverage regardless of query type",
      C: "The coordinator should maintain a routing table that maps keywords to specific subagent combinations",
      D: "The coordinator should ask the user which subagents to invoke before proceeding"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: The coordinator should analyze query requirements and dynamically select which subagents to invoke rather than always routing through the full pipeline. A simple factual question about revenue needs only the financial analysis subagent, not legal search or technical review.",
      B: "INCORRECT: Always invoking all subagents wastes compute and time. The coordinator's role includes intelligent routing—determining which subagents are actually needed based on the query.",
      C: "INCORRECT: Keyword-based routing is a pre-configured decision tree that cannot capture the nuance of query complexity. The coordinator should use model-driven reasoning to assess what subagents are needed.",
      D: "INCORRECT: Requiring users to select subagents defeats the purpose of having an intelligent coordinator. Users should not need to understand the system's internal architecture."
    }
  },
  {
    id: "d1-011",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A think tank's policy research system produces reports cited by lawmakers—duplicate findings presented as independent corroboration create a false sense of consensus that could mislead policy decisions.",
    question: "Your coordinator decomposes a research query into subagent tasks, but two subagents end up searching overlapping domains, producing near-duplicate findings that inflate the final report's apparent evidence base. How should you address this?",
    choices: {
      A: "Add a deduplication subagent that runs after synthesis to remove duplicate findings",
      B: "Have the coordinator partition research scope across subagents to minimize duplication, giving each a distinct domain or angle",
      C: "Let the synthesis subagent handle deduplication naturally through its summarization process",
      D: "Give all subagents access to the same search tool and let them coordinate their searches through shared state"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Post-hoc deduplication addresses the symptom but not the cause. It also cannot distinguish genuine independent corroboration from actual duplication. The fix belongs at the decomposition stage.",
      B: "CORRECT: The coordinator should partition research scope across subagents to minimize duplication. Each subagent should receive a distinct domain, angle, or source set so their work is complementary rather than overlapping. This is a coordinator-level design responsibility.",
      C: "INCORRECT: The synthesis subagent may not reliably detect that two similar findings came from overlapping searches versus independent sources. Relying on synthesis for deduplication is unreliable.",
      D: "INCORRECT: Shared state between subagents violates the hub-and-spoke pattern where all communication routes through the coordinator. Subagents should have isolated context."
    }
  },
  {
    id: "d1-012",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 1,
    importance: "A banking customer service platform handles 100K interactions daily—inconsistent error handling across subagents means some failures silently corrupt customer records while others are properly caught.",
    question: "In your customer support multi-agent system, a subagent responsible for order lookups encounters a database timeout. What is the correct error handling pattern in a hub-and-spoke architecture?",
    choices: {
      A: "The subagent retries independently with exponential backoff, only reporting to the coordinator after exhausting all retries",
      B: "The subagent returns the error to the coordinator, which decides whether to retry, invoke an alternative subagent, or escalate to a human agent",
      C: "The coordinator preemptively monitors database health and avoids invoking the subagent if the database is slow",
      D: "The subagent falls back to a cached response and continues processing without notifying the coordinator"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While retries at the subagent level are sometimes appropriate, the coordinator should be informed of errors to make architectural decisions about fallback strategies. The coordinator is responsible for error handling and recovery orchestration.",
      B: "CORRECT: In hub-and-spoke architecture, the coordinator manages error handling and information routing. When a subagent encounters an error, it reports back to the coordinator, which then decides the recovery strategy—retry, alternative path, or escalation. This ensures consistent, observable error handling.",
      C: "INCORRECT: Preemptive infrastructure monitoring is an operational concern, not an agent architecture pattern. The coordinator manages task-level decisions, not infrastructure health checks.",
      D: "INCORRECT: Silently using cached data without coordinator awareness could lead to decisions based on stale information. The coordinator must be informed to maintain observability and make appropriate decisions."
    }
  },
  {
    id: "d1-013",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A government intelligence analysis system needs iterative refinement—a single-pass synthesis that misses key geopolitical connections could lead to flawed national security assessments.",
    question: "Your multi-agent research system produces a synthesis report, but the coordinator detects gaps—specifically, the report lacks coverage of recent regulatory changes. What is the correct iterative refinement pattern?",
    choices: {
      A: "Append the gap description to the original query and restart the entire pipeline from scratch with all subagents",
      B: "The coordinator re-delegates to the search and analysis subagents with targeted queries addressing the specific gaps, then re-invokes synthesis until coverage is sufficient",
      C: "Ask the synthesis subagent to fill in the gaps by extrapolating from the existing findings",
      D: "Return the incomplete report to the user with a note about the coverage gap and let them decide whether to re-run"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Restarting the entire pipeline wastes the work already completed. Iterative refinement should target specific gaps, not redo everything.",
      B: "CORRECT: The coordinator implements iterative refinement loops by evaluating synthesis output for gaps, re-delegating to search and analysis subagents with targeted queries addressing those specific gaps, and re-invoking synthesis until coverage is sufficient. This is efficient and focused.",
      C: "INCORRECT: Extrapolating from existing findings introduces speculation rather than actual research. Gaps must be filled with new information from targeted searches, not fabricated from incomplete data.",
      D: "INCORRECT: Surfacing gaps to users without attempting automated resolution defeats the purpose of an autonomous research system. The coordinator should first attempt iterative refinement."
    }
  },
  {
    id: "d1-014",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Context",
    difficulty: "hard",
    scenario: 3,
    importance: "In a clinical trial analysis system, a subagent that assumes it has the coordinator's drug interaction data makes unsupported claims—potentially causing incorrect safety conclusions that affect FDA submissions.",
    question: "Your coordinator agent analyzes a drug's clinical trial data and identifies three safety signals. It then spawns a synthesis subagent to write the final report. The synthesis subagent's report makes no mention of the safety signals. What is the most likely cause?",
    choices: {
      A: "The synthesis subagent's system prompt is too generic and does not emphasize safety signals",
      B: "The safety signal data exceeded the synthesis subagent's context window",
      C: "The coordinator did not include the safety signal findings in the synthesis subagent's prompt—subagents do not automatically inherit the coordinator's conversation history",
      D: "The synthesis subagent's allowedTools list does not include tools for accessing safety data"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Even a generic prompt would incorporate safety signals if they were present in the subagent's context. The issue is that the data was never provided, not that the prompt failed to emphasize it.",
      B: "INCORRECT: Three safety signals would represent a small amount of text relative to context window limits. Context window overflow is extremely unlikely here.",
      C: "CORRECT: Subagents operate with isolated context—they do NOT automatically inherit the coordinator's conversation history. The coordinator must explicitly include the safety signal findings in the synthesis subagent's prompt. This is the #1 multi-agent architecture gotcha.",
      D: "INCORRECT: The synthesis subagent does not need tools to access safety data—the data should be passed directly in its prompt by the coordinator. Tool access is not the issue when the coordinator has already discovered the findings."
    }
  },
  {
    id: "d1-015",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Spawning",
    difficulty: "hard",
    scenario: 3,
    importance: "A market intelligence firm needs real-time competitive analysis across 8 sectors simultaneously—sequential subagent spawning adds 40 minutes of latency per report, making insights stale before delivery.",
    question: "Your coordinator needs to simultaneously research 4 different market sectors. How should it spawn the research subagents to maximize throughput?",
    choices: {
      A: "Emit all four Task tool calls in a single coordinator response so they can be executed in parallel",
      B: "Spawn each subagent in a separate coordinator turn, waiting for each to complete before starting the next",
      C: "Create a single subagent with all four sectors in its prompt to avoid coordination overhead",
      D: "Spawn the first two subagents in parallel, wait for results, then spawn the remaining two"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Spawning parallel subagents requires emitting multiple Task tool calls in a SINGLE coordinator response rather than across separate turns. This allows the runtime to execute all four research tasks concurrently, maximizing throughput.",
      B: "INCORRECT: Sequential spawning across separate turns means each subagent must complete before the next starts, serializing work that could run in parallel. This dramatically increases total latency.",
      C: "INCORRECT: A single subagent handling all four sectors loses the benefits of parallelism and may suffer from attention dilution across too many concurrent research objectives.",
      D: "INCORRECT: Batching into two pairs still serializes unnecessarily. If all four tasks are independent, they should all be emitted in a single response for maximum parallelism."
    }
  },
  {
    id: "d1-016",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Configuration",
    difficulty: "medium",
    scenario: 3,
    importance: "In a compliance research system, a subagent with unrestricted tool access could modify production databases while investigating a policy question—a security violation that could trigger regulatory action.",
    question: "When defining an AgentDefinition for a research subagent, what must be explicitly configured to ensure the subagent can only access appropriate tools?",
    choices: {
      A: "The subagent's system prompt should list which tools it is allowed to use, relying on Claude's instruction-following",
      B: "The allowedTools field in the AgentDefinition must specify exactly which tools the subagent can access",
      C: "The coordinator should filter out unauthorized tool calls from the subagent's responses before execution",
      D: "Tool access is inherited from the coordinator, so no additional configuration is needed"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based tool restrictions are not enforceable. Claude might still attempt to call tools not mentioned in the prompt, and the runtime would execute them if they are available. Programmatic restrictions are required.",
      B: "CORRECT: The AgentDefinition's allowedTools field programmatically restricts which tools the subagent can access. This is a hard enforcement mechanism—tools not in the list cannot be called regardless of what the subagent attempts.",
      C: "INCORRECT: Post-hoc filtering of tool calls is fragile and creates a race condition between the subagent's expectations and actual execution. Tool restrictions should be enforced at the configuration level, not through response filtering.",
      D: "INCORRECT: Tool access is NOT automatically inherited from the coordinator. Each subagent's tool access must be explicitly configured. Assuming inheritance is a common misconception that leads to either over-permissioned or under-permissioned subagents."
    }
  },
  {
    id: "d1-017",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Context Passing",
    difficulty: "hard",
    scenario: 3,
    importance: "A legal research system must maintain source attribution across agent boundaries—if citation metadata is lost when passing context to synthesis, the final brief cannot withstand judicial scrutiny.",
    question: "Your search subagent returns 15 findings with source URLs, document names, and page numbers. The coordinator must pass these to the synthesis subagent. What is the best practice for context passing?",
    choices: {
      A: "Pass only a summary of the findings to the synthesis subagent to keep the prompt concise, omitting source metadata",
      B: "Store findings in a shared database and give the synthesis subagent a tool to query it",
      C: "Use structured data formats that separate content from metadata (source URLs, document names, page numbers) to preserve attribution when passing context",
      D: "Pass the raw conversation history from the search subagent directly to the synthesis subagent"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Omitting source metadata makes it impossible for the synthesis subagent to generate properly cited output. Attribution preservation is critical for research systems.",
      B: "INCORRECT: Shared databases between subagents bypass the coordinator and violate the hub-and-spoke pattern. The coordinator should pass findings directly in the prompt.",
      C: "CORRECT: When passing context between agents, structured data formats that separate content from metadata (source URLs, document names, page numbers) preserve attribution. This allows the synthesis subagent to generate properly cited output.",
      D: "INCORRECT: Raw conversation history from one subagent includes irrelevant internal reasoning, tool call details, and formatting that would confuse the synthesis subagent. Context should be curated and structured by the coordinator."
    }
  },
  {
    id: "d1-018",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Context",
    difficulty: "medium",
    scenario: 1,
    importance: "A customer support system where subagents silently lack context produces conflicting responses—telling a customer they're eligible for a refund in one step and then denying it in the next, destroying trust.",
    question: "Your coordinator delegates a billing investigation to a subagent. The coordinator has already verified the customer's identity and retrieved their account details. What must the coordinator do when invoking the billing subagent?",
    choices: {
      A: "The billing subagent automatically has access to the coordinator's verified customer data through shared session state",
      B: "Include the verified customer ID and relevant account details directly in the billing subagent's prompt",
      C: "Give the billing subagent the verify_customer tool so it can re-verify independently",
      D: "Set an environment variable with the customer ID that the billing subagent can read"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Subagents do NOT share session state with the coordinator. They operate with isolated context and do not automatically inherit any data from the parent. This is a critical misconception.",
      B: "CORRECT: Subagent context must be explicitly provided in the prompt. The coordinator must include the verified customer ID and relevant account details directly in the billing subagent's prompt since subagents do not inherit parent context.",
      C: "INCORRECT: Re-verifying the customer is redundant and wastes time if the coordinator has already done so. The verified information should be passed directly, avoiding duplicate work.",
      D: "INCORRECT: Environment variables are not part of the subagent context passing mechanism. Context is passed through the prompt, not through environmental side channels."
    }
  },
  {
    id: "d1-019",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Spawning",
    difficulty: "hard",
    scenario: 3,
    importance: "A regulatory compliance system's coordinator cannot spawn subagents because allowedTools misconfiguration silently degrades it to a single-agent system—missing critical compliance checks across jurisdictions.",
    question: "You configure a coordinator agent to manage three specialist subagents, but at runtime, the coordinator never spawns any subagents—it attempts to do all the work itself. What is the most likely configuration error?",
    choices: {
      A: "The coordinator's system prompt does not describe the available subagents in enough detail",
      B: "The coordinator's allowedTools does not include 'Task', which is required for spawning subagents",
      C: "The subagent definitions are missing from the runtime configuration file",
      D: "The coordinator's temperature is set too low, making it too conservative to delegate"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While good system prompts help, the inability to spawn subagents at all points to a capability restriction, not a prompting issue. If the coordinator cannot call the Task tool, no amount of prompting will enable delegation.",
      B: "CORRECT: The Task tool is the mechanism for spawning subagents. The coordinator's allowedTools must include 'Task' for it to invoke subagents. Without this, the coordinator literally cannot spawn subagents and will attempt to handle everything directly.",
      C: "INCORRECT: Missing subagent definitions would cause errors when attempting to spawn, not silent fallback to single-agent behavior. The symptom described—never attempting to spawn—points to the coordinator lacking the ability to call Task.",
      D: "INCORRECT: Temperature affects response variability, not tool calling capability. A low temperature would not prevent the coordinator from calling available tools."
    }
  },
  {
    id: "d1-020",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "A financial services firm processes $50M in daily refunds—in 12% of cases where identity verification is skipped, refunds go to the wrong account, creating fraud liability and regulatory exposure.",
    question: "Production data shows that in 8% of cases, your customer support agent skips verify_customer and calls process_refund directly using only the customer's stated name. What change most effectively addresses this reliability issue?",
    choices: {
      A: "Add a programmatic prerequisite that blocks process_refund calls until verify_customer has returned a verified customer ID",
      B: "Add few-shot examples to the system prompt showing the correct verify-then-refund sequence",
      C: "Implement a routing classifier that detects refund intents and forces the verification step",
      D: "Add bold, capitalized instructions to the system prompt: 'ALWAYS verify customer identity before processing any refund'"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: When deterministic compliance is required (identity verification before financial operations), prompt instructions alone have a non-zero failure rate. Programmatic prerequisites that block downstream tool calls until prerequisite steps complete provide guaranteed enforcement.",
      B: "INCORRECT: Few-shot examples improve compliance rates but cannot guarantee 100% adherence. For financial operations where even a single skip creates fraud risk, probabilistic improvement is insufficient.",
      C: "INCORRECT: A routing classifier adds complexity without providing deterministic guarantees. The classifier itself could fail, and it does not address the core issue of enforcing the prerequisite programmatically.",
      D: "INCORRECT: Prompt emphasis (bold, caps, repetition) improves compliance but cannot eliminate the non-zero failure rate. For financial operations, any failure rate is unacceptable—programmatic enforcement is required."
    }
  },
  {
    id: "d1-021",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "medium",
    scenario: 1,
    importance: "A healthcare support system that relies solely on prompts for HIPAA verification before disclosing medical records faces $1.5M fines per violation—prompt-based compliance is a ticking time bomb.",
    question: "Your agent must verify a patient's identity before disclosing any medical records. Which enforcement approach provides the strongest compliance guarantee?",
    choices: {
      A: "Include detailed instructions in the system prompt explaining the verification requirement with examples of correct behavior",
      B: "Implement a programmatic hook that intercepts any medical record tool calls and blocks them unless identity verification has been completed",
      C: "Train the agent on examples of correct verification sequences using few-shot prompting",
      D: "Add a post-processing step that reviews conversation logs and flags any instances where verification was skipped"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt instructions have a non-zero failure rate. For HIPAA compliance where violations carry severe penalties, probabilistic compliance from prompt-based guidance is inadequate.",
      B: "CORRECT: Programmatic hooks that intercept tool calls and block them until prerequisites are met provide deterministic guarantees. This is the only approach that ensures 100% compliance for regulated operations.",
      C: "INCORRECT: Few-shot examples improve but do not guarantee compliance. The model may still deviate in edge cases, which is unacceptable for medical records under HIPAA.",
      D: "INCORRECT: Post-processing catches violations after they occur—the medical records have already been disclosed. Prevention through programmatic enforcement is required, not after-the-fact detection."
    }
  },
  {
    id: "d1-022",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Handoff Protocols",
    difficulty: "hard",
    scenario: 1,
    importance: "When a telecom support agent escalates without structured context, human agents spend 8 minutes re-gathering information the AI already collected—destroying the efficiency gains that justified the AI investment.",
    question: "Your customer support agent determines it cannot resolve a complex technical issue and needs to escalate to a human specialist. What should the structured handoff include?",
    choices: {
      A: "The full conversation transcript so the human agent has complete context",
      B: "A structured summary including customer details, root cause analysis, steps already taken, and recommended next actions",
      C: "Only the customer's original complaint text and account number to let the human agent investigate independently",
      D: "A link to the conversation log and the customer's sentiment score"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Full conversation transcripts are lengthy, unstructured, and force the human agent to parse through irrelevant exchanges. A structured summary is more efficient and actionable.",
      B: "CORRECT: Structured handoff protocols should include customer details, root cause analysis, steps already taken, and recommended next actions. This gives the human agent everything needed to continue resolution without redundant investigation.",
      C: "INCORRECT: Omitting the agent's investigation findings forces the human to duplicate work. The value of the handoff is preserving the diagnostic progress already made.",
      D: "INCORRECT: A link to logs requires the human to search through them, and sentiment score alone does not convey the technical details needed for resolution. Structured summaries with actionable content are required."
    }
  },
  {
    id: "d1-023",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Multi-Step Workflows",
    difficulty: "hard",
    scenario: 1,
    importance: "A retail support center handles 15,000 multi-issue tickets daily—sequential handling of bundled complaints doubles resolution time and halves customer satisfaction scores.",
    question: "A customer contacts support with three issues: a billing overcharge, a damaged product, and a shipping delay. How should the agent decompose and handle this multi-concern request?",
    choices: {
      A: "Address each issue sequentially in the order mentioned, fully resolving one before moving to the next",
      B: "Decompose into distinct items, investigate each in parallel using shared context, then synthesize a unified resolution",
      C: "Prioritize the most financially impactful issue and ask the customer to call back for the other two",
      D: "Create separate support tickets for each issue and route them to different specialist agents"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Sequential handling is slower and misses cross-issue dependencies. For example, the billing overcharge might be related to the damaged product return. Parallel investigation with shared context captures these relationships.",
      B: "CORRECT: Multi-concern customer requests should be decomposed into distinct items, then investigated in parallel using shared context before synthesizing a unified resolution. This is faster and captures cross-issue dependencies.",
      C: "INCORRECT: Asking customers to call back for remaining issues destroys the customer experience and violates first-contact resolution targets. All issues should be addressed in a single interaction.",
      D: "INCORRECT: Creating separate tickets fragments the customer's experience and prevents the agent from identifying relationships between the issues. A unified approach is preferred."
    }
  },
  {
    id: "d1-024",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "medium",
    scenario: 1,
    importance: "An airline's rebooking agent that processes upgrades before verifying loyalty status gives premium seats to non-eligible passengers—costing $2M annually in lost premium revenue.",
    question: "Your airline support agent must follow this workflow: verify loyalty status, check flight availability, then process rebooking. Occasionally the agent skips loyalty verification for repeat callers, assuming their status from previous interactions. What is the correct fix?",
    choices: {
      A: "Implement a programmatic gate that requires a fresh loyalty verification result before the rebooking tool becomes available",
      B: "Add context about the importance of fresh verification to the system prompt with emphasis that previous interaction data may be stale",
      C: "Cache loyalty status from previous interactions to avoid redundant verification while maintaining accuracy",
      D: "Implement a post-rebooking audit that checks loyalty status and reverses unauthorized upgrades"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: A programmatic gate provides deterministic enforcement—the rebooking tool literally cannot be called until fresh loyalty verification has completed. This eliminates the skip rate entirely, regardless of what the agent 'assumes' from previous context.",
      B: "INCORRECT: Prompt-based reminders about fresh verification improve compliance but cannot guarantee it. The agent may still skip verification in edge cases, especially with repeat callers where it has strong contextual cues.",
      C: "INCORRECT: Caching loyalty status introduces staleness risks—status can change between interactions. Fresh verification is required per-interaction for business accuracy.",
      D: "INCORRECT: Post-hoc audits catch errors after they occur—the unauthorized rebooking has already happened, potentially displacing legitimate premium passengers. Prevention is required."
    }
  },
  {
    id: "d1-025",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 6,
    importance: "A financial data aggregation platform pulls from 12 APIs that return timestamps in 5 different formats—without normalization, the model conflates dates across time zones, producing reports with $500K in misattributed transactions.",
    question: "Your data extraction agent pulls from three MCP tools that return dates in different formats: Unix timestamps, ISO 8601, and 'MM/DD/YYYY' strings. Claude occasionally misinterprets the Unix timestamps as sequential IDs. How do you fix this?",
    choices: {
      A: "Add instructions to the system prompt explaining each tool's date format and how to interpret them correctly",
      B: "Implement a PostToolUse hook that normalizes all date formats to ISO 8601 before the model processes the results",
      C: "Create a wrapper tool that converts dates before returning results to Claude",
      D: "Fine-tune the model on examples of each date format to improve its date parsing accuracy"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based format explanations are probabilistic—Claude may still misinterpret Unix timestamps, especially large ones that resemble IDs. Deterministic normalization is required when business accuracy depends on correct date handling.",
      B: "CORRECT: PostToolUse hooks intercept tool results for transformation BEFORE the model processes them. Normalizing heterogeneous date formats (Unix timestamps, ISO 8601, numeric status codes) from different MCP tools ensures the model always sees consistent, unambiguous data.",
      C: "INCORRECT: Wrapper tools add latency and complexity, require modifying tool integration code, and still rely on Claude to call the wrapper instead of the original. Hooks are the standard interception mechanism for this pattern.",
      D: "INCORRECT: Fine-tuning is not the appropriate solution for data format normalization. It is expensive, not guaranteed to generalize to all edge cases, and hooks provide a simpler deterministic solution."
    }
  },
  {
    id: "d1-026",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 1,
    importance: "A banking agent's compliance team discovered that in 0.3% of interactions, the agent issued refunds exceeding $10,000 without manager approval—hooks turned a regulatory crisis into a zero-violation record.",
    question: "Your customer support agent must never issue refunds exceeding $10,000 without manager approval. The current system relies on prompt instructions, but audit logs show three violations in the past month. How should you enforce this policy?",
    choices: {
      A: "Implement a tool call interception hook that blocks process_refund calls exceeding $10,000 and redirects to a manager approval workflow",
      B: "Add the $10,000 limit as a hard-coded parameter constraint in the process_refund tool definition",
      C: "Strengthen the system prompt with explicit examples of the $10,000 limit and consequences of violation",
      D: "Implement a post-refund audit hook that reverses any refunds exceeding $10,000 that lack manager approval"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Tool call interception hooks that block policy-violating actions and redirect to alternative workflows provide deterministic compliance. The hook inspects the refund amount before execution, blocking violations and routing to manager approval instead.",
      B: "INCORRECT: Hard-coded parameter constraints in tool definitions prevent any refund over $10,000, even legitimate ones with manager approval. The policy requires escalation, not blanket blocking.",
      C: "INCORRECT: The current prompt-based approach already failed three times. Strengthening prompt instructions reduces but cannot eliminate violations. For financial compliance, deterministic hooks are required.",
      D: "INCORRECT: Post-refund reversal means the money has already been processed and must be clawed back—creating customer confusion and processing costs. Prevention via interception is superior to after-the-fact correction."
    }
  },
  {
    id: "d1-027",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "medium",
    scenario: 6,
    importance: "A healthcare data extraction system receives HTTP status codes (200, 404, 500) from APIs—without normalization, Claude interprets '200' as a data value rather than a success indicator, corrupting extracted records.",
    question: "Your data extraction agent integrates with MCP tools that return raw HTTP status codes (200, 404, 500) alongside data payloads. Claude sometimes includes these status codes in the extracted data. What is the best approach?",
    choices: {
      A: "Add a system prompt instruction telling Claude to ignore HTTP status codes in tool responses",
      B: "Implement a PostToolUse hook that strips or normalizes status codes into human-readable status labels before the model processes results",
      C: "Modify each MCP tool to not return status codes in their responses",
      D: "Add a validation step after extraction that removes any numeric values matching common HTTP status codes"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt instructions are probabilistic. Claude may still occasionally include status codes, especially in complex extraction tasks with many numeric values.",
      B: "CORRECT: PostToolUse hooks transform tool results before the model sees them. Converting raw status codes into labels (or stripping them) ensures Claude never has the opportunity to confuse status codes with data values. This provides deterministic data cleaning.",
      C: "INCORRECT: Modifying MCP tools may not be possible (third-party tools) and removes potentially useful error handling information. Hooks handle the transformation without modifying the tools themselves.",
      D: "INCORRECT: Post-extraction filtering by numeric value could accidentally remove legitimate data that happens to match status codes (e.g., a quantity of 200 or 404). The fix belongs at the tool result level, not the extraction output."
    }
  },
  {
    id: "d1-028",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 5,
    importance: "A CI/CD agent that can push directly to production branches bypasses all human review safeguards—one faulty push could trigger a deployment that takes down services for 10,000 users.",
    question: "Your CI/CD agent can call git_push as part of its automated code review workflow. Company policy prohibits pushing directly to main or production branches without a pull request. How should you enforce this?",
    choices: {
      A: "Include branch protection rules in the system prompt and trust Claude to respect them",
      B: "Implement a pre-tool-execution hook that inspects git_push calls, blocks pushes to protected branches, and suggests creating a pull request instead",
      C: "Rely on Git server-side branch protection rules to reject unauthorized pushes",
      D: "Remove git_push from the agent's tool list entirely to prevent any push operations"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based branch protection is probabilistic and has failed in production environments. Policy compliance for deployment operations requires deterministic enforcement.",
      B: "CORRECT: A tool call interception hook inspects outgoing git_push calls, checks the target branch, blocks pushes to protected branches, and redirects to a pull request workflow. This provides deterministic policy enforcement at the agent level.",
      C: "INCORRECT: While server-side protection is good defense-in-depth, it creates a poor user experience—the agent attempts the push, it fails, and then the agent must recover. Pre-execution interception prevents the attempt entirely and provides a better workflow.",
      D: "INCORRECT: Removing git_push entirely prevents the agent from pushing to ANY branch, including feature branches where pushes are legitimate. The hook approach allows pushes to permitted branches while blocking protected ones."
    }
  },
  {
    id: "d1-029",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "medium",
    scenario: 6,
    importance: "A real estate data extraction pipeline processes property listings from 8 sources—each returns prices in different formats ($1,200,000 vs 1200000 vs '1.2M'). Without normalization, price comparisons are meaningless.",
    question: "Your structured data extraction agent receives price data from multiple tools in inconsistent formats: some return integers in cents, others return formatted strings with currency symbols. You need the model to work with normalized decimal values. When should hooks be preferred over prompt instructions for this normalization?",
    choices: {
      A: "Only when the volume of data exceeds the context window limits",
      B: "When business rules require guaranteed compliance—hooks provide deterministic normalization while prompts have a non-zero failure rate",
      C: "Only when the model consistently fails to follow prompt-based normalization instructions",
      D: "Hooks and prompts are equivalent for data normalization; either approach works"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Data volume is not the deciding factor. Even with small datasets, inconsistent formats can cause errors. The decision is about reliability guarantees, not volume.",
      B: "CORRECT: The distinction between hooks for deterministic guarantees versus prompt instructions for probabilistic compliance is a core concept. When business rules require guaranteed compliance (financial data accuracy), hooks should be used because they transform data programmatically with zero failure rate.",
      C: "INCORRECT: Waiting for observed failures before implementing hooks is reactive. For business-critical data normalization, proactive deterministic enforcement prevents errors from ever reaching production.",
      D: "INCORRECT: Hooks and prompts are fundamentally different in their guarantees. Hooks provide deterministic transformation; prompts provide probabilistic guidance. They are not equivalent for compliance-critical operations."
    }
  },
  {
    id: "d1-030",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 5,
    importance: "A fintech company's code review agent reviewing a 50-file PR as a single pass misses critical cross-file dependency bugs—one missed import chain caused a $2M production outage.",
    question: "Your code review agent needs to review a large pull request touching 40 files across 6 modules. What task decomposition strategy avoids attention dilution while catching cross-file issues?",
    choices: {
      A: "Review all 40 files in a single pass to maintain full context about inter-file dependencies",
      B: "Split into per-file local analysis passes plus a separate cross-file integration pass to catch dependency and interface issues",
      C: "Review files in random order to avoid bias from reading related files together",
      D: "Only review the files with the most lines changed, as they are most likely to contain bugs"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Reviewing 40 files in a single pass causes attention dilution—the model cannot maintain sufficient focus on each file's details while also tracking cross-file relationships. Quality degrades significantly with context size.",
      B: "CORRECT: Splitting large code reviews into per-file local analysis passes plus a separate cross-file integration pass avoids attention dilution. Each local pass can deeply analyze a single file, then the integration pass specifically looks for cross-file issues like broken interfaces, dependency changes, and architectural violations.",
      C: "INCORRECT: Random ordering prevents the reviewer from building understanding of related code. Files should be grouped logically (by module or dependency chain) for local analysis, with cross-file issues caught in the integration pass.",
      D: "INCORRECT: Lines changed does not correlate with bug risk. A single-line change to a critical API interface can be far more impactful than a 500-line file reformatting. All files in the PR should be reviewed."
    }
  },
  {
    id: "d1-031",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "medium",
    scenario: 4,
    importance: "A legacy migration team needs to understand a 2M-line codebase with no documentation—the wrong decomposition strategy means months of wasted exploration or critical subsystems missed entirely.",
    question: "Your agent needs to investigate why a legacy system's performance degrades under load. The codebase has no documentation and 500K lines of code. What is the appropriate task decomposition strategy?",
    choices: {
      A: "Use prompt chaining with a fixed sequence: scan all files, read configuration, analyze database queries, report findings",
      B: "First map the system structure, identify high-impact areas (hot paths, database calls), then create a prioritized investigation plan that adapts based on discoveries",
      C: "Randomly sample 10% of files and analyze them to infer the system's performance characteristics",
      D: "Start with the most recently modified files since performance issues are likely caused by recent changes"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A fixed sequential pipeline cannot adapt to what it discovers. Performance bottlenecks could be in configuration, code, infrastructure, or data—a rigid sequence may spend time on irrelevant areas while missing the actual cause.",
      B: "CORRECT: Open-ended investigation tasks should be decomposed by first mapping structure, identifying high-impact areas, then creating a prioritized plan. This adaptive approach adjusts investigation direction based on intermediate findings, which is essential for exploratory work with unknown problem scope.",
      C: "INCORRECT: Random sampling has no guarantee of hitting the relevant code paths. Performance issues are typically concentrated in specific subsystems, not distributed uniformly across the codebase.",
      D: "INCORRECT: Performance degradation may stem from longstanding architectural issues, not recent changes. Recency bias in file selection could miss the actual root cause entirely."
    }
  },
  {
    id: "d1-032",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 5,
    importance: "A security audit agent needs to review a microservices architecture—using dynamic decomposition for a standard OWASP checklist wastes time, while a fixed checklist for novel attack vectors misses critical vulnerabilities.",
    question: "You are deciding between prompt chaining (fixed sequential steps) and dynamic adaptive decomposition for two different agents: one that performs standardized security audits against OWASP checklists, and one that investigates novel zero-day vulnerability reports. Which pairing is correct?",
    choices: {
      A: "Prompt chaining for both—consistency is paramount in security work",
      B: "Dynamic decomposition for both—flexibility always produces better results",
      C: "Prompt chaining for the standardized OWASP audit; dynamic adaptive decomposition for the novel vulnerability investigation",
      D: "Dynamic decomposition for the OWASP audit to discover new patterns; prompt chaining for the zero-day investigation to ensure thoroughness"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: While consistency matters for standardized audits, novel vulnerability investigation requires adaptive exploration. A fixed pipeline cannot anticipate where a zero-day investigation will lead.",
      B: "INCORRECT: Dynamic decomposition for a standardized checklist adds unnecessary complexity. When the steps are well-known and predictable (OWASP categories), prompt chaining is more efficient and ensures complete coverage.",
      C: "CORRECT: Prompt chaining (fixed sequential) is appropriate when the workflow is predictable and well-defined, like a standardized security checklist. Dynamic adaptive decomposition is appropriate when the investigation path depends on intermediate findings, like tracing a novel zero-day vulnerability.",
      D: "INCORRECT: This reverses the correct pairing. Standardized audits benefit from fixed sequences that ensure checklist completeness. Novel investigations need adaptability because the next step depends on what each step discovers."
    }
  },
  {
    id: "d1-033",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "medium",
    scenario: 5,
    importance: "A code review pipeline that treats every PR the same—applying heavy multi-pass review to trivial formatting changes—wastes 3 hours of compute daily and delays critical reviews.",
    question: "Your code review system handles PRs ranging from single-line typo fixes to 1000-line architectural refactors. How should you select the task decomposition pattern?",
    choices: {
      A: "Always use the most thorough decomposition to ensure no issues are missed regardless of PR size",
      B: "Select decomposition patterns appropriate to the workflow—simple PRs get lightweight single-pass review while complex refactors get multi-pass decomposition with cross-file integration checks",
      C: "Use a fixed medium-complexity decomposition for all PRs as a standardized baseline",
      D: "Let the developer specify which decomposition pattern to use when submitting the PR"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Applying maximum decomposition to trivial changes wastes resources and creates unnecessary latency. The review depth should match the complexity and risk of the change.",
      B: "CORRECT: Selecting task decomposition patterns appropriate to the workflow is a key skill. Simple, low-risk changes warrant lightweight review, while complex architectural changes need thorough multi-pass analysis. Pattern selection should match the task's complexity.",
      C: "INCORRECT: A one-size-fits-all approach either over-reviews simple changes or under-reviews complex ones. Adaptive pattern selection produces better results.",
      D: "INCORRECT: Developers may not accurately assess the complexity of their own changes or may choose lighter review to save time. The system should analyze the PR characteristics and select the appropriate pattern."
    }
  },
  {
    id: "d1-034",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 2,
    importance: "A development team investigating a complex distributed system bug needs to preserve 4 hours of debugging context—losing session state means repeating the entire investigation, costing $5K in developer time.",
    question: "A developer has been investigating a complex bug using Claude Code for 45 minutes across multiple tool calls. They need to stop for a meeting and resume later. What is the best approach to preserve their investigation state?",
    choices: {
      A: "Copy the entire conversation to a text file and paste it back when resuming",
      B: "Use --resume with a descriptive session name to continue the named investigation session later",
      C: "Start a new session and re-run all the previous tool calls to recreate the state",
      D: "Take a screenshot of the final state and use it as context when starting a new session"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Manually copying and pasting conversation text is error-prone, loses tool result formatting, and does not properly restore the session's structured context.",
      B: "CORRECT: Named session resumption using --resume <session-name> preserves the full investigation context including conversation history and allows seamless continuation of the debugging work.",
      C: "INCORRECT: Re-running tool calls is time-consuming and may produce different results if the codebase has changed. Session resumption preserves the exact state without redundant work.",
      D: "INCORRECT: Screenshots lose the structured data from tool results and cannot serve as functional session context. Named session resumption is the proper mechanism."
    }
  },
  {
    id: "d1-035",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 2,
    importance: "A team exploring two competing architectural approaches needs to evaluate both from the same analysis baseline—without session forking, they must redo the baseline analysis twice, doubling investigation time.",
    question: "Your team has spent 30 minutes analyzing a legacy codebase to understand its architecture. Now they want to explore two competing refactoring approaches from this shared baseline. What session management strategy is appropriate?",
    choices: {
      A: "Continue in the current session and analyze both approaches sequentially, noting where they diverge",
      B: "Use fork_session to create two independent branches from the shared analysis baseline, exploring each approach in isolation",
      C: "Start two completely new sessions and re-do the baseline analysis in each before exploring the approaches",
      D: "Save the current session and create one new session for the second approach, keeping the original for the first"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Analyzing both approaches sequentially in one session means the second approach's analysis is contaminated by the first approach's context. Cross-contamination prevents clean evaluation of each approach independently.",
      B: "CORRECT: fork_session creates independent branches from a shared analysis baseline, perfect for exploring divergent approaches. Each fork starts with the same architectural understanding but can explore different directions without contaminating the other.",
      C: "INCORRECT: Re-doing baseline analysis wastes the 30 minutes already invested. Session forking preserves the baseline work and creates branches from it.",
      D: "INCORRECT: Starting a new session for the second approach loses the baseline analysis context. Fork_session is specifically designed for this use case—creating parallel exploration branches from a shared baseline."
    }
  },
  {
    id: "d1-036",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 2,
    importance: "A data engineering team resuming a 3-day migration investigation with stale tool results makes decisions based on schema states that no longer exist—causing migration scripts that corrupt production tables.",
    question: "Your agent has a saved session from yesterday that contains extensive analysis of a database schema. Overnight, a colleague made significant schema changes. You need to continue the investigation. What is the most reliable approach?",
    choices: {
      A: "Resume the session with --resume and let the agent re-analyze the changed schema naturally",
      B: "Resume the session and explicitly inform the agent about the specific schema changes so it can perform targeted re-analysis",
      C: "Start a new session with a structured summary of yesterday's findings and note the schema changes, since stale tool results make resumption unreliable",
      D: "Resume the session and re-run all previous tool calls to refresh the data"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Simply resuming does not alert the agent that its prior analysis is based on stale data. The agent may make decisions based on the old schema without realizing it has changed.",
      B: "INCORRECT: While informing about changes helps, the session still contains stale tool results from the old schema. The agent may reference these stale results in its reasoning, leading to incorrect conclusions. When significant changes have occurred, starting fresh is more reliable.",
      C: "CORRECT: Starting a new session with a structured summary is more reliable than resuming with stale tool results when significant changes have occurred. The summary preserves key findings without the stale data, and noting the changes ensures the agent investigates current state.",
      D: "INCORRECT: Re-running all previous tool calls is wasteful and may not be possible if the investigation involved many steps. A structured summary of findings plus fresh analysis of changed areas is more efficient."
    }
  },
  {
    id: "d1-037",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 4,
    importance: "A developer resuming a debugging session without informing the agent about overnight hotfixes gets diagnosis recommendations for bugs that were already patched—wasting hours chasing fixed issues.",
    question: "You are resuming a Claude Code debugging session from yesterday. Since then, a teammate pushed a hotfix that changed two of the files your session previously analyzed. What should you do when resuming?",
    choices: {
      A: "Resume the session and trust that Claude will detect the file changes automatically",
      B: "Inform the resumed session about the specific file changes so it can perform targeted re-analysis of the affected areas",
      C: "Discard the session entirely and start over from scratch",
      D: "Resume the session and avoid touching the modified files to prevent confusion"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Claude does not automatically detect external file changes between sessions. The resumed session's context reflects the files as they were when last analyzed, not their current state.",
      B: "CORRECT: When resuming sessions, it is important to inform the agent about changes to previously analyzed files. This allows targeted re-analysis of the specific changes rather than redundant re-investigation of the entire codebase.",
      C: "INCORRECT: Starting over discards all the investigation progress from the previous session. Targeted re-analysis of changed files is more efficient than a complete restart.",
      D: "INCORRECT: Avoiding modified files means the debugging analysis is based on outdated code. The hotfix may have fixed the bug being investigated, or introduced new issues that need analysis."
    }
  },
  {
    id: "d1-038",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 6,
    importance: "A supply chain data extraction system processing 5,000 invoices daily with a max_iterations=3 cap silently truncates complex multi-page invoices—causing $1.2M in unreconciled line items quarterly.",
    question: "Your data extraction agent processes invoices that vary from 1 to 50 pages. A developer implements a loop with max_iterations=5 as the only stopping mechanism. What problem does this create?",
    choices: {
      A: "Five iterations is too many, wasting compute on simple invoices",
      B: "The arbitrary iteration cap will silently truncate extraction for complex invoices that need more than 5 tool calls, while simple invoices that need only 1-2 calls will complete normally—creating inconsistent data quality based on document complexity",
      C: "The agent will always use exactly 5 iterations regardless of invoice complexity",
      D: "Five iterations will cause rate limiting issues with the Claude API"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Simple invoices will naturally complete in fewer iterations if stop_reason-based termination is used. The issue is not waste on simple invoices but truncation on complex ones.",
      B: "CORRECT: Using an arbitrary iteration cap as the PRIMARY stopping mechanism is an anti-pattern precisely because it silently truncates work on complex tasks. A 50-page invoice may need 20+ tool calls, but the cap terminates at 5. The primary mechanism must be stop_reason-based, with a generous cap as a safety backup that logs warnings.",
      C: "INCORRECT: With a proper stop_reason check, simple invoices would terminate early. But if max_iterations is the ONLY check, simple invoices still complete at 'end_turn' if that check exists. The core problem is truncation of complex cases.",
      D: "INCORRECT: Five iterations is well within normal API usage patterns and would not trigger rate limiting."
    }
  },
  {
    id: "d1-039",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 3,
    importance: "A market research system that always runs the full 5-agent pipeline for simple lookup queries costs $3 per query versus $0.30 with intelligent routing—a 10x cost overhead on 80% of queries.",
    question: "Your multi-agent research system's coordinator receives a mix of simple factual queries and complex analytical requests. Currently, all queries go through the full pipeline (search, analysis, synthesis). What is the coordinator's role in optimizing this?",
    choices: {
      A: "The coordinator should analyze query requirements and dynamically select which subagents to invoke based on complexity",
      B: "All queries should go through the full pipeline to ensure consistent quality",
      C: "Implement a separate query classifier upstream of the coordinator to handle routing",
      D: "Let users tag their queries as 'simple' or 'complex' to determine routing"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: The coordinator's role includes analyzing query requirements and dynamically selecting which subagents to invoke rather than always routing through the full pipeline. Simple queries may only need one subagent, while complex queries may need the full pipeline.",
      B: "INCORRECT: Running the full pipeline for simple factual queries wastes resources without improving quality. The coordinator should be intelligent about what processing each query actually needs.",
      C: "INCORRECT: Adding a separate classifier introduces unnecessary architectural complexity. The coordinator itself should have the intelligence to assess query complexity and route appropriately.",
      D: "INCORRECT: Users should not need to understand the system's internal architecture or make routing decisions. The coordinator exists precisely to handle this automatically."
    }
  },
  {
    id: "d1-040",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 4,
    importance: "A DevOps team using an adaptive investigation agent to check standard deployment health wastes 20 minutes per deployment when a fixed 5-step checklist would complete in 2 minutes.",
    question: "Your team uses two agents: one for standard deployment health checks (verify services, check logs, validate endpoints) and one for investigating intermittent production failures with unknown root causes. A new architect proposes using dynamic adaptive decomposition for both. What is wrong with this approach?",
    choices: {
      A: "Dynamic decomposition is always slower than fixed pipelines regardless of the task type",
      B: "The standard health check has predictable, well-defined steps that benefit from prompt chaining; dynamic decomposition adds unnecessary overhead for a known workflow while being appropriate for the open-ended investigation",
      C: "Both agents should use prompt chaining since deployment contexts require deterministic execution",
      D: "Dynamic decomposition should only be used when the agent has access to more than 10 tools"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Dynamic decomposition is not always slower—for open-ended investigations, it is more efficient because it avoids exploring irrelevant areas. The issue is applying it to well-defined workflows where it adds overhead without benefit.",
      B: "CORRECT: Prompt chaining (fixed sequential pipelines) is appropriate for predictable workflows with well-defined steps. Dynamic adaptive decomposition is appropriate for open-ended investigations where the next step depends on discoveries. Selecting the right pattern for each workflow is the key skill.",
      C: "INCORRECT: Prompt chaining for the intermittent failure investigation would force a rigid investigation path that cannot adapt to findings. Intermittent production failures often require following unexpected leads.",
      D: "INCORRECT: The number of available tools does not determine the decomposition strategy. The deciding factor is whether the workflow is predictable (prompt chaining) or exploratory (dynamic decomposition)."
    }
  },
  {
    id: "d1-041",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Coordinator Prompts",
    difficulty: "hard",
    scenario: 3,
    importance: "A research coordinator with step-by-step procedural instructions produces formulaic, shallow reports—while one given research goals and quality criteria generates insightful analysis that clients pay $50K more for.",
    question: "You are designing the prompt for a coordinator agent that manages a research pipeline. Which prompt design approach produces the best subagent delegation?",
    choices: {
      A: "Specify exact step-by-step procedures: 'First call search_agent with query X, then call analysis_agent with the results, then call synthesis_agent'",
      B: "Specify research goals and quality criteria: 'Produce a comprehensive analysis covering market size, competitive landscape, and risk factors. Ensure all claims are cited and coverage passes the completeness rubric'",
      C: "Provide minimal instructions and let the coordinator determine everything autonomously based on its general capabilities",
      D: "Include the full code of each subagent's implementation so the coordinator understands their internal workings"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Step-by-step procedural instructions create a rigid pipeline that cannot adapt to different query types or intermediate findings. The coordinator cannot dynamically select subagents or adjust its strategy.",
      B: "CORRECT: Coordinator prompts should specify research goals and quality criteria rather than step-by-step procedural instructions. This allows the coordinator to use model-driven reasoning to determine which subagents to invoke, in what order, and with what parameters based on the specific query.",
      C: "INCORRECT: Minimal instructions leave too much ambiguity. The coordinator needs clear goals, quality criteria, and awareness of available subagents to make effective delegation decisions.",
      D: "INCORRECT: Implementation details of subagents are irrelevant to the coordinator's delegation decisions. The coordinator needs to know what each subagent can do (via descriptions), not how it works internally."
    }
  },
  {
    id: "d1-042",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "An insurance claims agent that applies prompt-based enforcement for required medical documentation checks processes 200 claims monthly without docs—costing $4M in fraudulent payouts annually.",
    question: "Your insurance claims agent must collect three documents (ID, medical report, incident photos) before processing a claim. The agent sometimes processes claims with only 2 of 3 documents when customers express urgency. Which approach correctly addresses this?",
    choices: {
      A: "Add urgency-handling instructions to the prompt that remind the agent to collect all documents even when customers are impatient",
      B: "Implement a programmatic gate on the process_claim tool that validates all three document types have been uploaded before allowing execution",
      C: "Set the model's temperature to 0 to make it more deterministic in following the document collection sequence",
      D: "Add a confidence threshold—if the agent is 90% sure the claim is valid based on 2 documents, allow processing"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The current failures happen precisely when social pressure overrides instructions. Adding more prompt instructions does not eliminate the non-zero failure rate, especially under urgency pressure.",
      B: "CORRECT: A programmatic gate on the process_claim tool that validates prerequisite conditions provides deterministic enforcement. The tool literally cannot execute until all three document types are confirmed uploaded, regardless of conversational pressure.",
      C: "INCORRECT: Temperature=0 makes output more deterministic in wording, but does not guarantee specific behavioral sequences. The agent can still skip documents at low temperature if it reasons the urgency warrants it.",
      D: "INCORRECT: Confidence-based thresholds introduce exactly the kind of probabilistic compliance that programmatic enforcement eliminates. Missing documentation represents regulatory and fraud risk regardless of how confident the model is."
    }
  },
  {
    id: "d1-043",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 4,
    importance: "A developer productivity agent that uses text parsing for loop control fails silently in 15% of non-English codebases where Claude's intermediate reasoning is in a different language than expected.",
    question: "A developer implements an agentic loop that terminates by checking if the assistant's response contains the string 'TASK_COMPLETE'. This works during English-language testing. What fundamental issue does this approach have?",
    choices: {
      A: "The string 'TASK_COMPLETE' is too generic and might appear in code that the agent generates",
      B: "This is a natural language parsing approach to loop termination, which is unreliable because Claude may express completion in unpredictable ways, use different languages, or include the phrase in non-completion contexts",
      C: "The approach is correct but should use a more unique termination string",
      D: "The string check should be case-insensitive to handle variations"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While false positives from code generation are a risk, they are a symptom of the deeper issue—parsing natural language or text content for loop control is fundamentally unreliable.",
      B: "CORRECT: Parsing natural language signals (or any text content) to determine loop termination is a documented anti-pattern. The stop_reason field ('tool_use' vs 'end_turn') is the reliable, deterministic signal for loop control. Text-based checks are fragile across languages, phrasings, and contexts.",
      C: "INCORRECT: No string, no matter how unique, solves the fundamental problem. The agent might forget to include it, include it prematurely, or include it within quoted content. Stop_reason is the correct mechanism.",
      D: "INCORRECT: Case sensitivity is irrelevant to the fundamental flaw. Even a perfect case-insensitive match does not solve the unreliability of text-based loop termination."
    }
  },
  {
    id: "d1-044",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 1,
    importance: "A government benefits processing agent without PII interception hooks leaks social security numbers in 0.5% of tool calls—each incident triggers a mandatory 90-day breach notification process costing $200K.",
    question: "Your customer support agent has access to tools that return customer PII (social security numbers, credit card details). Company policy requires that PII never appears in the model's conversation context. What is the correct architectural approach?",
    choices: {
      A: "Instruct Claude in the system prompt to never reference PII from tool results in its responses",
      B: "Implement PostToolUse hooks that redact or mask PII fields from tool results before they enter the model's context",
      C: "Configure the tools to accept a 'redact_pii' parameter that Claude can set to true",
      D: "Run a post-processing filter on Claude's final responses to remove any PII that appears"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt instructions cannot prevent Claude from having PII in its context—they only attempt to prevent it from appearing in responses. The PII still exists in the conversation history and could leak through reasoning, errors, or edge cases.",
      B: "CORRECT: PostToolUse hooks that redact PII from tool results before they enter the model's context provide the strongest guarantee. The PII never enters Claude's context at all, making it impossible to leak—this is deterministic prevention rather than probabilistic suppression.",
      C: "INCORRECT: Relying on Claude to set a parameter correctly is prompt-based compliance with a non-zero failure rate. The redaction must happen programmatically regardless of what Claude requests.",
      D: "INCORRECT: Post-processing filters catch PII in final responses but the PII already exists in the model's context, where it could influence reasoning. Prevention at the input stage (PostToolUse hooks) is superior to detection at the output stage."
    }
  },
  {
    id: "d1-045",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 2,
    importance: "A platform engineering team debugging a microservices issue needs to explore both a network hypothesis and a database hypothesis from the same diagnostic baseline—without forking, cross-contaminated context leads to incorrect root cause analysis.",
    question: "A developer is debugging a complex issue and wants to test two hypotheses: the bug is in the API layer versus the database layer. They have already gathered baseline diagnostic data. What session management approach best supports this?",
    choices: {
      A: "Test both hypotheses in the same session sequentially, clearly marking where each investigation begins",
      B: "Use fork_session to create two branches from the current baseline, one for each hypothesis",
      C: "Start two fresh sessions and re-gather the baseline data in each before testing hypotheses",
      D: "Complete the API layer investigation, then use --resume to start the database investigation in a new session"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Testing sequentially in the same session contaminates the second hypothesis with findings and reasoning from the first. Each hypothesis should be evaluated from the same clean baseline.",
      B: "CORRECT: fork_session creates independent branches from a shared analysis baseline, ideal for exploring divergent hypotheses. Both forks start with identical baseline data but can independently investigate without contaminating each other.",
      C: "INCORRECT: Re-gathering baseline data wastes time and may produce different results if the system state has changed. Fork preserves the exact baseline.",
      D: "INCORRECT: --resume continues the existing session, which already contains the first investigation's context. This does not provide a clean baseline for the second hypothesis."
    }
  },
  {
    id: "d1-046",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 1,
    importance: "A wealth management platform's portfolio rebalancing agent that mishandles tool errors in the loop can execute partial trades—leaving clients with unbalanced portfolios and regulatory exposure.",
    question: "Your agentic loop encounters a tool execution error when calling check_balance during a customer interaction. The stop_reason on the previous response was 'tool_use'. How should the loop handle this?",
    choices: {
      A: "Terminate the loop immediately since the tool failed, and return the error to the user",
      B: "Return the tool error as a tool_result in the conversation history so Claude can reason about the failure and decide whether to retry, use an alternative approach, or inform the user",
      C: "Silently retry the tool call up to 3 times before reporting failure, without informing the model of previous failures",
      D: "Replace the error with a synthetic success response containing default values to keep the loop progressing"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Terminating immediately prevents Claude from attempting recovery strategies. The model may be able to retry with different parameters, use alternative tools, or gracefully inform the user.",
      B: "CORRECT: Tool errors should be returned as tool_result messages in the conversation history so Claude can reason about the failure. The model-driven approach lets Claude decide the best recovery strategy—retry, alternative tool, or user communication—based on the specific error context.",
      C: "INCORRECT: Silent retries without informing the model prevent Claude from adjusting its strategy. If the error is due to invalid parameters, retrying the same call will produce the same error. Claude needs to see the error to reason about it.",
      D: "INCORRECT: Injecting synthetic success responses with default values corrupts the agent's reasoning with false information, potentially leading to incorrect financial decisions based on fabricated data."
    }
  },
  {
    id: "d1-047",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 3,
    importance: "A patent research agent that cannot call the same search tool with different queries is fundamentally broken—patent prior art searches require iterative refinement across dozens of searches.",
    question: "Your research agent needs to perform 8 different database searches, each with different parameters. A junior engineer asks whether the agent can call the same search tool multiple times in a single session. What is the correct answer?",
    choices: {
      A: "No, each tool can only be called once per session to prevent infinite loops",
      B: "Yes, the agent can call the same tool multiple times with different parameters. The agentic loop continues as long as stop_reason is 'tool_use', regardless of which specific tools have been called before",
      C: "Yes, but only if the tool definition includes a 'reusable: true' flag",
      D: "Yes, but the agent must call a different tool between repeated calls to the same tool"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: There is no such limitation. Tools can be called any number of times. The loop continues based on stop_reason, not on tool call history.",
      B: "CORRECT: The agentic loop has no restrictions on calling the same tool repeatedly. Each iteration checks stop_reason—if it is 'tool_use', the requested tools are executed and results returned, regardless of how many times those tools have been called before.",
      C: "INCORRECT: There is no 'reusable' flag in tool definitions. All tools are inherently callable multiple times.",
      D: "INCORRECT: There is no requirement to interleave different tools. The agent can call the same tool consecutively if that is what the task requires."
    }
  },
  {
    id: "d1-048",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A defense intelligence system where subagents communicate laterally without coordinator oversight creates unauditable information flows—violating security protocols and potentially compromising classified assessments.",
    question: "In your multi-agent research system, the search subagent finds a critical contradiction in the sources. A developer proposes having the search subagent directly notify the analysis subagent about this contradiction to speed up processing. Why is this architecturally incorrect?",
    choices: {
      A: "Subagents cannot communicate at all—they are completely isolated processes with no mechanism for inter-subagent messaging",
      B: "Direct subagent-to-subagent communication bypasses the coordinator, eliminating observability, consistent error handling, and controlled information flow that the hub-and-spoke pattern provides",
      C: "The search subagent does not have permission to invoke other subagents since only the coordinator has the Task tool",
      D: "Direct communication would cause race conditions since subagents run asynchronously"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While subagents do have isolated context, the statement is too absolute. The architectural issue is not about technical impossibility but about the design principle that communication should route through the coordinator.",
      B: "CORRECT: All subagent communication must route through the coordinator for observability, consistent error handling, and controlled information flow. Direct lateral communication between subagents bypasses these critical architectural benefits of the hub-and-spoke pattern.",
      C: "INCORRECT: While technically correct that the coordinator typically holds the Task tool, this is an implementation detail. The fundamental reason is the architectural principle of coordinator-mediated communication, not just tool permissions.",
      D: "INCORRECT: Race conditions are a concern in concurrent systems but are not the primary reason against direct communication. The core issue is loss of observability and controlled information flow."
    }
  },
  {
    id: "d1-049",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 1,
    importance: "A customer support system's coordinator that cannot aggregate conflicting subagent findings presents contradictory information to customers—one subagent says the refund is approved while another says it is denied.",
    question: "Your customer support coordinator delegates billing investigation to one subagent and policy lookup to another. The billing subagent finds the charge is valid, but the policy subagent finds the customer qualifies for a goodwill credit under the loyalty program. What is the coordinator's architectural responsibility?",
    choices: {
      A: "Return both findings to the customer and let them decide which resolution they prefer",
      B: "Aggregate the results, resolve the apparent conflict by synthesizing both findings into a coherent resolution, and present a unified response to the customer",
      C: "Defer to whichever subagent completed first, since it had the most current information",
      D: "Escalate to a human agent whenever subagent findings appear to conflict"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Presenting raw, potentially confusing subagent outputs to the customer creates a poor experience. The coordinator must synthesize findings into a coherent resolution.",
      B: "CORRECT: The coordinator's role includes result aggregation—taking potentially conflicting or complementary findings from subagents and synthesizing them into a coherent outcome. In this case, the charge is valid AND the customer qualifies for a goodwill credit—these are not actually contradictory when properly aggregated.",
      C: "INCORRECT: Completion order has no bearing on accuracy or relevance. The coordinator must evaluate the substance of each finding, not just which arrived first.",
      D: "INCORRECT: The findings are complementary, not truly conflicting. A well-designed coordinator should handle result aggregation for most cases, reserving human escalation for genuinely irreconcilable conflicts."
    }
  },
  {
    id: "d1-050",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Context Passing",
    difficulty: "hard",
    scenario: 3,
    importance: "A financial research system that passes only summaries between agents loses the specific data points (exact revenue figures, precise dates) that analysts need—producing reports that fail due diligence reviews.",
    question: "Your coordinator passes findings from the search subagent to the analysis subagent. The search found 15 articles with specific statistics, quotes, and source URLs. The coordinator summarizes these into 3 bullet points before passing them to analysis. What is the architectural problem?",
    choices: {
      A: "Three bullet points is too few; the coordinator should pass at least 10 bullet points",
      B: "The coordinator's aggressive summarization loses specific data points and source attribution that the analysis subagent needs for rigorous, cited analysis",
      C: "The coordinator should pass the raw search results without any processing to preserve all information",
      D: "The coordinator should let the analysis subagent re-run the searches to get the original data"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The number of bullet points is not the core issue. The problem is that summarization loses specific data and attribution. Even 10 bullet points could lose critical details.",
      B: "CORRECT: When passing context between agents, the coordinator must preserve sufficient detail for the receiving agent to do its work. Aggressive summarization strips the specific statistics, quotes, and source URLs that the analysis subagent needs. Structured formats that separate content from metadata preserve attribution.",
      C: "INCORRECT: Raw search results may contain excessive noise, irrelevant results, and unstructured data. The coordinator should curate and structure the results while preserving essential details and attribution—not pass everything raw.",
      D: "INCORRECT: Having the analysis subagent re-run searches wastes resources and may produce different results. The coordinator should pass the findings directly, preserving the detail needed for analysis."
    }
  },
  {
    id: "d1-051",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Configuration",
    difficulty: "medium",
    scenario: 3,
    importance: "A compliance research system where subagent descriptions are vague leads the coordinator to misroute regulatory queries to the general search agent instead of the compliance specialist—producing reports that miss jurisdiction-specific requirements.",
    question: "When configuring AgentDefinitions for a multi-agent system, the description field for each subagent type serves what primary purpose?",
    choices: {
      A: "It provides documentation for developers maintaining the system",
      B: "It helps the coordinator understand each subagent's capabilities so it can make informed delegation decisions",
      C: "It is displayed to end users so they can understand which subagent is handling their request",
      D: "It is used as the subagent's system prompt when the subagent is spawned"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While descriptions do serve as documentation, their primary functional purpose is informing the coordinator's delegation decisions at runtime, not just aiding developers.",
      B: "CORRECT: The AgentDefinition description helps the coordinator understand what each subagent can do, enabling intelligent delegation decisions. The coordinator reads these descriptions to determine which subagent is best suited for each subtask.",
      C: "INCORRECT: AgentDefinition descriptions are internal architectural metadata, not user-facing content. Users typically do not see or interact with subagent configurations.",
      D: "INCORRECT: The description and system prompt are separate fields in AgentDefinition. The description informs the coordinator about the subagent, while the system prompt instructs the subagent about its behavior."
    }
  },
  {
    id: "d1-052",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "A government benefits processing system where age verification is prompt-enforced incorrectly approves 3% of underage applicants—each approval costs $50K in benefits and generates a federal audit finding.",
    question: "Your benefits processing agent must verify that applicants are 18+ before processing applications. The current prompt says 'Always verify age before processing.' Analytics show 97% compliance. The remaining 3% occurs when applicants provide extensive documentation that distracts the model. What is the correct architectural response?",
    choices: {
      A: "Improve the prompt to say 'CRITICAL: You MUST verify age before processing. Under no circumstances should you skip this step.'",
      B: "Add few-shot examples specifically showing cases with extensive documentation where age verification still occurs first",
      C: "Replace the prompt-based approach with a programmatic prerequisite that blocks the process_application tool until age_verification has returned a confirmed result",
      D: "Reduce the context window size to prevent extensive documentation from distracting the model"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Emphatic prompt instructions improve compliance rates marginally but cannot eliminate the non-zero failure rate. The 3% failure rate represents real applicants receiving incorrect benefits.",
      B: "INCORRECT: Few-shot examples help with the specific distraction pattern shown but cannot cover all possible distraction scenarios. New document formats or edge cases could still cause failures.",
      C: "CORRECT: When deterministic compliance is required, programmatic prerequisites that block downstream tool calls until prerequisites complete provide guaranteed enforcement. The process_application tool literally cannot execute until age verification is confirmed, regardless of any contextual distractions.",
      D: "INCORRECT: Reducing context window size would prevent the agent from processing legitimate documentation. The fix should enforce the workflow order, not limit the agent's ability to read inputs."
    }
  },
  {
    id: "d1-053",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "medium",
    scenario: 5,
    importance: "A CI/CD agent that can execute rm -rf / or drop tables without interception has no safety net—a single hallucinated destructive command in a code review pipeline could destroy production infrastructure.",
    question: "Your CI/CD agent can execute shell commands as part of its code review process. You need to prevent it from executing destructive commands like 'rm -rf' or 'DROP TABLE'. What is the most reliable approach?",
    choices: {
      A: "Add 'never run destructive commands' to the system prompt with examples of forbidden commands",
      B: "Implement a pre-execution hook that inspects shell command tool calls against a deny-list of destructive patterns and blocks matching commands",
      C: "Run all commands in a sandboxed environment that prevents destructive operations",
      D: "Limit the agent to read-only tool access so it cannot execute any commands"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based restrictions have a non-zero failure rate. For destructive operations where a single failure could be catastrophic, prompt instructions are insufficient as the primary safeguard.",
      B: "CORRECT: Pre-execution hooks that inspect outgoing tool calls against policy rules and block violations provide deterministic enforcement. The hook checks the command content before execution and blocks destructive patterns, providing a guaranteed safety layer.",
      C: "INCORRECT: Sandboxing is a good defense-in-depth measure but addresses the execution environment rather than the agent's behavior. Hooks prevent the attempt entirely, which is preferable to relying on environment-level protection.",
      D: "INCORRECT: Removing command execution entirely prevents the agent from running tests, linters, and other legitimate review activities. The goal is to block destructive commands while allowing productive ones."
    }
  },
  {
    id: "d1-054",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 5,
    importance: "A code review agent that analyzes a 200-file monorepo change in a single pass misses 40% of cross-module dependency issues—bugs that ship to production and cause cascading failures across services.",
    question: "Your code review agent must analyze a PR that modifies a shared utility library used by 12 downstream services. The PR changes 3 files in the library. What decomposition strategy best captures the full impact?",
    choices: {
      A: "Review only the 3 changed files since they are the only files in the diff",
      B: "Review all 12 downstream services in their entirety to understand potential impacts",
      C: "First analyze the 3 changed files locally, then perform a separate cross-file integration pass that checks how the changes affect the 12 downstream consumers' interfaces and usage patterns",
      D: "Run the existing test suite and only review files where tests fail"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Reviewing only the changed files misses breaking changes in downstream consumers. A shared library change can break services even if the library changes are individually correct.",
      B: "INCORRECT: Reviewing all 12 services in their entirety causes attention dilution and is computationally expensive. The review should focus on how the changed interfaces are consumed, not every aspect of every service.",
      C: "CORRECT: Split into local analysis (the 3 changed files) plus a cross-file integration pass (checking downstream interface compatibility). This avoids attention dilution while ensuring cross-module impacts are caught.",
      D: "INCORRECT: Test suites may not cover all integration scenarios. Type changes, semantic changes, or new edge cases might not have corresponding tests. Static analysis through code review catches issues that tests miss."
    }
  },
  {
    id: "d1-055",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 2,
    importance: "A developer who resumes an unnamed session by scrolling through 'session_12847' IDs wastes 10 minutes per resumption—named sessions save 200 hours per year for a team of 20 developers.",
    question: "A developer frequently investigates related bugs across multiple sessions. They want to resume a specific investigation they started on Monday about a memory leak. What is the best practice for session management?",
    choices: {
      A: "Use --resume with the auto-generated session ID from the history list",
      B: "Use --resume with a descriptive session name like 'memory-leak-investigation' that they assigned when starting the session",
      C: "Search through all recent sessions by timestamp to find the right one",
      D: "Keep a separate log file mapping investigation topics to session IDs"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Auto-generated session IDs are not memorable and require searching through a list. Descriptive names are more practical for frequent resumption.",
      B: "CORRECT: Named session resumption using --resume <session-name> allows developers to give meaningful names to investigation sessions, making them easy to find and resume later. 'memory-leak-investigation' is immediately identifiable.",
      C: "INCORRECT: Searching by timestamp is inefficient and error-prone, especially when multiple sessions exist close together. Named sessions provide direct access.",
      D: "INCORRECT: Maintaining a separate log adds manual overhead and can become stale. Built-in named sessions solve this problem directly."
    }
  },
  {
    id: "d1-056",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 6,
    importance: "A medical records extraction system that makes tool-calling decisions based on a decision tree fails on 30% of novel form layouts—while model-driven reasoning handles 95% of variations correctly.",
    question: "Your structured data extraction agent encounters a document format it has never seen before—a handwritten form that has been poorly scanned. The agent needs to decide between OCR preprocessing, image enhancement, or manual field extraction. A developer proposes adding a format detection classifier that maps document types to tool sequences. What is the architectural concern?",
    choices: {
      A: "Classifiers are less accurate than Claude at detecting document formats",
      B: "A pre-configured classifier maps document types to fixed tool sequences, replacing model-driven decision-making. This prevents Claude from reasoning about the optimal approach for novel formats that the classifier was not trained on",
      C: "Classifiers add latency that makes the system too slow for real-time processing",
      D: "The classifier would need to be retrained every time a new document format is encountered"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While this may be true, accuracy is not the primary concern. The architectural issue is replacing adaptive, model-driven reasoning with a rigid classification system.",
      B: "CORRECT: The classifier creates a pre-configured decision tree that maps document types to tool sequences. This prevents Claude from using model-driven decision-making to reason about novel formats. A poorly scanned handwritten form may not match any trained category, but Claude could reason about combining OCR with image enhancement based on what it observes.",
      C: "INCORRECT: Latency is an operational concern, not the core architectural issue. The fundamental problem is the loss of adaptive reasoning capability.",
      D: "INCORRECT: While retraining requirements are a maintenance burden, the core issue is architectural—replacing flexible model reasoning with rigid classification."
    }
  },
  {
    id: "d1-057",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 3,
    importance: "A consulting firm's research system where the coordinator assigns 3 subagents to the same geographic region produces a report with 60% duplicate content—clients refuse to pay for inflated page counts.",
    question: "Your coordinator assigns three research subagents to investigate the same industry. Two subagents return nearly identical findings because they searched the same sources. How should this be prevented at the architectural level?",
    choices: {
      A: "Add deduplication logic to the synthesis subagent to merge similar findings",
      B: "Have the coordinator partition the research scope—assigning distinct source types, time periods, or geographic regions to each subagent to minimize overlap",
      C: "Limit each subagent to a single search query to prevent broad source coverage",
      D: "Require subagents to check a shared results cache before performing searches"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Post-hoc deduplication is a workaround, not a fix. The wasted compute from duplicate searches has already occurred, and synthesis-level deduplication may not reliably distinguish genuine independent corroboration from overlapping sources.",
      B: "CORRECT: The coordinator should partition research scope across subagents to minimize duplication. Assigning distinct source types, time periods, or geographic regions ensures each subagent covers unique ground, producing complementary rather than redundant findings.",
      C: "INCORRECT: Limiting to single queries dramatically reduces research quality. The fix is better scope partitioning, not reduced search breadth.",
      D: "INCORRECT: A shared results cache between subagents violates the isolated context principle and introduces cross-subagent dependencies that bypass the coordinator."
    }
  },
  {
    id: "d1-058",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Context Passing",
    difficulty: "hard",
    scenario: 1,
    importance: "A financial advisory system where the portfolio analysis subagent has no idea what the risk assessment subagent found produces contradictory recommendations—suggesting aggressive growth to a client identified as risk-averse.",
    question: "Your coordinator runs a risk assessment subagent that identifies a customer as 'high risk—recent bankruptcy.' It then invokes a portfolio recommendation subagent. The portfolio subagent recommends aggressive growth investments. What went wrong?",
    choices: {
      A: "The portfolio subagent should have access to the same customer database to look up risk profiles independently",
      B: "The coordinator failed to include the risk assessment findings in the portfolio subagent's prompt—subagents do not share memory or inherit prior findings",
      C: "The portfolio subagent's tool configuration does not include risk-adjusted recommendation algorithms",
      D: "The risk assessment subagent should have directly invoked the portfolio subagent with the risk findings attached"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Giving the portfolio subagent database access to re-query risk data duplicates work already done and adds latency. The coordinator already has the findings and should pass them directly.",
      B: "CORRECT: Subagents do not share memory between invocations. The coordinator must explicitly include the risk assessment findings in the portfolio subagent's prompt. Without this context, the portfolio subagent has no knowledge of the customer's risk profile.",
      C: "INCORRECT: The tools available to the portfolio subagent are not the issue—the issue is that it lacks the risk context needed to use any recommendation approach appropriately.",
      D: "INCORRECT: Direct subagent-to-subagent communication violates the hub-and-spoke pattern. The coordinator must mediate all information flow between subagents."
    }
  },
  {
    id: "d1-059",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Multi-Step Workflows",
    difficulty: "medium",
    scenario: 1,
    importance: "A logistics support agent that handles multi-shipment complaints one at a time keeps customers on hold for 45 minutes—parallel investigation would resolve them in 10, hitting the 80% FCR target.",
    question: "A customer calls about three separate order issues: wrong item received, missing delivery, and billing discrepancy. The agent resolves them one at a time, taking 40 minutes. How can the workflow be improved?",
    choices: {
      A: "Ask the customer to call back three separate times, once for each issue",
      B: "Decompose the three issues, investigate each in parallel using shared customer context, then synthesize a unified resolution addressing all three",
      C: "Prioritize the most urgent issue and create tickets for the other two for later follow-up",
      D: "Transfer the customer to a specialist agent for each issue type"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Requiring multiple calls destroys customer experience and violates first-contact resolution targets.",
      B: "CORRECT: Multi-concern requests should be decomposed into distinct items, investigated in parallel using shared context, then synthesized into a unified resolution. This reduces resolution time and improves customer satisfaction.",
      C: "INCORRECT: Deferring issues to follow-up tickets reduces first-contact resolution rates and creates additional work for both the customer and support team.",
      D: "INCORRECT: Multiple transfers between specialists fragments the customer experience and increases total handling time. A unified approach with parallel investigation is more efficient."
    }
  },
  {
    id: "d1-060",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 6,
    importance: "A supply chain analytics platform integrates 15 vendor APIs returning monetary values in different currencies and formats—without hook-based normalization, a $1M purchase order in JPY gets processed as $1M USD, a $9,200 error.",
    question: "Your data extraction agent receives monetary values from three tools: one returns cents as integers (150000 for $1,500.00), another returns formatted strings ('$1,500.00'), and a third returns raw numbers (1500). The model occasionally misinterprets the cents-based values. Which approach provides the strongest guarantee of correct interpretation?",
    choices: {
      A: "Document each tool's format in the system prompt and add examples showing how to convert between formats",
      B: "Standardize all tool definitions to return the same format by modifying the MCP tools",
      C: "Implement PostToolUse hooks that normalize all monetary values to a standard decimal format before the model processes them",
      D: "Add a validation subagent that checks all monetary calculations for format consistency"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Prompt-based format documentation is probabilistic. The model may still misinterpret cents as dollars in edge cases, especially with large values that look plausible either way.",
      B: "INCORRECT: Modifying MCP tools may not be feasible (third-party tools) and creates maintenance burden. Hooks handle normalization without touching tool implementations.",
      C: "CORRECT: PostToolUse hooks normalize heterogeneous data formats from different MCP tools before the agent processes them. Converting all monetary values to a standard decimal format deterministically prevents misinterpretation.",
      D: "INCORRECT: A validation subagent adds complexity and latency, and still relies on model-based interpretation which has a non-zero error rate. Hook-based normalization prevents errors rather than detecting them."
    }
  },
  {
    id: "d1-061",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 3,
    importance: "A due diligence research system that generates static subtasks before seeing any data misses 60% of red flags—adaptive plans that adjust based on initial findings catch regulatory issues worth $100M in deal risk.",
    question: "Your research agent investigates a company for acquisition due diligence. The initial investigation reveals an unexpected regulatory filing that suggests potential legal issues. With a fixed prompt chain decomposition, the agent completes its pre-defined steps (financials, market, team) but never investigates the regulatory filing. What decomposition pattern would have caught this?",
    choices: {
      A: "A longer fixed prompt chain that includes a regulatory analysis step",
      B: "An adaptive investigation plan that generates subtasks based on what is discovered at each step, allowing the agent to dynamically add a regulatory investigation when the filing is found",
      C: "Running two fixed pipelines in parallel—one for standard due diligence and one for regulatory analysis",
      D: "A human-in-the-loop step after each phase to decide whether additional investigation areas are needed"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A longer fixed chain with more pre-defined steps still cannot adapt to unexpected discoveries. What if the filing revealed a technology patent issue instead of a regulatory one? Fixed chains cannot anticipate every possible finding.",
      B: "CORRECT: Adaptive investigation plans generate subtasks based on what is discovered at each step. When the agent finds the unexpected regulatory filing, it dynamically creates a new subtask to investigate it. This pattern handles the inherent unpredictability of open-ended research.",
      C: "INCORRECT: Running parallel fixed pipelines still relies on pre-defining all relevant investigation areas. The regulatory filing was unexpected—no pre-defined pipeline would have covered it without adaptive discovery.",
      D: "INCORRECT: Human-in-the-loop after each phase adds significant latency and defeats the purpose of autonomous investigation. Adaptive decomposition handles this automatically."
    }
  },
  {
    id: "d1-062",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 4,
    importance: "A legacy migration project where developers resume week-old sessions with stale dependency analysis bases their refactoring on package versions that have since been updated—introducing 15 regression bugs per sprint.",
    question: "A developer's session from 5 days ago contains extensive analysis of a module's dependency tree. Since then, three dependencies have been updated with breaking changes. They need to continue the migration work. What approach is most reliable?",
    choices: {
      A: "Resume the session directly—the analysis is still mostly valid and the agent will discover any changes naturally",
      B: "Resume the session but explicitly inform the agent about the three dependency updates so it can perform targeted re-analysis",
      C: "Start a new session with a structured summary of the previous analysis and note the three dependency changes, since stale tool results from the old session make resumption unreliable for this scenario",
      D: "Fork the old session and investigate the dependency changes in the fork"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Directly resuming with 5-day-old analysis is risky. The agent may reference stale dependency versions in its reasoning without realizing they have changed, leading to incorrect migration decisions.",
      B: "INCORRECT: While informing about changes helps, the session contains stale tool results from the dependency analysis. The agent may still reference these stale results. With significant changes, starting fresh is more reliable.",
      C: "CORRECT: Starting a new session with a structured summary is more reliable than resuming with stale tool results when significant changes have occurred. The summary preserves useful findings (architecture understanding, migration strategy) without the stale dependency data.",
      D: "INCORRECT: Forking creates a branch from the stale session, still containing the outdated dependency analysis. This does not solve the stale data problem."
    }
  },
  {
    id: "d1-063",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 5,
    importance: "A CI/CD agent processing a test failure cascade needs 25+ tool calls to trace root cause through microservices—a hard cap of 10 silently stops the investigation mid-trace, reporting incomplete findings as final.",
    question: "Your CI/CD agent investigates test failures by tracing through service logs, code changes, and dependency graphs. Complex failures can require 30+ tool calls. A senior engineer recommends implementing max_iterations=10 as a 'safety mechanism.' What is the correct assessment?",
    choices: {
      A: "max_iterations=10 is appropriate—it prevents runaway agents from consuming unlimited resources",
      B: "The iteration cap should be the primary stopping mechanism and 10 is a reasonable default for most workflows",
      C: "An arbitrary iteration cap as the PRIMARY stopping mechanism is an anti-pattern. Use stop_reason-based termination as primary, with a generous safety cap that logs warnings when approached—not one that silently truncates complex investigations",
      D: "Remove all iteration limits and rely entirely on stop_reason to prevent any possibility of premature termination"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: While resource protection is valid, max_iterations=10 as the PRIMARY mechanism silently truncates complex investigations. The agent reports its partial findings as complete, and the user has no way to know the investigation was cut short.",
      B: "INCORRECT: Arbitrary iteration caps as the PRIMARY stopping mechanism is explicitly identified as an anti-pattern. The primary mechanism must be stop_reason-based.",
      C: "CORRECT: The correct approach uses stop_reason ('tool_use' to continue, 'end_turn' to stop) as the primary mechanism, with a generous safety cap as a SECONDARY safeguard that logs warnings when approached rather than silently truncating.",
      D: "INCORRECT: Having no safety cap at all risks infinite loops from edge cases. A secondary safety cap is appropriate—the key is that it should not be the primary mechanism and should alert rather than silently terminate."
    }
  },
  {
    id: "d1-064",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 3,
    importance: "A competitive intelligence system that skips analysis subagents for simple queries saves $2 per query—across 50,000 monthly queries, intelligent routing saves $100K while maintaining quality.",
    question: "Your multi-agent research system's coordinator manages search, analysis, and synthesis subagents. For a query like 'What is Company X's current stock price?', what should the coordinator do?",
    choices: {
      A: "Route through all three subagents to ensure consistent processing regardless of query complexity",
      B: "Analyze the query requirements and route only to the search subagent, since this is a simple factual lookup that does not require analysis or synthesis",
      C: "Skip all subagents and answer directly from the coordinator's knowledge",
      D: "Route to the search and synthesis subagents, skipping analysis since the data is already numeric"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Routing simple factual queries through the full pipeline wastes resources. The coordinator should dynamically select subagents based on query complexity.",
      B: "CORRECT: The coordinator should analyze query requirements and dynamically select which subagents to invoke. A simple stock price lookup only needs the search subagent—analysis and synthesis add no value for factual lookups.",
      C: "INCORRECT: The coordinator should not bypass subagents to answer from its own knowledge, as it may have stale information. The search subagent can retrieve current data.",
      D: "INCORRECT: Even skipping analysis, synthesis is unnecessary for a single data point. The search result can be returned directly."
    }
  },
  {
    id: "d1-065",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Spawning",
    difficulty: "hard",
    scenario: 3,
    importance: "A geopolitical risk analysis system that spawns regional subagents sequentially takes 45 minutes per briefing—parallel spawning reduces this to 12 minutes, enabling real-time crisis response.",
    question: "Your coordinator needs to investigate trade policies across 6 regions simultaneously. It currently spawns one regional subagent, waits for its completion, then spawns the next. What is the performance improvement opportunity?",
    choices: {
      A: "Increase the context window size so a single subagent can handle all 6 regions",
      B: "Emit all 6 Task tool calls in a single coordinator response to enable parallel execution",
      C: "Create a pipeline where each regional subagent passes its findings to the next in sequence",
      D: "Use a shared memory store that all subagents can write to simultaneously"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single subagent handling all 6 regions loses the benefit of parallelism and risks attention dilution across too many concurrent research topics.",
      B: "CORRECT: Spawning parallel subagents requires emitting multiple Task tool calls in a SINGLE coordinator response rather than across separate turns. This allows all 6 regional investigations to run concurrently, dramatically reducing total time.",
      C: "INCORRECT: Sequential chaining of subagents makes the problem worse by adding inter-agent dependency. Each region's investigation is independent and should run in parallel.",
      D: "INCORRECT: Shared memory stores between subagents violate the isolated context principle and bypass the coordinator. Subagents should return results to the coordinator independently."
    }
  },
  {
    id: "d1-066",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Handoff Protocols",
    difficulty: "hard",
    scenario: 1,
    importance: "A medical insurance escalation that says only 'customer is upset about a claim' forces the specialist to re-diagnose for 15 minutes—structured handoffs with diagnosis and recommended actions cut specialist handle time by 70%.",
    question: "Your customer support agent has spent 10 minutes diagnosing a complex billing issue. It has identified the root cause (duplicate charge from a system migration), attempted two resolution paths (both failed due to account flags), and determined human intervention is needed. What makes an effective escalation handoff?",
    choices: {
      A: "Transfer the customer with a note: 'Customer has a billing issue that needs manual resolution'",
      B: "Compile a structured handoff with: customer details, root cause (duplicate charge from migration), attempted resolutions (two paths tried, both blocked by account flags), and recommended next action (manual flag removal then credit)",
      C: "Send the full 10-minute conversation transcript so the human agent has complete context",
      D: "Transfer the customer and let the human agent start a fresh investigation without bias from the AI's analysis"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A vague note forces the human agent to re-diagnose from scratch, wasting the 10 minutes of automated investigation already completed.",
      B: "CORRECT: Structured handoff protocols should include customer details, root cause analysis, steps already taken, and recommended next actions. This preserves the investigation progress and gives the human agent everything needed to continue resolution efficiently.",
      C: "INCORRECT: Full transcripts are lengthy and unstructured. Human agents need actionable summaries, not raw conversation logs to parse through.",
      D: "INCORRECT: Starting fresh discards all diagnostic work. The AI's analysis provides valuable context that accelerates human resolution—a structured handoff is not 'bias' but useful information."
    }
  },
  {
    id: "d1-067",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 1,
    importance: "A trading platform's compliance team found that prompt-based trade-size limits were violated 47 times in one quarter—each violation triggered a SEC inquiry costing $150K in legal fees.",
    question: "Your trading support agent must enforce position size limits: no single trade can exceed 5% of portfolio value. The current prompt includes detailed position sizing rules. Despite this, 2% of trades exceed the limit. A developer proposes three solutions: (1) better prompt engineering, (2) a pre-execution hook on the execute_trade tool, (3) a post-trade monitoring alert. Rank them by enforcement strength.",
    choices: {
      A: "Prompt engineering > hook > post-trade monitoring, because the model processes prompts before making any tool calls",
      B: "Post-trade monitoring > hook > prompt engineering, because it catches all violations regardless of source",
      C: "Hook > prompt engineering > post-trade monitoring, because hooks provide deterministic prevention, prompts provide probabilistic prevention, and monitoring provides detection-only",
      D: "All three are equivalent in enforcement strength and should be evaluated based on implementation cost"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Prompt processing order does not determine enforcement strength. Prompts have a non-zero failure rate regardless of when they are processed. Hooks provide deterministic blocking.",
      B: "INCORRECT: Post-trade monitoring only detects violations after they occur—the trade has already been executed. Prevention (hooks) is stronger than detection (monitoring).",
      C: "CORRECT: Hooks provide deterministic prevention (the trade is blocked before execution), prompt engineering provides probabilistic prevention (the model usually follows limits but can fail), and post-trade monitoring provides detection-only (the violation has already occurred). For compliance, the hierarchy is prevention > probabilistic prevention > detection.",
      D: "INCORRECT: The three approaches differ fundamentally in enforcement guarantees. Deterministic prevention (hooks) is objectively stronger than probabilistic compliance (prompts), which is stronger than post-hoc detection (monitoring)."
    }
  },
  {
    id: "d1-068",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "medium",
    scenario: 5,
    importance: "A security review agent using adaptive decomposition for a standard PCI-DSS audit skips 3 of 12 required categories—failing the certification and delaying the company's ability to process payments by 4 months.",
    question: "Your agent performs PCI-DSS compliance audits with a fixed 12-category checklist. A developer suggests switching to dynamic adaptive decomposition to make the audit more 'intelligent.' What is the risk?",
    choices: {
      A: "Dynamic decomposition would be slower than a fixed checklist for a standard audit",
      B: "Dynamic decomposition might skip required checklist categories if the model determines they are not relevant based on initial findings, potentially causing audit failure",
      C: "Dynamic decomposition cannot handle the complexity of 12 categories",
      D: "Dynamic decomposition would produce inconsistent results across different audit runs"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While speed is a consideration, the primary risk is incomplete coverage, not just slower execution.",
      B: "CORRECT: For standardized audits with mandatory checklists, prompt chaining with fixed steps ensures complete coverage. Dynamic decomposition might skip categories it deems irrelevant, which is a critical failure for compliance audits where all categories must be evaluated. Prompt chaining is the correct pattern for predictable, comprehensive workflows.",
      C: "INCORRECT: Dynamic decomposition can handle complex investigations. The issue is not capability but appropriateness—standardized checklists need fixed sequences.",
      D: "INCORRECT: Inconsistency is a secondary concern. The primary risk is incomplete coverage of mandatory categories."
    }
  },
  {
    id: "d1-069",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 2,
    importance: "A distributed systems debugging team exploring microservices failure cascades needs parallel hypothesis testing—sequential exploration in a single session takes 3 hours versus 45 minutes with forked parallel investigation.",
    question: "Your team is debugging a production outage with three possible root causes: database connection pool exhaustion, memory leak in service A, and network partition between services B and C. You have completed initial diagnostics. How should you structure the investigation?",
    choices: {
      A: "Investigate all three hypotheses sequentially in the current session, documenting each as you go",
      B: "Use fork_session to create three branches from the current diagnostic baseline, assigning each branch to investigate one hypothesis independently",
      C: "Start three completely new sessions, copying the initial diagnostics into each",
      D: "Have the coordinator agent spawn three subagents to investigate each hypothesis"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Sequential investigation in one session is slow and contaminated—findings from hypothesis 1 influence how you investigate hypotheses 2 and 3, potentially introducing confirmation bias.",
      B: "CORRECT: fork_session creates independent branches from a shared analysis baseline. Each fork starts with the same diagnostic data but investigates its hypothesis in isolation, preventing cross-contamination while preserving the baseline work.",
      C: "INCORRECT: Starting new sessions loses the initial diagnostic work and requires re-gathering baseline data in each. Fork preserves the shared baseline efficiently.",
      D: "INCORRECT: While subagents could investigate in parallel, they would lack the full diagnostic context from the current session. Fork_session specifically preserves the accumulated session context."
    }
  },
  {
    id: "d1-070",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 1,
    importance: "A retail support agent that cannot emit multiple tool calls per turn forces sequential API lookups—tripling response time from 3 seconds to 9 seconds for a common 3-step verification flow.",
    question: "Your customer support agent needs to simultaneously verify a customer's identity, look up their order, and check inventory for a replacement item. Can Claude emit multiple tool calls in a single response?",
    choices: {
      A: "No, Claude can only call one tool per response and must wait for its result before calling another",
      B: "Yes, Claude can emit multiple tool_use blocks in a single response, and the agentic loop implementation should execute all of them and return all results before the next iteration",
      C: "Yes, but only if the tools are explicitly marked as 'parallel-safe' in their definitions",
      D: "Yes, but the tools must be called in the order they appear and each result must be validated before calling the next"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Claude can and does emit multiple tool_use blocks in a single response when it determines multiple independent tool calls are needed.",
      B: "CORRECT: Claude can emit multiple tool_use blocks in a single response. The agentic loop implementation should execute all requested tool calls (potentially in parallel if they are independent) and return all results in the next iteration.",
      C: "INCORRECT: There is no 'parallel-safe' flag in tool definitions. Any tools can be called together in a single response. The agent reasons about independence based on the task context.",
      D: "INCORRECT: The tools in a single response do not need to be sequentially ordered or validated. They represent parallel requests that should all be executed and their results returned together."
    }
  },
  {
    id: "d1-071",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A pharmaceutical regulatory submission system where the coordinator performs research directly instead of delegating produces shallow, uncited analysis that the FDA rejects—costing 6 months of submission delay.",
    question: "Your multi-agent system's coordinator has access to both the Task tool (for spawning subagents) and a web_search tool. When a research query arrives, the coordinator sometimes performs the search itself rather than delegating to the search subagent. What is the architectural concern?",
    choices: {
      A: "The coordinator should never have access to any tools besides Task—it should only orchestrate",
      B: "When the coordinator performs specialist work directly, it undermines the separation of concerns. The coordinator's role is task decomposition, delegation, and aggregation—not executing specialist tasks. Direct execution bypasses subagent specialization, tool restrictions, and quality controls.",
      C: "The coordinator is more efficient at searching than the subagent since it has direct access",
      D: "The coordinator should always delegate to maintain consistent token usage patterns"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While limiting coordinator tools is a valid design choice, the absolute statement 'never' is too strong. Some coordinators may need lightweight tools for quick lookups. The issue is when the coordinator bypasses specialist subagents for tasks those subagents are designed to handle.",
      B: "CORRECT: The coordinator's architectural role is decomposition, delegation, result aggregation, and quality evaluation. When it performs specialist work directly, it bypasses the subagent's specialized configuration, tool restrictions, and quality controls. This undermines the multi-agent architecture's benefits.",
      C: "INCORRECT: Efficiency is not the primary concern. The coordinator lacks the subagent's specialized system prompt, tool restrictions, and focused context that produce higher-quality specialist work.",
      D: "INCORRECT: Token usage patterns are not the architectural reason for delegation. The reason is maintaining separation of concerns, specialization benefits, and consistent quality controls."
    }
  },
  {
    id: "d1-072",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Fork-Based Sessions",
    difficulty: "hard",
    scenario: 4,
    importance: "A platform team evaluating two database migration strategies from the same schema analysis saves 2 hours of duplicate work by forking instead of re-analyzing—accelerating a critical migration deadline.",
    question: "Your team has spent 2 hours analyzing a database schema and identifying migration requirements. Now they want to evaluate two migration strategies: a lift-and-shift approach and a complete redesign. Each strategy exploration will involve different tool calls and analysis paths. What is the most efficient approach?",
    choices: {
      A: "Continue in the current session and evaluate both strategies sequentially",
      B: "Start two new sessions from scratch, duplicating the schema analysis in each",
      C: "Use fork_session to create two branches from the shared schema analysis baseline, one for each strategy",
      D: "Have one developer evaluate lift-and-shift in the current session while another developer starts a new session for the redesign"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Sequential evaluation in one session means the second strategy's analysis is influenced by the first's context, preventing clean comparison.",
      B: "INCORRECT: Duplicating 2 hours of schema analysis wastes significant time. Fork preserves the shared baseline.",
      C: "CORRECT: Fork-based session management creates independent branches from a shared analysis baseline. Both forks retain the full schema understanding but can explore their respective strategies independently, providing clean comparisons without duplicate work.",
      D: "INCORRECT: A new session for the second developer loses the schema analysis context. Fork_session is specifically designed to share baselines across parallel explorations."
    }
  },
  {
    id: "d1-073",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "A cryptocurrency exchange's KYC agent that processes withdrawals without identity verification enables $2M in money laundering per month—each incident triggers a federal investigation costing $5M in legal defense.",
    question: "Your crypto exchange agent processes withdrawals. Regulatory requirements mandate KYC (Know Your Customer) verification before any withdrawal. The agent uses 3 tools: verify_kyc, calculate_fees, and execute_withdrawal. Which enforcement pattern ensures compliance?",
    choices: {
      A: "Encode the sequence in the system prompt: 'Always verify KYC, then calculate fees, then execute withdrawal'",
      B: "Implement programmatic prerequisites: execute_withdrawal is gated on both verify_kyc success AND calculate_fees completion, while calculate_fees requires verify_kyc to have succeeded first",
      C: "Add a post-withdrawal hook that checks KYC status and reverses unauthorized withdrawals",
      D: "Require the user to confirm they have been KYC-verified before the agent processes any withdrawal"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based sequence enforcement has a non-zero failure rate. For financial regulatory compliance where violations carry criminal penalties, prompt instructions are insufficient.",
      B: "CORRECT: Programmatic prerequisites create a chain of gates: calculate_fees cannot execute until verify_kyc succeeds, and execute_withdrawal cannot execute until both prerequisites complete. This provides deterministic, zero-failure-rate compliance enforcement.",
      C: "INCORRECT: Post-withdrawal reversal means the funds have already left the exchange. In cryptocurrency, blockchain transactions may be irreversible. Prevention is the only acceptable approach.",
      D: "INCORRECT: Relying on user self-attestation of KYC status is not a compliance control. The system must programmatically verify KYC status independent of user claims."
    }
  },
  {
    id: "d1-074",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "medium",
    scenario: 6,
    importance: "A medical data extraction pipeline processes lab results from 50 hospital systems—each returns units differently (mg/dL vs mmol/L). Without normalization, a glucose reading of 5.5 mmol/L gets treated as 5.5 mg/dL, a dangerous 18x error.",
    question: "Your medical data extraction agent processes lab results from multiple hospital systems. Some return glucose values in mg/dL, others in mmol/L. The conversion factor is 18 (mg/dL = mmol/L × 18). What is the most reliable approach to ensure consistent units?",
    choices: {
      A: "Add conversion instructions to the system prompt with the formula and examples",
      B: "Implement a PostToolUse hook that detects the unit from each tool's response and normalizes all values to mg/dL before the model processes them",
      C: "Create a separate conversion tool that the agent can call when needed",
      D: "Include both units in the final output and let downstream systems handle conversion"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Mathematical conversion via prompt instructions is error-prone. Claude may apply the conversion incorrectly, forget to apply it, or apply it in the wrong direction. Medical data requires deterministic accuracy.",
      B: "CORRECT: PostToolUse hooks can detect the unit system from each tool's response metadata and apply the conversion programmatically before the model sees the data. This provides deterministic unit normalization—critical for medical data where unit errors can be life-threatening.",
      C: "INCORRECT: Relying on the agent to call a conversion tool introduces a probabilistic step—the agent might forget to call it or call it with wrong parameters. Hook-based normalization happens automatically.",
      D: "INCORRECT: Passing mixed units to downstream systems propagates the problem rather than solving it. Normalization should happen as early as possible in the pipeline."
    }
  },
  {
    id: "d1-075",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 5,
    importance: "A code review agent that reviews a 500-line file with 3 interleaved concerns (security, performance, style) in a single pass misses 45% of security issues due to attention dilution—a $800K vulnerability escaped to production.",
    question: "Your code review agent needs to review a complex file for security vulnerabilities, performance issues, and code style violations. Running a single pass that checks for all three simultaneously produces poor results. What prompt chaining pattern improves quality?",
    choices: {
      A: "Run three sequential review passes, each focused on a single concern (security, performance, style), then aggregate findings",
      B: "Run one pass with a more detailed prompt listing all three concern types with examples",
      C: "Split the file into thirds and review each section for all concerns",
      D: "Run a single pass focused only on security since it is the highest priority"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Prompt chaining breaks reviews into sequential steps, each focused on a single concern. This avoids attention dilution by giving the model one objective per pass, resulting in deeper analysis of each concern type. The final aggregation combines all findings.",
      B: "INCORRECT: A more detailed prompt does not solve the attention dilution problem. With three simultaneous objectives, the model still splits attention regardless of prompt detail.",
      C: "INCORRECT: Splitting by file section means each review chunk lacks full-file context needed for many security and performance issues (e.g., variable flows across sections). Split by concern type, not by code location.",
      D: "INCORRECT: Ignoring performance and style issues means technical debt accumulates. Multi-pass review covers all concerns without sacrificing any."
    }
  },
  {
    id: "d1-076",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 4,
    importance: "A developer productivity agent with a buggy loop that sends tool results as new user messages instead of tool_result messages breaks Claude's understanding of conversation structure—producing incoherent multi-step analysis.",
    question: "A developer implements an agentic loop that receives a tool_use response from Claude, executes the tool, and sends the result back. They send the tool result as a regular 'user' message containing the result text. What is architecturally wrong?",
    choices: {
      A: "Tool results must be sent as properly formatted tool_result messages with the corresponding tool_use_id, not as plain user messages. Sending results as user messages breaks the structured conversation format and prevents Claude from correctly associating results with their tool calls",
      B: "Tool results should be sent as 'assistant' messages to maintain the conversation flow",
      C: "The result text should be JSON-encoded before sending to preserve structured data",
      D: "Tool results should be sent as system messages to give them highest priority in Claude's processing"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: Tool results must be appended to conversation history as properly structured tool_result messages that reference the corresponding tool_use_id. Sending results as plain user messages breaks the conversation structure—Claude cannot reliably associate the result with its original tool call, leading to confused reasoning.",
      B: "INCORRECT: Tool results are not assistant messages. They have their own dedicated format (tool_result) that links to the original tool_use via tool_use_id.",
      C: "INCORRECT: JSON encoding is a secondary concern. The primary issue is the message role/type. Tool results must use the tool_result message format, not user messages.",
      D: "INCORRECT: System messages serve a completely different purpose (providing instructions and context). Tool results have their own designated format in the API."
    }
  },
  {
    id: "d1-077",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 1,
    importance: "A healthcare support system where different subagents give contradictory medical billing advice to the same patient creates liability—the coordinator must aggregate and reconcile before any patient communication.",
    question: "Your customer support coordinator receives results from two subagents: the billing subagent says the patient owes $500, while the insurance subagent says the patient owes $200 after applying coverage. What is the coordinator's responsibility?",
    choices: {
      A: "Present both amounts to the patient and let them choose which to pay",
      B: "Aggregate the results, recognize that the insurance subagent's finding supersedes the billing subagent's raw charge, and present the patient with the correct $200 amount after coverage",
      C: "Average the two amounts and present $350 as a compromise",
      D: "Escalate to a human agent since the subagents disagree"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Presenting contradictory information to the patient creates confusion and erodes trust. The coordinator must resolve the apparent discrepancy before communicating.",
      B: "CORRECT: The coordinator's role includes result aggregation—understanding how subagent findings relate to each other and synthesizing them into a coherent response. The insurance finding provides additional context that modifies the billing finding, not a contradiction.",
      C: "INCORRECT: Averaging unrelated figures is nonsensical. The coordinator must understand the relationship between the findings—insurance coverage reduces the billed amount, it does not create a range.",
      D: "INCORRECT: This is not a genuine disagreement—it is complementary information that the coordinator should be able to aggregate. Unnecessary escalation wastes human agent time."
    }
  },
  {
    id: "d1-078",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Context",
    difficulty: "hard",
    scenario: 3,
    importance: "A competitive intelligence system's synthesis subagent that receives raw search API responses instead of curated findings produces rambling reports with 70% irrelevant content—clients cancel $500K retainers.",
    question: "Your coordinator receives search results from a subagent—200 items including relevance scores, raw HTML snippets, and metadata. It needs to pass useful findings to the analysis subagent. What is the best practice?",
    choices: {
      A: "Pass all 200 items directly to ensure the analysis subagent has complete data",
      B: "Pass only the top 5 results by relevance score to keep context minimal",
      C: "Curate the results by extracting key findings and structuring them with content separated from metadata, while preserving sufficient detail for rigorous analysis",
      D: "Store the results in a database and give the analysis subagent a tool to query them"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Passing all 200 items including raw HTML and irrelevant metadata overwhelms the analysis subagent with noise and wastes context window space on non-essential data.",
      B: "INCORRECT: Arbitrary top-N filtering may discard highly relevant results that have lower relevance scores but contain critical information. The coordinator should curate based on content relevance, not just score cutoff.",
      C: "CORRECT: The coordinator should curate findings into structured formats that separate content from metadata while preserving the detail needed for analysis. This gives the analysis subagent clean, organized data with attribution information intact.",
      D: "INCORRECT: Database-mediated context passing bypasses the coordinator and gives the subagent uncontrolled access to data. Context should be passed directly in the prompt through the coordinator."
    }
  },
  {
    id: "d1-079",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "A loan processing agent that allows credit checks before income verification wastes 30% of credit bureau queries on applicants who do not meet basic income requirements—costing $150K annually in unnecessary credit pull fees.",
    question: "Your loan processing agent must follow: (1) verify income, (2) run credit check, (3) calculate loan terms, (4) present offer. Credit checks cost $25 each. You want to ensure credit checks only run after income verification passes. A developer suggests two approaches: (A) prompt instruction and (B) programmatic gate. The income verification failure rate for applicants is 40%. What is the business case for programmatic enforcement?",
    choices: {
      A: "There is no meaningful difference—both approaches prevent unnecessary credit checks equally well",
      B: "Programmatic enforcement eliminates the non-zero failure rate of prompt instructions. Even a 2% skip rate on 10,000 monthly applications means 200 unnecessary credit checks ($5,000/month) plus incorrect loan offers to unqualified applicants",
      C: "Programmatic enforcement is only needed if the prompt-based approach shows more than a 10% failure rate",
      D: "The business case depends entirely on the cost of credit checks; if they were free, prompt-based enforcement would be sufficient"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based and programmatic enforcement differ fundamentally in their failure rates. Prompt instructions have a non-zero failure rate; programmatic gates have zero failure rate.",
      B: "CORRECT: Programmatic enforcement eliminates the failure rate entirely. Even a small prompt failure rate translates to real business costs at scale—unnecessary credit checks, incorrect loan offers, and potential regulatory issues from offering loans to unqualified applicants.",
      C: "INCORRECT: A 10% threshold is arbitrary and ignores the compounding cost at scale. Any non-zero failure rate for financial prerequisite checks creates business risk.",
      D: "INCORRECT: Cost is only one factor. Even free credit checks could result in incorrect loan offers to applicants who fail income verification—creating regulatory and financial risk beyond the credit check cost."
    }
  },
  {
    id: "d1-080",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 5,
    importance: "A CI/CD agent with access to production deployment tools accidentally deploys a failing build because the environment parameter was mistyped as 'prod' instead of 'staging'—a hook preventing production deployments outside the release window would have caught it.",
    question: "Your CI/CD agent can deploy code to staging and production environments. Company policy states production deployments are only allowed during the designated release window (Tuesdays 2-4pm). What is the most reliable enforcement mechanism?",
    choices: {
      A: "Include the release window schedule in the system prompt and instruct the agent to check the current time before deploying to production",
      B: "Implement a pre-execution hook on the deploy tool that checks the target environment and current time, blocking production deployments outside the release window and suggesting scheduling for the next window",
      C: "Create a separate approval_required tool that the agent must call before deploy, and instruct it to use this for production deployments",
      D: "Configure the deploy tool to only accept 'staging' as a valid environment parameter, requiring a different tool for production"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The agent may not have reliable access to the current time, may misinterpret time zones, or may skip the check under certain conditions. Prompt-based time checking is doubly unreliable.",
      B: "CORRECT: A pre-execution hook on the deploy tool programmatically checks both the target environment and current time. It deterministically blocks production deployments outside the window and can suggest scheduling for the next available window—all without relying on the model to remember or correctly implement the policy.",
      C: "INCORRECT: Relying on the agent to call an approval tool before deploying is a prompt-based approach with a non-zero skip rate. The hook approach is automatic and requires no agent cooperation.",
      D: "INCORRECT: Requiring a different tool for production adds complexity without providing time-based enforcement. The agent could still call the production tool at any time."
    }
  },
  {
    id: "d1-081",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "medium",
    scenario: 4,
    importance: "A developer using an agent to explore a 1M-line monorepo without a mapping phase spends 3 hours in unfocused exploration—a 15-minute structure mapping phase would have identified the 5 critical subsystems immediately.",
    question: "A developer asks an agent to 'understand how the authentication system works' in a large unfamiliar codebase. What is the correct first step in decomposing this open-ended task?",
    choices: {
      A: "Start reading files from the root directory and work through them sequentially",
      B: "Search for files containing 'auth' or 'login' and start reading them immediately",
      C: "First map the project structure to understand the overall architecture, identify the authentication-related subsystems, then create a focused investigation plan",
      D: "Ask the developer to specify exactly which files they want the agent to examine"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Sequential file reading from the root is unfocused and inefficient. Most files will be irrelevant to authentication, wasting context window and time.",
      B: "INCORRECT: Keyword search without structural understanding may miss authentication components with non-obvious names (middleware, interceptors, guards) and lacks a coherent investigation strategy.",
      C: "CORRECT: Open-ended tasks should be decomposed by first mapping structure, identifying relevant areas, then creating a prioritized investigation plan. This prevents unfocused exploration and ensures the agent develops a coherent understanding.",
      D: "INCORRECT: The developer does not know which files are relevant—that is what they need the agent to determine. The agent should be able to discover the relevant components autonomously."
    }
  },
  {
    id: "d1-082",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 2,
    importance: "A team that manually summarizes week-long debugging sessions into 'fresh start' documents saves 90% of investigation time compared to blindly resuming sessions with 5 days of stale tool results.",
    question: "Your agent has a week-old session with 50 tool calls analyzing a distributed system. The system has since been significantly refactored. You need to continue the investigation. What is the recommended approach?",
    choices: {
      A: "Resume the week-old session since it contains valuable analysis",
      B: "Start a completely new session with no prior context",
      C: "Start a new session with a structured summary of the key findings from the old session, noting which areas have been refactored and need fresh analysis",
      D: "Resume the session and ask the agent to 're-check everything'"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: A week-old session with significant refactoring contains extensively stale tool results. The agent may reference outdated code structures, deleted files, or changed APIs in its reasoning.",
      B: "INCORRECT: Starting with zero context wastes the valuable architectural understanding and findings from the week of investigation. Key insights should be preserved.",
      C: "CORRECT: Starting fresh with a structured summary preserves valuable findings while eliminating stale tool results. Noting which areas were refactored enables the agent to focus fresh analysis on changed areas while leveraging prior understanding of unchanged areas.",
      D: "INCORRECT: Asking the agent to 're-check everything' in a resumed session still starts from stale context, and 're-check everything' is vague—the agent may re-check some things and miss others."
    }
  },
  {
    id: "d1-083",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 6,
    importance: "A contract analysis system that terminates after extracting party names but before extracting obligation clauses produces incomplete summaries—legal teams relying on these miss $10M in unfavorable terms.",
    question: "Your contract extraction agent processes lengthy legal documents. After extracting party names (tool call 1), it returns a response with both a text block ('Found the following parties...') and a tool_use block requesting clause extraction. Your loop terminates here, returning the party list as the final result. What is the bug?",
    choices: {
      A: "The agent should not produce text alongside tool calls—this indicates a malformed response",
      B: "The loop incorrectly treats the presence of a text block as an end condition. It should check stop_reason, which would be 'tool_use', indicating the loop should continue by executing the clause extraction tool",
      C: "The clause extraction tool is not in the agent's allowed tools, causing it to generate text instead of a tool call",
      D: "The agent needs a longer context window to handle the full contract before generating tool calls"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Claude commonly produces text blocks alongside tool_use blocks in the same response. This is normal behavior—the text provides intermediate reasoning or status updates.",
      B: "CORRECT: The bug is treating text content as an end condition. When stop_reason is 'tool_use', the loop must continue by executing the requested tool, regardless of any accompanying text. The text block is intermediate reasoning, not a final answer.",
      C: "INCORRECT: The response explicitly contains a tool_use block for clause extraction, so the tool is available. The issue is the loop not executing it.",
      D: "INCORRECT: Context window size is unrelated to this control flow bug. The agent successfully generated the tool call—the loop just failed to execute it."
    }
  },
  {
    id: "d1-084",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A market research system where subagents automatically inherit coordinator context produces hallucinated cross-references—the analysis subagent references search findings it never actually received, creating false citations.",
    question: "A new developer on your team builds a multi-agent research system and is confused why the synthesis subagent produces a report with no citations despite the search subagent finding dozens of sources. They ask: 'Doesn't the synthesis subagent automatically get the search results since they are part of the same system?' What is the correct explanation?",
    choices: {
      A: "The synthesis subagent does inherit the search results, but its system prompt needs to emphasize the importance of including citations",
      B: "Subagents operate with isolated context—they do NOT automatically inherit the coordinator's conversation history or other subagents' findings. The coordinator must explicitly include the search findings and source metadata in the synthesis subagent's prompt",
      C: "The synthesis subagent needs the same tools as the search subagent to access the sources independently",
      D: "The search results are too large for the synthesis subagent's context window"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The synthesis subagent does NOT inherit search results. This is the exact misconception the question addresses. No amount of prompt engineering can make the subagent cite sources it was never given.",
      B: "CORRECT: This is the #1 multi-agent architecture gotcha. Subagents have isolated context—they do not inherit the coordinator's conversation history, other subagents' findings, or any shared state. The coordinator must explicitly pass all relevant information in each subagent's prompt.",
      C: "INCORRECT: Re-running searches from the synthesis subagent is wasteful and may produce different results. The coordinator should pass the search findings directly.",
      D: "INCORRECT: Context window limits are unlikely to be the issue for typical search results. The real issue is that the findings were never passed at all."
    }
  },
  {
    id: "d1-085",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "medium",
    scenario: 1,
    importance: "A pharmacy benefits agent that dispenses controlled substances without pharmacist verification faces DEA enforcement actions—each violation carries $100K penalties and potential license revocation.",
    question: "Your pharmacy support agent processes prescription refills. For controlled substances (Schedule II-V), a pharmacist must verify the prescription before the refill is processed. Currently, this is enforced via a system prompt instruction. What is the risk and what should change?",
    choices: {
      A: "The prompt instruction is sufficient since controlled substance rules are clearly stated and well-understood by the model",
      B: "The risk is that prompt-based enforcement has a non-zero failure rate for a regulated process that requires deterministic compliance. Replace with a programmatic gate that blocks refill_prescription for controlled substance schedules until pharmacist_verify has completed",
      C: "Add a secondary prompt check that asks the model to confirm it has verified before proceeding",
      D: "Implement a post-processing audit that flags refills processed without pharmacist verification"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Clear prompt instructions improve compliance but cannot guarantee it. For DEA-regulated operations, any failure rate exposes the pharmacy to enforcement actions.",
      B: "CORRECT: When deterministic compliance is required for regulated processes, programmatic gates must replace prompt-based guidance. The refill_prescription tool should be programmatically blocked for controlled substances until pharmacist_verify returns a successful result.",
      C: "INCORRECT: A secondary prompt check is still prompt-based and still has a non-zero failure rate. Two probabilistic checks in sequence do not equal a deterministic guarantee.",
      D: "INCORRECT: Post-processing audits detect violations after the fact—the controlled substance has already been dispensed without verification. For regulated operations, prevention through programmatic enforcement is required."
    }
  },
  {
    id: "d1-086",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 6,
    importance: "A financial reporting pipeline where API error codes (ERR-404, ERR-500) get extracted as data values produces reports with phantom error entries—causing false regulatory filings that trigger SEC investigations.",
    question: "Your extraction agent processes responses from multiple APIs. Some APIs return error information as structured fields while others embed errors in the response body as strings. The agent sometimes extracts error messages as valid data. What hook pattern addresses this?",
    choices: {
      A: "Implement a PostToolUse hook that detects and normalizes error responses from all tools into a consistent error format, preventing the model from treating error text as extractable data",
      B: "Add error handling instructions to the system prompt for each specific API format",
      C: "Let the model learn to distinguish errors from data through few-shot examples",
      D: "Create wrapper tools that handle all error cases before returning results to the agent"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: PostToolUse hooks intercept tool results and can normalize heterogeneous error formats into a consistent structure before the model processes them. This deterministically prevents the model from confusing error text with valid data.",
      B: "INCORRECT: Prompt-based error handling for each API is probabilistic and does not scale. New APIs would require prompt updates, and the model may still misinterpret unfamiliar error formats.",
      C: "INCORRECT: Few-shot examples cannot cover every possible error format from every API. New error types or formats would cause failures.",
      D: "INCORRECT: Wrapper tools require modifying the integration layer for each tool and add complexity. PostToolUse hooks provide a cleaner, centralized normalization layer without modifying individual tools."
    }
  },
  {
    id: "d1-087",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 3,
    importance: "A due diligence research system using a fixed pipeline for every acquisition target misses industry-specific risks—a pharma target's FDA warning letters were never investigated because 'regulatory analysis' was not in the standard sequence.",
    question: "Your due diligence research agent has a fixed prompt chain: (1) financial analysis, (2) market analysis, (3) team assessment, (4) synthesis. During financial analysis, the agent discovers that the target company has restated earnings twice in the past 3 years. The fixed pipeline proceeds to market analysis without investigating the restatements. What decomposition pattern would handle this better?",
    choices: {
      A: "Add 'earnings restatement analysis' as step 1.5 in the fixed pipeline",
      B: "An adaptive investigation plan that generates subtasks dynamically—discovering the restatements would trigger a new forensic accounting subtask before proceeding",
      C: "Run the fixed pipeline but add a catch-all 'additional findings' step at the end",
      D: "Have the financial analysis step produce a longer, more detailed output that covers restatements"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Adding specific steps for every possible discovery is not scalable. The next target might have patent litigation, environmental violations, or sanctions exposure. Fixed pipelines cannot anticipate every finding.",
      B: "CORRECT: Adaptive investigation plans generate subtasks based on what is discovered at each step. When the financial analysis reveals earnings restatements, the system dynamically creates a forensic accounting investigation subtask. This handles unexpected findings that fixed pipelines miss.",
      C: "INCORRECT: A catch-all step at the end is too late—the investigation may have proceeded through market and team analysis without the context that the financial data is unreliable.",
      D: "INCORRECT: A longer output within the existing step still follows the fixed pipeline sequence. The need is for a NEW investigation branch, not a longer step within the existing sequence."
    }
  },
  {
    id: "d1-088",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 4,
    importance: "A site reliability team that resumes a 12-hour incident investigation without informing the agent about a hotfix deployed at hour 8 wastes 3 hours re-diagnosing a problem that was already fixed.",
    question: "You are resuming a session where the agent was investigating a production database performance issue. The session contains 30 tool calls with query analysis results. A DBA applied an index optimization overnight that resolved the issue. How should you handle the session?",
    choices: {
      A: "Resume with --resume and let the agent continue its investigation naturally",
      B: "Resume with --resume and immediately inform the agent that an index was applied overnight, specifying which tables were affected, so it can validate the fix rather than continue diagnosing a resolved issue",
      C: "Start a completely new session with no context from the previous investigation",
      D: "Fork the session to investigate whether the index actually fixed the issue"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Without knowing about the index change, the agent will continue investigating a problem that no longer exists, producing stale and misleading analysis.",
      B: "CORRECT: When resuming sessions, it is critical to inform the agent about changes to previously analyzed systems. Specifying that an index was applied and which tables were affected enables the agent to shift from diagnosis to validation—confirming the fix resolved the issue rather than continuing to investigate a phantom problem.",
      C: "INCORRECT: Starting fresh loses 30 tool calls of valuable analysis that provides context for understanding what the issue was and whether the fix adequately addressed it.",
      D: "INCORRECT: Forking creates parallel branches, which is useful for exploring alternatives, not for incorporating new information about a change. The agent needs to know about the change in its current context."
    }
  },
  {
    id: "d1-089",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 1,
    importance: "A customer support platform that uses different loop implementations across teams produces inconsistent behavior—some teams' agents complete multi-step tasks while others randomly truncate, causing a 15% customer satisfaction gap.",
    question: "Which of the following correctly describes the standard agentic loop lifecycle?",
    choices: {
      A: "Send request to Claude, parse the response text for action keywords, execute matching tools, repeat until no action keywords are found",
      B: "Send request to Claude, inspect stop_reason—if 'tool_use', execute the requested tools and append results to conversation history; if 'end_turn', the task is complete",
      C: "Send request to Claude, execute all available tools regardless of the response, send all results back, repeat until a timeout is reached",
      D: "Send request to Claude, check if the response contains a tool_use block—if yes, execute it and start a new conversation; if no, the task is complete"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Parsing response text for action keywords is a natural language parsing approach, which is a documented anti-pattern for loop control. Stop_reason is the reliable signal.",
      B: "CORRECT: The canonical agentic loop lifecycle: send request, inspect stop_reason. If 'tool_use', execute the requested tools and append results to conversation history for the next iteration. If 'end_turn', the model has completed its task.",
      C: "INCORRECT: Executing all available tools regardless of the response ignores the model-driven decision-making principle. Claude decides which tools to call based on the task context.",
      D: "INCORRECT: Starting a new conversation after each tool call destroys accumulated context. Tool results must be appended to the SAME conversation history so Claude can reason about accumulated information."
    }
  },
  {
    id: "d1-090",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Configuration",
    difficulty: "hard",
    scenario: 3,
    importance: "A research system where the coordinator micromanages subagents with step-by-step instructions produces formulaic, shallow analysis—while goal-oriented delegation produces insights that win $2M consulting contracts.",
    question: "You are configuring the system prompt for a research coordinator that manages search, analysis, and synthesis subagents. Which prompt approach leads to the best delegation quality?",
    choices: {
      A: "Provide exact tool call sequences: 'Call search_subagent with query=\"X\", then call analysis_subagent with the results, then call synthesis_subagent'",
      B: "Specify research goals, quality criteria, and available subagent capabilities: 'Produce comprehensive, cited analysis. You have access to search, deep analysis, and synthesis specialists. Ensure coverage completeness and source diversity.'",
      C: "Give no specific instructions—let the coordinator figure out the best approach based on the available subagent descriptions alone",
      D: "Provide conditional logic: 'IF the query contains financial terms, THEN use financial_subagent; IF it contains legal terms, THEN use legal_subagent'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Exact tool call sequences create a rigid pipeline that cannot adapt to different query types. The coordinator cannot use model-driven reasoning to select the best subagent combination.",
      B: "CORRECT: Coordinator prompts should specify research goals and quality criteria rather than step-by-step procedural instructions. This enables the coordinator to dynamically determine the best subagent combination, invocation order, and parameter selection for each unique query.",
      C: "INCORRECT: Zero guidance leaves the coordinator without clear objectives or quality standards. It needs goals and criteria to make effective delegation decisions, even though it should not be given rigid procedures.",
      D: "INCORRECT: Conditional keyword-based routing is a pre-configured decision tree that cannot handle complex or ambiguous queries. Model-driven reasoning based on goals and criteria is more flexible and accurate."
    }
  },
  {
    id: "d1-091",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 3,
    importance: "A research system that double-executes tool calls because it mismanages parallel tool responses wastes API quotas and produces duplicate data that inflates confidence in findings.",
    question: "Claude returns a response containing three tool_use blocks: search_patents, search_papers, and search_news. Your loop implementation executes search_patents, appends its result, and sends a new request. Claude then re-requests search_papers and search_news. What is the implementation error?",
    choices: {
      A: "Claude should not request multiple tools in a single response—this indicates a prompt issue",
      B: "The loop executed only one of three requested tool calls and sent a partial result. All tool_use blocks in a single response should be executed, and all results should be returned together in the next request",
      C: "The loop should have sent each tool result as a separate API request",
      D: "The three tools have conflicting output schemas that prevent simultaneous execution"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Requesting multiple tools in a single response is normal and expected behavior when Claude identifies independent operations that can run in parallel.",
      B: "CORRECT: When Claude emits multiple tool_use blocks in one response, all of them must be executed and all results returned in the next iteration. Executing only one and sending a partial result forces Claude to re-request the missing tool calls, wasting a round trip and potentially producing inconsistent results.",
      C: "INCORRECT: All results from a single response's tool calls should be sent back together in one request, not as separate API calls. This maintains the conversational coherence.",
      D: "INCORRECT: Output schema differences do not prevent simultaneous execution. Tools can have entirely different response formats and still be executed together."
    }
  },
  {
    id: "d1-092",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 1,
    importance: "A support platform where the coordinator lacks visibility into subagent failures cannot distinguish between 'no issues found' and 'search failed'—leading to falsely reassuring customers that their accounts are fine.",
    question: "In your hub-and-spoke customer support system, a subagent fails silently—it encounters an API timeout but returns an empty result instead of an error. The coordinator treats this as 'no matching records found.' How does the hub-and-spoke pattern help prevent this?",
    choices: {
      A: "The hub-and-spoke pattern prevents all subagent errors by design",
      B: "Routing all communication through the coordinator provides a centralized point for consistent error handling. The coordinator can implement error detection patterns, validate subagent responses, and distinguish between empty results and failure conditions",
      C: "The coordinator should ping each subagent periodically to check its health status",
      D: "Subagents in a hub-and-spoke should never return empty results"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: No architecture prevents all errors. The benefit is centralized, consistent handling of errors when they occur.",
      B: "CORRECT: Hub-and-spoke provides observability and consistent error handling by routing all communication through the coordinator. The coordinator can implement validation logic to detect empty results from subagents, distinguish between genuine 'no records' and failure conditions, and take appropriate action.",
      C: "INCORRECT: Health checking is an infrastructure concern, not an orchestration pattern. The coordinator's role is to validate and act on the results it receives, not monitor service health.",
      D: "INCORRECT: Empty results are legitimate in many scenarios (e.g., no matching records). The issue is distinguishing legitimate empty results from silent failures, which the coordinator handles through validation."
    }
  },
  {
    id: "d1-093",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Context Passing",
    difficulty: "hard",
    scenario: 3,
    importance: "A legal research system where the coordinator passes 50 pages of raw search results to the synthesis subagent overwhelms its context—key precedents are buried on page 40 and never cited in the final brief.",
    question: "Your coordinator has collected findings from three search subagents totaling 80,000 tokens. The synthesis subagent's effective context window for quality output is approximately 30,000 tokens. How should the coordinator handle this?",
    choices: {
      A: "Pass all 80,000 tokens and trust the synthesis subagent to focus on the most important information",
      B: "Truncate to the first 30,000 tokens regardless of content",
      C: "Have the coordinator curate and prioritize the findings—selecting the most relevant, highest-quality results with preserved attribution, fitting within the synthesis subagent's effective context",
      D: "Split the findings into three chunks and spawn three synthesis subagents, then aggregate their outputs"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Overloading the synthesis subagent with context beyond its effective range causes attention dilution. Important findings may be lost in the noise of less relevant results.",
      B: "INCORRECT: Arbitrary truncation by position may discard the most relevant findings if they appear later in the aggregated results. Curation by relevance is needed, not position-based truncation.",
      C: "CORRECT: The coordinator should curate findings by relevance and quality, selecting the most important results with preserved metadata and attribution, fitting within the synthesis subagent's effective context window. This is part of the coordinator's role in information routing.",
      D: "INCORRECT: Splitting by chunk and running separate synthesis operations produces fragmented outputs that may miss cross-finding connections. Centralized curation by the coordinator is more coherent."
    }
  },
  {
    id: "d1-094",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Multi-Step Workflows",
    difficulty: "hard",
    scenario: 1,
    importance: "A travel support agent investigating a missed connection must trace the root cause through 4 systems (booking, flight status, rebooking, compensation)—prompt-based ordering misses the rebooking step in 8% of cases, stranding passengers.",
    question: "Your travel support agent handles a customer whose connecting flight was canceled. The resolution requires: (1) confirm the cancellation, (2) find alternative flights, (3) rebook on the best alternative, (4) process compensation for the disruption. Steps 3 and 4 require the outputs of steps 1 and 2. What enforcement strategy ensures the workflow executes correctly?",
    choices: {
      A: "Include the workflow sequence in the system prompt with clear numbered steps",
      B: "Implement programmatic gates: rebook_flight requires both confirm_cancellation and find_alternatives to have completed; process_compensation requires rebook_flight to have completed",
      C: "Trust the model to determine the correct order since the dependencies are logically obvious",
      D: "Execute all four steps simultaneously and discard any that fail due to missing prerequisites"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based sequencing has a non-zero failure rate. For travel operations where a skipped step means a stranded passenger, programmatic enforcement is required.",
      B: "CORRECT: Programmatic prerequisite gates ensure the workflow dependencies are enforced deterministically. Rebook cannot execute without confirmed cancellation and alternative options. Compensation cannot execute without a completed rebooking. Each gate validates its prerequisites before allowing execution.",
      C: "INCORRECT: Even 'logically obvious' dependencies can be skipped under pressure (long conversations, complex customer situations). Deterministic enforcement eliminates this risk.",
      D: "INCORRECT: Executing all steps simultaneously when they have dependencies will cause failures and inconsistent state. The dependencies must be respected through ordered execution."
    }
  },
  {
    id: "d1-095",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "medium",
    scenario: 1,
    importance: "A customer support system where agents can send promotional emails during complaint resolution undermines trust—a hook blocking promotional tool calls during active complaints preserves the $40M annual customer retention rate.",
    question: "Your customer support agent has access to a send_marketing_email tool that should never be used during complaint resolution conversations. How do you prevent misuse?",
    choices: {
      A: "Remove the send_marketing_email tool from the agent's tool list entirely",
      B: "Add 'never send marketing emails during complaint resolution' to the system prompt",
      C: "Implement a tool call interception hook that detects the conversation context (active complaint) and blocks send_marketing_email calls, redirecting to the complaint resolution workflow",
      D: "Create a separate agent without marketing tools for complaint resolution"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: The agent may legitimately need the marketing tool in non-complaint contexts (e.g., follow-up offers after successful resolution). Removing it entirely is too broad.",
      B: "INCORRECT: Prompt-based restrictions have a non-zero failure rate. A customer's complaint context might not be clear-cut, and the model might rationalize sending a marketing email as part of 'resolution.'",
      C: "CORRECT: A tool call interception hook can contextually block send_marketing_email during active complaint conversations while allowing it in other contexts. This provides deterministic, context-aware enforcement without removing the tool entirely.",
      D: "INCORRECT: Separate agents for different conversation types adds significant architectural complexity. Context-aware hooks achieve the same goal within a single agent."
    }
  },
  {
    id: "d1-096",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 4,
    importance: "A legacy system analysis that jumps straight into code reading without mapping architecture first produces a 40-page report with detailed function analysis but zero understanding of how subsystems interact—worthless for migration planning.",
    question: "Your agent is tasked with analyzing a 300K-line legacy Java application with no documentation to plan a modernization strategy. The codebase has 15 major packages. What is the correct decomposition sequence?",
    choices: {
      A: "Start with the largest package and perform a detailed line-by-line analysis, then move to the next largest",
      B: "First map the project structure and package dependencies, identify high-impact areas (heavily depended-upon modules, performance bottlenecks), then create a prioritized analysis plan for each area",
      C: "Run static analysis tools on the entire codebase and summarize the results",
      D: "Read the main entry point file and follow the execution path from there"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Line-by-line analysis of the largest package without understanding its role in the architecture wastes effort. The largest package might be auto-generated code or test utilities.",
      B: "CORRECT: Open-ended investigation of large codebases should start by mapping structure, identifying high-impact areas, then creating a prioritized plan. This prevents aimless exploration and ensures the agent focuses on architecturally significant components first.",
      C: "INCORRECT: Static analysis outputs are voluminous and lack architectural context. They identify code-level issues but do not reveal system design, data flows, or modernization priorities.",
      D: "INCORRECT: Following the execution path from main provides one linear trace through the system. Complex applications have many entry points and the execution path does not reveal the full architecture."
    }
  },
  {
    id: "d1-097",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 2,
    importance: "A DevOps team with 8 developers investigating different microservice issues benefits from named sessions that each developer can resume independently—versus anonymous session IDs that require Slack messages to coordinate.",
    question: "A team of developers uses Claude Code for various investigation tasks. Developer A is debugging a memory leak, Developer B is analyzing API performance, and Developer C is reviewing database queries. What session naming strategy supports their workflow?",
    choices: {
      A: "Use default auto-generated session IDs and maintain a shared spreadsheet mapping IDs to investigations",
      B: "Each developer uses descriptive --resume session names reflecting their investigation: 'memory-leak-service-x', 'api-perf-analysis', 'db-query-review'",
      C: "All developers share a single session to maintain unified context about the system",
      D: "Create numbered sessions (session-1, session-2, session-3) assigned to each developer"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: External spreadsheet tracking adds manual overhead and can become stale. Named sessions are self-documenting.",
      B: "CORRECT: Named session resumption allows each developer to use descriptive names that immediately identify the investigation context. This makes resumption intuitive and supports parallel independent investigations.",
      C: "INCORRECT: A single shared session would create context pollution between unrelated investigations and cannot support parallel independent work.",
      D: "INCORRECT: Numbered sessions are not descriptive and require remembering which number maps to which investigation. Descriptive names are more practical."
    }
  },
  {
    id: "d1-098",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 5,
    importance: "A CI/CD agent that builds its own tool routing logic instead of letting Claude decide which linter to run on which file produces 30% false positives—applying Python linters to JavaScript files because the routing regex was wrong.",
    question: "Your CI/CD agent has access to 10 different linting tools, each specialized for a different language or framework. A developer implements a routing layer that examines file extensions and calls the matching linter before Claude sees the file. What architectural principle does this violate?",
    choices: {
      A: "The routing layer adds unnecessary latency to the linting process",
      B: "This replaces model-driven decision-making with a pre-configured decision tree. Claude should inspect the file content and reason about which linting tool to use, since file extensions do not always match the actual content (e.g., .js files containing TypeScript or JSX)",
      C: "Each linting tool should be called by a separate subagent, not a routing layer",
      D: "The routing layer should use content-type detection rather than file extensions"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Latency is a secondary concern. The primary issue is removing Claude's ability to make intelligent tool selection decisions based on actual content.",
      B: "CORRECT: Pre-configured decision trees based on file extensions replace Claude's model-driven reasoning. Claude can inspect actual file content and context to make nuanced tool selection decisions—for example, recognizing that a .js file uses TypeScript syntax and should use the TypeScript linter.",
      C: "INCORRECT: Separate subagents per linting tool adds unnecessary architectural complexity for what is fundamentally a tool selection decision.",
      D: "INCORRECT: Better content detection is still a pre-configured decision tree, just a more accurate one. The principle is that Claude should make the reasoning-based decision, not a deterministic classifier."
    }
  },
  {
    id: "d1-099",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A research system coordinator that re-delegates ALL findings to ALL subagents on every refinement cycle wastes 80% of compute—targeted re-delegation to specific subagents addressing specific gaps saves $50K monthly.",
    question: "Your research system's iterative refinement loop detects that the synthesis report is missing analysis of European market data. The coordinator has 5 subagents: US search, EU search, Asia search, analysis, and synthesis. What is the correct re-delegation pattern?",
    choices: {
      A: "Re-run the entire pipeline with all 5 subagents to ensure comprehensive coverage",
      B: "Re-delegate only to the EU search subagent with a targeted query for European market data, pass the results through analysis, then re-invoke synthesis with the additional findings",
      C: "Ask the synthesis subagent to extrapolate European data from the existing US and Asia findings",
      D: "Add the gap description to the original query and restart from the US search subagent"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Re-running the entire pipeline wastes the work of subagents that already produced adequate results. Iterative refinement should target specific gaps.",
      B: "CORRECT: The coordinator should re-delegate to specific subagents with targeted queries addressing the identified gap. The EU search gets a focused query, analysis processes the new data, and synthesis incorporates it. This is efficient and targeted.",
      C: "INCORRECT: Extrapolation from unrelated markets produces speculation, not research. The gap must be filled with actual European market data.",
      D: "INCORRECT: Restarting from US search is unnecessary—US data was adequate. Only the EU-specific gap needs addressing."
    }
  },
  {
    id: "d1-100",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Spawning",
    difficulty: "medium",
    scenario: 3,
    importance: "A research system that spawns subagents across 5 sequential coordinator turns takes 25 minutes for a report that should take 5 minutes with parallel execution—clients abandon the platform for faster competitors.",
    question: "Your coordinator emits one Task tool call per turn, waiting for each subagent to complete before spawning the next. Three of these subagents perform independent research on different topics. What is the performance issue?",
    choices: {
      A: "Each Task tool call has significant overhead that compounds with sequential execution",
      B: "Independent subagent tasks are serialized unnecessarily. The three independent subagents should be spawned by emitting their Task tool calls in a single coordinator response for parallel execution",
      C: "The coordinator should spawn all subagents at startup rather than during the conversation",
      D: "The coordinator's context window grows too large with sequential turn-by-turn results"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While there is overhead per tool call, the primary issue is the unnecessary serialization of independent work, not per-call overhead.",
      B: "CORRECT: Independent subagent tasks should be spawned in parallel by emitting multiple Task tool calls in a single coordinator response. Sequential spawning across turns unnecessarily serializes work that could run concurrently.",
      C: "INCORRECT: Subagents are spawned on-demand based on the specific query, not pre-spawned at startup. The issue is sequential vs. parallel spawning within a query.",
      D: "INCORRECT: Context window growth is a secondary concern. The primary issue is the latency from sequential execution of independent tasks."
    }
  },
  {
    id: "d1-101",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Handoff Protocols",
    difficulty: "medium",
    scenario: 1,
    importance: "A healthcare support system where AI-to-human handoffs lose patient medication lists forces nurses to re-verify 15 medications—adding 20 minutes to each escalation and risking medication errors.",
    question: "Your healthcare support agent collects patient symptoms, medication list, and insurance details during triage. It determines the patient needs to speak with a nurse. What information must the handoff include?",
    choices: {
      A: "Only the patient's name and the reason for escalation—nurses prefer to gather their own clinical details",
      B: "A structured summary with patient details, reported symptoms, current medications, insurance status, and the AI agent's triage assessment with recommended priority level",
      C: "The complete conversation transcript so the nurse can review everything",
      D: "Just the patient's insurance details and a link to their medical record"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Requiring nurses to re-gather information that was already collected wastes clinical time and forces the patient to repeat themselves, degrading the experience.",
      B: "CORRECT: Structured handoff protocols include customer/patient details, the findings so far (symptoms, medications, insurance), and recommended next actions (triage assessment, priority level). This preserves the work done and accelerates the nurse's response.",
      C: "INCORRECT: Full transcripts are unstructured and time-consuming for clinical staff to parse. Nurses need actionable summaries, not raw conversation logs.",
      D: "INCORRECT: Insurance details alone are insufficient for clinical decision-making. The nurse needs symptoms, medications, and the triage assessment to prioritize and prepare for the call."
    }
  },
  {
    id: "d1-102",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 6,
    importance: "A regulatory reporting pipeline where API responses contain nested JSON with 5 different timestamp formats produces reports with inconsistent date comparisons—causing $3M in misreported compliance timelines.",
    question: "Your data extraction agent processes deeply nested JSON responses from regulatory APIs. Different nesting levels use different timestamp formats: top-level uses ISO 8601, nested objects use Unix milliseconds, and array items use 'YYYY-MM-DD' strings. A PostToolUse hook should handle this. What is the correct hook design?",
    choices: {
      A: "The hook should flatten the JSON structure and convert all timestamps at the top level",
      B: "The hook should recursively traverse the response structure, detect timestamp fields by pattern matching, and normalize all to a single format while preserving the original JSON structure",
      C: "The hook should only normalize top-level timestamps since nested values are less important",
      D: "The hook should replace all timestamps with a reference ID that maps to a separate timestamp lookup table"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Flattening the JSON structure destroys the semantic relationships between nested objects that the model needs to understand the data hierarchy.",
      B: "CORRECT: The PostToolUse hook should recursively traverse the response, detect timestamps at all nesting levels through pattern matching, and normalize them to a consistent format. Preserving the original structure maintains semantic relationships while ensuring the model processes consistent date formats.",
      C: "INCORRECT: Nested timestamps are equally important for data extraction. Inconsistent formats at any level can cause misinterpretation by the model.",
      D: "INCORRECT: Reference IDs add indirection that the model must resolve, complicating reasoning. Direct normalization in-place is simpler and more reliable."
    }
  },
  {
    id: "d1-103",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "medium",
    scenario: 5,
    importance: "A code review system that reviews a 15-file PR in a single pass catches only 60% of issues. Breaking into per-file passes plus integration review catches 95%—preventing 7 production bugs per sprint.",
    question: "Your code review agent reviews a PR with 15 files. In a single-pass review, it catches issues in the first 5 files but produces increasingly superficial analysis for later files. What causes this degradation?",
    choices: {
      A: "The model's API rate limits slow down processing of later files",
      B: "Attention dilution—as the review context grows with more files, the model's ability to deeply analyze each individual file diminishes",
      C: "The later files are simpler and genuinely have fewer issues",
      D: "Token limits prevent the model from processing all 15 files"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Rate limits affect response time, not analysis quality within a single response.",
      B: "CORRECT: Attention dilution occurs when the model must process too much information simultaneously. As more files are added to the review context, the model's attention is spread thinner, reducing the depth of analysis for each individual file. This is why per-file local analysis passes produce better results.",
      C: "INCORRECT: Analysis quality degradation following a consistent pattern (good early, superficial late) indicates a systematic issue, not coincidentally simpler files.",
      D: "INCORRECT: If token limits were the issue, the model would produce errors or truncation, not superficial analysis. The model is processing all files but with diminishing attention quality."
    }
  },
  {
    id: "d1-104",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 4,
    importance: "A performance engineering team that blindly resumes a profiling session after a codebase-wide refactor bases optimization recommendations on execution paths that no longer exist—implementing the changes could introduce regressions.",
    question: "An agent session from 3 days ago contains detailed performance profiling of 8 critical code paths. Since then, 3 of those paths were refactored in a major PR. You want to continue optimization work. What is the decision framework for choosing between --resume and a fresh session?",
    choices: {
      A: "Always resume to preserve previous work",
      B: "Always start fresh to avoid any staleness risk",
      C: "If changes are minor and targeted, resume with explicit notification about changes. If changes are significant (3 of 8 paths refactored = 37.5% invalidated), start a new session with a structured summary of findings for the 5 unchanged paths and note the refactored areas for fresh analysis",
      D: "Fork the session and investigate the refactored paths in the fork"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Blindly resuming when significant changes have occurred leads to decisions based on stale data. The 3 refactored paths need fresh analysis, not references to old profiling results.",
      B: "INCORRECT: Always starting fresh wastes valid analysis of the 5 unchanged paths. The decision should depend on the extent of changes.",
      C: "CORRECT: The decision between resumption and fresh start depends on the extent of changes. With 37.5% of analyzed paths refactored, the staleness risk is significant enough to warrant a fresh session. The structured summary preserves valid findings while ensuring refactored areas get clean analysis.",
      D: "INCORRECT: Forking creates branches from the stale session, both containing outdated profiling data. A fresh session with a summary is more appropriate for significant changes."
    }
  },
  {
    id: "d1-105",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 6,
    importance: "A document processing pipeline that clears history between tool calls wastes 40% of its compute budget on redundant data extraction—the agent re-extracts fields it already found because it cannot see its own previous work.",
    question: "Your data extraction agent extracts 20 fields from a complex document, requiring multiple tool calls. Between iterations, only the latest tool result is kept in the conversation—previous results are discarded to save tokens. What problem does this create?",
    choices: {
      A: "The agent may re-extract fields it already found because it cannot see previous results, leading to redundant work and potential inconsistencies",
      B: "The agent will crash because it expects to see its full conversation history",
      C: "Token savings from discarding history outweigh the cost of occasional re-extraction",
      D: "The agent will produce better results because it focuses only on the current extraction task"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: When previous tool results are discarded, the agent loses track of what it has already extracted. It may re-extract the same fields, miss fields it thought it already found, or produce inconsistent values when re-extracting the same field. Tool results must be accumulated in conversation history.",
      B: "INCORRECT: The agent will not crash—it will continue functioning but with degraded reasoning quality due to missing context.",
      C: "INCORRECT: The token savings are false economy. Redundant tool calls, inconsistent data, and incomplete extraction cost far more than the tokens saved by truncating history.",
      D: "INCORRECT: Without seeing previous results, the agent cannot coordinate its extraction work—it does not know which fields remain and may produce contradictory values."
    }
  },
  {
    id: "d1-106",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A consulting firm's research system produces a 50-page report in a single synthesis pass that buries key findings on page 35—iterative refinement with gap detection surfaces critical insights in the executive summary.",
    question: "Your coordinator invokes the synthesis subagent, which produces a report. The coordinator evaluates it and finds that the report adequately covers financial data but completely omits technical risk assessment despite the analysis subagent having provided that data. What is the coordinator's next action in the iterative refinement loop?",
    choices: {
      A: "Return the report as-is since the synthesis subagent produced its best output",
      B: "Re-invoke the synthesis subagent with explicit instructions to include the technical risk data, along with the specific risk findings from the analysis subagent",
      C: "Re-run the entire pipeline from search through synthesis",
      D: "Manually append the technical risk data to the report without re-invoking synthesis"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Accepting a report with known gaps violates the coordinator's quality assurance role. Iterative refinement exists precisely for this situation.",
      B: "CORRECT: The coordinator evaluates synthesis output for gaps, then re-invokes synthesis with targeted instructions addressing the specific gap. This is the iterative refinement pattern—the coordinator acts as a quality gate, re-delegating until coverage is sufficient.",
      C: "INCORRECT: The search and analysis stages produced adequate data (including technical risk). Only the synthesis step needs to be re-run with better guidance.",
      D: "INCORRECT: The coordinator should not manually compose report content. It should delegate the synthesis work to the synthesis subagent with better instructions."
    }
  },
  {
    id: "d1-107",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Context",
    difficulty: "medium",
    scenario: 1,
    importance: "A customer support system where subagents share a mutable context object creates race conditions—two subagents simultaneously modifying the customer record produce corrupted data that causes a $200K billing error.",
    question: "A developer proposes using a shared in-memory context object that all subagents can read and write to, arguing it simplifies context passing. What is the architectural problem?",
    choices: {
      A: "In-memory objects are too slow for real-time multi-agent communication",
      B: "Shared mutable state between subagents violates the isolated context principle, creates race conditions with parallel execution, bypasses coordinator oversight, and makes it impossible to track what data each subagent actually used",
      C: "The shared object will exceed memory limits with large datasets",
      D: "Shared state only works with synchronous execution, not asynchronous"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Performance is not the primary concern. In-memory access is actually fast. The issues are architectural—isolation, observability, and correctness.",
      B: "CORRECT: Shared mutable state between subagents violates multiple architectural principles: subagent context isolation (each should have its own context), coordinator-mediated communication (the hub-and-spoke pattern), and execution safety (race conditions with parallel subagents). The coordinator cannot track what data each subagent used or modified.",
      C: "INCORRECT: Memory limits are an implementation concern, not the fundamental architectural problem with shared state.",
      D: "INCORRECT: Shared state has problems with both synchronous and asynchronous execution. Even sequentially, one subagent's modifications could unintentionally affect another's behavior."
    }
  },
  {
    id: "d1-108",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "A government procurement system with $500M annual throughput where contract approval skips legal review in 5% of cases creates liability—each unapproved contract averages $2M in unfavorable terms.",
    question: "Your procurement agent processes purchase requests through 4 mandatory stages: budget verification, vendor validation, legal review, and final approval. The system uses prompt-based enforcement. An audit reveals that 5% of high-urgency requests skip legal review. The team debates between strengthening the prompt versus adding programmatic gates. What factors should drive this decision?",
    choices: {
      A: "Prompt strengthening is sufficient if the failure rate drops below 1%",
      B: "The decision depends on the cost of failure: with $500M throughput and $2M average exposure per skip, even a 1% failure rate creates $10M annual risk. Programmatic gates are required when the cost of non-compliance exceeds the tolerance threshold",
      C: "Programmatic gates are overkill for a 5% failure rate—focus on better prompt engineering first",
      D: "The choice depends on implementation complexity—use whichever is faster to deploy"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A 1% threshold is arbitrary. The acceptable failure rate depends on the business impact per failure, not an arbitrary percentage.",
      B: "CORRECT: The enforcement mechanism choice should be driven by cost of failure analysis. When non-compliance creates significant financial or regulatory exposure, programmatic enforcement with zero failure rate is required regardless of how 'small' the percentage seems. The business math makes the case clear.",
      C: "INCORRECT: 5% of $500M throughput represents $25M in contracts skipping legal review. This is not a minor issue that prompt tuning can adequately address.",
      D: "INCORRECT: Implementation speed should not override compliance requirements. When the cost of failure is high, the more reliable enforcement mechanism must be chosen regardless of deployment timeline."
    }
  },
  {
    id: "d1-109",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "medium",
    scenario: 5,
    importance: "A CI/CD agent that commits API keys returned by vault tools to a PR because the model did not understand they were sensitive—a PostToolUse hook masking sensitive fields would have prevented a $500K security breach.",
    question: "Your CI/CD agent retrieves configuration values from a secrets vault tool. Some returned values contain API keys and database passwords. You need to prevent these from appearing in the agent's conversation context. What is the correct hook pattern?",
    choices: {
      A: "PreToolUse hook that filters the request before it reaches the vault",
      B: "PostToolUse hook that masks sensitive fields (replacing values with '***') in the vault tool's response before the model processes it",
      C: "System prompt instruction telling the model to ignore sensitive values in vault responses",
      D: "Post-processing filter on the model's output to redact any leaked secrets"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A PreToolUse hook filters the request, not the response. The issue is with the data coming back from the vault, not the request going to it.",
      B: "CORRECT: PostToolUse hooks transform tool results before the model sees them. Masking sensitive fields in the vault response ensures API keys and passwords never enter the model's conversation context, preventing any possibility of leakage in subsequent tool calls or outputs.",
      C: "INCORRECT: Prompt instructions are probabilistic and cannot prevent the model from having sensitive values in its context. The data is already in the conversation—the model might reference it despite instructions not to.",
      D: "INCORRECT: Output filtering catches leaks in the final response but the secrets already exist in the conversation context where they could influence tool calls (e.g., being included in a commit message or PR description)."
    }
  },
  {
    id: "d1-110",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 3,
    importance: "An M&A research system that uses adaptive decomposition discovers a target company's undisclosed litigation during initial financial analysis—worth $50M in deal value adjustment that a fixed pipeline would have missed entirely.",
    question: "Your agent is conducting M&A due diligence on a target company. During financial analysis, it discovers unusually large legal reserves. Should the agent continue with its pre-planned next step (market analysis) or adapt?",
    choices: {
      A: "Continue with market analysis as planned—legal reserves will be covered in the legal review step later in the pipeline",
      B: "The agent should adaptively generate a new subtask to investigate the legal reserves immediately, since the finding may materially affect the valuation and should inform subsequent analysis steps",
      C: "Flag the finding in a note and continue—it is not the agent's role to modify the investigation plan",
      D: "Switch entirely to legal analysis, abandoning the rest of the planned pipeline"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Deferring material findings to a later step risks the legal review lacking the financial context of the discovery. Adaptive decomposition addresses discoveries as they arise.",
      B: "CORRECT: Adaptive investigation plans generate subtasks based on what is discovered at each step. Unusually large legal reserves are a material finding that could affect valuation—the agent should investigate immediately rather than wait for a pre-planned step that may not have the right context.",
      C: "INCORRECT: In adaptive decomposition, modifying the investigation plan based on findings IS the agent's role. Static note-and-continue is the fixed pipeline pattern, which is inappropriate for open-ended investigation.",
      D: "INCORRECT: Abandoning the entire pipeline is too extreme. The agent should add a legal reserve investigation subtask while maintaining the broader investigation plan."
    }
  },
  {
    id: "d1-111",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 2,
    importance: "A developer who creates a new session for every question loses accumulated codebase understanding—the same questions get re-answered 5 times per week, wasting 8 hours of productivity.",
    question: "A developer is working on a feature that requires understanding 3 interconnected modules. They start a new Claude Code session for each module. What is the problem with this approach?",
    choices: {
      A: "Multiple sessions consume more memory on the developer's machine",
      B: "Each new session lacks the context accumulated in previous sessions. Understanding how the 3 modules interconnect requires the agent to have seen all three—separate sessions fragment this understanding",
      C: "Claude Code limits the number of concurrent sessions per user",
      D: "New sessions take longer to initialize than resuming existing ones"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Memory consumption is a minor operational concern, not the primary architectural issue with fragmented sessions.",
      B: "CORRECT: When investigating interconnected modules, context from analyzing one module informs the understanding of others. Separate sessions fragment this accumulated understanding, preventing the agent from seeing cross-module relationships.",
      C: "INCORRECT: There is no practical limit on concurrent sessions mentioned in the architecture documentation.",
      D: "INCORRECT: Initialization time is not the issue. The problem is loss of accumulated analytical context."
    }
  },
  {
    id: "d1-112",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 1,
    importance: "A financial advisory agent that terminates after generating a plan summary without executing the recommended trades—because 'end_turn' was mishandled—leaves clients with unexecuted investment strategies.",
    question: "Your financial advisory agent generates an investment plan and Claude returns a response with stop_reason 'end_turn' containing the plan text. The client approves the plan in a follow-up message. Claude's next response has stop_reason 'tool_use' with calls to execute trades. A bug causes the loop to not restart after the user message. What is the likely issue?",
    choices: {
      A: "The loop only runs once at the start and does not re-enter after user messages",
      B: "The end_turn from the plan generation permanently sets a 'completed' flag that prevents the loop from processing subsequent tool_use responses after new user input",
      C: "The trade execution tools are not available after the plan was generated",
      D: "The loop cannot handle alternating between end_turn and tool_use stop reasons"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While this could be a simpler version of the bug, the question specifies the loop handles the initial plan generation correctly. The issue is specifically with re-entering after end_turn.",
      B: "CORRECT: The loop incorrectly treats end_turn as a permanent terminal state rather than a conversational pause. After end_turn, new user messages can trigger new tool_use responses that require loop continuation. The loop should check stop_reason after EVERY Claude response, not just until the first end_turn.",
      C: "INCORRECT: Tool availability does not change between turns unless explicitly reconfigured. The tools are still available; the loop just is not executing them.",
      D: "INCORRECT: Alternating between end_turn and tool_use is normal conversational behavior. The loop implementation should handle this naturally by checking stop_reason on every response."
    }
  },
  {
    id: "d1-113",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "hard",
    scenario: 3,
    importance: "A think tank's research system that produces a first-draft report without quality evaluation generates 30% reports with critical gaps—iterative refinement catches gaps that save $200K per engagement in client corrections.",
    question: "Your research system's coordinator has just received the synthesis subagent's output—a 10-page report. Before returning it to the user, what is the coordinator's responsibility?",
    choices: {
      A: "Immediately return the report since the synthesis subagent has done its job",
      B: "Evaluate the synthesis output for completeness, accuracy, and coverage gaps. If gaps are found, re-delegate to search and analysis subagents with targeted queries, then re-invoke synthesis until the quality criteria are met",
      C: "Run a spell-check and grammar review before returning",
      D: "Ask the user to review the report and identify any gaps themselves"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The coordinator is not a passive pass-through. It has a quality assurance role—evaluating synthesis output before delivering it.",
      B: "CORRECT: The coordinator implements iterative refinement loops where it evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries addressing those gaps, and re-invokes synthesis until coverage is sufficient. This quality evaluation is a core coordinator responsibility.",
      C: "INCORRECT: Surface-level editing is not the coordinator's quality assurance role. The coordinator evaluates substantive completeness and coverage, not grammar.",
      D: "INCORRECT: Requiring users to identify gaps defeats the purpose of an autonomous research system. The coordinator should detect and address gaps before the report reaches the user."
    }
  },
  {
    id: "d1-114",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Configuration",
    difficulty: "hard",
    scenario: 3,
    importance: "A security research system where the vulnerability scanning subagent inherits the coordinator's database write tools can accidentally modify production data during scanning—costing $1M in data recovery and incident response.",
    question: "Your security research system has a coordinator with broad tool access including database modification tools. It spawns a vulnerability scanning subagent. A developer assumes the subagent inherits the coordinator's tool access and does not configure allowedTools. What is the risk?",
    choices: {
      A: "The subagent will have no tools available and cannot function",
      B: "The risk depends on whether tools inherit by default—if they do, the vulnerability scanner has unintended access to database modification tools. AllowedTools must be explicitly configured for each subagent to enforce least-privilege access",
      C: "Tool inheritance is safe because the subagent's system prompt restricts what it should do",
      D: "The coordinator's tools are automatically filtered to match the subagent's description"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Whether the subagent has no tools or all tools depends on the default behavior when allowedTools is not specified. Either case is wrong—the subagent needs specifically curated tool access.",
      B: "CORRECT: AllowedTools must be explicitly configured for each subagent in the AgentDefinition. Relying on defaults or inheritance creates either over-permissioned subagents (security risk) or under-permissioned ones (functionality failure). The vulnerability scanner should only have scanning tools, not database modification tools.",
      C: "INCORRECT: System prompt restrictions are probabilistic—the subagent might still attempt to use available tools. Tool access must be enforced programmatically through allowedTools, not through prompt-based honor systems.",
      D: "INCORRECT: There is no automatic tool filtering based on descriptions. Tool access must be explicitly configured by the developer."
    }
  },
  {
    id: "d1-115",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "medium",
    scenario: 1,
    importance: "A subscription cancellation agent that processes cancellations without presenting retention offers first reduces save rates from 35% to 0%—costing $8M annually in preventable churn.",
    question: "Your subscription service agent handles cancellation requests. Business policy requires presenting a retention offer before processing cancellation. The prompt says 'Always offer retention before cancelling.' In 15% of cases, the agent processes cancellation without making an offer—especially when customers express strong frustration. What should you implement?",
    choices: {
      A: "Add empathy-focused training examples to the prompt to help the agent handle frustrated customers while maintaining the retention offer step",
      B: "A programmatic gate that blocks the cancel_subscription tool until a retention offer has been presented (confirmed by the present_retention_offer tool completing)",
      C: "A sentiment analysis check that skips the retention offer for very frustrated customers to avoid escalation",
      D: "A post-cancellation hook that sends a retention offer email after the subscription is cancelled"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Better training examples address some failure cases but cannot eliminate the non-zero failure rate. Strong customer frustration is precisely when the model is most likely to deviate from the sequence.",
      B: "CORRECT: A programmatic gate on cancel_subscription that requires present_retention_offer to have completed ensures the retention step always happens. This is deterministic enforcement—the cancellation tool literally cannot execute until the retention offer step is confirmed.",
      C: "INCORRECT: Skipping retention offers for frustrated customers contradicts the business policy. Many frustrated customers can be retained with the right offer, which is why the policy exists.",
      D: "INCORRECT: A post-cancellation email is far less effective than an in-conversation retention offer. The customer has already decided to leave, and the cancellation is already processed."
    }
  },
  {
    id: "d1-116",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 1,
    importance: "A call center AI that can transfer customers to premium support without verifying their plan tier gives away $500K annually in premium support services to basic plan customers.",
    question: "Your customer support agent can transfer customers to premium support. Only customers on Gold or Platinum plans are eligible. The system currently uses prompt instructions to check plan eligibility. Analytics show 3% of transfers go to ineligible Basic plan customers. Implementing a hook would fix this, but the team worries about maintenance burden. How do you justify the hook?",
    choices: {
      A: "Hooks are always preferred over prompts for any behavioral requirement",
      B: "The hook is justified because: (1) the business rule requires guaranteed compliance with zero tolerance for violations, (2) the 3% failure rate creates measurable financial loss, and (3) hooks provide deterministic enforcement while prompts provide only probabilistic compliance",
      C: "The hook is unnecessary if the prompt is rewritten to be more emphatic about the eligibility requirement",
      D: "A hook is only justified if the failure rate exceeds 5%"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Hooks are not always preferred. For soft preferences or non-critical behaviors, prompt-based guidance may be adequate and simpler to maintain. The decision depends on compliance requirements.",
      B: "CORRECT: The justification for hooks over prompts rests on three factors: the business rule requires guaranteed compliance (not 97% compliance), the failures create measurable costs, and hooks provide deterministic guarantees while prompts have an inherent non-zero failure rate. This cost-benefit analysis makes the case clear.",
      C: "INCORRECT: The current prompt already states the eligibility requirement. Failures occur not because the prompt is unclear but because prompt-based enforcement has an inherent failure rate under certain conditions.",
      D: "INCORRECT: There is no magic threshold. The decision depends on the cost per violation and the required compliance level, not an arbitrary failure rate percentage."
    }
  },
  {
    id: "d1-117",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 5,
    importance: "A test generation agent that tries to write tests for a 500-function module in a single pass produces shallow tests with 30% code coverage—decomposed per-component generation achieves 90% coverage.",
    question: "Your CI/CD agent generates tests for a large module containing 50 public functions across 5 classes. Generating all tests in a single pass produces low-quality, repetitive tests. What decomposition improves quality?",
    choices: {
      A: "Generate all tests at once but increase the max_tokens to allow more output",
      B: "Break into per-class test generation passes, where each pass focuses deeply on one class's methods, edge cases, and interactions. Follow with an integration test pass that covers cross-class interactions",
      C: "Generate tests only for the most complex functions and skip simple getters/setters",
      D: "Use random sampling to test 20 of the 50 functions and extrapolate coverage"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: More tokens does not solve the attention dilution problem. The model still must track 50 functions simultaneously, producing shallow analysis regardless of output length.",
      B: "CORRECT: Per-class decomposition mirrors the per-file local analysis plus cross-file integration pattern from code review. Each class gets focused, deep test generation. The integration test pass then covers interactions between classes. This avoids attention dilution while ensuring comprehensive coverage.",
      C: "INCORRECT: Skipping 'simple' functions misses edge cases. Simple getters might have null handling bugs, and setters might have validation requirements. Complete coverage requires testing all public functions.",
      D: "INCORRECT: Random sampling provides statistical coverage estimation but not actual test coverage. Every public function should have tests."
    }
  },
  {
    id: "d1-118",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 2,
    importance: "A platform team that always resumes old sessions with stale container configurations deploys services with outdated environment variables—causing 3 production incidents per quarter.",
    question: "Your agent investigated a microservices deployment issue 2 weeks ago. The session contains analysis of service configurations, network policies, and container specs. Since then, the infrastructure team migrated to a new container runtime and updated network policies. You want to investigate a new but related deployment issue. What approach maximizes efficiency while avoiding stale data risks?",
    choices: {
      A: "Resume the old session—the analysis methodology is still valid even if specific configurations changed",
      B: "Start fresh with no prior context to ensure completely clean analysis",
      C: "Start a new session with a structured summary: 'Previously identified service dependency patterns (still valid), network architecture (CHANGED: new policies as of date X), container runtime (CHANGED: migrated from Docker to containerd). New issue: [description]'",
      D: "Resume the session and ask the agent to re-check all configurations"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: The session contains specific configuration details that are now stale. Resuming risks the agent referencing outdated network policies and container specs in its new analysis.",
      B: "INCORRECT: Starting with zero context discards valuable architectural understanding from the previous investigation. The service dependency patterns are still valid.",
      C: "CORRECT: A structured summary explicitly marks which findings are still valid and which have changed. This preserves reusable knowledge (dependency patterns) while clearly flagging stale areas (network policies, container runtime), enabling the agent to leverage prior understanding while investigating with current awareness.",
      D: "INCORRECT: 'Re-check all configurations' in a resumed session is vague and the agent may not re-check everything. It also still has stale data in its context that could influence reasoning."
    }
  },
  {
    id: "d1-119",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "medium",
    scenario: 4,
    importance: "A developer productivity agent that terminates at max_iterations=5 during a complex refactoring leaves the codebase in a half-refactored state—worse than if the refactoring had never started.",
    question: "Your codebase refactoring agent is halfway through renaming a function across 15 files when it hits the max_iterations limit and stops. Files 1-8 use the new name, files 9-15 use the old name. What anti-pattern caused this?",
    choices: {
      A: "The agent should have renamed all files in a single tool call",
      B: "The arbitrary iteration cap was used as the primary stopping mechanism, silently terminating a multi-step operation mid-execution. Stop_reason-based termination with a generous safety cap would have allowed the refactoring to complete",
      C: "The agent should have checked for consistency before each iteration",
      D: "The max_iterations was set too low—increasing it to 20 would fix the issue"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Renaming across 15 files may require multiple tool calls (one per file or group). The issue is not the number of tool calls but the premature termination.",
      B: "CORRECT: Using an arbitrary iteration cap as the PRIMARY stopping mechanism causes exactly this problem—silently terminating multi-step operations mid-execution. Stop_reason-based termination lets the model complete its work naturally. A safety cap should log warnings at high counts rather than silently truncating.",
      C: "INCORRECT: Consistency checks during execution do not prevent premature termination. They would detect the inconsistency but not fix the root cause—the iteration cap.",
      D: "INCORRECT: Increasing to 20 might fix this specific case but a different refactoring across 25 files would hit the same problem. The fix is using stop_reason as the primary mechanism, not picking a bigger arbitrary number."
    }
  },
  {
    id: "d1-120",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 3,
    importance: "A legal research system where the coordinator does not evaluate synthesis quality delivers reports with missing case law citations—costing the firm $100K when courts reject poorly cited briefs.",
    question: "Your coordinator receives a synthesis report that lists 5 conclusions but only provides citations for 3 of them. The quality criteria require all conclusions to be cited. What should the coordinator do?",
    choices: {
      A: "Return the report with a note that 2 conclusions lack citations",
      B: "Remove the 2 uncited conclusions to maintain citation consistency",
      C: "Re-delegate to the search subagent to find sources for the 2 uncited conclusions, pass the results through analysis, then re-invoke synthesis to produce a fully cited report",
      D: "Add placeholder citations from the coordinator's knowledge"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: The coordinator should not deliver work that fails its own quality criteria. It should attempt automated remediation first.",
      B: "INCORRECT: The conclusions may be valid and important. Removing them rather than finding citations discards potentially valuable analysis.",
      C: "CORRECT: The iterative refinement loop: coordinator detects gaps (missing citations), re-delegates to search with targeted queries for the specific uncited conclusions, processes through analysis, and re-invokes synthesis until the quality criteria (all conclusions cited) are met.",
      D: "INCORRECT: The coordinator should not fabricate citations. Source attribution must come from actual search results verified through the research pipeline."
    }
  },
  {
    id: "d1-121",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Context Passing",
    difficulty: "hard",
    scenario: 1,
    importance: "A financial services system passing context between agents as unstructured text loses critical metadata—the analysis subagent sees '$1.5M revenue' but loses the attribution that it was from a preliminary, unaudited report.",
    question: "Your coordinator passes research findings between subagents. The findings include data from three sources with varying reliability: an SEC filing (authoritative), a news article (secondary), and a blog post (informal). How should the context be structured?",
    choices: {
      A: "Combine all findings into a single narrative paragraph for the receiving subagent",
      B: "Structure each finding with explicit metadata: source type, reliability level, URL, date, and the actual content. Separate the data from its provenance so the receiving subagent can weight findings appropriately",
      C: "Only pass findings from authoritative sources and discard secondary and informal sources",
      D: "Pass the findings sorted by source reliability, with a note at the top that earlier items are more reliable"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single narrative paragraph loses source attribution and reliability metadata. The receiving subagent cannot distinguish between SEC filing data and blog post speculation.",
      B: "CORRECT: Structured data formats that separate content from metadata preserve attribution and enable the receiving subagent to make informed decisions about source weighting. This is critical for producing properly cited, credible analysis.",
      C: "INCORRECT: Secondary sources may provide valuable perspectives or recent information not yet in formal filings. Discarding them reduces the analysis scope unnecessarily.",
      D: "INCORRECT: Implicit ordering as a reliability signal is fragile and could be misinterpreted. Explicit metadata labels are more reliable than positional conventions."
    }
  },
  {
    id: "d1-122",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Multi-Step Workflows",
    difficulty: "hard",
    scenario: 1,
    importance: "A healthcare billing agent that processes insurance claims without verifying coverage eligibility first submits 20% of claims incorrectly—each rejected claim costs $50 in reprocessing and delays patient care by 2 weeks.",
    question: "Your healthcare billing agent processes insurance claims with this workflow: verify patient identity, check coverage eligibility, validate procedure codes, calculate patient responsibility, submit claim. The agent occasionally submits claims with unverified procedure codes when the validation API is slow, interpreting the timeout as 'no issues found.' How do you prevent this?",
    choices: {
      A: "Increase the timeout for the procedure code validation API",
      B: "Implement programmatic gates where submit_claim is blocked unless ALL prerequisite steps (identity, eligibility, procedure validation, calculation) have returned successful results—timeouts and errors are NOT treated as success",
      C: "Add retry logic to the procedure code validation step with 3 attempts before proceeding",
      D: "Add a prompt instruction to always wait for procedure code validation before submitting"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Longer timeouts reduce the frequency of the problem but do not eliminate it. Slow responses or network issues can still cause timeouts.",
      B: "CORRECT: Programmatic gates that require explicit success responses from ALL prerequisites prevent the claim submission when any step times out or fails. The gate distinguishes between 'validated successfully' and 'no response/timeout,' treating only explicit success as meeting the prerequisite.",
      C: "INCORRECT: Retry logic reduces timeout frequency but after exhausting retries, the agent may still proceed without validation. The gate must block submission when validation has not succeeded.",
      D: "INCORRECT: Prompt instructions cannot differentiate between a successful empty response and a timeout. Programmatic gates with explicit success validation are required."
    }
  },
  {
    id: "d1-123",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 6,
    importance: "A financial data pipeline where one API returns 'status: 200' and another returns 'status: OK' for the same condition causes the model to treat them as different states—producing contradictory analysis in a $100M portfolio report.",
    question: "Your data extraction agent receives responses from two APIs. API-A returns {status: 200, data: {...}} while API-B returns {status: 'success', payload: {...}}. The model sometimes processes 'status: 200' as a data value rather than a success indicator. What is the comprehensive hook solution?",
    choices: {
      A: "Add format documentation for each API to the system prompt",
      B: "Implement PostToolUse hooks that normalize responses from both APIs into a consistent schema: extract the actual data payload, convert status indicators to a uniform format, and present a clean, consistent structure to the model",
      C: "Modify both APIs to return the same response format",
      D: "Train the model to recognize different API response formats"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Prompt-based format documentation is probabilistic. The model may still misinterpret status codes as data values, especially in complex extraction scenarios.",
      B: "CORRECT: PostToolUse hooks normalize heterogeneous response formats from different tools into a consistent schema before the model processes them. This includes extracting data payloads from wrapper objects, converting diverse status indicators to a uniform format, and presenting clean, consistent structures.",
      C: "INCORRECT: Modifying external APIs may not be possible (third-party services) and creates coupling between API design and agent requirements. Hooks decouple normalization from tool implementation.",
      D: "INCORRECT: Format recognition is not a training problem—it is a data normalization problem. Hooks solve it deterministically without model-level changes."
    }
  },
  {
    id: "d1-124",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "medium",
    scenario: 4,
    importance: "A code migration agent that tries to understand and migrate an entire 100K-line codebase in a single session produces a migration plan that misses 3 of 8 critical subsystems—the ones discovered only through deep dependency analysis.",
    question: "Your agent must plan a Python 2 to Python 3 migration for a large codebase. What task decomposition makes this tractable?",
    choices: {
      A: "Scan the entire codebase for Python 2 patterns in a single pass",
      B: "First map the project structure and dependency graph. Then identify the most commonly used Python 2 patterns. Create a prioritized migration plan that starts with foundational modules (used by many others) and works outward to dependent modules",
      C: "Migrate one file at a time in alphabetical order",
      D: "Use find-and-replace for known Python 2-to-3 syntax changes across all files simultaneously"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single-pass scan of a large codebase produces an overwhelming list of changes without prioritization or dependency awareness.",
      B: "CORRECT: Complex workflow decomposition starts by mapping structure (project layout, dependencies), identifying high-impact areas (foundational modules, common patterns), then creating a prioritized plan. Migrating foundational modules first ensures dependent modules can be tested incrementally.",
      C: "INCORRECT: Alphabetical ordering ignores dependencies. A file starting with 'Z' might be a foundational utility that should be migrated first because 100 other files depend on it.",
      D: "INCORRECT: Find-and-replace handles syntactic changes but misses semantic differences (e.g., integer division, string handling, library changes). Migration requires understanding, not just pattern matching."
    }
  },
  {
    id: "d1-125",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "hard",
    scenario: 4,
    importance: "A security audit team forking from a shared vulnerability assessment baseline enables parallel investigation of 4 attack vectors simultaneously—reducing a 2-week audit to 3 days.",
    question: "Your security audit team completed a baseline vulnerability assessment of a web application. They now need to explore 4 different attack vectors: SQL injection, XSS, authentication bypass, and API abuse. Each investigation requires different tools and approaches. What session strategy optimizes this?",
    choices: {
      A: "One session investigating all 4 vectors sequentially",
      B: "Four new sessions, each re-running the baseline assessment before investigating their vector",
      C: "Fork the baseline session into 4 branches, each investigating one attack vector independently from the shared baseline",
      D: "One session that uses subagents to investigate each vector in parallel"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Sequential investigation in one session is slow and each later investigation is influenced by the earlier ones' findings, potentially biasing the analysis.",
      B: "INCORRECT: Re-running the baseline assessment 4 times wastes the work already done. Fork preserves the shared baseline.",
      C: "CORRECT: Fork_session creates 4 independent branches from the shared vulnerability assessment baseline. Each fork retains the full baseline understanding (application structure, technology stack, identified entry points) but investigates its specific attack vector independently.",
      D: "INCORRECT: Subagents within a single session would not have the full baseline context that a forked session provides. Session forking gives each investigation branch the complete accumulated analysis context."
    }
  },
  {
    id: "d1-126",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 6,
    importance: "A tax document extraction agent that processes tool errors as valid data extracts 'Connection refused' as a taxpayer name and '$ERROR' as income—producing fraudulent-looking returns that trigger IRS audits.",
    question: "Your extraction agent calls a document_parse tool that returns an error: {error: 'Unsupported format', code: 415}. Your loop implementation wraps this in a tool_result and returns it to Claude. Claude then attempts to extract data from the error message text. What is the architectural fix?",
    choices: {
      A: "The loop should retry the tool call automatically without returning the error to Claude",
      B: "The loop should mark the tool_result with is_error: true so Claude understands this is a failure to reason about, not data to extract from",
      C: "The loop should terminate and return an error to the user",
      D: "The loop should replace the error with an empty result to prevent confusion"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Automatic retry without informing Claude prevents the model from reasoning about alternatives. The error might indicate an unsupported format that retrying cannot fix.",
      B: "CORRECT: Tool results that represent errors should be marked appropriately (is_error: true) so Claude can distinguish between data to process and errors to reason about. This allows Claude to decide whether to retry, try a different approach, or inform the user—rather than treating error text as extractable content.",
      C: "INCORRECT: Immediate termination prevents Claude from attempting recovery strategies. The error might be recoverable through a different tool or approach.",
      D: "INCORRECT: An empty result hides the error from Claude. The model would think the document is empty rather than understanding that parsing failed, leading to incorrect extraction conclusions."
    }
  },
  {
    id: "d1-127",
    domain: "D1",
    taskStatement: "1.2",
    topic: "Multi-Agent Orchestration",
    difficulty: "medium",
    scenario: 3,
    importance: "A research system that treats the coordinator as a simple dispatcher misses opportunities for quality improvement—coordinators that evaluate and refine produce reports rated 40% higher by clients.",
    question: "Which of the following is NOT a core responsibility of the coordinator in a hub-and-spoke multi-agent architecture?",
    choices: {
      A: "Task decomposition—analyzing the query and breaking it into appropriate subtasks",
      B: "Direct execution of specialist research tasks instead of delegating to subagents",
      C: "Result aggregation—combining subagent outputs into a coherent response",
      D: "Quality evaluation—assessing synthesis output and triggering refinement when gaps are detected"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Task decomposition is a core coordinator responsibility—analyzing queries and determining how to break them into subagent-appropriate subtasks.",
      B: "CORRECT: Direct execution of specialist tasks is NOT a coordinator responsibility. The coordinator delegates to specialist subagents rather than performing their work. Its role is decomposition, delegation, routing, aggregation, and quality evaluation.",
      C: "INCORRECT: Result aggregation is a core coordinator responsibility—combining and reconciling outputs from multiple subagents.",
      D: "INCORRECT: Quality evaluation is a core coordinator responsibility—assessing whether synthesis meets coverage criteria and triggering iterative refinement when needed."
    }
  },
  {
    id: "d1-128",
    domain: "D1",
    taskStatement: "1.3",
    topic: "Subagent Context",
    difficulty: "hard",
    scenario: 1,
    importance: "A financial services system where the analysis subagent receives only dollar amounts without the transaction descriptions produces risk assessments that miss fraudulent patterns visible only in the descriptions.",
    question: "Your coordinator passes financial transaction data to an analysis subagent. It includes transaction amounts but strips out merchant descriptions and timestamps to 'simplify the context.' The analysis subagent's fraud detection accuracy drops by 60%. What went wrong?",
    choices: {
      A: "The subagent needs more advanced fraud detection tools",
      B: "The coordinator's aggressive context simplification removed fields critical for fraud pattern detection. When passing context to subagents, the coordinator must preserve all information needed for the receiving agent to perform its specific task",
      C: "The fraud detection model needs retraining on simplified data",
      D: "The coordinator should pass the raw database records instead of processed data"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The subagent's tools are not the issue. Fraud detection patterns require merchant descriptions (recognizing suspicious merchants) and timestamps (detecting velocity patterns) that were stripped from the context.",
      B: "CORRECT: When passing context between agents, the coordinator must preserve all information the receiving agent needs to perform its task. Aggressive simplification that removes task-critical fields undermines the subagent's capabilities. The coordinator should curate for relevance, not strip for brevity.",
      C: "INCORRECT: The model does not need retraining—it needs the correct data. Merchant descriptions and timestamps are fundamental fraud signals, not training data artifacts.",
      D: "INCORRECT: Raw database records may contain excessive noise. The coordinator should curate intelligently—preserving critical fields while removing truly irrelevant data, not applying blanket simplification."
    }
  },
  {
    id: "d1-129",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Handoff Protocols",
    difficulty: "medium",
    scenario: 1,
    importance: "An insurance claims system where AI-to-human handoffs include only the customer's complaint but not the 3 resolution paths already tried forces adjusters to retry the same failed approaches—doubling claim resolution time.",
    question: "Your insurance claims agent attempts 3 resolution paths (goodwill credit, replacement, exchange) but all are blocked by system constraints. It escalates to a human adjuster. Reviewing the handoff options, which provides the most actionable escalation?",
    choices: {
      A: "Customer name + 'needs help with a claim'",
      B: "Customer name + claim number + 'tried to resolve but could not'",
      C: "Customer details, claim specifics, root cause analysis, three resolution paths attempted with reasons each failed, and recommendation to override the system constraint via admin access",
      D: "Full conversation transcript with highlighted keywords"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: This provides almost no actionable information. The adjuster must re-investigate the entire claim from scratch.",
      B: "INCORRECT: Slightly better but still forces the adjuster to discover what was tried and why it failed, wasting time on approaches already known to be blocked.",
      C: "CORRECT: Structured handoff with customer details, claim specifics, root cause, attempted resolutions (with failure reasons), and recommended next action gives the adjuster everything needed to continue efficiently. The recommendation to use admin access specifically addresses why the AI agent could not resolve it.",
      D: "INCORRECT: Conversation transcripts with highlights still require the adjuster to parse and synthesize. A pre-structured summary with actionable recommendations is far more efficient."
    }
  },
  {
    id: "d1-130",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 6,
    importance: "An international trade compliance system where country codes appear in 4 different formats (ISO alpha-2, alpha-3, numeric, full name) causes the model to treat 'US', 'USA', '840', and 'United States' as different countries—producing contradictory compliance reports.",
    question: "Your data extraction agent processes international trade documents from multiple sources. Country identifiers appear as ISO alpha-2 ('US'), alpha-3 ('USA'), numeric ('840'), and full names ('United States'). The model sometimes treats these as different countries when aggregating data. What is the deterministic solution?",
    choices: {
      A: "Include a country code mapping table in the system prompt",
      B: "Implement a PostToolUse hook that normalizes all country identifiers to a single standard (e.g., ISO alpha-2) before the model processes any tool results",
      C: "Create a country_lookup tool that the agent can call when it encounters unfamiliar country formats",
      D: "Train the model on country code equivalences using few-shot examples"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A mapping table in the prompt is probabilistic—the model may fail to consult it for every country identifier, especially in complex multi-source documents.",
      B: "CORRECT: A PostToolUse hook that normalizes all country identifiers to a single standard before the model sees them eliminates the ambiguity deterministically. The model always sees 'US' regardless of the source format, preventing false distinctions in aggregation.",
      C: "INCORRECT: Requiring the agent to call a lookup tool for each country identifier adds latency, relies on the agent to recognize when lookup is needed, and has a non-zero skip rate.",
      D: "INCORRECT: Few-shot examples cannot cover all possible country format combinations across all sources. Deterministic normalization is more reliable and comprehensive."
    }
  },
  {
    id: "d1-131",
    domain: "D1",
    taskStatement: "1.6",
    topic: "Task Decomposition",
    difficulty: "hard",
    scenario: 5,
    importance: "A monorepo CI agent that reviews 200 files across 8 services in one pass produces reviews so shallow that developers ignore them—a decomposed approach that catches real bugs earns developer trust and prevents 5 production incidents per month.",
    question: "Your CI/CD agent reviews PRs in a monorepo containing 8 microservices. A PR touches files across 4 services. What decomposition ensures thorough review without attention dilution?",
    choices: {
      A: "Review all changed files together to maximize cross-service context",
      B: "Per-service local review passes analyzing changes within each service, followed by a cross-service integration pass checking API contracts, shared schema changes, and deployment dependencies between the 4 affected services",
      C: "Only review the service with the most changes and flag the others for manual review",
      D: "Review each file individually with no service-level context"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Reviewing all files together across 4 services causes attention dilution. The model cannot deeply analyze each service while tracking cross-service relationships simultaneously.",
      B: "CORRECT: Per-service local passes provide deep analysis within each service boundary. The cross-service integration pass then specifically checks API contracts, shared schemas, and deployment dependencies. This mirrors the per-file/cross-file decomposition pattern applied at the service level.",
      C: "INCORRECT: Ignoring 3 of 4 affected services misses cross-service issues that may be the most impactful part of the PR.",
      D: "INCORRECT: Per-file review without service context misses how changes within a service relate to each other. The service level is the appropriate granularity for local analysis."
    }
  },
  {
    id: "d1-132",
    domain: "D1",
    taskStatement: "1.7",
    topic: "Session Management",
    difficulty: "medium",
    scenario: 2,
    importance: "A debugging session forked to test a risky patch allows the developer to see if the patch works without contaminating the main investigation—if the patch fails, they return to the original session without any state pollution.",
    question: "A developer is debugging an issue and wants to test a risky hypothesis that involves modifying several files. They are afraid of contaminating their current investigation if the hypothesis is wrong. What session management approach protects their current work?",
    choices: {
      A: "Make the changes in the current session and use git to revert if the hypothesis is wrong",
      B: "Use fork_session to create a branch for the risky hypothesis. If it fails, the original session's context remains clean for continued investigation",
      C: "Start a completely new session for the hypothesis to avoid any connection to the original investigation",
      D: "Document the current state before making changes so it can be manually recreated"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Git reverts handle file changes but do not undo the session's context contamination. The agent's conversation now includes the failed hypothesis analysis, potentially biasing further investigation.",
      B: "CORRECT: fork_session creates an independent branch from the current state. If the hypothesis fails, the original session remains completely uncontaminated—no context from the failed experiment affects the main investigation line.",
      C: "INCORRECT: A new session loses the accumulated debugging context. The whole point of forking is to carry the context forward while protecting the original.",
      D: "INCORRECT: Manual state documentation is error-prone and cannot capture the full session context (tool results, reasoning chain) that informs the investigation."
    }
  },
  {
    id: "d1-133",
    domain: "D1",
    taskStatement: "1.1",
    topic: "Agentic Loop",
    difficulty: "hard",
    scenario: 3,
    importance: "A research agent that queues up findings across iterations but never gets stop_reason='end_turn' because of a malformed tool result runs indefinitely—consuming $10K in API costs before manual intervention.",
    question: "Your research agent enters an infinite loop—it keeps calling tools without ever reaching stop_reason='end_turn'. Investigation reveals that the tool_result for the final synthesis step contains malformed JSON that Claude interprets as needing correction, triggering another tool call to fix the data. What architectural safeguard should be in place?",
    choices: {
      A: "The primary stopping mechanism (stop_reason) should be supplemented with a secondary safety cap that triggers a warning and graceful shutdown after an unusually high iteration count, rather than allowing unbounded execution",
      B: "Validate tool results before returning them to Claude to prevent malformed data",
      C: "Add a timeout that kills the process after 5 minutes",
      D: "Limit the agent to a maximum of 3 unique tools per session"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: While stop_reason is the primary mechanism, a secondary safety cap serves as a guardrail against edge cases like this. The cap should trigger a warning and graceful shutdown rather than allowing unbounded execution. This is not the same as using the cap as the PRIMARY mechanism—it is a safety net for exceptional cases.",
      B: "INCORRECT: Validating tool results is good practice but does not protect against all infinite loop scenarios. The safety cap addresses the broader category of runaway loops regardless of cause.",
      C: "INCORRECT: A blanket time-based timeout does not account for legitimate long-running research tasks. A generous iteration-based safety cap with logging is more appropriate.",
      D: "INCORRECT: Limiting unique tools prevents the agent from using its full capability. The issue is the loop not terminating, not the number of tools."
    }
  },
  {
    id: "d1-134",
    domain: "D1",
    taskStatement: "1.4",
    topic: "Workflow Enforcement",
    difficulty: "hard",
    scenario: 1,
    importance: "A securities trading compliance system where order validation is only prompt-enforced allows 0.1% of orders to bypass pre-trade checks—at $50B daily volume, that is $50M in unchecked trades creating regulatory exposure.",
    question: "Your trading compliance agent must enforce three sequential checks before order execution: (1) position limit check, (2) restricted list screening, (3) market impact assessment. Each check requires the output of the previous one. A developer implements this as prompt instructions. In stress testing, 0.1% of orders skip check #2 when check #1 takes unusually long. What is the failure mode and the fix?",
    choices: {
      A: "The prompt needs more emphasis on the mandatory nature of check #2",
      B: "The model interprets the long response time from check #1 as implicit approval and skips to check #3. The fix is programmatic chained gates: check #2's tool is blocked until check #1 returns explicit success, and check #3 is blocked until check #2 returns explicit success. Timeouts and slow responses are never treated as success.",
      C: "Add a retry mechanism for slow checks to prevent timeouts",
      D: "Run all three checks in parallel to avoid timeout issues"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: More prompt emphasis does not address the timeout-related failure mode. The model's behavior under unusual latency conditions cannot be controlled by prompt instructions alone.",
      B: "CORRECT: Programmatic chained gates enforce sequential dependencies deterministically. Each gate requires an EXPLICIT success response from the prerequisite—not just any response, and certainly not a timeout. This eliminates the failure mode where slow responses are misinterpreted.",
      C: "INCORRECT: Retry logic reduces timeout frequency but does not enforce the sequential dependency. After exhausting retries, the system still needs a gate to prevent skipping.",
      D: "INCORRECT: The checks are explicitly sequential—each requires the previous check's output. Parallel execution is architecturally incorrect for this workflow."
    }
  },
  {
    id: "d1-135",
    domain: "D1",
    taskStatement: "1.5",
    topic: "Hooks",
    difficulty: "hard",
    scenario: 1,
    importance: "A healthcare claims processing agent that can approve claims without running required fraud checks has a 2% false approval rate—each false approval costs $45K on average, totaling $9M annually for a large insurer.",
    question: "Your healthcare claims agent has access to approve_claim, deny_claim, and request_review tools. A new regulation requires that all claims above $5,000 must pass a fraud scoring check before any approval or denial. The fraud scoring service is accessed via a separate tool. What hook implementation enforces this end-to-end?",
    choices: {
      A: "A PostToolUse hook on the fraud scoring tool that logs the result",
      B: "A pre-execution hook on BOTH approve_claim and deny_claim that checks: (1) if the claim amount exceeds $5,000, and (2) if the fraud_score tool has been called for this claim and returned a result. If either condition fails, the hook blocks the action and returns a message instructing the model to run fraud scoring first",
      C: "A system prompt instruction requiring fraud scoring for claims above $5,000",
      D: "A pre-execution hook only on approve_claim, since denied claims do not need fraud checks"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Logging the fraud score result does not enforce that it must be completed before approval or denial. Logging is observability, not enforcement.",
      B: "CORRECT: The hook must be on BOTH approve_claim and deny_claim because the regulation requires fraud scoring before any disposition. The hook validates two conditions: amount threshold and fraud score completion. Blocking both approval and denial until fraud scoring completes ensures regulatory compliance regardless of the model's disposition decision.",
      C: "INCORRECT: Prompt-based enforcement has a non-zero failure rate. For regulatory requirements, programmatic hooks with deterministic enforcement are required.",
      D: "INCORRECT: The regulation requires fraud scoring before ANY disposition, including denials. A fraudulently denied claim might have been erroneously flagged, and the fraud score provides information needed for accurate denial as well."
    }
  }
];
