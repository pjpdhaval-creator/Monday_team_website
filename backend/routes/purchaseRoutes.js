import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Purchase from '../models/Purchase.js';
import Book from '../models/Book.js';

const router = express.Router();

// @desc    Create a purchase
// @route   POST /api/purchases
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { bookId, quantity, unitCost } = req.body;
        const total = quantity * unitCost;

        const purchase = new Purchase({
            book: bookId,
            quantity,
            unitCost,
            total,
            purchasedBy: req.user._id,
        });

        const createdPurchase = await purchase.save();

        // Update book stock
        const book = await Book.findById(bookId);
        if (book) {
            book.stockQuantity += Number(quantity);
            await book.save();
        } else {
            throw new Error('Book not found');
        }

        res.status(201).json(createdPurchase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const purchases = await Purchase.find({}).populate('book', 'bookName author category isbn').populate('purchasedBy', 'email');
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
