"use client"
import { Suspense } from "react"
import MenuContentComponent from "@/components/menu/menu-content"

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuContentComponent />
    </Suspense>
  )
}
