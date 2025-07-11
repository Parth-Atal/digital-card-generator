// Simple database simulation using IndexedDB for persistent browser storage
// This will work better than localStorage for larger data

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

class IndexedDBStorage {
  private dbName = "DigitalCardsDB"
  private version = 1
  private storeName = "cards"

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" })
          store.createIndex("createdAt", "createdAt", { unique: false })
        }
      }
    })
  }

  async saveCard(card: CardData): Promise<void> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.put(card)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      console.log("Card saved to IndexedDB:", card.id)
    } catch (error) {
      console.error("Error saving to IndexedDB:", error)
      // Fallback to localStorage
      localStorage.setItem(`card_${card.id}`, JSON.stringify(card))
    }
  }

  async getCard(id: string): Promise<CardData | null> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)

      return new Promise<CardData | null>((resolve, reject) => {
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Error reading from IndexedDB:", error)
      // Fallback to localStorage
      const stored = localStorage.getItem(`card_${id}`)
      return stored ? JSON.parse(stored) : null
    }
  }

  async getAllCards(): Promise<CardData[]> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)

      return new Promise<CardData[]>((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Error reading all from IndexedDB:", error)
      return []
    }
  }

  async deleteCard(id: string): Promise<void> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Error deleting from IndexedDB:", error)
      localStorage.removeItem(`card_${id}`)
    }
  }
}

// Server-side storage for API routes
const serverCards = new Map<string, CardData>()

export class CardDatabase {
  private static idbStorage = new IndexedDBStorage()

  static async saveCard(card: CardData): Promise<void> {
    // Save on both client and server
    if (typeof window !== "undefined") {
      await this.idbStorage.saveCard(card)
    } else {
      serverCards.set(card.id, card)
    }
  }

  static async getCard(id: string): Promise<CardData | null> {
    if (typeof window !== "undefined") {
      return await this.idbStorage.getCard(id)
    } else {
      return serverCards.get(id) || null
    }
  }

  static async getAllCards(): Promise<CardData[]> {
    if (typeof window !== "undefined") {
      return await this.idbStorage.getAllCards()
    } else {
      return Array.from(serverCards.values())
    }
  }

  static async deleteCard(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      await this.idbStorage.deleteCard(id)
    } else {
      serverCards.delete(id)
    }
  }

  static async cardExists(id: string): Promise<boolean> {
    const card = await this.getCard(id)
    return card !== null
  }
}
