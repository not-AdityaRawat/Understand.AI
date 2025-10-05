import { BufferMemory, ChatMessageHistory } from "langchain/memory"
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import type { ProjectSession, ProjectPhase, RequirementsData, DesignData, TasksData } from "../types/project"

export interface ChatContext {
  sessionId: string
  // Project session for Understand.AI workflow
  projectSession?: ProjectSession
  conversationHistory: Array<{
    role: "user" | "assistant" | "system"
    content: string
    timestamp: number
  }>
  metadata: {
    createdAt: number
    updatedAt: number
    messageCount: number
  }
}

/**
 * Memory manager for Traycer AI sessions
 * Maintains conversation history, active plans, and context
 */
export class TracerMemoryManager {
  private sessions: Map<string, ChatContext>
  private maxMessagesPerSession: number

  constructor(maxMessagesPerSession: number = 50) {
    this.sessions = new Map()
    this.maxMessagesPerSession = maxMessagesPerSession
  }

  /**
   * Create a new session
   */
  createSession(sessionId: string): ChatContext {
    const context: ChatContext = {
      sessionId,
      conversationHistory: [],
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: 0,
      },
    }

    this.sessions.set(sessionId, context)
    return context
  }

  /**
   * Get or create a session
   */
  getSession(sessionId: string): ChatContext {
    const existing = this.sessions.get(sessionId)
    if (existing) {
      return existing
    }
    return this.createSession(sessionId)
  }

  /**
   * Add a message to session history
   */
  addMessage(
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string
  ): void {
    const session = this.getSession(sessionId)

    session.conversationHistory.push({
      role,
      content,
      timestamp: Date.now(),
    })

    // Trim history if too long
    if (session.conversationHistory.length > this.maxMessagesPerSession) {
      session.conversationHistory = session.conversationHistory.slice(
        -this.maxMessagesPerSession
      )
    }

    session.metadata.updatedAt = Date.now()
    session.metadata.messageCount++

    this.sessions.set(sessionId, session)
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId: string): ChatContext["conversationHistory"] {
    const session = this.sessions.get(sessionId)
    return session?.conversationHistory || []
  }

  /**
   * Create a LangChain memory instance for a session
   */
  async createLangChainMemory(sessionId: string): Promise<BufferMemory> {
    const session = this.getSession(sessionId)
    const messages = session.conversationHistory.map(msg => {
      switch (msg.role) {
        case "user":
          return new HumanMessage(msg.content)
        case "assistant":
          return new AIMessage(msg.content)
        case "system":
          return new SystemMessage(msg.content)
      }
    })

    const chatHistory = new ChatMessageHistory(messages)

    return new BufferMemory({
      chatHistory,
      returnMessages: true,
      memoryKey: "chat_history",
    })
  }

  /**
   * Get context summary for a session
   */
  getContextSummary(sessionId: string): string {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return "No context available"
    }

    let summary = `Session: ${sessionId}\n`
    summary += `Messages: ${session.metadata.messageCount}\n`
    
    // Project session info
    if (session.projectSession) {
      summary += `Project: ${session.projectSession.projectName}\n`
      summary += `Phase: ${session.projectSession.currentPhase}\n`
      summary += `Questions Asked: ${session.projectSession.questionsAsked.length}\n`
      if (session.projectSession.requirements) {
        summary += `  ✓ Requirements generated\n`
      }
      if (session.projectSession.design) {
        summary += `  ✓ Design generated\n`
      }
      if (session.projectSession.tasks) {
        summary += `  ✓ Tasks generated\n`
      }
    }

    return summary
  }

  /**
   * Initialize project session for Understand.AI workflow
   */
  initializeProjectSession(sessionId: string, projectName: string): ProjectSession {
    const session = this.getSession(sessionId)
    
    const projectSession: ProjectSession = {
      sessionId,
      projectName,
      currentPhase: "requirements",
      conversationHistory: [],
      questionsAsked: [],
      userAnswers: {},
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastPhaseChange: Date.now(),
      },
    }

    session.projectSession = projectSession
    this.sessions.set(sessionId, session)
    
    return projectSession
  }

  /**
   * Get project session
   */
  getProjectSession(sessionId: string): ProjectSession | undefined {
    const session = this.sessions.get(sessionId)
    return session?.projectSession
  }

  /**
   * Update project phase
   */
  updateProjectPhase(sessionId: string, phase: ProjectPhase): void {
    const session = this.getSession(sessionId)
    if (session.projectSession) {
      session.projectSession.currentPhase = phase
      session.projectSession.metadata.updatedAt = Date.now()
      session.projectSession.metadata.lastPhaseChange = Date.now()
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Store requirements data
   */
  setRequirements(sessionId: string, requirements: RequirementsData): void {
    const session = this.getSession(sessionId)
    if (session.projectSession) {
      session.projectSession.requirements = requirements
      session.projectSession.metadata.updatedAt = Date.now()
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Store design data
   */
  setDesign(sessionId: string, design: DesignData): void {
    const session = this.getSession(sessionId)
    if (session.projectSession) {
      session.projectSession.design = design
      session.projectSession.metadata.updatedAt = Date.now()
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Store tasks data
   */
  setTasks(sessionId: string, tasks: TasksData): void {
    const session = this.getSession(sessionId)
    if (session.projectSession) {
      session.projectSession.tasks = tasks
      session.projectSession.metadata.updatedAt = Date.now()
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Add question to asked list
   */
  addAskedQuestion(sessionId: string, question: string): void {
    const session = this.getSession(sessionId)
    if (session.projectSession) {
      session.projectSession.questionsAsked.push(question)
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Store user answer
   */
  addUserAnswer(sessionId: string, question: string, answer: string): void {
    const session = this.getSession(sessionId)
    if (session.projectSession) {
      session.projectSession.userAnswers[question] = answer
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Check if phase is complete
   */
  isPhaseComplete(sessionId: string, phase: ProjectPhase): boolean {
    const session = this.sessions.get(sessionId)
    if (!session?.projectSession) return false

    switch (phase) {
      case "requirements":
        return !!session.projectSession.requirements
      case "design":
        return !!session.projectSession.design
      case "tasks":
        return !!session.projectSession.tasks
      case "complete":
        return !!(session.projectSession.requirements && 
                  session.projectSession.design && 
                  session.projectSession.tasks)
      default:
        return false
    }
  }

  /**
   * Clear session data
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    this.sessions.clear()
  }

  /**
   * Export session data for persistence
   */
  exportSession(sessionId: string): ChatContext | null {
    const session = this.sessions.get(sessionId)
    return session || null
  }

  /**
   * Import session data from storage
   */
  importSession(context: ChatContext): void {
    this.sessions.set(context.sessionId, context)
  }

  /**
   * Get all active session IDs
   */
  getActiveSessions(): string[] {
    return Array.from(this.sessions.keys())
  }

  /**
   * Prune old sessions (older than specified hours)
   */
  pruneOldSessions(hoursOld: number = 24): number {
    const cutoffTime = Date.now() - hoursOld * 60 * 60 * 1000
    let prunedCount = 0

    for (const [sessionId, context] of this.sessions.entries()) {
      if (context.metadata.updatedAt < cutoffTime) {
        this.sessions.delete(sessionId)
        prunedCount++
      }
    }

    return prunedCount
  }
}

// Singleton instance for the application
let memoryManager: TracerMemoryManager | null = null

/**
 * Get the global memory manager instance
 */
export function getMemoryManager(): TracerMemoryManager {
  if (!memoryManager) {
    memoryManager = new TracerMemoryManager()
  }
  return memoryManager
}

/**
 * Reset the global memory manager (useful for testing)
 */
export function resetMemoryManager(): void {
  memoryManager = null
}
