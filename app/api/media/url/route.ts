import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"

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

  let authorized = false

  // Check if user is event owner
  if (userId) {
    const { data: event } = await supabase
      .from("events")
      .select("user_id")
      .eq("id", eventId)
      .single()

    if (event?.user_id === userId) {
      authorized = true
    }
  }

  // Check invite code for accepted invites
  if (!authorized && inviteCode) {
    const { data: invite } = await supabase
      .from("invites")
      .select("status")
      .eq("invite_code", inviteCode)
      .eq("event_id", eventId)
      .single()

    if (invite && (invite.status === "accepted" || invite.status === "scanned")) {
      authorized = true
    }
  }

  if (!authorized) {
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
