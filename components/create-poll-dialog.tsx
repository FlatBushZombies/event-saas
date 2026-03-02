"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

interface CreatePollDialogProps {
  eventId: string
  onPollCreated?: () => void
}

export function CreatePollDialog({ eventId, onPollCreated }: CreatePollDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])

  function resetForm() {
    setQuestion("")
    setOptions(["", ""])
  }

  function addOption() {
    if (options.length < 6) {
      setOptions([...options, ""])
    }
  }

  function removeOption(index: number) {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  function updateOption(index: number, value: string) {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedQuestion = question.trim()
    const trimmedOptions = options.map((o) => o.trim()).filter((o) => o.length > 0)

    if (!trimmedQuestion) {
      toast.error("Please enter a question")
      return
    }

    if (trimmedOptions.length < 2) {
      toast.error("Please provide at least 2 options")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          question: trimmedQuestion,
          options: trimmedOptions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create poll")
      }

      toast.success("Poll created!")
      resetForm()
      setOpen(false)
      onPollCreated?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create poll")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Wedding Poll</DialogTitle>
          <DialogDescription>
            Ask your guests a fun question — like "Who cries first?" or "Best dance move prediction"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Who cries first at the ceremony?"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
