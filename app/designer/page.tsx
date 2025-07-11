"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, Save, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { CardPreview } from "@/components/card-preview"
import { ClientCardStorage } from "@/lib/card-storage"
import { ImageUpload } from "@/components/image-upload"

interface CardData {
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
}

export default function CardDesigner() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cardData, setCardData] = useState<CardData>({
    fullName: "",
    designation: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    github: "",
    theme: "blue",
    profileImage: "",
  })

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setIsUploadingImage(true)
    setError(null)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImagePreview(result)
        setCardData((prev) => ({ ...prev, profileImage: result }))
        setProfileImageFile(file)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      setError("Failed to process image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setProfileImageFile(null)
    setProfileImagePreview("")
    setCardData((prev) => ({ ...prev, profileImage: "" }))

    // Clear file input
    const fileInput = document.getElementById("profileImageFile") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Generate unique card ID
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const cardId = `card_${timestamp}_${randomString}`

      // Create the card object
      const newCard = {
        id: cardId,
        fullName: cardData.fullName.trim(),
        designation: cardData.designation.trim(),
        company: cardData.company.trim(),
        phone: cardData.phone.trim(),
        email: cardData.email.trim(),
        website: cardData.website?.trim() || "",
        linkedin: cardData.linkedin?.trim() || "",
        github: cardData.github?.trim() || "",
        theme: cardData.theme || "blue",
        profileImage: cardData.profileImage?.trim() || "",
        createdAt: new Date().toISOString(),
      }

      // Save to client storage
      ClientCardStorage.saveCard(newCard)

      setSuccess(`Card created successfully! ID: ${cardId}`)

      // Redirect to the card page
      setTimeout(() => {
        router.push(`/card/${cardId}`)
      }, 1500)
    } catch (error) {
      console.error("Error creating card:", error)
      setError("Failed to create card. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Card Designer</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
                <p className="text-sm text-green-600 mt-1">Redirecting to your card...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Error creating card</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>Card Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={cardData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <Input
                      id="designation"
                      value={cardData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={cardData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Tech Corp Inc."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={cardData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cardData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={cardData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://johndoe.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={cardData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={cardData.github}
                      onChange={(e) => handleInputChange("github", e.target.value)}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={cardData.theme} onValueChange={(value) => handleInputChange("theme", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue Professional</SelectItem>
                      <SelectItem value="green">Green Modern</SelectItem>
                      <SelectItem value="purple">Purple Creative</SelectItem>
                      <SelectItem value="orange">Orange Dynamic</SelectItem>
                      <SelectItem value="dark">Dark Elegant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ImageUpload
                  value={cardData.profileImage}
                  onChange={(value) => handleInputChange("profileImage", value)}
                  label="Profile Picture"
                  placeholder="Upload your profile picture"
                  maxSize={5}
                />

                <Button type="submit" className="w-full" disabled={isLoading || !!success}>
                  {isLoading ? "Creating Card..." : success ? "Card Created!" : "Create Digital Card"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Live Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardPreview cardData={cardData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
