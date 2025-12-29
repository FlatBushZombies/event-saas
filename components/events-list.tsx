"use client"

import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface EventsListProps {
  events: Event[]
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events yet</h3>
          <p className="text-muted-foreground mb-4">Create your first event to get started</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2">{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.event_date), "PPP 'at' p")}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            <Link href={`/dashboard/events/${event.id}`}>
              <Button className="w-full bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Event
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
