import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Events planned, managed, and remembered —
          <span className="block bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            all in one collaborative workspace
          </span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          Create events, invite attendees, check them in with QR codes,
          collaborate in real time, and preserve shared memories —
          without friction or chaos.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Create Your First Event</Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required • Free plan available
        </p>
      </div>
    </section>
  )
}
