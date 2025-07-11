"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, ImageIcon, ExternalLink, CheckCircle } from "lucide-react"
import { QRCodeGenerator } from "@/lib/qr-generator"
import { ClientCardStorage } from "@/lib/card-storage"
import { EnhancedCardGenerator } from "@/lib/enhanced-card-generator"

interface QRCodeDisplayProps {
  cardId: string
}

export function QRCodeDisplay({ cardId }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [cardImageUrl, setCardImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")

  const generateCardImageAndQR = async () => {
    setIsLoading(true)
    setError(null)
    setUploadStatus("")

    try {
      // Get the actual card data from localStorage
      const cardData = ClientCardStorage.getCard(cardId)

      if (!cardData) {
        throw new Error("Card data not found")
      }

      console.log("Starting card image generation process...")
      setIsGeneratingImage(true)
      setUploadStatus("Generating card image...")

      // Generate and upload the card image
      const hostedImageUrl = await EnhancedCardGenerator.generateAndUploadCard(cardData)
      setCardImageUrl(hostedImageUrl)
      setUploadStatus("Image uploaded successfully!")

      console.log("Generating QR code with image URL...")
      setUploadStatus("Creating QR code...")

      // Generate QR code that contains the hosted image URL as text
      // When scanned, this will show the URL which can be opened to view the image
      const qrUrl = await QRCodeGenerator.generateQRCode(hostedImageUrl, 256)
      setQrCodeUrl(qrUrl)

      setUploadStatus("QR code ready!")
      setIsGeneratingImage(false)
    } catch (error) {
      console.error("Error generating card image and QR code:", error)
      setError("Failed to generate card image and QR code: " + (error as Error).message)
      setIsGeneratingImage(false)
      setUploadStatus("")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateCardImageAndQR()

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl)
      }
    }
  }, [cardId])

  const handleDownloadQR = async () => {
    try {
      if (!cardImageUrl) {
        throw new Error("Card image not available")
      }

      // Download QR code that contains the image URL
      await QRCodeGenerator.downloadQRCode(cardImageUrl, `qr-code-${cardId}.png`, 256)
    } catch (error) {
      console.error("Error downloading QR code:", error)
      alert("Failed to download QR code")
    }
  }

  const handleDownloadCardImage = () => {
    if (cardImageUrl) {
      const link = document.createElement("a")
      link.href = cardImageUrl
      link.download = `card-${cardId}.png`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleViewCardImage = () => {
    if (cardImageUrl) {
      window.open(cardImageUrl, "_blank")
    }
  }

  const handleTestQR = () => {
    if (cardImageUrl) {
      // Show what the QR code contains
      alert(`QR Code contains: ${cardImageUrl}\n\nWhen scanned, this URL will open your card image.`)
    }
  }

  const handleRetry = () => {
    generateCardImageAndQR()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 font-medium">{uploadStatus || "Processing..."}</p>
          {isGeneratingImage && <p className="text-xs text-gray-500 mt-1">This may take a few seconds...</p>}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      {qrCodeUrl && (
        <>
          <div className="flex justify-center">
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              className="border rounded-lg shadow-sm max-w-64 max-h-64"
            />
          </div>

          {cardImageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your Card Image (hosted online):</p>
              <div className="relative">
                <img
                  src={cardImageUrl || "/placeholder.svg"}
                  alt="Card Preview"
                  className="border rounded-lg shadow-sm max-w-full mx-auto cursor-pointer hover:shadow-md transition-shadow"
                  style={{ maxHeight: "200px" }}
                  onClick={handleViewCardImage}
                />
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={handleViewCardImage}
                    size="sm"
                    variant="secondary"
                    className="opacity-80 hover:opacity-100"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-2 flex-wrap gap-2">
            <Button onClick={handleDownloadQR} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
            {cardImageUrl && (
              <>
                <Button onClick={handleDownloadCardImage} variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                <Button onClick={handleViewCardImage} variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
                <Button onClick={handleTestQR} variant="outline" size="sm">
                  🔍 Test QR Content
                </Button>
              </>
            )}
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-blue-800 font-medium">📱 How it works:</p>
                <p className="text-sm text-blue-700 mt-1">
                  1. The QR code contains your card image URL
                  <br />
                  2. When someone scans it, they'll see the URL
                  <br />
                  3. Tapping the URL opens your professional card image
                  <br />
                  4. No login or app required!
                </p>
                {cardImageUrl && (
                  <div className="mt-2 p-2 bg-white rounded border">
                    <p className="text-xs text-gray-600 font-mono break-all">
                      QR contains: {cardImageUrl.length > 50 ? cardImageUrl.substring(0, 50) + "..." : cardImageUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-green-800 font-medium">✅ Ready to Share!</p>
                <p className="text-sm text-green-700 mt-1">
                  Your card image is hosted online and the QR code is ready. When scanned, it will show the URL to your
                  card image that anyone can tap to view.
                </p>
                {cardImageUrl.includes("i.ibb.co") && (
                  <p className="text-xs text-green-600 mt-2">
                    🌐 Hosted on ImgBB - Image will be available for 6 months
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
