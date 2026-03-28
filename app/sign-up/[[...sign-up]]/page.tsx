import { SignUp } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AUTH_COMPLETE_ROUTE, DASHBOARD_ROUTE } from "@/lib/onboarding"

export default async function SignUpPage() {
  const { userId } = await auth()

  if (userId) {
    redirect(DASHBOARD_ROUTE)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignUp forceRedirectUrl={AUTH_COMPLETE_ROUTE} />
    </div>
  )
}
