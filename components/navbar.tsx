"use client"

import { Heart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

const Navbar = () => {
  const { isLoaded, isSignedIn } = useAuth()

  const hasSession = isLoaded && isSignedIn
  const loginHref = hasSession ? "/dashboard" : "/sign-in"
  const loginLabel = hasSession ? "Your Space" : "Sign In"

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <Link href="/" className="brand">
            <Heart className="logo" />
            <span className="name">Wedspace</span>
          </Link>

          <ul className="links">
            <a href="#experience">Experience</a>
            <a href="#how-it-works">How It Lives</a>
            <a href="#features">For Couples</a>
          </ul>
        </div>

        <div className="actions">
          <Link href={loginHref} className="login">
            {loginLabel}
          </Link>
          <a href="/sign-up" className="cta">
            Create Your Space
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
