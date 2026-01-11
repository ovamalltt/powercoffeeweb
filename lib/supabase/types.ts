// Database types based on the powercoffee.sql schema
export type PaymentMethod = "Tunai" | "Debit" | "QRIS"
export type ProductStatus = "Tersedia" | "Habis"

export interface Jabatan {
  id_jabatan: number
  nama_jabatan: string
}

export interface Karyawan {
  id_karyawan: number
  nama_karyawan: string
  id_jabatan: number
  telp: string
  // Joined data
  jabatan?: Jabatan
}

export interface Kategori {
  id_kategori: number
  nama_kategori: string
}

export interface Produk {
  id_produk: number
  nama_produk: string
  id_kategori: number
  harga: number
  status_tersedia: ProductStatus
  image_url?: string
  // Joined data
  kategori?: Kategori
}

export interface Pelanggan {
  id_pelanggan: number
  nama_pelanggan: string
  poin_loyalitas: number
  email: string
}

export interface Pesanan {
  id_pesanan: number
  tanggal_transaksi: string
  id_karyawan: number
  id_pelanggan: number | null
  total_bayar: number
  metode_bayar: PaymentMethod
  // Joined data
  karyawan?: Karyawan
  pelanggan?: Pelanggan
  detail_pesanan?: DetailPesanan[]
}

export interface DetailPesanan {
  id_detail: number
  id_pesanan: number
  id_produk: number
  jumlah: number
  subtotal: number
  // Joined data
  produk?: Produk
}

// View type for sales report
export interface LaporanPenjualanDetail {
  id_pesanan: number
  tanggal_transaksi: string
  kasir: string
  pembeli: string | null
  nama_produk: string
  jumlah: number
  subtotal: number
  metode_bayar: PaymentMethod
}

// Auth user profile (linked to karyawan)
export interface UserProfile {
  id: string
  email: string
  id_karyawan: number
  karyawan?: Karyawan
}
