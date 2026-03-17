"use client"

import { useMemo, useRef, useState } from "react"
import useSWR from "swr"
import type { GuestbookEntry } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { exportElementToPdf } from "@/lib/pdf"
import { Download, Loader2, BookHeart, ImagePlus, RefreshCw, Heart, Feather } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type GuestbookProps = {
  eventId: string
  inviteCode?: string
  mode: "guest" | "owner"
  attendeeName?: string
}

export function Guestbook({ eventId, inviteCode, mode, attendeeName }: GuestbookProps) {
  const canWrite = mode === "guest" && !!inviteCode
  const { data, error, mutate } = useSWR(
    mode === "guest" ? `/api/guestbook?eventId=${eventId}&inviteCode=${inviteCode}` : `/api/guestbook?eventId=${eventId}`,
    fetcher
  )

  const entries: GuestbookEntry[] = data?.entries || []
  const myEntry = useMemo(() => {
    if (!attendeeName) return null
    return entries.find((e) => (e.attendee_name || "").toLowerCase() === attendeeName.toLowerCase()) || null
  }, [attendeeName, entries])

  const [message, setMessage] = useState(myEntry?.message || "")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photoPath, setPhotoPath] = useState<string | null>(myEntry?.photo_path || null)

  const exportRef = useRef<HTMLDivElement | null>(null)
  const exportAllRef = useRef<HTMLDivElement | null>(null)

  async function uploadPhoto(file: File) {
    if (!inviteCode) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("inviteCode", inviteCode)
      const res = await fetch("/api/guestbook/photo", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Upload failed")
      setPhotoPath(json.path)
      toast.success("Photo added")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function saveEntry() {
    if (!inviteCode) return
    if (!message.trim()) {
      toast.error("Please write a message")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode, message: message.trim(), photoPath }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save message")
      toast.success("Message saved to the guestbook")
      await mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function exportMyMessage() {
    if (!exportRef.current) return
    const name = (attendeeName || "guest").replaceAll(/[^a-z0-9-_ ]/gi, "").trim() || "guest"
    await exportElementToPdf(exportRef.current, {
      filename: `guestbook-message-${name}.pdf`,
      background: "#fdfbf7",
      paddingPx: 28,
    })
  }

  async function exportGuestbook() {
    if (!exportAllRef.current) return
    await exportElementToPdf(exportAllRef.current, {
      filename: "guestbook.pdf",
      background: "#fdfbf7",
      paddingPx: 28,
    })
  }

  async function resolveSignedUrl(path: string) {
    const qs = new URLSearchParams({
      path,
      eventId,
      ...(inviteCode ? { inviteCode } : {}),
    })
    const res = await fetch(`/api/media/url?${qs.toString()}`)
    const json = await res.json()
    return (json?.url as string | undefined) || undefined
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  async function refreshPreview() {
    if (!photoPath) return
    try {
      const url = await resolveSignedUrl(photoPath)
      if (url) setPreviewUrl(url)
    } catch {
      // ignore
    }
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Heart className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="font-serif italic">Failed to load guestbook</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
        <p className="text-sm text-muted-foreground font-serif italic">Loading guestbook...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {canWrite ? (
        <Card className="border-border/50 shadow-lg overflow-hidden">
          {/* Decorative header */}
          <div className="h-1.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 font-serif text-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookHeart className="h-5 w-5 text-primary" />
              </div>
              <span>Digital Guestbook</span>
            </CardTitle>
            <CardDescription className="font-serif italic">
              Leave a heartfelt message for the couple — and export it as a cherished keepsake.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="guestbook-message" className="flex items-center gap-2 text-sm font-medium">
                <Feather className="w-4 h-4 text-primary/70" />
                Your Message
              </Label>
              <Textarea
                id="guestbook-message"
                placeholder="Write something from the heart..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-28 rounded-xl border-border/50 bg-muted/30 focus:bg-white transition-colors resize-none font-serif"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guestbook-photo" className="text-sm font-medium">
                  Optional Photo
                </Label>
                <Input
                  id="guestbook-photo"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="rounded-xl border-border/50 file:bg-primary/10 file:text-primary file:border-0 file:rounded-lg file:font-medium"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) uploadPhoto(f)
                  }}
                />
                <p className="text-xs text-muted-foreground italic">
                  Include a photo in your exported message.
                </p>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-primary/30 hover:bg-primary/5"
                  disabled={!photoPath}
                  onClick={refreshPreview}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  type="button"
                  disabled={saving}
                  onClick={saveEntry}
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ImagePlus className="h-4 w-4 mr-2" />
                  )}
                  Save Message
                </Button>
              </div>
            </div>

            {/* Premium export preview card */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-[#fdfbf7] to-[#f8f4ef] p-4 sm:p-6">
              <div ref={exportRef} className="rounded-2xl border border-border/30 bg-white p-6 sm:p-8 shadow-sm">
                {/* Decorative corner elements */}
                <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />

                <div className="text-center relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    Guestbook Message
                  </p>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-serif font-medium text-foreground">
                    {attendeeName || "A Dear Guest"}
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <div className="w-8 h-px bg-primary/30" />
                    <Heart className="w-3 h-3 text-primary/50" />
                    <div className="w-8 h-px bg-primary/30" />
                  </div>
                  <div className="mt-6 text-base leading-relaxed text-foreground/80 whitespace-pre-wrap font-serif italic">
                    {message.trim() ? `"${message.trim()}"` : '"Your message will appear here."'}
                  </div>
                </div>

                {previewUrl && (
                  <div className="mt-8">
                    <div className="overflow-hidden rounded-xl border border-border/50 shadow-sm">
                      <img src={previewUrl} alt="Selected memory" className="w-full h-auto" crossOrigin="anonymous" />
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center text-xs text-muted-foreground italic">
                  With love, from your Wedspace guestbook
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border/50 hover:bg-muted/50"
                onClick={() => mutate()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Entries
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={exportMyMessage}
                disabled={!message.trim()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/50 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-serif text-xl">Guestbook Messages</CardTitle>
              <CardDescription className="font-serif italic">
                {entries.length} heartfelt message{entries.length === 1 ? "" : "s"}
              </CardDescription>
            </div>
            {mode === "owner" && (
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={exportGuestbook}
                disabled={entries.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Hidden export layout */}
          <div className="sr-only">
            <div ref={exportAllRef} className="p-8">
              <div className="rounded-2xl border border-border bg-white p-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    Digital Guestbook
                  </p>
                  <h1 className="mt-2 text-3xl font-serif font-medium">Wedding Guestbook</h1>
                  <p className="mt-2 text-sm text-muted-foreground italic">
                    A collection of heartfelt notes from your guests.
                  </p>
                </div>
                <div className="mt-8 space-y-5">
                  {entries.map((e) => (
                    <div key={e.id} className="rounded-xl border border-border p-5">
                      <p className="text-lg font-serif font-medium">{e.attendee_name || "Guest"}</p>
                      <p className="mt-2 text-base leading-relaxed whitespace-pre-wrap italic">
                        {`"${e.message}"`}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center text-xs text-muted-foreground">Made with Wedspace</div>
              </div>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <BookHeart className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground font-serif italic">
                No messages yet. Be the first to leave your wishes!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/40 p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-serif font-medium text-primary">
                        {(e.attendee_name || "G")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-serif">{e.attendee_name || "Guest"}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1 italic">
                        "{e.message}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
