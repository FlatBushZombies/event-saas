import Link from "next/link"
import {
  ArrowRight,
  BookHeart,
  CalendarDays,
  Camera,
  Clock3,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const pillars = [
  {
    icon: Heart,
    title: "Elegant, never corporate",
    copy: "A wedding should feel intimate and beautiful. Every screen should feel like part of the celebration, not another admin tool.",
  },
  {
    icon: Clock3,
    title: "Stress down, clarity up",
    copy: "Couples need one calm place for invites, seating, memories, polls, and timelines so guests stop asking the same questions.",
  },
  {
    icon: BookHeart,
    title: "Memories preserved beautifully",
    copy: "Before the ceremony, during the day, and years later, your wedding story should still feel alive and easy to return to.",
  },
]

const chapters = [
  {
    eyebrow: "Before",
    title: "Plan with less friction",
    copy: "Create your private wedding space, invite guests, publish your timeline, and keep every detail beautifully organized.",
  },
  {
    eyebrow: "During",
    title: "Keep guests in sync",
    copy: "Guests accept one link and instantly know where to be, what is next, where they sit, and how to share their memories.",
  },
  {
    eyebrow: "Forever After",
    title: "Keep the story going",
    copy: "Add an anniversary weekend, vow renewal, or second celebration without starting from zero. Your wedding life keeps living here.",
  },
]

const experienceCards = [
  {
    icon: Users,
    title: "Private guest experience",
    copy: "One accepted invite unlocks the guestbook, seating, media, votes, and timeline with almost no learning curve.",
  },
  {
    icon: Camera,
    title: "Shared memory space",
    copy: "Guests contribute photos and videos into a gallery that feels curated, not chaotic.",
  },
  {
    icon: CalendarDays,
    title: "Wedding chapters",
    copy: "Wedding day, welcome dinner, anniversary party, and every meaningful chapter can live together inside one couple account.",
  },
]

function ShowcaseCard() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-[0_30px_120px_rgba(156,120,105,0.18)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,125,114,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(148,166,132,0.12),transparent_30%)]" />
      <div className="relative space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.6rem] border border-border/60 bg-[#fffdfc] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Wedding Home</p>
                <h3 className="mt-2 text-2xl font-serif text-foreground">Amara & Daniel</h3>
              </div>
              <div className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                Private workspace
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["142", "Guests invited"],
                ["12", "Timeline moments"],
                ["368", "Memories shared"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.3rem] border border-border/60 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-serif text-foreground">{value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-primary/10 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Next moment</p>
                  <p className="mt-2 text-lg font-serif text-foreground">Ceremony begins at 3:00 PM</p>
                  <p className="mt-1 text-sm text-muted-foreground">Guests see this instantly in their accepted invite experience.</p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm sm:flex">
                  <Clock3 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-border/60 bg-[#fffdfc] p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Guest view</p>
              <div className="mt-4 space-y-3">
                {[
                  "Accept invite",
                  "See ceremony timeline",
                  "Find table assignment",
                  "Vote and share memories",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-full border border-border/60 bg-white px-4 py-3 text-sm text-foreground shadow-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-border/60 bg-[#fffdfc] p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">After the wedding</p>
              <p className="mt-3 text-lg font-serif text-foreground">Create an anniversary chapter</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Keep the same space alive for anniversaries, vow renewals, or another celebration that deserves the same care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fcf7f2] text-foreground">
      <Navbar />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-6rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(214,149,136,0.14),transparent_65%)] blur-3xl" />
          <div className="absolute right-[-6%] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(186,125,114,0.12),transparent_65%)] blur-3xl" />
          <div className="absolute bottom-[12rem] left-[18%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(148,166,132,0.09),transparent_65%)] blur-3xl" />
        </div>

        <section className="relative px-6 pb-18 pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm backdrop-blur">
                  <Heart className="h-3.5 w-3.5" />
                  A private digital wedding experience
                </div>

                <h1 className="mt-8 text-balance font-serif text-5xl leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Where your wedding lives
                  <span className="block text-primary/80 italic">before, during, and forever after.</span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Wedspace gives couples one elegant home for invites, timelines, seating, memories, and guest experience,
                  without turning wedding planning into another stressful software project.
                </p>

                <blockquote className="mt-8 rounded-[1.6rem] border border-white/70 bg-white/75 p-5 text-base leading-relaxed text-foreground shadow-sm backdrop-blur">
                  This is not a generic event SaaS. This is a private digital wedding experience designed to feel calm,
                  intimate, and worth revisiting.
                </blockquote>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_18px_50px_rgba(186,125,114,0.26)] transition hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    Create your wedding space
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-white/80 px-7 py-3.5 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/20 hover:text-primary"
                  >
                    Return to your space
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Zero-friction", "guest experience"],
                    ["Emotional value", "over feature overload"],
                    ["Second event ready", "anniversary or more"],
                  ].map(([strong, soft]) => (
                    <div key={strong} className="rounded-[1.3rem] border border-border/60 bg-white/75 p-4 shadow-sm backdrop-blur">
                      <p className="font-serif text-xl text-foreground">{strong}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{soft}</p>
                    </div>
                  ))}
                </div>
              </div>

              <ShowcaseCard />
            </div>
          </div>
        </section>

        <section id="experience" className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Product Principles</p>
              <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
                Made to reduce stress, preserve beauty, and keep the whole experience human.
              </h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="rounded-[1.8rem] border border-white/70 bg-white/80 p-7 shadow-[0_18px_60px_rgba(156,120,105,0.08)] backdrop-blur"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-serif text-2xl text-foreground">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.copy}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.title}
                  className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/80 p-7 shadow-sm"
                >
                  <div className="absolute right-5 top-5 font-serif text-6xl text-primary/10">{index + 1}</div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">{chapter.eyebrow}</p>
                  <h3 className="mt-4 max-w-xs font-serif text-3xl text-foreground">{chapter.title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{chapter.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Why It Feels Different</p>
                <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
                  One wedding home for the couple, one graceful flow for every guest.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                  The best wedding software does not overwhelm couples with dashboards and busywork. It quietly organizes the experience,
                  makes guests feel taken care of, and keeps the memories beautiful long after the day ends.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {experienceCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className="rounded-[1.8rem] border border-border/60 bg-gradient-to-br from-white to-primary/5 p-6 shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-serif text-2xl text-foreground">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.copy}</p>
                    </div>
                  )
                })}

                <div className="rounded-[1.8rem] border border-primary/10 bg-primary text-primary-foreground p-6 shadow-[0_18px_60px_rgba(186,125,114,0.24)] sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-foreground/80">
                      Guest Trust
                    </p>
                  </div>
                  <h3 className="mt-4 max-w-lg font-serif text-3xl">
                    Guests should never wonder where to click, what happens next, or whether they missed something important.
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/85">
                    Accepted invite, clear timeline, visible seating, beautiful gallery, live memory sharing. That is the standard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 py-22">
          <div className="mx-auto max-w-5xl rounded-[2.2rem] border border-white/70 bg-white/80 p-8 shadow-[0_25px_90px_rgba(156,120,105,0.12)] backdrop-blur sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Beyond the wedding day</p>
            <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
              When the couple creates a second event, it should feel like the next chapter, not a restart.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Welcome dinner. Anniversary weekend. Vow renewal. Another family celebration. Wedspace should make every future moment feel connected
              to the same love story instead of trapped inside a one-time event tool.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Wedding Day", "Anniversary Dinner", "Forever Archive"].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-border/60 bg-[#fffdfc] px-4 py-5 text-center shadow-sm">
                  <p className="font-serif text-2xl text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-6 pb-24 pt-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Product Identity</p>
            <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
              Not event software. A wedding home you will actually want to return to.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Calm for couples. Effortless for guests. Beautiful enough to hold memories, not just logistics.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_18px_50px_rgba(186,125,114,0.26)] transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Start your wedding space
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-white/85 px-7 py-3.5 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/20 hover:text-primary"
              >
                Open your existing space
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
