"use client"

import { useState } from "react"
import useSWR from "swr"
import type { PollWithVotes } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Loader2, CheckCircle2 } from "lucide-react"
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
    <div className="space-y-4">
      {polls.map((poll) => {
        const hasVoted = poll.user_vote !== null && poll.user_vote !== undefined

        return (
          <Card key={poll.id}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-1">{poll.question}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {poll.total_votes} {poll.total_votes === 1 ? "vote" : "votes"}
              </p>

              <div className="space-y-2">
                {poll.options.map((option, index) => {
                  const count = poll.votes[index] || 0
                  const percentage = poll.total_votes > 0
                    ? Math.round((count / poll.total_votes) * 100)
                    : 0
                  const isUserVote = poll.user_vote === index

                  if (hasVoted) {
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {option}
                            {isUserVote && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </span>
                          <span className="text-muted-foreground font-medium">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUserVote ? "bg-primary" : "bg-muted-foreground/30"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-primary/10"
                      disabled={voting === poll.id}
                      onClick={() => handleVote(poll.id, index)}
                    >
                      {voting === poll.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {option}
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
