import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: Request) {
  const { inviteCode, attendeeName, attendeeEmail } = await request.json()

  // Use admin client to bypass RLS for invite acceptance
  const supabase = createAdminClient()

  const { data: invite } = await supabase.from("invites").select("*").eq("invite_code", inviteCode).single()

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 })
  }

  const { error } = await supabase
    .from("invites")
    .update({
      status: "accepted",
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
      accepted_at: new Date().toISOString(),
      qr_code_data: `${inviteCode}`,
    })
    .eq("invite_code", inviteCode)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
