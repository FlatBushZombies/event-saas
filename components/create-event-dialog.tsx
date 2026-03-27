"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateEventDialogProps {
  userId?: string
}

const chapterTemplates = [
  {
    id: "wedding-day",
    label: "Wedding Day",
    title: "Wedding Day",
    description: "Keep the ceremony, reception, seating, guest updates, and shared memories in one elegant space.",
  },
  {
    id: "welcome-dinner",
    label: "Welcome Dinner",
    title: "Welcome Dinner",
    description: "Set the tone the night before with a calm place for timing, location details, and guest coordination.",
  },
  {
    id: "anniversary",
    label: "Anniversary",
    title: "Anniversary Celebration",
    description: "Bring everyone back into the story with a beautiful chapter for photos, messages, and the next milestone.",
  },
  {
    id: "other",
    label: "Other Celebration",
    title: "Private Celebration",
    description: "Create another meaningful chapter that still feels connected to the same love story.",
  },
] as const

export function CreateEventDialog({ userId }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<(typeof chapterTemplates)[number]["id"]>("wedding-day")
  const [title, setTitle] = useState<string>(chapterTemplates[0].title)
  const [description, setDescription] = useState<string>(chapterTemplates[0].description)
  const router = useRouter()

  function applyTemplate(templateId: (typeof chapterTemplates)[number]["id"]) {
    const template = chapterTemplates.find((item) => item.id === templateId)
    if (!template) return
    setSelectedTemplateId(template.id)
    setTitle(template.title)
    setDescription(template.description)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const eventData = {
      title,
      description,
      location: formData.get("location") as string,
      event_date: formData.get("event_date") as string,
    }

    if (!eventData.title || !eventData.event_date) {
      toast.error("Title and date are required")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event")
      }

      toast.success("Wedding chapter created")
      e.currentTarget.reset()
      applyTemplate("wedding-day")
      setOpen(false)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create event"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-sm">
          <Plus className="h-5 w-5 mr-2" />
          Add Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden rounded-[1.8rem] border-border/60 p-0 sm:max-w-[560px]">
        <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
        <DialogHeader className="px-6 pt-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Wedding Chapter
          </div>
          <DialogTitle className="pt-3 font-serif text-3xl">Create a new chapter</DialogTitle>
          <DialogDescription className="max-w-md leading-relaxed">
            Wedding day, welcome dinner, anniversary weekend, or another celebration that belongs in your story.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
          <div className="grid gap-2">
            <Label>Start with a chapter style</Label>
            <div className="flex flex-wrap gap-2">
              {chapterTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className={[
                    "rounded-full border px-3 py-2 text-sm transition",
                    selectedTemplateId === template.id
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                      : "border-border/60 bg-white text-muted-foreground hover:border-primary/20 hover:text-foreground",
                  ].join(" ")}
                >
                  {template.label}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pick a starting point, then tailor the chapter however you like. This keeps second events feeling connected instead of recreated from scratch.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Chapter Name</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wedding Day, Welcome Dinner, Anniversary Weekend..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">What should guests know?</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share the tone, dress note, arrival details, or why this moment matters."
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="Venue name or address" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event_date">Date & Time</Label>
            <Input id="event_date" name="event_date" type="datetime-local" required />
          </div>

          <div className="rounded-[1.4rem] border border-primary/10 bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
            Tip: the same couple can create more than one chapter over time, like the wedding day now and an anniversary celebration later.
          </div>

          <Button type="submit" className="w-full rounded-full shadow-sm" disabled={loading}>
            {loading ? "Creating..." : "Create Chapter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
