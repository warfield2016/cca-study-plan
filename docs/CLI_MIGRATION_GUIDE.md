# Migrating from the Claude desktop app to the terminal (or Antigravity)

If you're studying for the CCA-F exam, most of the content you're learning — agentic loops, hooks, MCP, CLAUDE.md hierarchy, path-specific rules — is designed around the Claude Code **CLI** and the **Agent SDK**, not the Claude desktop app. The desktop app is a great chat interface, but the certification is about building and operating agentic systems from the terminal, where hooks, skills, subagents, and session forking actually happen.

So sooner or later, if you want the concepts to click, you'll want to switch your daily driver from the desktop app to the terminal. This guide makes that switch comfortable.

**Good news:** your Claude Max subscription already covers both the desktop app and the CLI. You're not buying anything new. You're just changing the interface.

## Who this guide is for

- You have a **Claude Max plan** ($100/mo or $200/mo) — covers both the Claude desktop app and the Claude Code CLI ([Claude Max plan details](https://claude.com/pricing/max))
- You currently use the Claude desktop app on macOS for Claude Code
- You want to switch to either: (A) just the terminal, or (B) Google Antigravity IDE + the terminal
- You're not afraid of the command line, but you don't want to fumble

## Two paths

**Path A — Terminal only.** Run `claude` in a macOS terminal (Terminal.app, iTerm2, Warp, or Ghostty). Lightweight, direct, maps 1:1 to what the CCA exam tests.

**Path B — Antigravity + terminal.** Use Google Antigravity as your IDE (free public preview, supports Claude Sonnet 4.6 and Opus 4.6) and run Claude Code in its integrated terminal. Best if you also want an agentic IDE experience alongside Claude Code.

You can do both. Antigravity uses Gemini by default but supports Claude models; Claude Code in the terminal is always available regardless of which IDE you use.

---

## Path A: Just the terminal + Claude Code CLI

### Step 1 — Pick a terminal

macOS Terminal.app works fine. If you want something nicer:

- **iTerm2** (free, mature, great for Claude Code) — `brew install --cask iterm2`
- **Warp** (modern, AI-assisted) — `brew install --cask warp`
- **Ghostty** (fast, new, native) — `brew install --cask ghostty`

Stick with Terminal.app if you're unsure. You can always swap later.

### Step 2 — Install Claude Code CLI

The current recommended install (2026) is the native installer or Homebrew. npm install is deprecated.

```bash
# Option 1 — native installer (recommended)
curl -fsSL https://claude.ai/install.sh | bash

# Option 2 — Homebrew
brew install --cask claude-code
```

Verify it's installed:

```bash
claude --version
```

Reference: [Claude Code setup docs](https://code.claude.com/docs/en/setup) · [npm package (deprecated)](https://www.npmjs.com/package/@anthropic-ai/claude-code)

### Step 3 — Sign in with your Max subscription

Navigate to any project directory and run:

```bash
cd ~/your-project
claude
```

On first launch, Claude Code opens a browser window for OAuth sign-in. Sign in with the same Anthropic account that holds your Max subscription. That's it — no separate payment, no API key setup. Your Max usage limits apply to the CLI.

### Step 4 — Learn the five slash commands you'll use every day

Inside a Claude Code session:

| Command | What it does |
|---|---|
| `/help` | Lists every available command. Read this once. |
| `/clear` | Clears the current conversation. Starts fresh context. |
| `/compact` | Summarizes the current conversation to reclaim context budget. Use when you hit ~80% of the window. |
| `/resume` | Resumes a prior named session. |
| `/model` | Switches between Sonnet 4.6, Opus 4.6, Haiku 4.5. |

The desktop app has buttons for most of these. In the CLI, you type them.

### Step 5 — Recreate your desktop-app habits

Here's the translation table:

| In the desktop app you... | In the terminal you... |
|---|---|
| Clicked "New chat" | `/clear` (or quit and re-run `claude`) |
| Attached a file | Just mention the file path; Claude reads it with the Read tool |
| Dragged in a screenshot | Paste the image into the terminal (iTerm2, Warp, Ghostty support this) or save it to disk and mention the path |
| Used the settings menu | Edit `~/.claude/settings.json` or create `.claude/settings.json` in your project |
| Saved "custom instructions" | Create `CLAUDE.md` at the project root — same purpose, version-controllable |
| Used Projects with specific context | Use a directory-local `CLAUDE.md` + `.claude/rules/` with glob patterns |

Everything the desktop app does, the CLI does — plus hooks, skills, subagents, MCP servers, and scripting, which the desktop app can't fully expose.

### Step 6 — Set up one `CLAUDE.md` to prove it works

Inside any project directory:

```bash
cat > CLAUDE.md << 'EOF'
# Project context
This is a [describe project] using [stack].

## Conventions
- Use [naming convention]
- Tests live in [path]
- Don't modify [file/dir] without asking
EOF

claude
```

Start chatting. Claude Code automatically loads your `CLAUDE.md`. Ask it "what conventions should you follow in this project?" and verify it reads them back.

You've now done what the desktop app's "custom instructions" did, but in a file you own and can check into git.

---

## Path B: Antigravity + Claude Code CLI

Google Antigravity is an agent-first IDE launched in public preview on November 18, 2025, alongside Gemini 3. It's free, runs on macOS, and supports Claude Sonnet 4.6 and Opus 4.6 as model options ([Google Antigravity blog post](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/) · [Codelab: Getting Started](https://codelabs.developers.google.com/getting-started-google-antigravity)).

### Step 1 — Install Antigravity

Download from [antigravity.google](https://antigravity.google) for macOS. Open the installer and drag to Applications.

On first launch:

1. Choose to **import settings from VS Code or Cursor** if you already use one of those (saves time).
2. Pick your keybindings (VS Code preset is the safest choice).
3. When asked, **install the `agy` CLI tool** — this lets you open Antigravity from the terminal with `agy .`

### Step 2 — Install Claude Code CLI (same as Path A, Step 2)

You still need the CLI. Antigravity's integrated terminal runs `claude` just like any other terminal.

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
```

### Step 3 — Choose your Antigravity development mode

Antigravity offers three modes:

- **Agent-driven (Autopilot)** — agents act without asking. Skip this while learning.
- **Review-driven** — agent asks permission before every action. Safe but slow.
- **Agent-assisted (recommended)** — agent handles safe automations, asks for risky ones.

Start with **Agent-assisted**.

### Step 4 — Configure Antigravity to use Claude

In Antigravity's settings, switch the default model to **Claude Sonnet 4.6** (Opus 4.6 is slower but stronger for architecture). This routes Antigravity's built-in agents through Claude instead of Gemini.

Note: Antigravity's Claude usage may be billed separately depending on preview terms. Your Claude Max subscription covers the Claude Code CLI; Antigravity's own agent calls may have their own rate limits during preview.

### Step 5 — Open Antigravity's integrated terminal and run Claude Code

`View → Terminal` (or `Ctrl + backtick`). You now have two agent surfaces side by side:

- **Antigravity's agents** in the editor/Manager view
- **Claude Code** in the terminal

Use Antigravity's agents for **inline editing, quick refactors, planning artifacts**. Use Claude Code in the terminal for **longer sessions, hooks, skills, subagents, MCP, and anything where you need precise control**.

### Step 6 — Set up `CLAUDE.md` (same as Path A, Step 6)

Antigravity sees `CLAUDE.md` like any other text file, but Claude Code in the terminal automatically loads it as context.

---

## Daily workflow comparison

| Task | Desktop app | Path A (terminal) | Path B (Antigravity + terminal) |
|---|---|---|---|
| Start a coding session | Open app, click project | `cd project && claude` | `agy project && cmd+backtick && claude` |
| Review a PR | Paste diff into chat | `claude --print "review this" < diff.patch` | Antigravity agent or terminal |
| Run a multi-file refactor | One long chat, hope for the best | `claude` with `CLAUDE.md` + Task subagents | Antigravity Manager + Claude Code |
| Check what the agent is doing | Scroll through chat | TodoWrite shows live progress | Mission Control shows agent artifacts |
| Save a prompt you reuse | Bookmark in browser | `.claude/commands/name.md` slash command | Same + Antigravity skills |
| Enforce a rule automatically | Not possible | `.claude/settings.json` hook | Same |

## Essential slash commands (print this, keep it nearby)

```
/help       list all commands
/clear      reset conversation
/compact    summarize to reclaim context
/model      switch between Sonnet/Opus/Haiku
/resume     resume a named session
/tasks      list background tasks
/config     adjust settings for this session
/init       create a CLAUDE.md from the current project
```

## Common gotchas

- **`claude: command not found`** after installing — restart your terminal, or run `source ~/.zshrc`. If still missing, check `echo $PATH` and ensure `/usr/local/bin` (Homebrew) or `~/.local/bin` (native installer) is in it. ([Known issue](https://github.com/anthropics/claude-code/issues/3172))
- **Pasted images don't work** — use iTerm2, Warp, or Ghostty. macOS Terminal.app can't paste images into terminal apps.
- **Claude Code feels slower than the desktop app** — the CLI streams tokens character-by-character over the terminal; the desktop app buffers. It's the same model, same speed; only the rendering differs.
- **Context runs out faster in the CLI** — the desktop app does aggressive auto-compaction. In the CLI, you control it with `/compact`. Run it when the context bar shows >80%.
- **"Which model am I using?"** — `/model` tells you. Max subscribers default to Sonnet 4.6.

## Gentle onboarding plan (1 week)

**Day 1** — Install Claude Code, run `claude --version`, open a toy project, have one conversation. Don't do anything important yet.

**Day 2** — Create a `CLAUDE.md` in one of your real projects. Have Claude follow its conventions.

**Day 3** — Learn `/compact` and `/clear`. Use both today at least once.

**Day 4** — Try `.claude/commands/` — create one custom slash command for a repetitive task.

**Day 5** — Try a hook. Add a simple `PostToolUse` hook in `.claude/settings.json` that echoes a message after file edits. (This is what the CCA-F exam tests heavily.)

**Day 6** — Install Antigravity if you want Path B. Otherwise, spend today in the terminal and notice what you miss from the desktop app.

**Day 7** — Decide: are you staying in the terminal, going to Antigravity, or keeping the desktop app for some things? All three are fine. Many people keep the desktop app for quick chats and use the CLI for actual coding.

## When to keep the desktop app

- Quick questions not tied to a codebase
- Image-heavy conversations (screenshots, diagrams)
- When you're on a different machine and don't want to install the CLI

The desktop app and the CLI share your Max subscription — there's no reason to pick one exclusively.

---

## Sources

- [Claude Code by Anthropic — product page](https://claude.com/product/claude-code)
- [Claude Code setup documentation](https://code.claude.com/docs/en/setup)
- [Claude Max plan details](https://claude.com/pricing/max)
- [Claude Code npm package (deprecated install)](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- [Google Antigravity — official blog post](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
- [Google Antigravity — Codelabs: Getting Started](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Google Antigravity — Wikipedia](https://en.wikipedia.org/wiki/Google_Antigravity)
