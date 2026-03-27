"use client"

import { useState } from "react"
import useSWR from "swr"
import type { PollWithVotes } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, BarChart3, Loader2, ToggleLeft, ToggleRight, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface PollsListProps {
  eventId: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PollsList({ eventId }: PollsListProps) {
  const { data, error, mutate: refreshPolls } = useSWR(
    `/api/polls?eventId=${eventId}`,
    fetcher
  )
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const polls: PollWithVotes[] = data?.polls || []

  async function handleDelete(pollId: string) {
    if (!confirm("Are you sure you want to delete this poll? All votes will be lost.")) return

    setDeleting(pollId)
    try {
      const response = await fetch("/api/polls", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId }),
      })

      if (response.ok) {
        toast.success("Poll deleted")
        refreshPolls()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete poll")
      }
    } catch (error) {
      toast.error("Failed to delete poll")
    } finally {
      setDeleting(null)
    }
  }

  async function handleToggleActive(pollId: string, currentlyActive: boolean) {
    setToggling(pollId)
    try {
      const response = await fetch("/api/polls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, is_active: !currentlyActive }),
      })

      if (response.ok) {
        toast.success(currentlyActive ? "Poll paused" : "Poll activated")
        refreshPolls()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update poll")
      }
    } catch (error) {
      toast.error("Failed to update poll")
    } finally {
      setToggling(null)
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
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
          <p className="text-sm text-muted-foreground">
            Create a poll to engage your guests with fun questions
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {polls.map((poll) => {
        return (
          <Card
            key={poll.id}
            className={[
              "overflow-hidden border-border/60 bg-gradient-to-br from-white to-primary/5 shadow-md",
              !poll.is_active ? "opacity-75" : "",
            ].join(" ")}
          >
            <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Guest voting
                  </div>
                  <h3 className="mt-3 font-serif text-xl leading-tight">{poll.question}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {poll.total_votes} {poll.total_votes === 1 ? "vote" : "votes"}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <Badge variant={poll.is_active ? "default" : "secondary"}>
                    {poll.is_active ? "Active" : "Paused"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {poll.options.map((option, index) => {
                  const count = poll.votes[index] || 0
                  const percentage = poll.total_votes > 0
                    ? Math.round((count / poll.total_votes) * 100)
                    : 0

                  return (
                    <div key={index} className="rounded-[1.35rem] border border-border/60 bg-white/80 p-4 shadow-sm">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{option}</span>
                        <span className="text-muted-foreground font-medium">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="mt-3 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => handleToggleActive(poll.id, poll.is_active)}
                  disabled={toggling === poll.id}
                >
                  {toggling === poll.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : poll.is_active ? (
                    <ToggleRight className="h-4 w-4 mr-2" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 mr-2" />
                  )}
                  {poll.is_active ? "Pause" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-destructive hover:text-destructive"
                  onClick={() => handleDelete(poll.id)}
                  disabled={deleting === poll.id}
                >
                  {deleting === poll.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
