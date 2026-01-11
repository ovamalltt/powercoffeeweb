<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>New Transaction | PowerCoffee</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #120905; color: #F5E8C7; font-family: 'Inter', sans-serif; }
        .glass-panel { background: #1c140f; border: 1px solid #2d241e; border-radius: 1rem; }
        .product-item { background: #261a12; border: 1px solid #3d2b1f; transition: all 0.2s; cursor: pointer; }
        .product-item:hover { border-color: #D4A373; background: #2d241e; }
        input { background: #1c140f !important; border: 1px solid #2d241e !important; color: white !important; }
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
            <a href="tambah_pesanan.php" class="text-[#D4A373] text-xl"><i class="fas fa-file-invoice-dollar"></i></a>
            <a href="pelanggan.php" class="text-gray-600 text-xl hover:text-[#D4A373]"><i class="fas fa-user-friends"></i></a>
        </nav>
    </aside>

    <main class="flex-1 p-8 flex gap-6">
        
        <div class="flex-[2] space-y-6">
            <header>
                <h1 class="text-3xl font-bold">New Transaction</h1>
                <p class="text-gray-500 text-sm">Create a new order for customers</p>
            </header>

            <div class="glass-panel p-6 mb-6">
    <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Customer Selection</label>
    <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-600 group-focus-within:text-[#D4A373] transition-colors"></i>
        </div>
        <input type="text" id="customer-search-input" 
               class="w-full bg-[#120905] border border-[#2d241e] text-gray-300 py-4 pl-12 pr-4 rounded-2xl text-sm focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] transition-all placeholder:text-gray-700" 
               placeholder="Search member by name or phone..."
               onkeyup="filterCustomer()">
        
        <div id="customer-dropdown" class="absolute z-50 w-full mt-2 bg-[#1c140f] border border-[#2d241e] rounded-2xl shadow-2xl hidden max-h-60 overflow-y-auto">
            <div class="p-2 cursor-pointer hover:bg-[#2d241e] text-sm py-3 px-4 text-[#D4A373] font-bold border-b border-white/5" onclick="selectCustomer(0, 'Walk-in Customer (Guest)')">
                <i class="fas fa-user-circle mr-2"></i> Walk-in Customer (Guest)
            </div>
            <?php 
            $p = mysqli_query($conn, "SELECT * FROM pelanggan");
            while($rp = mysqli_fetch_assoc($p)) {
                echo "<div class='customer-option p-2 cursor-pointer hover:bg-[#2d241e] text-sm py-3 px-4 text-gray-400 border-b border-white/5' 
                           data-name='".strtolower($rp['nama_pelanggan'])."' 
                           onclick=\"selectCustomer({$rp['id_pelanggan']}, '{$rp['nama_pelanggan']}')\">
                        <i class='far fa-user mr-2 text-gray-600'></i> {$rp['nama_pelanggan']}
                      </div>";
            }
            ?>
        </div>
    </div>
</div>

            <div class="glass-panel p-6">
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Select Products</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <?php
                    $res = mysqli_query($conn, "SELECT * FROM produk WHERE status_tersedia = 'Tersedia'");
                    while($row = mysqli_fetch_assoc($res)) {
                    ?>
                        <div class="product-item p-4 rounded-xl" onclick="addToCart(<?= $row['id_produk'] ?>, '<?= $row['nama_produk'] ?>', <?= $row['harga'] ?>)">
                            <h4 class="font-bold text-sm mb-1"><?= $row['nama_produk'] ?></h4>
                            <p class="text-[#D4A373] font-bold text-xs">Rp <?= number_format($row['harga'], 0, ',', '.') ?></p>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </div>

        <div class="flex-1">
            <div class="glass-panel p-6 sticky top-8 h-[calc(100vh-4rem)] flex flex-col">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center"><i class="fas fa-shopping-cart text-xs"></i></div>
                    <h3 class="font-bold">Order Summary</h3>
                </div>

                <div id="cart-list" class="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 text-sm text-gray-400">
                    <div id="empty-msg" class="text-center py-20">No items in cart</div>
                </div>

                <div class="border-t border-white/5 pt-6 space-y-4">
                    <div class="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span id="display-total" class="text-[#D4A373]">Rp 0</span>
                    </div>

                    <form action="proses_simpan.php" method="POST">
                        <input type="hidden" name="id_pelanggan" id="form-customer-id" value="0">
                        <input type="hidden" name="total_bayar" id="form-total" value="0">
                        <input type="hidden" name="id_karyawan" value="1"> <div class="mb-4">
                            <label class="block text-[10px] uppercase font-black mb-2 text-gray-600">Payment Method</label>
                            <select name="metode_bayar" class="w-full bg-[#1c140f] border border-[#2d241e] text-white p-3 rounded-lg text-xs">
                                <option>QRIS</option>
                                <option>Tunai</option>
                                <option>Debit</option>
                            </select>
                        </div>

                        <button type="submit" class="w-full bg-[#fef3c7] text-[#120905] py-4 rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-amber-900/10">
                            COMPLETE TRANSACTION
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>

    <script>
        let cart = [];
        let total = 0;

        // 1. FUNGSI KERANJANG BELANJA
        function addToCart(id, name, price) {
            cart.push({id, name, price});
            updateUI();
        }

        function updateUI() {
            const list = document.getElementById('cart-list');
            const emptyMsg = document.getElementById('empty-msg');
            
            if(cart.length > 0) {
                emptyMsg.style.display = 'none';
            } else {
                emptyMsg.style.display = 'block';
            }
            
            list.innerHTML = cart.map((item, index) => `
                <div class="flex justify-between items-center bg-[#120905] p-4 rounded-xl border border-white/5 mb-3">
                    <div>
                        <p class="font-bold text-gray-200">${item.name}</p>
                        <p class="text-[10px] text-[#D4A373]">Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button type="button" onclick="removeItem(${index})" class="text-gray-700 hover:text-red-500 transition">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            `).join('');

            total = cart.reduce((sum, item) => sum + item.price, 0);
            document.getElementById('display-total').innerText = 'Rp ' + total.toLocaleString('id-ID');
            document.getElementById('form-total').value = total;
        }

        function removeItem(index) {
            cart.splice(index, 1);
            updateUI();
        }

        // 2. FUNGSI PENCARIAN CUSTOMER (BARU)
        function filterCustomer() {
            const input = document.getElementById('customer-search-input');
            const dropdown = document.getElementById('customer-dropdown');
            const options = document.getElementsByClassName('customer-option');
            const filter = input.value.toLowerCase();

            dropdown.classList.remove('hidden');

            for (let i = 0; i < options.length; i++) {
                const name = options[i].getAttribute('data-name');
                if (name.includes(filter)) {
                    options[i].style.display = "";
                } else {
                    options[i].style.display = "none";
                }
            }
        }

        function selectCustomer(id, name) {
            document.getElementById('customer-search-input').value = name;
            document.getElementById('form-customer-id').value = id;
            document.getElementById('customer-dropdown').classList.add('hidden');
        }

        // Tutup dropdown jika klik di luar area search
        window.onclick = function(event) {
            if (!event.target.matches('#customer-search-input')) {
                document.getElementById('customer-dropdown').classList.add('hidden');
            }
        }
    </script>
    

</body>
</html>
