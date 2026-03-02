import Link from "next/link"
import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden">

      {/* subtle glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-6 py-28">

        <div className="grid gap-16 lg:grid-cols-5">

          {/* Brand / CTA */}
          <div className="lg:col-span-2 space-y-6">

            <div className="flex items-center gap-3">
            
              <span className="text-xl font-semibold tracking-tight">
                Wedspace
              </span>
            </div>

            <p className="text-white/55 text-sm leading-relaxed max-w-md">
              Your wedding, one private digital workspace.
              Coordinate guests, organize seating, and share every memory.
            </p>

            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-2xl bg-white text-black px-6 py-3 text-sm font-medium hover:scale-[1.03] hover:bg-white/90 transition-all duration-200"
            >
              Start free →
            </Link>
          </div>


          {/* Columns */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Guest Coordination", "Seating Planner"]
            },
            {
              title: "Company",
              links: ["About", "Blog", "Love Stories", "Contact"]
            },
            {
              title: "Resources",
              links: ["Help Center", "Planning Guides", "FAQs", "Community"]
            }
          ].map((col) => (
            <div key={col.title} className="space-y-5">
              <h4 className="text-xs tracking-widest uppercase text-white/40">
                {col.title}
              </h4>

              <ul className="space-y-3 text-sm text-white/60">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
          <p> {new Date().getFullYear()} Wedspace Inc. All rights reserved.</p>

          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/security" className="hover:text-white transition">Security</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
