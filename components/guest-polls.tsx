"use client"

import { useState } from "react"
import useSWR from "swr"
import type { PollWithVotes } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Loader2, CheckCircle2, Sparkles, Vote } from "lucide-react"
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
      <div className="text-center py-8 text-muted-foreground">
        Failed to load polls
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (polls.length === 0) {
    return null
  }

  return (
    <div className="space-y-5">
      {polls.map((poll) => {
        const hasVoted = poll.user_vote !== null && poll.user_vote !== undefined

        return (
          <Card key={poll.id} className="overflow-hidden border-border/60 bg-gradient-to-br from-white to-primary/5 shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Live Vote
                  </div>
                  <h3 className="mt-3 text-xl font-serif text-foreground">{poll.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {poll.total_votes} {poll.total_votes === 1 ? "vote" : "votes"} cast so far
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
                  <Vote className="h-4 w-4" />
                  {hasVoted ? "Vote locked in" : "Tap to vote"}
                </div>
              </div>

              <div className="mt-5 space-y-3">
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
                        className={[
                          "rounded-[1.4rem] border p-4 transition-all",
                          isUserVote
                            ? "border-primary/30 bg-white shadow-sm shadow-primary/10"
                            : "border-border/60 bg-white/70",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="flex items-center gap-2 font-medium text-foreground">
                            {option}
                            {isUserVote && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </span>
                          <span className="font-medium text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted/70">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUserVote ? "bg-gradient-to-r from-primary to-primary/70" : "bg-muted-foreground/25"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{count} {count === 1 ? "vote" : "votes"}</span>
                          {isUserVote ? <span className="font-medium text-primary">Your pick</span> : null}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto w-full justify-start rounded-[1.4rem] border-border/60 bg-white/85 px-4 py-4 text-left hover:bg-primary/5"
                      disabled={voting === poll.id}
                      onClick={() => handleVote(poll.id, index)}
                    >
                      <span className="flex items-center gap-3">
                        {voting === poll.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                        )}
                        <span className="font-medium">{option}</span>
                      </span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
