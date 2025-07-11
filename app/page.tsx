import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, QrCode, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Digital Card Generator</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Create Your Digital Visiting Card</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Design professional digital business cards with QR codes. Share your contact information instantly and let
            others save it directly to their phones.
          </p>
          <Link href="/designer">
            <Button size="lg" className="text-lg px-8 py-4">
              Create Your Card Now
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Professional Design</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create beautiful, professional digital business cards with customizable themes and layouts.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <QrCode className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically generate QR codes for easy sharing. Others can scan to view your card instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Save to Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate vCard files that allow others to save your contact information directly to their phone.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Go Digital?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands of professionals who have already made the switch to digital business cards.
          </p>
          <Link href="/designer">
            <Button size="lg" className="mr-4">
              Get Started Free
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Digital Card Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
