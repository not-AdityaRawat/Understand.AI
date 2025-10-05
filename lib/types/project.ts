// Type definitions for Understand.AI workflow

export type ProjectPhase = "requirements" | "design" | "tasks" | "complete"

export interface RequirementsData {
  projectName: string
  description: string
  techStack: {
    frontend?: string[]
    backend?: string[]
    database?: string[]
    deployment?: string[]
    other?: string[]
  }
  features: string[]
  targetAudience: string
  constraints: string[]
  theme: {
    style?: string
    colors?: string[]
    preferences?: string
  }
  usage: {
    expectedUsers?: string
    scalability?: string
    performance?: string
  }
  timeline?: string
  budget?: string
  metadata: {
    createdAt: number
    updatedAt: number
    version: number
  }
}

export interface DesignData {
  architecture: {
    overview: string
    components: Array<{
      name: string
      responsibility: string
      dependencies: string[]
    }>
    dataFlow: string
  }
  dataModels: Array<{
    name: string
    fields: Array<{
      name: string
      type: string
      description: string
    }>
    relationships: string[]
  }>
  apiDesign: {
    endpoints: Array<{
      method: string
      path: string
      description: string
      requestBody?: string
      response: string
    }>
    authentication?: string
    rateLimit?: string
  }
  technologyChoices: {
    frontend: string
    backend: string
    database: string
    deployment: string
    rationale: string
  }
  deploymentStrategy: {
    environment: string
    cicd: string
    monitoring: string
  }
  metadata: {
    createdAt: number
    updatedAt: number
    version: number
    basedOnRequirements: string // requirements version
  }
}

export interface Task {
  id: string
  title: string
  description: string
  category: "setup" | "feature" | "testing" | "deployment" | "documentation"
  dependencies: string[] // IDs of tasks that must be completed first
  estimatedTime?: string
  acceptanceCriteria: string[]
  technicalDetails?: string
  order: number
}

export interface TasksData {
  tasks: Task[]
  totalEstimate?: string
  phases: Array<{
    name: string
    taskIds: string[]
    description: string
  }>
  metadata: {
    createdAt: number
    updatedAt: number
    version: number
    basedOnDesign: string // design version
  }
}

export interface ProjectSession {
  sessionId: string
  projectName: string
  currentPhase: ProjectPhase
  requirements?: RequirementsData
  design?: DesignData
  tasks?: TasksData
  conversationHistory: Array<{
    role: "user" | "assistant" | "system"
    content: string
    timestamp: number
    phase: ProjectPhase
  }>
  questionsAsked: string[]
  userAnswers: Record<string, string>
  metadata: {
    createdAt: number
    updatedAt: number
    lastPhaseChange: number
  }
}

export interface QuestionTemplate {
  id: string
  question: string
  category: "techstack" | "features" | "constraints" | "theme" | "usage" | "other"
  phase: ProjectPhase
  followUpQuestions?: string[]
  condition?: (session: ProjectSession) => boolean // Only ask if condition is true
}
