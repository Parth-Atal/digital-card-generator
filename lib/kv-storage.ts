// Enhanced KV storage implementation with better error handling
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

class SimpleKVStorage {
  private static instance: SimpleKVStorage
  private storage: Map<string, string> = new Map()

  static getInstance(): SimpleKVStorage {
    if (!SimpleKVStorage.instance) {
      SimpleKVStorage.instance = new SimpleKVStorage()
      // Initialize with any existing localStorage data
      SimpleKVStorage.instance.loadFromLocalStorage()
    }
    return SimpleKVStorage.instance
  }

  private loadFromLocalStorage(): void {
    if (typeof window !== "undefined") {
      try {
        // Load all cards from localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith("kv_")) {
            const value = localStorage.getItem(key)
            if (value) {
              const storageKey = key.replace("kv_", "")
              this.storage.set(storageKey, value)
            }
          }
        }
        console.log("Loaded", this.storage.size, "items from localStorage")
      } catch (error) {
        console.error("Error loading from localStorage:", error)
      }
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value)
      this.storage.set(key, jsonValue)

      // Also store in localStorage if available
      if (typeof window !== "undefined") {
        localStorage.setItem(`kv_${key}`, jsonValue)
      }

      console.log("Stored key:", key)
    } catch (error) {
      console.error("Error storing key:", key, error)
      throw new Error(`Failed to store ${key}: ${error}`)
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      // First try memory storage
      let value = this.storage.get(key)

      // If not in memory, try localStorage
      if (!value && typeof window !== "undefined") {
        value = localStorage.getItem(`kv_${key}`)
        if (value) {
          // Re-populate memory storage
          this.storage.set(key, value)
        }
      }

      if (value) {
        return JSON.parse(value)
      }

      return null
    } catch (error) {
      console.error("Error retrieving key:", key, error)
      return null
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.storage.delete(key)
      if (typeof window !== "undefined") {
        localStorage.removeItem(`kv_${key}`)
      }
      console.log("Deleted key:", key)
    } catch (error) {
      console.error("Error deleting key:", key, error)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.storage.has(key)) {
        return true
      }

      if (typeof window !== "undefined") {
        return localStorage.getItem(`kv_${key}`) !== null
      }

      return false
    } catch (error) {
      console.error("Error checking key existence:", key, error)
      return false
    }
  }

  // Get all keys for debugging
  getAllKeys(): string[] {
    return Array.from(this.storage.keys())
  }
}

export const kv = SimpleKVStorage.getInstance()

export class CardStorage {
  static async saveCard(card: CardData): Promise<void> {
    try {
      console.log("Saving card:", card.id)

      // Save the individual card
      await kv.set(`card:${card.id}`, card)

      // Update the list of all cards
      const allCards = await this.getAllCardIds()
      if (!allCards.includes(card.id)) {
        allCards.push(card.id)
        await kv.set("all_cards", allCards)
      }

      console.log("Card saved successfully:", card.id)
    } catch (error) {
      console.error("Error saving card:", error)
      throw new Error(`Failed to save card: ${error}`)
    }
  }

  static async getCard(id: string): Promise<CardData | null> {
    try {
      console.log("Retrieving card:", id)
      const card = await kv.get(`card:${id}`)
      if (card) {
        console.log("Card found:", card.fullName)
      } else {
        console.log("Card not found:", id)
      }
      return card
    } catch (error) {
      console.error("Error retrieving card:", error)
      return null
    }
  }

  static async getAllCardIds(): Promise<string[]> {
    try {
      const ids = await kv.get("all_cards")
      return Array.isArray(ids) ? ids : []
    } catch (error) {
      console.error("Error getting all card IDs:", error)
      return []
    }
  }

  static async getAllCards(): Promise<CardData[]> {
    try {
      const ids = await this.getAllCardIds()
      const cards: CardData[] = []

      for (const id of ids) {
        const card = await this.getCard(id)
        if (card) {
          cards.push(card)
        }
      }

      return cards
    } catch (error) {
      console.error("Error getting all cards:", error)
      return []
    }
  }

  static async deleteCard(id: string): Promise<void> {
    try {
      await kv.delete(`card:${id}`)

      // Remove from all cards list
      const allCards = await this.getAllCardIds()
      const updatedCards = allCards.filter((cardId) => cardId !== id)
      await kv.set("all_cards", updatedCards)

      console.log("Card deleted:", id)
    } catch (error) {
      console.error("Error deleting card:", error)
      throw new Error(`Failed to delete card: ${error}`)
    }
  }

  static async cardExists(id: string): Promise<boolean> {
    try {
      return await kv.exists(`card:${id}`)
    } catch (error) {
      console.error("Error checking card existence:", error)
      return false
    }
  }

  // Debug method
  static async debugStorage(): Promise<void> {
    console.log("=== Storage Debug ===")
    console.log("All keys:", kv.getAllKeys())
    const allCards = await this.getAllCardIds()
    console.log("All card IDs:", allCards)
    for (const id of allCards) {
      const card = await this.getCard(id)
      console.log(`Card ${id}:`, card?.fullName || "NOT FOUND")
    }
    console.log("===================")
  }
}
