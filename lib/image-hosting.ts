// Image hosting service integration with your ImgBB API key
export class ImageHostingService {
  private static readonly IMGBB_API_KEY = "268b5d205a322622759a791e025e96f7"
  private static readonly IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"

  static async uploadImage(imageBlob: Blob, filename: string): Promise<string> {
    try {
      console.log("Starting ImgBB upload...")

      // Convert blob to base64
      const base64 = await this.blobToBase64(imageBlob)
      const base64Data = base64.split(",")[1] // Remove data:image/png;base64, prefix

      const formData = new FormData()
      formData.append("key", this.IMGBB_API_KEY)
      formData.append("image", base64Data)
      formData.append("name", filename)
      formData.append("expiration", "15552000") // 6 months expiration (in seconds)

      const response = await fetch(this.IMGBB_UPLOAD_URL, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`ImgBB API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (result.success && result.data && result.data.url) {
        console.log("ImgBB upload successful!")
        console.log("Image URL:", result.data.url)
        console.log("Thumbnail URL:", result.data.thumb?.url)
        console.log("Delete URL:", result.data.delete_url)

        return result.data.url
      } else {
        throw new Error("ImgBB upload failed: " + (result.error?.message || "Unknown error"))
      }
    } catch (error) {
      console.error("ImgBB upload error:", error)
      throw error
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

  // Test the API key
  static async testApiKey(): Promise<boolean> {
    try {
      // Create a small test image
      const canvas = document.createElement("canvas")
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext("2d")!

      ctx.fillStyle = "#3B82F6"
      ctx.fillRect(0, 0, 100, 100)
      ctx.fillStyle = "white"
      ctx.font = "20px Arial"
      ctx.textAlign = "center"
      ctx.fillText("TEST", 50, 55)

      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(false)
            return
          }

          try {
            const url = await this.uploadImage(blob, "api_test")
            console.log("API key test successful:", url)
            resolve(true)
          } catch (error) {
            console.error("API key test failed:", error)
            resolve(false)
          }
        }, "image/png")
      })
    } catch (error) {
      console.error("API key test error:", error)
      return false
    }
  }
}
