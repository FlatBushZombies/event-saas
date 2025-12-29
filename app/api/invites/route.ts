import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"
import { sendInviteEmail } from "@/lib/email"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { eventId, attendeeName, attendeeEmail } = await request.json()

  // Validate email if provided
  if (attendeeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }

  // Use admin client to bypass RLS since we've already verified auth with Clerk
  const supabase = createAdminClient()

  // Verify event belongs to user and get full event details
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single()

  if (eventError || !event || event.user_id !== userId) {
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

  // Send email if email is provided
  let emailSent = false
  let emailError = null
  
  if (attendeeEmail) {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/invite/${inviteCode}`
    
    const emailResult = await sendInviteEmail({
      to: attendeeEmail,
      attendeeName: attendeeName || undefined,
      eventTitle: event.title,
      eventDate: event.event_date,
      eventLocation: event.location || undefined,
      inviteLink,
    })

    if (emailResult.success) {
      emailSent = true
      console.log("Invitation email sent successfully to:", attendeeEmail)
    } else {
      // Check if it's a configuration issue vs actual error
      if (emailResult.error === "Email service not configured") {
        console.warn("Email service not configured. Invite created but email not sent. Set RESEND_API_KEY to enable email sending.")
        emailError = "not_configured"
      } else {
        console.error("Failed to send email:", emailResult.error)
        emailError = emailResult.error
      }
    }
  }

  return NextResponse.json({ 
    inviteCode, 
    ...data, 
    emailSent,
    emailError: emailError || undefined
  })
}
