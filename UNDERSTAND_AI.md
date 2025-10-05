# Understand.AI - Project Planning Assistant

## Overview

**Understand.AI** is an intelligent project planning assistant that helps developers refine their project ideas through a structured, conversational process. Instead of diving directly into code, Understand.AI guides you through three phases to create comprehensive documentation that can be handed off to AI agents for implementation.

## Purpose

Transform vague project ideas into concrete, actionable plans through:
1. **Requirements Gathering** - Understanding what you want to build
2. **System Design** - Architecting how to build it
3. **Task Generation** - Breaking down the implementation steps

## The Three-Phase Workflow

### Phase 1: Requirements Gathering

**Goal:** Understand the complete vision for your project

**Process:**
- AI asks intelligent, context-aware questions
- Questions cover: tech stack, features, constraints, theme, target audience, scalability
- Conversational approach - ONE question at a time
- Follow-up questions based on your answers
- Collaborative, not interrogative

**Questions Asked:**
- What's your project about?
- Who is your target audience?
- What are the core features you need?
- Do you have tech stack preferences?
- What's your design/theme style?
- Any constraints (timeline, budget, performance)?
- Expected user scale?
- Any specific requirements?

**Output:** `Requirements.md` file containing:
- Project overview
- Target audience
- Core features list
- Technical stack preferences
- Design & theme preferences
- Constraints & requirements
- Success criteria

### Phase 2: System Design

**Goal:** Create a comprehensive architecture based on requirements

**Process:**
- AI generates a detailed design document
- Presents the design for your review
- Asks if any changes are needed
- Iterates based on your feedback
- Finalizes when you approve

**Design Includes:**
- Architecture overview (high-level system design)
- Component structure (frontend, backend, services)
- Data models (entities, relationships, schemas)
- API design (endpoints, methods, data flow)
- Technology stack rationale
- Security considerations
- Scalability & performance strategy
- Deployment architecture

**Output:** `Design.md` file containing:
- Architecture diagrams (Mermaid syntax)
- Component breakdown
- Data models with relationships
- API specifications
- Tech stack justification
- Deployment strategy

### Phase 3: Task Generation

**Goal:** Create a chronological, actionable task list

**Process:**
- AI analyzes the design document
- Generates specific, sequential tasks
- Each task includes acceptance criteria
- Tasks are ordered by dependencies
- Ready for AI agent execution

**Task Structure:**
```markdown
## Phase 1: Setup & Foundation
### Task 1: [Category] Task Title
**Description:** What needs to be done
**Dependencies:** Tasks that must be completed first
**Estimated Time:** Time estimate
**Acceptance Criteria:**
- Specific criterion 1
- Specific criterion 2
**Technical Details:**
- Implementation notes
- Code snippets
- Configuration details
```

**Task Phases:**
1. Project Setup & Configuration
2. Core Infrastructure
3. Database & Models
4. API Development
5. Frontend Components
6. Integration
7. Testing
8. Deployment
9. Documentation

**Output:** `Task.md` file containing:
- Numbered tasks in chronological order
- Dependencies clearly marked
- Acceptance criteria for each task
- Technical implementation details
- Ready for AI agent execution

## Architecture

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **shadcn/ui** components
- **localStorage** for chat persistence

### Backend
- **LangChain** for AI orchestration
- **OpenRouter** for LLM access
- **DeepSeek v3.2** as the model
- **Memory Manager** for session state

### Key Components

**1. Chat Interface (`components/chat-interface.tsx`)**
- Main conversation UI
- Markdown message rendering
- Loading animations
- Phase indicators

**2. Document Download (`components/document-download.tsx`)**
- Download Requirements.md
- Download Design.md
- Download Tasks.md
- One-click file export

**3. Phase Indicator (`components/phase-indicator.tsx`)**
- Visual progress through phases
- Shows completed, current, and upcoming phases
- Animated current phase indicator

**4. Document Generator (`lib/chains/document-generator.ts`)**
- LangChain chains for each document type
- Structured prompts for consistency
- Markdown formatting

**5. Memory Manager (`lib/memory/session-manager.ts`)**
- Tracks conversation state
- Stores project session data
- Manages phase transitions
- Persists requirements, design, and tasks

**6. LangChain Agent (`lib/langchain-agent.ts`)**
- Main conversational AI
- Follows three-phase workflow
- Context-aware responses
- Intelligent question generation

## User Flow

### Starting a New Project

1. User opens Understand.AI
2. Sees welcome screen: "Welcome to Understand.AI"
3. Starts describing project idea
4. AI asks first question about the project

### Requirements Phase

1. **AI:** "What's your project about?"
2. **User:** "I want to build a Netflix-like streaming platform"
3. **AI:** "Great! Who is your target audience?"
4. **User:** "Movie enthusiasts, 18-45 years old"
5. **AI:** "What are the core features you need?"
6. **User:** "Video streaming, user profiles, recommendations"
7. **AI:** "Do you have tech stack preferences?"
8. **User:** "React for frontend, Node.js for backend"
9. ... (continues until complete understanding)
10. **AI:** "Perfect! I'll generate your Requirements document."
11. **System:** Generates Requirements.md
12. **UI:** Download button appears for Requirements.md

### Design Phase

1. **AI:** "Based on your requirements, I've created a system design. Let me share it with you..."
2. **AI:** *Presents design in chat*
3. **AI:** "Would you like any changes to this design?"
4. **User:** "Add a microservices architecture instead"
5. **AI:** "Great idea! I'll update the design to use microservices..."
6. **AI:** *Presents updated design*
7. **User:** "Looks good!"
8. **System:** Generates Design.md
9. **UI:** Download button appears for Design.md

### Tasks Phase

1. **AI:** "Excellent! Now I'll create a detailed task list for implementation..."
2. **System:** Generates Task.md with all tasks
3. **AI:** "I've created 47 tasks across 9 phases. Here's a summary..."
4. **AI:** *Shows task overview*
5. **UI:** Download button appears for Task.md
6. **AI:** "You can now download Task.md and provide it to your preferred AI agent (Cursor, Windsurf, Claude, etc.) to build your project!"

## Features

### ✅ Intelligent Conversation
- Context-aware questions
- Follow-up questions based on answers
- ONE question at a time
- Natural, friendly tone
- Explains reasoning

### ✅ Persistent Memory
- Each chat maintains its own state
- Switch between projects seamlessly
- Resume where you left off
- Full conversation history

### ✅ Phase Tracking
- Visual indicators show progress
- Clear phase transitions
- Know exactly where you are

### ✅ Document Generation
- Professional markdown files
- Structured and detailed
- Ready to use
- One-click download

### ✅ AI Agent Ready
- Tasks are specific and actionable
- Clear acceptance criteria
- Chronological order
- Dependency tracking

## File Formats

### Requirements.md
```markdown
# Project Requirements: [Project Name]

## Project Overview
[Detailed description]

## Target Audience
[Who will use this]

## Core Features
1. Feature 1
2. Feature 2
...

## Technical Stack
- Frontend: ...
- Backend: ...
- Database: ...

## Design & Theme
[Preferences and style]

## Constraints
- Timeline: ...
- Budget: ...
- Performance: ...

## Success Criteria
[How to measure success]
```

### Design.md
```markdown
# System Design: [Project Name]

## Architecture Overview
[High-level description]
[Mermaid diagrams]

## Components
### Frontend
...
### Backend
...

## Data Models
### Entity 1
- field1: type
- field2: type

## API Design
### Endpoint 1
- Method: POST
- Path: /api/...
- Request: {...}
- Response: {...}

## Technology Stack Rationale
[Why each choice was made]

## Security
[Security considerations]

## Scalability
[How system will scale]

## Deployment
[Deployment strategy]
```

### Tasks.md
```markdown
# Implementation Tasks: [Project Name]

## Phase 1: Setup & Foundation

### Task 1: Initialize Project
**Description:** Set up the project structure
**Dependencies:** None
**Estimated Time:** 30 minutes
**Acceptance Criteria:**
- Project initialized with chosen framework
- Git repository created
- README.md created
**Technical Details:**
\`\`\`bash
npx create-next-app@latest
\`\`\`

### Task 2: Configure Environment
...

## Phase 2: Core Infrastructure
...

[Total: XX tasks across XX phases]
```

## API Reference

### Frontend API

**Send Message:**
```typescript
fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    messages: UIMessage[],
    sessionId: string
  })
})
```

### Backend API

**Document Generation:**
```typescript
const docGenerator = createDocumentGenerator()

// Generate Requirements
const requirements = await docGenerator.generateRequirements(session)

// Generate Design  
const design = await docGenerator.generateDesign(requirements, session)

// Generate Tasks
const tasks = await docGenerator.generateTasks(design, requirements)
```

**Memory Management:**
```typescript
const memoryManager = getMemoryManager()

// Initialize project session
memoryManager.initializeProjectSession(sessionId, projectName)

// Update phase
memoryManager.updateProjectPhase(sessionId, "design")

// Store documents
memoryManager.setRequirements(sessionId, requirementsData)
memoryManager.setDesign(sessionId, designData)
memoryManager.setTasks(sessionId, tasksData)

// Check completion
const isComplete = memoryManager.isPhaseComplete(sessionId, "requirements")
```

## Configuration

### Environment Variables

Required in `.env` file:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_MODEL=deepseek/deepseek-chat
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Benefits

### For Developers
- **Clarity:** Know exactly what you're building
- **Completeness:** No missing requirements
- **Confidence:** Validated design before coding
- **Efficiency:** Save time with structured planning

### For AI Agents
- **Specificity:** Clear, actionable tasks
- **Context:** Full project understanding
- **Sequence:** Proper task ordering
- **Criteria:** Know when tasks are complete

### For Projects
- **Quality:** Better architecture decisions
- **Speed:** Faster implementation
- **Cost:** Fewer mistakes and rework
- **Success:** Higher chance of project completion

## Use Cases

### 1. Solo Developer
- Clarify ideas before coding
- Create documentation for future reference
- Generate tasks for AI-assisted coding

### 2. Startup MVP
- Validate product ideas
- Create technical specifications
- Plan development roadmap

### 3. Client Projects
- Gather requirements systematically
- Present professional documentation
- Estimate project scope accurately

### 4. Learning Projects
- Understand system design principles
- Practice project planning
- Learn best practices

## Example Session

```
User: I want to build a task management app

AI: Great! Let's start by understanding your project better. 
    What's your target audience for this task management app?

User: Small teams and freelancers

AI: Perfect! What are the core features you envision?

User: Task creation, team collaboration, deadlines, notifications

AI: Excellent features! Do you have any tech stack preferences?

User: Modern, scalable, I'm familiar with React

AI: Got it! What about the design style - any preferences?

User: Clean, minimal, productivity-focused

AI: Great! Any constraints like timeline or budget?

User: 3 months, small budget

AI: Perfect! I have enough information. Let me generate your 
    Requirements document...

[System generates Requirements.md]

AI: ✓ Requirements.md is ready for download!
    
    Now, based on these requirements, I'll create a system design.
    I'm thinking of a React frontend with Next.js, PostgreSQL 
    database, and a REST API. The architecture will be...
    
    [Presents full design]
    
    What do you think? Any changes?

User: Looks good!

AI: Excellent! Let me finalize the design document...

[System generates Design.md]

AI: ✓ Design.md is ready for download!
    
    Now I'll create a detailed task list for implementation...

[System generates Tasks.md]

AI: ✓ Tasks.md is ready! 
    
    I've created 52 tasks across 9 phases. You can download 
    Task.md and provide it to Cursor, Windsurf, or any AI agent 
    to build your app!
```

## Future Enhancements

1. **Team Collaboration**
   - Share project sessions
   - Multi-user input
   - Collaborative refinement

2. **Template Library**
   - Pre-made project templates
   - Industry-specific questions
   - Best practice suggestions

3. **AI Agent Integration**
   - Direct handoff to Cursor/Windsurf
   - Progress tracking
   - Implementation feedback

4. **Version Control**
   - Track document changes
   - Compare versions
   - Rollback capability

5. **Export Formats**
   - PDF export
   - Notion integration
   - Jira ticket generation

## Summary

Understand.AI transforms project planning from chaotic to structured:

**Before Understand.AI:**
- Vague ideas
- Missing requirements
- Skip design phase
- Jump into coding
- Constant rework
- Incomplete projects

**With Understand.AI:**
- Clear requirements
- Validated design
- Actionable tasks
- Structured approach
- Efficient development
- Successful delivery

**Transform your project idea into production-ready plans in minutes!** 🚀
