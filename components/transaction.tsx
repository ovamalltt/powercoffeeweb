"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart, User, CheckCircle2 } from "lucide-react"

export default function TransactionContent() {
  const supabase = createClient()
  const { toast } = useToast()
  
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // 1. Ambil data karyawan & produk saat halaman dibuka
  useEffect(() => {
    async function fetchData() {
      const { data: empData } = await supabase.from("karyawan").select("*")
      const { data: prodData } = await supabase.from("produk").select("*")
      if (empData) setEmployees(empData)
      if (prodData) setProducts(prodData)
    }
    fetchData()
  }, [])

  const total = cart.reduce((sum, item) => sum + item.harga * item.quantity, 0)

  // 2. Fungsi Proses Transaksi
  const handleCheckout = async () => {
    if (!selectedEmployeeId) {
      toast({ title: "Error", description: "Pilih Kasir terlebih dahulu!", variant: "destructive" })
      return
    }

    setIsProcessing(true)
    try {
      // Simpan ke tabel pesanan (Kuncinya ada di id_karyawan)
      const { data: order, error: orderError } = await supabase
        .from("pesanan")
        .insert({
          id_karyawan: parseInt(selectedEmployeeId), // Menyimpan ID Kasir
          tanggal_transaksi: new Date().toISOString(),
          total_bayar: total,
          metode_bayar: "Tunai",
          status_pesanan: "Selesai"
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Simpan detail pesanan
      const details = cart.map(item => ({
        id_pesanan: order.id_pesanan,
        id_produk: item.id_produk,
        jumlah: item.quantity,
        subtotal: item.harga * item.quantity
      }))

      const { error: detailError } = await supabase.from("detail_pesanan").insert(details)
      if (detailError) throw detailError

      toast({ title: "Berhasil!", description: "Transaksi telah disimpan." })
      setCart([])
      setSelectedEmployeeId("")
    } catch (error: any) {
      toast({ title: "Gagal", description: error.message, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Menu Makanan & Minuman</h2>
        {/* Render Produk Disini (sama seperti kode kamu sebelumnya) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           {products.map(p => (
             <Card key={p.id_produk} className="p-4 cursor-pointer hover:border-primary" onClick={() => {
                const existing = cart.find(item => item.id_produk === p.id_produk)
                if (existing) {
                    setCart(cart.map(item => item.id_produk === p.id_produk ? {...item, quantity: item.quantity + 1} : item))
                } else {
                    setCart([...cart, {...p, quantity: 1}])
                }
             }}>
                <p className="font-bold">{p.nama_produk}</p>
                <p className="text-sm text-muted-foreground">Rp {p.harga.toLocaleString()}</p>
             </Card>
           ))}
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6 shadow-xl border-t-4 border-primary">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Ringkasan Order
          </h3>

          {/* PILIH KASIR (WAJIB) */}
          <div className="mb-6 space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pilih Kasir / Server</label>
            <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
              <SelectTrigger className="w-full bg-secondary/50 border-none h-12">
                <SelectValue placeholder="-- Pilih Nama Kasir --" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id_karyawan} value={emp.id_karyawan.toString()}>
                    {emp.nama_karyawan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id_produk} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.nama_produk}</span>
                <span>Rp {(item.harga * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-primary">Rp {total.toLocaleString()}</span>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold rounded-xl" 
            disabled={isProcessing || cart.length === 0 || !selectedEmployeeId}
            onClick={handleCheckout}
          >
            {isProcessing ? "Memproses..." : !selectedEmployeeId ? "Pilih Kasir" : "Bayar Sekarang"}
          </Button>
        </Card>
      </div>
    </div>
  )
}
