import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, QrCode, Users, Sparkles, CheckCircle, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EventFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>The future of event management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            Create Events,
            <span className="text-primary"> Share Invites</span>, Track Attendance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            The complete event management platform that transforms how you organize gatherings. Generate QR codes,
            manage invitations, and track attendees in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-base px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">No credit card required • Free 14-day trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features designed to make event management effortless
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Event Creation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create beautiful events in seconds with our intuitive dashboard. Set date, time, location, and customize
              every detail.
            </p>
          </div>
          <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">QR Code Generation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatic QR code generation for each invite. Attendees can easily check-in by scanning their unique code.
            </p>
          </div>
          <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Invitations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share invite links that capture attendee info automatically. Track RSVPs and manage your guest list
              effortlessly.
            </p>
          </div>
          <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get instant notifications when attendees accept invites or check in. Stay informed every step of the way.
            </p>
          </div>
          <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Check-in Scanner</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built-in QR scanner for seamless check-ins. Verify attendees instantly and update status in real-time.
            </p>
          </div>
          <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track attendance rates, analyze trends, and make data-driven decisions for future events.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Create Your Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sign up and create your first event with all the essential details in minutes
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Share Invites</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate and share unique invite links with your guests via email or social media
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Scan QR Codes</h3>
            <p className="text-muted-foreground leading-relaxed">
              Attendees check in by scanning their unique QR code. Track everything in real-time
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-primary text-primary-foreground rounded-3xl p-12 md:p-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to transform your events?</h2>
          <p className="text-lg mb-8 opacity-90 text-pretty max-w-2xl mx-auto">
            Join thousands of event organizers who trust EventFlow for their event management needs
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">EventFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 EventFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
