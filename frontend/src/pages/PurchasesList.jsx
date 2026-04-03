import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa';

const PurchasesList = () => {
    const [purchases, setPurchases] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        bookId: '', quantity: 1, unitCost: 0
    });

    const { isAdmin } = useAuth();

    useEffect(() => {
        fetchPurchases();
        if (isAdmin) fetchBooks();
    }, [isAdmin]);

    const fetchPurchases = async () => {
        try {
            const { data } = await axios.get('/api/purchases');
            setPurchases(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get('/api/books');
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBookChange = (e) => {
        const selectedBookId = e.target.value;
        const selectedBook = books.find(b => b._id === selectedBookId);

        setFormData({
            ...formData,
            bookId: selectedBookId,
            unitCost: selectedBook ? selectedBook.purchasePrice : 0
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/purchases', formData);
            fetchPurchases();
            setShowModal(false);
            setFormData({ bookId: '', quantity: 1, unitCost: 0 });
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading purchases...</div>;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Purchase History</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> New Purchase
                    </button>
                )}
            </div>

            <div className="card table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Book</th>
                            <th>Quantity</th>
                            <th>Unit Cost</th>
                            <th>Total Cost</th>
                            <th>Processed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase) => (
                            <tr key={purchase._id}>
                                <td className="text-sm">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                                <td className="font-bold">{purchase.book?.bookName || 'Unknown Book'}</td>
                                <td><span className="badge badge-primary">{purchase.quantity}</span></td>
                                <td>₹{purchase.unitCost.toFixed(2)}</td>
                                <td className="font-bold text-danger">₹{purchase.total.toFixed(2)}</td>
                                <td className="text-sm text-muted">{purchase.purchasedBy?.email || 'N/A'}</td>
                            </tr>
                        ))}
                        {purchases.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-muted">No purchase records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && isAdmin && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card modal-content" style={{ width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 className="text-xl font-bold mb-4">Record New Purchase</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Book</label>
                                <select className="form-control form-select" name="bookId" value={formData.bookId} onChange={handleBookChange} required>
                                    <option value="">-- Choose a book --</option>
                                    {books.map(book => (
                                        <option key={book._id} value={book._id}>{book.bookName} (Stock: {book.stockQuantity})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input type="number" min="1" className="form-control" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit Cost (₹)</label>
                                    <input type="number" step="0.01" className="form-control" name="unitCost" value={formData.unitCost} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="p-3 bg-dark border rounded mt-2 mb-4 text-right">
                                <span className="text-muted text-sm">Total Cost: </span>
                                <span className="font-bold text-xl text-danger">₹{(formData.quantity * formData.unitCost).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={!formData.bookId || formData.quantity <= 0}>Confirm Purchase</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchasesList;
