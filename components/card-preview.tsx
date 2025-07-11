import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Globe, Linkedin, Github, Building } from "lucide-react"

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

interface CardPreviewProps {
  cardData: CardData
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

export function CardPreview({ cardData }: CardPreviewProps) {
  const theme = themeStyles[cardData.theme as keyof typeof themeStyles] || themeStyles.blue

  return (
    <div className="max-w-md mx-auto">
      <Card className="overflow-hidden shadow-lg">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${theme.gradient} p-6 text-white`}>
          <div className="flex items-center space-x-4">
            {cardData.profileImage ? (
              <img
                src={cardData.profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {cardData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "JD"}
                </span>
              </div>
            )}

            {/* Fallback initials (hidden by default, shown if image fails) */}
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hidden">
              <span className="text-2xl font-bold">
                {cardData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "JD"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{cardData.fullName || "Your Name"}</h2>
              <p className="text-white/90">{cardData.designation || "Your Designation"}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className={`p-6 ${theme.bg}`}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Building className={`h-4 w-4 ${theme.accent}`} />
              <span className="text-gray-700">{cardData.company || "Your Company"}</span>
            </div>

            {cardData.phone && (
              <div className="flex items-center space-x-3">
                <Phone className={`h-4 w-4 ${theme.accent}`} />
                <span className="text-gray-700">{cardData.phone}</span>
              </div>
            )}

            {cardData.email && (
              <div className="flex items-center space-x-3">
                <Mail className={`h-4 w-4 ${theme.accent}`} />
                <span className="text-gray-700">{cardData.email}</span>
              </div>
            )}

            {cardData.website && (
              <div className="flex items-center space-x-3">
                <Globe className={`h-4 w-4 ${theme.accent}`} />
                <span className="text-gray-700">{cardData.website}</span>
              </div>
            )}

            {cardData.linkedin && (
              <div className="flex items-center space-x-3">
                <Linkedin className={`h-4 w-4 ${theme.accent}`} />
                <span className="text-gray-700">{cardData.linkedin}</span>
              </div>
            )}

            {cardData.github && (
              <div className="flex items-center space-x-3">
                <Github className={`h-4 w-4 ${theme.accent}`} />
                <span className="text-gray-700">{cardData.github}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
