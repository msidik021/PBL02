-- Membuat database baru
CREATE DATABASE IF NOT EXISTS db_keuangan;

-- Menggunakan database yang telah dibuat
USE db_keuangan;

-- Membuat tabel untuk menyimpan transaksi
CREATE TABLE IF NOT EXISTS transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    jumlah DECIMAL(15, 2) NOT NULL,
    keterangan VARCHAR(255)
);

-- Menambahkan indeks pada kolom tanggal untuk pencarian yang lebih cepat
CREATE INDEX idx_tanggal ON transaksi (tanggal);