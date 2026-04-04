"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import type { Media } from "@/lib/types"
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
      <div className="text-center py-8" style={{ color: "#6b6560" }}>
        Failed to load media
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#b97971" }} />
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div 
        className="py-12 text-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(185, 121, 113, 0.03), rgba(255,252,251,0.9))",
          border: "1px solid rgba(185, 121, 113, 0.08)",
        }}
      >
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(185, 121, 113, 0.08), rgba(185, 121, 113, 0.03))",
            border: "1px solid rgba(185, 121, 113, 0.08)",
          }}
        >
          <ImageIcon className="h-8 w-8" style={{ color: "#c9918a" }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "#2d2926" }}>No media yet</h3>
        <p className="text-sm" style={{ color: "#6b6560" }}>
          {canDelete 
            ? "Upload photos and videos to share with your attendees"
            : "No media has been shared for this event yet"}
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes mediaFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="space-y-5">
        <div 
          className="flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(255,252,251,0.98), rgba(185, 121, 113, 0.03))",
            border: "1px solid rgba(185, 121, 113, 0.08)",
            boxShadow: "0 4px 12px rgba(185, 121, 113, 0.04)",
          }}
        >
          <div>
            <p 
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase"
              style={{ color: "#a66b64", letterSpacing: "0.18em" }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Explore the celebration
            </p>
            <p className="mt-2 text-sm" style={{ color: "#6b6560" }}>
              {media.length} shared {media.length === 1 ? "moment" : "moments"} in an always-on event feed.
            </p>
          </div>
          <div 
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            style={{
              background: "white",
              border: "1px solid rgba(185, 121, 113, 0.12)",
              color: "#a66b64",
              boxShadow: "0 2px 8px rgba(185, 121, 113, 0.06)",
            }}
          >
            <Clock3 className="h-4 w-4" />
            <span className="font-medium">Newest moments first</span>
          </div>
        </div>

        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[165px] md:grid-cols-4">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={[
              "group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2",
              getTileClass(index),
            ].join(" ")}
            style={{
              background: "rgba(185, 121, 113, 0.03)",
              border: "1px solid rgba(185, 121, 113, 0.1)",
              boxShadow: "0 4px 12px rgba(185, 121, 113, 0.04)",
              animation: `mediaFadeIn 0.5s ease ${index * 0.05}s both`,
            }}
            onClick={() => handleMediaClick(item)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(110, 70, 65, 0.6) 100%)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />
            <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: "#fdf8f7" }}>
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
                    <ImageIcon className="h-12 w-12" style={{ color: "#d4a59a" }} />
                  ) : (
                    <Film className="h-12 w-12" style={{ color: "#d4a59a" }} />
                  )}
                </>
              )}
            </div>

            <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-3 z-20">
              <div 
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-white"
                style={{
                  background: "rgba(138, 87, 80, 0.75)",
                  backdropFilter: "blur(8px)",
                }}
              >
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
                  className="h-8 w-8 rounded-full backdrop-blur-md opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500"
                  style={{ background: "rgba(138, 87, 80, 0.6)" }}
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

            <div className="absolute inset-x-0 bottom-0 p-3 z-20">
              <div 
                className="rounded-xl p-3 text-white"
                style={{
                  background: "rgba(138, 87, 80, 0.55)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="truncate text-sm font-medium">{item.caption || item.file_name}</p>
                <p className="mt-1 text-xs" style={{ color: "#f5e6e3" }}>
                  {format(new Date(item.created_at), "MMM d 'at' h:mm a")}
                </p>
              </div>
            </div>
          </button>
        ))}
        </div>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={handleClosePreview}>
        <DialogContent 
          className="max-w-5xl overflow-hidden p-0"
          style={{
            background: "rgba(255,252,251,0.99)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(185, 121, 113, 0.12)",
            borderRadius: "24px",
          }}
        >
          <DialogHeader 
            className="px-6 py-4"
            style={{ borderBottom: "1px solid rgba(185, 121, 113, 0.08)" }}
          >
            <DialogTitle 
              className="truncate pr-4 text-xl"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: "#2d2926" }}
            >
              {selectedMedia?.file_name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_320px]">
            <div 
              className="relative min-h-64 p-4 md:p-6"
              style={{ background: "linear-gradient(135deg, rgba(185, 121, 113, 0.02), rgba(255,252,251,0.95))" }}
            >
            {loadingUrl ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#b97971" }} />
              </div>
            ) : mediaUrl ? (
              <>
                {selectedMedia?.file_type.startsWith("image/") && (
                  <img
                    src={mediaUrl || "/placeholder.svg"}
                    alt={selectedMedia?.caption || selectedMedia?.file_name}
                    className="w-full max-h-[70vh] object-contain rounded-2xl"
                  />
                )}
                {selectedMedia?.file_type.startsWith("video/") && (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full max-h-[70vh] rounded-2xl"
                  />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64" style={{ color: "#6b6560" }}>
                Failed to load media
              </div>
            )}
            </div>

            <div 
              className="space-y-5 px-6 py-5"
              style={{ borderLeft: "1px solid rgba(185, 121, 113, 0.08)" }}
            >
              <div 
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase"
                style={{
                  background: "linear-gradient(135deg, rgba(185, 121, 113, 0.08), rgba(185, 121, 113, 0.03))",
                  border: "1px solid rgba(185, 121, 113, 0.12)",
                  color: "#a66b64",
                  letterSpacing: "0.16em",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Explore Detail
              </div>

              {selectedMedia?.caption ? (
                <div>
                  <p className="text-xs font-semibold uppercase mb-2" style={{ letterSpacing: "0.16em", color: "#6b6560" }}>Caption</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#2d2926" }}>{selectedMedia.caption}</p>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ letterSpacing: "0.16em", color: "#6b6560" }}>Shared</p>
                <p className="text-sm" style={{ color: "#2d2926" }}>
                  {selectedMedia && format(new Date(selectedMedia.created_at), "EEEE, MMMM d 'at' h:mm a")}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ letterSpacing: "0.16em", color: "#6b6560" }}>Format</p>
                <p className="text-sm" style={{ color: "#2d2926" }}>
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
