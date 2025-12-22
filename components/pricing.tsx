import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For casual events & small groups",
    features: [
      "Up to 3 events",
      "Invite links & RSVPs",
      "QR check-in",
      "Limited media uploads",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For organizers who run real events",
    features: [
      "Unlimited events",
      "Unlimited invites",
      "Advanced QR check-in",
      "Full media gallery",
      "Event analytics",
      "Branding controls",
    ],
    featured: true,
    cta: "Start Pro Trial",
  },
  {
    name: "Team",
    price: "$49",
    description: "For companies & organizations",
    features: [
      "Everything in Pro",
      "Multiple organizers",
      "Shared billing",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Contact Sales",
  },
]

export default function Pricing() {
  return (
    <section className="relative py-28" id="pricing">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-500/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade only when you need more power.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-3xl border bg-background/80 p-8 backdrop-blur transition",
                plan.featured
                  ? "scale-105 border-indigo-500/50 shadow-2xl"
                  : "hover:shadow-lg"
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "$0" && (
                  <span className="ml-1 text-muted-foreground">/mo</span>
                )}
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-indigo-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.featured ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
