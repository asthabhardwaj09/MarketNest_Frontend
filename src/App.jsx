import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import BrandPage from './pages/BrandPage';
import CustomerPage from './pages/CustomerPage';
import ProductFormSimple from './components/brand/ProductFormSimple';
import ProductDetails from './components/customer/ProductDetails';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Brand Routes */}
          <Route 
            path="/brand/dashboard" 
            element={
              <ProtectedRoute requiredRole="Brand">
                <BrandPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/brand/create-product" 
            element={
              <ProtectedRoute requiredRole="Brand">
                <ProductFormSimple />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/brand/edit/:id" 
            element={
              <ProtectedRoute requiredRole="Brand">
                <ProductFormSimple />
              </ProtectedRoute>
            } 
          />

          {/* Customer Routes */}
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute requiredRole="Customer">
                <CustomerPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/product/:id" 
            element={
              <ProtectedRoute requiredRole="Customer">
                <ProductDetails />
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
