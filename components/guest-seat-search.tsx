"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import type { SeatingOverviewTable } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MapPinned, Search, TriangleAlert } from "lucide-react"

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
    return tables.filter((t) => t.name.toLowerCase().includes(q))
  }, [tables, query])

  const mySeatLabel = myTable ? `${myTable.name}` : "not assigned yet"

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
      <div className="rounded-3xl border border-border bg-white/80 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Seat
            </p>
            <p className="mt-2 text-3xl font-bold" style={{ fontFamily: '"Instrument Serif", serif' }}>
              {mySeatLabel === "not assigned yet" ? (
                <span className="text-muted-foreground">Pending assignment</span>
              ) : (
                mySeatLabel
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {myTable
                ? `Capacity ${myTable.capacity}. You’re among ${myTable.assignedCount} guest(s currently assigned.`
                : "The organizer hasn’t set the seating plan yet."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPinned className="h-5 w-5 text-primary" />
          </div>
        </div>

        {tables.length > 0 && myTable && (myTable.capacity === 0 ? myTable.assignedCount > 0 : myTable.assignedCount > myTable.capacity) ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2">
            <TriangleAlert className="h-4 w-4 text-red-700" />
            <p className="text-sm text-red-800">Your table is currently over capacity.</p>
          </div>
        ) : null}
      </div>

      <Card className="shadow-none border-border bg-transparent">
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
              placeholder="e.g. Family Table, VIP…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {tables.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No tables have been created yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tables match your search.</div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => {
                const over = t.capacity === 0 ? t.assignedCount > 0 : t.assignedCount > t.capacity
                const isMine = myTable?.id === t.id
                return (
                  <div
                    key={t.id}
                    className={[
                      "rounded-3xl border p-4",
                      isMine ? "border-primary bg-primary/5" : "border-border bg-white/70",
                      over && !isMine ? "ring-1 ring-red-200" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{t.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.assignedCount} assigned of {t.capacity}
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
                if (!myTable) toast.info("You’re pending assignment.", { duration: 2000 })
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

