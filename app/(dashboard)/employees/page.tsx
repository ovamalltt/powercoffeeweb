"use client"
import { Suspense } from "react"
import { EmployeesContent } from "@/components/employees/employees-content"

export default function EmployeesPage() {
  return (
    <Suspense fallback={null}>
      <EmployeesContent />
    </Suspense>
  )
}
