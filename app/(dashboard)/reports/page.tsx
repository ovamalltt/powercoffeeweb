"use client"

import { useEffect, useState } from "react"
import { Calendar, TrendingUp, DollarSign, ShoppingBag, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Pesanan } from "@/lib/supabase/types"

interface OrderWithDetails extends Pesanan {
  karyawan: { nama_karyawan: string } | null
  pelanggan: { nama_pelanggan: string } | null
  detail_pesanan: { jumlah: number; produk: { nama_produk: string } | null }[]
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("week")
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalItems: 0,
  })

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  async function fetchReports() {
    setIsLoading(true)
    const supabase = createClient()

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const { data } = await supabase
      .from("pesanan")
      .select(`
        *,
        karyawan:karyawan(nama_karyawan),
        pelanggan:pelanggan(nama_pelanggan),
        detail_pesanan:detail_pesanan(jumlah, produk:produk(nama_produk))
      `)
      .gte("tanggal_transaksi", startDate.toISOString())
      .order("tanggal_transaksi", { ascending: false })

    if (data) {
      const typedData = data as OrderWithDetails[]
      setOrders(typedData)

      // Calculate stats
      const totalRevenue = typedData.reduce((sum, order) => sum + Number(order.total_bayar || 0), 0)
      const totalOrders = typedData.length
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const totalItems = typedData.reduce(
        (sum, order) => sum + (order.detail_pesanan?.reduce((s, d) => s + d.jumlah, 0) || 0),
        0,
      )

      setStats({ totalRevenue, totalOrders, avgOrderValue, totalItems })
    }

    setIsLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Cashier", "Items", "Total", "Payment"]
    const rows = orders.map((order) => [
      `ORD-${String(order.id_pesanan).padStart(3, "0")}`,
      formatDate(order.tanggal_transaksi || ""),
      order.pelanggan?.nama_pelanggan || "Guest",
      order.karyawan?.nama_karyawan || "-",
      order.detail_pesanan?.reduce((sum, d) => sum + d.jumlah, 0) || 0,
      Number(order.total_bayar),
      order.metode_bayar,
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `powercoffee-report-${dateRange}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 h-11 bg-card border-border rounded-xl">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="h-11 border-border rounded-xl bg-transparent"
          disabled={orders.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass p-5 rounded-2xl border-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold text-foreground">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(stats.avgOrderValue)}</p>
            </div>
          </div>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items Sold</p>
              <p className="text-xl font-bold text-foreground">{stats.totalItems}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="glass rounded-2xl border-0 overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground bg-secondary/30">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Cashier</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-secondary rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id_pesanan}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-foreground">
                      ORD-{String(order.id_pesanan).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(order.tanggal_transaksi || "")}
                    </td>
                    <td className="px-6 py-4 text-foreground">{order.pelanggan?.nama_pelanggan || "Guest"}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                      {order.karyawan?.nama_karyawan || "-"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.detail_pesanan?.reduce((sum, d) => sum + d.jumlah, 0) || 0} items
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{formatPrice(Number(order.total_bayar))}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.metode_bayar === "QRIS"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.metode_bayar === "Debit"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {order.metode_bayar}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No transactions found for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
