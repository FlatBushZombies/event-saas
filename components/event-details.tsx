import { format } from "date-fns"
import { Calendar, FileText, MapPin } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EventDetailsProps {
  event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <Card className="mb-8 overflow-hidden border-border/60 bg-gradient-to-br from-white via-white to-primary/5 shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
      <CardHeader>
        <CardTitle className="mb-2 font-serif text-4xl">{event.title}</CardTitle>
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
              <span className="text-sm font-medium">Story note</span>
            </div>
            <p className="pl-6 leading-relaxed text-muted-foreground">{event.description}</p>
          </div>
        )}

        <div className="border-t pt-4 text-xs text-muted-foreground">
          Created {format(new Date(event.created_at), "PPP")}
          {event.updated_at !== event.created_at && <> / Updated {format(new Date(event.updated_at), "PPP")}</>}
        </div>
      </CardContent>
    </Card>
  )
}
