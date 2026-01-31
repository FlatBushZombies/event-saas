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
import { Trash2, ImageIcon, Film, X, Loader2 } from "lucide-react"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all group relative"
            onClick={() => handleMediaClick(item)}
          >
            <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
              {thumbnailUrls[item.id] && item.file_type.startsWith("image/") ? (
                <img
                  src={thumbnailUrls[item.id]}
                  alt={item.caption || item.file_name}
                  className="w-full h-full object-cover"
                />
              ) : thumbnailUrls[item.id] && item.file_type.startsWith("video/") ? (
                <video
                  src={thumbnailUrls[item.id]}
                  className="w-full h-full object-cover"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs truncate">{item.file_name}</p>
                </div>
              </div>
            </div>
            {canDelete && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{selectedMedia?.file_name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="relative min-h-64">
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
                    className="w-full max-h-[70vh] object-contain rounded-lg"
                  />
                )}
                {selectedMedia?.file_type.startsWith("video/") && (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full max-h-[70vh] rounded-lg"
                  />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Failed to load media
              </div>
            )}
          </div>

          {selectedMedia?.caption && (
            <p className="text-sm text-muted-foreground">{selectedMedia.caption}</p>
          )}
          
          <p className="text-xs text-muted-foreground">
            Uploaded {selectedMedia && format(new Date(selectedMedia.created_at), "PPP 'at' p")}
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
