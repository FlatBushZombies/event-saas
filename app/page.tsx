"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
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

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  {
    icon: Heart,
    title: "Elegant, never corporate",
    copy: "Every screen should feel like part of the celebration, not another admin tool.",
  },
  {
    icon: Clock3,
    title: "Stress down, clarity up",
    copy: "One calm place for invites, seating, memories, polls, and timelines.",
  },
  {
    icon: BookHeart,
    title: "Memories preserved beautifully",
    copy: "Your wedding story should still feel alive long after the day ends.",
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
    copy: "Anniversaries, vow renewals, and second celebrations can stay connected to the same home.",
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
    <div
      data-showcase-shell
      className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/72 p-4 shadow-[0_38px_130px_rgba(156,120,105,0.2)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,125,114,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(148,166,132,0.12),transparent_30%)]" />
      <div className="relative grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[1.85rem] border border-border/60 bg-[#fffdfb] p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Wedding Home</p>
              <h3 className="mt-3 text-3xl font-serif text-foreground">Amara & Daniel</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                The calm center for your wedding day, your guests, and every chapter after.
              </p>
            </div>
            <div className="rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-xs font-medium text-primary shadow-sm">
              Couple dashboard
            </div>
          </div>

          <div data-stagger-group className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["142", "Guests invited"],
              ["12", "Timeline moments"],
              ["368", "Memories shared"],
            ].map(([value, label]) => (
              <div
                key={label}
                data-stagger-item
                className="rounded-[1.4rem] border border-border/60 bg-white p-4 shadow-[0_12px_30px_rgba(92,61,49,0.06)]"
              >
                <p className="text-3xl font-serif text-foreground">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.55rem] border border-primary/10 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Next moment</p>
                <p className="mt-2 text-xl font-serif text-foreground">Ceremony begins at 3:00 PM</p>
                <p className="mt-2 text-sm text-muted-foreground">Guests see this instantly in their accepted invite experience.</p>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm sm:flex">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.8rem] border border-border/60 bg-[#fffdfb] p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Guest flow</p>
            <div data-stagger-group className="mt-4 space-y-3">
              {["Accept invite", "See ceremony timeline", "Find table assignment", "Vote and share memories"].map((item) => (
                <div
                  key={item}
                  data-stagger-item
                  className="flex items-center gap-3 rounded-full border border-border/60 bg-white px-4 py-3 text-sm text-foreground shadow-sm"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-border/60 bg-[#fffdfb] p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">After the wedding</p>
            <p className="mt-3 text-lg font-serif text-foreground">Create an anniversary chapter</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Keep the same space alive for anniversaries, vow renewals, or another celebration that deserves the same care.
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-5 top-12 hidden rounded-[1.2rem] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_18px_45px_rgba(92,61,49,0.12)] backdrop-blur lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Guest calm</p>
        <p className="mt-1 text-sm text-foreground">One link. Clear next steps.</p>
      </div>

      <div className="pointer-events-none absolute -bottom-4 right-10 hidden rounded-[1.2rem] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_18px_45px_rgba(92,61,49,0.12)] backdrop-blur lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Memory mode</p>
        <p className="mt-1 text-sm text-foreground">Photos stay inside the story.</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const ctx = gsap.context(() => {
      const heroTitleParts = gsap.utils.toArray<HTMLElement>("[data-hero-title-part]")
      const heroActionItems = gsap.utils.toArray<HTMLElement>("[data-hero-actions] > *")
      const heroStats = gsap.utils.toArray<HTMLElement>("[data-hero-stats] > *")

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-badge]", { y: 24, opacity: 0, duration: 0.65 })
        .from(heroTitleParts, { y: 42, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.28")
        .from("[data-hero-copy]", { y: 24, opacity: 0, duration: 0.65 }, "-=0.4")
        .from(heroActionItems, { y: 18, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35")
        .from(heroStats, { y: 18, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35")
        .from("[data-showcase-shell]", { x: 42, opacity: 0, scale: 0.97, duration: 0.9 }, "-=0.65")

      gsap.to("[data-orb='left']", {
        yPercent: -18,
        xPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-section]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to("[data-orb='right']", {
        yPercent: 16,
        xPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-section]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to("[data-orb='bottom']", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to("[data-showcase-shell]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-section]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
            },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>("[data-stagger-group]").forEach((group) => {
        const items = Array.from(group.querySelectorAll<HTMLElement>("[data-stagger-item]"))
        if (items.length === 0) return

        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              once: true,
            },
          }
        )
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden bg-[#fcf7f2] text-foreground">
      <Navbar />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            data-orb="left"
            className="absolute left-[-10%] top-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,149,136,0.16),transparent_65%)] blur-3xl"
          />
          <div
            data-orb="right"
            className="absolute right-[-6%] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(186,125,114,0.14),transparent_65%)] blur-3xl"
          />
          <div
            data-orb="bottom"
            className="absolute bottom-[10rem] left-[14%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(148,166,132,0.1),transparent_65%)] blur-3xl"
          />
        </div>

        <section data-hero-section className="relative px-6 pb-20 pt-34">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-[0.96fr_1.04fr]">
              <div className="max-w-2xl">
                <div
                  data-hero-badge
                  className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm backdrop-blur"
                >
                  <Heart className="h-3.5 w-3.5" />
                  A private digital wedding experience
                </div>

                <h1 className="mt-8 text-balance font-serif text-5xl leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  <span data-hero-title-part className="block">
                    Where your wedding lives
                  </span>
                  <span data-hero-title-part className="block text-primary/82 italic">
                    before, during, and forever after.
                  </span>
                </h1>

                <p data-hero-copy className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Wedspace gives couples one elegant home for invites, timelines, seating, memories, and guest experience,
                  without turning wedding planning into another stressful software project.
                </p>

                <blockquote className="mt-8 max-w-xl rounded-[1.8rem] border border-white/75 bg-white/78 p-5 text-base leading-relaxed text-foreground shadow-sm backdrop-blur">
                  This is not a generic event SaaS. It is a wedding home designed to feel calm, intimate, and worth revisiting.
                </blockquote>

                <div data-hero-actions className="mt-8 flex flex-col gap-3 sm:flex-row">
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

                <div data-hero-stats className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Zero-friction", "guest experience"],
                    ["Emotional value", "over feature overload"],
                    ["Second event ready", "anniversary or more"],
                  ].map(([strong, soft]) => (
                    <div
                      key={strong}
                      className="rounded-[1.4rem] border border-border/60 bg-white/78 p-4 shadow-[0_16px_40px_rgba(92,61,49,0.06)] backdrop-blur"
                    >
                      <p className="font-serif text-xl text-foreground">{strong}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{soft}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 inline-flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-px w-12 bg-border" />
                  Scroll to feel the experience unfold
                </div>
              </div>

              <ShowcaseCard />
            </div>
          </div>
        </section>

        <section id="experience" data-reveal className="relative px-6 py-22">
          <div className="mx-auto max-w-7xl rounded-[2.3rem] border border-white/75 bg-white/72 p-8 shadow-[0_24px_90px_rgba(156,120,105,0.1)] backdrop-blur sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Product Principles</p>
              <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
                Made to reduce stress, preserve beauty, and keep the whole experience human.
              </h2>
            </div>

            <div data-stagger-group className="mt-12 grid gap-5 lg:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    data-stagger-item
                    className="rounded-[1.9rem] border border-white/70 bg-[#fffdfb] p-7 shadow-[0_18px_60px_rgba(156,120,105,0.08)]"
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

        <section id="how-it-works" data-reveal className="relative px-6 py-22">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">How It Lives</p>
                <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
                  Every chapter should feel connected, not stitched together.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Planning, the live wedding day, and the memory archive all belong to the same story.
              </p>
            </div>

            <div data-stagger-group className="grid gap-6 lg:grid-cols-3">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.title}
                  data-stagger-item
                  className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/84 p-7 shadow-[0_14px_50px_rgba(92,61,49,0.08)]"
                >
                  <div className="absolute inset-x-7 top-7 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                  <div className="absolute right-6 top-5 font-serif text-6xl text-primary/10">{index + 1}</div>
                  <p className="pt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">{chapter.eyebrow}</p>
                  <h3 className="mt-4 max-w-xs font-serif text-3xl text-foreground">{chapter.title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{chapter.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" data-reveal className="relative px-6 py-22">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Why It Feels Different</p>
                <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
                  One wedding home for the couple, one graceful flow for every guest.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                  The best wedding software quietly organizes the experience, makes guests feel taken care of, and keeps the memories beautiful long after the day ends.
                </p>
              </div>

              <div data-stagger-group className="grid gap-5 sm:grid-cols-2">
                {experienceCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      data-stagger-item
                      className="rounded-[1.9rem] border border-border/60 bg-gradient-to-br from-white to-primary/5 p-6 shadow-[0_16px_45px_rgba(92,61,49,0.08)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-serif text-2xl text-foreground">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.copy}</p>
                    </div>
                  )
                })}

                <div
                  data-stagger-item
                  className="rounded-[1.9rem] border border-primary/10 bg-primary p-6 text-primary-foreground shadow-[0_18px_60px_rgba(186,125,114,0.24)] sm:col-span-2"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-foreground/80">Guest Trust</p>
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

        <section data-reveal className="relative px-6 py-24">
          <div className="mx-auto max-w-5xl rounded-[2.4rem] border border-white/75 bg-white/80 p-8 shadow-[0_25px_90px_rgba(156,120,105,0.12)] backdrop-blur sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Beyond the wedding day</p>
            <h2 className="mt-4 text-balance font-serif text-4xl text-foreground sm:text-5xl">
              When the couple creates a second event, it should feel like the next chapter, not a restart.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Welcome dinner. Anniversary weekend. Vow renewal. Another family celebration. Wedspace keeps every future moment connected to the same love story.
            </p>

            <div data-stagger-group className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Wedding Day", "Anniversary Dinner", "Forever Archive"].map((item) => (
                <div
                  key={item}
                  data-stagger-item
                  className="rounded-[1.5rem] border border-border/60 bg-[#fffdfc] px-4 py-5 text-center shadow-sm"
                >
                  <p className="font-serif text-2xl text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-reveal className="relative px-6 pb-24 pt-6">
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
