import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, question, options } = body

    if (!eventId || !question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "Event ID, question, and at least 2 options are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify the user owns this event
    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("user_id", userId)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("polls")
      .insert({
        event_id: eventId,
        question: question.trim(),
        options: options.map((o: string) => o.trim()).filter((o: string) => o.length > 0),
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error creating poll:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")
    const inviteCode = searchParams.get("inviteCode")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // If inviteCode is provided, this is a guest request — verify invite belongs to event
    if (inviteCode) {
      const { data: invite } = await supabase
        .from("invites")
        .select("id, event_id")
        .eq("invite_code", inviteCode)
        .eq("event_id", eventId)
        .single()

      if (!invite) {
        return NextResponse.json({ error: "Invalid invite" }, { status: 403 })
      }

      // Fetch polls with vote counts and user's vote
      const { data: polls, error } = await supabase
        .from("polls")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Enrich polls with vote data
      const enrichedPolls = await Promise.all(
        (polls || []).map(async (poll) => {
          const { data: votes } = await supabase
            .from("poll_votes")
            .select("option_index")
            .eq("poll_id", poll.id)

          const { data: userVote } = await supabase
            .from("poll_votes")
            .select("option_index")
            .eq("poll_id", poll.id)
            .eq("invite_id", invite.id)
            .single()

          const voteCounts = (poll.options as string[]).map(
            (_: string, i: number) => (votes || []).filter((v) => v.option_index === i).length
          )

          return {
            ...poll,
            votes: voteCounts,
            total_votes: (votes || []).length,
            user_vote: userVote?.option_index ?? null,
          }
        })
      )

      return NextResponse.json({ polls: enrichedPolls }, { status: 200 })
    }

    // Owner request — verify auth
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("user_id", userId)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const { data: polls, error } = await supabase
      .from("polls")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Enrich with vote counts
    const enrichedPolls = await Promise.all(
      (polls || []).map(async (poll) => {
        const { data: votes } = await supabase
          .from("poll_votes")
          .select("option_index")
          .eq("poll_id", poll.id)

        const voteCounts = (poll.options as string[]).map(
          (_: string, i: number) => (votes || []).filter((v) => v.option_index === i).length
        )

        return {
          ...poll,
          votes: voteCounts,
          total_votes: (votes || []).length,
        }
      })
    )

    return NextResponse.json({ polls: enrichedPolls }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { pollId, is_active } = body

    if (!pollId || typeof is_active !== "boolean") {
      return NextResponse.json(
        { error: "Poll ID and is_active boolean are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify ownership through the event
    const { data: poll } = await supabase
      .from("polls")
      .select("id, event_id, events(user_id)")
      .eq("id", pollId)
      .single()

    if (!poll || (poll.events as any)?.user_id !== userId) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 })
    }

    const { error } = await supabase
      .from("polls")
      .update({ is_active })
      .eq("id", pollId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { pollId } = body

    if (!pollId) {
      return NextResponse.json({ error: "Poll ID is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verify ownership through the event
    const { data: poll } = await supabase
      .from("polls")
      .select("id, event_id, events(user_id)")
      .eq("id", pollId)
      .single()

    if (!poll || (poll.events as any)?.user_id !== userId) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 })
    }

    const { error } = await supabase.from("polls").delete().eq("id", pollId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
