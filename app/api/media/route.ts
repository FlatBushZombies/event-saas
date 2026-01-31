import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const eventId = formData.get("eventId") as string
    const caption = formData.get("caption") as string | null

    if (!file || !eventId) {
      return NextResponse.json({ error: "File and eventId are required" }, { status: 400 })
    }

    // Use admin client to bypass RLS since we've already verified auth with Clerk
    const supabase = createAdminClient()

    // Verify user owns this event
    const { data: event } = await supabase
      .from("events")
      .select("id, user_id")
      .eq("id", eventId)
      .single()

    if (!event || event.user_id !== userId) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 })
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${eventId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from("event-media")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.log("[v0] Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Save media record to database
    const { data: media, error: dbError } = await supabase
      .from("media")
      .insert({
        event_id: eventId,
        uploaded_by: userId,
        file_name: file.name,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
        caption: caption || null,
      })
      .select()
      .single()

    if (dbError) {
      console.log("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save media record" }, { status: 500 })
    }

    return NextResponse.json({ media })
  } catch (error) {
    console.log("[v0] Error uploading media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get("eventId")
  const inviteCode = searchParams.get("inviteCode")

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  // Use admin client to bypass RLS
  const supabase = createAdminClient()

  // Check if user is event owner or has accepted invite
  const { userId } = await auth()
  
  if (userId) {
    // Check if user owns the event
    const { data: event } = await supabase
      .from("events")
      .select("user_id")
      .eq("id", eventId)
      .single()

    if (event?.user_id === userId) {
      // User is owner, return all media
      const { data: media } = await supabase
        .from("media")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })

      return NextResponse.json({ media: media || [] })
    }
  }

  // Check invite code for non-owners
  if (inviteCode) {
    const { data: invite } = await supabase
      .from("invites")
      .select("status, event_id")
      .eq("invite_code", inviteCode)
      .eq("event_id", eventId)
      .single()

    if (invite && (invite.status === "accepted" || invite.status === "scanned")) {
      const { data: media } = await supabase
        .from("media")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })

      return NextResponse.json({ media: media || [] })
    }
  }

  return NextResponse.json({ error: "Unauthorized to view media" }, { status: 403 })
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mediaId } = await request.json()
    // Use admin client to bypass RLS since we've already verified auth with Clerk
    const supabase = createAdminClient()

    // Get media record
    const { data: media } = await supabase
      .from("media")
      .select("*, events!inner(user_id)")
      .eq("id", mediaId)
      .single()

    if (!media || media.events.user_id !== userId) {
      return NextResponse.json({ error: "Media not found or unauthorized" }, { status: 403 })
    }

    // Delete from storage
    await supabase.storage.from("event-media").remove([media.file_path])

    // Delete from database
    await supabase.from("media").delete().eq("id", mediaId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] Error deleting media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
