// Simple persistent storage using localStorage for client-side and a fallback for server-side
interface CardData {
  id: string
  fullName: string
  designation: string
  company: string
  phone: string
  email: string
  website: string
  linkedin: string
  github: string
  theme: string
  profileImage: string
  createdAt: string
}

// Server-side storage simulation using a simple object
// In production, this would be replaced with a real database
const serverStorage: { [key: string]: CardData } = {}

export class CardStorage {
  static async saveCard(card: CardData): Promise<void> {
    if (typeof window !== "undefined") {
      // Client-side storage
      const cards = this.getAllCards()
      cards[card.id] = card
      localStorage.setItem("digitalCards", JSON.stringify(cards))
    } else {
      // Server-side storage
      serverStorage[card.id] = card
    }
  }

  static async getCard(id: string): Promise<CardData | null> {
    if (typeof window !== "undefined") {
      // Client-side storage
      const cards = this.getAllCards()
      return cards[id] || null
    } else {
      // Server-side storage
      return serverStorage[id] || null
    }
  }

  static getAllCards(): { [key: string]: CardData } {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("digitalCards")
      return stored ? JSON.parse(stored) : {}
    }
    return serverStorage
  }

  static async deleteCard(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const cards = this.getAllCards()
      delete cards[id]
      localStorage.setItem("digitalCards", JSON.stringify(cards))
    } else {
      delete serverStorage[id]
    }
  }
}
