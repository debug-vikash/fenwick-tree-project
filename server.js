require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const fenwickRoutes = require('./routes/fenwickRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/fenwick', fenwickRoutes);

const { internalInitialize } = require('./controllers/fenwickController');

const startServer = async () => {
    await connectDB();
    
    try {
        const stats = await internalInitialize();
        console.log(`Fenwick Tree Initialized: ${stats.count} records processed.`);
    } catch (err) {
        console.error('Initial Tree Sync Failed:', err.message);
    }

    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

