import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for the session
const sessionCards = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const cardData = await request.json()

    // Validate required fields
    const requiredFields = ["fullName", "designation", "company", "phone", "email"]
    const missingFields = requiredFields.filter((field) => !cardData[field]?.trim())

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
          message: `Please fill in: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

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

    // Store in session
    sessionCards.set(cardId, newCard)

    // Return success with card data
    return NextResponse.json({
      success: true,
      id: newCard.id,
      message: "Card created successfully",
      cardData: newCard,
    })
  } catch (error) {
    console.error("Error creating card:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create card",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    cards: Array.from(sessionCards.values()),
    count: sessionCards.size,
  })
}
