<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PowerCoffee | High-End Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #120905; color: #F5E8C7; font-family: 'Inter', sans-serif; }
        .glass-card { background: rgba(30, 15, 10, 0.4); border: 1px solid rgba(212, 163, 115, 0.1); border-radius: 1.5rem; }
        .accent-text { color: #D4A373; }
        .progress-bg { background: rgba(212, 163, 115, 0.1); }
        .progress-fill { background: #D4A373; }
    </style>
</head>
<body class="flex min-h-screen overflow-x-hidden">

    <aside class="w-20 bg-black/40 border-r border-white/5 flex flex-col items-center py-8 gap-10">
        <div class="w-12 h-12 bg-[#D4A373] rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,163,115,0.3)]">
            <i class="fas fa-mug-hot text-xl"></i>
        </div>
        <nav class="flex flex-col gap-8">
            <a href="index.php" class="text-[#D4A373] text-xl"><i class="fas fa-th-large"></i></a>
            <a href="produk.php" class="text-gray-600 hover:text-[#D4A373] text-xl transition"><i class="fas fa-coffee"></i></a>
            <a href="tambah_pesanan.php" class="text-gray-600 hover:text-[#D4A373] text-xl transition"><i class="fas fa-file-invoice"></i></a>
            <a href="pelanggan.php" class="text-gray-600 hover:text-[#D4A373] text-xl transition"><i class="fas fa-user-friends"></i></a>
        </nav>
        <div class="mt-auto text-gray-700 font-bold text-xs rotate-180 [writing-mode:vertical-lr]">POWER</div>
    </aside>

    <main class="flex-1 p-8">
        <header class="flex justify-between items-start mb-10">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p class="text-gray-500 text-sm">Welcome back to PowerCoffee</p>
            </div>
            <div class="text-right">
                <p class="text-xs text-gray-500 uppercase tracking-widest">Today</p>
                <p class="font-bold"><?= date('l, d F Y'); ?></p>
            </div>
        </header>

        <div class="grid grid-cols-4 gap-6 mb-8">
            <div class="glass-card p-6 relative overflow-hidden">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><i class="fas fa-dollar-sign text-[#D4A373]"></i></div>
                    <span class="text-green-500 text-xs font-bold">+12.5% <i class="fas fa-arrow-up"></i></span>
                </div>
                <?php $s = mysqli_fetch_assoc(mysqli_query($conn, "SELECT SUM(total_bayar) as t FROM pesanan")); ?>
                <h3 class="text-2xl font-bold italic">Rp <?= number_format($s['t'] ?? 0, 0, ',', '.'); ?></h3>
                <p class="text-gray-500 text-xs mt-1">Total Sales (All Time)</p>
            </div>

            <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><i class="fas fa-users text-[#D4A373]"></i></div>
                    <span class="text-green-500 text-xs font-bold">+8.2% <i class="fas fa-arrow-up"></i></span>
                </div>
                <?php $c = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as t FROM pelanggan")); ?>
                <h3 class="text-2xl font-bold"><?= $c['t']; ?></h3>
                <p class="text-gray-500 text-xs mt-1">Active Members</p>
            </div>

            <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4 text-red-400">
                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><i class="fas fa-coffee"></i></div>
                    <span class="text-xs font-bold">-3.1% <i class="fas fa-arrow-down"></i></span>
                </div>
                <h3 class="text-2xl font-bold">89</h3>
                <p class="text-gray-500 text-xs mt-1">Orders Today</p>
            </div>

            <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4 text-blue-400">
                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><i class="fas fa-chart-line"></i></div>
                    <span class="text-xs font-bold">+5.4% <i class="fas fa-arrow-up"></i></span>
                </div>
                <h3 class="text-2xl font-bold">23.5%</h3>
                <p class="text-gray-500 text-xs mt-1">Growth Rate</p>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-8 glass-card p-8">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="text-xl font-bold">Top Selling Menu</h3>
                    <span class="bg-white/5 px-3 py-1 rounded-full text-[10px] text-gray-400">This Week</span>
                </div>
                <div class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="w-6 text-gray-600 font-bold">1</span>
                            <div><p class="font-bold text-sm">Kopi Susu Gula Aren</p><p class="text-xs text-gray-500">Rp 25.000</p></div>
                        </div>
                        <p class="font-bold text-sm text-gray-300">234 <span class="text-gray-600 text-[10px] ml-1">sold</span></p>
                    </div>
                    <hr class="border-white/5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="w-6 text-gray-600 font-bold">2</span>
                            <div><p class="font-bold text-sm">Americano</p><p class="text-xs text-gray-500">Rp 22.000</p></div>
                        </div>
                        <p class="font-bold text-sm text-gray-300">189 <span class="text-gray-600 text-[10px] ml-1">sold</span></p>
                    </div>
                </div>
            </div>

            <div class="col-span-4 glass-card p-8">
                <h3 class="text-xl font-bold mb-8">Quick Stats</h3>
                <div class="space-y-8">
                    <div>
                        <div class="flex justify-between text-xs mb-2"><span class="text-gray-400">Daily Target</span><span class="font-bold">78%</span></div>
                        <div class="h-1.5 w-full progress-bg rounded-full overflow-hidden"><div class="h-full progress-fill w-[78%]"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-2"><span class="text-gray-400">Stock Level</span><span class="font-bold text-yellow-500">92%</span></div>
                        <div class="h-1.5 w-full progress-bg rounded-full overflow-hidden"><div class="h-full progress-fill w-[92%]"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-2"><span class="text-gray-400">Member Growth</span><span class="font-bold">65%</span></div>
                        <div class="h-1.5 w-full progress-bg rounded-full overflow-hidden"><div class="h-full progress-fill w-[65%]"></div></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 glass-card p-8 overflow-hidden">
            <h3 class="text-xl font-bold mb-6">Recent Orders</h3>
            <table class="w-full text-left text-sm">
                <thead class="text-gray-600 border-b border-white/5 uppercase text-[10px] tracking-widest">
                    <tr><th class="pb-4">Order ID</th><th class="pb-4">Date</th><th class="pb-4">Total</th><th class="pb-4">Status</th></tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    <?php
                    $res = mysqli_query($conn, "SELECT * FROM pesanan ORDER BY id_pesanan DESC LIMIT 3");
                    while($row = mysqli_fetch_assoc($res)) {
                        echo "<tr>
                            <td class='py-4 font-bold text-[#D4A373]'>#{$row['id_pesanan']}</td>
                            <td class='py-4 text-gray-400'>{$row['tanggal_transaksi']}</td>
                            <td class='py-4 font-bold'>Rp ".number_format($row['total_bayar'], 0, ',', '.')."</td>
                            <td class='py-4'><span class='bg-green-500/10 text-green-500 text-[10px] px-2 py-1 rounded-md font-bold uppercase'>Completed</span></td>
                        </tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </main>

</body>
</html>
