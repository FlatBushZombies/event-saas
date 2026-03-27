"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Clock3, Sparkles } from "lucide-react"
import type { TimelineItem } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function WeddingTimeline({ eventId, inviteCode }: { eventId: string; inviteCode: string }) {
  const { data, error } = useSWR<{ items: TimelineItem[] }>(
    `/api/timeline?eventId=${eventId}&inviteCode=${inviteCode}`,
    fetcher
  )

  if (error) {
    return <div className="text-center py-8 text-muted-foreground">Could not load the wedding timeline.</div>
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 rounded-full border border-border animate-spin" />
      </div>
    )
  }

  const items = (data.items || []).filter((item) => item.title?.trim().length > 0)

  if (items.length === 0) {
    return null
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/95 shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
      <CardHeader>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Know What&apos;s Next
        </div>
        <CardTitle className="mt-3 flex items-center gap-3 text-2xl font-serif">
          <CalendarClock className="h-5 w-5 text-primary" />
          Wedding Timeline
        </CardTitle>
        <CardDescription className="leading-relaxed">
          Everything important at a glance, so guests know exactly what&apos;s coming up next.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-4">
          <div className="absolute bottom-3 left-[1.1rem] top-3 w-px bg-gradient-to-b from-primary/40 via-primary/15 to-transparent" />
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative rounded-3xl border border-border/60 bg-gradient-to-br from-white to-primary/5 p-5 shadow-sm"
              >
                <div className="absolute -left-[1.05rem] top-6 flex h-5 w-5 items-center justify-center rounded-full border border-primary/20 bg-white shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-xl font-serif text-foreground">{item.title}</p>
                    {item.description ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    ) : null}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
                    <Clock3 className="h-4 w-4" />
                    <span>{item.time_label || "Time to be announced"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
