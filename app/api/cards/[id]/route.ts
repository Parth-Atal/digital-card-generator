import { type NextRequest, NextResponse } from "next/server"

// This will be populated by the POST request
const sessionCards = new Map<string, any>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // For now, return a generic response since we're using client-side storage
    // In a real app, this would query a database
    return NextResponse.json(
      {
        error: "Card access via API",
        message: "Please access cards directly via the web interface",
        redirect: `/card/${params.id}`,
      },
      { status: 404 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch card",
      },
      { status: 500 },
    )
  }
}
