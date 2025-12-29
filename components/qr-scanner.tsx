"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { BrowserQRCodeReader } from "@zxing/browser"

interface ScanResult {
  success: boolean
  message: string
  attendeeName?: string
  eventTitle?: string
}

export function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  async function startScanning() {
    setScanning(true)
    setResult(null)

    try {
      const codeReader = new BrowserQRCodeReader()
      codeReaderRef.current = codeReader

      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices()

      if (videoInputDevices.length === 0) {
        setResult({
          success: false,
          message: "No camera found",
        })
        setScanning(false)
        return
      }

      const selectedDeviceId = videoInputDevices[0].deviceId

      const controls = await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        async (result, error) => {
          if (result) {
            const text = result.getText()

            // Extract invite code from URL
            const urlMatch = text.match(/\/invite\/([a-zA-Z0-9_-]+)/)
            const inviteCode = urlMatch ? urlMatch[1] : text

            setLoading(true)

            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop())
            }

            // Process the invite
            const response = await fetch("/api/invites/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ inviteCode }),
            })

            const data = await response.json()
            setLoading(false)

            if (response.ok) {
              setResult({
                success: true,
                message: "Invite Accepted - Check-in successful!",
                attendeeName: data.attendeeName,
                eventTitle: data.eventTitle,
              })
            } else {
              setResult({
                success: false,
                message: data.error || "Failed to process invite",
              })
            }

            setScanning(false)
          }
        },
      )

      if (videoRef.current && videoRef.current.srcObject) {
        streamRef.current = videoRef.current.srcObject as MediaStream
      }
    } catch (err) {
      console.error("Scanner error:", err)
      setResult({
        success: false,
        message: "Failed to start camera",
      })
      setScanning(false)
    }
  }

  function stopScanning() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  function resetScanner() {
    setResult(null)
    setScanning(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        {!scanning && !result && (
          <div className="text-center py-12">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
            <p className="text-muted-foreground mb-6">Position the QR code within the camera frame</p>
            <Button onClick={startScanning} size="lg">
              <Camera className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
          </div>
        )}

        {scanning && (
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            <Button onClick={stopScanning} variant="outline" className="w-full bg-transparent">
              Cancel Scanning
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <Alert className={result.success ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription className="text-sm font-medium">{result.message}</AlertDescription>
                  {result.attendeeName && (
                    <p className="text-sm text-muted-foreground mt-2">Attendee: {result.attendeeName}</p>
                  )}
                  {result.eventTitle && <p className="text-sm text-muted-foreground">Event: {result.eventTitle}</p>}
                </div>
              </div>
            </Alert>
            <Button onClick={resetScanner} className="w-full">
              Scan Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
