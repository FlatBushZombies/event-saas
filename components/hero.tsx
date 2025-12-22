import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-28">
      
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-1 text-xs font-medium text-amber-800">
          New · Collaborative Event Workspaces
        </span>

        <h1 className="mt-6 text-5xl font-bold tracking-tight">
          Plan, run, and remember events —
          <span className="block text-indigo-600">
            together, in one workspace
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          EventWorkspace helps teams and communities create events,
          manage attendance, collaborate in real time, and preserve
          shared memories — without spreadsheets or chaos.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="rounded-full px-8">
            Get Started Free
          </Button>
          <Button size="lg" variant="outline" className="rounded-full">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
