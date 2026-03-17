import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/server-supabase"
import { EventsList } from "@/components/events-list"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { CalendarDays, Mail, QrCode, Images, Heart, Sparkles, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

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
      
      <main className="relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/2 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6 py-12">
          {/* Hero Section */}
          <section className="mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-sm mb-8">
              <Heart className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Your Wedding Workspace
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-tight text-foreground mb-5">
                  <span className="text-balance">Plan, invite, and celebrate</span>
                  <span className="block text-primary/80 italic font-normal">all in one place</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Keep everything organized: your events, invites, guest check-in, polls, and shared media. 
                  Your wedding journey, beautifully managed.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <CreateEventDialog userId={userId} />
              </div>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="mb-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Events Card */}
              <div className="group relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">Events</p>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-4xl font-serif font-semibold text-foreground">{safeEvents.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total created</p>
                </div>
              </div>

              {/* Upcoming Card */}
              <div className="group relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">Upcoming</p>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-4xl font-serif font-semibold text-foreground">{upcomingEvents.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Events ahead</p>
                </div>
              </div>

              {/* Invites Card */}
              <div className="group relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">Invitations</p>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create digital invitations and track RSVPs inside each event.
                  </p>
                </div>
              </div>

              {/* Check-in & Media Card */}
              <div className="group relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">Check-in & Media</p>
                    <div className="flex items-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <QrCode className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Scan guest QR codes and share photos from the event page.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Next Event Highlight */}
          {nextEvent && (
            <section className="mb-16">
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(120,100,80,0.05),transparent_50%)]" />
                
                <div className="relative p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <Heart className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Next Celebration
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
                          {nextEvent.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {format(new Date(nextEvent.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                          {nextEvent.location && (
                            <span className="block md:inline md:ml-2">
                              <span className="hidden md:inline">·</span> {nextEvent.location}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/events/${nextEvent.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      Manage Event
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Events List Section */}
          <section aria-label="My events">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">
                  My Events
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Select an event to manage invites, polls, media, and guest check-in.
                </p>
              </div>
            </div>

            <EventsList events={safeEvents} />
          </section>
        </div>
      </main>
    </div>
  )
}
