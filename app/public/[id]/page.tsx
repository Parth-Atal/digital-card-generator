"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Phone, Mail, Globe, Linkedin, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ClientCardStorage } from "@/lib/card-storage"

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

const themeStyles = {
  blue: {
    gradient: "from-blue-500 to-blue-700",
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  green: {
    gradient: "from-green-500 to-green-700",
    accent: "text-green-600",
    bg: "bg-green-50",
  },
  purple: {
    gradient: "from-purple-500 to-purple-700",
    accent: "text-purple-600",
    bg: "bg-purple-50",
  },
  orange: {
    gradient: "from-orange-500 to-orange-700",
    accent: "text-orange-600",
    bg: "bg-orange-50",
  },
  dark: {
    gradient: "from-gray-800 to-gray-900",
    accent: "text-gray-700",
    bg: "bg-gray-100",
  },
}

export default function PublicCardViewer() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActualCard, setIsActualCard] = useState(false)

  useEffect(() => {
    const loadCardData = () => {
      try {
        // First, try to get card data from URL parameters (embedded in QR code)
        const encodedData = searchParams.get("data")

        if (encodedData) {
          console.log("Found encoded card data in URL")
          const decodedCard = ClientCardStorage.decodeCardFromUrl(encodedData)

          if (decodedCard) {
            console.log("Successfully decoded card:", decodedCard.fullName)
            setCardData(decodedCard)
            setIsActualCard(true)
            setIsLoading(false)
            return
          }
        }

        // Fallback: try localStorage (if viewing from same device)
        if (typeof window !== "undefined") {
          const card = ClientCardStorage.getCard(params.id as string)
          if (card) {
            console.log("Found card in localStorage:", card.fullName)
            setCardData(card)
            setIsActualCard(true)
            setIsLoading(false)
            return
          }
        }

        // Final fallback: show sample card with clear indication
        console.log("No card data found, showing sample")
        const sampleCard: CardData = {
          id: params.id as string,
          fullName: "Sample Professional",
          designation: "Digital Card Demo",
          company: "Digital Card Generator",
          phone: "+1 (555) 123-4567",
          email: "demo@digitalcard.com",
          website: "https://digitalcard.com",
          linkedin: "linkedin.com/in/sample",
          github: "github.com/sample",
          theme: "blue",
          profileImage: "",
          createdAt: new Date().toISOString(),
        }

        setCardData(sampleCard)
        setIsActualCard(false)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading card data:", error)
        setIsLoading(false)
      }
    }

    loadCardData()
  }, [params.id, searchParams])

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

  const handleContactClick = (type: string, value: string) => {
    switch (type) {
      case "phone":
        window.open(`tel:${value}`)
        break
      case "email":
        window.open(`mailto:${value}`)
        break
      case "website":
        window.open(value.startsWith("http") ? value : `https://${value}`, "_blank")
        break
      case "linkedin":
        window.open(value.startsWith("http") ? value : `https://${value}`, "_blank")
        break
      case "github":
        window.open(value.startsWith("http") ? value : `https://${value}`, "_blank")
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading digital card...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Card Not Available</h1>
          <p className="text-gray-600 mb-6">This digital card could not be loaded.</p>
          <Link href="/">
            <Button>Create Your Own Card</Button>
          </Link>
        </div>
      </div>
    )
  }

  const theme = themeStyles[cardData.theme as keyof typeof themeStyles] || themeStyles.blue

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Show warning if this is just a sample card */}
          {!isActualCard && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Sample Card:</strong> This is a demonstration card. The actual card data was not found in
                    the QR code.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Digital Card Display */}
          <Card className="overflow-hidden shadow-lg mb-6">
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${theme.gradient} p-6 text-white`}>
              <div className="flex items-center space-x-4">
                {cardData.profileImage ? (
                  <img
                    src={cardData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {cardData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{cardData.fullName}</h1>
                  <p className="text-white/90 text-lg">{cardData.designation}</p>
                  <p className="text-white/80">{cardData.company}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <CardContent className={`p-6 ${theme.bg}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cardData.phone && (
                  <button
                    onClick={() => handleContactClick("phone", cardData.phone)}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <Phone className={`h-5 w-5 ${theme.accent}`} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{cardData.phone}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                )}

                {cardData.email && (
                  <button
                    onClick={() => handleContactClick("email", cardData.email)}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <Mail className={`h-5 w-5 ${theme.accent}`} />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{cardData.email}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                )}

                {cardData.website && (
                  <button
                    onClick={() => handleContactClick("website", cardData.website)}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <Globe className={`h-5 w-5 ${theme.accent}`} />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium">{cardData.website}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                )}

                {cardData.linkedin && (
                  <button
                    onClick={() => handleContactClick("linkedin", cardData.linkedin)}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <Linkedin className={`h-5 w-5 ${theme.accent}`} />
                    <div>
                      <p className="text-sm text-gray-500">LinkedIn</p>
                      <p className="font-medium">{cardData.linkedin}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                )}

                {cardData.github && (
                  <button
                    onClick={() => handleContactClick("github", cardData.github)}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <Github className={`h-5 w-5 ${theme.accent}`} />
                    <div>
                      <p className="text-sm text-gray-500">GitHub</p>
                      <p className="font-medium">{cardData.github}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-4">
                <Button onClick={handleDownloadVCard} className="w-full" size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  Save to Contacts
                </Button>

                <div className="text-center">
                  <Link href="/">
                    <Button variant="outline" className="bg-transparent">
                      Create Your Own Digital Card
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {isActualCard ? "Digital Business Card" : "Sample Digital Business Card"} • Created with Digital Card
                  Generator
                </p>
                {isActualCard && <p className="text-xs text-gray-400 text-center mt-1">Card ID: {cardData.id}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
