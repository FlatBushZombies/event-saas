import { createAdminClient } from "@/lib/server-supabase"
import { notFound } from "next/navigation"
import { InviteAcceptance } from "@/components/invite-acceptance-page"

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const supabase = createAdminClient()

  // Fetch invite with event details
  const { data: invite, error } = await supabase
    .from("invites")
    .select("*, events(*)")
    .eq("invite_code", code)
    .single()

  if (error || !invite || !invite.events) {
    notFound()
  }

  return <InviteAcceptance invite={invite} />
}
