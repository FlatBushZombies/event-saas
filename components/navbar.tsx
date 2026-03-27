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
  const loginLabel = isSignedIn ? "Your Space" : "Sign In"

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
