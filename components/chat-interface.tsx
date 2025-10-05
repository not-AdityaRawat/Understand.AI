"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, User, ChevronDown, Paperclip, Lightbulb, ImageIcon, Search, Send, Sparkles } from "lucide-react"
import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Props interface for the chat component
interface ChatInterfaceProps {
  messages: UIMessage[]
  input: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onNewChat: () => void
  isLoading: boolean
}

/**
 * ChatInterface Component
 * 
 * Main chat UI where users interact with Understand.AI
 * Features:
 * - Auto-scrolling message list
 * - Markdown rendering for AI responses
 * - Loading animation (three dots)
 * - Auto-expanding textarea
 */
export function ChatInterface({ messages, input, onInputChange, onSubmit, onNewChat, isLoading }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Handle Enter key to send (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit(e)
      }
    }
  }

  // Auto-expand textarea as user types (max 200px)
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  const renderMessageContent = (message: UIMessage) => {
    return message.parts.map((part, index) => {
      if (part.type === "text") {
        return (
          <div key={index} className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "")
                  const isInline = !match
                  
                  return isInline ? (
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }: any) => (
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 my-2">
                    {children}
                  </pre>
                ),
                p: ({ children }: any) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }: any) => (
                  <ul className="list-disc list-inside mb-2">{children}</ul>
                ),
                ol: ({ children }: any) => (
                  <ol className="list-decimal list-inside mb-2">{children}</ol>
                ),
                li: ({ children }: any) => (
                  <li className="mb-1">{children}</li>
                ),
                h1: ({ children }: any) => (
                  <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>
                ),
                h2: ({ children }: any) => (
                  <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>
                ),
                h3: ({ children }: any) => (
                  <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>
                ),
                blockquote: ({ children }: any) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-2">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }: any) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {part.text}
            </ReactMarkdown>
          </div>
        )
      }
      return null
    })
  }

  return (
    <div className="flex h-screen flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">Understand.AI</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              Understand.AI
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button onClick={onNewChat} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">AR</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 overflow-auto" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center mt-20 justify-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mb-2 text-3xl font-semibold text-foreground">Welcome to Understand.AI</h2>
            <p className="text-xl text-center max-w-2xl text-muted-foreground">
              I'll help you <span className="text-primary">refine your project plan</span> through Requirements, Design, and Task generation.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Let's start by understanding what you want to build.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 py-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-card text-card-foreground border border-border",
                  )}
                >
                  {renderMessageContent(message)}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {/* loading animation */}
            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={onSubmit} className="relative">
            <div className="relative rounded-2xl border border-border bg-background shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell me about your project idea..."
                className="min-h-[56px] resize-none border-0 bg-transparent px-4 py-4 pr-32 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                rows={1}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Paperclip className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Lightbulb className="h-3.5 w-3.5" />
              Reasoning
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ImageIcon className="h-3.5 w-3.5" />
              Create Image
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Search className="h-3.5 w-3.5" />
              Deep Research
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
