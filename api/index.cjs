const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Establish MongoDB connection once
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Test route
app.get('/api/test', (req, res) => {
    res.json("Testing Done");
});

// Create new transaction
app.post('/api/transaction', async (req, res) => {
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({ name, description, datetime, price });
    res.json(transaction);
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

// Delete all transactions (reset)
app.delete('/api/transactions/reset', async (req, res) => {
    try {
        await Transaction.deleteMany({});
        res.json({ message: 'All transactions deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete transactions' });
    }
});

// Start the server
app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port", process.env.PORT || 4000);
});
