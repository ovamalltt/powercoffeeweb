-- Create view for sales report (laporan_penjualan_detail)
CREATE OR REPLACE VIEW laporan_penjualan_detail AS
SELECT 
  p.id_pesanan,
  p.tanggal_transaksi,
  k.nama_karyawan AS kasir,
  pl.nama_pelanggan AS pembeli,
  pr.nama_produk,
  dp.jumlah,
  dp.subtotal,
  p.metode_bayar
FROM pesanan p
JOIN karyawan k ON p.id_karyawan = k.id_karyawan
LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
JOIN detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
JOIN produk pr ON dp.id_produk = pr.id_produk;

-- Function to update loyalty points after purchase (replaces MySQL trigger)
CREATE OR REPLACE FUNCTION update_poin_setelah_beli()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if transaction has a customer (not a guest)
  IF NEW.id_pelanggan IS NOT NULL THEN
    -- Add points: Total / 10000
    UPDATE pelanggan 
    SET poin_loyalitas = poin_loyalitas + FLOOR(NEW.total_bayar / 10000)
    WHERE id_pelanggan = NEW.id_pelanggan;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for loyalty points
DROP TRIGGER IF EXISTS trigger_update_poin ON pesanan;
CREATE TRIGGER trigger_update_poin
AFTER INSERT ON pesanan
FOR EACH ROW
EXECUTE FUNCTION update_poin_setelah_beli();
