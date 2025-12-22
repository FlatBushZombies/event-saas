
import { Button } from "@/components/ui/button"
import Logo from "./Logo"


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <span className="font-semibold text-lg">
            EventWorkspace</span>

        <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          
        </nav>

        <div className="flex gap-3">
          <Button variant="ghost">Login</Button>
          <Button className="rounded-full px-6">
            Start Free Trial
          </Button>
        </div>
      </div>
    </header>
  )
}
