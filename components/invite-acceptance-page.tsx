"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, ImageIcon, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { MediaGallery } from "@/components/media-gallery"
import { GuestPolls } from "@/components/guest-polls"
import { useRouter } from "next/navigation"
import { WeddingInvitationReveal } from "@/components/wedding-invitation-reveal"

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

  // Set invite link on client side
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
        // Refresh server data without hard reload (keeps animation smooth)
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
      <div className="space-y-6">
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
          <div className="max-w-xl rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-4">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Status: Checked in</p>
          </div>
        )}

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Wedding Polls
            </CardTitle>
            <CardDescription>Vote on fun questions and see what other guests think!</CardDescription>
          </CardHeader>
          <CardContent>
            <GuestPolls eventId={invite.event_id} inviteCode={invite.invite_code} />
          </CardContent>
        </Card>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Event Media
            </CardTitle>
            <CardDescription>Photos and videos shared by the event organizer</CardDescription>
          </CardHeader>
          <CardContent>
            <MediaGallery eventId={invite.event_id} inviteCode={invite.invite_code} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">You're Invited!</CardTitle>
        <CardDescription>{invite.events.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {invite.events.description && <p className="text-sm text-muted-foreground">{invite.events.description}</p>}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(invite.events.event_date), "PPP 'at' p")}</span>
            </div>
            {invite.events.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{invite.events.location}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleAccept} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Accepting..." : "Accept Invitation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
