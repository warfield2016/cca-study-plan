// D4: Prompt Engineering & Structured Output — 100 questions
export const d4Questions = [
  {
    id: "d4-001",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Explicit Criteria & Precision",
    difficulty: "hard",
    scenario: 5,
    importance: "In a Fortune 500 company's CI/CD pipeline processing 2,000 PRs per week, even a 5% false positive rate means 100 spurious warnings that erode developer trust across every team.",
    question: "Your automated code review system flags too many false positives in comment accuracy checks. Developers are starting to ignore all review findings. The current prompt says 'Check that code comments are accurate and helpful.' Which change will most effectively reduce false positives while maintaining useful detection?",
    choices: {
      A: "Add 'Be conservative and only flag comments you are very confident are wrong' to the system prompt",
      B: "Replace the instruction with 'Flag a comment only when the described behavior directly contradicts the actual code behavior, such as a comment stating a function returns a list when it returns a dictionary'",
      C: "Reduce the model temperature to 0 to make the output more deterministic and less prone to false flags",
      D: "Add a confidence score threshold so only findings above 0.9 confidence are reported to developers"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Vague qualifiers like 'be conservative' and 'very confident' do not give the model actionable criteria for distinguishing true issues from false positives. Studies show these general instructions fail to measurably improve precision.",
      B: "CORRECT: Replacing vague instructions with explicit categorical criteria ('described behavior directly contradicts actual code behavior') gives the model a concrete decision boundary. This transforms an ambiguous judgment call into a verifiable condition, dramatically reducing false positives.",
      C: "INCORRECT: Temperature reduction affects output randomness but does not address the fundamental problem of vague review criteria. The model will still apply the same imprecise standard, just more consistently.",
      D: "INCORRECT: Confidence scoring is explicitly less effective than explicit criteria for this problem. The model's self-assessed confidence does not reliably correlate with actual correctness when the underlying criteria are vague."
    }
  },
  {
    id: "d4-002",
    domain: "D4",
    taskStatement: "4.1",
    topic: "False Positive Trust Erosion",
    difficulty: "hard",
    scenario: 5,
    importance: "At a fintech company with 300 engineers, false positive contagion from one unreliable check category caused a 40% drop in developer engagement with all automated review findings.",
    question: "Your CI/CD code review pipeline has six check categories. One category ('unused import detection') has a 35% false positive rate, while the others are below 5%. Developers have begun dismissing findings from ALL categories, including the reliable ones. What is the most effective immediate remediation?",
    choices: {
      A: "Add few-shot examples to the unused import detection prompt to improve its accuracy before the next sprint",
      B: "Temporarily disable the unused import detection category entirely while refining its criteria, preserving trust in the remaining five categories",
      C: "Add a disclaimer to unused import findings saying 'This category has known accuracy issues' so developers can calibrate their trust",
      D: "Implement a voting system where three independent Claude instances must agree before flagging an unused import"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: While few-shot examples may eventually improve accuracy, continuing to surface a high-FP category during refinement perpetuates the trust erosion. The immediate priority is stopping the damage, not iterating in production.",
      B: "CORRECT: False positive contagion means a single unreliable category erodes trust in ALL categories. Temporarily disabling the problematic category is the most effective immediate action to restore developer trust in the overall system while the criteria are refined offline.",
      C: "INCORRECT: Disclaimers add cognitive load and do not solve the contagion problem. Developers who see unreliable results from one category transfer that skepticism to the entire system regardless of per-category disclaimers.",
      D: "INCORRECT: Multi-instance voting adds latency and cost without addressing the root cause (vague detection criteria). If the criteria are imprecise, multiple instances applying the same vague criteria will still produce false positives."
    }
  },
  {
    id: "d4-003",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Severity Criteria Design",
    difficulty: "medium",
    scenario: 5,
    importance: "A healthcare software company needs consistent severity classification in automated reviews so critical patient-safety bugs are never downgraded to low severity.",
    question: "You are designing severity levels for an automated code review system. Which approach to defining severity criteria will produce the most consistent classifications?",
    choices: {
      A: "Define severity as 'critical = very important issues, major = important issues, minor = small issues' and let the model use its judgment",
      B: "Provide explicit criteria with concrete code examples for each severity level, such as 'critical: unhandled null pointer in payment processing path (example: ...), major: missing input validation on user-facing endpoint (example: ...)'",
      C: "Use a numeric scoring system from 1-10 and let the model assign scores based on its understanding of code quality",
      D: "Define severity based on file location: 'critical if in /core, major if in /api, minor if in /utils'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Circular definitions using synonyms ('very important' for 'critical') provide no actionable criteria. The model has no concrete basis for distinguishing between levels.",
      B: "CORRECT: Explicit criteria paired with concrete code examples for each severity level give the model a clear decision framework. Examples demonstrate the boundary between levels and anchor the model's judgment to specific, verifiable patterns.",
      C: "INCORRECT: A numeric scale without anchoring examples is even more ambiguous than named levels. Different model calls may assign wildly different scores to identical issues.",
      D: "INCORRECT: File location is a poor proxy for severity. A critical security vulnerability in /utils is more severe than a style issue in /core. This approach ignores the actual nature of the finding."
    }
  },
  {
    id: "d4-004",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Criteria Specificity vs Generality",
    difficulty: "hard",
    scenario: 5,
    importance: "A trading platform's automated review pipeline must distinguish between genuine race conditions and acceptable concurrent patterns, where a false negative on a real race condition could cause financial losses.",
    question: "Your code review prompt currently says 'Flag potential concurrency issues.' The system generates many false positives on standard thread-safe patterns. Which revised instruction best balances precision with recall?",
    choices: {
      A: "Flag concurrency issues only when you see shared mutable state accessed from multiple threads without synchronization primitives (locks, atomics, or channels) within the same execution path",
      B: "Be more careful about flagging concurrency issues and only flag ones you are certain about",
      C: "Flag concurrency issues but exclude any code that uses the threading or asyncio standard libraries",
      D: "Flag concurrency issues and assign a risk score from 1-10; only issues scoring above 7 should be shown to developers"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: This provides specific categorical criteria defining exactly what constitutes a flaggable concurrency issue: shared mutable state + multi-thread access + absence of synchronization. This gives the model concrete conditions to check rather than a vague judgment call.",
      B: "INCORRECT: 'Be more careful' and 'certain' are vague qualifiers that do not provide actionable detection criteria. The model has no concrete standard for calibrating its certainty.",
      C: "INCORRECT: Excluding entire libraries creates dangerous blind spots. Thread-safe library usage does not preclude concurrency bugs in how those libraries are used together.",
      D: "INCORRECT: Self-assigned risk scores from the model do not reliably correlate with actual issue severity. This adds a layer of unreliable filtering on top of vague criteria."
    }
  },
  {
    id: "d4-005",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Explicit Criteria for SQL Injection",
    difficulty: "medium",
    scenario: 5,
    importance: "An e-commerce platform processing millions of transactions needs its automated security review to catch real SQL injection vectors without drowning developers in false positives on parameterized queries.",
    question: "Your security review prompt says 'Check for SQL injection vulnerabilities.' It flags every SQL query, including properly parameterized ones. How should you refine the criteria?",
    choices: {
      A: "Check for SQL injection vulnerabilities but be less aggressive in your flagging",
      B: "Flag SQL queries only when user-supplied input is concatenated directly into query strings without parameterization or prepared statements; do NOT flag queries using parameterized placeholders (?, :name, %s)",
      C: "Only check for SQL injection in files that contain the word 'user' or 'input' in their filename",
      D: "Add a system prompt telling Claude it is a senior security engineer who should use expert judgment"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: 'Be less aggressive' is a vague qualifier that does not define what constitutes a real vulnerability versus a false positive.",
      B: "CORRECT: This defines explicit positive and negative criteria. The model knows exactly what to flag (string concatenation with user input) and what to skip (parameterized queries), eliminating the most common class of false positives.",
      C: "INCORRECT: SQL injection can occur in any file regardless of naming conventions. This arbitrary filter misses real vulnerabilities while providing no precision benefit.",
      D: "INCORRECT: Role-playing as a senior engineer does not provide concrete detection criteria. Domain expertise personas do not substitute for explicit categorical rules."
    }
  },
  {
    id: "d4-006",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Precision in Test Generation Review",
    difficulty: "hard",
    scenario: 5,
    importance: "A SaaS company's test coverage initiative relies on automated test quality review, where false positives on valid test patterns waste developer time and undermine the testing culture.",
    question: "Your automated test review system flags tests as 'insufficiently assertive' too often, including tests that appropriately verify a single behavior with one assertion. The prompt says 'Ensure tests have thorough assertions.' What is the best revision?",
    choices: {
      A: "Flag a test as insufficiently assertive only when: (1) the test name implies verification of a specific behavior, (2) no assertion checks the output or side effect corresponding to that behavior, and (3) the test only asserts on trivially true conditions like asserting a variable is not None without checking its value",
      B: "Ensure tests have thorough assertions, but allow single-assertion tests if they seem reasonable",
      C: "Require at least 3 assertions per test method to be considered thorough",
      D: "Add the instruction 'Use your best judgment about what constitutes a sufficient assertion'"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: This provides a three-part explicit criteria defining what 'insufficiently assertive' means in concrete, verifiable terms. It distinguishes legitimate single-assertion tests from genuinely weak ones by checking the relationship between test intent and assertion content.",
      B: "INCORRECT: 'Seem reasonable' is subjective and provides no concrete standard for the model to apply consistently.",
      C: "INCORRECT: A fixed assertion count ignores test intent. Some behaviors are correctly verified with one precise assertion; forcing three leads to meaningless padding assertions.",
      D: "INCORRECT: Deferring to 'best judgment' without criteria is exactly the vague instruction pattern that causes inconsistent results."
    }
  },
  {
    id: "d4-007",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Category-Level False Positive Management",
    difficulty: "medium",
    scenario: 5,
    importance: "A cloud infrastructure team's automated Terraform review generates noise from style-related findings, masking critical security misconfigurations in IAM policies.",
    question: "Your infrastructure-as-code review system has categories: security misconfigurations, naming conventions, documentation completeness, and resource tagging. The naming conventions category has a 25% false positive rate. Which approach best restores overall system credibility?",
    choices: {
      A: "Keep all categories active but add 'be very precise' to the naming conventions prompt",
      B: "Disable the naming conventions category, analyze its false positive patterns, and re-enable it with explicit criteria defining which naming violations to flag versus skip",
      C: "Reduce the priority of naming convention findings so they appear at the bottom of the report",
      D: "Merge naming conventions into the documentation completeness category to dilute the false positive rate"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: 'Be very precise' is a vague qualifier that does not provide the model with concrete criteria for distinguishing real naming violations from acceptable patterns.",
      B: "CORRECT: This follows the recommended pattern: disable the high-FP category to stop trust erosion, analyze the false positive patterns systematically, then re-enable with explicit criteria derived from that analysis.",
      C: "INCORRECT: Lower priority does not eliminate false positives. Developers still see unreliable findings, and the trust contagion effect persists regardless of display order.",
      D: "INCORRECT: Merging categories obscures the problem and contaminates a previously reliable category. The false positive rate simply transfers to the merged category."
    }
  },
  {
    id: "d4-008",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Output Consistency",
    difficulty: "hard",
    scenario: 5,
    importance: "A DevOps team at a major bank needs consistent, machine-parseable code review output that integrates with their existing Jira workflow automation.",
    question: "Your code review pipeline produces inconsistent output formats: sometimes bullet points, sometimes paragraphs, sometimes JSON-like structures. You have tried detailed formatting instructions in the system prompt but outputs remain inconsistent. What is the most effective next step?",
    choices: {
      A: "Add more detailed formatting instructions with even more specific rules about when to use which format",
      B: "Provide 2-4 few-shot examples showing the exact desired output format for different types of findings, including edge cases like 'no issues found'",
      C: "Switch to a larger model that better follows formatting instructions",
      D: "Post-process the output with regex to normalize formatting inconsistencies"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: When detailed instructions alone produce inconsistent results, adding more instructions rarely helps. The problem is that the model needs to see the format demonstrated, not described at greater length.",
      B: "CORRECT: Few-shot examples are the most effective technique for achieving consistently formatted output when instructions alone produce inconsistent results. Showing 2-4 examples of the desired format, including edge cases, gives the model concrete patterns to match.",
      C: "INCORRECT: Format inconsistency is typically a prompting issue, not a model capability issue. Larger models still need clear format demonstrations for consistent output.",
      D: "INCORRECT: Post-processing with regex is brittle and does not address the root cause. It also cannot fix semantic inconsistencies in how findings are structured."
    }
  },
  {
    id: "d4-009",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot Ambiguous Case Handling",
    difficulty: "hard",
    scenario: 6,
    importance: "A legal tech firm extracting contract terms from diverse document formats needs the extraction system to handle ambiguous clauses consistently rather than guessing differently each time.",
    question: "Your contract extraction system inconsistently handles clauses that could be interpreted as either indemnification or limitation of liability. Sometimes it classifies them one way, sometimes the other, and sometimes it invents a hybrid category. How should you address this?",
    choices: {
      A: "Add an instruction: 'When a clause is ambiguous between indemnification and limitation of liability, always classify it as indemnification'",
      B: "Provide few-shot examples that include 2-3 ambiguous clauses with explicit reasoning showing how to handle each ambiguity, including an example that outputs 'classification: ambiguous, possible_categories: [indemnification, limitation_of_liability]'",
      C: "Increase temperature to allow the model to explore more classification possibilities",
      D: "Add a confidence threshold: only output a classification if the model is more than 80% confident"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Forcing a default classification for ambiguous cases loses important information. Downstream legal review needs to know when a clause is genuinely ambiguous, not receive a fabricated certainty.",
      B: "CORRECT: Few-shot examples demonstrating ambiguous-case handling teach the model a consistent strategy for edge cases. Including examples that explicitly model ambiguity (with possible_categories) shows the model how to handle uncertainty rather than guessing.",
      C: "INCORRECT: Higher temperature increases randomness, which would make the inconsistency worse, not better.",
      D: "INCORRECT: Self-assessed confidence scores do not reliably distinguish ambiguous cases from clear ones. The model may assign high confidence to incorrect classifications."
    }
  },
  {
    id: "d4-010",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Extraction Hallucination Reduction",
    difficulty: "medium",
    scenario: 6,
    importance: "A pharmaceutical company extracting dosage information from clinical trial reports cannot tolerate hallucinated data points that could affect drug safety analysis.",
    question: "Your extraction system occasionally invents data points that are not present in the source document, particularly when a field is expected but absent. What is the most effective technique to reduce this hallucination?",
    choices: {
      A: "Add an instruction: 'Do not hallucinate or make up information that is not in the document'",
      B: "Provide few-shot examples including cases where expected fields are absent from the source, demonstrating the correct output of null or 'not found' for those fields",
      C: "Reduce the model temperature to 0 to eliminate creative generation",
      D: "Add a system prompt establishing the model as a careful data scientist who never invents data"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Telling the model not to hallucinate is a vague meta-instruction. The model does not have reliable introspective access to distinguish its extractions from its generations.",
      B: "CORRECT: Few-shot examples are effective for reducing extraction hallucination because they demonstrate the correct behavior when data is absent. Showing the model that outputting null for missing fields is the expected response trains it to resist the tendency to fill in blanks.",
      C: "INCORRECT: Temperature 0 reduces randomness but does not prevent hallucination. The model can still confidently generate plausible-sounding data that is not in the source.",
      D: "INCORRECT: Role-based prompting does not provide the concrete behavioral examples needed to consistently handle missing data scenarios."
    }
  },
  {
    id: "d4-011",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot Example Count",
    difficulty: "medium",
    scenario: 6,
    importance: "A research lab processing thousands of academic papers needs to balance extraction quality against per-document processing cost in their literature review pipeline.",
    question: "A colleague suggests adding 15 few-shot examples to your document extraction prompt to cover every possible edge case. Currently you have 3 examples and they work well for common cases. What is the best response?",
    choices: {
      A: "Add all 15 examples because more examples always improve quality",
      B: "Keep the 3 current examples and add 1-2 more only for specific ambiguous scenarios not covered by the existing examples, as 2-4 targeted examples typically outperform larger sets",
      C: "Remove all few-shot examples and rely entirely on detailed instructions to save tokens",
      D: "Add all 15 examples but compress them to save token costs"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Beyond 2-4 targeted examples, returns diminish significantly. Additional examples consume tokens without proportional quality gains, and may even confuse the model by introducing contradictory patterns.",
      B: "CORRECT: Research shows that 2-4 targeted few-shot examples are the sweet spot. Adding examples should be targeted at specific ambiguous scenarios not already covered, rather than exhaustively enumerating every edge case.",
      C: "INCORRECT: The original problem states that instructions alone produce inconsistent results. Removing the examples that provide consistency would regress quality.",
      D: "INCORRECT: Compressed examples lose the detail that makes them effective. The value of few-shot examples comes from showing complete, realistic input-output pairs."
    }
  },
  {
    id: "d4-012",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Novel Pattern Generalization",
    difficulty: "hard",
    scenario: 6,
    importance: "An insurance company processing claims from diverse document formats needs the extraction system to generalize from known formats to novel document layouts without manual template creation.",
    question: "Your document extraction system works well on the three invoice formats you included as few-shot examples, but fails on a fourth format with a different layout. Rather than adding examples for every possible format, how should you design your few-shot examples to maximize generalization?",
    choices: {
      A: "Add one example of the new format and continue adding examples as new formats appear",
      B: "Design examples that demonstrate the reasoning process for identifying target fields regardless of layout, showing how to locate amounts by semantic context rather than positional rules",
      C: "Switch to a rule-based extraction system since the model cannot generalize across formats",
      D: "Include a comprehensive list of all possible field locations in the system prompt"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Reactively adding examples for each new format does not scale. The system will fail on every unseen format until a specific example is added.",
      B: "CORRECT: Few-shot examples that demonstrate reasoning about how to identify fields by semantic context (e.g., 'the amount following the word Total') enable generalization to novel layouts. The model learns the extraction strategy, not just specific positional patterns.",
      C: "INCORRECT: Language models can generalize across document formats when given examples that demonstrate the right reasoning strategy. Abandoning the approach is premature.",
      D: "INCORRECT: A static list of field locations cannot cover all possible formats and breaks whenever a new layout appears."
    }
  },
  {
    id: "d4-013",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot Distinguishing Patterns",
    difficulty: "hard",
    scenario: 5,
    importance: "A cybersecurity firm's automated vulnerability scanner must distinguish between intentional security patterns (like hash comparisons in authentication) and actual hardcoded secrets.",
    question: "Your security scanning tool flags too many false positives on base64-encoded configuration values that are not secrets. You want to add few-shot examples to help the model distinguish secrets from non-secrets. Which example set design is most effective?",
    choices: {
      A: "Include only examples of real secrets so the model knows exactly what to flag",
      B: "Include examples of both genuine secrets and acceptable patterns that look similar but are not secrets, with explicit reasoning for why each is or is not a security issue",
      C: "Include examples of the most common types of secrets (API keys, passwords, tokens) only",
      D: "Include 10 examples of secrets and 1 example of a non-secret to establish a strong pattern"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Showing only positive examples does not teach the model the decision boundary. Without negative examples, the model cannot learn what distinguishes flaggable secrets from acceptable similar-looking patterns.",
      B: "CORRECT: Including both genuine issues and acceptable patterns that superficially resemble issues, with explicit reasoning, teaches the model the precise boundary between flaggable and non-flaggable patterns. This is the most effective few-shot design for reducing false positives.",
      C: "INCORRECT: This covers only common secret types and provides no negative examples. The false positive problem specifically involves non-secrets being flagged, so negative examples are essential.",
      D: "INCORRECT: A 10:1 ratio of positive to negative examples biases the model toward flagging. Balanced representation of both categories with clear reasoning produces better boundary learning."
    }
  },
  {
    id: "d4-014",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Document Structure Variance",
    difficulty: "medium",
    scenario: 6,
    importance: "A logistics company extracting shipment details from carrier documents receives invoices in dozens of different layouts from different carriers worldwide.",
    question: "Your shipment extraction system needs to handle varied document structures from different carriers. Some have tables, some have free-form text, some mix both. What few-shot approach best handles this structural variance?",
    choices: {
      A: "Create separate prompts for each document structure type and route documents to the appropriate prompt",
      B: "Provide examples covering 2-3 structurally different documents, showing how the same fields are extracted from each structure using consistent output format",
      C: "Use a single example of the most common structure and let the model figure out other structures",
      D: "Provide examples only for the output format without showing input documents"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Maintaining separate prompts for each structure type creates a routing problem and does not scale as new carrier formats appear. It also requires a reliable document classifier.",
      B: "CORRECT: Showing 2-3 structurally diverse examples with consistent extraction output teaches the model to recognize target fields across different layouts. This enables generalization to new structures without per-format prompts.",
      C: "INCORRECT: A single example locks the model into one structural pattern. When encountering a different structure, it may fail to locate fields or hallucinate based on the expected positions from the single example.",
      D: "INCORRECT: Without input examples, the model has no demonstration of how to navigate different document structures to locate target fields."
    }
  },
  {
    id: "d4-015",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Tool Use for Guaranteed Schema Compliance",
    difficulty: "medium",
    scenario: 6,
    importance: "A financial data pipeline feeding into a regulatory reporting system requires 100% schema-valid JSON output; even one malformed response halts the entire filing process.",
    question: "Your extraction pipeline sometimes produces malformed JSON when relying on text-based output with instructions to return JSON. Which approach guarantees schema-compliant output structure?",
    choices: {
      A: "Add 'You MUST return valid JSON. Double-check your output format before responding' to the prompt",
      B: "Define an extraction tool with a JSON schema as its input parameters and use tool_choice to force tool usage",
      C: "Post-process the output with a JSON parser and retry on parse failure",
      D: "Use XML output format instead of JSON since it is more forgiving of syntax errors"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Instructions to return valid JSON reduce but do not eliminate syntax errors. The model can still produce malformed JSON despite instructions.",
      B: "CORRECT: Tool use with JSON schemas is the most reliable approach for guaranteed schema-compliant output. The API enforces that the response matches the defined schema, completely eliminating JSON syntax errors.",
      C: "INCORRECT: Retry-on-failure is a reactive approach that adds latency, does not guarantee eventual success, and wastes API calls. It addresses symptoms rather than the root cause.",
      D: "INCORRECT: XML has its own syntax requirements and is not inherently more reliable. Tool use with JSON schemas provides a programmatic guarantee that no output format approach can match."
    }
  },
  {
    id: "d4-016",
    domain: "D4",
    taskStatement: "4.3",
    topic: "tool_choice Settings",
    difficulty: "hard",
    scenario: 6,
    importance: "A data processing pipeline must guarantee structured output for every document but cannot predict which of several extraction tools will be appropriate for an unknown document type.",
    question: "Your pipeline receives documents of unknown type and must always return structured data. You have defined tools for invoice extraction, receipt extraction, and contract extraction. Which tool_choice setting is correct?",
    choices: {
      A: "tool_choice: 'auto' because the model should choose the right tool based on document content",
      B: "tool_choice: 'any' because it guarantees the model will call one of the defined tools, ensuring structured output regardless of document type",
      C: "Force a specific tool like 'invoice_extraction' and handle mismatches downstream",
      D: "tool_choice: 'auto' with a fallback to text parsing if no tool is called"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: tool_choice 'auto' allows the model to return plain text instead of calling a tool. For unknown document types, the model may decide none of the tools fit and return unstructured text, breaking the pipeline.",
      B: "CORRECT: tool_choice 'any' guarantees the model will call one of the defined tools, ensuring structured output. The model still chooses the most appropriate tool based on document content, but is required to use one of them.",
      C: "INCORRECT: Forcing a specific tool when the document type is unknown will produce poor results when the document does not match the forced tool. The extraction will attempt to fit the wrong schema to the document.",
      D: "INCORRECT: A text parsing fallback reintroduces the unstructured output problem. The goal is to guarantee structured output, which 'auto' cannot do."
    }
  },
  {
    id: "d4-017",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema vs Semantic Correctness",
    difficulty: "hard",
    scenario: 6,
    importance: "An accounting firm's automated invoice processing must catch when extracted line items do not sum to the extracted total, as these discrepancies indicate extraction errors that could cause financial misstatements.",
    question: "You have implemented tool use with a strict JSON schema for invoice extraction. Your schema includes fields for line_items (array of amounts) and total_amount. A team member says 'We have schema validation so our extractions are guaranteed correct.' Why is this claim insufficient?",
    choices: {
      A: "Because JSON schemas cannot enforce data types precisely enough",
      B: "Because strict JSON schemas eliminate syntactic errors but NOT semantic errors; the line items may not sum to the total, or values may be extracted from the wrong fields in the document",
      C: "Because the model may refuse to use the tool if the document is complex",
      D: "Because JSON schemas do not support nested objects needed for line items"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: JSON schemas can enforce data types effectively. The issue is not type precision but the gap between structural validity and semantic correctness.",
      B: "CORRECT: JSON schemas guarantee structural/syntactic compliance but cannot enforce semantic constraints. The output will always be valid JSON matching the schema, but the values may be wrong: line items might not sum to the total, dates might be from the wrong fields, or amounts might be misattributed.",
      C: "INCORRECT: With tool_choice set appropriately, the model will use the tool regardless of document complexity. Tool refusal is not the core issue here.",
      D: "INCORRECT: JSON schemas fully support nested objects, arrays, and complex structures. This is not a schema limitation."
    }
  },
  {
    id: "d4-018",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Nullable Fields for Absent Data",
    difficulty: "medium",
    scenario: 6,
    importance: "A medical records extraction system must clearly distinguish between 'patient has no allergies' and 'allergy information was not found in the document' to avoid dangerous clinical assumptions.",
    question: "Your extraction schema has a required field 'allergies' for medical documents. Some documents genuinely do not contain allergy information. How should you design the schema to handle this?",
    choices: {
      A: "Make the allergies field optional so it is simply omitted when absent",
      B: "Design the allergies field as nullable with a companion field like 'allergies_status' using an enum of ['found', 'not_in_document', 'explicitly_none'] to distinguish between absent data and confirmed no allergies",
      C: "Default the allergies field to an empty string when not found",
      D: "Add an instruction to the prompt: 'If allergies are not mentioned, write N/A'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Simply omitting the field makes it impossible for downstream systems to distinguish between 'not found in document' and 'processing error.' The absence is ambiguous.",
      B: "CORRECT: A nullable field with an explicit status enum allows the system to distinguish between three critical states: allergy information was found, the document does not contain allergy information, and the document explicitly states no allergies. This prevents dangerous clinical assumptions.",
      C: "INCORRECT: An empty string is ambiguous. It could mean not found, no allergies, or a processing error. Critical medical systems need explicit state distinctions.",
      D: "INCORRECT: Text-based N/A values are fragile (N/A vs NA vs n/a vs None), inconsistent across calls, and harder for downstream systems to parse reliably."
    }
  },
  {
    id: "d4-019",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Enum with Other Pattern",
    difficulty: "medium",
    scenario: 6,
    importance: "A customer feedback categorization system for a retail chain must handle categories that do not fit predefined labels without losing the information or forcing incorrect categorization.",
    question: "Your feedback extraction schema uses an enum for category: ['product_quality', 'shipping', 'customer_service', 'pricing']. Users occasionally raise issues that do not fit these categories. What is the best schema design?",
    choices: {
      A: "Add more enum values to cover every possible category",
      B: "Use an enum with an 'other' value plus a 'category_detail' string field that is populated when 'other' is selected, providing both structured categorization and flexibility for edge cases",
      C: "Remove the enum and use a free-text category field for maximum flexibility",
      D: "Add a catch-all 'miscellaneous' enum value without any detail field"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Attempting to enumerate every possible category is impractical and creates an unwieldy enum that still cannot anticipate every future category.",
      B: "CORRECT: The enum-with-other pattern provides structured categorization for common cases while capturing detail for edge cases. The detail field preserves the specific information that would be lost with a simple 'other' or 'miscellaneous' label.",
      C: "INCORRECT: Free-text categories lose the structured categorization benefit. Downstream systems cannot reliably group, filter, or aggregate on free-text values.",
      D: "INCORRECT: A catch-all without detail loses the specific nature of the feedback. When 40 items are categorized as 'miscellaneous,' the information needed for actionable analysis is gone."
    }
  },
  {
    id: "d4-020",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Forced Tool for Pipeline Sequencing",
    difficulty: "hard",
    scenario: 6,
    importance: "A document processing pipeline at an insurance company requires exact sequencing: first extract entities, then classify risk, then generate a summary. Each step must produce guaranteed structured output for the next.",
    question: "Your three-step extraction pipeline must execute tools in a specific sequence: extract_entities, then classify_risk (using extracted entities), then generate_summary. How should you configure tool_choice for each step?",
    choices: {
      A: "Use tool_choice: 'auto' for all steps and include sequencing instructions in the system prompt",
      B: "Use tool_choice: 'any' for all steps since it guarantees tool usage",
      C: "Force each specific tool in sequence: tool_choice forces extract_entities in step 1, classify_risk in step 2, and generate_summary in step 3",
      D: "Define all three tools and let the model decide the order based on document content"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: 'auto' may return text instead of calling a tool, breaking the pipeline. Sequencing instructions in the prompt are not a reliable enforcement mechanism.",
      B: "INCORRECT: 'any' guarantees a tool call but does not guarantee which tool. The model might call classify_risk before extract_entities, violating the required sequence.",
      C: "CORRECT: Forcing a specific tool at each pipeline step guarantees both that a tool is called AND that it is the correct tool for that step. This is the reliable approach for pipeline sequencing where each step depends on the previous step's structured output.",
      D: "INCORRECT: Letting the model decide execution order removes the sequencing guarantee. The pipeline has explicit data dependencies that require a fixed order."
    }
  },
  {
    id: "d4-021",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Enum for Ambiguous Cases",
    difficulty: "hard",
    scenario: 6,
    importance: "A compliance monitoring system for a banking regulator must distinguish between clearly compliant, clearly non-compliant, and genuinely ambiguous regulatory assessments to route human review appropriately.",
    question: "Your regulatory compliance extraction schema has an enum field 'compliance_status' with values ['compliant', 'non_compliant']. The model sometimes forces an incorrect classification when the regulatory text is genuinely ambiguous. What schema change best addresses this?",
    choices: {
      A: "Add a confidence_score numeric field alongside the binary enum",
      B: "Add an 'unclear' value to the enum and a 'reasoning' string field, allowing the model to express genuine ambiguity rather than forcing a binary classification",
      C: "Remove the enum and use a free-text field so the model can express nuance",
      D: "Add instructions to 'default to compliant when unsure' to reduce false non-compliance flags"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Confidence scores from language models do not reliably calibrate to actual uncertainty. A model may report high confidence on an incorrect forced classification.",
      B: "CORRECT: Adding 'unclear' to the enum allows the model to express genuine ambiguity within the structured format. The companion reasoning field captures the specific source of ambiguity for human reviewers. This prevents forced incorrect classifications while maintaining schema compliance.",
      C: "INCORRECT: Free-text removes the structured categorization needed for automated routing and aggregation. The goal is to add flexibility within the structure, not abandon structure.",
      D: "INCORRECT: Defaulting to compliant masks genuine ambiguity and creates regulatory risk. Genuinely unclear cases should be surfaced for human review, not silently resolved."
    }
  },
  {
    id: "d4-022",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Retry with Error Feedback",
    difficulty: "hard",
    scenario: 6,
    importance: "A tax preparation firm's document extraction pipeline processes millions of returns during tax season. Effective retry strategies can recover from 60%+ of extraction errors without human intervention.",
    question: "Your invoice extraction returns a result where the sum of line items ($450 + $230 + $120 = $800) does not match the extracted total ($850). What is the most effective retry strategy?",
    choices: {
      A: "Simply retry the extraction with the same prompt, hoping for a different result",
      B: "Send a follow-up request containing the original document, the failed extraction, and the specific validation error: 'Line items sum to $800 but extracted total is $850. Re-examine the document for a missing line item or misread total'",
      C: "Automatically correct the total to $800 since the line items are more likely correct",
      D: "Increase the model temperature and retry to explore different extraction possibilities"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Retrying with the same prompt is unlikely to produce a different result and does not give the model information about what went wrong. This is an inefficient use of API calls.",
      B: "CORRECT: Retry-with-error-feedback appends the specific validation error to the prompt, giving the model targeted information about the discrepancy. This allows the model to re-examine the document with awareness of the specific issue, often recovering the correct extraction.",
      C: "INCORRECT: Automatically correcting values without re-examining the source document may propagate errors. The total might be correct with a missing line item, or one line item might be misread.",
      D: "INCORRECT: Higher temperature adds randomness but does not direct the model toward the specific error. It is as likely to introduce new errors as to fix existing ones."
    }
  },
  {
    id: "d4-023",
    domain: "D4",
    taskStatement: "4.4",
    topic: "When Retries Are Ineffective",
    difficulty: "hard",
    scenario: 6,
    importance: "A medical billing company processes thousands of Explanation of Benefits documents daily. Knowing when retries are futile prevents wasted API costs and delays in routing documents to human review.",
    question: "Your extraction system cannot find a 'policy_number' field in a scanned insurance document. The field is required by your schema. You have retried twice with error feedback. The model keeps returning null. What is the correct interpretation?",
    choices: {
      A: "The model needs more retries with stronger instructions to find the policy number",
      B: "The policy number is likely absent from the source document, making further retries ineffective. Route to human review or accept the null value with an appropriate status flag",
      C: "Switch to a larger model that can better extract information from scanned documents",
      D: "Add few-shot examples showing where policy numbers typically appear in insurance documents"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Retries are ineffective when the information is genuinely absent from the source document. No amount of prompting can extract data that does not exist in the input.",
      B: "CORRECT: When retries consistently return null for a specific field, the most likely cause is that the information is absent from the source document. Additional retries will not help. The correct action is to route to human review or accept the null with an explicit status flag like 'not_in_document.'",
      C: "INCORRECT: If the information is not in the document, a larger model will also fail to find it. This wastes cost on a problem that is not model-capability-related.",
      D: "INCORRECT: Few-shot examples showing typical locations do not help when the data is genuinely absent from this specific document. This approach conflates a document content issue with a prompt engineering issue."
    }
  },
  {
    id: "d4-024",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Semantic vs Schema Validation",
    difficulty: "medium",
    scenario: 6,
    importance: "An e-commerce fulfillment center's order extraction system must catch semantically invalid data (negative quantities, future ship dates for past orders) that passes schema validation.",
    question: "Your extraction output passes JSON schema validation but contains a shipping date that is before the order date. What type of error is this, and what addresses it?",
    choices: {
      A: "A schema syntax error that can be fixed by adding date format constraints to the JSON schema",
      B: "A semantic validation error that requires business logic validation beyond the schema, such as checking that shipping_date >= order_date",
      C: "A hallucination that can be fixed by adding few-shot examples",
      D: "A tool configuration error that can be fixed by adjusting tool_choice settings"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: JSON schema format constraints can enforce that a value is a valid date string, but cannot enforce cross-field semantic relationships like 'date A must be after date B.'",
      B: "CORRECT: This is a semantic validation error. The output is structurally valid (correct types, valid dates) but semantically wrong (impossible date relationship). Business logic validation that checks cross-field constraints is required to catch these errors.",
      C: "INCORRECT: While few-shot examples might help, this is fundamentally a validation problem. The extraction may have misread dates from the document, which requires validation logic to detect.",
      D: "INCORRECT: tool_choice controls which tool is called, not the semantic correctness of the tool's output."
    }
  },
  {
    id: "d4-025",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Feedback Loop with detected_pattern",
    difficulty: "hard",
    scenario: 5,
    importance: "A platform engineering team needs to systematically track why their code review system produces false positives so they can make targeted prompt improvements rather than guessing.",
    question: "Your code review system has a 12% false positive rate. You want to systematically understand WHY false positives occur so you can make targeted improvements. What is the most effective approach?",
    choices: {
      A: "Manually review a random sample of false positives and categorize them",
      B: "Add a 'detected_pattern' field to the review output schema that captures the specific code pattern that triggered each finding, enabling automated analysis of which patterns cause the most false positives",
      C: "Add a confidence score to each finding and filter out low-confidence ones",
      D: "Reduce the number of check categories to reduce the overall false positive count"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Manual review does not scale and cannot be done systematically at the rate needed for continuous improvement. It also introduces human bias in categorization.",
      B: "CORRECT: Adding detected_pattern fields enables systematic, automated analysis of false positive patterns. Over time, this data reveals which code patterns trigger the most false positives, allowing targeted prompt refinements for those specific patterns.",
      C: "INCORRECT: Confidence scores do not reliably indicate false positives, and filtering by confidence loses true positives with lower model confidence. This does not address the root cause.",
      D: "INCORRECT: Reducing categories reduces both false positives AND true positives. The goal is to reduce false positives specifically, which requires understanding their patterns."
    }
  },
  {
    id: "d4-026",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Dual Extraction for Conflict Detection",
    difficulty: "hard",
    scenario: 6,
    importance: "An auditing firm extracting financial data from annual reports must catch discrepancies between computed subtotals and stated totals, as these often indicate OCR errors or extraction mistakes.",
    question: "You are extracting financial data from annual reports where tables contain both individual line items and pre-computed subtotals. How should you design the extraction to maximize data integrity?",
    choices: {
      A: "Extract only the subtotals since they are pre-computed and presumably correct",
      B: "Extract both individual line items and stated subtotals, add a calculated_total field that sums the extracted line items, and include a conflict_detected boolean comparing calculated_total to stated_total",
      C: "Extract only the line items and compute all totals yourself, ignoring stated subtotals",
      D: "Extract the subtotals and spot-check by extracting one or two line items for verification"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Trusting only subtotals misses extraction errors on the totals themselves and provides no cross-validation. If a subtotal is misread, there is no way to detect it.",
      B: "CORRECT: Dual extraction with conflict detection is the gold standard for financial data integrity. By extracting both line items and stated totals, then comparing a calculated sum to the stated total, the system can automatically detect extraction errors, OCR issues, or source document inconsistencies.",
      C: "INCORRECT: Ignoring stated subtotals loses a valuable cross-validation signal. If your computed total differs from the stated one, that discrepancy is critical information.",
      D: "INCORRECT: Spot-checking a subset provides weak coverage. A missing or misread line item that happens to not be in the spot-check sample will go undetected."
    }
  },
  {
    id: "d4-027",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Effective vs Ineffective Retries",
    difficulty: "medium",
    scenario: 6,
    importance: "A document processing company must distinguish between recoverable and unrecoverable extraction errors to optimize their human review routing and avoid wasting API calls on futile retries.",
    question: "Which of the following extraction errors is MOST likely to be resolved by retry-with-error-feedback?",
    choices: {
      A: "A customer ID field returns null because the document does not contain any customer identifiers",
      B: "The model extracted a date as '2023-13-01' (invalid month 13), likely misreading '12' or '03' from the source document",
      C: "The model cannot extract a signature because the document is a text-only email",
      D: "The model returns 'N/A' for a phone number field because the source is a legal contract with no contact information"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: If the document does not contain customer identifiers, no retry can create them. This is absent-data, making retries ineffective.",
      B: "CORRECT: An invalid date (month 13) is likely a misread that the model can correct when given specific feedback about the error. The data exists in the document but was extracted incorrectly. Retry-with-error-feedback pointing out the invalid month will prompt re-examination.",
      C: "INCORRECT: A signature cannot be extracted from a text-only email because it does not exist in the source. This is absent data.",
      D: "INCORRECT: A legal contract without contact information has no phone number to extract. Retrying cannot produce data that does not exist in the source."
    }
  },
  {
    id: "d4-028",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Self-Correction Design",
    difficulty: "hard",
    scenario: 6,
    importance: "A real estate transaction processing system must catch discrepancies between stated and computed values in closing documents, where errors can result in financial losses of thousands of dollars.",
    question: "Your real estate document extraction needs to handle cases where a document states a total closing cost of $15,000 but the individual fee line items sum to $14,750. How should you design the extraction schema to handle this?",
    choices: {
      A: "Always trust the stated total and adjust line items proportionally to match",
      B: "Include fields for stated_total, calculated_total (sum of extracted line items), and conflict_detected (boolean), letting downstream systems decide how to resolve discrepancies",
      C: "Average the stated total and calculated total to get the most likely correct value",
      D: "Retry extraction until the line items sum to the stated total"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Adjusting line items to match a total destroys the actual extracted data and may mask real document errors or missing fees.",
      B: "CORRECT: Extracting both values and flagging conflicts preserves all information for downstream resolution. The conflict_detected boolean enables automated routing of discrepancies to human review. This design separates extraction from reconciliation, which is the appropriate separation of concerns.",
      C: "INCORRECT: Averaging two potentially wrong values does not produce a correct value. The discrepancy needs investigation, not mathematical interpolation.",
      D: "INCORRECT: If the document itself contains a discrepancy (stated total does not match itemized fees), no amount of retrying will make them match. The extraction may be correct; the document may be wrong."
    }
  },
  {
    id: "d4-029",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch API Fundamentals",
    difficulty: "medium",
    scenario: 5,
    importance: "A large enterprise processes 50,000 code reviews per month and needs to optimize costs without compromising the developer experience for blocking pre-merge checks.",
    question: "Which statement about the Message Batches API is correct?",
    choices: {
      A: "It provides 50% cost savings with guaranteed sub-second latency for all requests",
      B: "It provides 50% cost savings with up to a 24-hour processing window and no latency SLA",
      C: "It provides 25% cost savings with guaranteed completion within 1 hour",
      D: "It provides 50% cost savings and supports multi-turn tool calling within a single batch request"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The Batch API has NO latency SLA. It provides cost savings by relaxing the latency guarantee, allowing requests to be processed within a 24-hour window.",
      B: "CORRECT: The Message Batches API provides 50% cost savings in exchange for no latency SLA and a processing window of up to 24 hours. This tradeoff makes it suitable for non-blocking workloads.",
      C: "INCORRECT: The cost savings are 50%, not 25%, and there is no guaranteed completion time. The processing window is up to 24 hours.",
      D: "INCORRECT: The Batch API does NOT support multi-turn tool calling within a single request. Each batch request is a single message exchange."
    }
  },
  {
    id: "d4-030",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch vs Sync API Selection",
    difficulty: "hard",
    scenario: 5,
    importance: "A platform team must design a code review architecture that uses the right API for each workflow stage, as mismatching API to workflow requirements either wastes money or blocks developers.",
    question: "Your code review pipeline has two stages: (1) pre-merge checks that block PR merging and (2) overnight codebase-wide quality audits. Which API configuration correctly matches each stage's requirements?",
    choices: {
      A: "Use Batch API for both stages to maximize cost savings across the entire pipeline",
      B: "Use synchronous API for pre-merge checks (developers waiting for results) and Batch API for overnight audits (no latency requirement)",
      C: "Use synchronous API for both stages to ensure consistent latency behavior",
      D: "Use Batch API for pre-merge checks (50% savings on high-volume stage) and synchronous for overnight audits"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Using Batch API for pre-merge checks would mean developers could wait up to 24 hours for results before merging. This makes the Batch API inappropriate for blocking workflows.",
      B: "CORRECT: Pre-merge checks are blocking workflows where developers wait for results, requiring the synchronous API's predictable latency. Overnight audits are non-blocking with no latency requirement, making them ideal for the Batch API's 50% cost savings.",
      C: "INCORRECT: Using synchronous API for overnight audits wastes 50% of the cost savings available through the Batch API for a latency guarantee that provides no value for non-blocking workloads.",
      D: "INCORRECT: This inverts the correct matching. Pre-merge checks need low latency (sync), and overnight audits can tolerate high latency (batch)."
    }
  },
  {
    id: "d4-031",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch Failure Handling",
    difficulty: "hard",
    scenario: 6,
    importance: "A healthcare data migration processing 100,000 patient records via batch extraction must handle partial failures without reprocessing the entire batch, as reprocessing costs thousands of dollars.",
    question: "You submitted a batch of 10,000 document extractions. The batch completes but 300 requests failed. How should you handle the failures?",
    choices: {
      A: "Resubmit the entire batch of 10,000 to ensure consistency",
      B: "Identify the 300 failed requests by their custom_id fields and resubmit only those failed documents in a new batch",
      C: "Ignore the 300 failures since 97% success rate is acceptable",
      D: "Switch to synchronous API for all requests to avoid batch failures"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Resubmitting all 10,000 wastes API calls and cost for the 9,700 that already succeeded. The custom_id field exists precisely to enable targeted resubmission.",
      B: "CORRECT: The custom_id field in batch requests enables correlation between request and response pairs. By identifying failed requests via their custom_id, you can resubmit only the 300 failed documents, saving 97% of the reprocessing cost.",
      C: "INCORRECT: In healthcare data migration, every patient record matters. A 3% failure rate on 100,000 records means 3,000 patients with incomplete data, which is unacceptable.",
      D: "INCORRECT: Switching to synchronous API for 10,000+ requests eliminates the 50% cost savings and does not prevent the types of failures that caused the batch issues."
    }
  },
  {
    id: "d4-032",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Sample-then-Batch Strategy",
    difficulty: "medium",
    scenario: 6,
    importance: "A consulting firm about to batch-process 50,000 client contracts must validate extraction quality before committing to the full batch, as post-hoc correction on 50,000 documents is prohibitively expensive.",
    question: "You need to extract structured data from 50,000 contracts. Your prompt has been tested on 5 sample documents. What is the recommended approach before full batch processing?",
    choices: {
      A: "Submit all 50,000 immediately to the Batch API to take advantage of cost savings",
      B: "Run the prompt on a representative sample set of 50-100 documents, validate the results and refine the prompt, then batch-process the full volume",
      C: "Process all 50,000 synchronously for faster results",
      D: "Run the prompt on the same 5 test documents again to confirm consistency before batching"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Batching 50,000 documents on an undertested prompt risks large-scale extraction errors. Fixing errors after a full batch run is far more expensive than validating on a sample first.",
      B: "CORRECT: Prompt refinement on a representative sample set before full batch processing is the recommended strategy. A 50-100 document sample reveals edge cases and format variations that a 5-document test cannot, allowing prompt refinement before committing to the full volume.",
      C: "INCORRECT: Processing 50,000 synchronously is extremely expensive (no batch discount) and still has the same prompt quality risk as immediate batching.",
      D: "INCORRECT: Re-running on the same 5 documents only confirms consistency on those specific documents. It does not reveal how the prompt handles the diversity of the full 50,000-document corpus."
    }
  },
  {
    id: "d4-033",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch API Limitations",
    difficulty: "medium",
    scenario: 6,
    importance: "An automation team designing a document processing workflow must understand batch API limitations to avoid building architectures that require unsupported capabilities.",
    question: "Your document processing pipeline requires the model to call an extraction tool, evaluate the result, and then call a validation tool. Can this be done in a single Batch API request?",
    choices: {
      A: "Yes, the Batch API supports multi-turn tool calling just like the synchronous API",
      B: "No, the Batch API does NOT support multi-turn tool calling within a single request. You would need to split this into separate batch requests or use the synchronous API",
      C: "Yes, but only if you pre-define the tool calling sequence in the batch request",
      D: "Yes, if you set tool_choice to 'any' the model will chain tool calls automatically"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The Batch API explicitly does not support multi-turn tool calling within a single request. Each batch request is a single message exchange.",
      B: "CORRECT: The Batch API does not support multi-turn tool calling. For workflows requiring multiple tool calls in sequence, you must either use separate batch requests (batch 1 for extraction, batch 2 for validation) or use the synchronous API.",
      C: "INCORRECT: There is no mechanism to pre-define tool calling sequences in batch requests. The limitation is fundamental to the batch processing model.",
      D: "INCORRECT: tool_choice settings do not enable multi-turn tool calling in the Batch API. The limitation applies regardless of tool_choice configuration."
    }
  },
  {
    id: "d4-034",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch Submission Frequency",
    difficulty: "hard",
    scenario: 5,
    importance: "A compliance team must process regulatory filings within a 48-hour SLA. Miscalculating batch submission timing could cause SLA breaches with significant financial penalties.",
    question: "Your team must process regulatory filings with a 48-hour SLA from document receipt to extracted data delivery. The Batch API has up to a 24-hour processing window. How should you design batch submission frequency?",
    choices: {
      A: "Submit one batch per week to accumulate documents and maximize efficiency",
      B: "Submit batches every 12-18 hours to leave a buffer between the 24-hour maximum processing window and the 48-hour SLA, accounting for potential retries of failed documents",
      C: "Submit batches every 24 hours since the processing window matches half the SLA",
      D: "Use only synchronous API since the 48-hour SLA is too tight for batch processing"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Weekly batches mean documents received early in the week could wait 7 days plus 24 hours processing, far exceeding the 48-hour SLA.",
      B: "CORRECT: Submitting every 12-18 hours ensures documents wait at most 12-18 hours before submission plus up to 24 hours for processing, totaling 36-42 hours. This leaves buffer for failed document retries while staying within the 48-hour SLA.",
      C: "INCORRECT: Submitting every 24 hours means a document received just after a submission waits nearly 24 hours plus up to 24 hours processing, totaling nearly 48 hours with zero buffer for retries. Any failure would breach the SLA.",
      D: "INCORRECT: The 48-hour SLA provides ample room for batch processing with proper submission frequency design. Synchronous API costs 2x as much for a non-blocking workflow."
    }
  },
  {
    id: "d4-035",
    domain: "D4",
    taskStatement: "4.5",
    topic: "custom_id Correlation",
    difficulty: "medium",
    scenario: 6,
    importance: "A data processing platform must reliably match batch extraction results back to source documents for downstream integration, where mismatched results could corrupt customer databases.",
    question: "You are processing 5,000 customer records through the Batch API. How do you ensure each response is matched to the correct source document?",
    choices: {
      A: "Rely on the order of responses matching the order of requests since batches process sequentially",
      B: "Include a custom_id field in each batch request that contains a unique document identifier, then use that custom_id to correlate each response with its source document",
      C: "Include the document filename in the prompt text and parse it from the response",
      D: "Process documents one at a time to avoid correlation issues"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Batch responses are NOT guaranteed to be in the same order as requests. Relying on order would cause widespread mismatches between responses and source documents.",
      B: "CORRECT: The custom_id field is specifically designed for correlating batch request/response pairs. Setting it to a unique document identifier ensures reliable matching regardless of processing order.",
      C: "INCORRECT: Parsing identifiers from response text is fragile. The model might omit, modify, or hallucinate the filename. The custom_id field is a metadata-level correlation mechanism that does not depend on model output.",
      D: "INCORRECT: Processing one at a time eliminates the entire benefit of batch processing (50% cost savings, throughput) and is impractical for 5,000 documents."
    }
  },
  {
    id: "d4-036",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Self-Review Limitations",
    difficulty: "hard",
    scenario: 5,
    importance: "A software company's code review pipeline needs a verification step. Understanding why self-review is limited prevents teams from investing in architectures that provide false confidence.",
    question: "Your team proposes adding a verification step where, after generating a code review, the same Claude conversation is asked to 'review your findings and remove any false positives.' Why is this approach limited?",
    choices: {
      A: "Because the model has a limited context window and may not remember its original findings",
      B: "Because the model retains its reasoning context from the generation step, making it less likely to question its own decisions compared to an independent instance",
      C: "Because self-review doubles the cost with no benefit",
      D: "Because the model cannot read its own output"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Within the same conversation, the model has full access to its prior output. Context window limits are not the issue with self-review.",
      B: "CORRECT: Self-review is limited because the model retains its reasoning context from the generation step. The same logical framework that produced a finding makes the model less likely to question it. An independent instance without that context can evaluate findings more objectively.",
      C: "INCORRECT: Self-review does provide some benefit, but it is limited compared to independent review. The issue is effectiveness, not total absence of value.",
      D: "INCORRECT: The model can read and reason about its own output within a conversation. The limitation is cognitive bias from retained reasoning context, not inability to access output."
    }
  },
  {
    id: "d4-037",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Independent Review Instances",
    difficulty: "hard",
    scenario: 5,
    importance: "A defense contractor's code must pass rigorous automated security review. Independent review instances catch 30% more issues than self-review in their validation testing.",
    question: "You want to verify the quality of automated code review findings before presenting them to developers. Which architecture provides the most effective verification?",
    choices: {
      A: "Ask the same Claude conversation to 'double-check all findings and remove any that might be false positives'",
      B: "Send the code and the generated findings to a second independent Claude instance (new conversation without the generator's reasoning) for verification",
      C: "Run the same prompt twice and only keep findings that appear in both runs",
      D: "Add a system prompt instruction telling Claude to 'be self-critical and question each finding'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Self-review within the same conversation is limited by retained reasoning context. The model is biased toward confirming its own findings.",
      B: "CORRECT: A second independent Claude instance evaluates findings without the generator's reasoning context, providing more objective verification. The reviewer sees only the code and findings, not the chain of thought that produced them.",
      C: "INCORRECT: Running the same prompt twice produces highly correlated results. The same systematic biases appear in both runs, so agreement does not validate accuracy.",
      D: "INCORRECT: Instructing self-criticism within the same context does not overcome the fundamental limitation of retained reasoning. The model's reasoning about being self-critical is still colored by its original analysis."
    }
  },
  {
    id: "d4-038",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Multi-Pass for Attention Dilution",
    difficulty: "hard",
    scenario: 5,
    importance: "A monorepo with 200+ files per PR requires automated review that catches cross-file dependency issues without losing per-file detail to attention dilution in a single massive prompt.",
    question: "Your code review system must analyze PRs that modify 50+ files, catching both per-file issues and cross-file integration problems. A single-pass review of all files together misses many per-file issues. What architecture addresses this?",
    choices: {
      A: "Increase the context window size to fit all files and add instructions to be thorough",
      B: "Split into per-file analysis passes for detailed local review, then a cross-file integration pass that receives summaries from the per-file passes to identify dependency and integration issues",
      C: "Randomly sample 10 files for detailed review and extrapolate findings to the rest",
      D: "Process all files in a single pass but add 'Pay equal attention to every file' to the prompt"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Attention dilution is not solved by a larger context window. Even with sufficient capacity, the model's attention quality degrades when processing many files simultaneously.",
      B: "CORRECT: Multi-pass architecture addresses attention dilution by dedicating focused analysis to each file individually, then using a separate integration pass to identify cross-file issues. This ensures per-file depth while still catching cross-cutting concerns.",
      C: "INCORRECT: Random sampling misses issues in the unsampled 80% of files. Code review requires comprehensive coverage, not statistical estimation.",
      D: "INCORRECT: Instructions to 'pay equal attention' do not override the fundamental attention dilution problem. The model cannot maintain deep analysis quality across 50+ files simultaneously."
    }
  },
  {
    id: "d4-039",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Confidence Self-Reporting",
    difficulty: "hard",
    scenario: 5,
    importance: "A large engineering organization needs to route code review findings to the right human reviewers efficiently, using confidence signals to prioritize senior reviewer attention on uncertain findings.",
    question: "You want your code review system to route findings to appropriate human reviewers based on complexity. Which approach best supports calibrated routing?",
    choices: {
      A: "Route all findings to senior reviewers to ensure quality",
      B: "Run a verification pass that includes confidence self-reporting (e.g., confidence: high/medium/low with reasoning), then route low-confidence findings to senior reviewers and auto-approve high-confidence findings that match established patterns",
      C: "Use the model's temperature setting to control routing: low temperature outputs go directly, high temperature outputs to review",
      D: "Route based on file path: core modules to senior reviewers, utility files auto-approved"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Routing everything to senior reviewers does not scale and wastes their time on straightforward findings that could be auto-approved.",
      B: "CORRECT: Confidence self-reporting in a verification pass enables calibrated routing. Low-confidence findings are sent to human reviewers who can add value, while high-confidence findings matching established patterns can be auto-approved. The reasoning field provides context for reviewers.",
      C: "INCORRECT: Temperature is set before generation, not based on output quality. It does not provide per-finding confidence signals.",
      D: "INCORRECT: File path is a poor proxy for review complexity. A trivial change in a core module needs less expert attention than a complex security change in a utility file."
    }
  },
  {
    id: "d4-040",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Multi-Instance Architecture",
    difficulty: "medium",
    scenario: 3,
    importance: "A research institution's multi-agent system must ensure that generated reports are factually grounded in source material, requiring independent verification that the generator's own review cannot reliably provide.",
    question: "Your research report generation system produces reports from source documents. You need a verification step to ensure factual accuracy. Which architecture is most effective?",
    choices: {
      A: "Add a final prompt in the same conversation: 'Now verify all facts in your report against the source documents'",
      B: "Send the generated report and source documents to a separate Claude instance that independently verifies each factual claim against the source material",
      C: "Generate the report twice and compare the outputs for consistency",
      D: "Add inline citations during generation and trust that cited claims are accurate"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Self-verification within the same conversation retains the reasoning context that produced the report, reducing the likelihood of catching errors in its own logic.",
      B: "CORRECT: An independent verification instance evaluates factual claims without the generator's reasoning bias. It receives only the report and source documents, enabling objective verification of each claim against the evidence.",
      C: "INCORRECT: Generating twice produces correlated outputs. Systematic errors (misinterpreted sources, unsupported inferences) will appear in both versions.",
      D: "INCORRECT: Citations do not guarantee accuracy. The model can cite a source while misrepresenting its content. Independent verification of cited claims is still necessary."
    }
  },
  {
    id: "d4-041",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Explicit Criteria for Security Reviews",
    difficulty: "hard",
    scenario: 5,
    importance: "A payment processing company's security review pipeline must minimize false positives on authentication checks to prevent developers from ignoring real security warnings.",
    question: "Your security review flags hardcoded strings in authentication code as 'potential hardcoded credentials.' It generates many false positives on error messages, log strings, and HTTP header names. Which criteria revision best addresses this?",
    choices: {
      A: "Flag hardcoded strings in authentication code only when the string is assigned to a variable whose name contains 'password', 'secret', 'key', or 'token' AND the string has characteristics of a credential (length > 8, mixed case/numbers, or matches known API key patterns). Do NOT flag string literals used in error messages, log statements, or HTTP header names.",
      B: "Be more selective about flagging hardcoded strings and only flag real credentials",
      C: "Add a system prompt saying 'You are an expert security engineer who can distinguish credentials from regular strings'",
      D: "Only scan files named 'auth' or 'credentials' to reduce the scope of false positives"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: This provides multi-dimensional explicit criteria: variable name patterns, credential characteristics, and explicit exclusions for known false positive categories. Each condition is concrete and verifiable, giving the model a precise decision boundary.",
      B: "INCORRECT: 'Be more selective' and 'real credentials' are vague qualifiers that provide no actionable criteria for the model.",
      C: "INCORRECT: Expert persona prompting does not provide the specific categorical criteria needed to consistently distinguish credentials from non-credentials.",
      D: "INCORRECT: Credentials can be hardcoded in any file. Restricting by filename creates dangerous blind spots in the security review."
    }
  },
  {
    id: "d4-042",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Developer Trust Metrics",
    difficulty: "medium",
    scenario: 5,
    importance: "An engineering leadership team needs to measure the effectiveness of their automated code review investment and justify continued development to executives.",
    question: "After implementing explicit review criteria that reduced false positives from 20% to 3%, which metric best indicates restored developer trust?",
    choices: {
      A: "The total number of findings generated per PR",
      B: "The percentage of findings that developers act on (fix or explicitly acknowledge) versus dismiss without engagement",
      C: "The average time to process a PR through the automated review pipeline",
      D: "The number of categories in the review system"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Total findings count does not indicate trust. A system generating many findings that developers ignore is worse than one generating fewer findings that developers act on.",
      B: "CORRECT: Developer engagement rate (findings acted upon vs dismissed) directly measures trust. When developers trust the system, they engage with findings. A high engagement rate indicates the system is perceived as reliable and useful.",
      C: "INCORRECT: Processing time measures performance, not trust. A fast system that produces unreliable results will still have low developer trust.",
      D: "INCORRECT: The number of categories measures system scope, not trustworthiness. Fewer categories with high precision is better than many categories with mixed reliability."
    }
  },
  {
    id: "d4-043",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Precision vs Recall Tradeoff",
    difficulty: "hard",
    scenario: 5,
    importance: "A startup's small engineering team cannot afford to waste time on false positives, but also cannot afford to miss critical security vulnerabilities in their rapid deployment cycle.",
    question: "Your 8-person engineering team deploys 30 times per day. Your automated review has high recall (catches most issues) but low precision (30% false positive rate). What is the impact and appropriate response?",
    choices: {
      A: "The high recall is more important than the false positive rate; keep the system as-is",
      B: "The false positive rate is critically damaging for a small team with high deployment frequency. Prioritize precision by adding explicit categorical criteria and temporarily disabling the highest-FP categories until they can be refined",
      C: "Add more check categories to improve coverage, since recall is the priority for rapid deployment",
      D: "Reduce deployment frequency to allow more time for developers to evaluate findings"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: With 30 deploys/day and 30% FP rate, developers receive many false alarms daily. At this frequency, false positive fatigue causes developers to skip ALL findings, including real issues, negating the recall benefit.",
      B: "CORRECT: For a small team with high deployment frequency, precision is critical because each false positive interrupts a developer. Explicit criteria and disabling high-FP categories restores trust, ensuring real findings actually get developer attention.",
      C: "INCORRECT: Adding categories without fixing precision increases the noise level, further degrading trust and making developers more likely to ignore all findings.",
      D: "INCORRECT: Reducing deployment frequency to accommodate tool limitations is backwards. The tool should be tuned to support the team's workflow, not the other way around."
    }
  },
  {
    id: "d4-044",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Code Review Format",
    difficulty: "medium",
    scenario: 5,
    importance: "A DevOps team needs machine-parseable code review output to automatically create Jira tickets, but the model inconsistently formats findings despite detailed instructions.",
    question: "Your code review output must be machine-parseable for Jira integration. Despite detailed formatting instructions, the model sometimes returns findings as prose paragraphs instead of structured objects. You add 3 few-shot examples showing the correct format. Which example set design is most effective?",
    choices: {
      A: "Three examples of perfect code with no findings",
      B: "Three examples of code with clear, obvious bugs",
      C: "Three examples covering: a single finding, multiple findings of different severities, and a 'no issues found' case, each showing the exact output format",
      D: "Three examples all showing the same type of finding to reinforce the format"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: Examples with no findings do not demonstrate how to format findings when they exist, which is the primary use case.",
      B: "INCORRECT: Showing only obvious bugs does not address the format consistency problem and does not demonstrate edge cases like no-findings output.",
      C: "CORRECT: Covering single findings, multiple findings, and the no-findings case demonstrates the output format across the full range of scenarios. This is the most effective few-shot design for consistent formatting because it shows the model how to handle every output cardinality.",
      D: "INCORRECT: Three identical finding types teach format repetition but not how to handle varying numbers of findings or the empty case, which are common sources of format inconsistency."
    }
  },
  {
    id: "d4-045",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot Reasoning Transparency",
    difficulty: "hard",
    scenario: 6,
    importance: "A legal discovery platform must produce extraction results that legal teams can audit for accuracy. Opaque extractions without reasoning create liability when used as evidence.",
    question: "Your contract extraction system needs to produce auditable results. Which few-shot example design best supports this requirement?",
    choices: {
      A: "Examples that show only the final extracted values without reasoning",
      B: "Examples that include step-by-step reasoning showing how each value was identified in the source text, with quotes from the source supporting each extraction decision",
      C: "Examples with confidence percentages next to each extracted value",
      D: "Examples that include only the source text and output, letting the model develop its own reasoning approach"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Without reasoning, auditors cannot verify why a value was extracted or whether it was correctly identified. This fails the auditability requirement.",
      B: "CORRECT: Few-shot examples that demonstrate explicit reasoning with source quotes teach the model to produce auditable extractions. Each extraction decision is traceable back to specific text in the source document, enabling legal teams to verify accuracy.",
      C: "INCORRECT: Confidence percentages are not reliably calibrated and do not provide the reasoning trail needed for legal audit. An extraction can have high confidence and still be wrong.",
      D: "INCORRECT: Without reasoning examples, the model may not include reasoning in its output. Few-shot examples must demonstrate the desired behavior, including the reasoning process."
    }
  },
  {
    id: "d4-046",
    domain: "D4",
    taskStatement: "4.3",
    topic: "tool_choice auto vs any",
    difficulty: "medium",
    scenario: 6,
    importance: "A data integration team must understand tool_choice semantics to prevent silent failures where the pipeline receives text instead of structured data.",
    question: "Your extraction pipeline uses tool_choice: 'auto' and occasionally receives plain text responses instead of tool calls, causing downstream JSON parsing failures. What is the fix?",
    choices: {
      A: "Add stronger instructions in the prompt to always use the tool",
      B: "Change tool_choice to 'any' which guarantees the model will call one of the defined tools rather than returning text",
      C: "Add error handling to parse text responses as JSON",
      D: "Increase the number of defined tools so the model has more options to choose from"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Instructions do not override the fundamental behavior of tool_choice 'auto,' which explicitly allows the model to choose between tool calls and text responses.",
      B: "CORRECT: tool_choice 'any' guarantees the model must call one of the defined tools. Unlike 'auto' which may return text, 'any' ensures structured output on every call.",
      C: "INCORRECT: Text responses from the model are not structured JSON. Attempting to parse them is fragile and does not address the root cause.",
      D: "INCORRECT: More tools do not prevent the model from choosing text output. The issue is the 'auto' setting allowing text, not insufficient tool options."
    }
  },
  {
    id: "d4-047",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema Design for Required vs Optional",
    difficulty: "hard",
    scenario: 6,
    importance: "A mortgage processing system must handle documents where some fields are always present (loan amount, borrower name) while others appear only in specific document types (co-borrower, PMI amount).",
    question: "Your mortgage document extraction schema has 30 fields. Some fields like 'loan_amount' appear in every document, while others like 'pmi_amount' only appear in specific document types. How should you structure the schema?",
    choices: {
      A: "Make all 30 fields required so the model always attempts to extract everything",
      B: "Make universally present fields required and conditionally present fields nullable/optional, with status indicators for absent optional fields to distinguish 'not applicable' from 'not found'",
      C: "Create separate schemas for each document type with only the relevant fields",
      D: "Make all fields optional to avoid extraction errors when fields are absent"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Making all fields required forces the model to generate values for fields that do not exist in certain document types, increasing hallucination risk.",
      B: "CORRECT: Required fields for universal data and nullable/optional fields for conditional data matches the actual document structure. Status indicators for optional fields preserve the distinction between 'field is not applicable to this document type' and 'field should be present but was not found,' which has different implications for downstream processing.",
      C: "INCORRECT: Separate schemas require a reliable document type classifier and do not handle documents that span multiple types. The routing complexity outweighs the schema simplification benefit.",
      D: "INCORRECT: Making everything optional loses the validation benefit for fields that should always be present. If loan_amount is absent, that is an error that should be caught, not silently accepted."
    }
  },
  {
    id: "d4-048",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema for Hierarchical Data",
    difficulty: "medium",
    scenario: 6,
    importance: "An insurance company extracting policy details must handle nested hierarchical data (policy > coverages > exclusions > sub-limits) with guaranteed structural validity.",
    question: "Your insurance policy extraction requires nested data: a policy contains multiple coverages, each coverage has exclusions, and each exclusion may have sub-limits. How should you define this in your tool schema?",
    choices: {
      A: "Flatten everything into a single-level schema with fields like 'coverage_1_exclusion_1_sublimit'",
      B: "Define nested object types in the JSON schema: policy object containing an array of coverage objects, each containing an array of exclusion objects, each optionally containing sub-limit fields",
      C: "Use separate tool calls for each level of the hierarchy",
      D: "Store the hierarchical data as a JSON string within a single text field"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Flattening destroys the hierarchical relationships and creates an unwieldy schema with combinatorial field names. It cannot handle variable numbers of coverages or exclusions.",
      B: "CORRECT: JSON schemas fully support nested objects and arrays, which naturally represent hierarchical data. This preserves relationships between levels and handles variable cardinality at each level.",
      C: "INCORRECT: Separate tool calls for each level adds complexity, latency, and the risk of losing context between calls. The hierarchy is better captured in a single structured extraction.",
      D: "INCORRECT: Embedding JSON as a string within a schema field defeats the purpose of schema validation. The nested JSON string is not validated by the outer schema."
    }
  },
  {
    id: "d4-049",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Retry Feedback Specificity",
    difficulty: "hard",
    scenario: 6,
    importance: "A supply chain analytics firm needs to maximize extraction recovery rates from retries, where each unrecovered error requires expensive manual intervention.",
    question: "Your extraction of a purchase order returned a vendor_id of 'ABC-123' but the validation rule requires vendor IDs to match the pattern 'VND-XXXXX' (VND- prefix with 5 digits). Which retry feedback message will be most effective?",
    choices: {
      A: "The extraction contains errors. Please try again more carefully.",
      B: "Validation error: vendor_id 'ABC-123' does not match required pattern 'VND-XXXXX'. Re-examine the document for a vendor identifier matching the pattern VND- followed by 5 digits. Check for alternative field labels such as 'Supplier ID', 'Vendor Number', or 'Account Code'.",
      C: "The vendor_id is wrong. The correct format is VND-XXXXX.",
      D: "Please retry the extraction."
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: This provides no specific information about what went wrong. The model has no guidance on which field failed, what pattern is expected, or where to look.",
      B: "CORRECT: Effective retry feedback includes: the specific field that failed, the incorrect value extracted, the expected pattern, and guidance on where to look for the correct value including alternative field labels. This specificity maximizes the chance of a successful re-extraction.",
      C: "INCORRECT: While this identifies the field and correct format, it does not provide guidance on where in the document to find the correct value or what alternative labels to look for.",
      D: "INCORRECT: A bare retry request provides no error feedback and is unlikely to produce a different result."
    }
  },
  {
    id: "d4-050",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Validation Layer Architecture",
    difficulty: "hard",
    scenario: 6,
    importance: "A financial services firm needs a multi-layer validation architecture that catches both structural and business logic errors in extracted trade confirmations.",
    question: "You are designing a validation pipeline for trade confirmation extraction. Which validation layer architecture most comprehensively catches errors?",
    choices: {
      A: "JSON schema validation only, since tool use guarantees valid output",
      B: "A three-layer approach: (1) schema validation via tool use for structural correctness, (2) cross-field semantic validation (trade_date before settlement_date, quantity * price = notional), (3) external reference validation (counterparty exists in system, security ID is valid)",
      C: "Post-extraction human review of every document",
      D: "Add comprehensive validation instructions to the extraction prompt so the model self-validates"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Schema validation catches structural errors but not semantic errors (invalid date relationships, mathematical inconsistencies) or reference data mismatches.",
      B: "CORRECT: A three-layer validation architecture provides comprehensive coverage. Schema validation (via tool use) ensures structural correctness. Cross-field validation catches semantic errors. External reference validation catches entity mismatches. Each layer addresses a distinct class of errors.",
      C: "INCORRECT: Human review of every document does not scale and defeats the purpose of automation. Validation layers should catch most errors automatically, routing only genuine edge cases to humans.",
      D: "INCORRECT: Model self-validation within the same extraction call has the same self-review limitations discussed in Task 4.6. External validation logic is more reliable."
    }
  },
  {
    id: "d4-051",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Distinguishing Error Types for Retry Logic",
    difficulty: "medium",
    scenario: 6,
    importance: "A document processing team must implement smart retry logic that does not waste API calls on unrecoverable errors while maximizing recovery of recoverable ones.",
    question: "Your extraction pipeline encounters three types of failures: (1) schema syntax errors, (2) semantic validation errors like date inconsistencies, (3) missing required fields that are absent from the source document. Which retry strategy is correct?",
    choices: {
      A: "Retry all three types with the same error feedback approach",
      B: "Type 1 should not occur with tool use; Type 2 should be retried with specific error feedback; Type 3 should be routed to human review without retry since the data is absent from the source",
      C: "Retry Types 1 and 2, route Type 3 to human review, but use the same generic retry message for both",
      D: "Do not retry any failures; route all to human review for maximum accuracy"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Different error types have different recovery profiles. Retrying absent-data errors wastes API calls since no amount of retrying can produce data that does not exist in the source.",
      B: "CORRECT: Tool use with JSON schemas eliminates schema syntax errors (Type 1). Semantic errors (Type 2) are recoverable with specific error feedback directing the model to re-examine the relevant fields. Missing data (Type 3) is unrecoverable through retries and should be routed to human review.",
      C: "INCORRECT: Generic retry messages are less effective than specific error feedback for semantic errors. Also, schema syntax errors should not occur with proper tool use.",
      D: "INCORRECT: Routing all failures to human review wastes human time on recoverable errors that retry-with-feedback can resolve automatically."
    }
  },
  {
    id: "d4-052",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch API for Overnight Audits",
    difficulty: "medium",
    scenario: 5,
    importance: "A platform team running nightly codebase-wide security audits across 10,000 files can save $50,000/month by using the Batch API instead of synchronous calls.",
    question: "Your team runs a nightly codebase security audit across all repository files. Results are reviewed by the security team the next morning. Which API approach is most appropriate?",
    choices: {
      A: "Synchronous API for immediate results even though nobody reviews them until morning",
      B: "Message Batches API, since the overnight window provides ample time for the 24-hour processing window and the 50% cost savings are significant at this volume",
      C: "Synchronous API with parallel processing to finish before morning",
      D: "Batch API with a 1-hour processing SLA to ensure results are ready early"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Paying full price for immediate results that sit unreviewed until morning wastes the 50% cost savings available through the Batch API.",
      B: "CORRECT: Overnight security audits are the ideal Batch API use case: non-blocking, no latency requirement, high volume. The 24-hour processing window fits within the overnight schedule, and 50% cost savings at audit volume is substantial.",
      C: "INCORRECT: Parallel synchronous processing costs 2x as much as batch for the same work, with no benefit since results are not needed immediately.",
      D: "INCORRECT: The Batch API does not offer configurable SLA tiers. It provides up to 24-hour processing with no latency guarantee, which is acceptable for overnight workflows."
    }
  },
  {
    id: "d4-053",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch API Inappropriate Use Cases",
    difficulty: "hard",
    scenario: 5,
    importance: "A CI/CD pipeline architect must correctly identify which workflow stages cannot use batch processing, as a misapplication could delay PR merges by up to 24 hours.",
    question: "Which of the following workflows is LEAST appropriate for the Message Batches API?",
    choices: {
      A: "Monthly compliance report generation across all historical documents",
      B: "Pre-merge code review checks that block PR merging until results are available",
      C: "Weekly digest of code quality trends across all repositories",
      D: "Quarterly re-extraction of all vendor contracts with updated schema"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Monthly compliance reports are non-blocking and latency-tolerant, making them ideal for batch processing.",
      B: "CORRECT: Pre-merge checks are blocking workflows where developers are actively waiting for results before merging. The Batch API's lack of latency SLA and up to 24-hour processing window makes it completely inappropriate for this use case.",
      C: "INCORRECT: Weekly digests are non-blocking analytical workloads with no real-time latency requirement, making them suitable for batch processing.",
      D: "INCORRECT: Quarterly re-extraction is a bulk processing task with no real-time requirement, making it an excellent batch API candidate."
    }
  },
  {
    id: "d4-054",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Per-File Plus Cross-File Architecture",
    difficulty: "hard",
    scenario: 5,
    importance: "A microservices company's code review must catch both local code quality issues and cross-service API contract violations, which a single-pass review consistently misses.",
    question: "Your automated review of a microservices PR modifying 15 service files consistently misses API contract violations between services while catching per-file issues. What architectural change addresses this?",
    choices: {
      A: "Add 'Pay special attention to cross-service API contracts' to the single-pass prompt",
      B: "Split into per-file passes that analyze each service file individually, then add a cross-file integration pass that specifically examines API contracts, interface changes, and inter-service dependencies using summaries from the per-file passes",
      C: "Process all 15 files in a single pass with a larger context window",
      D: "Only review the files that change API contracts and skip the rest"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Adding attention instructions to a single-pass prompt does not overcome attention dilution across 15 files. The model cannot maintain deep analysis of both local issues and cross-service contracts simultaneously.",
      B: "CORRECT: Per-file passes ensure deep local analysis, while a dedicated cross-file integration pass focuses specifically on inter-service dependencies. The integration pass receives summaries from per-file passes, enabling it to focus attention on cross-cutting concerns without distraction from local details.",
      C: "INCORRECT: A larger context window does not solve attention dilution. Even with capacity for all files, the model's analysis quality degrades when trying to reason about many files simultaneously.",
      D: "INCORRECT: Skipping non-API files misses cases where internal changes in one service break assumptions made by another service's API usage."
    }
  },
  {
    id: "d4-055",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Review Routing with Confidence",
    difficulty: "medium",
    scenario: 5,
    importance: "A large engineering organization with 500+ developers needs to efficiently route automated review findings to maximize the value of limited senior reviewer capacity.",
    question: "Your code review system processes 500 PRs per day and generates an average of 3 findings per PR. Senior reviewers can handle 50 findings per day. How should you design the routing system?",
    choices: {
      A: "Route all 1,500 findings to senior reviewers and hire more reviewers to handle the volume",
      B: "Auto-approve all findings to avoid bottlenecking developers",
      C: "Use a verification pass with confidence self-reporting to auto-approve high-confidence findings matching known patterns, route medium-confidence to team leads, and escalate low-confidence to senior reviewers",
      D: "Randomly sample 50 findings per day for senior review"
    },
    correct: "C",
    explanations: {
      A: "INCORRECT: 1,500 findings at 50/day capacity requires 30 senior reviewers, which is impractical and expensive for a review bottleneck.",
      B: "INCORRECT: Auto-approving everything eliminates the quality assurance benefit of the review system entirely.",
      C: "CORRECT: Confidence-based routing allocates senior reviewer time to the findings that most need human judgment (low-confidence, edge cases), while high-confidence findings on known patterns flow through automatically. This matches reviewer capacity to review complexity.",
      D: "INCORRECT: Random sampling provides no quality guarantee for the 97% of findings that go unreviewed and does not optimize which findings receive expert attention."
    }
  },
  {
    id: "d4-056",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Criteria for Dead Code Detection",
    difficulty: "hard",
    scenario: 5,
    importance: "A platform team's dead code detection must avoid flagging plugin entry points, event handlers, and reflection-based code that appear unused but are invoked dynamically.",
    question: "Your automated review flags 'dead code' that should be removed, but frequently flags event handlers, plugin entry points, and methods invoked via reflection. How should you refine the detection criteria?",
    choices: {
      A: "Flag code as dead only when: (1) no static call sites exist, (2) the function/method is not decorated with known framework annotations (@EventHandler, @Plugin, @Endpoint), (3) the function is not exported or public in a library module, and (4) the function name does not match common dynamic dispatch patterns",
      B: "Only flag code as dead if it has not been modified in 6 months",
      C: "Ask the model to use its judgment about whether code might be used dynamically",
      D: "Disable dead code detection entirely since it is too error-prone"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: This provides explicit multi-condition criteria that account for the specific patterns causing false positives: framework annotations, export status, and dynamic dispatch patterns. Each condition is concrete and verifiable.",
      B: "INCORRECT: Modification date is unrelated to whether code is actively used. Stable, well-functioning code may not be modified for years but is critical to the system.",
      C: "INCORRECT: Vague judgment about dynamic usage produces the inconsistent false positives the team is trying to eliminate.",
      D: "INCORRECT: Disabling the entire category is an option only as a temporary measure while refining criteria. With explicit criteria addressing the false positive patterns, the category can function reliably."
    }
  },
  {
    id: "d4-057",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Negative Criteria (What NOT to Flag)",
    difficulty: "medium",
    scenario: 5,
    importance: "A DevOps team finds that specifying what NOT to flag is as important as specifying what to flag, since false positives from acceptable patterns are the primary source of developer frustration.",
    question: "Your code style review flags all functions over 50 lines as 'too long,' including well-structured functions with clear linear logic. What criteria refinement best addresses this?",
    choices: {
      A: "Increase the threshold from 50 to 100 lines",
      B: "Add explicit negative criteria: 'Do NOT flag long functions when they have a clear linear flow (e.g., sequential data transformation steps, configuration builders) without deep nesting or multiple responsibilities. Only flag when the function handles multiple distinct concerns or has nesting depth > 3'",
      C: "Remove the function length check entirely",
      D: "Add 'unless the function is well-written' as an exception"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A higher threshold is still an arbitrary number that does not account for function structure. A poorly structured 80-line function should be flagged while a clean 120-line configuration builder should not.",
      B: "CORRECT: Explicit negative criteria (what NOT to flag) combined with positive criteria (what TO flag) define a complete decision boundary. Specifying that linear flows and configuration builders are acceptable while multiple responsibilities and deep nesting are flaggable gives the model precise judgment criteria.",
      C: "INCORRECT: Removing the check entirely loses the ability to catch genuinely problematic long functions.",
      D: "INCORRECT: 'Well-written' is a vague qualifier that provides no actionable criteria for the model."
    }
  },
  {
    id: "d4-058",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Tone Calibration",
    difficulty: "medium",
    scenario: 1,
    importance: "A customer support system must maintain consistent tone across thousands of daily interactions, where tone inconsistency damages brand perception and customer satisfaction.",
    question: "Your customer support agent gives inconsistent tone: sometimes overly formal, sometimes too casual, despite instructions to 'be professional but friendly.' What technique will most effectively calibrate the tone?",
    choices: {
      A: "Add more detailed tone descriptions to the system prompt",
      B: "Provide 3-4 few-shot examples of actual support responses demonstrating the desired tone for different scenarios (complaint, question, compliment), showing the specific language register expected",
      C: "Set the temperature to 0.5 for balanced tone",
      D: "Add a persona description: 'You are Sarah, a friendly but professional support agent'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: More detailed descriptions of tone are still abstract instructions. The model needs to see concrete examples of the desired tone in context.",
      B: "CORRECT: Few-shot examples are the most effective technique for tone calibration because they demonstrate the specific language register, formality level, and response style in concrete scenarios. This is more effective than any description of the desired tone.",
      C: "INCORRECT: Temperature affects randomness but does not calibrate between formal and casual tone. Both extremes can appear at any temperature.",
      D: "INCORRECT: Persona descriptions provide general character traits but do not demonstrate the specific language patterns expected. The model may interpret 'friendly but professional' differently across calls."
    }
  },
  {
    id: "d4-059",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema for Multi-Currency Financial Data",
    difficulty: "hard",
    scenario: 6,
    importance: "A global treasury management system must extract financial data from documents in multiple currencies, where confusing currencies causes reconciliation errors worth millions.",
    question: "Your financial extraction schema has an 'amount' field for monetary values. Documents contain amounts in USD, EUR, GBP, and JPY. How should you design the schema to prevent currency confusion?",
    choices: {
      A: "Use a single 'amount' string field and include the currency symbol in the value (e.g., '$1,000')",
      B: "Design a monetary value object with separate fields: 'amount' (number), 'currency' (enum of supported currencies), and 'original_text' (string capturing the exact text from the document)",
      C: "Assume all amounts are in USD and convert later",
      D: "Use separate fields for each currency: 'amount_usd', 'amount_eur', 'amount_gbp', 'amount_jpy'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Currency symbols in strings are hard to parse reliably and ambiguous ($  could be USD, AUD, CAD, etc.). String-embedded currencies prevent numeric operations downstream.",
      B: "CORRECT: A structured monetary value object with separate amount, currency enum, and original_text fields ensures clear separation of value and currency. The currency enum constrains to valid currencies. The original_text field preserves the source representation for audit and conflict detection.",
      C: "INCORRECT: Assuming a default currency is dangerous in multi-currency documents. A JPY 1,000,000 interpreted as USD would cause massive reconciliation errors.",
      D: "INCORRECT: Separate per-currency fields do not scale to new currencies and create confusion when multiple currency amounts appear in the same document."
    }
  },
  {
    id: "d4-060",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Forced Tool for Specific Extraction Step",
    difficulty: "medium",
    scenario: 6,
    importance: "A compliance system must guarantee that every document goes through a specific classification tool before extraction, as unclassified documents may be processed with the wrong schema.",
    question: "Your document processing pipeline must first classify the document type, then extract data using a type-specific schema. How do you guarantee the classification step always executes?",
    choices: {
      A: "Include 'First classify the document type' in the system prompt with tool_choice: 'auto'",
      B: "Force the classify_document tool specifically using tool_choice in the first API call, then use the classification result to select the extraction tool for the second call",
      C: "Define only the classify_document tool so the model has no other option",
      D: "Use tool_choice: 'any' and hope the model calls the classification tool first"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: tool_choice 'auto' may skip the classification tool and return text, or call an extraction tool directly, violating the pipeline sequence.",
      B: "CORRECT: Forcing a specific tool guarantees that exact tool is called. This ensures the classification step always executes, and its output can deterministically select the appropriate extraction tool for step two.",
      C: "INCORRECT: While this technically works for the classification step, it requires dynamically changing the tool definitions between calls, adding complexity. Forced tool_choice is the simpler, more explicit approach.",
      D: "INCORRECT: 'any' guarantees a tool call but not which tool. The model might call an extraction tool instead of the classification tool."
    }
  },
  {
    id: "d4-061",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Feedback Loop for False Positive Reduction",
    difficulty: "hard",
    scenario: 5,
    importance: "A DevOps team at a 10,000-developer organization needs systematic data to prioritize prompt improvements across 20 review categories, rather than relying on anecdotal developer complaints.",
    question: "Your code review system has 20 check categories and an overall 8% false positive rate. You need to systematically determine which categories to improve first. What approach yields the most actionable data?",
    choices: {
      A: "Survey developers about which categories they find least accurate",
      B: "Add detected_pattern fields to each finding that capture the specific code pattern triggering the finding, then analyze which patterns within each category correlate with developer dismissals to identify the highest-impact improvement targets",
      C: "Disable categories one at a time and measure the impact on overall false positive rate",
      D: "Apply few-shot examples uniformly to all 20 categories"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Developer surveys are subjective, biased by recency, and do not identify specific patterns causing false positives. They provide directional signal but not actionable engineering data.",
      B: "CORRECT: detected_pattern fields enable automated, systematic analysis of false positive causes at the pattern level within each category. Correlating patterns with developer dismissals reveals exactly which patterns cause the most false positives, enabling targeted prompt refinements with maximum impact.",
      C: "INCORRECT: Disabling categories one at a time is slow (20 iterations), disruptive to developers, and only measures category-level impact without identifying specific patterns to fix.",
      D: "INCORRECT: Uniform application of few-shot examples wastes effort on categories that may not need them and does not target the specific patterns causing false positives."
    }
  },
  {
    id: "d4-062",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Multi-Stage Validation Pipeline",
    difficulty: "hard",
    scenario: 6,
    importance: "A supply chain management company extracting purchase order data must catch compound errors where multiple fields are individually valid but collectively impossible (order date in 2024, delivery date in 2019).",
    question: "Your extraction validation catches single-field errors (invalid dates, non-numeric amounts) but misses compound errors where multiple fields are individually valid but collectively impossible. What validation layer addresses this?",
    choices: {
      A: "Add more strict single-field validation rules",
      B: "Implement cross-field semantic validation that checks relational constraints between fields: delivery_date > order_date, total = sum(line_items), ship_to_country matches currency conventions",
      C: "Increase the model temperature to explore more extraction possibilities",
      D: "Add a second extraction pass and compare the two results for consistency"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Stricter single-field validation cannot catch compound errors by definition. If a date is valid in isolation but impossible in relation to another field, single-field validation will not detect it.",
      B: "CORRECT: Cross-field semantic validation explicitly checks relational constraints between fields. This catches the class of errors where individual values pass single-field validation but violate business logic when considered together.",
      C: "INCORRECT: Temperature changes do not address validation gaps. The issue is missing validation logic, not extraction variation.",
      D: "INCORRECT: A second extraction pass with comparison catches extraction inconsistencies but not systematic relational constraint violations that would appear consistently in both passes."
    }
  },
  {
    id: "d4-063",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch Processing Workflow Design",
    difficulty: "hard",
    scenario: 6,
    importance: "An analytics company processing 100,000 social media posts daily must design a batch workflow that handles the multi-turn extraction requirement within batch API constraints.",
    question: "Your document processing requires two sequential steps: entity extraction then sentiment classification using the extracted entities. You want to use the Batch API for cost savings. How should you design the workflow?",
    choices: {
      A: "Submit a single batch with multi-turn tool calling to handle both steps per document",
      B: "Submit two sequential batches: first batch for entity extraction, then after it completes, submit a second batch for sentiment classification with the extracted entities included in each request",
      C: "Use synchronous API for both steps since batch cannot handle the dependency",
      D: "Combine both steps into a single prompt to avoid the multi-turn requirement"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The Batch API does NOT support multi-turn tool calling within a single request. This workflow would fail.",
      B: "CORRECT: Since batch does not support multi-turn tool calling, the workflow is split into two sequential batches. The first batch extracts entities, and after completion, the second batch performs sentiment classification with extracted entities provided as input. This preserves the 50% cost savings while working within batch API constraints.",
      C: "INCORRECT: Synchronous API for 100,000 documents costs 2x as much as batch. The two-batch approach achieves the same result at batch pricing.",
      D: "INCORRECT: Combining both steps into a single prompt may work for simple cases but sacrifices the structured output guarantees of separate tool-based steps and makes error handling harder."
    }
  },
  {
    id: "d4-064",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Generator-Reviewer Architecture",
    difficulty: "hard",
    scenario: 3,
    importance: "A research consultancy generating client reports must verify factual accuracy, where a single unverified claim in a report can destroy client trust and generate liability.",
    question: "Your multi-agent research system has a report generator and needs a quality verification step. The generator produces a 5,000-word report with 50 factual claims citing 30 source documents. How should you architect the verification?",
    choices: {
      A: "Ask the generator to add a confidence score to each claim in the same conversation",
      B: "Send the report and all 30 source documents to a separate verifier instance that independently checks each factual claim against the source material, without access to the generator's reasoning",
      C: "Have the generator re-read its own report and highlight any uncertain claims",
      D: "Use a single large context window to process all sources and the report together in the generator's conversation"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Self-assessed confidence scores within the generator's conversation are unreliable due to retained reasoning context. The generator is biased toward confirming its own claims.",
      B: "CORRECT: An independent verifier instance receives only the report and source documents, without the generator's reasoning chain. This enables objective claim-by-claim verification against source material, catching errors the generator cannot self-identify.",
      C: "INCORRECT: Self-review within the same conversation retains the reasoning context that produced the claims. The generator is less likely to question decisions it made with confidence.",
      D: "INCORRECT: Keeping everything in the generator's conversation provides no independent verification. The generator's existing reasoning about the sources biases any re-examination."
    }
  },
  {
    id: "d4-065",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Multi-Pass Architecture for Large Codebases",
    difficulty: "medium",
    scenario: 5,
    importance: "A monorepo with 500+ microservices requires automated review that scales beyond what a single-pass analysis can handle without severe attention degradation.",
    question: "A PR in your monorepo modifies 80 files across 12 microservices. A single-pass review misses obvious bugs in later files. What is the root cause and solution?",
    choices: {
      A: "The model has a context window that is too small for 80 files; use a model with a larger context",
      B: "Attention dilution across 80 files degrades analysis quality for individual files. Split into per-file analysis passes, then use a cross-file pass to check inter-service dependencies",
      C: "The later files contain less important code, so missing issues there is acceptable",
      D: "Randomize the file order so different files are missed on each run"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Even with a context window large enough for 80 files, attention dilution still degrades per-file analysis quality. Context capacity is not the bottleneck.",
      B: "CORRECT: Attention dilution is the root cause. When processing many files simultaneously, the model's per-file analysis quality degrades. Per-file passes maintain deep analysis quality, and a cross-file pass catches integration issues.",
      C: "INCORRECT: File position in the input has no correlation with code importance. Missing bugs in later files means the review is unreliable, not that those files are less important.",
      D: "INCORRECT: Randomizing order does not fix attention dilution; it just distributes missed findings differently across runs, making the system unpredictably unreliable."
    }
  },
  {
    id: "d4-066",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Criteria for API Deprecation Warnings",
    difficulty: "hard",
    scenario: 5,
    importance: "A cloud platform team's automated review must accurately flag deprecated API usage to ensure migration compliance, where false positives on current APIs waste developer migration effort.",
    question: "Your code review flags deprecated API usage, but it frequently flags current API methods that have names similar to deprecated ones. How should you refine the criteria?",
    choices: {
      A: "Provide an explicit list of deprecated APIs with their exact signatures and replacement APIs. Flag only when the code uses an exact match from the deprecated list. Include a negative list of current APIs with similar names that should NOT be flagged.",
      B: "Add 'only flag APIs you are very sure are deprecated' to the prompt",
      C: "Have the model search the internet for deprecation information before flagging",
      D: "Flag all APIs that contain words like 'legacy', 'old', or 'v1' in their names"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: An explicit list with exact signatures provides a verifiable decision criterion. The negative list of similar-but-current APIs directly addresses the false positive pattern of name-based confusion. This is the most precise approach.",
      B: "INCORRECT: 'Very sure' is a vague qualifier that does not give the model a concrete way to verify deprecation status.",
      C: "INCORRECT: Internet search during code review adds latency, introduces external dependency, and may return inaccurate or outdated information.",
      D: "INCORRECT: Name-based heuristics are exactly the kind of vague criteria that cause false positives. Many current, actively maintained APIs have 'v1' in their names."
    }
  },
  {
    id: "d4-067",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Error Handling Review Criteria",
    difficulty: "medium",
    scenario: 5,
    importance: "A fintech company's code review must enforce proper error handling in payment processing code, where swallowed exceptions can cause silent financial data loss.",
    question: "Your review prompt says 'Check that error handling is adequate.' This produces vague findings like 'Consider adding more error handling.' Which revised criteria will produce specific, actionable findings?",
    choices: {
      A: "Check that every function has a try-catch block",
      B: "Flag error handling issues only when: (1) exceptions are caught and silently swallowed (empty catch blocks), (2) broad exception types (Exception, Error) are caught when specific types are available, or (3) error responses are returned without logging or propagating the original error context",
      C: "Rate the error handling on a scale of 1-10",
      D: "Be more specific about error handling issues"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Requiring try-catch on every function is an overly rigid rule that does not account for different error handling strategies (result types, error propagation, etc.).",
      B: "CORRECT: These three specific criteria define concrete, verifiable error handling anti-patterns. Each criterion identifies a specific code pattern that constitutes an issue, enabling the model to produce actionable findings rather than vague suggestions.",
      C: "INCORRECT: A numeric scale provides no actionable information for developers. A score of '6/10' does not tell a developer what to fix.",
      D: "INCORRECT: 'Be more specific' is a meta-instruction that does not provide the actual specific criteria needed."
    }
  },
  {
    id: "d4-068",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Multi-Format Documents",
    difficulty: "hard",
    scenario: 6,
    importance: "A procurement department receiving invoices in PDF, email body, and scanned image formats needs consistent extraction regardless of source format.",
    question: "Your invoice extraction system receives invoices as structured text (PDF-extracted), unstructured email bodies, and OCR output from scanned images. Extraction quality varies wildly across formats. How should you design few-shot examples?",
    choices: {
      A: "Use only the cleanest format (PDF-extracted) for examples since it is easiest to work with",
      B: "Include one example from each format (structured PDF, email body, noisy OCR text), each showing the same extraction output format regardless of input format, with reasoning about how to handle format-specific challenges like OCR errors and missing structure",
      C: "Create separate prompts for each format, each with its own examples",
      D: "Include 10 examples from the most common format to handle volume"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Examples only from the cleanest format leave the model unprepared for the challenges of email bodies and OCR noise. It will not learn to handle format-specific issues.",
      B: "CORRECT: Examples spanning input formats teach the model to normalize diverse inputs to consistent output. Including reasoning about format-specific challenges (OCR error handling, missing structure) teaches the model strategies applicable to novel format variations.",
      C: "INCORRECT: Separate prompts triple the maintenance burden and require a format detection/routing step. A single prompt with diverse examples achieves the same quality with less complexity.",
      D: "INCORRECT: Ten examples of one format do not prepare the model for other formats and consume tokens without proportional benefit beyond 2-4 well-chosen examples."
    }
  },
  {
    id: "d4-069",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema for Address Extraction",
    difficulty: "medium",
    scenario: 6,
    importance: "A global shipping company must extract addresses from documents across different countries with different address formats, where incorrect parsing causes delivery failures.",
    question: "Your extraction schema has a single 'address' string field. International addresses have vastly different structures (US: street, city, state, zip; Japan: prefecture, city, block; UK: street, city, county, postcode). How should you redesign the schema?",
    choices: {
      A: "Keep the single address string field and parse it downstream",
      B: "Design an address object with common fields (street_line_1, street_line_2, city, region, postal_code, country) where region and postal_code formats are validated per-country, plus a 'raw_address' field preserving the original text",
      C: "Create separate schemas for each country's address format",
      D: "Use an array of address components, each with a 'type' and 'value' field"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single string field pushes the parsing problem downstream and provides no structural validation. Different addresses will be formatted inconsistently.",
      B: "CORRECT: A structured address object with common fields handles international variation through a normalized structure. Region maps to state/prefecture/county depending on country. The raw_address field preserves the original for audit and fallback parsing.",
      C: "INCORRECT: Country-specific schemas require country detection before extraction and do not handle documents with multiple international addresses. The complexity does not justify the marginal benefit.",
      D: "INCORRECT: Untyped component arrays are harder to validate and use downstream than a structured object with named fields."
    }
  },
  {
    id: "d4-070",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema Validation Guarantees",
    difficulty: "hard",
    scenario: 6,
    importance: "A regulatory filing system must have a clear understanding of what tool use guarantees and what it does not, to avoid a false sense of security in their extraction pipeline.",
    question: "A junior engineer says: 'Since we use tool use with JSON schemas, we do not need any validation layer because the output is guaranteed correct.' What is wrong with this statement?",
    choices: {
      A: "Nothing is wrong; tool use with JSON schemas guarantees all aspects of output correctness",
      B: "Tool use with JSON schemas guarantees structural/syntactic correctness (valid JSON matching the schema) but NOT semantic correctness (correct values, valid relationships between fields, accurate extraction from source). Semantic validation is still required.",
      C: "Tool use does not guarantee anything; it is just as unreliable as text-based output",
      D: "Tool use guarantees semantic correctness but not syntactic correctness"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: This conflates structural validity with correctness. Schema compliance means the output has the right shape, not the right values.",
      B: "CORRECT: Tool use with JSON schemas eliminates syntactic/structural errors (malformed JSON, missing required fields, wrong types) but cannot enforce semantic constraints (correct dates, matching totals, accurate extraction from source). The schema ensures the output is valid JSON with the right structure; validation ensures the values are correct.",
      C: "INCORRECT: Tool use provides strong structural guarantees that text-based output cannot match. The limitation is specifically in semantic correctness.",
      D: "INCORRECT: This inverts the actual guarantee. Tool use provides syntactic/structural guarantees, not semantic ones."
    }
  },
  {
    id: "d4-071",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Retry Budget Design",
    difficulty: "medium",
    scenario: 6,
    importance: "A document processing service must balance retry costs against manual review costs, where unlimited retries can exceed the cost of human intervention.",
    question: "Your extraction pipeline encounters a validation error. How should you decide how many retries to attempt before routing to human review?",
    choices: {
      A: "Always retry exactly 3 times regardless of error type",
      B: "Design a retry budget based on error type: format/structural errors get 1-2 retries with error feedback (high success rate), semantic errors get 2-3 retries with specific field-level feedback, absent-data errors get 0 retries (route immediately to human review)",
      C: "Retry indefinitely until the extraction passes validation",
      D: "Never retry; route all failures to human review immediately"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A fixed retry count ignores error type. Absent-data errors waste all 3 retries, while some semantic errors could benefit from more targeted attempts.",
      B: "CORRECT: Retry budgets based on error type optimize cost and time. Format errors have high retry success rates and need few attempts. Semantic errors may need more attempts with specific feedback. Absent-data errors cannot be resolved by retries, so immediate routing saves cost.",
      C: "INCORRECT: Infinite retries waste API costs on errors that will never resolve (absent data) and add unbounded latency to the pipeline.",
      D: "INCORRECT: Never retrying routes recoverable errors to expensive human review unnecessarily, wasting the significant cost savings that retry-with-feedback provides."
    }
  },
  {
    id: "d4-072",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch vs Sync for Mixed Workflows",
    difficulty: "hard",
    scenario: 5,
    importance: "A CI/CD platform serving 1,000 developers must correctly segment its workloads between batch and sync APIs to maximize cost savings without degrading the developer experience.",
    question: "Your CI/CD platform has four workload types: (1) pre-merge PR reviews (blocking), (2) post-merge quality checks (results needed within 2 hours), (3) weekly codebase audits (results needed within 48 hours), (4) monthly compliance reports (results needed within 1 week). Which API assignment maximizes cost savings?",
    choices: {
      A: "Synchronous for all four to ensure consistent behavior",
      B: "Synchronous for (1); Batch for (2), (3), and (4)",
      C: "Batch for all four to maximize the 50% cost savings",
      D: "Synchronous for (1) and (2); Batch for (3) and (4)"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Using synchronous for all workloads wastes the 50% batch savings on three workloads that can tolerate the batch processing window.",
      B: "CORRECT: Only pre-merge reviews (1) are truly blocking and require synchronous API. Post-merge checks with a 2-hour window (2), weekly audits (3), and monthly reports (4) all have sufficient latency tolerance for the batch API's 24-hour window. This maximizes batch usage across 75% of workloads.",
      C: "INCORRECT: Using batch for pre-merge reviews would make developers wait up to 24 hours to merge PRs, which is unacceptable for blocking workflows.",
      D: "INCORRECT: Post-merge quality checks with a 2-hour tolerance window fit within the batch API's processing window. Using synchronous API for them wastes cost savings unnecessarily."
    }
  },
  {
    id: "d4-073",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Independent Instances vs Same-Context Review",
    difficulty: "medium",
    scenario: 5,
    importance: "A security consulting firm must understand the theoretical basis for independent review to justify the additional API cost to their clients.",
    question: "Why does a second independent Claude instance catch more errors in generated code review findings than asking the same conversation to 'double-check its work'?",
    choices: {
      A: "Because the second instance uses a different model version",
      B: "Because the second instance does not have the generator's reasoning context, allowing it to evaluate findings objectively without the cognitive bias of having produced them",
      C: "Because the second instance has more tokens available in its context window",
      D: "Because the second instance runs on different hardware"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Both instances can use the same model version. The benefit comes from context independence, not model differences.",
      B: "CORRECT: The key mechanism is absence of the generator's reasoning context. The generator builds a reasoning chain that makes its findings seem logical within that context. An independent instance evaluates findings fresh, without that reasoning chain biasing its judgment.",
      C: "INCORRECT: Context window availability is the same for both instances. The benefit is about what is IN the context (absence of prior reasoning), not context capacity.",
      D: "INCORRECT: Hardware differences, if any, are irrelevant to the quality of review. The benefit is purely about reasoning context independence."
    }
  },
  {
    id: "d4-074",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Cross-File Integration Pass Design",
    difficulty: "hard",
    scenario: 5,
    importance: "A distributed systems team needs their automated review to catch cross-service data flow issues that per-file analysis fundamentally cannot detect.",
    question: "You have completed per-file analysis passes for a PR modifying 20 files across 5 microservices. You are designing the cross-file integration pass. What input should the integration pass receive?",
    choices: {
      A: "All 20 raw files in full, identical to what the per-file passes received",
      B: "Summaries from each per-file pass highlighting changes, API modifications, data model changes, and inter-service dependencies identified, plus the full text of files involved in cross-service interfaces",
      C: "Only the files that the per-file passes flagged as having issues",
      D: "A single summary of all 20 files combined into one document"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Sending all 20 raw files recreates the attention dilution problem that per-file passes were designed to solve. The integration pass would suffer the same quality degradation.",
      B: "CORRECT: The integration pass receives per-file summaries (focused information) plus full text of interface files (where cross-service issues manifest). This gives the integration pass focused context for cross-cutting analysis without attention dilution from irrelevant internal details.",
      C: "INCORRECT: Limiting to flagged files misses cross-service issues involving unflagged files. A file with no local issues might still be part of a cross-service integration problem.",
      D: "INCORRECT: A single combined summary loses the per-file granularity needed to identify specific cross-file interactions and dependencies."
    }
  },
  {
    id: "d4-075",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Explicit Criteria for Performance Review",
    difficulty: "hard",
    scenario: 5,
    importance: "A high-frequency trading firm's code review must identify genuine performance issues without flagging micro-optimizations that would sacrifice readability for negligible gains.",
    question: "Your performance review prompt says 'Flag potential performance issues.' It flags every list comprehension as 'consider using a generator for memory efficiency' even when the list is small and generator conversion would reduce readability. How should you refine the criteria?",
    choices: {
      A: "Flag performance issues only when: (1) the operation processes collections that could exceed 10,000 elements based on context, (2) the operation is inside a loop that amplifies cost, or (3) the operation involves I/O or network calls that could benefit from batching. Do NOT flag micro-optimizations on small, bounded collections.",
      B: "Add 'only flag significant performance issues' to the prompt",
      C: "Disable all performance checks since they generate too many false positives",
      D: "Add a performance impact estimate to each finding and filter by estimated impact"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: These criteria define specific, verifiable conditions that distinguish genuine performance concerns (large collections, loop amplification, I/O batching) from micro-optimizations. The explicit exclusion of small-collection optimizations directly addresses the false positive pattern.",
      B: "INCORRECT: 'Significant' is a vague qualifier. The model has no concrete threshold for what constitutes a significant versus insignificant performance issue.",
      C: "INCORRECT: Disabling performance checks entirely loses the ability to catch genuine performance regressions. Refined criteria are better than no criteria.",
      D: "INCORRECT: The model cannot reliably estimate performance impact without profiling data. Self-estimated impact scores are unreliable."
    }
  },
  {
    id: "d4-076",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Consistent Severity Assignment",
    difficulty: "medium",
    scenario: 5,
    importance: "A CI/CD pipeline must assign consistent severities to findings because severity drives automated gating (critical blocks merge, major requires review, minor is informational).",
    question: "Your code review findings have inconsistent severity levels: the same type of issue is sometimes 'critical' and sometimes 'minor.' Severity definitions in the prompt have not resolved this. What technique most effectively calibrates severity?",
    choices: {
      A: "Add more words to the severity definitions to make them clearer",
      B: "Provide few-shot examples pairing specific code patterns with their correct severity level and reasoning, including boundary cases that distinguish major from critical",
      C: "Remove severity levels and use a binary 'fix/ignore' classification",
      D: "Let developers reassign severities after review"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: When severity definitions alone produce inconsistent results, adding more text to the definitions rarely helps. The model needs concrete examples, not longer descriptions.",
      B: "CORRECT: Few-shot examples demonstrating severity assignment with reasoning are the most effective technique for calibrating severity levels. Boundary cases between adjacent levels (major vs critical) are particularly important because those are where inconsistency is highest.",
      C: "INCORRECT: Binary classification loses valuable information that drives different automation behaviors. The goal is consistent severity, not eliminated severity.",
      D: "INCORRECT: Post-hoc human reassignment does not scale and adds friction to the review process."
    }
  },
  {
    id: "d4-077",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema for Date Ambiguity",
    difficulty: "hard",
    scenario: 6,
    importance: "A global trade finance system extracting dates from documents across regions must handle the ambiguity of '01/02/2024' which is January 2nd in the US but February 1st in Europe.",
    question: "Your extraction encounters a date '04/05/2024' in a document with no other context about date format convention. The schema currently has a date field in ISO format. How should you handle the ambiguity?",
    choices: {
      A: "Default to MM/DD/YYYY format since it is most common",
      B: "Design the date extraction to include: 'date_iso' (the extracted date in ISO format), 'original_text' (the raw text), 'format_confidence' (enum: 'unambiguous', 'ambiguous_mm_dd_or_dd_mm'), and when ambiguous, extract both interpretations",
      C: "Always parse as DD/MM/YYYY since it is the international standard",
      D: "Skip ambiguous dates and leave the field null"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Defaulting to one format will silently produce wrong dates for documents using the other format. In trade finance, a wrong date can mean wrong settlement dates and financial penalties.",
      B: "CORRECT: Capturing both the extraction and its ambiguity status allows downstream systems to handle ambiguous dates appropriately (perhaps using document origin or other context to resolve). The original_text field preserves the source for audit, and both interpretations are available when the date is ambiguous.",
      C: "INCORRECT: Same problem as option A in reverse. Documents from US sources will be parsed incorrectly.",
      D: "INCORRECT: Skipping ambiguous dates loses data that could be resolved with additional context downstream. The extraction should capture what it can and flag the ambiguity."
    }
  },
  {
    id: "d4-078",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Retry Effectiveness Analysis",
    difficulty: "hard",
    scenario: 6,
    importance: "A data processing team must optimize their retry strategy based on empirical success rates to avoid spending API budget on retries with low recovery rates.",
    question: "After 3 months of operation, your extraction pipeline shows: format errors have 95% retry success rate, value mismatches have 60% retry success rate, and absent-data errors have 2% retry success rate. How should you adjust your retry strategy?",
    choices: {
      A: "Increase retries for all error types since some have high success rates",
      B: "Maintain 1 retry for format errors (high success rate makes more unnecessary), maintain 2-3 retries for value mismatches (moderate success rate benefits from multiple attempts), and eliminate retries for absent-data errors (2% success rate means retries waste 98% of their cost)",
      C: "Eliminate retries for value mismatches since 60% is not high enough",
      D: "Add more retries for absent-data errors to improve the 2% rate"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Blanket retry increases waste API calls on absent-data errors where the 2% success rate means retries are almost always futile.",
      B: "CORRECT: Calibrating retry budgets to empirical success rates optimizes cost. Format errors resolve quickly, so 1 retry suffices. Value mismatches benefit from multiple focused attempts. Absent-data retries are nearly always wasted and should route to human review immediately.",
      C: "INCORRECT: A 60% success rate means more than half of retries succeed, providing significant value compared to the cost of human review for every value mismatch error.",
      D: "INCORRECT: The 2% success rate for absent-data errors is unlikely to improve with more retries because the fundamental problem is missing source data, not extraction technique."
    }
  },
  {
    id: "d4-079",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch for Regulatory Compliance",
    difficulty: "medium",
    scenario: 6,
    importance: "A bank's quarterly regulatory filing requires processing all transactions from the quarter, where using the wrong API approach either costs too much or risks missing the filing deadline.",
    question: "Your bank must process 500,000 transactions for a quarterly regulatory filing. The filing deadline is 30 days after quarter end. Results need to be validated by compliance before submission. Which approach is best?",
    choices: {
      A: "Process all 500,000 synchronously in the first week to have maximum validation time",
      B: "Use the Batch API to process in daily batches of ~17,000, starting immediately after quarter end, completing extraction within 30 days, and allowing rolling validation as batches complete",
      C: "Wait until the last week and process everything at once to minimize storage costs",
      D: "Process synchronously but throttle to 1,000 per day to manage costs"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Processing 500,000 synchronously costs 2x the batch price and provides no benefit since the 30-day window accommodates batch processing.",
      B: "CORRECT: Batch processing in daily increments maximizes cost savings (50% discount) while enabling rolling validation. Starting immediately after quarter end provides ample buffer for retries and compliance review within the 30-day deadline.",
      C: "INCORRECT: Waiting until the last week creates extreme risk. Any processing or validation issues leave no time for remediation before the filing deadline.",
      D: "INCORRECT: At 1,000/day synchronously, processing takes 500 days which far exceeds the 30-day deadline. The rate is also at full synchronous pricing."
    }
  },
  {
    id: "d4-080",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Verification Pass Design",
    difficulty: "hard",
    scenario: 5,
    importance: "A security-critical application's code review must route high-risk findings through additional verification, but the verification pass must be designed to add value rather than simply rubber-stamp the original findings.",
    question: "You are designing a verification pass for security findings from your code review. Which verification pass design adds the most value?",
    choices: {
      A: "Send each finding to a verifier that sees the code, the finding, and the original reviewer's full reasoning chain, and asks 'Is this finding valid?'",
      B: "Send only the code and the finding claim (without the original reasoning) to an independent verifier that must independently determine whether the security issue exists, reporting its confidence and reasoning",
      C: "Run the same security review prompt on the same code and check if the finding appears again",
      D: "Add a system prompt telling the verifier to 'be extra critical' when evaluating findings"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Providing the original reasoning chain biases the verifier. Seeing detailed reasoning for why an issue exists makes the verifier more likely to agree, reducing verification effectiveness.",
      B: "CORRECT: Withholding the original reasoning forces independent verification. The verifier must determine the issue's validity from the code alone, providing genuinely independent assessment. Confidence and reasoning output support downstream routing decisions.",
      C: "INCORRECT: Running the same prompt twice produces correlated results. Systematic false positives will appear in both runs, providing no verification value.",
      D: "INCORRECT: 'Be extra critical' is a vague instruction that does not provide the verifier with a concrete verification methodology."
    }
  },
  {
    id: "d4-081",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Defining Review Scope Boundaries",
    difficulty: "medium",
    scenario: 5,
    importance: "A development team needs their automated review to focus on changed code only, as reviewing generated code, vendored dependencies, and test fixtures wastes developer attention.",
    question: "Your code review system wastes developer attention by flagging issues in auto-generated code, vendored dependencies, and test fixture files. How should you define the review scope?",
    choices: {
      A: "Add 'focus on important code only' to the prompt",
      B: "Define explicit scope boundaries: 'Review ONLY files in src/ and lib/ directories. SKIP files matching: *_generated.*, vendor/*, test/fixtures/*, *.min.js. When a file contains a // @generated header, skip the entire file.'",
      C: "Let the model decide which files are important enough to review",
      D: "Review all files but label generated code findings as low priority"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: 'Important code' is subjective and provides no actionable scope definition.",
      B: "CORRECT: Explicit scope boundaries using concrete file path patterns, naming conventions, and file headers give the model a precise, verifiable decision for what to review versus skip. This eliminates wasted effort on code that developers cannot or should not modify.",
      C: "INCORRECT: Leaving scope decisions to the model produces inconsistent coverage. Some runs might review generated code while others skip it.",
      D: "INCORRECT: Even low-priority findings from generated code add noise to the review report. The goal is to not review out-of-scope files at all."
    }
  },
  {
    id: "d4-082",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot Example Quality",
    difficulty: "hard",
    scenario: 6,
    importance: "A data engineering team discovers that poorly constructed few-shot examples can degrade extraction quality compared to no examples, making example quality critical.",
    question: "Your extraction system's quality decreased after adding few-shot examples. Investigation reveals the examples contain inconsistencies: one example extracts dates as 'MM/DD/YYYY' while another uses 'YYYY-MM-DD'. What is the root cause and fix?",
    choices: {
      A: "The model is confused by having too many examples; reduce to 1 example",
      B: "Inconsistent examples teach the model inconsistent behavior. Ensure all examples use the exact same output format (ISO 8601 dates), terminology, and field naming conventions throughout",
      C: "Add a note in the prompt saying 'ignore format differences in examples'",
      D: "Remove examples entirely and rely on instructions since examples are causing problems"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: The issue is not the number of examples but their internal inconsistency. One inconsistent example teaches bad patterns just as well as three.",
      B: "CORRECT: Few-shot examples must be internally consistent. When examples demonstrate different formats, the model learns that format variation is acceptable, producing inconsistent output. All examples must align on format, terminology, and conventions.",
      C: "INCORRECT: The model learns from the examples' actual content, not from meta-instructions about the examples. Inconsistent examples will produce inconsistent output regardless of disclaimers.",
      D: "INCORRECT: Removing examples loses their benefit entirely. The fix is to correct the examples, not eliminate them."
    }
  },
  {
    id: "d4-083",
    domain: "D4",
    taskStatement: "4.3",
    topic: "tool_choice for Conversational vs Extraction",
    difficulty: "medium",
    scenario: 1,
    importance: "A customer support chatbot must sometimes provide free-form conversational responses and sometimes extract structured data from customer messages, requiring different tool_choice modes.",
    question: "Your customer support system must sometimes answer questions conversationally and sometimes extract order details from customer messages using a structured tool. Which tool_choice setting is appropriate?",
    choices: {
      A: "tool_choice: 'any' so the model always returns structured data",
      B: "tool_choice: 'auto' so the model can choose between conversational text responses and structured tool calls based on the message content",
      C: "Force the extraction tool on every message",
      D: "Never use tools and rely on text-based extraction"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: 'any' forces a tool call on every message, which is wrong when the customer asks a conversational question that should receive a text response.",
      B: "CORRECT: 'auto' allows the model to choose the appropriate response type. When a customer provides order details, the model can call the extraction tool. When a customer asks a question, the model can respond with text. This matches the mixed-mode requirement.",
      C: "INCORRECT: Forcing the extraction tool on conversational questions produces nonsensical structured output instead of helpful answers.",
      D: "INCORRECT: Text-based extraction loses the schema compliance guarantee for the extraction use case."
    }
  },
  {
    id: "d4-084",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Validation Error Message Design",
    difficulty: "medium",
    scenario: 6,
    importance: "A payments processing company finds that the specificity of validation error messages in retry feedback directly correlates with retry success rates.",
    question: "Your extraction system detects that an extracted phone number '+1-555-CALL-NOW' contains letters, failing the digits-only validation. Which retry feedback message format maximizes recovery?",
    choices: {
      A: "Validation failed. Please retry.",
      B: "phone_number field '+1-555-CALL-NOW' contains letters. Extract only the numeric phone number from the document. Look for a phone number in digits-only format (e.g., +1-555-225-5669). The extracted value may be a vanity number; locate the underlying numeric number if present, otherwise flag as 'vanity_number_only'.",
      C: "The phone number is invalid.",
      D: "Error in extraction. Check all fields."
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: No specific information about what failed or how to fix it. The model has no guidance for the retry.",
      B: "CORRECT: This feedback identifies the specific field, shows the invalid value, explains the validation rule, suggests where to look for the correct value, and handles the edge case where only a vanity number exists. This level of specificity maximizes retry recovery.",
      C: "INCORRECT: Identifies the field but provides no guidance on what is wrong or how to find the correct value.",
      D: "INCORRECT: Does not identify which field failed. The model must re-examine all fields, wasting the retry on fields that were correct."
    }
  },
  {
    id: "d4-085",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch Error Recovery Patterns",
    difficulty: "hard",
    scenario: 6,
    importance: "A data migration project with a hard deadline must have a robust batch error recovery strategy that can handle cascading failures without missing the migration window.",
    question: "Your batch of 20,000 document extractions completes but 2,000 documents failed. After resubmitting the 2,000 failed documents, 500 still fail. After a third attempt, 200 still fail. What is the correct next step?",
    choices: {
      A: "Keep retrying the 200 until they all succeed",
      B: "Analyze the 200 persistent failures to identify common patterns (corrupted documents, unusual formats, missing data). Route recoverable failures through the synchronous API with enhanced error feedback, and route unrecoverable failures to human review.",
      C: "Accept the 1% failure rate and move on without the 200 documents",
      D: "Increase the batch timeout and retry all 200 one more time"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Persistent failures after multiple retries indicate systematic issues that further retries will not resolve. Continuing to retry wastes API cost.",
      B: "CORRECT: After diminishing returns on batch retries (2000 -> 500 -> 200), the remaining failures likely have specific causes. Analyzing patterns identifies whether documents are recoverable (unusual format, worth enhanced retry via sync) or unrecoverable (corrupted, absent data, needs human review).",
      C: "INCORRECT: Depending on the domain, 200 unprocessed documents could represent significant business impact. The approach should attempt recovery before writing them off.",
      D: "INCORRECT: Batch timeout is not configurable in the described way, and more retries on persistent failures have diminishing returns as demonstrated by the 2000 -> 500 -> 200 pattern."
    }
  },
  {
    id: "d4-086",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Multi-Pass for Attention Quality",
    difficulty: "hard",
    scenario: 3,
    importance: "A research synthesis system analyzing 50 papers must maintain analysis quality across all sources, not just the first 10, to produce comprehensive and accurate literature reviews.",
    question: "Your research system must synthesize findings from 50 papers into a comprehensive review. A single-pass analysis of all 50 papers produces a report that heavily references the first 10-15 papers and barely mentions the rest. What architecture addresses this?",
    choices: {
      A: "Randomize the order of papers and process in a single pass",
      B: "Process papers in groups of 5-8 with individual analysis passes, producing per-group summaries, then run a synthesis pass that integrates all group summaries into the final comprehensive review",
      C: "Use a longer context window to fit all 50 papers",
      D: "Add 'cite all 50 papers equally' to the prompt"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Randomizing order changes which papers are underrepresented but does not fix the attention dilution that causes later papers to be neglected.",
      B: "CORRECT: Multi-pass architecture ensures each paper group receives focused analysis. The per-group summaries distill key findings, and the synthesis pass integrates them into a comprehensive review. This prevents attention dilution from causing any papers to be overlooked.",
      C: "INCORRECT: A larger context window does not prevent attention degradation across many documents. The analysis quality still drops for later papers in the input.",
      D: "INCORRECT: Instructions to cite all papers equally do not override the fundamental attention dilution effect. The model will still spend disproportionate attention on earlier papers."
    }
  },
  {
    id: "d4-087",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Explicit Criteria for Type Safety Reviews",
    difficulty: "hard",
    scenario: 5,
    importance: "A Python-heavy enterprise migrating to strict typing needs automated review that distinguishes between missing type hints in public APIs (high value) and internal utility functions (low value).",
    question: "Your type safety review flags every function without type hints, generating hundreds of findings per PR. Developers find this overwhelming and counterproductive. How should you refine the criteria?",
    choices: {
      A: "Flag missing type hints only on: (1) public API functions (exported, part of public modules), (2) functions that handle external data (API responses, file I/O, database results), and (3) functions whose return type is used in conditional logic. Skip type hints on internal utility functions, lambdas, and test helper functions.",
      B: "Only flag functions with more than 3 parameters",
      C: "Add 'be selective about which functions need type hints' to the prompt",
      D: "Require type hints on all functions but lower the severity to 'informational'"
    },
    correct: "A",
    explanations: {
      A: "CORRECT: These criteria target the highest-value type hint locations: public APIs (contract documentation), external data handlers (type safety at boundaries), and conditional return types (bug prevention). Excluding internal utilities and test helpers eliminates the bulk of low-value findings.",
      B: "INCORRECT: Parameter count is an arbitrary proxy for type hint value. A single-parameter public API function benefits more from type hints than a private 5-parameter internal helper.",
      C: "INCORRECT: 'Be selective' is a vague qualifier with no actionable criteria for determining which functions are high-value type hint targets.",
      D: "INCORRECT: Lowering severity to informational still generates hundreds of findings, creating the same noise problem even if individual items are marked as low severity."
    }
  },
  {
    id: "d4-088",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Edge Case Extraction",
    difficulty: "hard",
    scenario: 6,
    importance: "A legal tech platform extracting contract terms encounters edge cases like crossed-out text, handwritten amendments, and conflicting clauses that standard examples do not cover.",
    question: "Your contract extraction handles standard clauses well but fails on edge cases: contracts with amendments written in margins, crossed-out sections with replacement text, and conflicting clauses that supersede each other. How should you design few-shot examples for these?",
    choices: {
      A: "Add 10 examples of standard contracts to reinforce the basic extraction pattern",
      B: "Add 2-3 examples specifically targeting these edge cases, showing how to handle amendments (extract both original and amended versions with status), crossed-out text (mark as superseded), and conflicting clauses (extract both with a 'conflict' flag and reference to the superseding clause)",
      C: "Add instructions explaining each edge case without examples",
      D: "Ignore edge cases since they are rare and handle them manually"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: More standard examples do not prepare the model for edge cases. The system already handles standard cases well.",
      B: "CORRECT: Targeted few-shot examples for specific edge cases demonstrate the exact handling strategy for each unusual pattern. This teaches the model to recognize and handle amendments, superseded text, and conflicts rather than guessing or hallucinating when encountering them.",
      C: "INCORRECT: Instructions without examples are less effective for complex edge case handling. The model needs to see the expected input-output pattern for these unusual scenarios.",
      D: "INCORRECT: Edge cases in legal contracts often have high stakes. Manual handling does not scale as document volume grows."
    }
  },
  {
    id: "d4-089",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema for Confidence and Source Tracking",
    difficulty: "medium",
    scenario: 6,
    importance: "A research data extraction system must track which parts of extracted data came from which sections of the source document to enable verification and error tracing.",
    question: "Your extraction system needs to support downstream verification of extracted values. How should you enhance the schema to support traceability?",
    choices: {
      A: "Add a single 'notes' text field for the model to explain its extraction decisions",
      B: "For each extracted field, include companion fields: 'source_location' (where in the document the value was found), 'source_text' (the exact text from which the value was derived), and 'extraction_method' (enum: 'explicit', 'inferred', 'calculated')",
      C: "Add a confidence score to each field",
      D: "Include the full source document in the output for reference"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single notes field provides unstructured, inconsistent traceability information that is hard to use for automated verification.",
      B: "CORRECT: Per-field source tracking with location, exact source text, and extraction method provides structured, verifiable provenance for each extracted value. This enables automated verification (checking source_text against the document) and distinguishes between values read directly from the document versus those inferred or calculated.",
      C: "INCORRECT: Confidence scores do not provide traceability. They do not tell you where the value came from or how it was derived.",
      D: "INCORRECT: Including the full source document adds bulk without providing the specific mapping between extracted values and their source locations."
    }
  },
  {
    id: "d4-090",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Cascading Validation Architecture",
    difficulty: "hard",
    scenario: 6,
    importance: "A healthcare claims processing system must validate extracted data at multiple levels, where a validation gap at any level can result in incorrect claim payments totaling millions annually.",
    question: "Your healthcare claims extraction pipeline needs comprehensive validation. The extracted data includes patient demographics, diagnosis codes (ICD-10), procedure codes (CPT), and billing amounts. Which validation architecture provides the most comprehensive error detection?",
    choices: {
      A: "Validate each field individually against its format rules",
      B: "Implement cascading validation: (1) field-level format validation (ICD-10 code format, CPT code format, date formats), (2) cross-field consistency (procedure dates within admission-discharge range, diagnosis codes compatible with procedures), (3) external reference validation (ICD-10 and CPT codes exist in current code sets), (4) business rule validation (billing amounts within expected ranges for the procedure-diagnosis combination)",
      C: "Trust the tool use schema to validate everything",
      D: "Send extractions to a second model for validation"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Individual field validation misses cross-field inconsistencies, invalid code combinations, and business rule violations.",
      B: "CORRECT: Cascading four-layer validation catches errors at every level: field format, cross-field consistency, external reference validity, and business rule compliance. Each layer addresses a distinct error class that other layers cannot catch.",
      C: "INCORRECT: Schema validation ensures structural correctness but cannot validate medical code validity, cross-field relationships, or business rules.",
      D: "INCORRECT: A second model for validation does not have access to the external reference data (current ICD-10/CPT code sets, billing ranges) needed for comprehensive healthcare validation."
    }
  },
  {
    id: "d4-091",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch Processing Architecture",
    difficulty: "hard",
    scenario: 6,
    importance: "A media company digitizing 1 million historical documents must design a batch processing architecture that maximizes throughput while maintaining quality control.",
    question: "You need to extract metadata from 1 million historical documents. Your prompt has been refined on a 200-document sample. What batch processing strategy optimizes throughput, cost, and quality?",
    choices: {
      A: "Submit all 1 million documents in a single batch for maximum efficiency",
      B: "Submit in manageable batch sizes (e.g., 10,000-50,000 per batch), monitor quality metrics on early batches, and adjust prompts if quality drifts. Use custom_ids to track and resubmit failures. Process batches in parallel to maximize throughput.",
      C: "Process all 1 million synchronously for fastest completion",
      D: "Submit 100 batches of 10,000 sequentially, waiting for each to complete before submitting the next"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single batch of 1 million may exceed batch size limits and provides no opportunity to detect and correct quality issues mid-process.",
      B: "CORRECT: Moderate batch sizes enable quality monitoring and mid-course correction. Early batches reveal systematic issues before the entire corpus is processed. Parallel batch submission maximizes throughput. custom_ids enable targeted failure resubmission.",
      C: "INCORRECT: Synchronous processing of 1 million documents costs 2x batch pricing and provides no throughput advantage over parallel batch submission.",
      D: "INCORRECT: Strictly sequential batches waste time. Parallel batch submission processes multiple batches simultaneously while still enabling quality monitoring."
    }
  },
  {
    id: "d4-092",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Dual-Pass Security Review",
    difficulty: "hard",
    scenario: 5,
    importance: "A financial services company's application security review must catch both code-level vulnerabilities and architectural security issues, which require different analytical perspectives.",
    question: "Your security review architecture needs to catch both code-level vulnerabilities (SQL injection, XSS) and architectural security issues (improper trust boundaries, missing authentication layers). How should you design the multi-pass architecture?",
    choices: {
      A: "Run a single comprehensive security review covering all aspects",
      B: "Run two specialized passes: (1) a code-level vulnerability pass with specific detection criteria for each vulnerability type, and (2) an architectural pass that examines the overall application structure, authentication flows, trust boundaries, and data flow paths. Aggregate findings from both passes with deduplication.",
      C: "Run the code-level pass only and infer architectural issues from code patterns",
      D: "Run the architectural pass only since it covers the broader picture"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single pass trying to cover both code-level and architectural concerns suffers from attention dilution. The analytical perspective needed for finding SQL injection is different from evaluating trust boundaries.",
      B: "CORRECT: Specialized passes focus attention on their specific domain. The code-level pass applies detailed pattern matching for known vulnerability types. The architectural pass takes a broader view of system structure, authentication flows, and trust boundaries. Aggregation with deduplication combines findings without redundancy.",
      C: "INCORRECT: Code-level analysis cannot reliably detect architectural issues. Missing authentication layers are not visible in individual code files.",
      D: "INCORRECT: Architectural review cannot catch specific code-level vulnerabilities like SQL injection or XSS, which require line-by-line code analysis."
    }
  },
  {
    id: "d4-093",
    domain: "D4",
    taskStatement: "4.1",
    topic: "Criteria Evolution and Maintenance",
    difficulty: "medium",
    scenario: 5,
    importance: "A platform team's review criteria must evolve as the codebase adopts new frameworks and patterns, where stale criteria flag acceptable new patterns as issues.",
    question: "Your code review criteria were written 6 months ago. The team has since adopted a new state management library, and the review now flags standard patterns from that library as issues. What is the best approach?",
    choices: {
      A: "Tell developers to ignore findings about the new library",
      B: "Update the explicit criteria to include the new library's standard patterns as acceptable, and add negative criteria (patterns NOT to flag) specific to the library's idiomatic usage patterns",
      C: "Disable the review system until all criteria can be rewritten",
      D: "Add 'be aware of modern library patterns' to the prompt"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Telling developers to ignore certain findings undermines trust in the entire system. Developers cannot reliably distinguish 'ignore this category' from other findings.",
      B: "CORRECT: Updating criteria to explicitly define acceptable patterns from the new library (negative criteria) prevents false positives while maintaining the review's value for genuine issues. This is the expected maintenance cycle for review criteria.",
      C: "INCORRECT: Disabling the entire system to fix one category is disproportionate. Only the affected criteria need updating.",
      D: "INCORRECT: 'Be aware of modern patterns' is too vague to prevent false positives on specific library patterns."
    }
  },
  {
    id: "d4-094",
    domain: "D4",
    taskStatement: "4.2",
    topic: "Few-Shot for Chain-of-Thought Extraction",
    difficulty: "hard",
    scenario: 6,
    importance: "An insurance underwriting system must extract risk factors from complex narrative descriptions, where the connection between narrative text and structured risk categories requires multi-step reasoning.",
    question: "Your underwriting extraction must identify risk factors from free-form property descriptions like 'The building is a converted warehouse with original timber framing from 1920, no sprinkler system, and roof-mounted solar panels.' Simple extraction misses implied risks. What few-shot approach addresses this?",
    choices: {
      A: "Include examples with only the final extracted risk factors",
      B: "Include examples that demonstrate chain-of-thought reasoning: '1920s timber framing implies elevated fire risk, no sprinkler system compounds fire risk severity, solar panels on old roof imply electrical and structural risk,' then show the structured output with explicit risk factors and their reasoning chains",
      C: "Add a comprehensive list of all possible risk factors to the prompt",
      D: "Use separate extraction calls for each risk category"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Without reasoning chains, the model does not learn to make the inferential connections between narrative descriptions and implied risk factors.",
      B: "CORRECT: Few-shot examples with chain-of-thought reasoning demonstrate how to infer implicit risk factors from narrative descriptions. The model learns the reasoning pattern (old timber + no sprinklers = compounded fire risk) and can apply similar reasoning to novel descriptions.",
      C: "INCORRECT: A risk factor list tells the model what to look for but not how to reason from narrative text to structured risk categories. The inferential step is the key challenge.",
      D: "INCORRECT: Separate calls for each category miss compound risks that emerge from the interaction of multiple factors (timber framing + no sprinklers)."
    }
  },
  {
    id: "d4-095",
    domain: "D4",
    taskStatement: "4.3",
    topic: "Schema Design for Multi-Entity Documents",
    difficulty: "hard",
    scenario: 6,
    importance: "A legal document processing system must extract data about multiple parties from a single contract, where confusing which data belongs to which party could invalidate the extraction.",
    question: "Your contract extraction schema must handle documents with multiple parties (buyer, seller, guarantor, escrow agent). Each party has similar fields (name, address, contact). How should you design the schema to prevent cross-party data confusion?",
    choices: {
      A: "Use flat fields: buyer_name, buyer_address, seller_name, seller_address, etc.",
      B: "Design a 'party' object type with name, address, contact, and role (enum: buyer, seller, guarantor, escrow_agent) fields. Use an array of party objects. Include a 'source_clause' field referencing where each party's details were found in the document.",
      C: "Extract all names into one array and all addresses into another, then match them by position",
      D: "Create separate extraction calls for each party"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Flat fields cannot handle variable numbers of parties and become unwieldy with many party types. A contract with 6 parties would need dozens of prefixed fields.",
      B: "CORRECT: A typed party object with a role enum cleanly encapsulates per-party data, scales to any number of parties, and the source_clause field enables verification that each party's data was extracted from the correct section of the document.",
      C: "INCORRECT: Position-based matching is fragile and error-prone. If one name is missed, all subsequent matches are shifted, causing systematic cross-party confusion.",
      D: "INCORRECT: Separate extraction calls lose the context of how parties relate to each other within the contract. Cross-references between parties (guarantor guarantees buyer's obligations) are missed."
    }
  },
  {
    id: "d4-096",
    domain: "D4",
    taskStatement: "4.4",
    topic: "Pattern Analysis for Systematic Improvement",
    difficulty: "hard",
    scenario: 5,
    importance: "A platform engineering team must move from reactive false positive firefighting to systematic prompt improvement based on data-driven pattern analysis.",
    question: "After 3 months of collecting detected_pattern data from your code review system, analysis reveals that 60% of false positives come from a single pattern: the model flags variable shadowing in Python list comprehensions as a bug. What is the most effective targeted fix?",
    choices: {
      A: "Retrain the model on Python-specific code patterns",
      B: "Add explicit negative criteria: 'Do NOT flag variable shadowing in list comprehensions, generator expressions, or lambda functions, as Python's scoping rules make this a standard pattern. Only flag shadowing when an outer variable is accidentally overwritten in a nested function or class scope with different semantics.'",
      C: "Disable all variable-related checks",
      D: "Add a general instruction to 'understand Python scoping rules'"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Model retraining is not available as a prompt engineering intervention and is not part of the CCA-F domain.",
      B: "CORRECT: The detected_pattern data pinpointed the exact pattern causing 60% of false positives. Adding explicit negative criteria for that specific pattern, with positive criteria for genuine shadowing issues, directly addresses the dominant false positive source with surgical precision.",
      C: "INCORRECT: Disabling all variable checks eliminates many true positives along with the false positives. The issue is one specific pattern, not the entire category.",
      D: "INCORRECT: General instructions about Python scoping are too vague to address the specific list comprehension shadowing pattern identified by the data."
    }
  },
  {
    id: "d4-097",
    domain: "D4",
    taskStatement: "4.5",
    topic: "Batch Processing for Multi-Region Compliance",
    difficulty: "hard",
    scenario: 6,
    importance: "A multinational corporation must process documents from 20 countries with different regulatory requirements, where the batch strategy must account for per-country volume variations and priority differences.",
    question: "Your multinational extraction pipeline processes documents from 20 countries with varying volumes (US: 50,000/month, Luxembourg: 200/month) and different regulatory deadlines. How should you design the batch strategy?",
    choices: {
      A: "Combine all countries into a single batch for simplicity",
      B: "Group countries by regulatory deadline urgency and volume. Submit high-priority/high-volume countries in frequent larger batches, and group low-volume countries together in less frequent combined batches. Use custom_id prefixes (e.g., 'US-doc-12345', 'LU-doc-001') to maintain per-country traceability.",
      C: "Process each country separately in its own batch regardless of volume",
      D: "Process all countries synchronously to meet the tightest deadline"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single batch ignores deadline variations. Documents from countries with urgent deadlines should not wait for countries with relaxed timelines.",
      B: "CORRECT: Grouping by deadline and volume optimizes batch efficiency while meeting per-country SLAs. Custom_id prefixes maintain traceability at the country-document level. High-volume countries justify dedicated batches, while low-volume countries can be efficiently combined.",
      C: "INCORRECT: 200 Luxembourg documents per month do not justify a separate batch. Tiny batches are inefficient and create unnecessary operational complexity.",
      D: "INCORRECT: Processing everything synchronously at the tightest deadline costs 2x batch pricing for the majority of documents that have relaxed deadlines."
    }
  },
  {
    id: "d4-098",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Calibrated Review Routing Architecture",
    difficulty: "hard",
    scenario: 5,
    importance: "A regulated industry's code review pipeline must route findings to appropriate reviewers based on domain expertise, finding complexity, and confidence level to meet compliance requirements.",
    question: "Your automated review produces findings across security, performance, and correctness categories. You need to route findings to specialized reviewers (security team, performance team, domain experts) with appropriate prioritization. Which architecture supports this?",
    choices: {
      A: "Send all findings to all reviewer teams and let them self-select",
      B: "Use a multi-pass architecture where each specialized pass produces findings with category labels and confidence levels, then a routing layer maps findings to reviewer teams based on category. Low-confidence findings get escalated to senior specialists, and cross-category findings (e.g., a security issue with performance implications) get routed to both teams.",
      C: "Route based on file path: security team reviews auth files, performance team reviews database files",
      D: "Route all findings to a single senior reviewer who redistributes manually"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: Broadcasting all findings to all teams creates noise and diffuses responsibility. Teams waste time reviewing findings outside their expertise.",
      B: "CORRECT: Specialized passes produce categorized, confidence-scored findings. The routing layer uses these metadata to direct findings to the right teams. Cross-category routing handles findings that span domains. Confidence-based escalation ensures senior specialists focus on the most uncertain findings.",
      C: "INCORRECT: File path is a poor proxy for finding category. A security vulnerability in a database file needs the security team, not the performance team.",
      D: "INCORRECT: Manual redistribution does not scale and creates a single point of failure in the review pipeline."
    }
  },
  {
    id: "d4-099",
    domain: "D4",
    taskStatement: "4.6",
    topic: "End-to-End Multi-Pass Pipeline",
    difficulty: "hard",
    scenario: 5,
    importance: "A large technology company must design a complete multi-pass review pipeline that balances thoroughness, cost, and latency for their 2,000 PRs per week.",
    question: "You are designing a complete code review pipeline for a company processing 2,000 PRs per week. PRs range from 1 to 100+ files. Which multi-pass architecture best balances thoroughness, cost, and latency?",
    choices: {
      A: "Single comprehensive pass for all PRs regardless of size",
      B: "Adaptive multi-pass: (1) for small PRs (<10 files), use a single-pass review; (2) for large PRs (10+ files), use per-file passes plus a cross-file integration pass; (3) for all PRs, send findings through an independent verification pass; (4) route low-confidence verified findings to human review via confidence-based routing",
      C: "Always use the full multi-pass pipeline regardless of PR size",
      D: "Skip automated review for small PRs and only review large ones"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single pass on 100+ file PRs will miss issues due to attention dilution. This under-invests in large, complex PRs.",
      B: "CORRECT: Adaptive architecture matches pipeline complexity to PR complexity. Small PRs get efficient single-pass review. Large PRs get multi-pass to prevent attention dilution. Independent verification catches false positives across both paths. Confidence-based routing optimizes human reviewer allocation.",
      C: "INCORRECT: Full multi-pass for a 2-file PR wastes 3-4x the cost for negligible quality improvement. The pipeline should scale with PR complexity.",
      D: "INCORRECT: Small PRs can still contain critical bugs. Skipping review based on size creates coverage gaps."
    }
  },
  {
    id: "d4-100",
    domain: "D4",
    taskStatement: "4.6",
    topic: "Combining Multi-Pass with Batch Processing",
    difficulty: "hard",
    scenario: 5,
    importance: "A platform team must integrate batch processing cost savings with multi-pass review architecture for overnight codebase-wide audits, optimizing both quality and cost.",
    question: "Your nightly codebase audit reviews 5,000 files across 200 modules. You want to combine multi-pass architecture with the Batch API for cost savings. How should you design this?",
    choices: {
      A: "Submit all 5,000 files in a single batch for a single-pass review",
      B: "Submit per-file analysis as Batch 1 (5,000 requests at 50% savings). After completion, submit cross-module integration analysis as Batch 2 (200 requests using per-file summaries). After Batch 2, submit independent verification as Batch 3. Each batch uses custom_ids for file/module correlation.",
      C: "Use synchronous API for per-file passes and batch for cross-module passes",
      D: "Submit everything in one batch and include multi-pass instructions in each prompt"
    },
    correct: "B",
    explanations: {
      A: "INCORRECT: A single-pass review of 5,000 files suffers from severe attention dilution, missing issues in most files regardless of batch vs sync API choice.",
      B: "CORRECT: Sequential batches implement the multi-pass architecture at batch pricing. Batch 1 handles per-file analysis (highest volume, biggest cost savings). Batch 2 performs cross-module integration using per-file summaries. Batch 3 provides independent verification. All three benefit from 50% batch savings, and custom_ids maintain traceability across batches.",
      C: "INCORRECT: Using synchronous API for 5,000 per-file passes wastes 50% savings on the highest-volume stage. Since this is an overnight audit with no latency requirement, all stages can use batch processing.",
      D: "INCORRECT: The Batch API does not support multi-turn processing within a single request. Multi-pass architecture requires separate batch submissions for each pass."
    }
  }
];
