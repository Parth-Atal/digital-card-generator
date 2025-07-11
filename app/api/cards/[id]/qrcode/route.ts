import { type NextRequest, NextResponse } from "next/server"
import { QRCodeGenerator } from "@/lib/qr-generator"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Generate QR code URL pointing to the card
    const cardUrl = `${request.nextUrl.origin}/card/${params.id}`
    console.log("Generating QR code for URL:", cardUrl)

    // Generate QR code blob
    const qrBlob = await QRCodeGenerator.generateQRCodeBlob(cardUrl, 256)

    return new NextResponse(qrBlob, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="qr-code-${params.id}.png"`,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
