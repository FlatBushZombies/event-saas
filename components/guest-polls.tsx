"use client"

import { useState } from "react"
import useSWR from "swr"
import type { PollWithVotes } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, Sparkles, Vote } from "lucide-react"
import { toast } from "sonner"

interface GuestPollsProps {
  eventId: string
  inviteCode: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function GuestPolls({ eventId, inviteCode }: GuestPollsProps) {
  const { data, error, mutate: refreshPolls } = useSWR(
    `/api/polls?eventId=${eventId}&inviteCode=${inviteCode}`,
    fetcher
  )
  const [voting, setVoting] = useState<string | null>(null)

  const polls: PollWithVotes[] = data?.polls || []

  async function handleVote(pollId: string, optionIndex: number) {
    setVoting(pollId)
    try {
      const response = await fetch("/api/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, inviteCode, optionIndex }),
      })

      if (response.ok) {
        toast.success("Vote submitted!")
        refreshPolls()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to vote")
      }
    } catch (error) {
      toast.error("Failed to vote")
    } finally {
      setVoting(null)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8" style={{ color: "#6b6560" }}>
        Failed to load polls
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#b97971" }} />
      </div>
    )
  }

  if (polls.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes pollFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0; }
        }
      `}</style>

      {polls.map((poll, pollIndex) => {
        const hasVoted = poll.user_vote !== null && poll.user_vote !== undefined

        return (
          <div 
            key={poll.id} 
            className="overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,252,251,0.98), rgba(185, 121, 113, 0.03))",
              border: "1px solid rgba(185, 121, 113, 0.1)",
              boxShadow: "0 8px 24px rgba(185, 121, 113, 0.06)",
              animation: `pollFadeIn 0.6s ease ${pollIndex * 0.1}s both`,
            }}
          >
            <div className="h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #b97971, transparent)" }} />
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div 
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase"
                    style={{
                      background: "linear-gradient(135deg, rgba(185, 121, 113, 0.08), rgba(185, 121, 113, 0.03))",
                      border: "1px solid rgba(185, 121, 113, 0.12)",
                      color: "#a66b64",
                      letterSpacing: "0.18em",
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Live Vote
                  </div>
                  <h3 
                    className="mt-4 text-xl"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: "#2d2926" }}
                  >
                    {poll.question}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "#6b6560" }}>
                    {poll.total_votes} {poll.total_votes === 1 ? "vote" : "votes"} cast so far
                  </p>
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
                  <Vote className="h-4 w-4" />
                  {hasVoted ? "Vote locked in" : "Tap to vote"}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {poll.options.map((option, index) => {
                  const count = poll.votes[index] || 0
                  const percentage = poll.total_votes > 0
                    ? Math.round((count / poll.total_votes) * 100)
                    : 0
                  const isUserVote = poll.user_vote === index

                  if (hasVoted) {
                    return (
                      <div
                        key={index}
                        className="rounded-xl p-4 transition-all duration-300"
                        style={{
                          background: isUserVote 
                            ? "linear-gradient(135deg, rgba(185, 121, 113, 0.06), rgba(255,252,251,0.98))"
                            : "rgba(255,252,251,0.9)",
                          border: isUserVote 
                            ? "1px solid rgba(185, 121, 113, 0.2)"
                            : "1px solid rgba(185, 121, 113, 0.06)",
                          boxShadow: isUserVote 
                            ? "0 4px 12px rgba(185, 121, 113, 0.08)"
                            : "none",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="flex items-center gap-2 font-medium" style={{ color: "#2d2926" }}>
                            {option}
                            {isUserVote && (
                              <CheckCircle2 className="h-4 w-4" style={{ color: "#b97971" }} />
                            )}
                          </span>
                          <span className="font-semibold" style={{ color: "#a66b64" }}>
                            {percentage}%
                          </span>
                        </div>
                        <div 
                          className="mt-3 h-3 overflow-hidden rounded-full"
                          style={{ background: "rgba(185, 121, 113, 0.06)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ 
                              width: `${percentage}%`,
                              background: isUserVote 
                                ? "linear-gradient(90deg, #b97971, #c9918a)"
                                : "rgba(185, 121, 113, 0.18)",
                              animation: "barGrow 0.8s ease-out",
                            }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs" style={{ color: "#6b6560" }}>
                          <span>{count} {count === 1 ? "vote" : "votes"}</span>
                          {isUserVote ? <span className="font-medium" style={{ color: "#b97971" }}>Your pick</span> : null}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto w-full justify-start rounded-xl px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: "rgba(255,252,251,0.95)",
                        border: "1px solid rgba(185, 121, 113, 0.1)",
                        boxShadow: "0 2px 8px rgba(185, 121, 113, 0.03)",
                      }}
                      disabled={voting === poll.id}
                      onClick={() => handleVote(poll.id, index)}
                    >
                      <span className="flex items-center gap-3">
                        {voting === poll.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#b97971" }} />
                        ) : (
                          <span 
                            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                            style={{
                              background: "linear-gradient(135deg, rgba(185, 121, 113, 0.1), rgba(185, 121, 113, 0.04))",
                              color: "#a66b64",
                            }}
                          >
                            {index + 1}
                          </span>
                        )}
                        <span className="font-medium" style={{ color: "#2d2926" }}>{option}</span>
                      </span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
