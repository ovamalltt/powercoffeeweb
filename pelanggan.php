<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Customer Database | PowerCoffee</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #120905; color: #F5E8C7; font-family: 'Inter', sans-serif; }
        .glass-panel { background: #1c140f; border: 1px solid #2d241e; border-radius: 1rem; }
        .member-card { background: #1c140f; border: 1px solid #2d241e; transition: all 0.3s; }
        .member-card:hover { border-color: #D4A373; transform: translateY(-4px); }
        .avatar-circle { background: #2d241e; color: #D4A373; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    </style>
</head>
<body class="flex min-h-screen">

    <aside class="w-20 bg-[#0a0503] border-r border-white/5 flex flex-col items-center py-6 gap-8 sticky top-0 h-screen">
        <div class="p-3 bg-[#fef3c7] rounded-xl text-black shadow-lg">
            <i class="fas fa-mug-hot text-xl"></i>
        </div>
        <nav class="flex flex-col gap-8 mt-4">
            <a href="index.php" class="text-gray-600 text-xl hover:text-[#D4A373]"><i class="fas fa-th-large"></i></a>
            <a href="produk.php" class="text-gray-600 text-xl hover:text-[#D4A373]"><i class="fas fa-utensils"></i></a>
            <a href="tambah_pesanan.php" class="text-gray-600 text-xl hover:text-[#D4A373]"><i class="fas fa-file-invoice-dollar"></i></a>
            <a href="pelanggan.php" class="text-[#D4A373] text-xl"><i class="fas fa-user-friends"></i></a>
        </nav>
    </aside>

    <main class="flex-1 p-8">
        <header class="flex justify-between items-center mb-10">
            <div>
                <h1 class="text-3xl font-bold">Customer Database</h1>
                <p class="text-gray-500 text-sm">Manage your loyal customers</p>
            </div>
            <button class="bg-[#fef3c7] text-black px-6 py-2 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2">
                <i class="fas fa-plus"></i> Add Customer
            </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="glass-panel p-6">
                <p class="text-gray-500 text-xs uppercase font-black mb-2">Total Customers</p>
                <?php 
                $count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as total FROM pelanggan"));
                ?>
                <h2 class="text-4xl font-bold"><?= $count['total'] ?></h2>
            </div>
            <div class="glass-panel p-6">
                <p class="text-gray-500 text-xs uppercase font-black mb-2">Active Members</p>
                <h2 class="text-4xl font-bold text-green-500"><?= $count['total'] ?></h2>
            </div>
            <div class="glass-panel p-6 border-l-4 border-l-[#D4A373]">
                <p class="text-gray-500 text-xs uppercase font-black mb-2 text-[#D4A373]">Total Revenue</p>
                <h2 class="text-4xl font-bold">Rp 5.160.000</h2>
            </div>
        </div>

        <div class="relative mb-8">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
            <input type="text" placeholder="Search by name, email, or phone..." 
                   class="w-full bg-[#1c140f] border border-[#2d241e] rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#D4A373] transition-all">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php
            $res = mysqli_query($conn, "SELECT * FROM pelanggan");
            while($row = mysqli_fetch_assoc($res)) {
                // Ambil inisial nama
                $initial = strtoupper(substr($row['nama_pelanggan'], 0, 1));
            ?>
            <div class="member-card p-6 rounded-2xl relative">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl avatar-circle text-xl">
                            <?= $initial ?>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg"><?= $row['nama_pelanggan'] ?></h3>
                            <span class="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Active</span>
                        </div>
                    </div>
                    <button class="text-gray-600 hover:text-white"><i class="fas fa-ellipsis-v"></i></button>
                </div>

                <div class="space-y-3 mb-6">
                    <div class="flex items-center gap-3 text-sm text-gray-500">
                        <i class="far fa-envelope w-4"></i>
                        <span><?= strtolower(str_replace(' ', '', $row['nama_pelanggan'])) ?>@email.com</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-gray-500">
                        <i class="fas fa-phone-alt w-4"></i>
                        <span><?= $row['telepon'] ?></span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-gray-500">
                        <i class="far fa-calendar-alt w-4"></i>
                        <span>Joined 12 Jan 2024</span>
                    </div>
                </div>

                <div class="border-t border-white/5 pt-4 flex justify-between items-center">
                    <div>
                        <p class="text-[10px] text-gray-600 uppercase font-black">Orders</p>
                        <p class="font-bold text-sm">45</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-gray-600 uppercase font-black">Total Spent</p>
                        <p class="font-bold text-sm text-[#D4A373]">Rp 1.250.000</p>
                    </div>
                </div>
            </div>
            <?php } ?>
        </div>
    </main>
</body>
</html>
