export const DASHBOARD_ROUTE = "/dashboard"
export const ONBOARDING_ROUTE = "/onboarding"
export const AUTH_COMPLETE_ROUTE = "/auth/complete"

type AppPublicMetadata = {
  onboardingComplete?: boolean
}

export function hasCompletedOnboarding(publicMetadata: unknown) {
  return Boolean((publicMetadata as AppPublicMetadata | null | undefined)?.onboardingComplete)
}

export function getPostAuthRedirectPath(publicMetadata: unknown) {
  return hasCompletedOnboarding(publicMetadata) ? DASHBOARD_ROUTE : ONBOARDING_ROUTE
}
