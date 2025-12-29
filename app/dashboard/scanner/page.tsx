import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { QRScanner } from "@/components/qr-scanner"

export default async function ScannerPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userId={userId} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
            <p className="text-muted-foreground">Scan attendee QR codes to check them in</p>
          </div>
          <QRScanner />
        </div>
      </main>
    </div>
  )
}
