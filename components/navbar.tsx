"use client"

import { Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

const Navbar = () => {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  const loginHref = isSignedIn ? "/dashboard" : "/sign-in"
  const loginLabel = isSignedIn ? "View Dashboard" : "SIGN IN"

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Heart className="logo" />
            <span className="name">Wedspace</span>
          </div>

          <ul className="links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#">Pricing</a>
            <a href="#">Stories</a>
          </ul>
        </div>

        <div className="actions">
          <Link href={loginHref} className="login">
            {loginLabel}
          </Link>
          <a href="/sign-up" className="cta">
            Get Started
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
