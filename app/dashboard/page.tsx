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
import { AnimatedSection } from "@/components/animated-section"

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
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[5%] top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute right-[10%] top-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute left-[40%] top-[60%] h-64 w-64 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>

        <div className="relative container mx-auto px-6 py-12 lg:py-16">
          {/* Hero Section */}
          <AnimatedSection className="mb-20">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-5 py-2.5 shadow-sm backdrop-blur-sm">
                <Heart className="h-4 w-4 text-primary/70" />
                <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Your wedding home
                </span>
              </div>

              <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h1 className="text-balance font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
                    Keep the whole story
                    <span className="block text-primary/80 italic font-normal">beautifully in one place</span>
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    This is your private space for the wedding day, every guest detail, every memory, and every chapter that comes after.
                  </p>
                </div>

                <CreateEventDialog userId={userId} />
              </div>
            </section>
          </AnimatedSection>

          {/* Stats Section */}
          <section className="mb-20">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon

                return (
                  <AnimatedSection key={stat.label} delay={index * 100}>
                    <div className="group relative rounded-3xl border border-border/60 bg-gradient-to-br from-card to-primary/5 p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg h-full">
                      {/* Corner decoration */}
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative">
                        <div className="mb-5 flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{stat.label}</p>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <p className="font-serif text-5xl font-semibold text-foreground">{stat.value}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{stat.copy}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </section>

          {/* Next Event Section */}
          {nextEvent ? (
            <AnimatedSection className="mb-20">
              <section>
                <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card shadow-sm">
                  {/* Background decorations */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(186,125,114,0.12),transparent_50%)]" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full" />

                  <div className="relative flex flex-col gap-8 p-10 md:flex-row md:items-center md:justify-between md:p-12">
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                          Next chapter
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-4xl text-foreground">{nextEvent.title}</h3>
                        <p className="mt-3 text-lg text-muted-foreground">
                          {format(new Date(nextEvent.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                          {nextEvent.location ? <span className="block md:inline md:ml-2 mt-1 md:mt-0">/ {nextEvent.location}</span> : null}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/events/${nextEvent.id}`}
                      className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 group"
                    >
                      Open Chapter
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </section>
            </AnimatedSection>
          ) : null}

          {/* Events List Header */}
          <AnimatedSection className="mb-10">
            <section>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <h2 className="font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">Your wedding chapters</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    Start with the wedding day, then keep going with welcome dinners, anniversaries, and future celebrations that deserve the same care.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/80 px-5 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
                  <Camera className="h-5 w-5 text-primary" />
                  Built for planning and memory keeping
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Events List */}
          <section aria-label="My events">
            <EventsList events={safeEvents} />
          </section>
        </div>
      </main>
    </div>
  )
}
