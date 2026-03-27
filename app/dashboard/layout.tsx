import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { hasCompletedOnboarding } from "@/lib/onboarding"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  if (!hasCompletedOnboarding(user.publicMetadata)) {
    redirect("/onboarding")
  }

  return children
}
