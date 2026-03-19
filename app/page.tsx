"use client"

import { Button } from "@/components/ui/button"
import { Heart, Users, Camera, Grid3X3, PartyPopper, MessageCircleHeart, ArrowRight, Check, Sparkles } from "lucide-react"
import React, { useRef, useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// ─── GSAP 3D Flower Canvas ────────────────────────────────────────────────────

const FlowerCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    interface Petal {
      angle: number
      length: number
      width: number
      curve: number
    }

    interface Flower {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      rotX: number
      rotY: number
      rotZ: number
      rotVX: number
      rotVY: number
      rotVZ: number
      size: number
      petalCount: number
      color: string
      alpha: number
      life: number
      maxLife: number
      petals: Petal[]
      type: number
    }

    const flowers: Flower[] = []
    const COLORS = [
      "rgba(100,140,200,",
      "rgba(130,165,220,",
      "rgba(160,195,240,",
      "rgba(90,125,190,",
      "rgba(145,180,230,",
      "rgba(75,110,175,",
    ]

    const createFlower = (): Flower => {
      const petalCount = Math.floor(Math.random() * 3) + 4
      const petals: Petal[] = []
      for (let i = 0; i < petalCount; i++) {
        petals.push({
          angle: (i / petalCount) * Math.PI * 2,
          length: 0.8 + Math.random() * 0.4,
          width: 0.4 + Math.random() * 0.3,
          curve: 0.2 + Math.random() * 0.3,
        })
      }
      return {
        x: Math.random() * (canvas?.width ?? 800),
        y: (canvas?.height ?? 600) + 50,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.6 + Math.random() * 1.2),
        vz: (Math.random() - 0.5) * 0.5,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotVX: (Math.random() - 0.5) * 0.025,
        rotVY: (Math.random() - 0.5) * 0.03,
        rotVZ: (Math.random() - 0.5) * 0.02,
        size: 12 + Math.random() * 24,
        petalCount,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0,
        life: 0,
        maxLife: 200 + Math.random() * 200,
        petals,
        type: Math.floor(Math.random() * 3),
      }
    }

    const project3D = (x: number, y: number, z: number) => {
      const fov = 400
      const scale = fov / (fov + z)
      return { x, y, scale }
    }

    const draw3DFlower = (f: Flower) => {
      if (!ctx || !canvas) return
      const { x, y, scale } = project3D(f.x, f.y, f.z)
      const s = f.size * scale
      const fadeIn = Math.min(1, f.life / 30)
      const fadeOut = Math.min(1, (f.maxLife - f.life) / 40)
      const alpha = f.alpha * fadeIn * fadeOut

      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      // 3D rotation matrix effect
      const cosX = Math.cos(f.rotX)
      const sinX = Math.sin(f.rotX)
      const cosY = Math.cos(f.rotY)

      ctx.rotate(f.rotZ)

      // Draw petals with 3D perspective
      f.petals.forEach((petal, i) => {
        const baseAngle = petal.angle + f.rotZ * 0.5
        const depthOffset = Math.sin(baseAngle + f.rotY) * cosX

        ctx.save()
        ctx.rotate(baseAngle)

        const petalAlpha = alpha * (0.6 + depthOffset * 0.4)
        const scale3d = 0.7 + depthOffset * 0.3

        ctx.scale(1, scale3d * Math.abs(cosX) + 0.15)

        if (f.type === 0) {
          // Round petals
          ctx.beginPath()
          ctx.ellipse(s * petal.length * 0.5, 0, s * petal.length * 0.5, s * petal.width, 0, 0, Math.PI * 2)
          const grd = ctx.createRadialGradient(0, 0, 0, s * petal.length * 0.5, 0, s * petal.length)
          grd.addColorStop(0, f.color + (petalAlpha * 0.9) + ")")
          grd.addColorStop(1, f.color + (petalAlpha * 0.2) + ")")
          ctx.fillStyle = grd
          ctx.fill()
        } else if (f.type === 1) {
          // Pointed petals
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.bezierCurveTo(
            s * 0.3, -s * petal.width * 0.7,
            s * petal.length * 0.7, -s * petal.width * 0.5,
            s * petal.length, 0
          )
          ctx.bezierCurveTo(
            s * petal.length * 0.7, s * petal.width * 0.5,
            s * 0.3, s * petal.width * 0.7,
            0, 0
          )
          const grd2 = ctx.createLinearGradient(0, 0, s * petal.length, 0)
          grd2.addColorStop(0, f.color + (petalAlpha * 0.95) + ")")
          grd2.addColorStop(0.6, f.color + (petalAlpha * 0.7) + ")")
          grd2.addColorStop(1, f.color + (petalAlpha * 0.15) + ")")
          ctx.fillStyle = grd2
          ctx.fill()
        } else {
          // Cherry blossom petals
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.bezierCurveTo(s * 0.2, -s * petal.width, s * petal.length * 0.5, -s * petal.width * 0.9, s * petal.length * 0.5, 0)
          ctx.bezierCurveTo(s * petal.length * 0.5, s * petal.width * 0.9, s * 0.2, s * petal.width, 0, 0)
          const grd3 = ctx.createRadialGradient(s * 0.15, 0, 0, s * 0.5, 0, s * petal.length * 0.8)
          grd3.addColorStop(0, "rgba(210,225,250," + (petalAlpha * 0.95) + ")")
          grd3.addColorStop(0.5, f.color + (petalAlpha * 0.75) + ")")
          grd3.addColorStop(1, f.color + (petalAlpha * 0.1) + ")")
          ctx.fillStyle = grd3
          ctx.fill()

          // Notch at tip
          ctx.beginPath()
          ctx.arc(s * petal.length * 0.5, 0, s * 0.08, 0, Math.PI * 2)
          ctx.fillStyle = f.color + (petalAlpha * 0.3) + ")"
          ctx.fill()
        }

        ctx.restore()
      })

      // Center disc with 3D shading
      const centerSize = s * 0.22
      const centerGrd = ctx.createRadialGradient(-centerSize * 0.3 * cosY, -centerSize * 0.3 * cosX, 0, 0, 0, centerSize)
      centerGrd.addColorStop(0, "rgba(220,235,255," + (alpha * 0.95) + ")")
      centerGrd.addColorStop(0.5, "rgba(180,205,245," + (alpha * 0.8) + ")")
      centerGrd.addColorStop(1, "rgba(130,165,220," + (alpha * 0.4) + ")")
      ctx.beginPath()
      ctx.arc(0, 0, centerSize, 0, Math.PI * 2)
      ctx.fillStyle = centerGrd
      ctx.fill()

      // Center shadow for depth
      ctx.beginPath()
      ctx.arc(centerSize * 0.2 * cosY, centerSize * 0.2, centerSize * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(50,90,160," + (alpha * 0.15) + ")"
      ctx.fill()

      ctx.restore()
    }

    let frame = 0
    let animId: number

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (frame % 18 === 0 && flowers.length < 28) {
        flowers.push(createFlower())
      }

      for (let i = flowers.length - 1; i >= 0; i--) {
        const f = flowers[i]
        f.life++

        // Drift and sway
        f.vx += Math.sin(f.life * 0.03 + f.z * 0.01) * 0.015
        f.x += f.vx
        f.y += f.vy
        f.z += f.vz * 0.5

        // Spin
        f.rotX += f.rotVX
        f.rotY += f.rotVY
        f.rotZ += f.rotVZ

        // Dampen
        f.vx *= 0.995
        f.rotVX *= 0.998
        f.rotVY *= 0.998

        // Alpha ramp
        f.alpha = 0.75 + Math.sin(f.life * 0.04) * 0.1

        draw3DFlower(f)

        if (f.life >= f.maxLife || f.y < -100) {
          flowers.splice(i, 1)
        }
      }

      frame++
      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? scrolled / max : 0)
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-50" style={{ background: "rgba(80,120,200,0.12)" }}>
      <div
        className="h-full transition-all duration-75"
        style={{
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #4878c8 0%, #7aabdc 50%, #a8c8ee 100%)",
          boxShadow: "0 0 8px rgba(72,120,200,0.6)",
        }}
      />
    </div>
  )
}

// ─── GSAP-style Reveal Hook (CSS-based, no external GSAP needed) ──────────────

const useReveal = (threshold = 0.12) => {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [val, setVal] = useState(0)
  const { ref, visible } = useReveal()

  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = to / 60
    const t = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(t) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(t)
  }, [visible, to])

  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{val.toLocaleString()}{suffix}</span>
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

const FeatureCard = ({ icon: Icon, title, description, index }: {
  icon: React.ElementType; title: string; description: string; index: number
}) => {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative overflow-hidden rounded-2xl p-8 border transition-all duration-700 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(48px) scale(0.96)",
        transitionDelay: `${index * 80}ms`,
        background: "rgba(248,251,255,0.7)",
        borderColor: "rgba(90,140,200,0.18)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 24px rgba(60,110,180,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(100,150,220,0.08) 0%, transparent 65%)" }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ background: "linear-gradient(90deg, transparent, rgba(72,120,200,0.5), transparent)" }}
      />

      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
        style={{ background: "linear-gradient(135deg, rgba(100,150,210,0.15), rgba(140,185,235,0.25))", boxShadow: "0 2px 12px rgba(60,110,180,0.12)" }}
      >
        <Icon className="h-5 w-5" style={{ color: "#4878c8" }} />
      </div>
      <h3 className="font-serif text-xl font-medium mb-3" style={{ color: "#1a2a3a", letterSpacing: "-0.01em" }}>{title}</h3>
      <p className="leading-relaxed text-sm" style={{ color: "#4a6080" }}>{description}</p>
    </div>
  )
}

// ─── Step Card ────────────────────────────────────────────────────────────────

const StepCard = ({ step, title, description, isLast, index }: {
  step: string; title: string; description: string; isLast: boolean; index: number
}) => {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease, transform 0.7s ease`,
        transitionDelay: `${index * 130}ms`,
      }}
    >
      <div className="relative mb-8 inline-block">
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-125"
          style={{ background: "radial-gradient(circle, rgba(80,140,210,0.18), transparent 70%)" }}
        />
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center mx-auto relative transition-all duration-400 group-hover:scale-105"
          style={{
            background: "linear-gradient(135deg, rgba(100,150,210,0.12), rgba(140,185,235,0.2))",
            border: "2px solid rgba(90,140,200,0.3)",
            boxShadow: "0 4px 24px rgba(60,110,180,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <span className="font-serif text-3xl font-light" style={{ color: "#4878c8" }}>{step}</span>
        </div>
        {!isLast && (
          <div className="hidden md:block absolute top-10 left-[60%] w-full h-px" style={{ background: "linear-gradient(90deg, rgba(90,140,200,0.35), transparent)" }} />
        )}
      </div>
      <h3 className="font-serif text-2xl font-medium mb-4" style={{ color: "#1a2a3a" }}>{title}</h3>
      <p className="leading-relaxed text-sm" style={{ color: "#4a6080" }}>{description}</p>
    </div>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

const TestimonialCard = ({ quote, author, location, index }: {
  quote: string; author: string; location: string; index: number
}) => {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="rounded-2xl p-8 text-center relative overflow-hidden border transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(40px) rotateX(6deg)",
        transitionDelay: `${index * 100}ms`,
        background: "rgba(248,251,255,0.75)",
        borderColor: "rgba(90,140,200,0.15)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 32px rgba(60,110,180,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(100,150,220,0.4), transparent)" }}
      />
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Heart key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#5a90d8" }} />
        ))}
      </div>
      <p className="mb-6 leading-relaxed italic text-sm" style={{ color: "#2a3d5a" }}>&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-serif font-medium" style={{ color: "#1a2a3a" }}>{author}</p>
        <p className="text-xs mt-1" style={{ color: "#6080a0" }}>{location}</p>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ eyebrow, heading, sub }: { eyebrow: string; heading: React.ReactNode; sub: string }) => {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center max-w-3xl mx-auto mb-20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.85s ease, transform 0.85s ease",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: "#4878c8" }}>{eyebrow}</p>
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-balance leading-[1.1]" style={{ color: "#1a2a3a", letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <p className="leading-relaxed" style={{ color: "#4a6080" }}>{sub}</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Mouse-follow glow on hero
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      hero.style.setProperty("--gx", `${x}%`)
      hero.style.setProperty("--gy", `${y}%`)
    }
    hero.addEventListener("mousemove", handleMove)
    return () => hero.removeEventListener("mousemove", handleMove)
  }, [])

  const heroFade = (delay: number) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.9s ease, transform 0.9s ease`,
    transitionDelay: `${delay}ms`,
  })

  return (
    <div
      className="min-h-screen selection:bg-rose-100"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: "linear-gradient(160deg, #f5f8fd 0%, #f0f5fb 40%, #f5f7fc 100%)",
      }}
    >
      <ScrollProgress />
      <FlowerCanvas />
      <Navbar />

      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-36 pb-36"
        style={{ zIndex: 2 }}
      >
        {/* Mouse-follow gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle 60vw at var(--gx,50%) var(--gy,40%), rgba(100,150,220,0.07) 0%, transparent 70%)" }}
        />
        {/* Ambient blobs */}
        <div className="absolute top-10 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(100,155,220,0.09) 0%, transparent 70%)", transform: "translate(-30%, -20%)" }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(120,170,235,0.07) 0%, transparent 70%)", transform: "translate(20%, 20%)" }} />

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(90,140,205,0.25), transparent)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">

            {/* Badge */}
            <div style={heroFade(0)} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 border"
              css_style={{
                background: "rgba(255,250,252,0.85)",
                borderColor: "rgba(100,150,210,0.25)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 16px rgba(80,130,200,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#7aaad8" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#4878c8" }} />
              </span>
              <span className="text-sm font-medium tracking-wide" style={{ color: "#2a4a7a", fontFamily: "'Gill Sans', 'Optima', sans-serif" }}>
                Your wedding, beautifully organized
              </span>
            </div>

            {/* Headline */}
            <h1 style={heroFade(120)} className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight mb-8 text-balance"
              css_style={{ color: "#1a2a3a", letterSpacing: "-0.03em" }}>
              Designed for your{" "}
              <span className="italic font-medium" style={{
                color: "#4878c8",
                background: "linear-gradient(135deg, #4878c8 0%, #7aaae0 50%, #5888c8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Big Day</span>
            </h1>

            <p style={heroFade(240)} className="text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed" css_style={{ color: "#4a6080", fontFamily: "'Gill Sans', 'Optima', sans-serif" }}>
              Easy-to-customize, effortless to share. Your private digital workspace for coordinating guests, organizing seating, and celebrating together.
            </p>

            {/* CTA */}
            <div style={heroFade(360)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/sign-up">
                <button
                  className="group relative overflow-hidden inline-flex items-center gap-2 text-base font-medium px-9 py-4 rounded-full transition-all duration-400"
                  style={{
                    background: "linear-gradient(135deg, #4878c8 0%, #5a8ad8 50%, #6a9adc 100%)",
                    color: "white",
                    boxShadow: "0 8px 32px rgba(72,120,200,0.35), 0 2px 8px rgba(72,120,200,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
                    fontFamily: "'Gill Sans', 'Optima', sans-serif",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 40px rgba(72,120,200,0.45), 0 4px 12px rgba(72,120,200,0.25), inset 0 1px 0 rgba(255,255,255,0.25)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(72,120,200,0.35), 0 2px 8px rgba(72,120,200,0.2), inset 0 1px 0 rgba(255,255,255,0.25)" }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px) scale(0.98)" }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)" }}
                >
                  <span className="relative">Create Your Wedding Space</span>
                  <ArrowRight className="h-4 w-4 relative transition-transform duration-300 group-hover:translate-x-1" />
                  {/* shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)", transform: "skewX(-20deg)" }} />
                </button>
              </a>
              <a href="#how-it-works">
                <button
                  className="inline-flex items-center gap-2 text-base font-medium px-9 py-4 rounded-full border transition-all duration-300"
                  style={{
                    color: "#2a4a7a",
                    borderColor: "rgba(80,130,200,0.35)",
                    background: "rgba(248,251,255,0.7)",
                    backdropFilter: "blur(8px)",
                    fontFamily: "'Gill Sans', 'Optima', sans-serif",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,150,220,0.1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(72,120,200,0.5)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,251,255,0.7)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(80,130,200,0.35)" }}
                >
                  See How It Works
                </button>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ ...heroFade(500), marginTop: "5rem", position: "relative" }}>
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-3 rounded-[28px] opacity-40 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(100,150,210,0.2), rgba(140,185,235,0.1), rgba(100,150,210,0.2))", border: "1px solid rgba(100,150,210,0.2)" }} />
              <div className="rounded-3xl overflow-hidden border relative"
                style={{ borderColor: "rgba(90,140,200,0.2)", boxShadow: "0 40px 100px rgba(60,110,180,0.12), 0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000"
                  alt="Wedspace Dashboard"
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
                {/* Image overlay tint */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(253,248,251,0.25) 100%)" }} />
              </div>
            </div>

            {/* Floating Cards */}
            <div
              className="absolute -left-4 lg:-left-10 top-1/4 hidden lg:block"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateX(0)" : "translateX(-24px)", transition: "opacity 0.7s ease 0.9s, transform 0.7s ease 0.9s" }}
            >
              <div className="rounded-2xl p-5 w-60 border"
                style={{ background: "rgba(248,251,255,0.9)", borderColor: "rgba(90,140,200,0.2)", backdropFilter: "blur(16px)", boxShadow: "0 12px 40px rgba(60,110,180,0.12), 0 3px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(100,150,210,0.15), rgba(140,185,235,0.25))" }}>
                    <Users className="h-4 w-4" style={{ color: "#4878c8" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: "#1a2a3a", fontFamily: "'Gill Sans', sans-serif" }}>Guest List</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs" style={{ color: "#7090b0" }}>
                        <Check className="h-3 w-3" style={{ color: "#4878c8" }} />
                        <span>142 confirmed</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: "#7090b0" }}>
                        <span className="h-3 w-3 rounded-full border flex items-center justify-center text-[7px]" style={{ borderColor: "#90b0d0", color: "#90b0d0" }}>?</span>
                        <span>18 pending RSVPs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 lg:-right-10 top-1/3 hidden lg:block"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateX(0)" : "translateX(24px)", transition: "opacity 0.7s ease 1.1s, transform 0.7s ease 1.1s" }}
            >
              <div className="rounded-2xl p-5 w-60 border"
                style={{ background: "rgba(248,251,255,0.9)", borderColor: "rgba(90,140,200,0.2)", backdropFilter: "blur(16px)", boxShadow: "0 12px 40px rgba(60,110,180,0.12), 0 3px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(100,150,210,0.15), rgba(140,185,235,0.25))" }}>
                    <Camera className="h-4 w-4" style={{ color: "#4878c8" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: "#1a2a3a", fontFamily: "'Gill Sans', sans-serif" }}>Shared Memories</p>
                    <div className="space-y-1 text-xs" style={{ color: "#7090b0" }}>
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

      {/* ─── Stats Band ─── */}
      <div className="relative py-16 border-y" style={{ zIndex: 2, borderColor: "rgba(90,140,200,0.12)", background: "rgba(248,251,255,0.6)", backdropFilter: "blur(8px)" }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { val: 12000, suffix: "+", label: "Couples Celebrating" },
            { val: 98, suffix: "%", label: "Satisfaction Rate" },
            { val: 3, suffix: " min", label: "Setup Time" },
          ].map((stat, i) => {
            const { ref, visible } = useReveal()
            return (
              <div key={i} ref={ref as React.RefObject<HTMLDivElement>}
                style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms` }}>
                <div className="font-serif text-4xl md:text-5xl font-light mb-2" style={{ color: "#4878c8", letterSpacing: "-0.02em" }}>
                  <Counter to={stat.val} suffix={stat.suffix} />
                </div>
                <p className="text-sm" style={{ color: "#6080a0", fontFamily: "'Gill Sans', 'Optima', sans-serif" }}>{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Features ─── */}
      <section id="features" className="relative py-28 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 70% 50%, rgba(100,155,220,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Features"
            heading={<>The Wedding Workspace, <em>Reinvented</em></>}
            sub="Mobile-first, effortless to manage. Everything your wedding needs in one beautiful space."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: "Guest Coordination", description: "Send digital invites, track RSVPs in real time, and manage your entire guest list from one dashboard." },
              { icon: Grid3X3, title: "Seating Organization", description: "Drag-and-drop seating charts that make table assignments effortless. Group families and friends with ease." },
              { icon: Camera, title: "Shared Memories", description: "Guests upload photos and videos to a shared album in real time. Every moment captured beautifully." },
              { icon: PartyPopper, title: "Interactive Celebrations", description: "Live polls, guestbook messages, song requests, and celebration countdowns that bring everyone together." },
              { icon: Heart, title: "Private Wedding Space", description: "Each wedding gets its own private workspace — only invited guests can access it. Your celebration, your space." },
              { icon: MessageCircleHeart, title: "Couple & Guest Messaging", description: "Send updates, share schedules, and let guests leave heartfelt wishes — all within your workspace." },
            ].map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="relative py-28 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(253,248,251,0) 0%, rgba(253,246,250,0.6) 50%, rgba(253,248,251,0) 100%)" }} />
        {/* Ornamental divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none">
          <div className="w-24 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(72,120,200,0.3))" }} />
          <Heart className="h-3 w-3" style={{ color: "rgba(72,120,200,0.4)" }} />
          <div className="w-24 h-px" style={{ background: "linear-gradient(90deg, rgba(72,120,200,0.3), transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How It Works"
            heading={<>Create a Stunning Wedding Space in <em>Minutes</em></>}
            sub="Easily customize everything — guests, seating, photos — and make your love story the star."
          />
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Choose Your Style", description: "Sign up and set up your private wedding workspace with your details, date, and story in minutes." },
              { step: "2", title: "Customize & Invite", description: "Send beautiful digital invitations and let guests RSVP, view seating, and join your celebration space." },
              { step: "3", title: "Celebrate Together", description: "Share photos, exchange messages, and relive every moment together in your shared wedding gallery." },
            ].map((s, i) => <StepCard key={i} {...s} isLast={i === 2} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section className="relative py-28 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(80,140,210,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why Wedspace"
            heading={<>What Spreadsheets Can&apos;t Do <em>(But We Can)</em></>}
            sub="See how your wedding planning can go from chaotic to seamless — without extra cost or hassle."
          />

          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden border"
              style={{ borderColor: "rgba(90,140,200,0.18)", boxShadow: "0 20px 80px rgba(60,110,180,0.08), 0 4px 20px rgba(0,0,0,0.04)", background: "rgba(248,251,255,0.8)", backdropFilter: "blur(12px)" }}>
              {/* Header */}
              <div className="grid grid-cols-4 text-center border-b" style={{ borderColor: "rgba(90,140,200,0.15)" }}>
                <div className="p-6 border-r" style={{ background: "rgba(245,248,253,0.8)", borderColor: "rgba(90,140,200,0.12)" }} />
                {["Spreadsheets", "Other Apps"].map((h, i) => (
                  <div key={i} className="p-6 border-r" style={{ borderColor: "rgba(90,140,200,0.12)" }}>
                    <p className="text-sm font-medium" style={{ color: "#6080a0", fontFamily: "'Gill Sans', sans-serif" }}>{h}</p>
                  </div>
                ))}
                <div className="p-6" style={{ background: "rgba(72,120,200,0.06)" }}>
                  <p className="text-sm font-semibold flex items-center justify-center gap-1.5" style={{ color: "#4878c8", fontFamily: "'Gill Sans', sans-serif" }}>
                    <Sparkles className="h-3.5 w-3.5" /> Wedspace
                  </p>
                </div>
              </div>

              {[
                { feature: "Guest Management", spreadsheet: "Manual", other: "Basic", wedspace: "Seamless" },
                { feature: "Real-time Updates", spreadsheet: "None", other: "Limited", wedspace: "Instant" },
                { feature: "Photo Sharing", spreadsheet: "None", other: "Separate", wedspace: "Built-in" },
                { feature: "Seating Charts", spreadsheet: "Hard", other: "Basic", wedspace: "Drag & Drop" },
                { feature: "Guest Experience", spreadsheet: "Poor", other: "Okay", wedspace: "Premium" },
              ].map((row, i) => {
                const { ref, visible } = useReveal()
                return (
                  <div
                    key={i}
                    ref={ref as React.RefObject<HTMLDivElement>}
                    className="grid grid-cols-4 text-center border-b last:border-b-0"
                    style={{
                      borderColor: "rgba(90,140,200,0.1)",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateX(0)" : "translateX(-16px)",
                      transition: `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms`,
                    }}
                  >
                    <div className="p-5 text-left border-r" style={{ background: "rgba(245,248,253,0.6)", borderColor: "rgba(90,140,200,0.1)" }}>
                      <p className="text-sm font-medium" style={{ color: "#1a2a3a", fontFamily: "'Gill Sans', sans-serif" }}>{row.feature}</p>
                    </div>
                    <div className="p-5 border-r" style={{ borderColor: "rgba(90,140,200,0.1)" }}>
                      <p className="text-sm" style={{ color: "#8090a8" }}>{row.spreadsheet}</p>
                    </div>
                    <div className="p-5 border-r" style={{ borderColor: "rgba(90,140,200,0.1)" }}>
                      <p className="text-sm" style={{ color: "#8090a8" }}>{row.other}</p>
                    </div>
                    <div className="p-5" style={{ background: "rgba(72,120,200,0.04)" }}>
                      <p className="text-sm font-semibold" style={{ color: "#4878c8" }}>{row.wedspace}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="relative py-28 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(240,246,254,0.5) 0%, transparent 60%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            heading={<>Don&apos;t Take Our Word for It</>}
            sub="One workspace. Endless compliments."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { quote: "Wedspace made managing our 200+ guest wedding feel effortless. The photo sharing feature was a hit!", author: "Sarah & Michael", location: "New York" },
              { quote: "Finally, a wedding tool that our parents could actually use. The interface is so elegant and simple.", author: "Emily & James", location: "California" },
              { quote: "The seating chart feature alone saved us hours of arguments. Absolute game changer for wedding planning.", author: "Priya & Raj", location: "London" },
            ].map((t, i) => <TestimonialCard key={i} {...t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-28 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const { ref, visible } = useReveal(0.1)
            return (
              <div
                ref={ref as React.RefObject<HTMLDivElement>}
                className="max-w-4xl mx-auto text-center rounded-3xl p-12 md:p-20 relative overflow-hidden"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                  transition: "opacity 0.9s ease, transform 0.9s ease",
                  background: "linear-gradient(135deg, #3a6abf 0%, #4878c8 30%, #3860b8 60%, #5a88d0 100%)",
                  boxShadow: "0 40px 100px rgba(40,90,180,0.28), 0 10px 40px rgba(40,90,180,0.15)",
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-20"
                  style={{ background: "radial-gradient(circle, rgba(200,220,255,0.5), transparent)", transform: "translate(-30%, -30%)" }} />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-15"
                  style={{ background: "radial-gradient(circle, rgba(180,210,255,0.4), transparent)", transform: "translate(20%, 20%)" }} />
                {/* Grain texture */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-[0.03]"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />

                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-70" style={{ color: "rgba(200,220,255,0.85)", fontFamily: "'Gill Sans', sans-serif" }}>
                    Get Started Today
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-balance leading-[1.08]"
                    style={{ color: "rgba(240,248,255,0.97)", letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(20,40,100,0.25)" }}>
                    Ready to plan your <em>perfect</em> wedding?
                  </h2>
                  <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "rgba(200,225,255,0.85)", fontFamily: "'Gill Sans', 'Optima', sans-serif" }}>
                    Join thousands of couples who trust Wedspace to bring their wedding day to life.
                  </p>
                  <a href="/sign-up">
                    <button
                      className="group relative inline-flex items-center gap-2 text-base font-medium px-10 py-4 rounded-full border transition-all duration-300"
                      style={{
                        background: "rgba(248,251,255,0.96)",
                        color: "#4878c8",
                        borderColor: "rgba(255,255,255,0.5)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
                        fontFamily: "'Gill Sans', 'Optima', sans-serif",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.5)" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)" }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px) scale(0.98)" }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)" }}
                    >
                      Create Your Wedding Space
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </a>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      <Footer />
    </div>
  )
}