"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Users, Camera, Grid3X3, PartyPopper, MessageCircleHeart, ArrowRight, Check, Sparkles } from "lucide-react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/40 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-foreground tracking-wide">Your wedding, beautifully organized</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[1.1] tracking-tight mb-8 text-balance">
              Designed for your{" "}
              <span className="italic font-medium">Big Day</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-pretty">
              Easy-to-customize, effortless to share. Your private digital workspace for coordinating guests, organizing seating, and celebrating together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="text-base px-8 py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Create Your Wedding Space
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full border-border hover:bg-secondary">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-20 relative">
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
              <img 
                src="/modern-event-management-dashboard-with-calendar-an.jpg" 
                alt="Wedspace Dashboard" 
                className="w-full h-auto" 
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-4 lg:-left-8 top-1/4 hidden lg:block animate-in slide-in-from-left-4 duration-700">
              <div className="bg-card rounded-2xl shadow-xl p-6 border border-border w-64 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-2">Guest List</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary" />
                        <span>142 confirmed</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-3 w-3 rounded-full border border-muted-foreground flex items-center justify-center text-[8px]">?</span>
                        <span>18 pending RSVPs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 lg:-right-8 top-1/3 hidden lg:block animate-in slide-in-from-right-4 duration-700 delay-200">
              <div className="bg-card rounded-2xl shadow-xl p-6 border border-border w-64 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-2">Shared Memories</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>86 photos uploaded</p>
                      <p>12 video moments</p>
                      <p>34 guest messages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Features</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance">
              The Wedding Workspace, <span className="italic">Reinvented</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Mobile-first, effortless to manage. Everything your wedding needs in one beautiful space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Guest Coordination",
                description: "Send digital invites, track RSVPs in real time, and manage your entire guest list from one dashboard."
              },
              {
                icon: Grid3X3,
                title: "Seating Organization",
                description: "Drag-and-drop seating charts that make table assignments effortless. Group families and friends with ease."
              },
              {
                icon: Camera,
                title: "Shared Memories",
                description: "Guests upload photos and videos to a shared album in real time. Every moment captured beautifully."
              },
              {
                icon: PartyPopper,
                title: "Interactive Celebrations",
                description: "Live polls, guestbook messages, song requests, and celebration countdowns that bring everyone together."
              },
              {
                icon: Heart,
                title: "Private Wedding Space",
                description: "Each wedding gets its own private workspace — only invited guests can access it. Your celebration, your space."
              },
              {
                icon: MessageCircleHeart,
                title: "Couple & Guest Messaging",
                description: "Send updates, share schedules, and let guests leave heartfelt wishes — all within your workspace."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">How It Works</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance">
              Create a Stunning Wedding Space in <span className="italic">Minutes</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Easily customize everything — guests, seating, photos — and make your love story the star.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose Your Style",
                description: "Sign up and set up your private wedding workspace with your details, date, and story in minutes."
              },
              {
                step: "2",
                title: "Customize & Invite",
                description: "Send beautiful digital invitations and let guests RSVP, view seating, and join your celebration space."
              },
              {
                step: "3",
                title: "Celebrate Together",
                description: "Share photos, exchange messages, and relive every moment together in your shared wedding gallery."
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="h-20 w-20 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center mx-auto group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                    <span className="font-serif text-3xl font-light text-primary group-hover:text-primary-foreground transition-colors">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                </div>
                <h3 className="font-serif text-2xl font-medium mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Why Wedspace</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-6 text-balance">
              What Spreadsheets Can&apos;t Do <span className="italic">(But We Can)</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              See how your wedding planning can go from chaotic to seamless — without extra cost or hassle.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-lg">
              <div className="grid grid-cols-4 text-center">
                <div className="p-6 bg-secondary/50 border-b border-border"></div>
                <div className="p-6 border-b border-l border-border">
                  <p className="text-sm font-medium text-muted-foreground">Spreadsheets</p>
                </div>
                <div className="p-6 border-b border-l border-border">
                  <p className="text-sm font-medium text-muted-foreground">Other Apps</p>
                </div>
                <div className="p-6 border-b border-l border-border bg-primary/5">
                  <p className="text-sm font-semibold text-primary flex items-center justify-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Wedspace
                  </p>
                </div>
              </div>
              {[
                { feature: "Guest Management", spreadsheet: "Manual", other: "Basic", wedspace: "Seamless" },
                { feature: "Real-time Updates", spreadsheet: "None", other: "Limited", wedspace: "Instant" },
                { feature: "Photo Sharing", spreadsheet: "None", other: "Separate", wedspace: "Built-in" },
                { feature: "Seating Charts", spreadsheet: "Hard", other: "Basic", wedspace: "Drag & Drop" },
                { feature: "Guest Experience", spreadsheet: "Poor", other: "Okay", wedspace: "Premium" }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-4 text-center">
                  <div className="p-5 bg-secondary/50 border-b border-border text-left">
                    <p className="text-sm font-medium text-foreground">{row.feature}</p>
                  </div>
                  <div className="p-5 border-b border-l border-border">
                    <p className="text-sm text-muted-foreground">{row.spreadsheet}</p>
                  </div>
                  <div className="p-5 border-b border-l border-border">
                    <p className="text-sm text-muted-foreground">{row.other}</p>
                  </div>
                  <div className="p-5 border-b border-l border-border bg-primary/5">
                    <p className="text-sm font-medium text-primary">{row.wedspace}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Testimonials</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-6 text-balance">
              Don&apos;t Take Our Word for It
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              One workspace. Endless compliments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "Wedspace made managing our 200+ guest wedding feel effortless. The photo sharing feature was a hit!",
                author: "Sarah & Michael",
                location: "New York"
              },
              {
                quote: "Finally, a wedding tool that our parents could actually use. The interface is so elegant and simple.",
                author: "Emily & James",
                location: "California"
              },
              {
                quote: "The seating chart feature alone saved us hours of arguments. Absolute game changer for wedding planning.",
                author: "Priya & Raj",
                location: "London"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-serif font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-primary rounded-3xl p-12 md:p-20 shadow-2xl shadow-primary/20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary-foreground/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-primary-foreground mb-6 text-balance">
                Ready to plan your <span className="italic">perfect</span> wedding?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-pretty">
                Join thousands of couples who trust Wedspace to bring their wedding day to life.
              </p>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-10 py-6 rounded-full bg-card text-primary hover:bg-card/90 shadow-lg"
                >
                  Create Your Wedding Space
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
