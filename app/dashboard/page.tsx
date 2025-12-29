import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/server-supabase"
import { EventsList } from "@/components/events-list"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { DashboardHeader } from "@/components/dashboard-header"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Use admin client to bypass RLS since we've already verified auth with Clerk
  const supabase = createAdminClient()
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userId={userId} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Events</h1>
            <p className="text-muted-foreground">Create and manage your events</p>
          </div>
          <CreateEventDialog userId={userId} />
        </div>
        <EventsList events={events || []} />
      </main>
    </div>
  )
}
