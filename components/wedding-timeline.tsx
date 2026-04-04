"use client"

import useSWR from "swr"
import { CalendarClock, Clock3, Sparkles } from "lucide-react"
import type { TimelineItem } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function WeddingTimeline({ eventId, inviteCode }: { eventId: string; inviteCode: string }) {
  const { data, error } = useSWR<{ items: TimelineItem[] }>(
    `/api/timeline?eventId=${eventId}&inviteCode=${inviteCode}`,
    fetcher
  )

  if (error) {
    return <div className="text-center py-8" style={{ color: "#6b6560" }}>Could not load the wedding timeline.</div>
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <div 
          className="h-8 w-8 rounded-full border-2 animate-spin" 
          style={{ borderColor: "#e8cbc4", borderTopColor: "#b97971" }}
        />
      </div>
    )
  }

  const items = (data.items || []).filter((item) => item.title?.trim().length > 0)

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes timelineFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div 
        className="overflow-hidden"
        style={{
          background: "rgba(255, 252, 251, 0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(185, 121, 113, 0.12)",
          borderRadius: "28px",
          boxShadow: "0 4px 6px -1px rgba(185, 121, 113, 0.04), 0 24px 48px -12px rgba(185, 121, 113, 0.1)",
        }}
      >
        <div className="h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #b97971, transparent)" }} />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase"
              style={{
                background: "linear-gradient(135deg, rgba(185, 121, 113, 0.1), rgba(185, 121, 113, 0.04))",
                border: "1px solid rgba(185, 121, 113, 0.12)",
                color: "#a66b64",
                letterSpacing: "0.18em",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Know What&apos;s Next
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(185, 121, 113, 0.1), rgba(185, 121, 113, 0.04))",
                border: "1px solid rgba(185, 121, 113, 0.08)",
              }}
            >
              <CalendarClock className="h-5 w-5" style={{ color: "#b97971" }} />
            </div>
            <h2 
              className="text-2xl"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: "#2d2926" }}
            >
              Wedding Timeline
            </h2>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b6560" }}>
            Everything important at a glance, so guests know exactly what&apos;s coming up next.
          </p>

          <div className="relative pl-5">
            <div 
              className="absolute left-[1.1rem] top-4 bottom-4 w-px"
              style={{
                background: "linear-gradient(to bottom, rgba(185, 121, 113, 0.4) 0%, rgba(185, 121, 113, 0.12) 50%, transparent 100%)",
              }}
            />
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="relative rounded-[20px] p-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,252,251,0.98), rgba(185, 121, 113, 0.03))",
                    border: "1px solid rgba(185, 121, 113, 0.08)",
                    boxShadow: "0 4px 12px rgba(185, 121, 113, 0.04)",
                    animation: `timelineFadeIn 0.6s ease ${index * 0.1}s both`,
                  }}
                >
                  <div 
                    className="absolute -left-[1.1rem] top-6 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{
                      background: "white",
                      border: "2px solid rgba(185, 121, 113, 0.2)",
                      boxShadow: "0 2px 8px rgba(185, 121, 113, 0.12)",
                    }}
                  >
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#b97971" }} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p 
                        className="text-xl"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: "#2d2926" }}
                      >
                        {item.title}
                      </p>
                      {item.description ? (
                        <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{item.description}</p>
                      ) : null}
                    </div>
                    <div 
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
                      style={{
                        background: "white",
                        border: "1px solid rgba(185, 121, 113, 0.12)",
                        color: "#a66b64",
                        boxShadow: "0 2px 8px rgba(185, 121, 113, 0.06)",
                      }}
                    >
                      <Clock3 className="h-4 w-4" />
                      <span>{item.time_label || "Time to be announced"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
