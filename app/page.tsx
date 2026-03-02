"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Users, Camera, Grid3X3, PartyPopper, MessageCircleHeart, ArrowRight } from "lucide-react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="home">
          <Navbar />
      {/* Hero Section */}
      <section className="hero ">
        <div className="announce">
          <div className="dot">
            <div className="pulse">
            </div>
          </div>
          <p>Your wedding, beautifully organized</p>
        </div>
        <h1>Turn Your Wedding Into a Private Digital Workspace</h1>
        <p className="subtitle">
          Coordinate guests, organize seating, share photos, and celebrate together — all in one beautiful space made just for your big day.
        </p>

        <div className="actions">
          <a href="/sign-up" className="cta">
            Create Your Wedding Space <ArrowRight className="icon" />
          </a>
          <Link href="#how-it-works" className="cta">
            See How It Works
          </Link>
        </div>

        <div className="max-w-6xl mx-auto mt-16 relative">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
            <img src="/modern-event-management-dashboard-with-calendar-an.jpg" alt="Wedspace Dashboard" className="w-full h-auto" />
          </div>

          {/* Floating UI Cards */}
          <div className="absolute -left-4 top-1/4 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border w-64">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">Guest List</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      <span>142 confirmed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                      <span>18 pending RSVPs</span>
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
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-2">Shared Memories</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• 86 photos uploaded</p>
                    <p>• 12 video moments</p>
                    <p>• 34 guest messages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Everything your wedding needs</h2>
              <p>One workspace to plan, coordinate, and celebrate your perfect day</p>
            </div>
          </div>

        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Guest Coordination</h3>
            <p className="text-muted-foreground leading-relaxed">
              Send digital invites, track RSVPs in real time, and manage your entire guest list from one dashboard. No spreadsheet chaos.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Grid3X3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Seating Organization</h3>
            <p className="text-muted-foreground leading-relaxed">
              Drag-and-drop seating charts that make table assignments effortless. Group families, friends, and plus-ones with ease.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Shared Wedding Memories</h3>
            <p className="text-muted-foreground leading-relaxed">
              Guests upload photos and videos to a shared album in real time. Every moment captured, all in one beautiful gallery.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <PartyPopper className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Interactive Celebrations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Live polls, guestbook messages, song requests, and celebration countdowns that bring everyone together before and during the big day.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Private Wedding Space</h3>
            <p className="text-muted-foreground leading-relaxed">
              Each wedding gets its own private workspace — only invited guests can access it. Your celebration, your space.
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-6">
              <MessageCircleHeart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Couple & Guest Messaging</h3>
            <p className="text-muted-foreground leading-relaxed">
              Send updates, share schedules, and let guests leave heartfelt wishes — all within your wedding workspace.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            From setup to celebration in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Create Your Wedding Space</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sign up and set up your private wedding workspace with your details, date, and story in minutes
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Invite Your Guests</h3>
            <p className="text-muted-foreground leading-relaxed">
              Send beautiful digital invitations and let guests RSVP, view seating, and join the celebration space
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Celebrate Together</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share photos, exchange messages, and relive every moment together in your shared wedding gallery
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 shadow-lg">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to plan your perfect wedding?</h2>
          <p className="text-lg mb-8 opacity-90 text-pretty max-w-2xl mx-auto">
            Join thousands of couples who trust Wedspace to bring their wedding day to life
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 bg-white text-primary hover:bg-white/90 shadow-md"
            >
              Create Your Wedding Space
            </Button>
          </Link>
        </div>
      </section>
<Footer />
    </div>
  )
}
