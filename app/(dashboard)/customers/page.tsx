"use client"
import { Suspense } from "react"
import CustomersContent from "@/components/customers/customers-content"

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersContent />
    </Suspense>
  )
}
