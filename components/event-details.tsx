import type { Event } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"

interface EventDetailsProps {
  event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.description && <p className="text-muted-foreground leading-relaxed">{event.description}</p>}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">{format(new Date(event.event_date), "PPPP 'at' p")}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
