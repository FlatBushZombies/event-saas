import FeatureCard from "./feature-card"

export default function Features() {
  return (
    <section className="py-24" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-3xl font-semibold">
          What EventWorkspace handles
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Event Creation & Roles"
            description="Create events with role-based permissions for organizers, moderators, and attendees."
          />

          <FeatureCard
            title="Invites & RSVPs"
            description="Invite via links, email, or QR codes with real-time RSVP tracking."
          />

          <FeatureCard
            title="QR Code Check-In"
            description="Secure, duplicate-proof check-ins with live attendance dashboards."
          />

          <FeatureCard
            title="Shared Media Gallery"
            description="Let attendees upload photos into a live, collaborative event album."
          />

          <FeatureCard
            title="Realtime Collaboration"
            description="Live updates across attendees, media, and engagement activity."
          />

          <FeatureCard
            title="Analytics & Insights"
            description="Track attendance, engagement, and event performance (Pro plan)."
            highlight
          />
        </div>
      </div>
    </section>
  )
}
