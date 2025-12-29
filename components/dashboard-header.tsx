import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Calendar, LayoutDashboard, QrCode } from "lucide-react"

interface DashboardHeaderProps {
  userId: string
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EventFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/scanner"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <QrCode className="h-4 w-4" />
              Scanner
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
