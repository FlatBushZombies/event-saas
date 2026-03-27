"use server"

import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DASHBOARD_ROUTE } from "@/lib/onboarding"

export async function completeOnboarding(_formData: FormData) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const client = await clerkClient()

  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...((user.publicMetadata ?? {}) as Record<string, unknown>),
      onboardingComplete: true,
    },
  })

  redirect(DASHBOARD_ROUTE)
}
