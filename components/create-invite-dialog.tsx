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
import { Plus, Copy, Check, Mail, User, Sparkles, Send } from "lucide-react"
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

  useEffect(() => {
    if (!open) {
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
        toast.success("Invite created and email sent!")
      } else {
        toast.success("Invite created successfully!")
      }

      e.currentTarget.reset()
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
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleCreateAnother() {
    setInviteLink(null)
    setInviteData(null)
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          className="gap-2 rounded-full px-5 py-5 font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] rounded-2xl border-border/50 p-0 overflow-hidden">
        {/* Header with decorative element */}
        <div className="relative bg-muted/30 px-6 pt-8 pb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
              {inviteLink ? <Check className="h-5 w-5 text-primary" /> : <Send className="h-5 w-5 text-primary" />}
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-semibold">
                {inviteLink ? "Invitation Sent" : "Send Invitation"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {inviteLink 
                  ? "Share this link with your guest or they'll receive an email" 
                  : "Enter your guest's details to send them an invitation"
                }
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {inviteLink ? (
          <div className="px-6 pb-6 pt-2 space-y-5">
            {inviteData?.emailSent ? (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Email sent successfully
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Your guest will receive the invitation in their inbox.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Invite created</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Share the link below directly. Guests do not need to sign in to accept and join the experience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Invitation Link</Label>
              <div className="p-4 bg-muted/50 rounded-xl border border-border/50 break-all text-sm font-mono">
                {inviteLink}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleCreateAnother} 
                variant="outline"
                className="flex-1 rounded-full h-11 border-border/60"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Another
              </Button>
              <Button 
                onClick={copyToClipboard} 
                className="flex-1 rounded-full h-11 shadow-sm"
              >
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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="attendeeName" className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Guest Name
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input 
                id="attendeeName" 
                name="attendeeName" 
                placeholder="Jane Smith"
                className="rounded-xl border-border/60 focus:border-primary/40 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendeeEmail" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="attendeeEmail"
                name="attendeeEmail"
                type="email"
                placeholder="jane@example.com"
                required
                className="rounded-xl border-border/60 focus:border-primary/40 h-11"
              />
              <p className="text-xs text-muted-foreground pl-1">
                Guests simply open their personal link to access the timeline, guestbook, gallery, votes, and seating.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full h-11 border-border/60"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 rounded-full h-11 shadow-sm"
              >
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
