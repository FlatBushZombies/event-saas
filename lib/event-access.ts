import type { SupabaseClient } from "@supabase/supabase-js"

export type InviteAccessRecord = {
  id: string
  event_id: string
  status: string | null
  invite_code?: string | null
  attendee_name?: string | null
  attendee_email?: string | null
}

export const ACCEPTED_INVITE_STATUSES = ["accepted", "scanned"] as const

export function isAcceptedInviteStatus(status?: string | null) {
  return status === "accepted" || status === "scanned"
}

export async function getAcceptedInviteByCode(
  supabase: SupabaseClient,
  eventId: string,
  inviteCode: string
) {
  const { data } = await supabase
    .from("invites")
    .select("id,event_id,status,invite_code,attendee_name,attendee_email")
    .eq("event_id", eventId)
    .eq("invite_code", inviteCode)
    .in("status", [...ACCEPTED_INVITE_STATUSES])
    .single()

  return (data as InviteAccessRecord | null) ?? null
}

export async function getEventAccess(
  supabase: SupabaseClient,
  {
    eventId,
    userId,
    inviteCode,
  }: {
    eventId: string
    userId?: string | null
    inviteCode?: string | null
  }
) {
  if (userId) {
    const { data: event } = await supabase.from("events").select("id,user_id").eq("id", eventId).single()

    if (event?.user_id === userId) {
      return { role: "owner" as const }
    }
  }

  const invite = inviteCode ? await getAcceptedInviteByCode(supabase, eventId, inviteCode) : null

  if (invite) {
    return { role: "guest" as const, invite }
  }

  return null
}
