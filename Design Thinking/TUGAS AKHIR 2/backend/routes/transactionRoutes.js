const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Impor model Mongoose

// Mengganti query SQL dengan metode Mongoose
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const transaction = new Transaction({
        date: req.body.date,
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type,
        category: req.body.category
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ...lanjutkan untuk rute PUT dan DELETE