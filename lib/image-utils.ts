// Utility functions for image processing
export class ImageUtils {
  // Compress image to reduce file size
  static async compressImage(file: File, maxWidth = 400, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio

        canvas.width = newWidth
        canvas.height = newHeight

        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  // Validate image file
  static validateImageFile(file: File, maxSizeMB = 5): { valid: boolean; error?: string } {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Please select a valid image file" }
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `Image size must be less than ${maxSizeMB}MB` }
    }

    return { valid: true }
  }

  // Create circular crop of image
  static async createCircularCrop(imageUrl: string, size = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        canvas.width = size
        canvas.height = size

        // Create circular clipping path
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
        ctx.clip()

        // Draw image
        ctx.drawImage(img, 0, 0, size, size)

        resolve(canvas.toDataURL("image/png"))
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.crossOrigin = "anonymous"
      img.src = imageUrl
    })
  }

  // Get image dimensions
  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  // Convert file to base64
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Check if URL is a data URL
  static isDataUrl(url: string): boolean {
    return url.startsWith("data:")
  }

  // Get file size in human readable format
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}
