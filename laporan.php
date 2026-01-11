<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>PowerCoffee | Laporan Strategis</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#2C1810] text-[#F5E8C7] p-10">
    <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-[#D4A373] mb-8 italic">📊 Analisis Bisnis PowerCoffee</h2>

        <div class="bg-[#1A0F0A] p-8 rounded-2xl shadow-2xl border border-[#D4A373]">
            <h3 class="text-xl mb-6 font-semibold"><i class="fas fa-trophy text-yellow-500 mr-2"></i> 3 Produk Terlaris (Top Sales)</h3>
            <div class="space-y-4">
                <?php
                $sql = "SELECT p.nama_produk, SUM(dp.jumlah) AS total 
                        FROM detail_pesanan dp 
                        JOIN produk p ON dp.id_produk = p.id_produk 
                        GROUP BY p.id_produk 
                        ORDER BY total DESC LIMIT 3";
                $res = mysqli_query($conn, $sql);
                while($row = mysqli_fetch_assoc($res)) {
                    echo "
                    <div class='flex justify-between items-center bg-[#3E2723] p-4 rounded-xl'>
                        <span class='text-lg'>{$row['nama_produk']}</span>
                        <span class='bg-[#D4A373] text-black px-4 py-1 rounded-full font-bold'>{$row['total']} Terjual</span>
                    </div>";
                }
                ?>
            </div>
        </div>

        <a href="index.php" class="block mt-10 text-center text-[#D4A373] hover:underline"> Kembali ke Dashboard</a>
    </div>
</body>
</html>
