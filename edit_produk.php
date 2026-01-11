<?php 
include 'koneksi.php';
$id = $_GET['id'];
$data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM produk WHERE id_produk = $id"));

if(isset($_POST['update'])) {
    $harga = $_POST['harga'];
    $status = $_POST['status'];
    mysqli_query($conn, "UPDATE produk SET harga = '$harga', status_tersedia = '$status' WHERE id_produk = $id");
    header("Location: produk.php");
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Menu</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#2C1810] text-[#F5E8C7] flex justify-center items-center h-screen">
    <div class="bg-[#3E2723] p-8 rounded-2xl w-96 shadow-2xl border border-[#D4A373]">
        <h3 class="text-xl font-bold mb-6 text-[#D4A373]">Ubah Menu: <br><span class="text-white"><?= $data['nama_produk']; ?></span></h3>
        
        <form method="POST" class="space-y-4">
            <div>
                <label class="block text-sm mb-1">Harga Baru (Rp)</label>
                <input type="number" name="harga" value="<?= $data['harga']; ?>" class="w-full p-2 rounded bg-[#1A0F0A] border border-[#D4A373]" required>
            </div>
            <div>
                <label class="block text-sm mb-1">Status Ketersediaan</label>
                <select name="status" class="w-full p-2 rounded bg-[#1A0F0A] border border-[#D4A373]">
                    <option value="Tersedia" <?= $data['status_tersedia'] == 'Tersedia' ? 'selected' : ''; ?>>Tersedia</option>
                    <option value="Habis" <?= $data['status_tersedia'] == 'Habis' ? 'selected' : ''; ?>>Habis</option>
                </select>
            </div>
            <button type="submit" name="update" class="w-full bg-[#D4A373] text-black font-bold py-2 rounded-lg mt-4">SIMPAN PERUBAHAN</button>
            <a href="produk.php" class="block text-center text-sm mt-4 text-gray-400 underline">Batal</a>
        </form>
    </div>
</body>
</html>
