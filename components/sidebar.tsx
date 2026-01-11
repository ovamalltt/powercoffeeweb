"use client"

import { Coffee, LayoutDashboard, UtensilsCrossed, Receipt, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "menu", icon: UtensilsCrossed, label: "Menu" },
  { id: "transaction", icon: Receipt, label: "Transaction" },
  { id: "customers", icon: Users, label: "Customers" },
]

export function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  return (
    <aside className="fixed left-4 top-4 bottom-4 w-16 glass rounded-2xl flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Coffee className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeMenu === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group relative",
                isActive ? "bg-accent/20 glow-gold" : "hover:bg-secondary",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-card rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Brand text */}
      <div className="mt-auto">
        <span className="text-[10px] font-bold text-muted-foreground tracking-widest vertical-text">POWER</span>
      </div>
    </aside>
  )
}
