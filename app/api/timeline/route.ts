import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"
import { getEventAccess } from "@/lib/event-access"

type TimelinePayloadItem = {
  title?: string
  timeLabel?: string | null
  description?: string | null
  orderIndex?: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get("eventId")
  const inviteCode = searchParams.get("inviteCode")

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { userId } = await auth()
  const access = await getEventAccess(supabase, { eventId, userId, inviteCode })

  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { data: items, error } = await supabase
    .from("event_timeline_items")
    .select("*")
    .eq("event_id", eventId)
    .order("order_index", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: items || [] })
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const eventId = body?.eventId as string | undefined
    const rawItems = (body?.items || []) as TimelinePayloadItem[]

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    if (!Array.isArray(rawItems)) {
      return NextResponse.json({ error: "items must be an array" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: event } = await supabase
      .from("events")
      .select("id, user_id")
      .eq("id", eventId)
      .single()

    if (!event || event.user_id !== userId) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 })
    }

    const items = rawItems
      .map((item, index) => ({
        event_id: eventId,
        title: String(item.title || "").trim(),
        time_label: String(item.timeLabel || "").trim() || null,
        description: String(item.description || "").trim() || null,
        order_index: Number.isFinite(item.orderIndex) ? Number(item.orderIndex) : index,
      }))
      .filter((item) => item.title.length > 0)

    const { error: deleteError } = await supabase
      .from("event_timeline_items")
      .delete()
      .eq("event_id", eventId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    if (items.length === 0) {
      return NextResponse.json({ success: true, items: [] })
    }

    const { data: savedItems, error: insertError } = await supabase
      .from("event_timeline_items")
      .insert(items)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      items: (savedItems || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)),
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
