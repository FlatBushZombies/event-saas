import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"

function isAccepted(status?: string | null) {
  return status === "accepted" || status === "scanned"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get("eventId")
  const inviteCode = searchParams.get("inviteCode")

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { userId } = await auth()

  // Owner access (Clerk)
  if (userId) {
    const { data: event } = await supabase.from("events").select("user_id").eq("id", eventId).single()
    if (event?.user_id === userId) {
      const { data: entries, error } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ entries: entries || [] })
    }
  }

  // Guest access (invite code must be accepted)
  if (inviteCode) {
    const { data: invite } = await supabase
      .from("invites")
      .select("id, status, event_id")
      .eq("invite_code", inviteCode)
      .eq("event_id", eventId)
      .single()

    if (invite && isAccepted(invite.status)) {
      const { data: entries, error } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ entries: entries || [] })
    }
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const inviteCode = body?.inviteCode as string | undefined
    const message = body?.message as string | undefined
    const photoPath = (body?.photoPath as string | undefined) || null

    if (!inviteCode) return NextResponse.json({ error: "inviteCode is required" }, { status: 400 })
    if (!message || !message.trim()) return NextResponse.json({ error: "message is required" }, { status: 400 })

    const supabase = createAdminClient()

    const { data: invite } = await supabase
      .from("invites")
      .select("id, event_id, status, attendee_name, attendee_email")
      .eq("invite_code", inviteCode)
      .single()

    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    if (!isAccepted(invite.status)) return NextResponse.json({ error: "Invite not accepted" }, { status: 403 })

    const now = new Date().toISOString()
    const { data: entry, error } = await supabase
      .from("guestbook_entries")
      .upsert(
        {
          event_id: invite.event_id,
          invite_id: invite.id,
          attendee_name: invite.attendee_name,
          attendee_email: invite.attendee_email,
          message: message.trim(),
          photo_path: photoPath,
          updated_at: now,
        },
        { onConflict: "invite_id" }
      )
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ entry })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

