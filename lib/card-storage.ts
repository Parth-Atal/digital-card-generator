// Client-side only storage that works reliably
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

export class ClientCardStorage {
  private static STORAGE_KEY = "digital_cards_db"

  static saveCard(card: CardData): void {
    try {
      const existingCards = this.getAllCards()
      existingCards[card.id] = card
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingCards))
      console.log(`Card saved: ${card.id}`)
    } catch (error) {
      console.error("Error saving card:", error)
      throw error
    }
  }

  static getCard(id: string): CardData | null {
    try {
      const cards = this.getAllCards()
      return cards[id] || null
    } catch (error) {
      console.error("Error getting card:", error)
      return null
    }
  }

  static getAllCards(): { [key: string]: CardData } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Error getting all cards:", error)
      return {}
    }
  }

  static deleteCard(id: string): void {
    try {
      const cards = this.getAllCards()
      delete cards[id]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards))
    } catch (error) {
      console.error("Error deleting card:", error)
    }
  }

  static cardExists(id: string): boolean {
    return this.getCard(id) !== null
  }

  static encodeCardForUrl(card: CardData): string {
    try {
      // Create a compressed version of the card data for URL embedding
      const compressedCard = {
        i: card.id,
        n: card.fullName,
        d: card.designation,
        c: card.company,
        p: card.phone,
        e: card.email,
        w: card.website,
        l: card.linkedin,
        g: card.github,
        t: card.theme,
        img: card.profileImage,
        cr: card.createdAt,
      }

      const cardJson = JSON.stringify(compressedCard)
      const encoded = btoa(encodeURIComponent(cardJson))
      console.log("Encoded card data length:", encoded.length)
      return encoded
    } catch (error) {
      console.error("Error encoding card:", error)
      return ""
    }
  }

  static decodeCardFromUrl(encodedCard: string): CardData | null {
    try {
      const cardJson = decodeURIComponent(atob(encodedCard))
      const compressedCard = JSON.parse(cardJson)

      // Expand the compressed card data back to full format
      const card: CardData = {
        id: compressedCard.i,
        fullName: compressedCard.n,
        designation: compressedCard.d,
        company: compressedCard.c,
        phone: compressedCard.p,
        email: compressedCard.e,
        website: compressedCard.w || "",
        linkedin: compressedCard.l || "",
        github: compressedCard.g || "",
        theme: compressedCard.t || "blue",
        profileImage: compressedCard.img || "",
        createdAt: compressedCard.cr,
      }

      console.log("Decoded card:", card.fullName)
      return card
    } catch (error) {
      console.error("Error decoding card:", error)
      return null
    }
  }
}
