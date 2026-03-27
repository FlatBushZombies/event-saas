"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Calendar, LayoutDashboard, QrCode, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  userId: string
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="block text-2xl font-serif font-semibold tracking-tight text-foreground">Wedspace</span>
              <span className="hidden text-[11px] uppercase tracking-[0.22em] text-muted-foreground lg:block">
                Your private wedding home
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/dashboard/scanner"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <QrCode className="h-4 w-4" />
              Check-In
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-primary/10"
                }
              }}
            />
          </div>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/98 backdrop-blur-md">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/dashboard/scanner"
              className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <QrCode className="h-4 w-4" />
              Check-In
            </Link>
            <div className="pt-2 border-t border-border/40">
              <UserButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
