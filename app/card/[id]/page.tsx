"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, QrCode, Share2, ArrowLeft, AlertCircle, ImageIcon } from "lucide-react"
import Link from "next/link"
import { CardPreview } from "@/components/card-preview"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { ClientCardStorage } from "@/lib/card-storage"
import { EnhancedCardGenerator } from "@/lib/enhanced-card-generator"

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

export default function CardViewer() {
  const params = useParams()
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      // Get card from client storage
      const card = ClientCardStorage.getCard(params.id as string)
      if (card) {
        setCardData(card)
      } else {
        setError("Card not found in local storage")
      }
      setIsLoading(false)
    }
  }, [params.id])

  const handleDownloadVCard = () => {
    if (!cardData) return

    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.fullName}
ORG:${cardData.company}
TITLE:${cardData.designation}
TEL:${cardData.phone}
EMAIL:${cardData.email}${cardData.website ? `\nURL:${cardData.website}` : ""}${cardData.linkedin ? `\nURL:https://${cardData.linkedin.startsWith("http") ? cardData.linkedin : "https://" + cardData.linkedin}` : ""}${cardData.github ? `\nURL:https://${cardData.github.startsWith("http") ? cardData.github : "https://" + cardData.github}` : ""}
END:VCARD`

    const blob = new Blob([vCardContent], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${cardData.fullName.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleDownloadCardImage = async () => {
    if (!cardData) return
    try {
      const imageBlob = await EnhancedCardGenerator.generateCardImage(cardData, false)
      const url = URL.createObjectURL(imageBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cardData.fullName.replace(/\s+/g, "_")}_card.png`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading card image:", error)
      alert("Failed to download card image")
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData?.fullName}'s Digital Card`,
          text: `Check out ${cardData?.fullName}'s digital business card`,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading card...</p>
          <p className="text-sm text-gray-500 mt-2">Card ID: {params.id}</p>
        </div>
      </div>
    )
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Card Not Found</h1>
          <p className="text-gray-600 mb-4">
            This card was not found in your browser's local storage. Cards are stored locally and may not be accessible
            from other devices or browsers.
          </p>
          <p className="text-sm text-gray-500 mb-6">Card ID: {params.id}</p>
          <div className="space-y-3">
            <Link href="/designer">
              <Button className="w-full">Create New Card</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{cardData.fullName}'s Card</h1>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Display */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Business Card</CardTitle>
              </CardHeader>
              <CardContent>
                <CardPreview cardData={cardData} />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button onClick={handleDownloadVCard} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Save Contact
              </Button>
              <Button onClick={handleDownloadCardImage} variant="outline" className="flex-1 bg-transparent">
                <ImageIcon className="h-4 w-4 mr-2" />
                Download Image
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Card
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>QR Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QRCodeDisplay cardId={cardData.id} />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Scan this QR code to get the URL to your card image - tap the URL to view your card!
                </p>
              </CardContent>
            </Card>

            {/* Card Info */}
            <Card>
              <CardHeader>
                <CardTitle>Card Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(cardData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card ID:</span>
                  <span className="font-mono text-sm break-all">{cardData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theme:</span>
                  <span className="capitalize">{cardData.theme}</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>📱 How QR works:</strong> The QR code contains your card image URL. When scanned, people
                    will see the URL and can tap it to view your professional card image instantly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
