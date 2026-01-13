"use client"

import { useState } from "react"
import { Search, Plus, Mail, Phone, Calendar, MoreVertical } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
}

const customersData: Customer[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081234567890",
    joinDate: "2024-01-15",
    totalOrders: 45,
    totalSpent: 1250000,
    status: "active",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti@email.com",
    phone: "082345678901",
    joinDate: "2024-02-20",
    totalOrders: 38,
    totalSpent: 980000,
    status: "active",
  },
  {
    id: 3,
    name: "Ahmad Dahlan",
    email: "ahmad@email.com",
    phone: "083456789012",
    joinDate: "2024-03-10",
    totalOrders: 22,
    totalSpent: 650000,
    status: "active",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@email.com",
    phone: "084567890123",
    joinDate: "2024-04-05",
    totalOrders: 15,
    totalSpent: 420000,
    status: "inactive",
  },
  {
    id: 5,
    name: "Rudi Hermawan",
    email: "rudi@email.com",
    phone: "085678901234",
    joinDate: "2024-05-12",
    totalOrders: 52,
    totalSpent: 1580000,
    status: "active",
  },
  {
    id: 6,
    name: "Maya Putri",
    email: "maya@email.com",
    phone: "086789012345",
    joinDate: "2024-06-18",
    totalOrders: 8,
    totalSpent: 280000,
    status: "active",
  },
]

export function CustomerDatabase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers] = useState<Customer[]>(customersData)

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      price,
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Database</h1>
          <p className="text-muted-foreground mt-1">Manage your loyal customers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-muted-foreground text-sm">Total Customers</p>
          <p className="text-3xl font-bold text-foreground mt-1">{customers.length}</p>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-muted-foreground text-sm">Active Members</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {customers.filter((c) => c.status === "active").length}
          </p>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-muted-foreground text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-accent mt-1">
            {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 bg-card border-border rounded-xl h-12"
        />
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="glass p-5 rounded-2xl border-0 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{customer.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      customer.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {customer.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
             

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(customer.joinDate)}</span>
              </div>
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="font-bold text-foreground">{customer.totalOrders}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-bold text-accent">{formatPrice(customer.totalSpent)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
