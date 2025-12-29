import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { eventId, attendeeName, attendeeEmail } = await request.json()

  // Use admin client to bypass RLS since we've already verified auth with Clerk
  const supabase = createAdminClient()

  // Verify event belongs to user
  const { data: event } = await supabase.from("events").select("user_id").eq("id", eventId).single()

  if (!event || event.user_id !== userId) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const inviteCode = nanoid(12)

  const { data, error } = await supabase
    .from("invites")
    .insert({
      event_id: eventId,
      invite_code: inviteCode,
      attendee_name: attendeeName || null,
      attendee_email: attendeeEmail || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inviteCode, ...data })
}
