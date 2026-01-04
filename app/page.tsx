import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, QrCode, Users, Sparkles, CheckCircle, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EventFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-foreground">
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
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>The future of event management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance text-foreground">
            Create Events,
            <span className="text-primary"> Share Invites</span>, Track Attendance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            The complete event management platform that transforms how you organize gatherings. Generate QR codes,
            manage invitations, and track attendees in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-base px-8 shadow-sm hover:shadow-md transition-shadow">
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-white border-2 hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
            >
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">No credit card required • Free 14-day trial</p>
        </div>

        <div className="max-w-6xl mx-auto mt-16 relative">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
            <img src="/modern-event-management-dashboard-with-calendar-an.jpg" alt="EventFlow Dashboard" className="w-full h-auto" />
          </div>

          {/* Floating UI Cards */}
          <div className="absolute -left-4 top-1/4 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border w-64">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">Action Items</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      <span>Send proposals</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                      <span>Schedule follow-up</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/3 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border w-64">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-2">AI Summary</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Review competitor analysis</p>
                    <p>• Focus on Retention Metrics</p>
                    <p>• Launch new onboarding flow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Everything you need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features designed to make event management effortless
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Easy Event Creation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create beautiful events in seconds with our intuitive dashboard. Set date, time, location, and customize
              every detail.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">QR Code Generation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatic QR code generation for each invite. Attendees can easily check-in by scanning their unique code.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Invitations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share invite links that capture attendee info automatically. Track RSVPs and manage your guest list
              effortlessly.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Real-time Updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get instant notifications when attendees accept invites or check in. Stay informed every step of the way.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Check-in Scanner</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built-in QR scanner for seamless check-ins. Verify attendees instantly and update status in real-time.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Analytics & Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track attendance rates, analyze trends, and make data-driven decisions for future events.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Create Your Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sign up and create your first event with all the essential details in minutes
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Share Invites</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate and share unique invite links with your guests via email or social media
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Scan QR Codes</h3>
            <p className="text-muted-foreground leading-relaxed">
              Attendees check in by scanning their unique QR code. Track everything in real-time
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 shadow-lg">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to transform your events?</h2>
          <p className="text-lg mb-8 opacity-90 text-pretty max-w-2xl mx-auto">
            Join thousands of event organizers who trust EventFlow for their event management needs
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 bg-white text-primary hover:bg-white/90 shadow-md"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">EventFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 EventFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
