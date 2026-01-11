-- PowerCoffee Database Schema for Supabase
-- Migrated from MySQL to PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: jabatan (positions/roles)
CREATE TABLE IF NOT EXISTS jabatan (
  id_jabatan SERIAL PRIMARY KEY,
  nama_jabatan VARCHAR(50) NOT NULL
);

-- Table: kategori (product categories)
CREATE TABLE IF NOT EXISTS kategori (
  id_kategori SERIAL PRIMARY KEY,
  nama_kategori VARCHAR(50) NOT NULL
);

-- Table: karyawan (employees)
CREATE TABLE IF NOT EXISTS karyawan (
  id_karyawan SERIAL PRIMARY KEY,
  nama_karyawan VARCHAR(100) NOT NULL,
  id_jabatan INTEGER REFERENCES jabatan(id_jabatan) ON DELETE SET NULL,
  telp VARCHAR(15),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Table: pelanggan (customers)
CREATE TABLE IF NOT EXISTS pelanggan (
  id_pelanggan SERIAL PRIMARY KEY,
  nama_pelanggan VARCHAR(100) NOT NULL,
  poin_loyalitas INTEGER DEFAULT 0,
  email VARCHAR(100)
);

-- Table: produk (products)
CREATE TABLE IF NOT EXISTS produk (
  id_produk SERIAL PRIMARY KEY,
  nama_produk VARCHAR(100) NOT NULL,
  id_kategori INTEGER REFERENCES kategori(id_kategori) ON DELETE SET NULL,
  harga DECIMAL(10,2) NOT NULL,
  status_tersedia VARCHAR(10) DEFAULT 'Tersedia' CHECK (status_tersedia IN ('Tersedia', 'Habis')),
  image_url TEXT
);

-- Table: pesanan (orders)
CREATE TABLE IF NOT EXISTS pesanan (
  id_pesanan SERIAL PRIMARY KEY,
  tanggal_transaksi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  id_karyawan INTEGER REFERENCES karyawan(id_karyawan) ON DELETE SET NULL,
  id_pelanggan INTEGER REFERENCES pelanggan(id_pelanggan) ON DELETE SET NULL,
  total_bayar DECIMAL(10,2),
  metode_bayar VARCHAR(10) CHECK (metode_bayar IN ('Tunai', 'Debit', 'QRIS'))
);

-- Table: detail_pesanan (order details)
CREATE TABLE IF NOT EXISTS detail_pesanan (
  id_detail SERIAL PRIMARY KEY,
  id_pesanan INTEGER REFERENCES pesanan(id_pesanan) ON DELETE CASCADE,
  id_produk INTEGER REFERENCES produk(id_produk) ON DELETE SET NULL,
  jumlah INTEGER NOT NULL,
  subtotal DECIMAL(10,2)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_karyawan_jabatan ON karyawan(id_jabatan);
CREATE INDEX IF NOT EXISTS idx_produk_kategori ON produk(id_kategori);
CREATE INDEX IF NOT EXISTS idx_pesanan_karyawan ON pesanan(id_karyawan);
CREATE INDEX IF NOT EXISTS idx_pesanan_pelanggan ON pesanan(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_pesanan_tanggal ON pesanan(tanggal_transaksi);
CREATE INDEX IF NOT EXISTS idx_detail_pesanan ON detail_pesanan(id_pesanan);
CREATE INDEX IF NOT EXISTS idx_detail_produk ON detail_pesanan(id_produk);
