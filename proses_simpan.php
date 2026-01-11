<?php
include 'koneksi.php';

$id_karyawan = $_POST['id_karyawan'];
$id_pelanggan = !empty($_POST['id_pelanggan']) ? $_POST['id_pelanggan'] : "NULL";
$total_bayar = $_POST['total_bayar'];
$metode_bayar = $_POST['metode_bayar'];

$query = "INSERT INTO pesanan (id_karyawan, id_pelanggan, total_bayar, metode_bayar) 
          VALUES ('$id_karyawan', $id_pelanggan, '$total_bayar', '$metode_bayar')";

if (mysqli_query($conn, $query)) {
    header("Location: index.php?status=sukses");
} else {
    echo "Gagal menyimpan: " . mysqli_error($conn);
}
?>
