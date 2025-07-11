import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Digital Visiting Card Generator",
  description: "Create professional digital business cards with QR codes. Share your contact information instantly.",
  keywords: "digital business card, QR code, contact card, professional card, visiting card",
  authors: [{ name: "Digital Card Generator" }],
  creator: "Digital Card Generator",
  publisher: "Digital Card Generator",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-app-domain.vercel.app",
    title: "Digital Visiting Card Generator",
    description: "Create professional digital business cards with QR codes",
    siteName: "Digital Card Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Visiting Card Generator",
    description: "Create professional digital business cards with QR codes",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
