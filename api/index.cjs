const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json("Testing Donee");
})

app.post('/api/transaction', async (req, res) => {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({ name, description, datetime, price });

    res.json(transaction);
});

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();

    res.json(transactions);
})

// Add a DELETE endpoint to reset all transactions
app.delete('/api/transactions/reset', async (req, res) => {
    try {
        // Delete all transactions from the database
        await Transaction.deleteMany({});
        res.json({ message: 'All transactions deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete transactions' });
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
})

//OuRQ3V4BFdDnbXe4