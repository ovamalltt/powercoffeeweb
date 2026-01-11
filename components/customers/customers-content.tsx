"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Pencil, Trash2, Star, Mail, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { Pelanggan } from "@/lib/supabase/types"

// PERBAIKAN: Menambahkan kata 'default' agar sesuai dengan cara import di page.tsx
export default function CustomersContent() {
  const [customers, setCustomers] = useState<Pelanggan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Pelanggan | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    email: "",
    poin_loyalitas: "0",
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    const supabase = createClient()
    const { data } = await supabase.from("pelanggan").select("*").order("nama_pelanggan")
    if (data) setCustomers(data)
    setIsLoading(false)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openAddModal = () => {
    setEditingCustomer(null)
    setFormData({ nama_pelanggan: "", email: "", poin_loyalitas: "0" })
    setIsModalOpen(true)
  }

  const openEditModal = (customer: Pelanggan) => {
    setEditingCustomer(customer)
    setFormData({
      nama_pelanggan: customer.nama_pelanggan,
      email: customer.email || "",
      poin_loyalitas: customer.poin_loyalitas?.toString() || "0",
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const customerData = {
      nama_pelanggan: formData.nama_pelanggan,
      email: formData.email || null,
      poin_loyalitas: Number.parseInt(formData.poin_loyalitas) || 0,
    }

    if (editingCustomer) {
      await supabase.from("pelanggan").update(customerData).eq("id_pelanggan", editingCustomer.id_pelanggan)
    } else {
      await supabase.from("pelanggan").insert(customerData)
    }

    setIsModalOpen(false)
    setIsSaving(false)
    fetchCustomers()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return
    const supabase = createClient()
    await supabase.from("pelanggan").delete().eq("id_pelanggan", id)
    fetchCustomers()
  }

  const getLoyaltyTier = (points: number) => {
    if (points >= 100) return { name: "Gold", color: "text-yellow-400 bg-yellow-400/20" }
    if (points >= 50) return { name: "Silver", color: "text-gray-300 bg-gray-300/20" }
    return { name: "Bronze", color: "text-orange-400 bg-orange-400/20" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border rounded-xl"
          />
        </div>
        <Button
          onClick={openAddModal}
          className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold text-foreground mt-1">{customers.length}</p>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-sm text-muted-foreground">Gold Members</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {customers.filter((c) => (c.poin_loyalitas || 0) >= 100).length}
          </p>
        </Card>
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-sm text-muted-foreground">Total Points Issued</p>
          <p className="text-2xl font-bold text-accent mt-1">
            {customers.reduce((sum, c) => sum + (c.poin_loyalitas || 0), 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Customers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass rounded-2xl border-0 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary" />
                <div className="flex-1">
                  <div className="h-5 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => {
            const tier = getLoyaltyTier(customer.poin_loyalitas || 0)
            return (
              <Card
                key={customer.id_pelanggan}
                className="glass rounded-2xl border-0 p-5 hover:scale-[1.02] transition-transform duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {customer.nama_pelanggan.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{customer.nama_pelanggan}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tier.color}`}>{tier.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(customer)}
                      className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id_pelanggan)}
                      className="w-8 h-8 rounded-lg bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-foreground font-medium">{customer.poin_loyalitas || 0} points</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="glass rounded-2xl border-0 p-12">
          <div className="text-center">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Customer Name</Label>
              <Input
                value={formData.nama_pelanggan}
                onChange={(e) => setFormData({ ...formData, nama_pelanggan: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email (optional)</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="e.g. john@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Loyalty Points</Label>
              <Input
                type="number"
                value={formData.poin_loyalitas}
                onChange={(e) => setFormData({ ...formData, poin_loyalitas: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="0"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-border bg-transparent"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                onClick={handleSave}
                disabled={isSaving || !formData.nama_pelanggan}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingCustomer ? (
                  "Save Changes"
                ) : (
                  "Add Customer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
