import { type UIMessage } from "ai"
import { TracerAgent } from "@/lib/langchain-agent"
import { DocumentGeneratorChain } from "@/lib/chains/document-generator"
import { getMemoryManager } from "@/lib/memory/session-manager"
import type { ProjectPhase } from "@/lib/types/project"

// API Route Configuration
// maxDuration: 30 seconds - should be enough for AI responses but prevents timeouts
export const maxDuration = 30

// We use lazy initialization here to avoid crashes during Next.js build
// The agents only get created when someone actually makes a request
let agent: TracerAgent | null = null
let documentGenerator: DocumentGeneratorChain | null = null

function initializeAgents() {
  if (!agent) {
    try {
      agent = new TracerAgent()
      documentGenerator = new DocumentGeneratorChain()
    } catch (error) {
      console.error("Failed to initialize agents:", error)
      throw new Error("AI service initialization failed. Check your API key configuration.")
    }
  }
  return { agent, documentGenerator }
}

// Main POST handler - this is where all the magic happens
export async function POST(req: Request) {
  try {
    // Safety check: make sure we have an API key configured
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "API key not configured. Please add OPENROUTER_API_KEY to your .env.local file." 
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    // Initialize our AI agents
    const agents = initializeAgents()
    
    // Parse the incoming request - expecting messages array and optional sessionId
    const { messages, sessionId }: { messages: UIMessage[]; sessionId?: string } = await req.json()
    
    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 })
    }

    // Memory manager handles conversation history and project state
    // Each session gets its own isolated memory space
    const memoryManager = getMemoryManager()
    const effectiveSessionId = sessionId || `session-${Date.now()}`
    const session = memoryManager.getSession(effectiveSessionId)

    console.log(`Processing request for session: ${effectiveSessionId}`)
    console.log(`Session has ${session.conversationHistory.length} messages in memory`)

    // Extract the user's latest message from the messages array
    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.parts.find(p => p.type === "text")?.text || ""

    // Store this message in session history so we can reference it later
    memoryManager.addMessage(effectiveSessionId, "user", userMessage)

    // Project session tracks where we are in the three-phase workflow
    // If this is the first message, we initialize a new project
    let projectSession = memoryManager.getProjectSession(effectiveSessionId)
    if (!projectSession && messages.length === 1) {
      memoryManager.initializeProjectSession(effectiveSessionId, "New Project")
      projectSession = memoryManager.getProjectSession(effectiveSessionId)!
    }

    // Gather context for the AI - previous messages and current project state
    const conversationHistory = memoryManager.getConversationHistory(effectiveSessionId)
    const contextSummary = memoryManager.getContextSummary(effectiveSessionId)
    
    console.log("Conversation context:", contextSummary)
    
    // Send the message to our AI agent and get a response
    if (!agents.agent) throw new Error("Agent not initialized")
    
    let response = await agents.agent.chat(userMessage, {
      sessionId: effectiveSessionId,
      conversationHistory,
    })

    // Now the interesting part: check if we should auto-generate documents
    // This happens when the AI has gathered enough info for a phase
    let generatedDocument: { type: ProjectPhase; content: string } | null = null
    
    if (projectSession && agents.documentGenerator) {
      const currentPhase = projectSession.currentPhase
      
      // PHASE 1: Requirements - generate Requirements.md when ready
      if (currentPhase === "requirements" && memoryManager.isPhaseComplete(effectiveSessionId, "requirements")) {
        console.log("Requirements phase complete, generating Requirements.md")
        try {
          const requirementsDoc = await agents.documentGenerator.generateRequirements(projectSession)
          memoryManager.setRequirements(effectiveSessionId, projectSession.requirements!)
          generatedDocument = { type: "requirements", content: requirementsDoc }
          
          // Automatically move to the next phase
          memoryManager.updateProjectPhase(effectiveSessionId, "design")
          response += "\n\n✅ **Requirements.md generated!** You can download it below.\n\nNow let's move to the design phase. I'll help you create a system architecture."
        } catch (error) {
          console.error("Failed to generate requirements:", error)
        }
      }
      
      // PHASE 2: Design - generate Design.md when system architecture is ready
      else if (currentPhase === "design" && memoryManager.isPhaseComplete(effectiveSessionId, "design")) {
        console.log("Design phase complete, generating Design.md")
        try {
          // Convert tech stack to string format (it might be an array)
          const techStackStr = Array.isArray(projectSession.requirements?.techStack?.frontend)
            ? projectSession.requirements.techStack.frontend.join(", ")
            : projectSession.requirements?.techStack?.frontend || "Not specified"
          
          const designDoc = await agents.documentGenerator.generateDesign(
            techStackStr,
            projectSession
          )
          memoryManager.setDesign(effectiveSessionId, projectSession.design!)
          generatedDocument = { type: "design", content: designDoc }
          
          // Move to the final phase
          memoryManager.updateProjectPhase(effectiveSessionId, "tasks")
          response += "\n\n✅ **Design.md generated!** You can download it below.\n\nNow let's break this down into tasks. I'll create a detailed task list."
        } catch (error) {
          console.error("Failed to generate design:", error)
        }
      }
      
      // PHASE 3: Tasks - generate Tasks.md with the implementation roadmap
      else if (currentPhase === "tasks" && memoryManager.isPhaseComplete(effectiveSessionId, "tasks")) {
        console.log("Tasks phase complete, generating Tasks.md")
        try {
          const tasksDoc = await agents.documentGenerator.generateTasks(
            "Design document",
            "Requirements document"
          )
          memoryManager.setTasks(effectiveSessionId, projectSession.tasks!)
          generatedDocument = { type: "tasks", content: tasksDoc }
          
          // We're done! Mark the project as complete
          memoryManager.updateProjectPhase(effectiveSessionId, "complete")
          response += "\n\n✅ **Tasks.md generated!** You can download it below.\n\n🎉 All three documents are ready! You can now hand these off to AI agents like Cursor, Windsurf, or Claude for implementation."
        } catch (error) {
          console.error("Failed to generate tasks:", error)
        }
      }
    }

    console.log("About to send response:", response)

    // Store the AI's response in memory for context in future messages
    memoryManager.addMessage(effectiveSessionId, "assistant", response)
    console.log(`Session now has ${session.conversationHistory.length} messages in memory`)

    // Build the response object
    const responseData: any = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: response,
      parts: [{ type: "text", text: response }],
    }

    // If we generated a document, include it in the response
    // The frontend will use this to show download buttons
    if (generatedDocument) {
      responseData.document = generatedDocument
      responseData.projectSession = projectSession
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // Prevent caching of AI responses
        },
      }
    )
  } catch (error) {
    // Error handling - log everything for debugging
    console.error("Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : ""
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      env: {
        hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        model: process.env.OPENROUTER_MODEL,
      }
    })
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: "Check server console for more information"
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
