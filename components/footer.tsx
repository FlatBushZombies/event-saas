"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

export default function Footer() {
  const { isLoaded, isSignedIn } = useAuth()
  const href = isLoaded && isSignedIn ? "/dashboard" : "/sign-in"
  const label = isLoaded && isSignedIn ? "Open your space" : "Begin your wedding space"

  return (
    <footer className="relative overflow-hidden bg-[#2c1f1b] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold tracking-tight">Wedspace</span>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-white/55">
              Where your wedding lives before, during, and forever after. Calm planning, graceful guest experience, and
              memories worth keeping.
            </p>

            <Link
              href={href}
              className="inline-flex items-center rounded-2xl bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:scale-[1.03] hover:bg-white/90"
            >
              {label}
            </Link>
          </div>

          {[
            {
              title: "Experience",
              links: ["Private Guest Access", "Wedding Timeline", "Memory Gallery", "Digital Guestbook"],
            },
            {
              title: "For Couples",
              links: ["Wedding Day", "Anniversary Chapter", "Second Celebration", "Guest Calm"],
            },
            {
              title: "Guidance",
              links: ["Planning Notes", "Guest Etiquette", "Timeline Ideas", "Support"],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-5">
              <h4 className="text-xs uppercase tracking-widest text-white/40">{col.title}</h4>

              <ul className="space-y-3 text-sm text-white/60">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition-colors hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>{new Date().getFullYear()} Wedspace. Built for love stories, not corporate workflows.</p>

          <div className="flex gap-8">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/security" className="transition hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
