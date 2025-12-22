import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold">
          Turn every event into a collaborative experience
        </h2>

        <p className="mt-4 text-lg text-muted-foreground">
          From planning to memories — everything happens in one workspace.
        </p>

        <Button size="lg" className="mt-8">
          Start Free Today
        </Button>
      </div>
    </section>
  )
}
