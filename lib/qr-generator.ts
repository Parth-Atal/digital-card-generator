// QR Code generation using qrcode library (similar to ZXing functionality)
export class QRCodeGenerator {
  static async generateQRCode(text: string, size = 256): Promise<string> {
    try {
      console.log("Generating QR code for text:", text.substring(0, 50) + "...")

      // Use QR Server API as a reliable alternative to ZXing
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&ecc=M&margin=10`

      const response = await fetch(qrApiUrl)
      if (!response.ok) {
        throw new Error("Failed to generate QR code")
      }

      const blob = await response.blob()
      const qrImageUrl = URL.createObjectURL(blob)

      console.log("QR code generated successfully")
      return qrImageUrl
    } catch (error) {
      console.error("Error generating QR code:", error)
      // Fallback to a simple QR code generator
      return this.generateFallbackQR(text, size)
    }
  }

  static async generateQRCodeBlob(text: string, size = 256): Promise<Blob> {
    try {
      console.log("Generating QR code blob for:", text.substring(0, 50) + "...")

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&ecc=M&margin=10`

      const response = await fetch(qrApiUrl)
      if (!response.ok) {
        throw new Error("Failed to generate QR code")
      }

      return await response.blob()
    } catch (error) {
      console.error("Error generating QR code blob:", error)
      throw error
    }
  }

  private static generateFallbackQR(text: string, size: number): string {
    // Create a simple fallback QR code using Google Charts API
    const googleQRUrl = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(text)}&choe=UTF-8`
    console.log("Using fallback QR generator")
    return googleQRUrl
  }

  static async downloadQRCode(text: string, filename: string, size = 256): Promise<void> {
    try {
      console.log("Downloading QR code for:", text.substring(0, 50) + "...")

      const blob = await this.generateQRCodeBlob(text, size)
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
      console.log("QR code downloaded successfully")
    } catch (error) {
      console.error("Error downloading QR code:", error)
      throw error
    }
  }

  // Test what a QR code contains
  static getQRContent(text: string): string {
    return text
  }

  // Validate if a URL is suitable for QR codes
  static validateQRUrl(url: string): boolean {
    try {
      new URL(url)
      return url.length < 2000 // QR codes work best with shorter URLs
    } catch {
      return false
    }
  }
}
