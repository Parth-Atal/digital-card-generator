// Generate card images for QR code sharing
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

const themeColors = {
  blue: { primary: "#3B82F6", secondary: "#EFF6FF", text: "#1E40AF" },
  green: { primary: "#10B981", secondary: "#ECFDF5", text: "#047857" },
  purple: { primary: "#8B5CF6", secondary: "#F3E8FF", text: "#7C3AED" },
  orange: { primary: "#F59E0B", secondary: "#FEF3C7", text: "#D97706" },
  dark: { primary: "#374151", secondary: "#F9FAFB", text: "#111827" },
}

export class CardImageGenerator {
  static async generateCardImage(card: CardData): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      // Set canvas size
      canvas.width = 600
      canvas.height = 350

      const theme = themeColors[card.theme as keyof typeof themeColors] || themeColors.blue

      // Background
      ctx.fillStyle = theme.secondary
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Header gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 100)
      gradient.addColorStop(0, theme.primary)
      gradient.addColorStop(1, theme.text)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, 100)

      // Name
      ctx.fillStyle = "white"
      ctx.font = "bold 28px Arial"
      ctx.fillText(card.fullName, 30, 50)

      // Designation
      ctx.font = "18px Arial"
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.fillText(card.designation, 30, 75)

      // Company
      ctx.fillStyle = theme.text
      ctx.font = "bold 20px Arial"
      ctx.fillText(card.company, 30, 140)

      // Contact info
      ctx.fillStyle = "#666"
      ctx.font = "16px Arial"
      let yPos = 170

      if (card.phone) {
        ctx.fillText(`📞 ${card.phone}`, 30, yPos)
        yPos += 25
      }

      if (card.email) {
        ctx.fillText(`✉️ ${card.email}`, 30, yPos)
        yPos += 25
      }

      if (card.website) {
        ctx.fillText(`🌐 ${card.website}`, 30, yPos)
        yPos += 25
      }

      if (card.linkedin) {
        ctx.fillText(`💼 ${card.linkedin}`, 30, yPos)
        yPos += 25
      }

      if (card.github) {
        ctx.fillText(`💻 ${card.github}`, 30, yPos)
      }

      // QR Code placeholder
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(450, 120, 120, 120)
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.fillText("QR Code", 485, 185)

      // Convert to data URL
      resolve(canvas.toDataURL("image/png"))
    })
  }

  static async downloadCardImage(card: CardData): Promise<void> {
    const imageUrl = await this.generateCardImage(card)
    const link = document.createElement("a")
    link.download = `${card.fullName.replace(/\s+/g, "_")}_card.png`
    link.href = imageUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
