"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Input } from "@/components/ui/input"

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Dashboard", description: "Welcome back to PowerCoffee" },
  "/menu": { title: "Menu Management", description: "Manage your coffee shop products" },
  "/transaction": { title: "New Transaction", description: "Create a new order for customers" },
  "/customers": { title: "Customer Database", description: "Manage your loyal customers" },
  "/employees": { title: "Employee Management", description: "Manage your staff members" },
  "/reports": { title: "Reports", description: "View sales and analytics" },
}

export function Header() {
  const pathname = usePathname()
  const { user, karyawan } = useAuth()

  const currentPage = pageTitles[pathname] || { title: "PowerCoffee", description: "" }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Page title - hidden on mobile, shown on larger screens */}
        <div className="hidden sm:block ml-14 lg:ml-0">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">{currentPage.title}</h1>
          <p className="text-sm text-muted-foreground">{currentPage.description}</p>
        </div>

        {/* Mobile title */}
        <div className="sm:hidden ml-14">
          <h1 className="text-lg font-bold text-foreground">{currentPage.title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search - desktop only */}
          <div className="hidden lg:block relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 h-10 bg-card border-border rounded-xl" />
          </div>

          {/* Notifications */}
          <button className="w-10 h-10 rounded-xl bg-card hover:bg-secondary flex items-center justify-center transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">{karyawan?.nama_karyawan || user?.email}</p>
              <p className="text-xs text-muted-foreground">{karyawan?.jabatan?.nama_jabatan || "Staff"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
