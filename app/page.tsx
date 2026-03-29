"use client"

import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Heart,
  Calendar,
  Users,
  Camera,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"

function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const { isLoaded, isSignedIn } = useAuth()
  const accessSpaceHref = isLoaded && isSignedIn ? "/dashboard" : "/sign-in"
  const accessSpaceLabel = isLoaded && isSignedIn ? "Dashboard" : "Sign In"

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Wedspace Logo" width={120} height={120} className="object-cover" />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href={accessSpaceHref}>{accessSpaceLabel}</Link>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <Image
              src="/images/wedding-hero.jpg"
              alt="Beautiful wedding ceremony"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
          <AnimatedSection delay={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">The modern wedding platform</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <h1 className="mt-8 max-w-4xl text-balance font-serif text-5xl font-medium leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Where your wedding
              <span className="block text-primary"> lives forever</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              One elegant home for invites, timelines, seating, and memories.
              Before, during, and forever after.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 rounded-full bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
                Start Your Wedding Space
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-border/60 bg-card/50 backdrop-blur-sm">
                See How It Works
              </Button>
            </div>
          </AnimatedSection>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-5xl">
          <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/90 p-8 shadow-xl backdrop-blur-lg md:grid-cols-3">
            {[
              { value: "10,000+", label: "Happy couples" },
              { value: "500,000+", label: "Memories shared" },
              { value: "4.9/5", label: "Average rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-4xl font-medium text-foreground md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-foreground md:text-5xl lg:text-6xl">
              Everything you need,
              <span className="block">nothing you don&apos;t</span>
            </h2>
          </AnimatedSection>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: "Timeline & Schedule",
                description: "Keep every moment organized. Your guests always know where to be and when.",
                image: "/images/wedding-planning.jpg",
              },
              {
                icon: Users,
                title: "Guest Management",
                description: "RSVPs, seating charts, and dietary preferences in one beautiful place.",
                image: "/images/wedding-guests.jpg",
              },
              {
                icon: Camera,
                title: "Memory Gallery",
                description: "Guests contribute photos and videos to a shared space you&apos;ll treasure forever.",
                image: "/images/wedding-memories.jpg",
              },
            ].map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                  <div className="relative p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-medium text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-secondary/30 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-foreground md:text-5xl lg:text-6xl">
              Your journey, simplified
            </h2>
          </AnimatedSection>

          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Before",
                subtitle: "Plan with ease",
                description: "Create your space, customize your timeline, and invite guests with a single link.",
              },
              {
                step: "02",
                title: "During",
                subtitle: "Keep everyone in sync",
                description: "Real-time updates, seating assignments, and live photo sharing throughout your day.",
              },
              {
                step: "03",
                title: "Forever After",
                subtitle: "Preserve your story",
                description: "Your memories stay alive. Add anniversaries and future celebrations to the same home.",
              },
            ].map((phase, index) => (
              <AnimatedSection key={phase.step} delay={index * 150}>
                <div className="relative">
                  <div className="mb-6 font-serif text-7xl font-light text-primary/20">{phase.step}</div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">{phase.title}</p>
                  <h3 className="mt-2 font-serif text-3xl font-medium text-foreground">{phase.subtitle}</h3>
                  <p className="mt-4 text-muted-foreground">{phase.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Large Image Section */}
      <section className="px-6 py-24 md:py-32">
        <AnimatedSection className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/wedding-reception.jpg"
                alt="Beautiful wedding reception"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/40" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <h2 className="max-w-3xl font-serif text-3xl font-medium text-white md:text-5xl lg:text-6xl">
                Not event software.
                <span className="block mt-2">A wedding home worth returning to.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg text-white/80">
                Calm for couples. Effortless for guests. Beautiful enough to hold your memories.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Loved By Couples</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-foreground md:text-5xl">
              Real stories, real love
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "Finally, a wedding platform that feels as special as our day. Our guests are still talking about how easy it was.",
                name: "Sarah & Michael",
                location: "New York, NY",
              },
              {
                quote: "The photo gallery became our most treasured possession. Friends shared moments we never would have seen otherwise.",
                name: "Emma & David",
                location: "Los Angeles, CA",
              },
              {
                quote: "We used it for our wedding and now our anniversary. It's become the home for all our celebrations.",
                name: "Priya & James",
                location: "Chicago, IL",
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 100}>
                <div className="h-full rounded-2xl border border-border/60 bg-card p-8">
                  <p className="text-lg leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-6">
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-secondary/30 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Simple Pricing</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-foreground md:text-5xl">
              One price, everything included
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No hidden fees. No per-guest charges. Just one beautiful space for your wedding.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={150} className="mt-12 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-xl md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Most Popular
            </div>
            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="font-serif text-6xl font-medium text-foreground">$99</span>
              <span className="text-muted-foreground">one-time</span>
            </div>
            <p className="mt-4 text-muted-foreground">Everything you need for your perfect wedding</p>

            <ul className="mt-8 space-y-4 text-left">
              {[
                "Unlimited guests",
                "Custom timeline & schedule",
                "RSVP management",
                "Seating chart builder",
                "Photo & video gallery",
                "Anniversary updates forever",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="mt-10 w-full gap-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
              Start Your Wedding Space
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 md:py-32">
        <AnimatedSection className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl font-medium text-foreground md:text-5xl lg:text-6xl">
            Your love story deserves
            <span className="block text-primary">a beautiful home</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of couples who chose elegance over complexity.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 rounded-full bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
              Create Your Space
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Contact Us
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-serif text-xl font-medium text-foreground">Wedspace</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="transition-colors hover:text-foreground">Privacy</Link>
              <Link href="#" className="transition-colors hover:text-foreground">Terms</Link>
              <Link href="#" className="transition-colors hover:text-foreground">Support</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Wedspace. Made with love.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
