import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"
import { isAcceptedInviteStatus } from "@/lib/event-access"

export async function POST(request: Request) {
  const { inviteCode, attendeeName, attendeeEmail } = await request.json()

  if (!inviteCode) {
    return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
  }

  // Use admin client to bypass RLS for invite acceptance
  const supabase = createAdminClient()

  const { data: invite } = await supabase.from("invites").select("*").eq("invite_code", inviteCode).single()

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 })
  }

  if (isAcceptedInviteStatus(invite.status)) {
    const { data: acceptedInvite, error: updateAcceptedError } = await supabase
      .from("invites")
      .update({
        attendee_name: attendeeName || invite.attendee_name,
        attendee_email: attendeeEmail || invite.attendee_email,
        qr_code_data: invite.qr_code_data || inviteCode,
      })
      .eq("invite_code", inviteCode)
      .select()
      .single()

    if (updateAcceptedError) {
      return NextResponse.json({ error: updateAcceptedError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, invite: acceptedInvite, alreadyAccepted: true })
  }

  const { data: updatedInvite, error } = await supabase
    .from("invites")
    .update({
      status: "accepted",
      attendee_name: attendeeName || invite.attendee_name,
      attendee_email: attendeeEmail || invite.attendee_email,
      accepted_at: new Date().toISOString(),
      qr_code_data: inviteCode,
    })
    .eq("invite_code", inviteCode)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, invite: updatedInvite })
}
