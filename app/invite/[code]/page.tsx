import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Invite({ params }: { params: { code: string } }) {
  const { data } = await supabase
    .from("invites")
    .select("events(title)")
    .eq("code", params.code)
    .single()

  if (!data) {
    return <p className="p-10 text-center">Invalid invite</p>
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-white/60 mb-2">You're invited to</p>
        <h1 className="text-3xl font-semibold">
          event
        </h1>
      </div>
    </main>
  )
}
