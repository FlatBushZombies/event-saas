"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import type { SeatingOverviewTable } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MapPinned, Search, TriangleAlert, Sparkles } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type GuestSeatingResponse = {
  tables: SeatingOverviewTable[]
  myTable: SeatingOverviewTable | null
}

export function GuestSeatSearch({ eventId, inviteCode }: { eventId: string; inviteCode: string }) {
  const { data, error } = useSWR<GuestSeatingResponse>(
    `/api/seating?eventId=${eventId}&inviteCode=${inviteCode}`,
    fetcher
  )
  const [query, setQuery] = useState("")

  const tables = data?.tables || []
  const myTable = data?.myTable || null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tables
    return tables.filter((table) => table.name.toLowerCase().includes(q))
  }, [tables, query])

  const mySeatLabel = myTable ? myTable.name : "not assigned yet"

  if (error) {
    return <div className="text-center py-8 text-muted-foreground">Could not load your seat.</div>
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 rounded-full border border-border animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.9rem] border border-border/60 bg-gradient-to-br from-white to-primary/5 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Your Seat
            </p>
            <p className="mt-2 text-3xl font-bold" style={{ fontFamily: '"Instrument Serif", serif' }}>
              {mySeatLabel === "not assigned yet" ? (
                <span className="text-muted-foreground">Pending assignment</span>
              ) : (
                mySeatLabel
              )}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {myTable
                ? `Capacity ${myTable.capacity}. You're among ${myTable.assignedCount} guest(s) currently assigned.`
                : "The organizer hasn't set the seating plan yet."}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-white text-sm shadow-sm">
            <MapPinned className="h-5 w-5 text-primary" />
          </div>
        </div>

        {tables.length > 0 &&
        myTable &&
        (myTable.capacity === 0 ? myTable.assignedCount > 0 : myTable.assignedCount > myTable.capacity) ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2">
            <TriangleAlert className="h-4 w-4 text-red-700" />
            <p className="text-sm text-red-800">Your table is currently over capacity.</p>
          </div>
        ) : null}
      </div>

      {tables.length > 0 ? (
        <div className="rounded-[1.9rem] border border-border/60 bg-gradient-to-br from-white via-white to-primary/5 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Table Layout</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A quick visual guide to where each table sits in the room.
              </p>
            </div>
            <div className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {tables.length} tables
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[1.6rem] border border-primary/10 bg-[radial-gradient(circle_at_top,rgba(186,125,114,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,241,236,0.92))]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(186,125,114,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(186,125,114,0.12) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            {tables.map((table) => {
              const isMine = myTable?.id === table.id
              const over = table.capacity === 0 ? table.assignedCount > 0 : table.assignedCount > table.capacity

              return (
                <div
                  key={table.id}
                  className={[
                    "absolute min-w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-center text-xs shadow-sm backdrop-blur",
                    isMine
                      ? "border-primary/40 bg-primary text-primary-foreground"
                      : over
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-white/80 bg-white/90 text-foreground",
                  ].join(" ")}
                  style={{
                    left: `${table.pos_x_percent}%`,
                    top: `${table.pos_y_percent}%`,
                  }}
                >
                  <p className="font-semibold">{table.name}</p>
                  <p className={isMine ? "text-primary-foreground/85" : "text-muted-foreground"}>
                    {table.assignedCount}/{table.capacity}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      <Card className="border-border/60 bg-transparent shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-4 w-4 text-primary" />
            Find your table
          </CardTitle>
          <CardDescription>Search tables by name and quickly spot where you belong.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-search">Search tables</Label>
            <Input
              id="table-search"
              placeholder="e.g. Family Table, VIP..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {tables.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tables have been created yet.</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tables match your search.</div>
          ) : (
            <div className="space-y-2">
              {filtered.map((table) => {
                const over = table.capacity === 0 ? table.assignedCount > 0 : table.assignedCount > table.capacity
                const isMine = myTable?.id === table.id

                return (
                  <div
                    key={table.id}
                    className={[
                      "rounded-3xl border p-4",
                      isMine ? "border-primary/30 bg-primary/5 shadow-sm shadow-primary/10" : "border-border bg-white/70",
                      over && !isMine ? "ring-1 ring-red-200" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{table.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {table.assignedCount} assigned of {table.capacity}
                        </p>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        {isMine ? "Your table" : over ? "Over capacity" : ""}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent"
              onClick={() => {
                setQuery("")
                if (!myTable) toast.info("You're pending assignment.", { duration: 2000 })
              }}
              disabled={!tables.length}
            >
              Clear search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
