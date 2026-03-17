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
import { Download, Loader2, BookHeart, ImagePlus, RefreshCw } from "lucide-react"

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
    // Reuse existing signed URL endpoint + its authorization rules.
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
    return <div className="text-center py-8 text-muted-foreground">Failed to load guestbook</div>
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {canWrite ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookHeart className="h-5 w-5" />
              Digital Guestbook
            </CardTitle>
            <CardDescription>Leave a personal message for the couple — and export it as a keepsake.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestbook-message">Your message</Label>
              <Textarea
                id="guestbook-message"
                placeholder="Write something heartfelt…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-28"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guestbook-photo">Optional photo</Label>
                <Input
                  id="guestbook-photo"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) uploadPhoto(f)
                  }}
                />
                <p className="text-xs text-muted-foreground">This photo can be included when you export your message.</p>
              </div>

              <div className="flex items-end gap-2">
                <Button type="button" variant="outline" className="bg-transparent" disabled={!photoPath} onClick={refreshPreview}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Preview photo
                </Button>
                <Button type="button" disabled={saving} onClick={saveEntry} className="flex-1">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ImagePlus className="h-4 w-4 mr-2" />}
                  Save message
                </Button>
              </div>
            </div>

            {/* Wedding-tone export card */}
            <div className="rounded-3xl border border-border bg-[#fdfbf7] p-5 sm:p-8">
              <div ref={exportRef} className="rounded-3xl border border-border bg-white p-6 sm:p-10 shadow-sm">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Guestbook message</p>
                  <h3 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>
                    {attendeeName || "A dear guest"}
                  </h3>
                  <div className="mt-6 text-base leading-relaxed text-foreground whitespace-pre-wrap">
                    {message.trim() ? `“${message.trim()}”` : "“Your message will appear here.”"}
                  </div>
                </div>

                {previewUrl ? (
                  <div className="mt-8">
                    <div className="overflow-hidden rounded-2xl border border-border">
                      <img src={previewUrl} alt="Selected memory" className="w-full h-auto" crossOrigin="anonymous" />
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 text-center text-xs text-muted-foreground">
                  With love, from your Wedspace guestbook
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => mutate()}>
                Refresh entries
              </Button>
              <Button type="button" variant="secondary" onClick={exportMyMessage} disabled={!message.trim()}>
                <Download className="h-4 w-4 mr-2" />
                Export my message (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Guestbook messages</CardTitle>
              <CardDescription>{entries.length} message{entries.length === 1 ? "" : "s"}</CardDescription>
            </div>
            {mode === "owner" ? (
              <Button type="button" variant="secondary" onClick={exportGuestbook} disabled={entries.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {/* Hidden/print-ready guestbook export layout */}
          <div className="sr-only">
            <div ref={exportAllRef} className="p-8">
              <div className="rounded-3xl border border-border bg-white p-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Digital guestbook</p>
                  <h1 className="mt-2 text-4xl font-bold" style={{ fontFamily: '"Instrument Serif", serif' }}>
                    Wedding Guestbook
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A collection of heartfelt notes from your guests.
                  </p>
                </div>
                <div className="mt-8 space-y-5">
                  {entries.map((e) => (
                    <div key={e.id} className="rounded-2xl border border-border p-5">
                      <p className="text-lg font-semibold" style={{ fontFamily: '"Instrument Serif", serif' }}>
                        {e.attendee_name || "Guest"}
                      </p>
                      <p className="mt-2 text-base leading-relaxed whitespace-pre-wrap">{`“${e.message}”`}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center text-xs text-muted-foreground">Made with Wedspace</div>
              </div>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="text-sm text-muted-foreground">No messages yet.</div>
          ) : (
            <div className="space-y-4">
              {entries.map((e) => (
                <div key={e.id} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium">{e.attendee_name || "Guest"}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{e.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

