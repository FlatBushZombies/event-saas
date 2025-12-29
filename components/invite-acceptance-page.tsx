"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, CheckCircle, QrCode, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import type { Event, Invite } from "@/lib/types"

interface InviteAcceptancePageProps {
  invite: Invite & { events: Event }
  event: Event
}

export function InviteAcceptancePage({ invite: initialInvite, event }: InviteAcceptancePageProps) {
  const [invite, setInvite] = useState(initialInvite)
  const [loading, setLoading] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [attendeeName, setAttendeeName] = useState(invite.attendee_name || "")
  const [attendeeEmail, setAttendeeEmail] = useState(invite.attendee_email || "")

  const isAccepted = invite.status === "accepted" || invite.status === "scanned"
  const [inviteLink, setInviteLink] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/invite/${invite.invite_code}`)
    }
  }, [invite.invite_code])

  async function handleAccept() {
    if (!attendeeName.trim() && !attendeeEmail.trim()) {
      toast.error("Please provide at least your name or email")
      return
    }

    setAccepting(true)

    try {
      const response = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: invite.invite_code,
          attendeeName: attendeeName.trim() || null,
          attendeeEmail: attendeeEmail.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept invite")
      }

      // Refresh to get updated invite with QR code
      const refreshResponse = await fetch(`/api/invites/${invite.invite_code}`)
      const refreshedInvite = await refreshResponse.json()

      if (refreshResponse.ok) {
        setInvite(refreshedInvite)
        toast.success("Invitation accepted! Your QR code is ready.")
      } else {
        // If refresh fails, update local state
        setInvite({
          ...invite,
          status: "accepted",
          attendee_name: attendeeName.trim() || invite.attendee_name,
          attendee_email: attendeeEmail.trim() || invite.attendee_email,
          accepted_at: new Date().toISOString(),
        })
        toast.success("Invitation accepted!")
      }
    } catch (error) {
      console.error("Accept invite error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to accept invite")
    } finally {
      setAccepting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl mb-2">You're Invited!</CardTitle>
          <p className="text-muted-foreground">Join us for this special event</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">{event.title}</h2>
            {event.description && <p className="text-muted-foreground">{event.description}</p>}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {format(new Date(event.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Acceptance Form or QR Code */}
          {!isAccepted ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Accept Your Invitation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please provide your details to accept the invitation and receive your QR code.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <Button onClick={handleAccept} className="w-full" disabled={accepting} size="lg">
                  {accepting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Invitation Accepted</span>
                </div>
                {invite.attendee_name && (
                  <p className="text-lg font-medium mb-2">Welcome, {invite.attendee_name}!</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Your QR code is ready. Show this at the event for check-in.
                </p>
              </div>

              {/* QR Code */}
              {inviteLink && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-6 rounded-lg border-2 border-primary/20">
                    <QRCodeSVG value={inviteLink} size={256} level="H" />
                  </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Event Check-in QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    Scan this code at the event entrance
                  </p>
                </div>
                </div>
              )}

              {/* Event Info Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <strong>Event:</strong> {event.title}
                </p>
                <p>
                  <strong>Date:</strong> {format(new Date(event.event_date), "PPP 'at' p")}
                </p>
                {event.location && (
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

