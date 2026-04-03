import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BooksList from './pages/BooksList';
import PurchasesList from './pages/PurchasesList';
import SalesList from './pages/SalesList';
import UsersList from './pages/UsersList';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* If not logged in, the root path shows Login. 
          We also keep /login for direct access. */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BooksList />} />
        <Route path="purchases" element={<PurchasesList />} />
        <Route path="sales" element={<SalesList />} />
        <Route path="users" element={<UsersList />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
