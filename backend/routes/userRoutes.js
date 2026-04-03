import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { protect, adminOnly, canViewUsers } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@admin.com' && password === 'admin123') {
        let adminUser = await User.findOne({ email });
        if (!adminUser) {
            adminUser = await User.create({
                email,
                password, // Mongoose schema pre('save') middleware will hash it.
                role: 'admin'
            });
        }
    }

    // New View-Only User Creation
    if (email === 'view@users.com' && password === 'view123') {
        let viewUser = await User.findOne({ email });
        if (!viewUser) {
            viewUser = await User.create({
                email,
                password,
                role: 'admin-view'
            });
        }
    }

    let user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // જો જૂનો ડેટા 'Admin' હોય, તો તેને 'admin' માં બદલી નાખવો
        if (user.role === 'Admin') {
            user.role = 'admin';
            await user.save();
        }

        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        email,
        password,
        role: role || 'user',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, canViewUsers, async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
