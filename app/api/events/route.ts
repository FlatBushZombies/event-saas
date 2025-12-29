import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    console.log("[v0] POST /api/events - User ID:", userId)

    if (!userId) {
      console.log("[v0] No user ID found, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { title, description, location, event_date } = body

    // Validate required fields
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      console.log("[v0] Invalid or missing title")
      return NextResponse.json({ error: "Title is required and must be a non-empty string" }, { status: 400 })
    }

    if (!event_date || typeof event_date !== "string") {
      console.log("[v0] Invalid or missing event_date")
      return NextResponse.json({ error: "Event date is required" }, { status: 400 })
    }

    // Validate date format (datetime-local returns YYYY-MM-DDTHH:mm)
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
    if (!dateRegex.test(event_date)) {
      console.log("[v0] Invalid date format")
      return NextResponse.json({ error: "Invalid date format. Please use the date picker." }, { status: 400 })
    }

    // Use admin client to bypass RLS since we've already verified auth with Clerk
    const supabase = createAdminClient()

    console.log("[v0] Inserting event into database...")
    const { data, error } = await supabase.from("events").insert({
        user_id: userId,
        title: title.trim(),
        description: description && description.trim().length > 0 ? description.trim() : null,
        location: location && location.trim().length > 0 ? location.trim() : null,
        event_date,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Event created successfully:", data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    console.log("[v0] GET /api/events - User ID:", userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use admin client to bypass RLS since we've already verified auth with Clerk
    const supabase = createAdminClient()

    console.log("[v0] Fetching events for user...")
    const { data, error } = await supabase.from("events")
      .select("*")
      .eq("user_id", userId)
      .order("event_date", { ascending: true })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Events fetched:", data?.length || 0)
    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
