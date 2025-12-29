import { Resend } from "resend"

// Lazy initialization - only create Resend client when API key is available
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

interface SendInviteEmailParams {
  to: string
  attendeeName?: string
  eventTitle: string
  eventDate: string
  eventLocation?: string
  inviteLink: string
  organizerName?: string
}

export async function sendInviteEmail({
  to,
  attendeeName,
  eventTitle,
  eventDate,
  eventLocation,
  inviteLink,
  organizerName = "Event Organizer",
}: SendInviteEmailParams) {
  const resend = getResendClient()
  
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping email send")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "EventFlow <onboarding@resend.dev>",
      to,
      subject: `You're invited to ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Invitation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              ${attendeeName ? `<p style="font-size: 16px; margin-bottom: 20px;">Hi ${attendeeName},</p>` : "<p style='font-size: 16px; margin-bottom: 20px;'>Hi there,</p>"}
              <p style="font-size: 16px; margin-bottom: 20px;">
                ${organizerName} has invited you to attend:
              </p>
              <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0;">
                <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px;">${eventTitle}</h2>
                <div style="margin: 16px 0;">
                  <p style="margin: 8px 0; color: #6b7280;">
                    <strong style="color: #374151;">📅 Date & Time:</strong><br>
                    ${new Date(eventDate).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  ${eventLocation ? `<p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">📍 Location:</strong><br>${eventLocation}</p>` : ""}
                </div>
              </div>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${inviteLink}" style="display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Accept Invitation
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 24px; text-align: center;">
                Click the button above to accept your invitation and receive your QR code for check-in.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${inviteLink}" style="color: #667eea; word-break: break-all;">${inviteLink}</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
You're invited to ${eventTitle}

${attendeeName ? `Hi ${attendeeName},\n\n` : ""}${organizerName} has invited you to attend:

${eventTitle}
Date & Time: ${new Date(eventDate).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
${eventLocation ? `Location: ${eventLocation}\n` : ""}

Accept your invitation by clicking this link:
${inviteLink}

Once you accept, you'll receive a QR code for event check-in.
      `.trim(),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

