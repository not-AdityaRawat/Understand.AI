# Understand.AI 🎯

> **Transform your project ideas into actionable documentation**

An intelligent AI assistant that guides developers through a structured three-phase planning process: Requirements → Design → Tasks. Get comprehensive, downloadable documentation ready for implementation by AI coding agents.

## What is Understand.AI?

Understand.AI helps you think through your project thoroughly *before* writing code. Through conversational Q&A, it gathers requirements, creates system architecture, and generates a detailed implementation roadmap—all in the form of downloadable `.md` files you can hand off to AI agents like Cursor, Windsurf, or Claude.

**The Problem:** Jumping straight into coding without proper planning leads to costly mistakes and technical debt.

**The Solution:** Understand.AI guides you through a proven planning workflow, asking the right questions at the right time.
<img width="1918" height="985" alt="image" src="https://github.com/user-attachments/assets/c8f3fafd-fd6e-4b76-9f66-4237e5085cf3" />

## Features ✨

- **🎯 Three-Phase Workflow**: Requirements → Design → Tasks
- **💬 Conversational Interface**: Ask questions naturally, get intelligent responses
- **� Document Generation**: Auto-generates Requirements.md, Design.md, and Tasks.md
- **💾 Session Memory**: Each project chat maintains its own context
- **� Downloadable Outputs**: Get markdown files ready for AI agents
- **🎨 Beautiful UI**: Clean, modern interface built with Next.js and shadcn/ui

## How It Works 🚀

1. **Requirements Phase**: The AI asks about your tech stack, features, theme, constraints, and target audience
2. **Design Phase**: Creates a comprehensive system architecture based on your requirements
3. **Tasks Phase**: Generates a chronological task list with clear acceptance criteria

Each phase produces a downloadable markdown document you can give to coding agents for implementation.

## Technology Stack 🛠️

- **Frontend**: Next.js 14, React 18, TypeScript
- **AI Engine**: LangChain with DeepSeek v3.2 via OpenRouter
- **UI Components**: Radix UI, TailwindCSS, shadcn/ui
- **State Management**: React Hooks, Session Memory Manager

## Getting Started 🏁

### Prerequisites

- Node.js 18+ or Bun
- OpenRouter API key (sign up at [openrouter.ai](https://openrouter.ai))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd understand-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenRouter API key to `.env.local`:
```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_MODEL=deepseek/deepseek-chat
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

Get your OpenRouter API key from: https://openrouter.ai/keys

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## How to Use 📖

### Example Session

**You**: "I want to build a task management app with user authentication"

**Understand.AI**: *Starts asking questions about your tech stack, features, target audience, etc.*

**Phase 1 Complete**: Requirements.md generated ✅

**Phase 2**: The AI designs your system architecture

**Phase 2 Complete**: Design.md generated ✅

**Phase 3**: The AI creates a detailed task breakdown

**Phase 3 Complete**: Tasks.md generated ✅

Now you have three downloadable documents you can give to Cursor, Windsurf, or Claude for implementation!

## Architecture 🏗️

### Core Components

- **`lib/langchain-agent.ts`**: Main conversational AI agent
- **`lib/chains/document-generator.ts`**: LangChain chains for generating .md documents
- **`lib/memory/session-manager.ts`**: Session and project state management
- **`lib/types/project.ts`**: TypeScript types for the three-phase workflow
- **`app/api/chat/route.ts`**: API route handling chat and document generation
- **`components/chat-interface.tsx`**: Main chat UI
- **`components/phase-indicator.tsx`**: Visual progress through phases
- **`components/document-download.tsx`**: Download buttons for generated documents

### How It Works

1. **User sends a message** → API route receives it
2. **Session manager** stores the message and tracks project state
3. **AI agent** processes the message and responds conversationally
4. **Phase detection** checks if enough info has been gathered
5. **Document generator** creates the appropriate .md file
6. **Frontend** displays the response and download button
- **`lib/tools/codebase-analyzer.ts`**: Tools for analyzing code structure
- **`lib/export/agent-handoff.ts`**: Export formatters for different AI agents
- **`lib/memory/session-manager.ts`**: Session and context management

### API Routes

- **`app/api/chat/route.ts`**: Main chat endpoint with intent detection

### UI Components

- **`components/plan-view.tsx`**: Display plans with steps and file changes
- **`components/export-dialog.tsx`**: Export dialog with multi-agent support
- **`components/chat-interface.tsx`**: Chat interface for conversations
- **`components/chat-sidebar.tsx`**: Sidebar with chat history

## Configuration ⚙️

### Environment Variables

See `.env.example` for all available configuration options.

Key settings:
- `OPENROUTER_API_KEY`: Required for AI functionality via OpenRouter
- `OPENROUTER_MODEL`: Model to use (default: deepseek/deepseek-chat)
- `OPENROUTER_BASE_URL`: OpenRouter API endpoint

### Model Selection

You can configure which model to use via OpenRouter:
- `deepseek/deepseek-chat`: Fast, intelligent, cost-effective (recommended) 💰
- `openai/gpt-4o-mini`: OpenAI's efficient model
- `anthropic/claude-3.5-sonnet`: Anthropic's powerful model
- `google/gemini-pro`: Google's Gemini model

Simply update the `OPENROUTER_MODEL` in your `.env.local` file.

## Development 👩‍💻

### Project Structure

```
understand-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── chat/         # Chat endpoint with phase detection
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (main chat)
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── chat-interface.tsx    # Main chat UI
│   ├── chat-sidebar.tsx      # Sidebar with chat history
│   ├── phase-indicator.tsx   # Three-phase progress display
│   └── document-download.tsx # Download buttons for .md files
├── lib/                   # Core logic
│   ├── chains/           # LangChain document generators
│   │   └── document-generator.ts
│   ├── memory/           # Session management
│   │   └── session-manager.ts
│   ├── types/            # TypeScript types
│   │   └── project.ts    # Three-phase workflow types
│   ├── langchain-agent.ts   # Conversational AI agent
│   └── utils.ts
└── public/               # Static assets
```

### Key Design Decisions

- **Why DeepSeek?** Cost-effective, fast, and excellent for structured output
- **Why Three Phases?** Proven planning methodology that prevents scope creep
- **Why Markdown?** Universal format compatible with all AI coding agents
- **Why Session Memory?** Each project needs isolated context
- **Why LangChain?** Simplified prompt engineering and model management

## Roadmap 🗺️

- [ ] Visual phase progress indicator in UI
- [ ] Inline document editing before download
- [ ] Support for more AI models (Claude, Gemini, Llama)
- [ ] Project templates (e-commerce, SaaS, mobile app, etc.)
- [ ] Export to GitHub Issues/Linear/Jira
- [ ] Collaborative planning (multiple users, one project)
- [ ] Integration with Cursor/Windsurf APIs for direct handoff

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

MIT License - see LICENSE file for details

## Credits 👏

- Built with [LangChain](https://langchain.com) for AI orchestration
- Powered by [DeepSeek v3.2](https://deepseek.com) via [OpenRouter](https://openrouter.ai)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Built on [Next.js 14](https://nextjs.org)

## Support 💬

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Understand.AI** - Think before you build 🧠✨

