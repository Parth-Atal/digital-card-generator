"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Phone, Mail, Globe, Linkedin, Github, Building } from "lucide-react"
import { CardImageGenerator } from "@/lib/card-image-generator"

// This is a public view that doesn't require the card to be in local storage
// It shows a generic card format that can be accessed via QR codes
export default function PublicCardViewer() {
  const params = useParams()
  const [cardImage, setCardImage] = useState<string>("")

  useEffect(() => {
    // Generate a sample card image for demonstration
    const generateSampleCard = async () => {
      const sampleCard = {
        id: params.id as string,
        fullName: "Professional Name",
        designation: "Job Title",
        company: "Company Name",
        phone: "+1 (555) 000-0000",
        email: "contact@example.com",
        website: "www.example.com",
        linkedin: "linkedin.com/in/profile",
        github: "github.com/profile",
        theme: "blue",
        profileImage: "",
        createdAt: new Date().toISOString(),
      }

      try {
        const imageUrl = await CardImageGenerator.generateCardImage(sampleCard)
        setCardImage(imageUrl)
      } catch (error) {
        console.error("Error generating card image:", error)
      }
    }

    generateSampleCard()
  }, [params.id])

  const handleDownloadVCard = () => {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:Professional Name
ORG:Company Name
TITLE:Job Title
TEL:+1 (555) 000-0000
EMAIL:contact@example.com
URL:www.example.com
URL:linkedin.com/in/profile
URL:github.com/profile
END:VCARD`

    const blob = new Blob([vCardContent], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contact.vcf"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Digital Business Card</CardTitle>
            </CardHeader>
            <CardContent>
              {cardImage && (
                <div className="text-center mb-6">
                  <img
                    src={cardImage || "/placeholder.svg"}
                    alt="Business Card"
                    className="mx-auto rounded-lg shadow-lg max-w-full"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Professional Name</h2>
                  <p className="text-lg text-gray-600">Job Title</p>
                  <p className="text-gray-500">Company Name</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+1 (555) 000-0000</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>contact@example.com</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>www.example.com</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Company Name</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <span>LinkedIn Profile</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Github className="h-5 w-5 text-blue-600" />
                    <span>GitHub Profile</span>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Button onClick={handleDownloadVCard} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Save to Contacts
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    This is a sample digital business card. Create your own at{" "}
                    <a href="/" className="font-semibold underline">
                      Digital Card Generator
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
