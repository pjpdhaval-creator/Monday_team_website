import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Sale from '../models/Sale.js';
import Book from '../models/Book.js';

const router = express.Router();

// @desc    Create a sale
// @route   POST /api/sales
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }

        if (book.stockQuantity < quantity) {
            throw new Error('Insufficient stock for this sale');
        }

        const total = quantity * book.retailPrice;

        const sale = new Sale({
            book: bookId,
            quantity,
            retailPrice: book.retailPrice,
            total,
            soldBy: req.user._id,
        });

        const createdSale = await sale.save();

        // Update book stock
        book.stockQuantity -= Number(quantity);
        await book.save();

        res.status(201).json(createdSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const sales = await Sale.find({}).populate('book', 'bookName author category isbn').populate('soldBy', 'email');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
