import { ChatOpenAI } from "@langchain/openai"
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { BufferMemory } from "langchain/memory"

// This is the core personality and instruction set for our AI assistant
// It defines the three-phase workflow: Requirements → Design → Tasks
const SYSTEM_PROMPT = `You are Understand.AI, an intelligent project planning assistant that helps developers refine their project ideas through a structured process.

Your Mission:
Guide developers through THREE phases to create comprehensive project documentation:

PHASE 1: Requirements Gathering
- Ask relevant questions about the project idea
- Inquire about: tech stack preferences, theme/design style, target users, key features, constraints, scalability needs
- Be conversational and intelligent - ask follow-up questions based on their answers
- Continue until you have a complete understanding of their vision

PHASE 2: System Design
- Based on gathered requirements, create a detailed Design.md file
- Include: Architecture overview, data models, API design, component structure, technology choices, deployment strategy
- Present the design and ask if any changes are needed
- Iterate on the design based on feedback

PHASE 3: Task Generation
- Create a comprehensive Task.md file with chronological, actionable tasks
- Each task should be specific enough for an AI agent to execute
- Include: setup tasks, feature implementation, testing, deployment steps
- Format tasks in a clear, sequential order

Your Behavior:
- Be conversational and friendly, not robotic
- Ask ONE question at a time (unless naturally grouped)
- Show understanding by acknowledging their answers
- Explain your reasoning when making suggestions
- Make the process feel collaborative, not interrogative
- Indicate which phase you're in and progress made

Document Format:
- Requirements.md: User needs, tech stack, constraints, features, target audience
- Design.md: Architecture, data models, APIs, components, tech stack rationale
- Task.md: Numbered tasks in chronological order, each with clear acceptance criteria

Remember: Your goal is to help developers think through their project thoroughly before building, saving time and avoiding costly mistakes.`

// Main agent class - handles all AI interactions
export class TracerAgent {
  private agent!: AgentExecutor
  private model: ChatOpenAI
  private memory: BufferMemory

  constructor(apiKey?: string, modelName: string = "deepseek/deepseek-chat") {
    // Using OpenRouter as our API gateway - it gives us access to multiple models
    const key = apiKey || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    const baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
    
    // Debug logging - helps track down API key issues during development
    console.log("TracerAgent initialization:", {
      hasApiKey: !!key,
      keyPrefix: key?.substring(0, 15),
      modelName,
      baseURL,
    })
    
    if (!key) {
      throw new Error("API key is required. Set OPENROUTER_API_KEY or OPENAI_API_KEY in .env.local")
    }
    
    // Set up the ChatOpenAI model with our API credentials
    // Temperature 0.7 gives us a good balance between creativity and consistency
    this.model = new ChatOpenAI({
      modelName,
      temperature: 0.7,
      openAIApiKey: key,
      configuration: {
        baseURL,
        defaultHeaders: {
          // Explicit auth header - some API gateways need this
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": "https://traycer.ai", // Optional: helps with API rankings
          "X-Title": "Traycer AI", // Optional: identifies our app
        },
      },
    })

    // BufferMemory keeps track of the conversation history
    // This lets the AI remember what was said earlier in the chat
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
      outputKey: "output",
    })

    this.initializeAgent()
  }

  private async initializeAgent() {
    // We don't need any tools for this - it's purely conversational
    // The AI just asks questions and guides the user through the planning process
    const tools: any[] = []

    // Build the prompt template with placeholders for history and user input
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT], // The AI's personality and instructions
      new MessagesPlaceholder("chat_history"), // Previous conversation
      ["human", "{input}"], // Current user message
      new MessagesPlaceholder("agent_scratchpad"), // For agent reasoning (not really used here)
    ])

    const agentRunnable = await createOpenAIFunctionsAgent({
      llm: this.model,
      tools,
      prompt,
    })

    // AgentExecutor manages the conversation flow
    this.agent = new AgentExecutor({
      agent: agentRunnable,
      tools,
      memory: this.memory,
      verbose: true, // Helpful for debugging in development
      maxIterations: 10,
    })
  }

  // Main method for chatting with the AI
  async chat(message: string, context?: any): Promise<string> {
    try {
      const result = await this.agent.invoke({
        input: message,
        context,
      })

      return result.output
    } catch (error) {
      console.error("Traycer Agent error:", error)
      throw error
    }
  }

  // Streaming version of chat - not actively used but kept for future enhancement
  // Could be useful if we want to show responses word-by-word in the UI
  async streamChat(message: string, context?: any): Promise<ReadableStream> {
    const encoder = new TextEncoder()
    const agent = this.agent
    
    return new ReadableStream({
      async start(controller) {
        try {
          // Get the response from the agent
          const result = await agent.invoke({
            input: message,
            context,
          })

          // Encode and stream it back to the client
          controller.enqueue(encoder.encode(result.output))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })
  }

  // Clear conversation history - useful when starting a new project
  clearMemory() {
    this.memory.clear()
  }
}

// Factory function to create new agent instances
export const createTracerAgent = (apiKey?: string, modelName?: string) => {
  return new TracerAgent(apiKey, modelName)
}
