"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface TopProduct {
  name: string
  sales: number
  price: string
}

export function TopSellingMenu() {
  const [topSelling, setTopSelling] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTopSelling() {
      const supabase = createClient()

      // Get top selling products from order details
      const { data } = await supabase.from("detail_pesanan").select(`
          jumlah,
          produk:produk(nama_produk, harga)
        `)

      if (data) {
        // Aggregate sales by product
        const productSales: Record<string, { name: string; sales: number; price: number }> = {}

        data.forEach((item) => {
          const produk = item.produk as { nama_produk: string; harga: number } | null
          if (produk) {
            const name = produk.nama_produk
            if (!productSales[name]) {
              productSales[name] = { name, sales: 0, price: produk.harga }
            }
            productSales[name].sales += item.jumlah
          }
        })

        // Sort by sales and take top 5
        const sorted = Object.values(productSales)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5)
          .map((item) => ({
            name: item.name,
            sales: item.sales,
            price: new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(item.price),
          }))

        setTopSelling(sorted)
      }

      setIsLoading(false)
    }

    fetchTopSelling()
  }, [])

  return (
    <Card className="glass p-6 rounded-2xl border-0 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Top Selling Menu</h2>
        <span className="text-xs text-muted-foreground px-3 py-1 bg-secondary rounded-full">All Time</span>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                <div className="w-8 h-8 rounded-lg bg-secondary" />
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : topSelling.length > 0 ? (
          topSelling.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-accent">{item.sales}</p>
                <p className="text-xs text-muted-foreground">sold</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No sales data yet</p>
        )}
      </div>
    </Card>
  )
}
