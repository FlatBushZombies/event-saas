"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser"

interface ScanResult {
  success: boolean
  message: string
  attendeeName?: string
  attendeeEmail?: string
  eventTitle?: string
  eventDate?: string
  eventLocation?: string
}

function isMobileDevice() {
  if (typeof navigator === "undefined") {
    return false
  }

  const nav = navigator as Navigator & {
    userAgentData?: {
      mobile?: boolean
    }
  }

  if (typeof nav.userAgentData?.mobile === "boolean") {
    return nav.userAgentData.mobile
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)
}

function extractInviteCode(rawValue: string) {
  const value = rawValue.trim()

  try {
    const parsedUrl = new URL(value)
    const segments = parsedUrl.pathname.split("/").filter(Boolean)
    const inviteIndex = segments.findIndex((segment) => segment === "invite")

    if (inviteIndex >= 0 && segments[inviteIndex + 1]) {
      return segments[inviteIndex + 1]
    }
  } catch {
    // Non-URL QR values are treated as direct invite codes.
  }

  const urlMatch = value.match(/\/invite\/([a-zA-Z0-9_-]+)/)

  return urlMatch?.[1] ?? value
}

export function QRScanner() {
  const [isMobile, setIsMobile] = useState(false)
  const [deviceChecked, setDeviceChecked] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processingRef = useRef(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setDeviceChecked(true)

    return () => {
      processingRef.current = false
      teardownCamera()
    }
  }, [])

  function teardownCamera() {
    controlsRef.current?.stop()
    controlsRef.current = null

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
  }

  function stopScanner() {
    teardownCamera()
    processingRef.current = false
    setLoading(false)
    setScanning(false)
  }

  async function requestCameraStream() {
    const preferredConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
      },
    }

    try {
      return await navigator.mediaDevices.getUserMedia(preferredConstraints)
    } catch {
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      })
    }
  }

  async function startScanning() {
    if (scanning || loading) {
      return
    }

    if (!isMobile) {
      setResult({
        success: false,
        message: "QR scanning is available on mobile devices only. Open this page on your phone to scan with the camera.",
      })
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setResult({
        success: false,
        message: "This browser cannot access the camera.",
      })
      return
    }

    stopScanner()
    setScanning(true)
    setResult(null)

    try {
      const codeReader = new BrowserQRCodeReader()
      const stream = await requestCameraStream()
      streamRef.current = stream

      if (!videoRef.current) {
        throw new Error("Video preview is unavailable")
      }

      videoRef.current.setAttribute("playsinline", "true")
      videoRef.current.muted = true
      videoRef.current.srcObject = stream
      await videoRef.current.play().catch(() => undefined)

      controlsRef.current = await codeReader.decodeFromStream(stream, videoRef.current, async (scanResult) => {
        if (!scanResult || processingRef.current) {
          return
        }

        processingRef.current = true
        setLoading(true)
        setScanning(false)
        teardownCamera()

        try {
          const response = await fetch("/api/invites/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inviteCode: extractInviteCode(scanResult.getText()) }),
          })

          const data = await response.json()

          if (response.ok) {
            setResult({
              success: true,
              message: "Check-in successful!",
              attendeeName: data.attendeeName,
              attendeeEmail: data.attendeeEmail,
              eventTitle: data.eventTitle,
              eventDate: data.eventDate,
              eventLocation: data.eventLocation,
            })
          } else {
            setResult({
              success: false,
              message: data.error || "Failed to process invite",
            })
          }
        } catch (error) {
          console.error("Scanner request error:", error)
          setResult({
            success: false,
            message: "Failed to process invite",
          })
        } finally {
          setLoading(false)
          processingRef.current = false
        }
      })
    } catch (err) {
      console.error("Scanner error:", err)
      teardownCamera()
      processingRef.current = false
      setLoading(false)
      setScanning(false)
      setResult({
        success: false,
        message: "Failed to open the camera. Please allow camera access on your phone and try again.",
      })
    }
  }

  function resetScanner() {
    setResult(null)
    stopScanner()
  }

  return (
    <Card>
      <CardContent className="p-6">
        {deviceChecked && !isMobile && !scanning && !loading && (
          <Alert className="mb-6">
            <AlertDescription>
              This scanner works on mobile only. Open this page on your phone to launch the camera and scan QR codes.
            </AlertDescription>
          </Alert>
        )}

        {!scanning && !result && (
          <div className="text-center py-12">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Camera className="h-8 w-8 text-primary" />}
            </div>
            <h3 className="text-lg font-semibold mb-2">{loading ? "Processing Scan" : "Ready to Scan"}</h3>
            <p className="text-muted-foreground mb-6">
              {loading
                ? "Please wait while we check in the guest."
                : isMobile
                  ? "Open the rear camera and position the QR code within the frame."
                  : "Use a mobile device to open the camera and scan a QR code."}
            </p>
            <Button onClick={startScanning} size="lg" disabled={!isMobile || loading}>
              <Camera className="h-5 w-5 mr-2" />
              Open Camera
            </Button>
          </div>
        )}

        {scanning && (
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            <Button onClick={stopScanner} variant="outline" className="w-full bg-transparent">
              Close Camera
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
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Attendee:</strong> {result.attendeeName}
                    </p>
                  )}
                  {result.attendeeEmail && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Email:</strong> {result.attendeeEmail}
                    </p>
                  )}
                  {result.eventTitle && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Event:</strong> {result.eventTitle}
                    </p>
                  )}
                  {result.eventDate && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Date:</strong> {new Date(result.eventDate).toLocaleString()}
                    </p>
                  )}
                  {result.eventLocation && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Location:</strong> {result.eventLocation}
                    </p>
                  )}
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
