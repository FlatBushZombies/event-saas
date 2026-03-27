import { SignIn } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AUTH_COMPLETE_ROUTE, getPostAuthRedirectPath } from "@/lib/onboarding"

export default async function SignInPage() {
  const { userId } = await auth()

  if (userId) {
    const user = await currentUser()

    if (user) {
      redirect(getPostAuthRedirectPath(user.publicMetadata))
    }

    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignIn forceRedirectUrl={AUTH_COMPLETE_ROUTE} />
    </div>
  )
}
