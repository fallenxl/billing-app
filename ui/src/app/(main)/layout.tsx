import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { AuthGuard } from "@/guards"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lumen Billing",
  description: "Modern billing software for businesses",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 z-40 bg-background border-b">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1 md:hidden" />
                  <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
                  <AppBreadcrumb />
                </div>
              </header>
              <div className="flex flex-col  flex-1">
                {/* <Navigation /> */}
                <div className="flex-1 pt-3">
                  <div className="px-4">
                    {children}
                  </div>
                </div>
                {/* <Footer /> */}
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </AuthGuard>

      </body>
    </html>
  )
}
