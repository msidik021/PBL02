const mongoose = require('mongoose');

// Ganti string koneksi dengan URI MongoDB Anda
const mongoURI = 'mongodb+srv://msidik:Akagami@cluster0.8ar6wnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const mongoURI = 'mongodb://localhost:27017/keuanganpribadi';

// Opsi koneksi untuk menghindari peringatan deprecation
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, options);
    console.log('Koneksi ke database MongoDB berhasil!');
  } catch (err) {
    console.error('Gagal terhubung ke database MongoDB:', err);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

module.exports = connectDB;