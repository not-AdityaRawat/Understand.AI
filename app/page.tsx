"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { UIMessage } from "ai"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { type ChatSession, generateChatTitle } from "@/lib/chat-storage"

export default function Home() {
  const [chats, setChats, isLoaded] = useLocalStorage<ChatSession[]>("beebot-chats", [])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load current chat messages when chat changes
  useEffect(() => {
    if (currentChatId && isLoaded) {
      const chat = chats.find((c) => c.id === currentChatId)
      if (chat) {
        setMessages(chat.messages)
      }
    }
  }, [currentChatId, isLoaded])

  // Save messages to current chat
  useEffect(() => {
    if (currentChatId && messages.length > 0 && isLoaded) {
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex((c) => c.id === currentChatId)
        if (chatIndex === -1) return prevChats

        const updatedChats = [...prevChats]
        const firstUserMessage = messages.find((m) => m.role === "user")
        const title = firstUserMessage
          ? generateChatTitle(firstUserMessage.parts.find((p) => p.type === "text")?.text || "New Chat")
          : "New Chat"

        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          title,
          messages,
          updatedAt: Date.now(),
        }

        return updatedChats
      })
    }
  }, [messages, currentChatId, isLoaded])

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setChats((prevChats) => [newChat, ...prevChats])
    setCurrentChatId(newChat.id)
    setMessages([])
    setInput("")
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Create new chat if none exists
    if (!currentChatId) {
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: generateChatTitle(input),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setChats((prevChats) => [newChat, ...prevChats])
      setCurrentChatId(newChat.id)
    }

    const userMessage = input
    setInput("")

    // Add user message to chat
    const userMsg: UIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text: userMessage }],
    }
    
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        
        const aiMsg: UIMessage = {
          id: data.id || `ai-${Date.now()}`,
          role: "assistant",
          parts: [{ type: "text", text: data.content || data.parts?.[0]?.text || "" }],
        }
        
        setMessages((prev) => [...prev, aiMsg])
      } else {
        console.error("Response not OK:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      
      <ChatInterface
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onNewChat={handleNewChat}
        isLoading={isLoading}
      />
     
    </div>
  )
}
