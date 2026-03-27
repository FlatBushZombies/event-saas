"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CalendarClock, Plus, Save, Sparkles, Trash2 } from "lucide-react"
import type { TimelineItem } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type TimelineDraft = {
  id?: string
  title: string
  timeLabel: string
  description: string
}

const DEFAULT_TIMELINE_ITEMS: TimelineDraft[] = [
  { title: "Ceremony", timeLabel: "", description: "" },
  { title: "Cocktail Hour", timeLabel: "", description: "" },
  { title: "Speeches", timeLabel: "", description: "" },
  { title: "First Dance", timeLabel: "", description: "" },
  { title: "Cake Cutting", timeLabel: "", description: "" },
]

export function TimelineEditor({ eventId }: { eventId: string }) {
  const { data, error, mutate } = useSWR<{ items: TimelineItem[] }>(`/api/timeline?eventId=${eventId}`, fetcher)
  const [items, setItems] = useState<TimelineDraft[]>(DEFAULT_TIMELINE_ITEMS)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!data) return

    const nextItems =
      data.items?.length > 0
        ? data.items.map((item) => ({
            id: item.id,
            title: item.title,
            timeLabel: item.time_label || "",
            description: item.description || "",
          }))
        : DEFAULT_TIMELINE_ITEMS

    setItems(nextItems)
  }, [data])

  function updateItem(index: number, patch: Partial<TimelineDraft>) {
    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, { title: "", timeLabel: "", description: "" }])
  }

  async function saveTimeline() {
    setSaving(true)
    try {
      const response = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          items: items.map((item, index) => ({
            title: item.title,
            timeLabel: item.timeLabel,
            description: item.description,
            orderIndex: index,
          })),
        }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.error || "Failed to save timeline")
      }

      toast.success("Wedding timeline saved")
      await mutate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save timeline")
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load the wedding timeline.</div>
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 rounded-full border border-border animate-spin" />
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/95 shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Guest Timeline
            </div>
            <CardTitle className="flex items-center gap-3 text-2xl font-serif">
              <CalendarClock className="h-5 w-5 text-primary" />
              Wedding Timeline View
            </CardTitle>
            <CardDescription className="max-w-2xl leading-relaxed">
              Add the key moments guests keep asking about. Empty titles are skipped, so you can keep only the moments
              you want to show.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="bg-transparent" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Moment
            </Button>
            <Button type="button" onClick={saveTimeline} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Timeline"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id || `timeline-${index}`}
            className="rounded-3xl border border-border/60 bg-gradient-to-br from-white to-primary/5 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Moment {index + 1}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                disabled={items.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-2">
                <Label htmlFor={`timeline-title-${index}`}>Title</Label>
                <Input
                  id={`timeline-title-${index}`}
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  placeholder="Ceremony"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`timeline-time-${index}`}>Time Label</Label>
                <Input
                  id={`timeline-time-${index}`}
                  value={item.timeLabel}
                  onChange={(e) => updateItem(index, { timeLabel: e.target.value })}
                  placeholder="3:00 PM"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor={`timeline-description-${index}`}>Description</Label>
              <Textarea
                id={`timeline-description-${index}`}
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                placeholder="Guests arrive, ushers guide everyone to their seats..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
