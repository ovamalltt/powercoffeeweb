"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Coffee, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface StatData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  description: string
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatData[]>([
    {
      title: "Total Sales",
      value: "Loading...",
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      description: "this month",
    },
    {
      title: "Active Members",
      value: "Loading...",
      change: "+0%",
      trend: "up",
      icon: Users,
      description: "registered customers",
    },
    {
      title: "Orders Today",
      value: "Loading...",
      change: "+0%",
      trend: "up",
      icon: Coffee,
      description: "vs yesterday",
    },
    {
      title: "Products",
      value: "Loading...",
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
      description: "available items",
    },
  ])

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      // Fetch total sales this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: salesData } = await supabase
        .from("pesanan")
        .select("total_bayar")
        .gte("tanggal_transaksi", startOfMonth.toISOString())

      const totalSales = salesData?.reduce((sum, order) => sum + (Number(order.total_bayar) || 0), 0) || 0

      // Fetch customer count
      const { count: customerCount } = await supabase.from("pelanggan").select("*", { count: "exact", head: true })

      // Fetch today's orders
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: todayOrders } = await supabase
        .from("pesanan")
        .select("*", { count: "exact", head: true })
        .gte("tanggal_transaksi", today.toISOString())

      // Fetch available products
      const { count: productCount } = await supabase
        .from("produk")
        .select("*", { count: "exact", head: true })
        .eq("status_tersedia", "Tersedia")

      const formatCurrency = (value: number) => {
        if (value >= 1000000) {
          return `Rp ${(value / 1000000).toFixed(1)}M`
        }
        return `Rp ${(value / 1000).toFixed(0)}K`
      }

      setStats([
        {
          title: "Total Sales",
          value: formatCurrency(totalSales),
          change: "+12.5%",
          trend: "up",
          icon: DollarSign,
          description: "this month",
        },
        {
          title: "Active Members",
          value: customerCount?.toString() || "0",
          change: "+8.2%",
          trend: "up",
          icon: Users,
          description: "registered customers",
        },
        {
          title: "Orders Today",
          value: todayOrders?.toString() || "0",
          change: "+5%",
          trend: "up",
          icon: Coffee,
          description: "transactions",
        },
        {
          title: "Products",
          value: productCount?.toString() || "0",
          change: "+2",
          trend: "up",
          icon: TrendingUp,
          description: "available items",
        },
      ])
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="glass p-5 rounded-2xl border-0 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.description}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
