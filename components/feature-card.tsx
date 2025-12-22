import { cn } from "@/lib/utils"

export default function FeatureCard({
  title,
  description,
  highlight,
}: {
  title: string
  description: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-background/80 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl",
        highlight &&
          "border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 to-purple-500/15"
      )}
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-br from-indigo-500/10 to-transparent" />

      <h3 className="relative z-10 text-lg font-semibold">
        {title}
      </h3>
      <p className="relative z-10 mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
