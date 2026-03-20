import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/server-supabase"

function isAccepted(status?: string | null) {
  return status === "accepted" || status === "scanned"
}

type SeatingClientTable = {
  name: string
  capacity: number
  posXPercent: number
  posYPercent: number
}

type SeatingClientAssignment = {
  inviteId: string
  tableIndex: number
}

function clampNumber(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min
  return Math.max(min, Math.min(max, n))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get("eventId")
  const inviteCode = searchParams.get("inviteCode")

  if (!eventId) return NextResponse.json({ error: "Event ID is required" }, { status: 400 })

  const supabase = createAdminClient()
  const { userId } = await auth()

  // Owner path (Clerk-authenticated)
  if (userId) {
    const { data: event } = await supabase.from("events").select("id,user_id").eq("id", eventId).single()
    if (!event || event.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: tables, error: tablesErr } = await supabase
      .from("seating_tables")
      .select("id,event_id,name,capacity,order_index,pos_x_percent,pos_y_percent,created_at,updated_at")
      .eq("event_id", eventId)
      .order("order_index", { ascending: true })

    if (tablesErr) return NextResponse.json({ error: tablesErr.message }, { status: 500 })

    const acceptedStatuses = ["accepted", "scanned"]
    const { data: guests, error: guestsErr } = await supabase
      .from("invites")
      .select("id,invite_code,attendee_name,attendee_email,status,accepted_at,scanned_at,created_at")
      .eq("event_id", eventId)
      .in("status", acceptedStatuses)
      .order("created_at", { ascending: true })

    if (guestsErr) return NextResponse.json({ error: guestsErr.message }, { status: 500 })

    const tableIds = (tables || []).map((t) => t.id)
    let assignments: { invite_id: string; table_id: string }[] = []
    if (tableIds.length > 0) {
      const { data: rows, error: assignmentsErr } = await supabase
        .from("seating_assignments")
        .select("invite_id,table_id")
        .in("table_id", tableIds)
      if (assignmentsErr) return NextResponse.json({ error: assignmentsErr.message }, { status: 500 })
      assignments = rows || []
    }

    const assignedCountByTableId = assignments.reduce((acc, a) => {
      acc[a.table_id] = (acc[a.table_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tablesWithCounts =
      (tables || []).map((t) => ({
        ...t,
        assignedCount: assignedCountByTableId[t.id] || 0,
      })) || []

    const assignmentByInviteId = assignments.reduce((acc, a) => {
      acc[a.invite_id] = a.table_id
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(
      {
        tables: tablesWithCounts,
        guests: guests || [],
        assignmentByInviteId,
      },
      { status: 200 }
    )
  }

  // Guest path (invite code)
  if (inviteCode) {
    const { data: invite } = await supabase
      .from("invites")
      .select("id,event_id,status,invite_code")
      .eq("invite_code", inviteCode)
      .eq("event_id", eventId)
      .single()

    if (!invite || !isAccepted(invite.status)) {
      return NextResponse.json({ error: "Invite not accepted" }, { status: 403 })
    }

    const { data: tables, error: tablesErr } = await supabase
      .from("seating_tables")
      .select("id,event_id,name,capacity,order_index,pos_x_percent,pos_y_percent")
      .eq("event_id", eventId)
      .order("order_index", { ascending: true })

    if (tablesErr) return NextResponse.json({ error: tablesErr.message }, { status: 500 })

    const tableIds = (tables || []).map((t) => t.id)

    let assignments: { invite_id: string; table_id: string }[] = []
    if (tableIds.length > 0) {
      const { data: rows, error: assignmentsErr } = await supabase
        .from("seating_assignments")
        .select("invite_id,table_id")
        .in("table_id", tableIds)
      if (assignmentsErr) return NextResponse.json({ error: assignmentsErr.message }, { status: 500 })
      assignments = rows || []
    }

    const assignedCountByTableId = assignments.reduce((acc, a) => {
      acc[a.table_id] = (acc[a.table_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tablesOverview =
      (tables || []).map((t) => ({
        id: t.id,
        name: t.name,
        capacity: t.capacity,
        pos_x_percent: t.pos_x_percent,
        pos_y_percent: t.pos_y_percent,
        assignedCount: assignedCountByTableId[t.id] || 0,
      })) || []

    const myAssignment = assignments.find((a) => a.invite_id === invite.id)
    const myTableId = myAssignment?.table_id
    const myTable = tablesOverview.find((t) => t.id === myTableId) || null

    return NextResponse.json({ tables: tablesOverview, myTable }, { status: 200 })
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventId = body?.eventId as string | undefined
    const clientTables = (body?.tables || []) as SeatingClientTable[]
    const clientAssignments = (body?.assignments || []) as SeatingClientAssignment[]

    if (!eventId) return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    if (!Array.isArray(clientTables) || !Array.isArray(clientAssignments)) {
      return NextResponse.json({ error: "tables and assignments must be arrays" }, { status: 400 })
    }

    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = createAdminClient()

    // Verify ownership through Clerk
    const { data: event } = await supabase.from("events").select("id,user_id").eq("id", eventId).single()
    if (!event || event.user_id !== userId) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 })
    }

    // Delete existing plan (tables cascade to assignments)
    const { error: deleteErr } = await supabase.from("seating_tables").delete().eq("event_id", eventId)
    if (deleteErr) return NextResponse.json({ error: deleteErr.message }, { status: 500 })

    // Insert tables (preserve order_index)
    const { data: insertedTables, error: insertTablesErr } = await supabase
      .from("seating_tables")
      .insert(
        clientTables.map((t, i) => ({
          event_id: eventId,
          name: String(t.name || "").trim() || `Table ${i + 1}`,
          capacity: Math.max(0, Math.floor(Number(t.capacity) || 0)),
          order_index: i,
          pos_x_percent: clampNumber(Number(t.posXPercent), 0, 100),
          pos_y_percent: clampNumber(Number(t.posYPercent), 0, 100),
        }))
      )
      .select()

    if (insertTablesErr) return NextResponse.json({ error: insertTablesErr.message }, { status: 500 })

    const insertedSorted = (insertedTables || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    const tableIdByIndex = insertedSorted.reduce((acc, t, i) => {
      acc[i] = t.id
      return acc
    }, {} as Record<number, string>)

    // Validate invites (only accepted/scanned can be assigned)
    const inviteIds = Array.from(new Set(clientAssignments.map((a) => a.inviteId).filter(Boolean)))
    const { data: invites, error: invitesErr } = inviteIds.length
      ? await supabase
          .from("invites")
          .select("id,event_id,status")
          .eq("event_id", eventId)
          .in("id", inviteIds)
      : { data: [], error: null }

    if (invitesErr) return NextResponse.json({ error: invitesErr.message }, { status: 500 })

    const validInviteIds = new Set((invites || []).filter((inv) => isAccepted(inv.status)).map((inv) => inv.id))

    const assignmentRows = clientAssignments
      .map((a) => {
        if (!validInviteIds.has(a.inviteId)) return null
        const tableId = tableIdByIndex[a.tableIndex]
        if (!tableId) return null
        return { invite_id: a.inviteId, table_id: tableId }
      })
      .filter(Boolean) as { invite_id: string; table_id: string }[]

    if (assignmentRows.length > 0) {
      const { error: assignErr } = await supabase
        .from("seating_assignments")
        .upsert(assignmentRows, { onConflict: "invite_id" })

      if (assignErr) return NextResponse.json({ error: assignErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, tables: insertedSorted }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

