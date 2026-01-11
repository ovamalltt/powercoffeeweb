"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Pesanan } from "@/lib/supabase/types"
import Link from "next/link"

interface OrderWithDetails extends Pesanan {
  karyawan: { nama_karyawan: string } | null
  pelanggan: { nama_pelanggan: string } | null
  detail_pesanan: { jumlah: number }[]
}

export function RecentOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentOrders() {
      const supabase = createClient()

      const { data } = await supabase
        .from("pesanan")
        .select(
          `
          *,
          karyawan:karyawan(nama_karyawan),
          pelanggan:pelanggan(nama_pelanggan),
          detail_pesanan:detail_pesanan(jumlah)
        `,
        )
        .order("tanggal_transaksi", { ascending: false })
        .limit(5)

      if (data) {
        setOrders(data as OrderWithDetails[])
      }

      setIsLoading(false)
    }

    fetchRecentOrders()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="glass p-6 rounded-2xl border-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
        <Link href="/reports" className="text-sm text-accent hover:underline">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium hidden sm:table-cell">Cashier</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium hidden md:table-cell">Payment</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td colSpan={6} className="py-4">
                    <div className="animate-pulse h-4 bg-secondary rounded w-full" />
                  </td>
                </tr>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id_pesanan} className="border-b border-border/50 last:border-0">
                  <td className="py-4 font-mono text-sm text-foreground">
                    ORD-{String(order.id_pesanan).padStart(3, "0")}
                  </td>
                  <td className="py-4 text-foreground">{order.pelanggan?.nama_pelanggan || "Guest"}</td>
                  <td className="py-4 text-muted-foreground hidden sm:table-cell">
                    {order.karyawan?.nama_karyawan || "-"}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {order.detail_pesanan?.reduce((sum, d) => sum + d.jumlah, 0) || 0} items
                  </td>
                  <td className="py-4 font-medium text-foreground">{formatPrice(Number(order.total_bayar))}</td>
                  <td className="py-4 hidden md:table-cell">
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
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
