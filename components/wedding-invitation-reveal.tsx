"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Sparkles, Heart } from "lucide-react"

interface WeddingInvitationRevealProps {
  title: string
  eventDateISO: string
  location?: string
  attendeeName?: string
  inviteLink?: string
  onDone?: () => void
}

export function WeddingInvitationReveal({
  title,
  eventDateISO,
  location,
  attendeeName,
  inviteLink,
  onDone,
}: WeddingInvitationRevealProps) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealed">("sealed")

  const dateLabel = useMemo(() => {
    const d = new Date(eventDateISO)
    return Number.isFinite(d.getTime()) ? format(d, "PPP 'at' p") : eventDateISO
  }, [eventDateISO])

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("opening"), 700)
    const t2 = window.setTimeout(() => setPhase("revealed"), 2200)
    const t3 = window.setTimeout(() => onDone?.(), 3800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [onDone])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --rose-50: #fdf8f7;
          --rose-100: #f5e6e3;
          --rose-200: #e8cbc4;
          --rose-300: #d4a59a;
          --rose-400: #c9918a;
          --rose-500: #b97971;
          --rose-600: #a66b64;
          --rose-700: #8a5750;
          --ink: #2d2926;
          --ink-muted: #6b6560;
          --cream: #fffcfb;
          --parchment: #fdf9f8;
          --border-soft: rgba(185, 121, 113, 0.12);
        }

        .wir-scene {
          perspective: 1400px;
          perspective-origin: 50% 40%;
        }

        .wir-flap {
          transform-origin: top center;
          transform-style: preserve-3d;
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wir-flap.sealed   { transform: rotateX(0deg); }
        .wir-flap.opening  { transform: rotateX(165deg); }
        .wir-flap.revealed { transform: rotateX(180deg); }

        @keyframes cardRise {
          from { transform: translateY(50px) scale(0.96); opacity: 0; }
          to   { transform: translateY(0) scale(1);    opacity: 1; }
        }
        .wir-card-revealed {
          animation: cardRise 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0) scale(1);   opacity: 0.4; }
          50%       { transform: translateY(-12px) scale(1.5); opacity: 1; }
        }

        @keyframes petalFall {
          0%   { transform: translateY(-30px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(140px) rotate(540deg); opacity: 0; }
        }

        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wir-detail-row {
          opacity: 0;
          animation: rowFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .wir-detail-row:nth-child(1) { animation-delay: 0.15s; }
        .wir-detail-row:nth-child(2) { animation-delay: 0.3s; }
        .wir-detail-row:nth-child(3) { animation-delay: 0.45s; }
        .wir-detail-row:nth-child(4) { animation-delay: 0.6s; }

        .wir-inner-border {
          position: relative;
        }
        .wir-inner-border::before {
          content: '';
          position: absolute;
          inset: 10px;
          border: 1px solid var(--border-soft);
          border-radius: 16px;
          pointer-events: none;
        }

        .wir-ornament {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }
        .wir-ornament::before,
        .wir-ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--rose-300), transparent);
        }
        .wir-ornament-glyph {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: var(--rose-500);
          line-height: 1;
          user-select: none;
        }

        .wir-qr-panel {
          background: linear-gradient(135deg, var(--rose-50), rgba(255,252,251,0.95));
          border: 1px solid var(--border-soft);
          border-radius: 20px;
          padding: 24px;
        }

        .wir-skip {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
          background: rgba(255, 252, 251, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-soft);
          border-radius: 9999px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wir-skip:hover {
          background: var(--rose-100);
          color: var(--rose-600);
          border-color: var(--rose-300);
          transform: translateY(-1px);
        }

        .wir-envelope-texture {
          background: linear-gradient(145deg, #fffcfb 0%, #fdf8f7 50%, #f5e6e3 100%);
          border: 1px solid var(--border-soft);
          box-shadow: 
            0 40px 80px rgba(185, 121, 113, 0.15),
            0 20px 40px rgba(185, 121, 113, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .wir-stamp {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 48px;
          height: 56px;
          background: white;
          border: 1px solid var(--border-soft);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(185, 121, 113, 0.12);
          z-index: 20;
          outline: 3px dotted rgba(185, 121, 113, 0.25);
          outline-offset: -6px;
        }

        .wir-address {
          position: absolute;
          bottom: 32px;
          left: 28px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 5;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div
        className="w-full"
        style={{ fontFamily: "'Outfit', sans-serif", color: "var(--ink)" }}
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(185, 121, 113, 0.08), rgba(185, 121, 113, 0.03))",
              border: "1px solid rgba(185, 121, 113, 0.12)",
            }}
          >
            <Sparkles style={{ width: 16, height: 16, color: "var(--rose-500)" }} />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "15px",
                color: "var(--ink-muted)",
              }}
            >
              Your Invitation Awaits
            </span>
          </div>

          <button
            type="button"
            className="wir-skip"
            onClick={() => {
              setPhase("revealed")
              onDone?.()
            }}
          >
            Skip Animation
          </button>
        </div>

        <div
          className="wir-scene relative flex items-center justify-center overflow-hidden rounded-[28px]"
          style={{
            minHeight: 540,
            background:
              "radial-gradient(ellipse at 60% 40%, rgba(185, 121, 113, 0.06) 0%, transparent 70%), linear-gradient(135deg, #fdf8f7, #f5e6e3)",
            border: "1px solid rgba(185, 121, 113, 0.1)",
            boxShadow: "0 24px 48px rgba(185, 121, 113, 0.08)",
          }}
        >
          {/* Ambient blobs */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 30, left: 30,
              width: 180, height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(185, 121, 113, 0.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 40, right: 30,
              width: 220, height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(185, 121, 113, 0.06) 0%, transparent 70%)",
            }}
          />

          {phase === "opening" && (
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${8 + Math.random() * 84}%`,
                    top: `${8 + Math.random() * 84}%`,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i % 2 === 0 ? "var(--rose-500)" : "var(--rose-300)",
                    animation: `sparkleFloat ${1100 + i * 100}ms ease-in-out ${i * 70}ms infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {phase === "revealed" && (
            <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${Math.random() * 100}%`,
                    top: `${-15 + Math.random() * 25}%`,
                    width: i % 3 === 0 ? 10 : 6,
                    height: i % 3 === 0 ? 10 : 6,
                    borderRadius: i % 2 === 0 ? "50% 0 50% 50%" : "50%",
                    background:
                      i % 4 === 0 ? "var(--rose-500)" :
                      i % 4 === 1 ? "var(--rose-300)" :
                      i % 4 === 2 ? "var(--rose-400)" : "var(--rose-200)",
                    animation: `petalFall ${1.5 + Math.random() * 1.2}s ease-in ${i * 0.05}s forwards`,
                  }}
                />
              ))}
            </div>
          )}

          {/* ENVELOPE */}
          <div
            className="relative w-full mx-auto px-4 sm:px-0"
            style={{
              maxWidth: 400,
              transition: "opacity 0.9s ease, transform 0.9s ease",
              opacity: phase === "revealed" ? 0 : 1,
              transform: phase === "revealed" ? "scale(0.92) translateY(16px)" : "scale(1)",
              pointerEvents: phase === "revealed" ? "none" : "auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: "10%",
                right: "10%",
                height: 28,
                borderRadius: "50%",
                background: "rgba(185, 121, 113, 0.12)",
                filter: "blur(16px)",
                transition: "opacity 0.9s ease",
                opacity: phase === "revealed" ? 0 : 1,
              }}
            />

            <div
              className="wir-envelope-texture relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "1.5 / 1" }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background:
                    "linear-gradient(135deg, rgba(185, 121, 113, 0.02) 0%, transparent 40%), " +
                    "linear-gradient(225deg, rgba(185, 121, 113, 0.02) 0%, transparent 40%)",
                }}
              />

              <div
                aria-hidden
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "52%",
                  background: "linear-gradient(to top, rgba(185, 121, 113, 0.1) 0%, rgba(212, 165, 154, 0.05) 100%)",
                  clipPath: "polygon(0 100%, 50% 28%, 100% 100%)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute", bottom: 0, left: 0, width: "52%", height: "100%",
                  background: "linear-gradient(to right, rgba(185, 121, 113, 0.06) 0%, transparent 100%)",
                  clipPath: "polygon(0 100%, 0 38%, 100% 100%)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute", bottom: 0, right: 0, width: "52%", height: "100%",
                  background: "linear-gradient(to left, rgba(185, 121, 113, 0.06) 0%, transparent 100%)",
                  clipPath: "polygon(100% 100%, 100% 38%, 0 100%)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 20, right: 20,
                  background: "white",
                  borderRadius: "10px 10px 0 0",
                  boxShadow: "0 -4px 20px rgba(185, 121, 113, 0.1)",
                  transition: "bottom 1s cubic-bezier(0.22,1,0.36,1), height 1s cubic-bezier(0.22,1,0.36,1)",
                  bottom:  phase === "sealed" ? 32 : phase === "opening" ? 56 : 72,
                  height:  phase === "sealed" ? 56 : phase === "opening" ? 150 : 190,
                  zIndex: 1,
                }}
              >
                <div style={{ padding: "18px 20px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--rose-100), var(--rose-50))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto",
                      border: "1px solid rgba(185, 121, 113, 0.08)",
                    }}
                  >
                    <Heart style={{ width: 14, height: 14, color: "var(--rose-500)" }} fill="var(--rose-500)" />
                  </div>
                  <p
                    style={{
                      marginTop: 8,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 10,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                    }}
                  >
                    You&apos;re Invited
                  </p>
                </div>
              </div>

              <div className="wir-stamp">
                <Heart style={{ width: 18, height: 18, color: "var(--rose-500)" }} fill="var(--rose-300)" />
              </div>

              <div className="wir-address">
                {[28, 36, 24].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      width: w * 3,
                      height: 6,
                      borderRadius: 9999,
                      background: "rgba(185, 121, 113, 0.12)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* TOP FLAP */}
            <div
              className={`wir-flap ${phase}`}
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                zIndex: phase === "sealed" ? 10 : 0,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(160deg, #fdf8f7 0%, #e8cbc4 100%)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  aspectRatio: "3 / 1.05",
                  boxShadow: "0 6px 24px rgba(185, 121, 113, 0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 8,
                    transform: "translateX(-50%)",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--rose-500), var(--rose-600))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(185, 121, 113, 0.4)",
                    border: "3px solid rgba(255,255,255,0.35)",
                    transition: "opacity 0.5s",
                    opacity: phase !== "sealed" ? 0 : 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute", inset: 5, borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                  <Heart style={{ width: 18, height: 18, color: "white" }} fill="white" />
                </div>
              </div>
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(160deg, #fffcfb 0%, #f5e6e3 100%)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>
          </div>

          {/* REVEALED INVITATION CARD */}
          <div
            className={phase === "revealed" ? "wir-card-revealed" : ""}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              opacity: phase === "revealed" ? 1 : 0,
              pointerEvents: phase === "revealed" ? "auto" : "none",
              transition: phase === "revealed" ? "none" : "opacity 0.1s",
            }}
          >
            <div
              className="wir-inner-border w-full"
              style={{
                maxWidth: 420,
                background: "white",
                borderRadius: 24,
                boxShadow:
                  "0 40px 100px rgba(185, 121, 113, 0.15), 0 8px 32px rgba(185, 121, 113, 0.1)",
                border: "1px solid rgba(185, 121, 113, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 4,
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--rose-300) 30%, var(--rose-500) 50%, var(--rose-300) 70%, transparent 100%)",
                }}
              />

              <div style={{ padding: "32px 28px 28px" }}>

                <div className="wir-detail-row" style={{ textAlign: "center", marginBottom: 0 }}>
                  <div
                    style={{
                      width: 54, height: 54, borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--rose-100), var(--rose-50))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 18px",
                      boxShadow: "0 0 0 10px rgba(185, 121, 113, 0.05)",
                      border: "1px solid rgba(185, 121, 113, 0.08)",
                    }}
                  >
                    <Heart style={{ width: 22, height: 22, color: "var(--rose-500)" }} fill="var(--rose-500)" />
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: "var(--ink)",
                      marginBottom: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 15,
                      color: "var(--ink-muted)",
                    }}
                  >
                    invites you with joy
                  </p>
                </div>

                <div className="wir-ornament">
                  <span className="wir-ornament-glyph">&#10022;</span>
                </div>

                <div className="wir-detail-row" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: "linear-gradient(135deg, var(--rose-100), var(--rose-50))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(185, 121, 113, 0.08)",
                    }}
                  >
                    <Calendar style={{ width: 18, height: 18, color: "var(--rose-500)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 2 }}>
                      Date & Time
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{dateLabel}</p>
                  </div>
                </div>

                {location && (
                  <div className="wir-detail-row" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "linear-gradient(135deg, var(--rose-100), var(--rose-50))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid rgba(185, 121, 113, 0.08)",
                      }}
                    >
                      <MapPin style={{ width: 18, height: 18, color: "var(--rose-500)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 2 }}>
                        Venue
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{location}</p>
                    </div>
                  </div>
                )}

                {attendeeName && (
                  <div className="wir-detail-row" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "linear-gradient(135deg, var(--rose-100), var(--rose-50))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid rgba(185, 121, 113, 0.08)",
                      }}
                    >
                      <Sparkles style={{ width: 18, height: 18, color: "var(--rose-500)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 2 }}>
                        Guest
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{attendeeName}</p>
                    </div>
                  </div>
                )}

                {inviteLink && (
                  <div className="wir-detail-row wir-qr-panel" style={{ marginTop: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div
                        style={{
                          padding: 10,
                          background: "white",
                          borderRadius: 12,
                          boxShadow: "0 4px 12px rgba(185, 121, 113, 0.08)",
                          border: "1px solid rgba(185, 121, 113, 0.08)",
                        }}
                      >
                        <QRCodeSVG value={inviteLink} size={80} level="M" fgColor="#2d2926" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>
                          Digital Pass
                        </p>
                        <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
                          Scan this QR code at the venue for seamless check-in
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
