import { type NextRequest, NextResponse } from "next/server"

// This API endpoint will serve card data for public access
// For now, it returns a sample card, but in production this would query a database
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In a real implementation, you would:
    // 1. Query your database for the card with this ID
    // 2. Return the actual card data
    // 3. Handle cases where the card doesn't exist

    // For now, return a sample card for demonstration
    const sampleCard = {
      id: params.id,
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

    return NextResponse.json({
      success: true,
      card: sampleCard,
    })
  } catch (error) {
    console.error("Error fetching public card:", error)
    return NextResponse.json(
      {
        error: "Card not found",
        message: "The requested card could not be found.",
      },
      { status: 404 },
    )
  }
}
