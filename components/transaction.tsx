"use client"

import { useState } from "react"
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

interface Customer {
  id: number
  name: string
  phone: string
}

const products: Product[] = [
  { id: 1, name: "Kopi Susu Gula Aren", price: 25000 },
  { id: 2, name: "Americano", price: 22000 },
  { id: 3, name: "Cappuccino", price: 28000 },
  { id: 4, name: "Es Kopi Vietnam", price: 26000 },
  { id: 5, name: "Matcha Latte", price: 30000 },
  { id: 6, name: "Chocolate", price: 28000 },
]

const customers: Customer[] = [
  { id: 1, name: "Budi Santoso", phone: "081234567890" },
  { id: 2, name: "Siti Nurhaliza", phone: "082345678901" },
  { id: 3, name: "Ahmad Dahlan", phone: "083456789012" },
  { id: 4, name: "Dewi Lestari", phone: "084567890123" },
]

export function Transaction() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchCustomer, setSearchCustomer] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchCustomer.toLowerCase()) || c.phone.includes(searchCustomer),
  )

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      price,
    )
  }

  const handleProcess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setCart([])
      setSelectedCustomer(null)
      setSearchCustomer("")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Transaction</h1>
        <p className="text-muted-foreground mt-1">Create a new order for customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Selection & Customer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="glass p-6 rounded-2xl border-0">
            <h2 className="text-lg font-semibold text-foreground mb-4">Customer</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search member by name or phone..."
                value={searchCustomer}
                onChange={(e) => {
                  setSearchCustomer(e.target.value)
                  setShowCustomerDropdown(true)
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                className="pl-11 bg-input border-border rounded-xl h-14 text-base"
              />
              {/* Dropdown */}
              {showCustomerDropdown && searchCustomer && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-xl z-10 overflow-hidden">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setSearchCustomer(customer.name)
                          setShowCustomerDropdown(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex justify-between items-center"
                      >
                        <span className="font-medium text-foreground">{customer.name}</span>
                        <span className="text-sm text-muted-foreground">{customer.phone}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-muted-foreground">No customer found</p>
                  )}
                </div>
              )}
            </div>
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-secondary/50 rounded-xl">
                <p className="font-medium text-foreground">{selectedCustomer.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
              </div>
            )}
          </Card>

          {/* Product Selection */}
          <Card className="glass p-6 rounded-2xl border-0">
            <h2 className="text-lg font-semibold text-foreground mb-4">Select Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-4 bg-secondary/50 rounded-xl text-left hover:bg-secondary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <p className="font-medium text-foreground text-sm leading-tight">{product.name}</p>
                  <p className="text-accent font-bold mt-2">{formatPrice(product.price)}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <Card className="glass p-6 rounded-2xl border-0 h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items in cart</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-auto mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-lg bg-destructive/20 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 py-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="text-foreground">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Process Button */}
              <Button
                onClick={handleProcess}
                disabled={isProcessing || cart.length === 0}
                className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isProcessing
                    ? "bg-primary/50"
                    : "bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                } text-primary-foreground`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Process Transaction"
                )}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
