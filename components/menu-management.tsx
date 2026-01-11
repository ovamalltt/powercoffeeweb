"use client"

import { useState } from "react"
import { Plus, Search, Edit2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  image: string
  status: "available" | "soldout"
}

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Kopi Susu Gula Aren",
    category: "Coffee",
    price: 25000,
    image: "/iced-coffee-with-palm-sugar-milk.jpg",
    status: "available",
  },
  {
    id: 2,
    name: "Americano",
    category: "Coffee",
    price: 22000,
    image: "/black-americano-coffee-glass.jpg",
    status: "available",
  },
  {
    id: 3,
    name: "Cappuccino",
    category: "Coffee",
    price: 28000,
    image: "/cappuccino-with-latte-art.jpg",
    status: "available",
  },
  {
    id: 4,
    name: "Es Kopi Vietnam",
    category: "Coffee",
    price: 26000,
    image: "/vietnamese-iced-coffee-condensed-milk.jpg",
    status: "available",
  },
  {
    id: 5,
    name: "Matcha Latte",
    category: "Non-Coffee",
    price: 30000,
    image: "/green-matcha-latte-glass.jpg",
    status: "soldout",
  },
  {
    id: 6,
    name: "Chocolate",
    category: "Non-Coffee",
    price: 28000,
    image: "/iced-chocolate-milk-drink.jpg",
    status: "available",
  },
  {
    id: 7,
    name: "Croissant",
    category: "Pastry",
    price: 18000,
    image: "/butter-croissant-pastry.jpg",
    status: "available",
  },
  {
    id: 8,
    name: "Banana Bread",
    category: "Pastry",
    price: 22000,
    image: "/sliced-banana-bread-cake.jpg",
    status: "soldout",
  },
]

const categories = ["All", "Coffee", "Non-Coffee", "Pastry"]

export function MenuManagement() {
  const [menuItems] = useState<MenuItem[]>(initialMenuItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      price,
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Manage your coffee shop products</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-card border-border rounded-xl h-12"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="glass rounded-2xl border-0 overflow-hidden group hover:scale-[1.02] transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Status Badge */}
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === "available" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                }`}
              >
                {item.status === "available" ? "Tersedia" : "Habis"}
              </span>
              {/* Edit Button - Shows on Hover */}
              <button className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            {/* Content */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.category}</p>
              <h3 className="font-semibold text-foreground text-lg leading-tight">{item.name}</h3>
              <p className="text-2xl font-bold text-accent mt-2">{formatPrice(item.price)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
