import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { createAdminClient } from "@/lib/server-supabase"
import { DashboardHeader } from "@/components/dashboard-header"
import { EventDetails } from "@/components/event-details"
import { InvitesList } from "@/components/invites-list"
import { CreateInviteDialog } from "@/components/create-invite-dialog"
import { MediaUpload } from "@/components/media-upload"
import { MediaGallery } from "@/components/media-gallery"
import { PollsList } from "@/components/polls-list"
import { CreatePollDialog } from "@/components/create-poll-dialog"
import { Guestbook } from "@/components/guestbook"
import { SeatingPlanner } from "@/components/seating-planner"
import { TimelineEditor } from "@/components/timeline-editor"

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { userId } = await auth()
  const { eventId } = await params

  if (!userId) {
    redirect("/sign-in")
  }

  // Use admin client to bypass RLS since we've already verified auth with Clerk
  const supabase = createAdminClient()

  const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single()

  if (!event || event.user_id !== userId) {
    notFound()
  }

  const { data: invites } = await supabase
    .from("invites")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userId={userId} />
      <main className="container mx-auto px-4 py-8">
        <EventDetails event={event} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Shared Memories</h2>
              <p className="text-muted-foreground">A beautiful gallery for the couple and guests to keep adding to.</p>
            </div>
            <MediaUpload eventId={eventId} />
          </div>
          <MediaGallery eventId={eventId} canDelete />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Guest Voting</h2>
              <p className="text-muted-foreground">Invite playful predictions, preferences, and little moments of interaction.</p>
            </div>
            <CreatePollDialog eventId={eventId} />
          </div>
          <PollsList eventId={eventId} />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Guestbook</h2>
              <p className="text-muted-foreground">Collect heartfelt notes and keep them beautifully archived.</p>
            </div>
          </div>
          <Guestbook mode="owner" eventId={eventId} />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Wedding Timeline</h2>
              <p className="text-muted-foreground">Publish the key moments so guests always know what happens next.</p>
            </div>
          </div>
          <TimelineEditor eventId={eventId} />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Seating & Tables</h2>
              <p className="text-muted-foreground">Shape the room, assign guests with confidence, and keep things balanced.</p>
            </div>
          </div>
          <SeatingPlanner eventId={eventId} />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Invitations</h2>
              <p className="text-muted-foreground">Send private access, track responses, and welcome guests into the experience.</p>
            </div>
            <CreateInviteDialog eventId={eventId} />
          </div>
          <InvitesList invites={invites || []} eventId={eventId} />
        </div>
      </main>
    </div>
  )
}
