import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        bookName: '', author: '', category: '', isbn: '', purchasePrice: 0, retailPrice: 0, stockQuantity: 0
    });

    const { isAdmin } = useAuth();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get('/api/books');
            setBooks(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetForm = () => {
        setFormData({ bookName: '', author: '', category: '', isbn: '', purchasePrice: 0, retailPrice: 0, stockQuantity: 0 });
        setEditingId(null);
        setShowModal(false);
    };

    const openEditModal = (book) => {
        setFormData({
            bookName: book.bookName,
            author: book.author,
            category: book.category,
            isbn: book.isbn,
            purchasePrice: book.purchasePrice,
            retailPrice: book.retailPrice,
            stockQuantity: book.stockQuantity
        });
        setEditingId(book._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/books/${editingId}`, formData);
            } else {
                await axios.post('/api/books', formData);
            }
            fetchBooks();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`/api/books/${id}`);
                fetchBooks();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    if (loading) return <div className="text-center mt-8">Loading books...</div>;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Books Inventory</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Add New Book
                    </button>
                )}
            </div>

            {error && <div className="badge badge-danger mb-4 p-3 w-full text-center">{error}</div>}

            <div className="card table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>ISBN</th>
                            <th>Pur. Price</th>
                            <th>Ret. Price</th>
                            <th>Stock</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td className="font-bold">{book.bookName}</td>
                                <td>{book.author}</td>
                                <td><span className="badge badge-primary">{book.category}</span></td>
                                <td className="text-muted text-sm">{book.isbn}</td>
                                <td>₹{book.purchasePrice.toFixed(2)}</td>
                                <td>₹{book.retailPrice.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${book.stockQuantity < 10 ? 'badge-danger' : 'badge-success'}`}>
                                        {book.stockQuantity}
                                    </span>
                                </td>
                                {isAdmin && (
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'yellow' }} onClick={() => openEditModal(book)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(book._id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {books.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? "8" : "7"} className="text-center py-8 text-muted">No books found in inventory.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal - A simple implementation for the admin panel */}
            {showModal && isAdmin && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card modal-content" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Book' : 'Add New Book'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Book Name</label>
                                <input type="text" className="form-control" name="bookName" value={formData.bookName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Author</label>
                                <input type="text" className="form-control" name="author" value={formData.author} onChange={handleInputChange} required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input type="text" className="form-control" name="category" value={formData.category} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ISBN</label>
                                    <input type="text" className="form-control" name="isbn" value={formData.isbn} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Purchase Price (₹)</label>
                                    <input type="number" step="0.01" className="form-control" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Retail Price (₹)</label>
                                    <input type="number" step="0.01" className="form-control" name="retailPrice" value={formData.retailPrice} onChange={handleInputChange} required />
                                </div>
                            </div>
                            {!editingId && (
                                <div className="form-group">
                                    <label className="form-label">Initial Stock Quantity</label>
                                    <input type="number" className="form-control" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required />
                                </div>
                            )}

                            <div className="flex justify-between mt-6">
                                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'} Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BooksList;
