import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DASHBOARD_ROUTE } from "@/lib/onboarding"

export default async function SignInPage() {
  const { userId } = await auth()

  if (userId) {
    redirect(DASHBOARD_ROUTE)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignIn forceRedirectUrl={DASHBOARD_ROUTE} />
    </div>
  )
}
