"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type ChatSession, groupChatsByTime } from "@/lib/chat-storage"
import { Home, Compass, Library, History, Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  chats: ChatSession[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}

export function ChatSidebar({ chats, currentChatId, onSelectChat, onNewChat }: ChatSidebarProps) {
  const { today, yesterday, lastWeek, older } = groupChatsByTime(chats)

  const renderChatGroup = (title: string, chats: ChatSession[]) => {
    if (chats.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">{title}</h3>
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                currentChatId === chat.id && "bg-accent",
              )}
            >
              <div className="truncate">{chat.title}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="border-b border-sidebar-border p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Understand.AI</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="h-9 bg-sidebar-accent pl-9 pr-12 text-sm" />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5 text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-sidebar-border p-2">
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <Compass className="mr-2 h-4 w-4" />
            Explore
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <Library className="mr-2 h-4 w-4" />
            Library
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        </nav>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 p-2">
        {renderChatGroup("Today", today)}
        {renderChatGroup("Yesterday", yesterday)}
        {renderChatGroup("Last 7 Days", lastWeek)}
        {renderChatGroup("Older", older)}
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">AR</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-sidebar-foreground">Aditya Rawat</div>
            <div className="text-xs text-muted-foreground">rawatsaditya@gmail.com</div>
          </div>
        </button>
      </div>
    </div>
  )
}
