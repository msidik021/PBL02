require('dotenv').config(); // Pastikan ini di baris paling atas

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke database MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Skema dan Model untuk Transaksi
const transactionSchema = new mongoose.Schema({
    date: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: String }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Endpoint untuk mendapatkan semua transaksi
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: 'desc' });
        res.json(transactions.map(t => ({
            id: t._id,
            date: t.date,
            description: t.description,
            amount: t.amount,
            type: t.type,
            category: t.category
        })));
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Endpoint untuk menambahkan transaksi baru
app.post('/api/transactions', async (req, res) => {
    try {
        const { date, description, amount, type, category } = req.body;
        const newTransaction = new Transaction({ date, description, amount, type, category });
        const result = await newTransaction.save();
        res.status(201).json({ message: 'Transaction added successfully', id: result._id });
    } catch (err) {
        console.error('Error adding transaction:', err);
        res.status(500).json({ error: 'Failed to add transaction' });
    }
});

// Endpoint untuk memperbarui transaksi
app.put('/api/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { date, description, amount, type, category } = req.body;
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            { date, description, amount, type, category },
            { new: true } // Mengembalikan dokumen yang diperbarui
        );
        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction updated successfully' });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

// Endpoint untuk menghapus transaksi
app.delete('/api/transactions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

// Endpoint untuk menghapus semua transaksi
app.delete('/api/transactions', async (req, res) => {
    try {
        await Transaction.deleteMany({});
        res.json({ message: 'All transactions deleted successfully' });
    } catch (err) {
        console.error('Error deleting all transactions:', err);
        res.status(500).json({ error: 'Failed to delete all transactions' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});