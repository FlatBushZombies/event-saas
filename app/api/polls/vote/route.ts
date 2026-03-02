import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pollId, inviteCode, optionIndex } = body

    if (!pollId || !inviteCode || optionIndex === undefined || optionIndex === null) {
      return NextResponse.json(
        { error: "Poll ID, invite code, and option index are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify the invite exists and get its ID
    const { data: invite } = await supabase
      .from("invites")
      .select("id, event_id, status")
      .eq("invite_code", inviteCode)
      .single()

    if (!invite) {
      return NextResponse.json({ error: "Invalid invite" }, { status: 403 })
    }

    if (invite.status !== "accepted" && invite.status !== "scanned") {
      return NextResponse.json(
        { error: "You must accept the invitation before voting" },
        { status: 403 }
      )
    }

    // Verify the poll exists, is active, and belongs to the same event
    const { data: poll } = await supabase
      .from("polls")
      .select("id, event_id, options, is_active")
      .eq("id", pollId)
      .single()

    if (!poll || poll.event_id !== invite.event_id) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 })
    }

    if (!poll.is_active) {
      return NextResponse.json({ error: "This poll is no longer active" }, { status: 400 })
    }

    if (optionIndex < 0 || optionIndex >= (poll.options as string[]).length) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 })
    }

    // Upsert the vote (one vote per invite per poll)
    const { data, error } = await supabase
      .from("poll_votes")
      .upsert(
        {
          poll_id: pollId,
          invite_id: invite.id,
          option_index: optionIndex,
        },
        { onConflict: "poll_id,invite_id" }
      )
      .select()
      .single()

    if (error) {
      console.error("Supabase error casting vote:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
