"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, ImageIcon, BarChart3, Heart, Sparkles, BookHeart } from "lucide-react"
import { format } from "date-fns"
import { MediaGallery } from "@/components/media-gallery"
import { GuestPolls } from "@/components/guest-polls"
import { useRouter } from "next/navigation"
import { WeddingInvitationReveal } from "@/components/wedding-invitation-reveal"
import { Guestbook } from "@/components/guestbook"

interface InviteAcceptanceProps {
  invite: {
    id: string
    event_id: string
    invite_code: string
    status: string
    attendee_name?: string
    attendee_email?: string
    events: {
      title: string
      description?: string
      location?: string
      event_date: string
    }
  }
}

export function InviteAcceptance({ invite }: InviteAcceptanceProps) {
  const [status, setStatus] = useState(invite.status)
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string>("")
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: invite.attendee_name || "",
    email: invite.attendee_email || "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/invite/${invite.invite_code}`)
    }
  }, [invite.invite_code])

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: invite.invite_code,
          attendeeName: formData.name,
          attendeeEmail: formData.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("accepted")
        router.refresh()
      } else {
        alert(data.error || "Failed to accept invitation")
      }
    } catch (error) {
      console.error("Accept invite error:", error)
      alert("Failed to accept invitation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "accepted" || status === "scanned") {
    return (
      <div className="space-y-8">
        <WeddingInvitationReveal
          title={invite.events.title}
          eventDateISO={invite.events.event_date}
          location={invite.events.location}
          attendeeName={invite.attendee_name || formData.name}
          inviteLink={inviteLink}
          onDone={() => {
            try {
              window.sessionStorage.setItem(`invite-reveal-seen:${invite.invite_code}`, "1")
            } catch {
              // ignore
            }
          }}
        />

        {status === "scanned" && (
          <div className="max-w-xl mx-auto">
            <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-serif font-medium text-green-800">Successfully Checked In</p>
                  <p className="text-sm text-green-700/80">Welcome to the celebration!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wedding Polls Card */}
        <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 font-serif text-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <span>Wedding Polls</span>
            </CardTitle>
            <CardDescription className="font-serif italic">
              Vote on fun questions and see what other guests think!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GuestPolls eventId={invite.event_id} inviteCode={invite.invite_code} />
          </CardContent>
        </Card>

        {/* Guestbook Card */}
        <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 font-serif text-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookHeart className="h-5 w-5 text-primary" />
              </div>
              <span>Digital Guestbook</span>
            </CardTitle>
            <CardDescription className="font-serif italic">
              Leave a personal message and export it as a keepsake PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Guestbook
              mode="guest"
              eventId={invite.event_id}
              inviteCode={invite.invite_code}
              attendeeName={invite.attendee_name || formData.name}
            />
          </CardContent>
        </Card>

        {/* Media Gallery Card */}
        <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 font-serif text-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <span>Event Media</span>
            </CardTitle>
            <CardDescription className="font-serif italic">
              Photos and videos shared by the event organizer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaGallery eventId={invite.event_id} inviteCode={invite.invite_code} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pre-acceptance view - Premium invitation card
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="relative border-border/50 shadow-2xl overflow-hidden">
        {/* Top decorative border */}
        <div className="h-2 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/20 rounded-br-xl" />

        <CardHeader className="text-center pb-4 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-2">
            You Are Cordially Invited
          </p>
          <CardTitle className="text-2xl sm:text-3xl font-serif font-medium text-balance">
            {invite.events.title}
          </CardTitle>
          {invite.events.description && (
            <CardDescription className="font-serif italic mt-2">
              {invite.events.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8">
          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <Sparkles className="w-4 h-4 text-primary/50" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Event details */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date & Time
                </p>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(invite.events.event_date), "PPP 'at' p")}
                </p>
              </div>
            </div>

            {invite.events.location && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Venue
                  </p>
                  <p className="text-sm font-medium text-foreground">{invite.events.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* RSVP Form */}
          <form onSubmit={handleAccept} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
                className="rounded-xl border-border/50 bg-muted/30 focus:bg-white transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="rounded-xl border-border/50 bg-muted/30 focus:bg-white transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Accepting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Accept Invitation
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground italic">
            We cannot wait to celebrate with you
          </p>
        </CardContent>

        {/* Bottom decorative border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </Card>
    </div>
  )
}
