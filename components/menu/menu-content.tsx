"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Pencil, Trash2, Loader2, ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { Produk, Kategori } from "@/lib/supabase/types"
import Image from "next/image"

// PERBAIKAN: Menambahkan kata 'default' di sini
export default function MenuContent() {
  const [products, setProducts] = useState<(Produk & { kategori: Kategori | null })[]>([])
  const [categories, setCategories] = useState<Kategori[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    nama_produk: "",
    id_kategori: "",
    harga: "",
    status_tersedia: "Tersedia",
    image_url: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()

    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("produk").select("*, kategori:kategori(*)").order("nama_produk"),
      supabase.from("kategori").select("*").order("nama_kategori"),
    ])

    if (productsRes.data) {
      setProducts(productsRes.data as (Produk & { kategori: Kategori | null })[])
    }
    if (categoriesRes.data) {
      setCategories(categoriesRes.data)
    }
    setIsLoading(false)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.id_kategori?.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      nama_produk: "",
      id_kategori: categories[0]?.id_kategori.toString() || "",
      harga: "",
      status_tersedia: "Tersedia",
      image_url: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product: Produk) => {
    setEditingProduct(product)
    setFormData({
      nama_produk: product.nama_produk,
      id_kategori: product.id_kategori?.toString() || "",
      harga: product.harga.toString(),
      status_tersedia: product.status_tersedia || "Tersedia",
      image_url: product.image_url || "",
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const productData = {
      nama_produk: formData.nama_produk,
      id_kategori: Number.parseInt(formData.id_kategori),
      harga: Number.parseFloat(formData.harga),
      status_tersedia: formData.status_tersedia,
      image_url: formData.image_url || null,
    }

    if (editingProduct) {
      await supabase.from("produk").update(productData).eq("id_produk", editingProduct.id_produk)
    } else {
      await supabase.from("produk").insert(productData)
    }

    setIsModalOpen(false)
    setIsSaving(false)
    fetchData()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    const supabase = createClient()
    await supabase.from("produk").delete().eq("id_produk", id)
    fetchData()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border rounded-xl"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-44 h-11 bg-card border-border rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id_kategori} value={cat.id_kategori.toString()}>
                  {cat.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={openAddModal}
          className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="glass rounded-2xl border-0 overflow-hidden animate-pulse">
              <div className="aspect-square bg-secondary" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-secondary rounded w-3/4" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id_produk}
              className="glass rounded-2xl border-0 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="aspect-square relative bg-secondary">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.nama_produk}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                {/* Status Badge */}
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${
                    product.status_tersedia === "Tersedia"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {product.status_tersedia}
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="rounded-xl" onClick={() => openEditModal(product)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-xl"
                    onClick={() => handleDelete(product.id_produk)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-foreground truncate">{product.nama_produk}</p>
                <p className="text-xs text-muted-foreground mt-1">{product.kategori?.nama_kategori}</p>
                <p className="text-lg font-bold text-accent mt-2">{formatPrice(Number(product.harga))}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass rounded-2xl border-0 p-12">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Product Name</Label>
              <Input
                value={formData.nama_produk}
                onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="e.g. Cappuccino"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Category</Label>
              <Select
                value={formData.id_kategori}
                onValueChange={(value) => setFormData({ ...formData, id_kategori: value })}
              >
                <SelectTrigger className="h-11 bg-input border-border rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id_kategori} value={cat.id_kategori.toString()}>
                      {cat.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Price (IDR)</Label>
              <Input
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="e.g. 25000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Status</Label>
              <Select
                value={formData.status_tersedia}
                onValueChange={(value) => setFormData({ ...formData, status_tersedia: value })}
              >
                <SelectTrigger className="h-11 bg-input border-border rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tersedia">Available</SelectItem>
                  <SelectItem value="Habis">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Image URL (optional)</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="/cappuccino.jpg"
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
                disabled={isSaving || !formData.nama_produk || !formData.harga}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingProduct ? (
                  "Save Changes"
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
