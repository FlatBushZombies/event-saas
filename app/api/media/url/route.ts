import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"
import { getEventAccess } from "@/lib/event-access"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get("path")
  const eventId = searchParams.get("eventId")
  const inviteCode = searchParams.get("inviteCode")

  if (!filePath || !eventId) {
    return NextResponse.json({ error: "Path and eventId are required" }, { status: 400 })
  }

  // Use admin client to bypass RLS
  const supabase = createAdminClient()
  const { userId } = await auth()
  const access = await getEventAccess(supabase, { eventId, userId, inviteCode })

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Generate signed URL for the file
  const { data, error } = await supabase.storage
    .from("event-media")
    .createSignedUrl(filePath, 3600) // 1 hour expiry

  if (error || !data) {
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
