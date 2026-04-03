import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Book from '../models/Book.js';

const router = express.Router();

// @desc    Get all books
// @route   GET /api/books
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const bookExists = await Book.findOne({ isbn: req.body.isbn });
        if (bookExists) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }

        const book = new Book(req.body);
        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (book) {
            res.json({ message: 'Book removed' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
