import Link from "next/link"
import { format } from "date-fns"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  BookHeart,
  CalendarDays,
  Camera,
  Heart,
  Sparkles,
  Users,
} from "lucide-react"
import { createAdminClient } from "@/lib/server-supabase"
import { DashboardHeader } from "@/components/dashboard-header"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { EventsList } from "@/components/events-list"

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

  const safeEvents = events || []
  const now = Date.now()
  const upcomingEvents = safeEvents.filter((event) => {
    const timestamp = new Date(event.event_date).getTime()
    return Number.isFinite(timestamp) && timestamp >= now
  })
  const nextEvent = upcomingEvents[0]

  const stats = [
    {
      label: "Wedding chapters",
      value: safeEvents.length,
      copy: "Every celebration lives together.",
      icon: CalendarDays,
    },
    {
      label: "Moments ahead",
      value: upcomingEvents.length,
      copy: "What is still coming next.",
      icon: Sparkles,
    },
    {
      label: "Guest calm",
      value: safeEvents.length > 0 ? "On" : "Soon",
      copy: "Invites, timeline, seating, memories.",
      icon: Users,
    },
    {
      label: "Memory mode",
      value: safeEvents.length > 1 ? "Ready" : "Growing",
      copy: "Perfect for anniversaries and future chapters.",
      icon: BookHeart,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userId={userId} />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6 py-12">
          <section className="mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 shadow-sm">
              <Heart className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Your wedding home
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-balance font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Keep the whole story
                  <span className="block text-primary/80 italic font-normal">beautifully in one place</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  This is your private space for the wedding day, every guest detail, every memory, and every chapter that comes after.
                </p>
              </div>

              <CreateEventDialog userId={userId} />
            </div>
          </section>

          <section className="mb-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="group relative rounded-[1.7rem] border border-border/60 bg-gradient-to-br from-white to-primary/5 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-bl from-primary/8 to-transparent" />
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{stat.label}</p>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p className="font-serif text-4xl font-semibold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.copy}</p>
                  </div>
                </div>
              )
            })}
          </section>

          {nextEvent ? (
            <section className="mb-16">
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(186,125,114,0.10),transparent_45%)]" />

                <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Next chapter
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl text-foreground">{nextEvent.title}</h3>
                      <p className="mt-2 text-muted-foreground">
                        {format(new Date(nextEvent.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                        {nextEvent.location ? <span className="block md:inline md:ml-2">/ {nextEvent.location}</span> : null}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/events/${nextEvent.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Open Chapter
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          <section className="mb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">Your wedding chapters</h2>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  Start with the wedding day, then keep going with welcome dinners, anniversaries, and future celebrations that deserve the same care.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <Camera className="h-4 w-4 text-primary" />
                Built for planning and memory keeping
              </div>
            </div>
          </section>

          <section aria-label="My events">
            <EventsList events={safeEvents} />
          </section>
        </div>
      </main>
    </div>
  )
}
