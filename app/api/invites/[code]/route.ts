import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-supabase"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const supabase = createAdminClient()

  const { data: invite, error } = await supabase
    .from("invites")
    .select("*, events(*)")
    .eq("invite_code", code)
    .single()

  if (error || !invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 })
  }

  return NextResponse.json(invite)
}


