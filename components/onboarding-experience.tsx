"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CalendarDays, Camera, Clock3, Heart, Sparkles, Users } from "lucide-react"
import { useFormStatus } from "react-dom"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Step = {
  id: string
  eyebrow: string
  title: string
  copy: string
  previewEyebrow: string
  previewTitle: string
  previewBadge: string
  metrics: Array<{ value: string; label: string }>
  highlights: Array<{ icon: LucideIcon; title: string; copy: string }>
  sideNotes: Array<{ title: string; copy: string }>
  footer: string
}

const steps: Step[] = [
  {
    id: "welcome",
    eyebrow: "First Login",
    title: "Your wedding home is ready",
    copy:
      "Wedspace brings planning, guest flow, and memory keeping into one calm space so your first steps feel clear instead of overwhelming.",
    previewEyebrow: "Private Workspace",
    previewTitle: "Everything meaningful lives together from day one.",
    previewBadge: "Couple view",
    metrics: [
      { value: "Create", label: "your first chapter" },
      { value: "Invite", label: "guests beautifully" },
      { value: "Collect", label: "memories in one place" },
    ],
    highlights: [
      {
        icon: Sparkles,
        title: "A softer starting point",
        copy: "You do not need to configure everything at once. Start with one event and build from there.",
      },
      {
        icon: CalendarDays,
        title: "Planning that feels guided",
        copy: "Your dashboard is organized around real wedding moments, not generic admin clutter.",
      },
      {
        icon: Users,
        title: "Built for guests too",
        copy: "Invites, seating, schedules, and memories are made to feel effortless on the other side as well.",
      },
    ],
    sideNotes: [
      {
        title: "What you will do first",
        copy: "Create your main wedding event, set the date and location, then start inviting guests when you are ready.",
      },
      {
        title: "What guests will feel",
        copy: "One invite link opens a clear, polished experience instead of a confusing chain of messages and reminders.",
      },
    ],
    footer: "Most couples can get their first chapter set up in just a few minutes.",
  },
  {
    id: "guest-flow",
    eyebrow: "Guest Experience",
    title: "Guests should never wonder where to click next",
    copy:
      "The invite experience is designed to feel intuitive. Once a guest is in, they can keep up with the timeline, find their seat, and share the day as it unfolds.",
    previewEyebrow: "Guest Journey",
    previewTitle: "One accepted invite becomes a clear path through the celebration.",
    previewBadge: "Guest view",
    metrics: [
      { value: "1", label: "invite link" },
      { value: "Live", label: "timeline updates" },
      { value: "Private", label: "memory sharing" },
    ],
    highlights: [
      {
        icon: Clock3,
        title: "Timeline clarity",
        copy: "Ceremony, reception, and key moments can stay visible so people know what is happening next.",
      },
      {
        icon: Users,
        title: "Less repeated texting",
        copy: "Seating and event details live in the experience instead of being resent over and over in chats.",
      },
      {
        icon: Camera,
        title: "Memories stay connected",
        copy: "Photos and videos come back into the same space instead of getting buried in scattered apps.",
      },
    ],
    sideNotes: [
      {
        title: "During the day",
        copy: "Guests can move from acceptance to timeline, media, guestbook, and polls without needing a tutorial.",
      },
      {
        title: "After the day",
        copy: "The same event becomes a place to revisit memories instead of a tool you stop caring about the next morning.",
      },
    ],
    footer: "A good onboarding flow is not just for you. It sets the tone for every guest interaction after this.",
  },
  {
    id: "next-steps",
    eyebrow: "Ready To Begin",
    title: "Start with the wedding day and let the story grow",
    copy:
      "You can begin with one celebration now and keep future chapters like anniversaries or vow renewals in the same account later.",
    previewEyebrow: "Next Steps",
    previewTitle: "We will take you straight into the dashboard once you are ready.",
    previewBadge: "All set",
    metrics: [
      { value: "Wedding Day", label: "your first chapter" },
      { value: "Anniversary", label: "future-ready" },
      { value: "Archive", label: "memories preserved" },
    ],
    highlights: [
      {
        icon: Heart,
        title: "Create the chapter",
        copy: "Start with your main event so the dashboard has a real place for planning, details, and guest experience.",
      },
      {
        icon: Sparkles,
        title: "Shape the experience",
        copy: "Add invites, timeline moments, seating, and media only when each one becomes useful to you.",
      },
      {
        icon: CalendarDays,
        title: "Keep the story together",
        copy: "Later chapters can stay connected to the same wedding home instead of starting from scratch each time.",
      },
    ],
    sideNotes: [
      {
        title: "Inside the dashboard",
        copy: "You will land on your couple home where you can create events, see your chapters, and start building the experience.",
      },
      {
        title: "When you click through",
        copy: "We will mark onboarding as complete so future logins go directly to /dashboard.",
      },
    ],
    footer: "You are one click away from the dashboard.",
  },
]

function FinishOnboardingButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="lg"
      className="h-12 rounded-full px-6 text-sm shadow-[0_18px_50px_rgba(186,125,114,0.22)]"
      disabled={pending}
    >
      {pending ? "Opening dashboard..." : "Open dashboard"}
      <ArrowRight className="h-4 w-4" />
    </Button>
  )
}

interface OnboardingExperienceProps {
  firstName?: string | null
  completeAction: (formData: FormData) => Promise<void>
}

export function OnboardingExperience({ firstName, completeAction }: OnboardingExperienceProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1
  const greeting = firstName ? `, ${firstName}` : ""

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcf7f2] px-4 py-4 text-foreground sm:px-6 sm:py-6">
      <motion.div
        aria-hidden
        className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(214,149,136,0.16),transparent_68%)] blur-3xl"
        animate={{ x: [0, 22, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[-7rem] top-[18%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(148,166,132,0.14),transparent_68%)] blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-9rem] left-[16%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(215,180,141,0.18),transparent_70%)] blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-[0_35px_120px_rgba(156,120,105,0.14)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-[#fffaf6]/90 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Wedspace</p>
              <h1 className="font-serif text-2xl text-foreground">Welcome aboard</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {steps.map((entry, index) => (
              <div
                key={entry.id}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === stepIndex ? "w-10 bg-primary" : index < stepIndex ? "w-6 bg-primary/45" : "w-6 bg-primary/12"
                }`}
              />
            ))}

            <form action={completeAction} className="ml-0 sm:ml-3">
              <Button
                type="submit"
                variant="ghost"
                className="rounded-full px-4 text-sm text-muted-foreground hover:bg-white hover:text-foreground"
              >
                Skip intro
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="flex min-h-[28rem] flex-col rounded-[1.8rem] border border-white/75 bg-[#fffaf6]/88 p-6 shadow-sm sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-1 flex-col"
              >
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  {step.eyebrow}
                </div>

                <div className="mt-8">
                  <h2 className="text-balance font-serif text-4xl leading-[1.02] tracking-tight text-foreground sm:text-5xl">
                    {step.title}
                    {step.id === "welcome" ? <span className="text-primary/80 italic">{greeting}</span> : null}
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{step.copy}</p>
                </div>

                <div className="mt-8 grid gap-4">
                  {step.highlights.map((highlight, index) => {
                    const Icon = highlight.icon

                    return (
                      <motion.div
                        key={highlight.title}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.35 }}
                        className="rounded-[1.5rem] border border-border/60 bg-white/92 p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-foreground">{highlight.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{highlight.copy}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="mt-8 rounded-[1.6rem] border border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">What happens next</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">{step.footer}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Step {stepIndex + 1} of {steps.length}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-full px-5"
                  onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                  disabled={isFirstStep}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                {isLastStep ? (
                  <form action={completeAction}>
                    <FinishOnboardingButton />
                  </form>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    className="h-12 rounded-full px-6 shadow-[0_18px_50px_rgba(186,125,114,0.22)]"
                    onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[1.8rem] border border-white/75 bg-[#fff8f2]/90 p-6 shadow-[0_22px_80px_rgba(156,120,105,0.12)] sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,125,114,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(148,166,132,0.14),transparent_34%)]" />

            <motion.div
              aria-hidden
              className="absolute right-6 top-6 hidden rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-medium text-primary shadow-sm lg:flex"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              First login experience
            </motion.div>

            <motion.div
              aria-hidden
              className="absolute bottom-8 left-8 hidden rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-medium text-foreground shadow-sm lg:flex"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            >
              Redirects to /dashboard after completion
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${step.id}-preview`}
                initial={{ opacity: 0, scale: 0.98, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">{step.previewEyebrow}</p>
                    <h3 className="mt-4 max-w-xl font-serif text-3xl text-foreground sm:text-4xl">{step.previewTitle}</h3>
                  </div>

                  <div className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-xs font-medium text-primary shadow-sm">
                    {step.previewBadge}
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {step.metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.35 }}
                      className="rounded-[1.4rem] border border-border/60 bg-white/92 p-4 shadow-sm"
                    >
                      <p className="font-serif text-2xl text-foreground">{metric.value}</p>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">{metric.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.7rem] border border-border/60 bg-white/94 p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Inside Wedspace</p>
                        <h4 className="mt-2 font-serif text-2xl text-foreground">What this space helps you do</h4>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Heart className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {step.highlights.map((highlight) => {
                        const Icon = highlight.icon

                        return (
                          <div
                            key={highlight.title}
                            className="flex items-start gap-3 rounded-[1.2rem] border border-border/60 bg-[#fffdfa] px-4 py-3"
                          >
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{highlight.title}</p>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{highlight.copy}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {step.sideNotes.map((note) => (
                      <motion.div
                        key={note.title}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-[1.7rem] border border-border/60 bg-gradient-to-br from-white to-primary/6 p-5 shadow-sm"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{note.title}</p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note.copy}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  )
}
