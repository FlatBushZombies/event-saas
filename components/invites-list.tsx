"use client"

import type { Invite } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, User, Copy, Check, Download } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

interface InvitesListProps {
  invites: Invite[]
  eventId: string
}

export function InvitesList({ invites }: InvitesListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyInviteLink(inviteCode: string, id: string) {
    const link = `${window.location.origin}/invite/${inviteCode}`
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function downloadQR(inviteCode: string, attendeeName: string) {
    const svg = document.getElementById(`qr-${inviteCode}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `invite-${attendeeName || inviteCode}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  if (invites.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No invites yet</h3>
          <p className="text-muted-foreground">Create your first invite to get started</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invites.map((invite) => (
        <Card key={invite.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Badge
                variant={
                  invite.status === "scanned" ? "default" : invite.status === "accepted" ? "secondary" : "outline"
                }
              >
                {invite.status}
              </Badge>
              <div className="hidden">
                <QRCodeSVG
                  id={`qr-${invite.invite_code}`}
                  value={`${window.location.origin}/invite/${invite.invite_code}`}
                  size={256}
                  level="H"
                />
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {invite.attendee_name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{invite.attendee_name}</span>
                </div>
              )}
              {invite.attendee_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{invite.attendee_email}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Created {format(new Date(invite.created_at), "PPp")}</p>
              {invite.accepted_at && (
                <p className="text-xs text-muted-foreground">Accepted {format(new Date(invite.accepted_at), "PPp")}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => copyInviteLink(invite.invite_code, invite.id)}
              >
                {copiedId === invite.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              {invite.status !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => downloadQR(invite.invite_code, invite.attendee_name || "attendee")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
