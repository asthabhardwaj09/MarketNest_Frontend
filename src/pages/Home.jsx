import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-primary-subtle">
      {/* Hero Section */}
      <section className="gradient-primary py-20 md:py-32 px-4 text-white">
        <div className="container max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to MarketNest
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Your Premier Fashion Marketplace - Discover Trends, Connect with Creators, Purchase with Confidence
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {user ? (
              <button
                onClick={() => navigate(user.role === 'Brand' ? '/brand/dashboard' : '/marketplace')}
                className="btn btn-primary bg-white text-primary-600 hover:bg-neutral-100 px-8 py-3 text-lg"
              >
                {user.role === 'Brand' ? '📊 Go to Dashboard' : '🛒 Browse Products'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary bg-white text-primary-600 hover:bg-neutral-100 px-8 py-3 text-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn btn-secondary bg-transparent border-2 border-white text-white hover:bg-blue-600 px-8 py-3 text-lg"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose MarketNest?</h2>

          <div className="grid-3">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-3">Dual Marketplace</h3>
              <p className="text-neutral-600">
                Both buyers and sellers in one platform. Get access to exclusive fashion deals or reach millions of customers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-lg">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-3">Rich Product Gallery</h3>
              <p className="text-neutral-600">
                Upload multiple high-quality images with easy Cloudinary integration for stunning product showcases.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-lg">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Secure & Fast</h3>
              <p className="text-neutral-600">
                Enterprise-grade security with JWT authentication, refresh tokens, and encrypted transactions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover:shadow-lg">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-neutral-600">
                Powered by modern tech stack (React, Node.js, MongoDB) for blazing-fast performance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card hover:shadow-lg">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Smart Filtering</h3>
              <p className="text-neutral-600">
                Advanced search, category filters, and price ranges to find exactly what you're looking for.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card hover:shadow-lg">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Seller Dashboard</h3>
              <p className="text-neutral-600">
                Complete analytics and product management tools to grow your fashion brand effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid-2">
            {/* For Sellers */}
            <div className="card-elevated">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold mb-6">For Sellers (Brands)</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-primary flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Account</h4>
                    <p className="text-neutral-600">Sign up and select "Brand" role</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-primary flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Add Products</h4>
                    <p className="text-neutral-600">Upload product details with multiple images</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-primary flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Manage Inventory</h4>
                    <p className="text-neutral-600">Publish, draft, or archive products anytime</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-primary flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Track Statistics</h4>
                    <p className="text-neutral-600">Monitor sales and product performance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Buyers */}
            <div className="card-elevated">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold mb-6">For Buyers (Customers)</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-success flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse Marketplace</h4>
                    <p className="text-neutral-600">Discover thousands of fashion products</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-success flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Search & Filter</h4>
                    <p className="text-neutral-600">Find products by category, price, and more</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-success flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">View Details</h4>
                    <p className="text-neutral-600">Check product info, images, and pricing</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full badge badge-success flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Add to Cart</h4>
                    <p className="text-neutral-600">Save and purchase your favorites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-secondary py-20 px-4 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Join thousands of fashion enthusiasts and sellers already using MarketNest
          </p>

          {!user && (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="btn btn-primary bg-white text-secondary-600 hover:bg-neutral-100 px-8 py-3"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-secondary bg-transparent border-2 border-white text-white hover:bg-orange-600 px-8 py-3"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">MarketNest</h4>
              <p className="text-sm">Your premier fashion marketplace</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Become a Seller</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Browse</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>&copy; 2026 MarketNest. All rights reserved. | Made with ❤️ using MERN Stack</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
