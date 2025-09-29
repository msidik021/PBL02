const express = require('express');
const app = express();
const port = 3000;

// Impor modul koneksi
const connectDB = require('./config/database');

// Panggil fungsi koneksi
connectDB();

// Middleware untuk parsing JSON body
app.use(express.json());

// Impor rute
const transactionRoutes = require('./app/routes/transactionRoutes');
const reportRoutes = require('./app/routes/reportRoutes');

// Daftarkan rute
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});