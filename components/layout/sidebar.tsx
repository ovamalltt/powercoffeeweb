"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Coffee,
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  Users,
  UserCog,
  LogOut,
  Menu,
  X,
  FileBarChart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"

const menuItems = [
  { id: "dashboard", path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "menu", path: "/menu", icon: UtensilsCrossed, label: "Menu" },
  { id: "transaction", path: "/transaction", icon: Receipt, label: "Transaction" },
  { id: "customers", path: "/customers", icon: Users, label: "Customers" },
  { id: "employees", path: "/employees", icon: UserCog, label: "Employees" },
  { id: "reports", path: "/reports", icon: FileBarChart, label: "Reports" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 glass rounded-xl flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 lg:z-40 w-64 lg:w-20 bg-card lg:bg-transparent p-4 transition-transform duration-300",
          "lg:left-4 lg:top-4 lg:bottom-4 lg:glass lg:rounded-2xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3 lg:justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="lg:hidden text-xl font-bold text-foreground">PowerCoffee</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-3 lg:justify-center px-4 py-3 lg:p-0 lg:w-11 lg:h-11 lg:mx-auto rounded-xl transition-all duration-300 group relative",
                    isActive ? "bg-accent/20 lg:glow-gold" : "hover:bg-secondary",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors duration-300 flex-shrink-0",
                      isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "lg:hidden text-sm font-medium",
                      isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  {/* Desktop tooltip */}
                  <span className="hidden lg:block absolute left-full ml-3 px-2 py-1 bg-card rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 lg:justify-center px-4 py-3 lg:p-0 lg:w-11 lg:h-11 lg:mx-auto rounded-xl hover:bg-destructive/20 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
            <span className="lg:hidden text-sm font-medium text-muted-foreground group-hover:text-destructive">
              Logout
            </span>
          </button>

          {/* Brand text - desktop only */}
          <div className="hidden lg:block mt-4 text-center">
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest">POWER</span>
          </div>
        </div>
      </aside>
    </>
  )
}
