"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


interface CreateEventDialogProps {
  userId?: string
}

export function CreateEventDialog({ userId }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      event_date: formData.get("event_date") as string,
    }

    // Validate required fields
    if (!eventData.title || !eventData.event_date) {
      toast.error("Title and date are required")
      setLoading(false)
      return
    }

    console.log("[v0] Submitting event:", eventData)

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
        console.error("[v0] Error response:", data)
        throw new Error(data.error || "Failed to create event")
      }

      console.log("Event created:", data)

      toast.success("Event created successfully")
      
      // Reset form
      e.currentTarget.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Create event error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create event"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details for your event</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" placeholder="Summer Conference 2025" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Tell attendees about your event..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="123 Main St, City, State" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_date">Date & Time</Label>
            <Input id="event_date" name="event_date" type="datetime-local" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
