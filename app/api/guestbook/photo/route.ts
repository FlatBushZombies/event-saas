import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"

function isAccepted(status?: string | null) {
  return status === "accepted" || status === "scanned"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const inviteCode = formData.get("inviteCode") as string

    if (!file || !inviteCode) {
      return NextResponse.json({ error: "file and inviteCode are required" }, { status: 400 })
    }

    // Use admin client; authorization is via invite code + accepted status
    const supabase = createAdminClient()

    const { data: invite } = await supabase
      .from("invites")
      .select("id, event_id, status")
      .eq("invite_code", inviteCode)
      .single()

    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    if (!isAccepted(invite.status)) return NextResponse.json({ error: "Invite not accepted" }, { status: 403 })

    // Upload to the existing private bucket used by event media.
    const fileExt = file.name.split(".").pop() || "jpg"
    const safeExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "")
    const fileName = `guestbook/${invite.event_id}/${invite.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage.from("event-media").upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    return NextResponse.json({ path: fileName })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

