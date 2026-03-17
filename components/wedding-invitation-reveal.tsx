"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Sparkles, CheckCircle2 } from "lucide-react"

interface WeddingInvitationRevealProps {
  title: string
  eventDateISO: string
  location?: string
  attendeeName?: string
  inviteLink?: string
  onDone?: () => void
}

export function WeddingInvitationReveal({
  title,
  eventDateISO,
  location,
  attendeeName,
  inviteLink,
  onDone,
}: WeddingInvitationRevealProps) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealed">("sealed")

  const dateLabel = useMemo(() => {
    const d = new Date(eventDateISO)
    return Number.isFinite(d.getTime()) ? format(d, "PPP 'at' p") : eventDateISO
  }, [eventDateISO])

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("opening"), 300)
    const t2 = window.setTimeout(() => setPhase("revealed"), 1150)
    const t3 = window.setTimeout(() => onDone?.(), 2400)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [onDone])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Invitation</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="bg-transparent"
          onClick={() => {
            setPhase("revealed")
            onDone?.()
          }}
        >
          Skip
        </Button>
      </div>

      {/* Envelope + reveal stage */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        {/* soft decorative background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(900px 400px at 10% 0%, rgba(99,102,241,0.16), transparent 60%), radial-gradient(700px 400px at 90% 20%, rgba(59,130,246,0.16), transparent 60%), radial-gradient(600px 300px at 50% 110%, rgba(234,88,12,0.10), transparent 60%)",
          }}
        />

        <div className="relative p-6 sm:p-10">
          {/* Envelope front */}
          <div
            className={[
              "mx-auto max-w-xl",
              "rounded-3xl border border-border bg-background/60 backdrop-blur-sm shadow-sm",
              "transition-all duration-700",
              phase === "sealed" ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">RSVP accepted</p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-balance">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">Opening your invitation…</p>
              <div className="mt-6 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-2/3 bg-primary animate-in slide-in-from-left-8 duration-1000" />
              </div>
            </div>
          </div>

          {/* Invitation card */}
          <div
            className={[
              "mx-auto max-w-xl",
              "rounded-3xl border border-border bg-white shadow-lg",
              "transition-all duration-700",
              phase === "revealed"
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-[0.98] pointer-events-none",
              "animate-in fade-in-0 zoom-in-95",
            ].join(" ")}
          >
            <div className="p-6 sm:p-10">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">You’re invited</p>
                <h3 className="text-3xl sm:text-4xl font-bold mt-2 text-balance">{title}</h3>
                {attendeeName ? (
                  <p className="text-sm text-muted-foreground mt-2">
                    Dear <span className="font-medium text-foreground">{attendeeName}</span>, we can’t wait to celebrate with you.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">We can’t wait to celebrate with you.</p>
                )}
              </div>

              <div className="mt-8 grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="mt-0.5 h-9 w-9 rounded-xl bg-white border border-border flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date & time</p>
                    <p className="text-sm text-muted-foreground">{dateLabel}</p>
                  </div>
                </div>

                {location ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="mt-0.5 h-9 w-9 rounded-xl bg-white border border-border flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{location}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-background/60 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Your check‑in QR</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Save this screen or come back to this link on the day.
                    </p>
                  </div>
                  <div className="flex justify-center sm:justify-end">
                    {inviteLink ? (
                      <QRCodeSVG value={inviteLink} size={132} level="H" includeMargin />
                    ) : (
                      <div className="h-[132px] w-[132px] rounded-xl bg-muted animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                Tip: share photos and vote in wedding polls below.
              </div>
            </div>
          </div>

          {/* Subtle confetti sparkles */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0",
              phase === "opening" ? "opacity-100" : "opacity-0",
              "transition-opacity duration-700",
            ].join(" ")}
          >
            <div className="absolute left-6 top-10 h-2 w-2 rounded-full bg-primary/50 animate-in fade-in-0 zoom-in-95 duration-500" />
            <div className="absolute right-10 top-14 h-2.5 w-2.5 rounded-full bg-blue-500/40 animate-in fade-in-0 zoom-in-95 duration-700" />
            <div className="absolute left-12 bottom-14 h-1.5 w-1.5 rounded-full bg-orange-500/40 animate-in fade-in-0 zoom-in-95 duration-700" />
            <div className="absolute right-16 bottom-10 h-1.5 w-1.5 rounded-full bg-primary/40 animate-in fade-in-0 zoom-in-95 duration-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

