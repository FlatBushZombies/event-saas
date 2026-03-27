"use client"

import Link from "next/link"
import { format, isAfter, isBefore } from "date-fns"
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EventsListProps {
  events: Event[]
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card className="border-border/60 bg-gradient-to-br from-white to-primary/5 p-12 shadow-sm">
        <div className="text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-serif text-2xl">No wedding chapters yet</h3>
          <p className="mb-4 text-muted-foreground">
            Create your first celebration space to begin the story beautifully.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const eventDate = new Date(event.event_date)
        const status = isAfter(eventDate, new Date())
          ? "Upcoming"
          : isBefore(eventDate, new Date())
          ? "Memory"
          : "Today"

        return (
          <Card
            key={event.id}
            className="overflow-hidden border-border/60 bg-gradient-to-br from-white to-primary/5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
            <CardHeader className="pb-4">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
                {status}
              </div>
              <CardTitle className="pt-2 font-serif text-2xl">{event.title}</CardTitle>
              <CardDescription className="line-clamp-3 leading-relaxed">
                {event.description || "A private moment in your wedding story, ready for guests, memories, and planning details."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(eventDate, "PPP 'at' p")}</span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <Link href={`/dashboard/events/${event.id}`}>
                <Button className="w-full rounded-full bg-white/90" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Open Chapter
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
