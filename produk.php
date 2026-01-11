<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu Management | PowerCoffee</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #120905; color: #F5E8C7; font-family: 'Inter', sans-serif; }
        .sidebar-icon { color: #525252; transition: all 0.3s; }
        .sidebar-icon.active { color: #D4A373; }
        .product-card { background-color: #1c140f; border: 1px solid #2d241e; border-radius: 1rem; overflow: hidden; transition: transform 0.2s; }
        .product-card:hover { transform: scale(1.02); }
        .search-bar { background-color: #1c140f; border: 1px solid #2d241e; }
        .category-btn { background-color: #1c140f; border: 1px solid #2d241e; color: #a1a1aa; }
        .category-btn.active { background-color: #fef3c7; color: #120905; border-color: #fef3c7; }
    </style>
</head>
<body class="flex min-h-screen">

    <aside class="w-20 bg-[#0a0503] border-r border-white/5 flex flex-col items-center py-6 gap-8 sticky top-0 h-screen">
        <div class="p-3 bg-[#fef3c7] rounded-xl text-black shadow-lg shadow-amber-900/20">
            <i class="fas fa-mug-hot text-xl"></i>
        </div>
        <nav class="flex flex-col gap-8 mt-4">
            <a href="index.php" class="sidebar-icon text-xl hover:text-[#D4A373]"><i class="fas fa-th-large"></i></a>
            <a href="produk.php" class="sidebar-icon active text-xl"><i class="fas fa-utensils"></i></a>
            <a href="tambah_pesanan.php" class="sidebar-icon text-xl hover:text-[#D4A373]"><i class="fas fa-file-invoice-dollar"></i></a>
            <a href="pelanggan.php" class="sidebar-icon text-xl hover:text-[#D4A373]"><i class="fas fa-user-friends"></i></a>
        </nav>
        <div class="mt-auto font-black text-[10px] tracking-widest rotate-180 py-4" style="writing-mode: vertical-rl;">POWER</div>
    </aside>

    <main class="flex-1 p-8">
        <header class="flex justify-between items-start mb-8">
            <div>
                <h1 class="text-3xl font-bold">Menu Management</h1>
                <p class="text-gray-500 text-sm">Manage your coffee shop products</p>
            </div>
            <button class="bg-[#fef3c7] text-[#120905] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <i class="fas fa-plus"></i> Add Product
            </button>
        </header>

        <div class="flex gap-4 mb-10 items-center">
            <div class="relative flex-1">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input type="text" placeholder="Search menu..." class="search-bar w-full py-3 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:border-[#D4A373]">
            </div>
            <div class="flex gap-2">
                <button class="category-btn active px-5 py-2 rounded-full text-xs font-bold">All</button>
                <button class="category-btn px-5 py-2 rounded-full text-xs font-bold">Coffee</button>
                <button class="category-btn px-5 py-2 rounded-full text-xs font-bold">Non-Coffee</button>
                <button class="category-btn px-5 py-2 rounded-full text-xs font-bold">Pastry</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php
            // Mengambil data dari database (sesuai query awal kamu)
            $query = mysqli_query($conn, "SELECT produk.*, kategori.nama_kategori 
                                         FROM produk 
                                         JOIN kategori ON produk.id_kategori = kategori.id_kategori");
            
            while($row = mysqli_fetch_assoc($query)) {
                $isTersedia = ($row['status_tersedia'] == 'Tersedia');
                $badgeClass = $isTersedia ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white';
                
                // Logika placeholder gambar (karena di DB belum ada link gambar, kita pakai random coffee image dari Unsplash)
                $img_url = "https://images.unsplash.com/photo-1541167760496-1628856ab752?q=80&w=500&auto=format&fit=crop"; 
                if($row['nama_produk'] == "Americano") $img_url = "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=500&auto=format&fit=crop";
                if($row['nama_produk'] == "Cappuccino") $img_url = "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500&auto=format&fit=crop";
            ?>
                <div class="product-card group cursor-pointer" onclick="location.href='edit_produk.php?id=<?= $row['id_produk'] ?>'">
                    <div class="relative aspect-square overflow-hidden">
                        <img src="<?= $img_url ?>" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="<?= $row['nama_produk'] ?>">
                        <div class="absolute top-3 right-3 shadow-lg shadow-black/50">
                            <span class="<?= $badgeClass ?> text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                                <?= $row['status_tersedia'] ?>
                            </span>
                        </div>
                    </div>
                    
                    <div class="p-5">
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1"><?= $row['nama_kategori'] ?></p>
                        <h3 class="text-base font-bold text-gray-100 mb-2"><?= $row['nama_produk'] ?></h3>
                        <div class="flex justify-between items-center">
                            <p class="text-lg font-bold text-[#D4A373]">Rp <?= number_format($row['harga'], 0, ',', '.') ?></p>
                            <button class="text-gray-600 hover:text-red-500 transition"><i class="fas fa-trash-alt text-xs"></i></button>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
    </main>

</body>
</html>
