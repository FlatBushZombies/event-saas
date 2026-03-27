"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type React from "react"
import useSWR from "swr"
import type { SeatingGuest, SeatingOverviewTable } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Save, Table2, Users } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type SeatingPlannerProps = {
  eventId: string
}

type OwnerSeatingResponse = {
  tables: (SeatingOverviewTable & { order_index?: number })[]
  guests: SeatingGuest[]
  assignmentByInviteId: Record<string, string> // invite_id -> table_id
}

type TableDraft = {
  id?: string
  name: string
  capacity: number
  posXPercent: number
  posYPercent: number
}

export function SeatingPlanner({ eventId }: SeatingPlannerProps) {
  const { data, error, mutate } = useSWR<OwnerSeatingResponse>(`/api/seating?eventId=${eventId}`, fetcher)

  const [guestSearch, setGuestSearch] = useState("")
  const [saving, setSaving] = useState(false)

  const [tables, setTables] = useState<TableDraft[]>([])
  const [assignmentByInviteId, setAssignmentByInviteId] = useState<Record<string, number | null>>({})

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!data) return
    const ownerTables = data.tables || []

    setTables(
      ownerTables.map((t) => ({
        id: t.id,
        name: t.name,
        capacity: t.capacity,
        posXPercent: Number(t.pos_x_percent),
        posYPercent: Number(t.pos_y_percent),
      }))
    )

    const tableIndexById = new Map(ownerTables.map((t, i) => [t.id, i]))
    const nextAssignment: Record<string, number | null> = {}
    for (const g of data.guests || []) {
      const tableId = data.assignmentByInviteId?.[g.id]
      nextAssignment[g.id] = tableId ? tableIndexById.get(tableId) ?? null : null
    }
    setAssignmentByInviteId(nextAssignment)
  }, [data])

  const acceptedGuests = data?.guests || []

  const filteredGuests = useMemo(() => {
    const q = guestSearch.trim().toLowerCase()
    if (!q) return acceptedGuests
    return acceptedGuests.filter((g) => {
      const n = (g.attendee_name || "").toLowerCase()
      const e = (g.attendee_email || "").toLowerCase()
      return n.includes(q) || e.includes(q)
    })
  }, [acceptedGuests, guestSearch])

  const assignedCountByTableIndex = useMemo(() => {
    const counts = new Array(tables.length).fill(0)
    for (const g of acceptedGuests) {
      const idx = assignmentByInviteId[g.id]
      if (typeof idx === "number" && idx >= 0 && idx < tables.length) {
        counts[idx] += 1
      }
    }
    return counts
  }, [acceptedGuests, assignmentByInviteId, tables.length])

  const isTableOverCapacity = (tableIndex: number) => {
    const capacity = tables[tableIndex]?.capacity ?? 0
    const assigned = assignedCountByTableIndex[tableIndex] || 0
    if (capacity === 0) return assigned > 0
    return assigned > capacity
  }

  const unassignedCount = useMemo(() => {
    return acceptedGuests.filter((g) => assignmentByInviteId[g.id] === null || assignmentByInviteId[g.id] === undefined).length
  }, [acceptedGuests, assignmentByInviteId])

  function addTable() {
    setTables((prev) => [
      ...prev,
      {
        name: `Table ${prev.length + 1}`,
        capacity: 8,
        posXPercent: 20 + ((prev.length * 12) % 60),
        posYPercent: 20 + (Math.floor(prev.length / 3) * 10) % 60,
      },
    ])
  }

  function updateTable(index: number, patch: Partial<TableDraft>) {
    setTables((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)))
  }

  function assignGuest(inviteId: string, tableIndex: number | null) {
    setAssignmentByInviteId((prev) => ({ ...prev, [inviteId]: tableIndex }))
  }

  function handleCanvasPointerMove(e: React.PointerEvent) {
    if (draggingIndex === null) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    updateTable(draggingIndex, { posXPercent: clampedX, posYPercent: clampedY })
  }

  async function savePlan() {
    setSaving(true)
    try {
      if (tables.length === 0) {
        toast.error("Add at least one table")
        return
      }

      const assignmentsPayload: { inviteId: string; tableIndex: number }[] = []
      for (const g of acceptedGuests) {
        const idx = assignmentByInviteId[g.id]
        if (typeof idx === "number" && idx >= 0) {
          assignmentsPayload.push({ inviteId: g.id, tableIndex: idx })
        }
      }

      const payload = {
        eventId,
        tables: tables.map((t) => ({
          name: t.name,
          capacity: Number(t.capacity) || 0,
          posXPercent: t.posXPercent,
          posYPercent: t.posYPercent,
        })),
        assignments: assignmentsPayload,
      }

      const res = await fetch("/api/seating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save seating plan")
      toast.success("Seating plan saved")
      await mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load seating plan</div>
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 rounded-full border border-border animate-spin" />
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-white via-white to-primary/5 shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-serif">
              <Table2 className="h-5 w-5" />
              Smart Seating Plan
            </CardTitle>
            <CardDescription>Drag tables, set capacities, assign guests, and keep the room balanced automatically.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" className="rounded-full bg-white/80" onClick={addTable}>
              <Plus className="h-4 w-4 mr-2" />
              Add table
            </Button>
            <Button type="button" onClick={savePlan} disabled={saving} className="gap-2 rounded-full shadow-sm">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save plan"}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3 py-1.5 shadow-sm">
            <Users className="h-4 w-4" />
            {acceptedGuests.length} accepted guest{acceptedGuests.length === 1 ? "" : "s"}
          </div>
          <div aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/25" />
          <div className="rounded-full border border-border/60 bg-white/70 px-3 py-1.5 shadow-sm">{unassignedCount} unassigned</div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid lg:grid-cols-[320px_1fr_320px] gap-4">
          {/* Guests column */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="guest-search">Guests</Label>
              <Input
                id="guest-search"
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder="Search by name or email"
                className="mt-1"
              />
            </div>

            <div className="max-h-[520px] overflow-auto pr-1 space-y-2">
              {filteredGuests.map((g) => {
                const assignedIndex = assignmentByInviteId[g.id] ?? null
                const label = g.attendee_name || g.attendee_email || "Guest"
                return (
                  <div key={g.id} className="rounded-[1.4rem] border border-border/60 bg-white/85 p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{label}</p>
                        <p className="text-xs text-muted-foreground truncate">{g.attendee_email || ""}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {g.status === "scanned" ? "Checked in" : "Accepted"}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground" htmlFor={`select-${g.id}`}>
                        Table
                      </Label>
                      <select
                        id={`select-${g.id}`}
                        value={assignedIndex === null || assignedIndex === undefined ? "" : String(assignedIndex)}
                        onChange={(e) => {
                          const v = e.target.value
                          assignGuest(g.id, v === "" ? null : Number(v))
                        }}
                        className="flex-1 rounded-xl border border-border/60 bg-white/90 px-2 py-1 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {tables.map((t, idx) => (
                          <option key={idx} value={idx}>
                            {t.name} {isTableOverCapacity(idx) ? "- Over" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )
              })}
              {filteredGuests.length === 0 ? <div className="text-sm text-muted-foreground">No matching guests.</div> : null}
            </div>
          </div>

          {/* Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Table layout</Label>
              <p className="text-xs text-muted-foreground">{tables.length} table{tables.length === 1 ? "" : "s"}</p>
            </div>

            <div
              ref={canvasRef}
              className="relative w-full min-h-[520px] overflow-hidden rounded-[2rem] border border-primary/10 bg-[radial-gradient(circle_at_top,rgba(186,125,114,0.10),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,241,236,0.9))]"
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={() => setDraggingIndex(null)}
            >
              {/* Subtle grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(186,125,114,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(186,125,114,0.14) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />

              {tables.map((t, idx) => {
                const assignedCount = assignedCountByTableIndex[idx] || 0
                const over = isTableOverCapacity(idx)
                return (
                  <div
                    key={`${idx}-${t.name}`}
                    role="button"
                    tabIndex={0}
                    className={[
                      "absolute rounded-2xl border shadow-sm select-none cursor-grab bg-white/90 backdrop-blur",
                      over ? "border-red-300" : "border-primary/10",
                    ].join(" ")}
                    style={{
                      left: `${t.posXPercent}%`,
                      top: `${t.posYPercent}%`,
                      width: 160,
                      transform: "translate(-50%,-50%)",
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      setDraggingIndex(idx)
                      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
                    }}
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-serif font-semibold truncate">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{over ? "Over capacity" : "Balanced"}</p>
                        </div>
                        <div className="text-xs font-medium">
                          {assignedCount}/{t.capacity}
                        </div>
                      </div>
                      <div
                        className={[
                          "mt-3 h-2 rounded-full overflow-hidden",
                          over ? "bg-red-50" : "bg-primary/10",
                        ].join(" ")}
                      >
                        <div
                          className={over ? "bg-red-400" : "bg-gradient-to-r from-primary to-primary/70"}
                          style={{
                            width:
                              t.capacity > 0
                                ? `${Math.min(100, (assignedCount / t.capacity) * 100)}%`
                                : assignedCount > 0
                                ? "100%"
                                : "0%",
                          }}
                        />
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">Drag to reposition</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tables inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tables</Label>
              <p className="text-xs text-muted-foreground">Edit names/capacity</p>
            </div>

            <div className="max-h-[520px] overflow-auto pr-1 space-y-2">
              {tables.map((t, idx) => {
                const assigned = assignedCountByTableIndex[idx] || 0
                const over = isTableOverCapacity(idx)
                return (
                  <div key={idx} className="rounded-[1.6rem] border border-border/60 bg-white/85 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">#{idx + 1}</p>
                        <p className="text-xs text-muted-foreground">{over ? "Over capacity!" : "In range"}</p>
                      </div>
                      {over ? (
                        <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                          {assigned} assigned
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
                          {assigned} assigned
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      <div>
                        <Label htmlFor={`table-name-${idx}`}>Table name</Label>
                        <Input
                          id={`table-name-${idx}`}
                          value={t.name}
                          onChange={(e) => updateTable(idx, { name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`table-cap-${idx}`}>Capacity</Label>
                        <Input
                          id={`table-cap-${idx}`}
                          type="number"
                          value={t.capacity}
                          onChange={(e) => updateTable(idx, { capacity: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full bg-white/80"
                          onClick={() => updateTable(idx, { posXPercent: 50, posYPercent: 50 })}
                        >
                          Center
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full bg-white/80"
                          disabled={tables.length <= 1}
                          onClick={() => {
                            setTables((prev) => prev.filter((_, i) => i !== idx))
                            setAssignmentByInviteId((prev) => {
                              const next = { ...prev }
                              for (const key of Object.keys(next)) {
                                const v = next[key]
                                if (v === idx) next[key] = null
                                else if (typeof v === "number" && v > idx) next[key] = v - 1
                              }
                              return next
                            })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {tables.length === 0 ? <div className="text-sm text-muted-foreground">No tables yet. Add one.</div> : null}
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Tip: Over-capacity tables are automatically highlighted in red.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
