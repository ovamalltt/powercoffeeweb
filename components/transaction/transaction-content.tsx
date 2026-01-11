"use client"

import { useEffect, useState } from "react"
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, QrCode, Search, User, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { Produk, Kategori, Pelanggan } from "@/lib/supabase/types"
import { useAuth } from "@/components/auth/auth-provider"
import Image from "next/image"

interface CartItem {
  product: Produk
  quantity: number
}

// PERBAIKAN: Menambahkan kata 'default' di sini
export default function TransactionContent() {
  const { karyawan } = useAuth()
  const [products, setProducts] = useState<(Produk & { kategori: Kategori | null })[]>([])
  const [customers, setCustomers] = useState<Pelanggan[]>([])
  const [categories, setCategories] = useState<Kategori[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()

    const [productsRes, customersRes, categoriesRes] = await Promise.all([
      supabase.from("produk").select("*, kategori:kategori(*)").eq("status_tersedia", "Tersedia").order("nama_produk"),
      supabase.from("pelanggan").select("*").order("nama_pelanggan"),
      supabase.from("kategori").select("*").order("nama_kategori"),
    ])

    if (productsRes.data) setProducts(productsRes.data as (Produk & { kategori: Kategori | null })[])
    if (customersRes.data) setCustomers(customersRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    setIsLoading(false)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.id_kategori?.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Produk) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id_produk === product.id_produk)
      if (existing) {
        return prev.map((item) =>
          item.product.id_produk === product.id_produk ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id_produk === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id_produk !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.product.harga) * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = async () => {
    if (!paymentMethod || cart.length === 0) return
    setIsProcessing(true)

    const supabase = createClient()

    const { data: orderData, error: orderError } = await supabase
      .from("pesanan")
      .insert({
        id_karyawan: karyawan?.id_karyawan || null,
        id_pelanggan: selectedCustomer ? Number.parseInt(selectedCustomer) : null,
        total_bayar: cartTotal,
        metode_bayar: paymentMethod,
      })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error("Order error:", orderError)
      setIsProcessing(false)
      return
    }

    const orderDetails = cart.map((item) => ({
      id_pesanan: orderData.id_pesanan,
      id_produk: item.product.id_produk,
      jumlah: item.quantity,
      subtotal: Number(item.product.harga) * item.quantity,
    }))

    await supabase.from("detail_pesanan").insert(orderDetails)

    if (selectedCustomer) {
      const pointsEarned = Math.floor(cartTotal / 10000)
      await supabase.rpc("add_loyalty_points", {
        p_customer_id: Number.parseInt(selectedCustomer),
        p_points: pointsEarned,
      })
    }

    setIsProcessing(false)
    setOrderComplete(true)
  }

  const resetOrder = () => {
    setCart([])
    setSelectedCustomer("")
    setPaymentMethod("")
    setOrderComplete(false)
    setIsCheckoutOpen(false)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
      {/* Products Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border rounded-xl"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40 h-11 bg-card border-border rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id_kategori} value={cat.id_kategori.toString()}>
                  {cat.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="glass rounded-xl border-0 p-3 animate-pulse">
                  <div className="aspect-square bg-secondary rounded-lg mb-2" />
                  <div className="h-4 bg-secondary rounded w-3/4 mb-1" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id_produk}
                  className="glass rounded-xl border-0 p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-square relative bg-secondary rounded-lg mb-2 overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.nama_produk}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">☕</div>
                    )}
                  </div>
                  <p className="font-medium text-foreground text-sm truncate">{product.nama_produk}</p>
                  <p className="text-accent font-semibold text-sm mt-1">{formatPrice(Number(product.harga))}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <Card className="glass rounded-2xl border-0 w-full lg:w-96 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Current Order</h2>
            </div>
            <span className="text-sm text-muted-foreground">{cartItemCount} items</span>
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger className="h-11 bg-input border-border rounded-xl">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Select customer (optional)" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guest">Guest</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id_pelanggan} value={customer.id_pelanggan.toString()}>
                  {customer.nama_pelanggan} ({customer.poin_loyalitas} pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Cart is empty</p>
              <p className="text-sm">Click products to add them</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id_produk} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{item.product.nama_produk}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(Number(item.product.harga))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id_produk, -1)}
                    className="w-7 h-7 rounded-lg bg-card flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id_produk, 1)}
                    className="w-7 h-7 rounded-lg bg-card flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id_produk)}
                    className="w-7 h-7 rounded-lg bg-destructive/20 flex items-center justify-center hover:bg-destructive/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">{formatPrice(cartTotal)}</span>
          </div>
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
          >
            Proceed to Checkout
          </Button>
        </div>
      </Card>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-md">
          {orderComplete ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Order Complete!</h2>
              <p className="text-muted-foreground mb-6">Transaction has been processed successfully.</p>
              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                onClick={resetOrder}
              >
                New Order
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">Checkout</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(cartTotal)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Payment Method</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "Tunai", label: "Cash", icon: Banknote },
                      { id: "Debit", label: "Debit", icon: CreditCard },
                      { id: "QRIS", label: "QRIS", icon: QrCode },
                    ].map((method) => {
                      const Icon = method.icon
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <p
                            className={`text-xs font-medium ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {method.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
                  disabled={!paymentMethod || isProcessing}
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Complete Order"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
