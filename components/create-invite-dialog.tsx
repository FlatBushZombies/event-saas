"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Plus, Copy, Check, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CreateInviteDialogProps {
  eventId: string
}

export function CreateInviteDialog({ eventId }: CreateInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [inviteData, setInviteData] = useState<{ emailSent?: boolean; emailError?: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  // Debug: Log when component mounts and eventId changes
  useEffect(() => {
    console.log("CreateInviteDialog mounted with eventId:", eventId)
  }, [eventId])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Small delay to allow close animation
      const timer = setTimeout(() => {
        setInviteLink(null)
        setInviteData(null)
        setCopied(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const attendeeEmail = formData.get("attendeeEmail") as string
    const attendeeName = formData.get("attendeeName") as string

    if (!attendeeEmail || !attendeeEmail.trim()) {
      toast.error("Email is required to send an invitation")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          attendeeName: attendeeName || null,
          attendeeEmail: attendeeEmail.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invite")
      }

      const link = `${window.location.origin}/invite/${data.inviteCode}`
      setInviteLink(link)
      setInviteData(data)

      if (data.emailSent) {
        toast.success("Invite created and email sent successfully!")
      } else if (data.emailError === "not_configured") {
        toast.success("Invite created successfully! Email not sent (RESEND_API_KEY not configured)", {
          description: "You can share the invite link manually.",
          duration: 5000,
        })
      } else {
        toast.success("Invite created successfully!", {
          description: data.emailError ? `Email not sent: ${data.emailError}` : "You can share the invite link manually.",
          duration: 5000,
        })
      }

      // Reset form
      e.currentTarget.reset()
      
      // Refresh the page to show new invite in the list
      router.refresh()
    } catch (error) {
      console.error("Create invite error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create invite")
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleOpenChange(newOpen: boolean) {
    console.log("Dialog open state changing to:", newOpen)
    setOpen(newOpen)
  }

  function handleCreateAnother() {
    setInviteLink(null)
    setInviteData(null)
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
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
            {inviteData?.emailSent ? (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Invitation email sent!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      The attendee will receive an email with the invitation link.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Invite created successfully!
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Email not sent (RESEND_API_KEY not configured). Share the link below manually.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-muted rounded-lg break-all text-sm">{inviteLink}</div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1 bg-transparent" variant="outline">
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
              <Button onClick={handleCreateAnother} variant="outline" className="bg-transparent">
                Create Another
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attendeeName">Attendee Name</Label>
              <Input id="attendeeName" name="attendeeName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendeeEmail">
                Attendee Email <span className="text-muted-foreground">(required for email invite)</span>
              </Label>
              <Input
                id="attendeeEmail"
                name="attendeeEmail"
                type="email"
                placeholder="john@example.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                An invitation email with a link will be sent to this address
              </p>
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
