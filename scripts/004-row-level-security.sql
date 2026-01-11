-- Enable Row Level Security for all tables
ALTER TABLE jabatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE karyawan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pelanggan ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_pesanan ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read jabatan" ON jabatan
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read kategori" ON kategori
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read karyawan" ON karyawan
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read pelanggan" ON pelanggan
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read produk" ON produk
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read pesanan" ON pesanan
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read detail_pesanan" ON detail_pesanan
  FOR SELECT TO authenticated USING (true);

-- Policy: Allow authenticated users to insert/update/delete
-- In production, you may want to restrict this based on role

CREATE POLICY "Allow authenticated insert jabatan" ON jabatan
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update jabatan" ON jabatan
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete jabatan" ON jabatan
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert kategori" ON kategori
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update kategori" ON kategori
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete kategori" ON kategori
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert karyawan" ON karyawan
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update karyawan" ON karyawan
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete karyawan" ON karyawan
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert pelanggan" ON pelanggan
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update pelanggan" ON pelanggan
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete pelanggan" ON pelanggan
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert produk" ON produk
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update produk" ON produk
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete produk" ON produk
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert pesanan" ON pesanan
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update pesanan" ON pesanan
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete pesanan" ON pesanan
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert detail_pesanan" ON detail_pesanan
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update detail_pesanan" ON detail_pesanan
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete detail_pesanan" ON detail_pesanan
  FOR DELETE TO authenticated USING (true);
