import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('API is running....');
});

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
    }
};

startServer();
