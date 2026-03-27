import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getPostAuthRedirectPath } from "@/lib/onboarding"

export default async function AuthCompletePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  redirect(getPostAuthRedirectPath(user.publicMetadata))
}
