import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { OnboardingExperience } from "@/components/onboarding-experience"
import { getPostAuthRedirectPath, hasCompletedOnboarding } from "@/lib/onboarding"
import { completeOnboarding } from "./actions"

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  if (hasCompletedOnboarding(user.publicMetadata)) {
    redirect(getPostAuthRedirectPath(user.publicMetadata))
  }

  return <OnboardingExperience firstName={user.firstName} completeAction={completeOnboarding} />
}
