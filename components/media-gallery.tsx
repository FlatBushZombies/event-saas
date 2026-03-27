"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import type { Media } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, ImageIcon, Film, Loader2, Play, Sparkles, Clock3 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface MediaGalleryProps {
  eventId: string
  inviteCode?: string
  canDelete?: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MediaGallery({ eventId, inviteCode, canDelete = false }: MediaGalleryProps) {
  const apiUrl = inviteCode 
    ? `/api/media?eventId=${eventId}&inviteCode=${inviteCode}`
    : `/api/media?eventId=${eventId}`
  
  const { data, error, mutate: refreshMedia } = useSWR(apiUrl, fetcher)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({})

  const media: Media[] = data?.media || []

  function getTileClass(index: number) {
    const pattern = index % 8

    if (pattern === 2 || pattern === 5) {
      return "md:col-span-2 md:row-span-2"
    }

    if (pattern === 7) {
      return "md:col-span-2"
    }

    return ""
  }

  // Load thumbnails for all media items
  useEffect(() => {
    if (media.length > 0) {
      media.forEach((item) => {
        if (!thumbnailUrls[item.id]) {
          getThumbnailUrl(item.file_path, item.id)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.length])

  async function getSignedUrl(filePath: string) {
    setLoadingUrl(true)
    try {
      const params = new URLSearchParams({
        path: filePath,
        eventId,
      })
      if (inviteCode) {
        params.append("inviteCode", inviteCode)
      }
      
      const response = await fetch(`/api/media/url?${params}`)
      const data = await response.json()
      
      if (data.url) {
        setMediaUrl(data.url)
      }
    } catch (error) {
      console.error("Failed to get media URL:", error)
    } finally {
      setLoadingUrl(false)
    }
  }

  async function getThumbnailUrl(filePath: string, mediaId: string) {
    try {
      const params = new URLSearchParams({
        path: filePath,
        eventId,
      })
      if (inviteCode) {
        params.append("inviteCode", inviteCode)
      }
      
      const response = await fetch(`/api/media/url?${params}`)
      const data = await response.json()
      
      if (data.url) {
        setThumbnailUrls((prev) => ({ ...prev, [mediaId]: data.url }))
      }
    } catch (error) {
      console.error("Failed to get thumbnail URL:", error)
    }
  }

  function handleMediaClick(item: Media) {
    setSelectedMedia(item)
    getSignedUrl(item.file_path)
  }

  function handleClosePreview() {
    setSelectedMedia(null)
    setMediaUrl(null)
  }

  async function handleDelete(mediaId: string) {
    if (!confirm("Are you sure you want to delete this media?")) return

    setDeleting(mediaId)
    try {
      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      })

      if (response.ok) {
        toast.success("Media deleted successfully")
        refreshMedia()
        if (selectedMedia?.id === mediaId) {
          handleClosePreview()
        }
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete media")
      }
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeleting(null)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load media
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No media yet</h3>
          <p className="text-sm text-muted-foreground">
            {canDelete 
              ? "Upload photos and videos to share with your attendees"
              : "No media has been shared for this event yet"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-[1.75rem] border border-border/60 bg-gradient-to-br from-white to-primary/5 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Explore the celebration
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {media.length} shared {media.length === 1 ? "moment" : "moments"} in an always-on event feed.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm text-primary shadow-sm">
            <Clock3 className="h-4 w-4" />
            <span>Newest moments first</span>
          </div>
        </div>

        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[165px] md:grid-cols-4">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={[
              "group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-muted/30 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              getTileClass(index),
            ].join(" ")}
            onClick={() => handleMediaClick(item)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/65" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-muted">
              {thumbnailUrls[item.id] && item.file_type.startsWith("image/") ? (
                <img
                  src={thumbnailUrls[item.id]}
                  alt={item.caption || item.file_name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : thumbnailUrls[item.id] && item.file_type.startsWith("video/") ? (
                <video
                  src={thumbnailUrls[item.id]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  muted
                />
              ) : (
                <>
                  {item.file_type.startsWith("image/") ? (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <Film className="h-12 w-12 text-muted-foreground" />
                  )}
                </>
              )}
            </div>

            <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
              <div className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {item.file_type.startsWith("video/") ? (
                  <>
                    <Play className="h-3 w-3 fill-current" />
                    Reel
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-3 w-3" />
                    Photo
                  </>
                )}
              </div>

              {canDelete && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 bg-black/60 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                  disabled={deleting === item.id}
                >
                  {deleting === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="rounded-[1.25rem] border border-white/15 bg-black/45 p-3 text-white backdrop-blur-md">
                <p className="truncate text-sm font-medium">{item.caption || item.file_name}</p>
                <p className="mt-1 text-xs text-white/75">
                  {format(new Date(item.created_at), "MMM d 'at' h:mm a")}
                </p>
              </div>
            </div>
          </button>
        ))}
        </div>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-5xl overflow-hidden border-border/60 bg-background/95 p-0">
          <DialogHeader className="border-b border-border/60 px-6 py-4">
            <DialogTitle className="truncate pr-4 text-xl font-serif">{selectedMedia?.file_name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative min-h-64 bg-black/5 p-4 md:p-6">
            {loadingUrl ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : mediaUrl ? (
              <>
                {selectedMedia?.file_type.startsWith("image/") && (
                  <img
                    src={mediaUrl || "/placeholder.svg"}
                    alt={selectedMedia?.caption || selectedMedia?.file_name}
                    className="w-full max-h-[70vh] object-contain rounded-[1.5rem]"
                  />
                )}
                {selectedMedia?.file_type.startsWith("video/") && (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full max-h-[70vh] rounded-[1.5rem]"
                  />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Failed to load media
              </div>
            )}
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Explore Detail
              </div>

              {selectedMedia?.caption ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Caption</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{selectedMedia.caption}</p>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Shared</p>
                <p className="mt-2 text-sm text-foreground/80">
                  {selectedMedia && format(new Date(selectedMedia.created_at), "EEEE, MMMM d 'at' h:mm a")}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Format</p>
                <p className="mt-2 text-sm text-foreground/80">
                  {selectedMedia?.file_type.startsWith("video/") ? "Video memory" : "Photo memory"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
