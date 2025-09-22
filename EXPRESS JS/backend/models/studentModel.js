exports.update = async (id, student) => {
    const { nama_siswa, alamat_siswa, tanggal_siswa, jurusan_siswa } = student;
    const [result] = await pool.query(
        "UPDATE students SET nama_siswa = ?, alamat_siswa = ?, tanggal_siswa = ?, jurusan_siswa = ? WHERE kode_siswa = ?",
        [nama_siswa, alamat_siswa, tanggal_siswa, jurusan_siswa, id]
    );
    return result.affectedRows;
};