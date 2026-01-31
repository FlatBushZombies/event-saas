"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, ImagePlus, X } from "lucide-react"
import { toast } from "sonner"

interface MediaUploadProps {
  eventId: string
}

export function MediaUpload({ eventId }: MediaUploadProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview for images and videos
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        setPreview(url)
      } else {
        setPreview(null)
      }
    }
  }

  function clearSelection() {
    setSelectedFile(null)
    setPreview(null)
    setCaption("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleUpload() {
    if (!selectedFile) return

    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("eventId", eventId)
      if (caption) {
        formData.append("caption", caption)
      }

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast.success("Media uploaded successfully!")
        // Refresh the page to show new media
        setTimeout(() => {
          window.location.reload()
        }, 500)
        setOpen(false)
        clearSelection()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to upload media")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload media")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Share photos or videos with your event attendees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to select a file
              </p>
              <p className="text-xs text-muted-foreground">
                Images and videos up to 50MB
              </p>
            </div>
          ) : (
            <div className="relative">
              {preview && selectedFile.type.startsWith("image/") && (
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              {preview && selectedFile.type.startsWith("video/") && (
                <video
                  src={preview}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              )}
              {!preview && (
                <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                </div>
              )}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile && (
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
