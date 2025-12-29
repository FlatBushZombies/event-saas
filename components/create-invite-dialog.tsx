"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Copy, Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateInviteDialogProps {
  eventId: string
}

export function CreateInviteDialog({ eventId }: CreateInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const response = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        attendeeName: formData.get("attendeeName"),
        attendeeEmail: formData.get("attendeeEmail"),
      }),
    })

    const data = await response.json()
    setLoading(false)

    if (response.ok) {
      const link = `${window.location.origin}/invite/${data.inviteCode}`
      setInviteLink(link)
      router.refresh()
    }
  }

  function copyToClipboard() {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleClose() {
    setOpen(false)
    setInviteLink(null)
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{inviteLink ? "Invite Created" : "Create New Invite"}</DialogTitle>
          <DialogDescription>
            {inviteLink ? "Share this link with your attendee" : "Enter attendee information"}
          </DialogDescription>
        </DialogHeader>
        {inviteLink ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg break-all text-sm">{inviteLink}</div>
            <Button onClick={copyToClipboard} className="w-full bg-transparent" variant="outline">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attendeeName">Attendee Name</Label>
              <Input id="attendeeName" name="attendeeName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendeeEmail">Attendee Email</Label>
              <Input id="attendeeEmail" name="attendeeEmail" type="email" placeholder="john@example.com" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Invite"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
