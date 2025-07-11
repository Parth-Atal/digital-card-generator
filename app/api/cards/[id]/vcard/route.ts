import { type NextRequest, NextResponse } from "next/server"
import { CardStorage } from "@/lib/kv-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await CardStorage.getCard(params.id)

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    // Generate vCard content
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${card.fullName}
ORG:${card.company}
TITLE:${card.designation}
TEL:${card.phone}
EMAIL:${card.email}${card.website ? `\nURL:${card.website}` : ""}${card.linkedin ? `\nURL:https://${card.linkedin.startsWith("http") ? card.linkedin : "https://" + card.linkedin}` : ""}${card.github ? `\nURL:https://${card.github.startsWith("http") ? card.github : "https://" + card.github}` : ""}
END:VCARD`

    return new NextResponse(vCardContent, {
      headers: {
        "Content-Type": "text/vcard",
        "Content-Disposition": `attachment; filename="${card.fullName.replace(/\s+/g, "_")}.vcf"`,
      },
    })
  } catch (error) {
    console.error("Error generating vCard:", error)
    return NextResponse.json({ error: "Failed to generate vCard" }, { status: 500 })
  }
}
