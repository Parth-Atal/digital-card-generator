// Enhanced card image generation with better styling and QR code integration
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
  blue: {
    primary: "#3B82F6",
    secondary: "#EFF6FF",
    text: "#1E40AF",
    gradient: ["#3B82F6", "#1E40AF"],
  },
  green: {
    primary: "#10B981",
    secondary: "#ECFDF5",
    text: "#047857",
    gradient: ["#10B981", "#047857"],
  },
  purple: {
    primary: "#8B5CF6",
    secondary: "#F3E8FF",
    text: "#7C3AED",
    gradient: ["#8B5CF6", "#7C3AED"],
  },
  orange: {
    primary: "#F59E0B",
    secondary: "#FEF3C7",
    text: "#D97706",
    gradient: ["#F59E0B", "#D97706"],
  },
  dark: {
    primary: "#374151",
    secondary: "#F9FAFB",
    text: "#111827",
    gradient: ["#374151", "#111827"],
  },
}

export class EnhancedCardGenerator {
  private static readonly IMGBB_API_KEY = "268b5d205a322622759a791e025e96f7"
  private static readonly IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"

  static async generateCardImage(card: CardData, includeQR = false): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      // Set high resolution for better quality
      const scale = 2
      canvas.width = 800 * scale
      canvas.height = 500 * scale
      ctx.scale(scale, scale)

      const theme = themeColors[card.theme as keyof typeof themeColors] || themeColors.blue

      try {
        // Background
        ctx.fillStyle = theme.secondary
        ctx.fillRect(0, 0, 800, 500)

        // Header gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 150)
        gradient.addColorStop(0, theme.gradient[0])
        gradient.addColorStop(1, theme.gradient[1])
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 150)

        // Add subtle shadow to header
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetY = 2

        // Profile circle background
        ctx.beginPath()
        ctx.arc(80, 75, 40, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
        ctx.fill()

        // Profile circle border
        ctx.beginPath()
        ctx.arc(80, 75, 40, 0, 2 * Math.PI)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Reset shadow
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Profile initials
        ctx.fillStyle = "white"
        ctx.font = "bold 28px Arial"
        ctx.textAlign = "center"
        const initials = card.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
        ctx.fillText(initials, 80, 85)

        // Name
        ctx.fillStyle = "white"
        ctx.font = "bold 36px Arial"
        ctx.textAlign = "left"
        ctx.fillText(card.fullName, 150, 60)

        // Designation
        ctx.font = "22px Arial"
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.fillText(card.designation, 150, 90)

        // Company
        ctx.font = "20px Arial"
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fillText(card.company, 150, 115)

        // Contact information section
        ctx.fillStyle = theme.text
        ctx.font = "bold 26px Arial"
        ctx.fillText("Contact Information", 50, 200)

        // Contact details with icons
        ctx.fillStyle = "#333"
        ctx.font = "20px Arial"
        let yPos = 240

        if (card.phone) {
          ctx.fillText(`📞 ${card.phone}`, 50, yPos)
          yPos += 35
        }

        if (card.email) {
          ctx.fillText(`✉️ ${card.email}`, 50, yPos)
          yPos += 35
        }

        if (card.website) {
          ctx.fillText(`🌐 ${card.website}`, 50, yPos)
          yPos += 35
        }

        if (card.linkedin) {
          ctx.fillText(`💼 LinkedIn: ${card.linkedin}`, 50, yPos)
          yPos += 35
        }

        if (card.github) {
          ctx.fillText(`💻 GitHub: ${card.github}`, 50, yPos)
          yPos += 35
        }

        // Decorative elements
        ctx.fillStyle = theme.primary
        ctx.fillRect(0, 460, 800, 5)

        // Footer
        ctx.fillStyle = "#666"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Digital Business Card • Created with Digital Card Generator", 400, 485)

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to generate image blob"))
            }
          },
          "image/png",
          0.9,
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  static async generateAndUploadCard(card: CardData): Promise<string> {
    try {
      console.log("Generating card image...")
      const imageBlob = await this.generateCardImage(card, false)

      console.log("Uploading card image to ImgBB...")
      const filename = `card_${card.fullName.replace(/\s+/g, "_")}_${Date.now()}`

      // Upload to ImgBB
      const imageUrl = await this.uploadToImgBB(imageBlob, filename)
      console.log("Card uploaded successfully:", imageUrl)
      return imageUrl
    } catch (error) {
      console.error("Error generating/uploading card:", error)
      throw error
    }
  }

  private static async uploadToImgBB(imageBlob: Blob, filename: string): Promise<string> {
    try {
      // Convert blob to base64
      const base64 = await this.blobToBase64(imageBlob)
      const base64Data = base64.split(",")[1] // Remove data:image/png;base64, prefix

      const formData = new FormData()
      formData.append("key", this.IMGBB_API_KEY)
      formData.append("image", base64Data)
      formData.append("name", filename)
      formData.append("expiration", "15552000") // 6 months expiration

      console.log("Uploading to ImgBB...")

      const response = await fetch(this.IMGBB_UPLOAD_URL, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data && result.data.url) {
        console.log("ImgBB upload successful!")
        console.log("Image URL:", result.data.url)
        console.log("Delete URL:", result.data.delete_url)
        return result.data.url
      } else {
        throw new Error("ImgBB upload failed: " + (result.error?.message || "Unknown error"))
      }
    } catch (error) {
      console.error("ImgBB upload error:", error)

      // Fallback to data URL if ImgBB fails
      console.log("Falling back to data URL...")
      const dataUrl = await this.createDataUrl(imageBlob)
      return dataUrl
    }
  }

  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  private static async createDataUrl(imageBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(imageBlob)
    })
  }
}
