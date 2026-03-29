import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { inviteCode } = await request.json()

  if (typeof inviteCode !== "string" || inviteCode.trim().length === 0) {
    return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
  }

  // Use admin client to bypass RLS for invite scanning
  const supabase = createAdminClient()

  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("attendee_name, attendee_email, invite_code, status, events!inner(user_id, title, event_date, location)")
    .eq("invite_code", inviteCode.trim())
    .single()

  if (inviteError || !invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 })
  }

  const event = Array.isArray(invite.events) ? invite.events[0] : invite.events

  if (!event || event.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (invite.status === "pending") {
    return NextResponse.json({ error: "Invite not accepted yet" }, { status: 400 })
  }

  if (invite.status === "scanned") {
    return NextResponse.json({ error: "Already checked in" }, { status: 400 })
  }

  const { error } = await supabase
    .from("invites")
    .update({
      status: "scanned",
      scanned_at: new Date().toISOString(),
    })
    .eq("invite_code", inviteCode.trim())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    attendeeName: invite.attendee_name,
    attendeeEmail: invite.attendee_email,
    eventTitle: event.title,
    eventDate: event.event_date,
    eventLocation: event.location,
  })
}
