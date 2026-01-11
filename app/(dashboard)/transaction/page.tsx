"use client"
import type { Produk } from "@/lib/supabase/types"
import { Suspense } from "react"
import TransactionContent from "@/components/transaction/transaction-content"

interface CartItem {
  product: Produk
  quantity: number
}

export default function TransactionPage() {
  return (
    <Suspense fallback={null}>
      <TransactionContent />
    </Suspense>
  )
}
