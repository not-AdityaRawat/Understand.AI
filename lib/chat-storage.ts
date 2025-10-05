import type { UIMessage } from "ai"

export interface ChatSession {
  id: string
  title: string
  messages: UIMessage[]
  createdAt: number
  updatedAt: number
}

export function generateChatTitle(firstMessage: string): string {
  const maxLength = 50
  if (firstMessage.length <= maxLength) {
    return firstMessage
  }
  return firstMessage.substring(0, maxLength) + "..."
}

export function groupChatsByTime(chats: ChatSession[]) {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  const sevenDays = 7 * oneDay

  const today: ChatSession[] = []
  const yesterday: ChatSession[] = []
  const lastWeek: ChatSession[] = []
  const older: ChatSession[] = []

  chats.forEach((chat) => {
    const diff = now - chat.updatedAt
    if (diff < oneDay) {
      today.push(chat)
    } else if (diff < 2 * oneDay) {
      yesterday.push(chat)
    } else if (diff < sevenDays) {
      lastWeek.push(chat)
    } else {
      older.push(chat)
    }
  })

  return { today, yesterday, lastWeek, older }
}
