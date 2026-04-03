import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaTrash } from 'react-icons/fa';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '', password: '', role: 'user'
    });

    const { registerUser, isAdmin } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/users');
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData.email, formData.password, formData.role);
            fetchUsers();
            setShowModal(false);
            setFormData({ email: '', password: '', role: 'user' });
        } catch (err) {
            alert(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    }

    if (loading) return <div className="text-center mt-8">Loading users...</div>;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold">User Management</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FaUserPlus /> Default Create User
                    </button>
                )}
            </div>

            <div className="card table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined Date</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="text-muted text-sm">{u._id}</td>
                                <td className="font-bold">{u.email}</td>
                                <td>
                                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-warning'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: '0.4rem' }}
                                            onClick={() => handleDelete(u._id)}
                                            disabled={u.email === 'admin@admin.com'}
                                            title={u.email === 'admin@admin.com' ? "Cannot delete primary admin" : "Delete User"}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card modal-content" style={{ width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 className="text-xl font-bold mb-4">Create New User</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" minLength="6" className="form-control" name="password" value={formData.password} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select className="form-control form-select" name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="user">User (Read Only)</option>
                                    <option value="admin">Admin (Full Access)</option>
                                </select>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersList;
