// Unified storage system that works on both client and server
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

// Global storage that persists across requests
const globalCardStorage = new Map<string, CardData>()

// Initialize with some persistence mechanism
if (typeof globalThis !== "undefined") {
  ;(globalThis as any).__CARD_STORAGE__ = (globalThis as any).__CARD_STORAGE__ || globalCardStorage
}

export class UnifiedCardStorage {
  private static getStorage(): Map<string, CardData> {
    if (typeof globalThis !== "undefined") {
      return (globalThis as any).__CARD_STORAGE__ || globalCardStorage
    }
    return globalCardStorage
  }

  static async saveCard(card: CardData): Promise<void> {
    try {
      const storage = this.getStorage()
      storage.set(card.id, card)

      console.log(`Card saved: ${card.id} (${card.fullName})`)
      console.log(`Total cards in storage: ${storage.size}`)

      // Also save to localStorage if available
      if (typeof window !== "undefined") {
        localStorage.setItem(`card_${card.id}`, JSON.stringify(card))
        localStorage.setItem("all_card_ids", JSON.stringify(Array.from(storage.keys())))
      }
    } catch (error) {
      console.error("Error saving card:", error)
      throw error
    }
  }

  static async getCard(id: string): Promise<CardData | null> {
    try {
      const storage = this.getStorage()
      let card = storage.get(id)

      // If not found in memory, try localStorage
      if (!card && typeof window !== "undefined") {
        const stored = localStorage.getItem(`card_${id}`)
        if (stored) {
          card = JSON.parse(stored)
          if (card) {
            // Re-populate memory storage
            storage.set(id, card)
          }
        }
      }

      console.log(`Card retrieval for ${id}: ${card ? "FOUND" : "NOT FOUND"}`)
      if (card) {
        console.log(`Card details: ${card.fullName} (${card.company})`)
      }

      return card || null
    } catch (error) {
      console.error("Error retrieving card:", error)
      return null
    }
  }

  static async getAllCards(): Promise<CardData[]> {
    try {
      const storage = this.getStorage()
      const cards = Array.from(storage.values())

      // Also check localStorage for any missing cards
      if (typeof window !== "undefined") {
        const storedIds = localStorage.getItem("all_card_ids")
        if (storedIds) {
          const ids = JSON.parse(storedIds)
          for (const id of ids) {
            if (!storage.has(id)) {
              const stored = localStorage.getItem(`card_${id}`)
              if (stored) {
                const card = JSON.parse(stored)
                storage.set(id, card)
                cards.push(card)
              }
            }
          }
        }
      }

      console.log(`Retrieved ${cards.length} cards`)
      return cards
    } catch (error) {
      console.error("Error retrieving all cards:", error)
      return []
    }
  }

  static async cardExists(id: string): Promise<boolean> {
    const card = await this.getCard(id)
    return card !== null
  }

  static async deleteCard(id: string): Promise<void> {
    try {
      const storage = this.getStorage()
      storage.delete(id)

      if (typeof window !== "undefined") {
        localStorage.removeItem(`card_${id}`)
        const storedIds = localStorage.getItem("all_card_ids")
        if (storedIds) {
          const ids = JSON.parse(storedIds).filter((cardId: string) => cardId !== id)
          localStorage.setItem("all_card_ids", JSON.stringify(ids))
        }
      }

      console.log(`Card deleted: ${id}`)
    } catch (error) {
      console.error("Error deleting card:", error)
      throw error
    }
  }

  // Debug method
  static debugStorage(): void {
    const storage = this.getStorage()
    console.log("=== STORAGE DEBUG ===")
    console.log(`Total cards in memory: ${storage.size}`)
    console.log("Card IDs:", Array.from(storage.keys()))

    if (typeof window !== "undefined") {
      const localIds = localStorage.getItem("all_card_ids")
      console.log("LocalStorage IDs:", localIds ? JSON.parse(localIds) : "None")
    }

    storage.forEach((card, id) => {
      console.log(`${id}: ${card.fullName} (${card.company})`)
    })
    console.log("==================")
  }
}
