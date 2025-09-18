-- Hapus database jika sudah ada untuk memastikan skrip berjalan dari awal
DROP DATABASE IF EXISTS Warung;

-- 1. Buat Database dan pilih untuk digunakan
CREATE DATABASE Warung;
USE Warung;

-- 2. Buat tabel-tabel sesuai dengan normalisasi
-- Tabel Pelanggan
CREATE TABLE IF NOT EXISTS Pelanggan (
    Kode    VARCHAR(10) PRIMARY KEY,
    Nama    VARCHAR(50),
    Kelamin VARCHAR(10),
    Alamat  VARCHAR(50),
    Kota    VARCHAR(25)
);

-- Tabel Produk
CREATE TABLE IF NOT EXISTS Produk (
    Kode    VARCHAR(10) PRIMARY KEY,
    Nama    VARCHAR(50),
    Satuan  VARCHAR(20),
    Stok    INT,
    Harga   INT
);

-- Tabel Penjualan (Header Transaksi)
CREATE TABLE IF NOT EXISTS Penjualan (
    No_Jual        VARCHAR(10) PRIMARY KEY,
    Kode_Pelanggan VARCHAR(10),
    Tgl_Jual       DATE,
    FOREIGN KEY (Kode_Pelanggan) REFERENCES Pelanggan(Kode)
);

-- Tabel Detail_Penjualan (Item-item produk dalam transaksi)
CREATE TABLE IF NOT EXISTS Detail_Penjualan (
    No_Jual     VARCHAR(10),
    Kode_Produk VARCHAR(10),
    Jumlah      INT,
    PRIMARY KEY (No_Jual, Kode_Produk),
    FOREIGN KEY (No_Jual) REFERENCES Penjualan(No_Jual),
    FOREIGN KEY (Kode_Produk) REFERENCES Produk(Kode)
);

-- 3. Isi data ke dalam tabel
-- Mengisi data ke tabel Pelanggan
INSERT INTO Pelanggan (Kode, Nama, Kelamin, Alamat, Kota) VALUES
    ('PLG01', 'Mohamad', 'Pria', 'Priok', 'Jakarta'),
    ('PLG02', 'Naufal', 'Pria', 'Cilincing', 'Jakarta'),
    ('PLG03', 'Atila', 'Pria', 'Bojongsang', 'Bandung'),
    ('PLG04', 'Tsalsa', 'Wanita', 'Buah Batu', 'Bandung'),
    ('PLG05', 'Damay', 'Wanita', 'Gubeng', 'Surabaya'),
    ('PLG06', 'Tsaniy', 'Pria', 'Darmo', 'Surabaya'),
    ('PLG07', 'Nabila', 'Wanita', 'Lebak Bulus', 'Jakarta');

-- Mengisi data ke tabel Produk
INSERT INTO Produk (Kode, Nama, Satuan, Stok, Harga) VALUES
    ('P001', 'Indomie', 'Bungkus', 10, 3000),
    ('P002', 'Roti', 'Pak', 3, 18000),
    ('P003', 'Kecap', 'Botol', 8, 4700),
    ('P004', 'Saos Tomat', 'Botol', 8, 5800),
    ('P005', 'Bihun', 'Bungkus', 5, 3500),
    ('P006', 'Sikat Gigi', 'Pak', 5, 15000),
    ('P007', 'Pasta Gigi', 'Pak', 7, 10000),
    ('P008', 'Saos Sambal', 'Botol', 5, 7300);
    
-- Mengisi data ke tabel Penjualan dan Detail_Penjualan
-- Penjualan (Header)
INSERT INTO Penjualan (No_Jual, Kode_Pelanggan, Tgl_Jual) VALUES
    ('J001', 'PLG03', '2025-09-08'),
    ('J002', 'PLG07', '2025-09-08'),
    ('J003', 'PLG02', '2025-09-09'),
    ('J004', 'PLG05', '2025-09-10');

-- Detail Penjualan
INSERT INTO Detail_Penjualan (No_Jual, Kode_Produk, Jumlah) VALUES
    ('J001', 'P001', 2),
    ('J001', 'P003', 1),
    ('J001', 'P004', 1),
    ('J002', 'P006', 3),
    ('J002', 'P007', 1),
    ('J003', 'P001', 5),
    ('J003', 'P004', 2),
    ('J003', 'P008', 2),
    ('J003', 'P003', 1),
    ('J004', 'P002', 2),
    ('J004', 'P004', 2),
    ('J004', 'P008', 2),
    ('J004', 'P006', 2),
    ('J004', 'P007', 1);

-- 4. Buat Stored Procedure
-- Prosedur untuk menambahkan pelanggan baru
DELIMITER $$
CREATE PROCEDURE TambahPelanggan (
    IN kode_plg VARCHAR(10),
    IN nama_plg VARCHAR(50),
    IN kelamin_plg VARCHAR(10),
    IN alamat_plg VARCHAR(50),
    IN kota_plg VARCHAR(25)
)
BEGIN
    INSERT INTO Pelanggan (Kode, Nama, Kelamin, Alamat, Kota)
    VALUES (kode_plg, nama_plg, kelamin_plg, alamat_plg, kota_plg);
END$$
DELIMITER ;

-- Prosedur untuk menghapus pelanggan
DELIMITER $$
CREATE PROCEDURE HapusPelanggan (
    IN kode_plg VARCHAR(10)
)
BEGIN
    DELETE FROM Pelanggan WHERE Kode = kode_plg;
END$$
DELIMITER ;

-- Prosedur untuk mencari penjualan berdasarkan nama produk
DELIMITER $$
CREATE PROCEDURE CariPenjualanByProduk (
    IN nama_produk_cari VARCHAR(50)
)
BEGIN
    SELECT
        P.Tgl_Jual,
        P.No_Jual,
        C.Nama AS Nama_Pelanggan,
        Pr.Nama AS Nama_Produk,
        DP.Jumlah
    FROM Penjualan AS P
    JOIN Detail_Penjualan AS DP ON P.No_Jual = DP.No_Jual
    JOIN Produk AS Pr ON DP.Kode_Produk = Pr.Kode
    JOIN Pelanggan AS C ON P.Kode_Pelanggan = C.Kode
    WHERE Pr.Nama LIKE CONCAT('%', nama_produk_cari, '%');
END$$
DELIMITER ;

-- 5. Buat Fungsi untuk menghitung total penjualan
DELIMITER $$
CREATE FUNCTION HitungTotalJual (no_jual VARCHAR(10))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT SUM(DP.Jumlah * Pr.Harga) INTO total
    FROM Detail_Penjualan AS DP
    JOIN Produk AS Pr ON DP.Kode_Produk = Pr.Kode
    WHERE DP.No_Jual = no_jual;
    RETURN total;
END$$
DELIMITER ;

-- 6. Buat View untuk laporan penjualan lengkap
CREATE VIEW V_PenjualanLengkap AS
SELECT
    P.Tgl_Jual,
    P.No_Jual,
    C.Nama AS Nama_Pelanggan,
    Pr.Nama AS Nama_Produk,
    DP.Jumlah,
    (DP.Jumlah * Pr.Harga) AS Subtotal
FROM Penjualan AS P
JOIN Detail_Penjualan AS DP ON P.No_Jual = DP.No_Jual
JOIN Produk AS Pr ON DP.Kode_Produk = Pr.Kode
JOIN Pelanggan AS C ON P.Kode_Pelanggan = C.Kode;

-- 7. Contoh penggunaan untuk melihat hasil
-- Contoh pemanggilan prosedur dan fungsi yang benar
SELECT * FROM Pelanggan;
SELECT * FROM Produk;
SELECT * FROM V_PenjualanLengkap;
SELECT HitungTotalJual('J001');
CALL CariPenjualanByProduk('Saos Sambal');
CALL CariPenjualanByProduk('Indomie');
CALL CariPenjualanByProduk('Kecap');
CALL CariPenjualanByProduk('Sikat Gigi');
CALL CariPenjualanByProduk('Pasta Gigi');
CALL CariPenjualanByProduk('Saos Tomat');
CALL CariPenjualanByProduk('Roti');

-- Contoh penggunaan prosedur untuk data baru
CALL TambahPelanggan('PLG08', 'Budi', 'Pria', 'Menteng', 'Jakarta');

DELIMITER $$
CREATE PROCEDURE CariPenjualanBySatuan (
    IN satuan_cari VARCHAR(20)
)
BEGIN
    SELECT
        P.Tgl_Jual,
        P.No_Jual,
        C.Nama AS Nama_Pelanggan,
        Pr.Nama AS Nama_Produk,
        Pr.Satuan,
        DP.Jumlah
    FROM Penjualan AS P
    JOIN Detail_Penjualan AS DP ON P.No_Jual = DP.No_Jual
    JOIN Produk AS Pr ON DP.Kode_Produk = Pr.Kode
    JOIN Pelanggan AS C ON P.Kode_Pelanggan = C.Kode
    WHERE Pr.Satuan LIKE CONCAT('%', satuan_cari, '%');
END$$
DELIMITER ;

-- Contoh pemanggilan untuk mencari semua produk dengan satuan 'Botol/Pak'
CALL CariPenjualanBySatuan('Botol');
CALL CariPenjualanBySatuan('Pak');

DELIMITER $$
CREATE PROCEDURE CariPenjualanByKelamin (
    IN jenis_kelamin_cari VARCHAR(10)
)
BEGIN
    SELECT
        P.Tgl_Jual,
        P.No_Jual,
        C.Nama AS Nama_Pelanggan,
        C.Kelamin,
        Pr.Nama AS Nama_Produk,
        DP.Jumlah,
        (DP.Jumlah * Pdetail_penjualanNo_Jualr.Harga) AS Subtotal
    FROM Penjualan AS P
    JOIN Pelanggan AS C ON P.Kode_Pelanggan = C.Kode
    JOIN Detail_Penjualan AS DP ON P.No_Jual = DP.No_Jual
    JOIN Produk AS Pr ON DP.Kode_Produk = Pr.Kode
    WHERE C.Kelamin = jenis_kelamin_cari;
END$$
DELIMITER ;

CALL CariPenjualanByKelamin('Pria');
CALL CariPenjualanByKelamin('Wanita');