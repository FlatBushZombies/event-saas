import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: Request) {
  const { inviteCode } = await request.json()

  // Use admin client to bypass RLS for invite scanning
  const supabase = createAdminClient()

  const { data: invite } = await supabase.from("invites").select("*, events(*)").eq("invite_code", inviteCode).single()

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 })
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
    .eq("invite_code", inviteCode)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    attendeeName: invite.attendee_name,
    attendeeEmail: invite.attendee_email,
    eventTitle: invite.events.title,
    eventDate: invite.events.event_date,
    eventLocation: invite.events.location,
  })
}
