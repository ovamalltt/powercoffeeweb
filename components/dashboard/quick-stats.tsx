"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export function QuickStats() {
  const [stats, setStats] = useState({
    dailyTarget: 0,
    stockLevel: 0,
    memberGrowth: 0,
  })

  useEffect(() => {
    async function fetchQuickStats() {
      const supabase = createClient()

      // Fetch today's sales for daily target (assuming target is Rp 500,000)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { data: todaySales } = await supabase
        .from("pesanan")
        .select("total_bayar")
        .gte("tanggal_transaksi", today.toISOString())

      const totalToday = todaySales?.reduce((sum, order) => sum + (Number(order.total_bayar) || 0), 0) || 0
      const dailyTarget = Math.min(Math.round((totalToday / 500000) * 100), 100)

      // Fetch stock level (available vs total products)
      const { count: availableCount } = await supabase
        .from("produk")
        .select("*", { count: "exact", head: true })
        .eq("status_tersedia", "Tersedia")

      const { count: totalProducts } = await supabase.from("produk").select("*", { count: "exact", head: true })

      const stockLevel = totalProducts ? Math.round(((availableCount || 0) / totalProducts) * 100) : 0

      // Member growth (simplified - customers with orders this month vs last month)
      setStats({
        dailyTarget,
        stockLevel,
        memberGrowth: 65, // Placeholder - would need historical data
      })
    }

    fetchQuickStats()
  }, [])

  return (
    <Card className="glass p-6 rounded-2xl border-0">
      <h2 className="text-xl font-bold text-foreground mb-6">Quick Stats</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Target</span>
            <span className="text-foreground font-medium">{stats.dailyTarget}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${stats.dailyTarget}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock Level</span>
            <span className="text-foreground font-medium">{stats.stockLevel}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${stats.stockLevel}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Growth</span>
            <span className="text-foreground font-medium">{stats.memberGrowth}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.memberGrowth}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
