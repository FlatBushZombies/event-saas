import type { Event } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, FileText } from "lucide-react"
import { format } from "date-fns"

interface EventDetailsProps {
  event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{format(new Date(event.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Description</span>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-6">{event.description}</p>
          </div>
        )}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          Created {format(new Date(event.created_at), "PPP")}
          {event.updated_at !== event.created_at && (
            <> • Updated {format(new Date(event.updated_at), "PPP")}</>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
