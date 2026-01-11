-- Seed data for PowerCoffee

-- Insert jabatan (positions)
INSERT INTO jabatan (id_jabatan, nama_jabatan) VALUES
(1, 'Manager'),
(2, 'Barista'),
(3, 'Kasir')
ON CONFLICT (id_jabatan) DO NOTHING;

-- Insert kategori (categories)
INSERT INTO kategori (id_kategori, nama_kategori) VALUES
(1, 'Coffee'),
(2, 'Non-Coffee'),
(3, 'Pastry')
ON CONFLICT (id_kategori) DO NOTHING;

-- Insert karyawan (employees) - user_id will be linked after auth setup
INSERT INTO karyawan (id_karyawan, nama_karyawan, id_jabatan, telp) VALUES
(1, 'Andi Power', 1, '0812345678'),
(2, 'Budi Brew', 2, '0812999888'),
(3, 'Siti Latte', 3, '0812777666')
ON CONFLICT (id_karyawan) DO NOTHING;

-- Insert pelanggan (customers)
INSERT INTO pelanggan (id_pelanggan, nama_pelanggan, poin_loyalitas, email) VALUES
(1, 'Rizky Ramadhan', 105, 'rizky@email.com'),
(2, 'Dewi Sartika', 53, 'dewi@email.com'),
(3, 'Budi Santoso', 78, 'budi@email.com'),
(4, 'Siti Nurhaliza', 42, 'siti@email.com'),
(5, 'Ahmad Dahlan', 25, 'ahmad@email.com'),
(6, 'Maya Putri', 15, 'maya@email.com')
ON CONFLICT (id_pelanggan) DO NOTHING;

-- Insert produk (products) with image URLs
INSERT INTO produk (id_produk, nama_produk, id_kategori, harga, status_tersedia, image_url) VALUES
(1, 'Espresso Single', 1, 20000.00, 'Tersedia', '/black-americano-coffee-glass.jpg'),
(2, 'Es Kopi Gula Aren', 1, 25000.00, 'Tersedia', '/iced-coffee-with-palm-sugar-milk.jpg'),
(3, 'Matcha Latte', 2, 28000.00, 'Tersedia', '/green-matcha-latte-glass.jpg'),
(4, 'Croissant Almond', 3, 30000.00, 'Tersedia', '/butter-croissant-pastry.jpg'),
(5, 'Caramel Macchiato', 1, 35000.00, 'Tersedia', '/cappuccino-with-latte-art.jpg'),
(6, 'Cappuccino', 1, 28000.00, 'Tersedia', '/cappuccino-with-latte-art.jpg'),
(7, 'Es Kopi Vietnam', 1, 26000.00, 'Tersedia', '/vietnamese-iced-coffee-condensed-milk.jpg'),
(8, 'Chocolate', 2, 28000.00, 'Tersedia', '/iced-chocolate-milk-drink.jpg'),
(9, 'Banana Bread', 3, 22000.00, 'Habis', '/sliced-banana-bread-cake.jpg')
ON CONFLICT (id_produk) DO NOTHING;

-- Insert sample pesanan (orders)
INSERT INTO pesanan (id_pesanan, tanggal_transaksi, id_karyawan, id_pelanggan, total_bayar, metode_bayar) VALUES
(1, '2026-01-08 20:14:14', 3, 1, 50000.00, 'QRIS'),
(2, '2026-01-10 18:35:39', 1, 2, 35000.00, 'QRIS'),
(3, '2026-01-11 10:20:00', 2, 3, 75000.00, 'Tunai'),
(4, '2026-01-11 14:45:00', 3, NULL, 28000.00, 'Debit')
ON CONFLICT (id_pesanan) DO NOTHING;

-- Insert detail_pesanan (order details)
INSERT INTO detail_pesanan (id_detail, id_pesanan, id_produk, jumlah, subtotal) VALUES
(1, 1, 2, 2, 50000.00),
(2, 2, 5, 1, 35000.00),
(3, 3, 1, 1, 20000.00),
(4, 3, 6, 1, 28000.00),
(5, 3, 4, 1, 30000.00),
(6, 4, 3, 1, 28000.00)
ON CONFLICT (id_detail) DO NOTHING;

-- Reset sequences to continue from max id
SELECT setval('jabatan_id_jabatan_seq', (SELECT MAX(id_jabatan) FROM jabatan));
SELECT setval('kategori_id_kategori_seq', (SELECT MAX(id_kategori) FROM kategori));
SELECT setval('karyawan_id_karyawan_seq', (SELECT MAX(id_karyawan) FROM karyawan));
SELECT setval('pelanggan_id_pelanggan_seq', (SELECT MAX(id_pelanggan) FROM pelanggan));
SELECT setval('produk_id_produk_seq', (SELECT MAX(id_produk) FROM produk));
SELECT setval('pesanan_id_pesanan_seq', (SELECT MAX(id_pesanan) FROM pesanan));
SELECT setval('detail_pesanan_id_detail_seq', (SELECT MAX(id_detail) FROM detail_pesanan));
