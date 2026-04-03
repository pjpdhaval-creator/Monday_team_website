import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Purchase from '../models/Purchase.js';
import Sale from '../models/Sale.js';
import Book from '../models/Book.js';

const router = express.Router();

// @desc    Get dashboard metrics
// @route   GET /api/reports/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const totalBooksCount = await Book.countDocuments();

        const purchases = await Purchase.aggregate([
            { $group: { _id: null, totalPurchaseValue: { $sum: "$total" } } }
        ]);

        const sales = await Sale.aggregate([
            { $group: { _id: null, totalSalesValue: { $sum: "$total" } } }
        ]);

        const totalPurchases = purchases.length > 0 ? purchases[0].totalPurchaseValue : 0;
        const totalSales = sales.length > 0 ? sales[0].totalSalesValue : 0;
        const totalProfit = totalSales - totalPurchases;

        const lowStockBooks = await Book.find({ stockQuantity: { $lt: 10 } });

        res.json({
            totalBooks: totalBooksCount,
            totalSales,
            totalPurchases,
            totalProfit,
            lowStockAlerts: lowStockBooks
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
