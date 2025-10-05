import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import type { RequirementsData, DesignData, TasksData, ProjectSession } from "../types/project"

/**
 * Document Generator Chain
 * 
 * This file contains the LangChain prompts for generating our three core documents:
 * 1. Requirements.md - What the user wants to build
 * 2. Design.md - How the system will be architected
 * 3. Tasks.md - Step-by-step implementation guide
 * 
 * Each template uses carefully crafted prompts to produce high-quality, detailed documents
 */

// REQUIREMENTS TEMPLATE
// Takes conversation history and generates a structured requirements document
const REQUIREMENTS_TEMPLATE = `Based on the following conversation and gathered information, generate a comprehensive Requirements.md document.

Project Information:
{projectInfo}

Conversation History:
{conversationHistory}

User Answers:
{userAnswers}

Generate a well-structured Requirements.md document with the following sections:
1. Project Overview
2. Target Audience
3. Core Features
4. Technical Stack
5. Design & Theme Preferences
6. Constraints & Requirements
7. Success Criteria

Format the output as valid Markdown. Be specific and detailed. Include all gathered information.`

// DESIGN TEMPLATE
// Takes requirements and creates a comprehensive system architecture
const DESIGN_TEMPLATE = `Based on the requirements document, create a comprehensive system design.

Requirements:
{requirements}

Create a detailed Design.md document with:
1. Architecture Overview (high-level system design)
2. Component Structure (frontend, backend, services)
3. Data Models (entities, relationships, schemas)
4. API Design (endpoints, methods, data flow)
5. Technology Stack Rationale (why each technology was chosen)
6. Security Considerations
7. Scalability & Performance Strategy
8. Deployment Architecture

Format as valid Markdown with diagrams in Mermaid syntax where helpful.`

// TASKS TEMPLATE
// Takes design and requirements, outputs a chronological implementation plan
const TASKS_TEMPLATE = `Based on the design document, create a chronological task list for building the project.

Design Document:
{design}

Requirements:
{requirements}

Generate a Task.md document with numbered tasks in this format:

## Phase 1: Setup & Foundation
### Task 1: [Category] Task Title
**Description:** What needs to be done
**Dependencies:** Tasks that must be completed first (if any)
**Estimated Time:** Time estimate
**Acceptance Criteria:**
- Specific criterion 1
- Specific criterion 2
**Technical Details:**
- Implementation notes
- Code snippets if relevant
- Configuration details

Include these phases:
1. Project Setup & Configuration
2. Core Infrastructure
3. Database & Models
4. API Development
5. Frontend Components
6. Integration
7. Testing
8. Deployment
9. Documentation

Each task should be:
- Specific enough for an AI agent to execute
- In logical chronological order
- With clear acceptance criteria
- Properly sequenced with dependencies

Format as valid Markdown.`

/**
 * DocumentGeneratorChain
 * 
 * This class manages three LangChain sequences for generating markdown documents.
 * Each chain (requirements, design, tasks) uses the same model but different prompts.
 * 
 * We use temperature 0.3 for more consistent, structured output.
 */
export class DocumentGeneratorChain {
  private model: ChatOpenAI
  private requirementsChain: RunnableSequence
  private designChain: RunnableSequence
  private tasksChain: RunnableSequence

  constructor(apiKey?: string, modelName: string = "deepseek/deepseek-chat") {
    const key = apiKey || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    const baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
    
    // Using lower temperature (0.3) for more consistent document generation
    // We want structured output, not creative writing
    this.model = new ChatOpenAI({
      modelName,
      temperature: 0.3,
      openAIApiKey: key,
      configuration: {
        baseURL,
        defaultHeaders: {
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": "https://understand.ai",
          "X-Title": "Understand.AI",
        },
      },
    })

    // Build the three LangChain sequences
    // Each is: Prompt Template → Model → String Parser
    const requirementsPrompt = PromptTemplate.fromTemplate(REQUIREMENTS_TEMPLATE)
    const designPrompt = PromptTemplate.fromTemplate(DESIGN_TEMPLATE)
    const tasksPrompt = PromptTemplate.fromTemplate(TASKS_TEMPLATE)
    
    // Requirements chain: conversation → structured document
    this.requirementsChain = RunnableSequence.from([
      requirementsPrompt,
      this.model,
      new StringOutputParser(), // Converts model output to plain string
    ])

    // Design chain: requirements → system architecture
    this.designChain = RunnableSequence.from([
      designPrompt,
      this.model,
      new StringOutputParser(),
    ])

    // Tasks chain: design + requirements → implementation roadmap
    this.tasksChain = RunnableSequence.from([
      tasksPrompt,
      this.model,
      new StringOutputParser(),
    ])
  }

  /**
   * Generate Requirements.md
   * 
   * Takes all the Q&A from the requirements phase and turns it into
   * a comprehensive requirements document
   */
  async generateRequirements(session: ProjectSession): Promise<string> {
    try {
      // Prepare project info as JSON for the AI
      const projectInfo = JSON.stringify({
        projectName: session.projectName,
        phase: session.currentPhase,
      }, null, 2)

      // Filter conversation to only requirements-phase messages
      const conversationHistory = session.conversationHistory
        .filter(msg => msg.phase === "requirements")
        .map(msg => `${msg.role}: ${msg.content}`)
        .join("\n\n")

      const userAnswers = JSON.stringify(session.userAnswers, null, 2)

      // Run the chain and get the markdown document
      const result = await this.requirementsChain.invoke({
        projectInfo,
        conversationHistory,
        userAnswers,
      })

      return result
    } catch (error) {
      console.error("Requirements generation error:", error)
      throw error
    }
  }

  /**
   * Generate Design.md
   * 
   * Takes the requirements document and creates a detailed system architecture.
   * Includes component diagrams, data models, API design, etc.
   */
  async generateDesign(requirements: string, session: ProjectSession): Promise<string> {
    try {
      const result = await this.designChain.invoke({
        requirements,
      })

      return result
    } catch (error) {
      console.error("Design generation error:", error)
      throw error
    }
  }

  /**
   * Generate Tasks.md
   * 
   * Takes both design and requirements, outputs a chronological list of tasks
   * that an AI coding agent can follow to build the project.
   */
  async generateTasks(design: string, requirements: string): Promise<string> {
    try {
      const result = await this.tasksChain.invoke({
        design,
        requirements,
      })

      return result
    } catch (error) {
      console.error("Tasks generation error:", error)
      throw error
    }
  }
}

export function createDocumentGenerator(apiKey?: string): DocumentGeneratorChain {
  return new DocumentGeneratorChain(apiKey)
}
