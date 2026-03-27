"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CalendarDays, Camera, Check, Heart, MapPinned, Sparkles, Users } from "lucide-react"
import { useFormStatus } from "react-dom"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Step = {
  id: string
  eyebrow: string
  title: string
  copy: string
  cards: Array<{
    label: string
    value: string
    hint: string
  }>
  checklistTitle: string
  checklist: string[]
  note: string
}

const steps: Step[] = [
  {
    id: "setup",
    eyebrow: "Step 1",
    title: "Set up your wedding home",
    copy: "Start with one elegant space for your day, your guests, and your memories.",
    cards: [
      {
        label: "First chapter",
        value: "Wedding day, venue, and timeline",
        hint: "Everything begins in one calm place.",
      },
      {
        label: "Guest flow",
        value: "Invites, seating, and memory sharing",
        hint: "Less texting. More clarity.",
      },
    ],
    checklistTitle: "What you unlock",
    checklist: ["Private guest access", "Timeline and seating clarity", "Beautiful memory collection"],
    note: "Most couples can begin with one chapter and shape the rest as they go.",
  },
  {
    id: "experience",
    eyebrow: "Step 2",
    title: "Make every guest feel guided",
    copy: "One accepted invite should answer the important questions before they are even asked.",
    cards: [
      {
        label: "Before the day",
        value: "Keep updates visible without repeated messages",
        hint: "Share details once, beautifully.",
      },
      {
        label: "During the day",
        value: "Keep seating, memories, and moments connected",
        hint: "Guests always know where to go next.",
      },
    ],
    checklistTitle: "Guests will feel",
    checklist: ["Clear on what happens next", "Confident about where to go", "Part of the story, not lost in logistics"],
    note: "Great wedding software should feel almost invisible to the guest.",
  },
  {
    id: "launch",
    eyebrow: "Step 3",
    title: "Open your dashboard and begin",
    copy: "You are ready to create your first chapter and shape the experience at your own pace.",
    cards: [
      {
        label: "First move",
        value: "Create your main event chapter",
        hint: "Start simple and expand when you need to.",
      },
      {
        label: "What stays with you",
        value: "Future anniversaries and celebrations",
        hint: "Everything remains in one wedding home.",
      },
    ],
    checklistTitle: "Inside your space",
    checklist: ["Create events beautifully", "Manage guest experience calmly", "Keep every memory together"],
    note: "You are one click away from your couple dashboard.",
  },
]

const floatingIcons: Array<{ icon: LucideIcon; className: string }> = [
  { icon: Heart, className: "left-[18%] top-[14%]" },
  { icon: CalendarDays, className: "right-[18%] top-[24%]" },
  { icon: Users, className: "left-[26%] bottom-[22%]" },
  { icon: Camera, className: "right-[24%] bottom-[16%]" },
  { icon: MapPinned, className: "left-[44%] top-[46%]" },
  { icon: Sparkles, className: "right-[42%] bottom-[34%]" },
]

function ProgressHeader({
  stepCount,
  activeStep,
  onBack,
  canGoBack,
}: {
  stepCount: number
  activeStep: number
  onBack: () => void
  canGoBack: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="relative flex items-center gap-3">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />
        {Array.from({ length: stepCount }).map((_, index) => {
          const isActive = index <= activeStep
          return (
            <div
              key={index}
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-300 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(186,125,114,0.22)]"
                  : "border-border bg-white text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FinishOnboardingButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="lg"
      className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-[#c98577] to-[#d4a283] text-sm shadow-[0_18px_45px_rgba(186,125,114,0.22)] hover:opacity-95"
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
  const isLastStep = stepIndex === steps.length - 1
  const canGoBack = stepIndex > 0

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_30%),linear-gradient(180deg,#fbf5ef_0%,#f6eee7_100%)] px-4 py-4 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/55 shadow-[0_35px_120px_rgba(156,120,105,0.14)] backdrop-blur-xl lg:grid-cols-[0.86fr_1.14fr]">
          <section className="relative overflow-hidden bg-[linear-gradient(180deg,#b97871_0%,#c78779_38%,#d79f87_100%)] p-8 text-white sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.08),transparent_35%)]" />

            <div className="relative flex h-full min-h-[18rem] flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur">
                <Heart className="h-3.5 w-3.5" />
                Wedspace
              </div>

              <div className="mt-10 max-w-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-white/70">Private wedding platform</p>
                <h1 className="mt-5 font-serif text-4xl leading-[1.02] sm:text-5xl">
                  Where your wedding
                  <span className="block text-white/80 italic">lives beautifully</span>
                </h1>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/78">
                  Built to keep guests in sync, memories together, and planning calm from the very first chapter.
                </p>
              </div>

              <div className="relative mx-auto mt-10 flex h-[18rem] w-full max-w-md items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, ease: "linear", repeat: Infinity }}
                  className="absolute h-56 w-56 rounded-full border border-white/18"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 32, ease: "linear", repeat: Infinity }}
                  className="absolute h-40 w-40 rounded-full border border-white/12"
                />

                {floatingIcons.map(({ icon: Icon, className }, index) => (
                  <motion.div
                    key={className}
                    className={`absolute ${className} flex h-16 w-16 items-center justify-center rounded-full border border-white/28 bg-white/18 shadow-[0_12px_35px_rgba(73,31,27,0.22)] backdrop-blur-md`}
                    animate={{ y: [0, index % 2 === 0 ? -10 : 10, 0], rotate: [0, index % 2 === 0 ? 8 : -8, 0] }}
                    transition={{ duration: 5 + index * 0.35, ease: "easeInOut", repeat: Infinity }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                ))}

                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/32 bg-white/18 text-center shadow-[0_18px_55px_rgba(73,31,27,0.24)] backdrop-blur-md">
                  <div>
                    <p className="font-serif text-xl">Wed</p>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/75">Home</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto grid gap-3 sm:grid-cols-3">
                {[
                  ["Private", "invite flow"],
                  ["Live", "timeline"],
                  ["Shared", "memories"],
                ].map(([strong, soft]) => (
                  <div key={strong} className="rounded-[1.25rem] border border-white/16 bg-white/10 px-4 py-3 backdrop-blur">
                    <p className="font-serif text-lg text-white">{strong}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/66">{soft}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#fffdfa]/94 p-6 sm:p-8 lg:p-12">
            <div className="mx-auto flex h-full max-w-2xl flex-col">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="w-full max-w-[24rem]">
                  <ProgressHeader
                    stepCount={steps.length}
                    activeStep={stepIndex}
                    onBack={() => setStepIndex((current) => Math.max(0, current - 1))}
                    canGoBack={canGoBack}
                  />
                </div>

                <form action={completeAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="rounded-full px-4 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Skip intro
                  </Button>
                </form>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-10 flex flex-1 flex-col"
                >
                  <div className="max-w-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">{step.eyebrow}</p>
                    <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                      {step.title}
                      {stepIndex === 0 && firstName ? <span className="block text-primary/85 italic">for {firstName}</span> : null}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{step.copy}</p>
                  </div>

                  <div className="mt-8 grid gap-5">
                    {step.cards.map((card) => (
                      <div key={card.label} className="rounded-[1.4rem] border border-border/70 bg-[#fffaf6] p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.label}</p>
                        <div className="mt-3 rounded-xl border border-border/70 bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                          <p className="text-sm font-medium text-foreground sm:text-base">{card.value}</p>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[1.6rem] border border-primary/10 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent p-5">
                    <p className="text-sm font-semibold text-foreground">{step.checklistTitle}</p>
                    <div className="mt-4 grid gap-3">
                      {step.checklist.map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-foreground/88">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-muted-foreground">{step.note}</p>

                  <div className="mt-auto pt-8">
                    {isLastStep ? (
                      <form action={completeAction}>
                        <FinishOnboardingButton />
                      </form>
                    ) : (
                      <Button
                        type="button"
                        size="lg"
                        className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-[#c98577] to-[#d4a283] text-sm shadow-[0_18px_45px_rgba(186,125,114,0.22)] hover:opacity-95"
                        onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
