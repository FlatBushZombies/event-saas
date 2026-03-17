"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Sparkles, Heart } from "lucide-react"

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
    const t1 = window.setTimeout(() => setPhase("opening"), 600)
    const t2 = window.setTimeout(() => setPhase("revealed"), 2000)
    const t3 = window.setTimeout(() => onDone?.(), 3500)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [onDone])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-serif italic">
          <Sparkles className="h-4 w-4" />
          <span>Your Invitation Awaits</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="bg-transparent rounded-full border-primary/30 text-primary hover:bg-primary/5 font-serif"
          onClick={() => {
            setPhase("revealed")
            onDone?.()
          }}
        >
          Skip Animation
        </Button>
      </div>

      {/* Main envelope container */}
      <div className="relative flex items-center justify-center min-h-[520px] sm:min-h-[600px] w-full overflow-hidden rounded-3xl">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
        </div>

        {/* Floating sparkles */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            phase === "opening" ? "opacity-100" : "opacity-0"
          }`}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${1000 + Math.random() * 1000}ms`,
              }}
            />
          ))}
        </div>

        {/* THE ENVELOPE */}
        <div
          className="relative w-full max-w-md mx-auto px-4 sm:px-0"
          style={{ perspective: "1200px" }}
        >
          {/* Envelope shadow */}
          <div
            className={`absolute inset-x-4 -bottom-4 h-8 bg-black/10 rounded-full blur-xl transition-all duration-1000 ${
              phase === "revealed" ? "opacity-0 scale-75" : "opacity-100"
            }`}
          />

          {/* Envelope body */}
          <div
            className={`relative transition-all duration-1000 ease-out ${
              phase === "revealed" ? "opacity-0 scale-90 translate-y-10" : "opacity-100"
            }`}
          >
            {/* Back of envelope */}
            <div
              className="relative bg-gradient-to-b from-[#f5ebe0] to-[#ede0d4] rounded-lg shadow-xl overflow-hidden"
              style={{ aspectRatio: "1.5/1" }}
            >
              {/* Envelope texture lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>

              {/* Inner card (peeking out) */}
              <div
                className={`absolute left-4 right-4 bg-white rounded-t-lg shadow-md transition-all duration-1000 ease-out ${
                  phase === "sealed"
                    ? "bottom-8 h-20"
                    : phase === "opening"
                    ? "bottom-16 h-48"
                    : "bottom-32 h-64"
                }`}
                style={{
                  transformOrigin: "bottom center",
                }}
              >
                {/* Card content preview */}
                <div className="p-4 text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    You're Invited
                  </p>
                </div>
              </div>

              {/* Envelope front bottom flap */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/2"
                style={{
                  background: "linear-gradient(to top, #e6ccb2 0%, #ddb892 100%)",
                  clipPath: "polygon(0 100%, 50% 30%, 100% 100%)",
                }}
              />

              {/* Envelope front left flap */}
              <div
                className="absolute bottom-0 left-0 w-1/2 h-full"
                style={{
                  background: "linear-gradient(to right, #d4a373 0%, transparent 100%)",
                  clipPath: "polygon(0 100%, 0 40%, 100% 100%)",
                  opacity: 0.6,
                }}
              />

              {/* Envelope front right flap */}
              <div
                className="absolute bottom-0 right-0 w-1/2 h-full"
                style={{
                  background: "linear-gradient(to left, #d4a373 0%, transparent 100%)",
                  clipPath: "polygon(100% 100%, 100% 40%, 0 100%)",
                  opacity: 0.6,
                }}
              />
            </div>

            {/* TOP FLAP - Animated opening */}
            <div
              className={`absolute top-0 left-0 right-0 transition-all ease-out ${
                phase === "sealed"
                  ? "duration-500"
                  : phase === "opening"
                  ? "duration-1000"
                  : "duration-500"
              }`}
              style={{
                transformOrigin: "top center",
                transform:
                  phase === "sealed"
                    ? "rotateX(0deg)"
                    : phase === "opening"
                    ? "rotateX(160deg)"
                    : "rotateX(180deg)",
                zIndex: phase === "sealed" ? 10 : 0,
              }}
            >
              <div
                className="bg-gradient-to-b from-[#e6ccb2] to-[#ddb892] shadow-lg"
                style={{
                  aspectRatio: "3/1.1",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                }}
              >
                {/* Wax seal */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-2 w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center transition-opacity duration-500 ${
                    phase !== "sealed" ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              {/* Flap back side (visible when opened) */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#f5ebe0] to-[#ede0d4]"
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>

            {/* Decorative postage stamp */}
            <div className="absolute top-4 right-4 w-12 h-14 bg-white rounded-sm shadow-sm border border-border/50 flex items-center justify-center z-20">
              <div className="w-8 h-10 bg-primary/10 rounded-sm flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Address lines */}
            <div className="absolute bottom-12 left-8 space-y-1.5 z-5">
              <div className="w-24 h-1.5 bg-primary/20 rounded-full" />
              <div className="w-32 h-1.5 bg-primary/20 rounded-full" />
              <div className="w-20 h-1.5 bg-primary/20 rounded-full" />
            </div>
          </div>

          {/* REVEALED INVITATION CARD */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              phase === "revealed"
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-20 scale-95 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden w-full">
              {/* Decorative top border */}
              <div className="h-2 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

              {/* Card content */}
              <div className="p-5 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-2">
                    You Are Cordially Invited
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground text-balance">
                    {title}
                  </h2>
                  {attendeeName && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Dear <span className="font-medium text-foreground italic">{attendeeName}</span>,
                      <br />
                      <span className="text-xs">We cannot wait to celebrate with you.</span>
                    </p>
                  )}
                </div>

                {/* Decorative divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <Sparkles className="w-4 h-4 text-primary/50" />
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Event details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Date & Time
                      </p>
                      <p className="text-sm font-medium text-foreground text-pretty">{dateLabel}</p>
                    </div>
                  </div>

                  {location && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Venue
                        </p>
                        <p className="text-sm font-medium text-foreground text-pretty">{location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Code section */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 border border-border/50">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-medium text-foreground">Your Check-in QR Code</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Present this on the wedding day for easy check-in.
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-border">
                      {inviteLink ? (
                        <QRCodeSVG value={inviteLink} size={96} level="H" />
                      ) : (
                        <div className="w-[96px] h-[96px] bg-muted animate-pulse rounded" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer tip */}
                <p className="mt-5 text-center text-xs text-muted-foreground italic">
                  Share photos and participate in wedding polls below
                </p>
              </div>

              {/* Decorative bottom border */}
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Confetti on reveal */}
        {phase === "revealed" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  backgroundColor:
                    i % 3 === 0
                      ? "hsl(var(--primary) / 0.5)"
                      : i % 3 === 1
                      ? "hsl(var(--accent) / 0.7)"
                      : "hsl(var(--muted-foreground) / 0.3)",
                  animationDelay: `${i * 50}ms`,
                  animationDuration: `${800 + Math.random() * 400}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
