import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/server-supabase"
import { EventsList } from "@/components/events-list"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { CalendarDays, Mail, QrCode, Images } from "lucide-react"
import { format } from "date-fns"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Use admin client to bypass RLS since we've already verified auth with Clerk
  const supabase = createAdminClient()
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true })

  const now = Date.now()
  const safeEvents = events || []
  const upcomingEvents = safeEvents.filter((e) => {
    const t = new Date(e.event_date).getTime()
    return Number.isFinite(t) && t >= now
  })
  const nextEvent = upcomingEvents[0]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userId={userId} />
      <main className="container mx-auto px-4 py-10">
        {/* Hero */}
        <section className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-white border border-border shadow-sm mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Your wedding workspace
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-4">
                Plan, invite, and celebrate — all in one dashboard
              </h1>
              <p className="text-muted-foreground text-lg text-pretty">
                Keep everything organized: your events, invites, guest check-in, polls, and shared media.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CreateEventDialog userId={userId} />
            </div>
          </div>

          {/* Quick stats (landing-style cards) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Events</p>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold mt-3">{safeEvents.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total created</p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Upcoming</p>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold mt-3">{upcomingEvents.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Events ahead</p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Invites</p>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Create digital invitations and track RSVPs inside each event.
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Check‑in & Media</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <QrCode className="h-4 w-4" />
                  <Images className="h-4 w-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Scan guest QR codes and share photos/videos — all from the event page.
              </p>
            </div>
          </div>

          {nextEvent && (
            <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Next up</p>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
                <div>
                  <p className="text-lg font-semibold">{nextEvent.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(nextEvent.event_date), "PPP 'at' p")}
                    {nextEvent.location ? ` · ${nextEvent.location}` : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Primary content section (mirrors landing “Everything your wedding needs”) */}
        <section aria-label="My events">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">My Events</h2>
              <p className="text-muted-foreground text-lg">Pick an event to manage invites, polls, media, and guest check‑in.</p>
            </div>
          </div>

          <EventsList events={safeEvents} />
        </section>
      </main>
    </div>
  )
}
