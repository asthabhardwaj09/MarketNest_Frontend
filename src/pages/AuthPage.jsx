import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();


  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });


  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
  });



  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(loginData.email, loginData.password);
      setUser(data.user);
      toast.success('Login successful!');
      navigate(data.user.role === 'Brand' ? '/brand/dashboard' : '/marketplace');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (signupData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await signup(
        signupData.name,
        signupData.email,
        signupData.password,
        signupData.role
      );
      toast.success('Signup successful! Please login.');
      setIsLogin(true);
      setLoginData({ email: signupData.email, password: signupData.password });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary-subtle py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-md font-medium transition-all ${isLogin
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-md font-medium transition-all ${!isLogin
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
              }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <div className="card-elevated">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3"></div>
              <h1 className="text-3xl font-bold text-neutral-900">Welcome Back</h1>
              <p className="text-neutral-600 mt-2">Sign in to your MarketNest account</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">

              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>


              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>


              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary-500" />
                  <span className="text-neutral-700">Remember me</span>
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        ) : (

          <div className="card-elevated">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🎉</div>
              <h1 className="text-3xl font-bold text-neutral-900">Create Account</h1>
              <p className="text-neutral-600 mt-2">Join MarketNest today</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">

              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
                <small>At least 6 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirmPassword">Confirm Password</label>
                <input
                  id="signup-confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-role">Account Type</label>
                <select
                  id="signup-role"
                  name="role"
                  value={signupData.role}
                  onChange={handleSignupChange}
                >
                  <option value="Customer">Customer (Buyer)</option>
                  <option value="Brand">Brand (Seller)</option>
                </select>
                <small>
                  {signupData.role === 'Customer'
                    ? 'Browse and buy fashion products'
                    : 'Create and manage fashion products'}
                </small>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="signup-terms"
                  className="w-4 h-4 mt-1 accent-primary-500"
                  required
                />
                <label htmlFor="signup-terms" className="text-sm text-neutral-700 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-6"
              >
                {loading ? 'Creating account...' : ' Create Account'}
              </button>
            </form>
          </div>
        )}


        <div className="mt-8 text-center text-neutral-600 text-sm space-y-1">
          <p>100% Secure & Encrypted</p>
          <p>Fast signup in just 2 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
