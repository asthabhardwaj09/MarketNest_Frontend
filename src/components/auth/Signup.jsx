import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary-subtle py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card-elevated">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🛍️</div>
            <h1 className="text-3xl font-bold text-neutral-900">Create Account</h1>
            <p className="text-neutral-600 mt-2">Join MarketNest today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-neutral-500 mt-1">At least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Customer">🛒 Customer (Buyer)</option>
                <option value="Brand">🏪 Brand (Seller)</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">
                {formData.role === 'Customer' 
                  ? 'Browse and buy fashion products'
                  : 'Create and manage fashion products'}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-4 h-4 mt-1 accent-primary-500"
                required 
              />
              <label htmlFor="terms" className="text-sm text-neutral-700 cursor-pointer">
                I agree to the <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-600">OR</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-neutral-700">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-neutral-600 text-sm space-y-1">
          <p>🔒 100% Secure & Encrypted</p>
          <p>Fast signup in just 2 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;