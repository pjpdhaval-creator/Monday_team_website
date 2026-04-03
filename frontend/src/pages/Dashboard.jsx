import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
    FaBook,
    FaShoppingCart,
    FaMoneyBillWave,
    FaChartLine,
    FaExclamationTriangle
} from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalBooks: 0,
        totalSales: 0,
        totalPurchases: 0,
        totalProfit: 0,
        lowStockAlerts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await axios.get('/api/reports/dashboard');
                setMetrics(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-8 text-xl">Loading dashboard...</div>;
    if (error) return <div className="text-center mt-8 text-danger">{error}</div>;

    const barChartData = {
        labels: ['Sales vs Purchases'],
        datasets: [
            {
                label: 'Total Sales (₹)',
                data: [metrics.totalSales],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
            },
            {
                label: 'Total Purchases (₹)',
                data: [metrics.totalPurchases],
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
            }
        ]
    };

    const pieChartData = {
        labels: ['Profit', 'Cost'],
        datasets: [
            {
                data: [
                    Math.max(0, metrics.totalProfit),
                    metrics.totalPurchases > 0 ? metrics.totalPurchases : 1
                ],
                backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
                borderWidth: 1,
            }
        ]
    };

    return (
        <div>
            {/* Metric Cards: 2 cols on mobile, 4 on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="card metric-card">
                    <div className="metric-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
                        <FaBook />
                    </div>
                    <div className="metric-info">
                        <h3>Total Books</h3>
                        <div className="value">{metrics.totalBooks}</div>
                    </div>
                </div>

                <div className="card metric-card">
                    <div className="metric-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                        <FaMoneyBillWave />
                    </div>
                    <div className="metric-info">
                        <h3>Total Sales</h3>
                        <div className="value">₹{metrics.totalSales.toFixed(2)}</div>
                    </div>
                </div>

                <div className="card metric-card">
                    <div className="metric-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                        <FaShoppingCart />
                    </div>
                    <div className="metric-info">
                        <h3>Total Purchases</h3>
                        <div className="value">₹{metrics.totalPurchases.toFixed(2)}</div>
                    </div>
                </div>

                <div className="card metric-card">
                    <div className="metric-icon" style={{
                        backgroundColor: metrics.totalProfit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: metrics.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'
                    }}>
                        <FaChartLine />
                    </div>
                    <div className="metric-info">
                        <h3>Total Profit</h3>
                        <div className="value" style={{ color: metrics.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            ₹{metrics.totalProfit.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts: single col on mobile, 2 cols on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card">
                    <h3 className="text-base md:text-xl font-bold mb-4">Financial Overview</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-base md:text-xl font-bold mb-4">Profit Margin</h3>
                    <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {metrics.lowStockAlerts.length > 0 && (
                <div className="card mb-6" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <h3 className="text-base md:text-xl font-bold mb-4 flex items-center gap-2 text-danger">
                        <FaExclamationTriangle /> Low Stock Alerts
                    </h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Book Name</th>
                                    <th>ISBN</th>
                                    <th>Stock Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.lowStockAlerts.map(alert => (
                                    <tr key={alert._id}>
                                        <td>{alert.bookName}</td>
                                        <td>{alert.isbn}</td>
                                        <td>
                                            <span className="badge badge-danger">
                                                {alert.stockQuantity} remaining
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
