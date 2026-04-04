"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, ImageIcon, BarChart3, Heart, Sparkles, BookHeart, Loader2, Bell } from "lucide-react"
import { format } from "date-fns"
import { MediaGallery } from "@/components/media-gallery"
import { MediaUpload } from "@/components/media-upload"
import { GuestPolls } from "@/components/guest-polls"
import { useRouter } from "next/navigation"
import { WeddingInvitationReveal } from "@/components/wedding-invitation-reveal"
import { Guestbook } from "@/components/guestbook"
import { GuestSeatSearch } from "@/components/guest-seat-search"
import { WeddingTimeline } from "@/components/wedding-timeline"
import { toast } from "sonner"

interface InviteAcceptanceProps {
  invite: any
}

function ConfettiParticle({ x, color, delay }: { x: number; color: string; delay: number }) {
  return (
    <div
      className="confetti-particle"
      style={{
        position: "absolute",
        left: `${x}%`,
        top: "-10px",
        width: "8px",
        height: "8px",
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        backgroundColor: color,
        animation: `confettiFall 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

const CONFETTI_COLORS = ["#b97971", "#d4a59a", "#e8cbc4", "#c9918a", "#a66b64", "#f5e6e3"]

const ROSE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    title: "Royal blush petals",
  },
  {
    src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=1200&q=80",
    title: "A gentle bloom",
  },
  {
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
    title: "Champagne rose glow",
  },
]

const MUSIC_SOURCE = "/audio/wedding-ambience.mp3"
const MUSIC_FALLBACK = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

export function InviteAcceptance({ invite }: InviteAcceptanceProps) {
  const [status, setStatus] = useState(invite.status)
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: invite.attendee_name || "",
    email: invite.attendee_email || "",
  })

  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const envelopeRef = useRef<HTMLDivElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)

  const confettiParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.8,
  }))

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/invite/${invite.invite_code}`)
    }
  }, [invite.invite_code])

  useEffect(() => {
    if (typeof window === "undefined") return

    const audio = new Audio(MUSIC_SOURCE)
    audio.loop = true
    audio.volume = 0.18
    audio.preload = "auto"
    audio.addEventListener("canplaythrough", () => setAudioLoaded(true))
    audio.addEventListener("error", () => {
      if (audio.src !== MUSIC_FALLBACK) {
        audio.src = MUSIC_FALLBACK
      }
    })

    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    // Initial page load animation
    gsap.set(contentRef.current, { opacity: 0, y: 40 })
    gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    })

    // Scroll-triggered animations for sections
    gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el, i) => {
      gsap.fromTo(el, 
        { 
          opacity: 0, 
          y: 60,
          scale: 0.96
        },
        {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.05,
          ease: "power3.out",
        }
      )
    })
  }, [status])

  function toggleMusic() {
    if (!audioRef.current) return

    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
      return
    }

    audioRef.current
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => {
        toast.error("Unable to play music automatically. Please click the music button.")
      })
  }

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: invite.invite_code,
          attendeeName: formData.name,
          attendeeEmail: formData.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowConfetti(true)
        setTimeout(() => {
          setStatus("accepted")
          setShowConfetti(false)
          toast.success(data.alreadyAccepted ? "Invite already accepted" : "Invitation accepted")
          router.refresh()
        }, 1800)
      } else {
        toast.error(data.error || "Failed to accept invitation")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to accept invitation.")
    } finally {
      setLoading(false)
    }
  }

  function openEnvelope() {
    const tl = gsap.timeline()

    tl.to(sealRef.current, {
      scale: 0.85,
      yoyo: true,
      repeat: 1,
      duration: 0.15,
    })

    tl.to(flapRef.current, {
      rotateX: -180,
      duration: 0.7,
      ease: "power2.inOut",
    })

    tl.to(".invite-card-inner", {
      y: -24,
      duration: 0.5,
      ease: "power2.out",
    })

    tl.to(envelopeRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.6,
    })

    tl.to(".invite-card", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: "power3.out",
    })

    setEnvelopeOpen(true)
    if (!isMusicPlaying) {
      toggleMusic()
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'Outfit', system-ui, sans-serif;
          --rose-50: #fdf8f7;
          --rose-100: #f5e6e3;
          --rose-200: #e8cbc4;
          --rose-300: #d4a59a;
          --rose-400: #c9918a;
          --rose-500: #b97971;
          --rose-600: #a66b64;
          --rose-700: #8a5750;
          --rose-800: #6e4641;
          --rose-900: #523533;
          --ink: #2d2926;
          --ink-muted: #6b6560;
          --cream: #fffcfb;
          --parchment: #fdf9f8;
        }

        .wedding-typography {
          font-family: var(--font-body);
          color: var(--ink);
        }

        .display-heading {
          font-family: var(--font-display);
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .envelope-flap {
          transform-origin: top center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .ornament-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 20px 0;
        }
        .ornament-divider::before,
        .ornament-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--rose-300), transparent);
        }
        .ornament-divider span {
          font-family: var(--font-display);
          font-size: 20px;
          color: var(--rose-500);
          line-height: 1;
        }

        .stellar-card {
          position: relative;
          background: rgba(255, 252, 251, 0.92);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(185, 121, 113, 0.12);
          border-radius: 28px;
          box-shadow: 
            0 4px 6px -1px rgba(185, 121, 113, 0.04),
            0 24px 48px -12px rgba(185, 121, 113, 0.12);
          overflow: hidden;
        }

        .stellar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--rose-400), var(--rose-500), var(--rose-400), transparent);
        }

        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.15); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .btn-loading {
          animation: heartPulse 1s ease infinite;
        }

        .envelope-body {
          background: linear-gradient(145deg, #fffcfb 0%, #fdf8f7 50%, #f5e6e3 100%);
          border: 1px solid rgba(185, 121, 113, 0.15);
          box-shadow: 
            0 40px 80px -20px rgba(185, 121, 113, 0.2),
            0 20px 40px -20px rgba(185, 121, 113, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .stellar-input {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: 15px;
          border: 1px solid rgba(185, 121, 113, 0.2);
          background: rgba(255, 255, 255, 0.95);
          color: var(--ink);
          border-radius: 14px;
          padding: 16px 20px;
          width: 100%;
          outline: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stellar-input:focus {
          border-color: var(--rose-500);
          box-shadow: 0 0 0 4px rgba(185, 121, 113, 0.1), 0 8px 16px rgba(185, 121, 113, 0.08);
        }
        .stellar-input::placeholder {
          color: #b5b0ad;
          font-weight: 300;
        }

        .section-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--rose-100), var(--rose-50));
          border: 1px solid rgba(185, 121, 113, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bell-deco {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255, 252, 251, 0.98), rgba(253, 248, 247, 0.95));
          border: 1px solid rgba(185, 121, 113, 0.12);
          display: grid;
          place-items: center;
          box-shadow: 0 16px 32px rgba(185, 121, 113, 0.12);
          backdrop-filter: blur(12px);
          animation: bellFloat 5s ease-in-out infinite;
        }
        .bell-deco-left {
          left: 6%;
          top: 10%;
          animation-delay: 0s;
        }
        .bell-deco-right {
          right: 6%;
          top: 14%;
          animation-delay: 1.5s;
        }

        .music-chime-panel {
          max-width: 420px;
          z-index: 10;
        }

        .music-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          padding: 14px 24px;
          background: linear-gradient(135deg, var(--rose-500), var(--rose-600));
          border: none;
          color: white;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(185, 121, 113, 0.3);
        }
        .music-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(185, 121, 113, 0.4);
        }
        .music-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .couple-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
        }
        .couple-card {
          position: relative;
          min-height: 240px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(185, 121, 113, 0.12);
          border: 1px solid rgba(185, 121, 113, 0.08);
        }
        .couple-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .couple-card:hover img {
          transform: scale(1.05);
        }
        .couple-card-caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(110, 70, 65, 0.7) 100%);
          color: white;
          font-weight: 500;
          letter-spacing: 0.01em;
          z-index: 1;
        }

        .music-panel {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        @keyframes bellFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-2deg); }
          50% { transform: translateY(-4px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
        }

        .floating-petals {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .petal {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50% 0 50% 50%;
          background: var(--rose-300);
          opacity: 0.3;
          animation: floatUp 6s ease-in-out infinite;
        }

        .scroll-section {
          opacity: 0;
          transform: translateY(40px);
        }

        .scroll-section.visible {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="wedding-typography relative min-h-screen overflow-x-hidden bg-gradient-to-b from-rose-50 via-cream to-rose-100" style={{ background: "linear-gradient(180deg, #fdf8f7 0%, #fffcfb 30%, #fdf8f7 100%)" }}>

        {/* Floating Petals Background */}
        <div className="floating-petals">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="petal"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${5 + Math.random() * 4}s`,
                opacity: 0.15 + Math.random() * 0.2,
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                background: i % 2 === 0 ? "var(--rose-300)" : "var(--rose-200)",
              }}
            />
          ))}
        </div>

        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {confettiParticles.map((p) => (
              <ConfettiParticle key={p.id} x={p.x} color={p.color} delay={p.delay} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <Heart
                  className="text-rose-500"
                  style={{
                    width: 72,
                    height: 72,
                    animation: "heartPulse 0.5s ease infinite",
                    filter: "drop-shadow(0 0 30px rgba(185, 121, 113, 0.6))",
                    color: "#b97971",
                  }}
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        )}

        <div ref={contentRef} className="relative z-10 px-4 py-8 sm:py-12">

          {(status === "accepted" || status === "scanned") ? (
            <div className="space-y-8 sm:space-y-12 max-w-2xl mx-auto">

              <div className="scroll-reveal">
                <WeddingInvitationReveal
                  title={invite.events.title}
                  eventDateISO={invite.events.event_date}
                  location={invite.events.location}
                  attendeeName={invite.attendee_name || formData.name}
                  inviteLink={inviteLink}
                  onDone={() => {
                    try {
                      window.sessionStorage.setItem(`invite-reveal-seen:${invite.invite_code}`, "1")
                    } catch {}
                  }}
                />
              </div>

              <div className="stellar-card scroll-reveal">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-3 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="section-icon">
                        <Bell size={18} style={{ color: "#b97971" }} />
                      </div>
                      <h2 className="display-heading text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>A beautiful celebration</h2>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                      Scroll through our curated couple gallery and let the gentle melody carry you into the wedding moment.
                    </p>
                  </div>
                  <div className="space-y-6 pt-4">
                    <div className="couple-gallery">
                      {ROSE_IMAGES.map((image) => (
                        <div key={image.src} className="couple-card">
                          <img src={image.src} alt={image.title} />
                          <div className="couple-card-caption">
                            <Sparkles size={14} style={{ color: "#e8cbc4" }} />
                            <span>{image.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="music-panel">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Wedding Music</p>
                        <p className="text-xs mt-1" style={{ color: "var(--ink-muted)" }}>Tap to play a soft, cinematic soundtrack built for your special moment.</p>
                      </div>
                      <button type="button" onClick={toggleMusic} className="music-button">
                        <Bell size={18} />
                        {isMusicPlaying ? "Pause Music" : audioLoaded ? "Play Music" : "Loading music..."}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-reveal">
                <WeddingTimeline eventId={invite.event_id} inviteCode={invite.invite_code} />
              </div>

              <div className="stellar-card scroll-reveal">
                <div className="p-6">
                  <div className="flex items-center gap-3 pb-4">
                    <div className="section-icon">
                      <MapPin size={18} style={{ color: "#b97971" }} />
                    </div>
                    <h2 className="display-heading text-xl sm:text-2xl" style={{ color: "var(--ink)" }}>Smart Seater Plan</h2>
                  </div>
                  <GuestSeatSearch eventId={invite.event_id} inviteCode={invite.invite_code} />
                </div>
              </div>

              <div className="stellar-card scroll-reveal">
                <div className="p-6">
                  <div className="flex items-center gap-3 pb-4">
                    <div className="section-icon">
                      <BarChart3 size={18} style={{ color: "#b97971" }} />
                    </div>
                    <h2 className="display-heading text-xl sm:text-2xl" style={{ color: "var(--ink)" }}>Wedding Polls</h2>
                  </div>
                  <GuestPolls eventId={invite.event_id} inviteCode={invite.invite_code} />
                </div>
              </div>

              <div className="stellar-card scroll-reveal">
                <div className="p-6">
                  <div className="flex items-center gap-3 pb-4">
                    <div className="section-icon">
                      <BookHeart size={18} style={{ color: "#b97971" }} />
                    </div>
                    <h2 className="display-heading text-xl sm:text-2xl" style={{ color: "var(--ink)" }}>Guestbook</h2>
                  </div>
                  <Guestbook
                    mode="guest"
                    eventId={invite.event_id}
                    inviteCode={invite.invite_code}
                    attendeeName={invite.attendee_name || formData.name}
                  />
                </div>
              </div>

              <div className="stellar-card scroll-reveal">
                <div className="p-6">
                  <div className="flex items-center gap-3 pb-4">
                    <div className="section-icon">
                      <ImageIcon size={18} style={{ color: "#b97971" }} />
                    </div>
                    <h2 className="display-heading text-xl sm:text-2xl" style={{ color: "var(--ink)" }}>Event Media</h2>
                  </div>
                  <MediaGallery eventId={invite.event_id} inviteCode={invite.invite_code} />
                </div>
              </div>

            </div>
          ) : (

            <div className="flex items-center justify-center min-h-[85vh] relative">
              <div className="bell-deco bell-deco-left">
                <Bell size={24} style={{ color: "#c9918a" }} />
              </div>
              <div className="bell-deco bell-deco-right">
                <Bell size={24} style={{ color: "#b97971" }} />
              </div>

              <div
                ref={envelopeRef}
                className="envelope-body relative rounded-[28px] overflow-visible"
                style={{
                  width: "min(360px, 90vw)",
                  height: 240,
                  perspective: 700,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(135deg, rgba(185, 121, 113, 0.04) 50%, transparent 50%),
                      linear-gradient(225deg, rgba(185, 121, 113, 0.04) 50%, transparent 50%)
                    `,
                    backgroundSize: "50% 100%",
                    backgroundPosition: "left, right",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "inherit",
                  }}
                />

                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "50%",
                    background: "linear-gradient(to top right, rgba(185, 121, 113, 0.06) 50%, transparent 50%), linear-gradient(to top left, rgba(185, 121, 113, 0.06) 50%, transparent 50%)",
                    backgroundSize: "50% 100%",
                    backgroundPosition: "left, right",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "0 0 20px 20px",
                  }}
                />

                <div
                  ref={flapRef}
                  className="envelope-flap absolute top-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "50%",
                    background: "linear-gradient(to bottom right, rgba(185, 121, 113, 0.05) 50%, transparent 50%), linear-gradient(to bottom left, rgba(185, 121, 113, 0.05) 50%, transparent 50%)",
                    backgroundSize: "50% 100%",
                    backgroundPosition: "left, right",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "20px 20px 0 0",
                    zIndex: 2,
                  }}
                />

                <div
                  ref={sealRef}
                  onClick={openEnvelope}
                  className="absolute z-10 w-[68px] h-[68px] rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
                  style={{
                    background: "linear-gradient(135deg, #b97971, #a66b64)",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    border: "3px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 8px 32px rgba(185, 121, 113, 0.35)",
                  }}
                >
                  <div
                    className="absolute inset-2 rounded-full pointer-events-none"
                    style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      color: "white",
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                    }}
                  >
                    Open
                  </span>
                </div>

                <div
                  className="invite-card-inner absolute left-4 right-4 bottom-3 h-5 rounded-t-lg pointer-events-none"
                  style={{ background: "#fffcfb", opacity: 0.9, zIndex: 1 }}
                />
              </div>

              <div className="music-chime-panel absolute left-1/2 top-full mt-8 -translate-x-1/2 rounded-2xl border bg-white/98 px-5 py-4 shadow-xl backdrop-blur-xl" style={{ borderColor: "rgba(185, 121, 113, 0.12)" }}>
                <div className="flex items-center gap-4">
                  <Bell size={20} style={{ color: "#b97971" }} />
                  <div className="text-sm" style={{ color: "var(--ink)" }}>
                    <div className="font-semibold">Ceremony soundscape</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--ink-muted)" }}>Tap to hear the wedding intro while you open your invitation.</div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleMusic}
                    disabled={!audioLoaded}
                    className="music-button"
                  >
                    {isMusicPlaying ? "Pause" : audioLoaded ? "Play" : "Loading"}
                  </button>
                </div>
              </div>

              <div
                className="invite-card absolute w-full px-4"
                style={{ maxWidth: 440, opacity: 0, transform: "translateY(30px) scale(0.96)" }}
              >
                <Card
                  className="bg-white/98 backdrop-blur-2xl rounded-[28px] overflow-hidden border-0"
                  style={{
                    boxShadow: "0 40px 100px rgba(185, 121, 113, 0.2), 0 8px 32px rgba(185, 121, 113, 0.12)",
                  }}
                >
                  <div className="h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" style={{ background: "linear-gradient(90deg, transparent, #b97971, transparent)" }} />
                  <CardHeader className="text-center pb-0 pt-10 px-8 sm:px-10">
                    <CardTitle
                      className="display-heading text-2xl sm:text-3xl"
                      style={{ color: "var(--ink)", lineHeight: 1.3 }}
                    >
                      {invite.events.title}
                    </CardTitle>

                    <div className="ornament-divider mt-5">
                      <span>&#10022;</span>
                    </div>

                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontSize: "17px",
                        color: "var(--ink-muted)",
                        fontWeight: 400,
                        marginTop: -4,
                      }}
                    >
                      You are warmly invited
                    </p>
                  </CardHeader>

                  <CardContent className="px-8 sm:px-10 pb-10 pt-8">
                    <div className="rounded-2xl border p-6 sm:p-7" style={{ borderColor: "rgba(185, 121, 113, 0.15)", background: "rgba(253, 248, 247, 0.5)" }}>
                      <form onSubmit={handleAccept} className="space-y-5">

                        <div className="space-y-2">
                          <label
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "11px",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "var(--ink-muted)",
                              fontWeight: 600,
                            }}
                          >
                            Your Name
                          </label>
                          <input
                            className="stellar-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "11px",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "var(--ink-muted)",
                              fontWeight: 600,
                            }}
                          >
                            Email
                          </label>
                          <input
                            className="stellar-input"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Email"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className={loading ? "btn-loading" : ""}
                          style={{
                            width: "100%",
                            padding: "18px 28px",
                            borderRadius: 9999,
                            background: loading 
                              ? "rgba(185, 121, 113, 0.6)" 
                              : "linear-gradient(135deg, #b97971, #a66b64)",
                            color: "white",
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            marginTop: 16,
                            boxShadow: "0 8px 24px rgba(185, 121, 113, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"
                              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(185, 121, 113, 0.4)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(185, 121, 113, 0.3)"
                          }}
                        >
                          {loading ? (
                            <>
                              <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                              Confirming...
                            </>
                          ) : (
                            "Accept Invitation"
                          )}
                        </button>

                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  )
}
