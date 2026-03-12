import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getBrandProducts } from '../../services/productService';
import toast from 'react-hot-toast';

const BrandDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, archived: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await getBrandProducts();
      setProducts(data);
      setStats({
        total: data.length,
        published: data.filter(p => p.status === 'published').length,
        archived: data.filter(p => p.status === 'archived').length,
        draft: data.filter(p => p.status === 'draft').length,
      });
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
    setStats(prev => ({ ...prev, total: prev.total - 1 }));
    toast.success('Product deleted');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e0e7ff', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#71717a', fontSize: '0.9rem' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: '📦', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
    { label: 'Published', value: stats.published, icon: '✅', color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
    { label: 'Drafts', value: stats.draft, icon: '📝', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    { label: 'Archived', value: stats.archived, icon: '🗃️', color: '#f43f5e', bg: '#fff1f2', border: '#fecdd3' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── HEADER BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 60%, #ec4899 100%)',
        padding: '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.3rem' }}>
              👋 Welcome back,
            </p>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
              {user?.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              🏪 Seller Dashboard · Manage your products
            </p>
          </div>

          <button
            onClick={() => navigate('/brand/create-product')}
            style={{
              background: 'white', color: '#4f46e5', border: 'none',
              borderRadius: '9999px', padding: '0.7rem 1.5rem',
              fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '1rem' }}>＋</span> Add New Product
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {statCards.map(({ label, value, icon, color, bg, border }) => (
            <div key={label} style={{
              background: 'white', borderRadius: '16px', padding: '1.5rem',
              border: `1.5px solid ${border}`,
              boxShadow: `0 4px 16px ${color}15`,
              transition: 'all 0.2s', cursor: 'default',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}25`; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${color}15`; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <p style={{ color: '#71717a', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{label}</p>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  {icon}
                </div>
              </div>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: color, margin: 0, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.4rem' }}>
                {label === 'Total Products' ? 'All time' :
                 label === 'Published' ? 'Live on marketplace' :
                 label === 'Drafts' ? 'Not yet published' : 'Hidden from buyers'}
              </p>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/brand/create-product')}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
              border: 'none', borderRadius: '9999px', padding: '0.6rem 1.25rem',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ＋ New Product
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            style={{
              background: 'white', color: '#52525b',
              border: '1.5px solid #e4e4e7', borderRadius: '9999px', padding: '0.6rem 1.25rem',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.color = '#52525b'; }}
          >
            🏬 View Marketplace
          </button>
        </div>

        {/* ── PRODUCTS TABLE ── */}
        <div style={{
          background: 'white', borderRadius: '20px',
          border: '1.5px solid #e4e4e7',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f4f4f5',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b', margin: 0 }}>Your Products</h2>
              <p style={{ fontSize: '0.82rem', color: '#71717a', margin: '0.2rem 0 0' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} total
              </p>
            </div>
            {products.length > 0 && (
              <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.78rem', fontWeight: 600 }}>
                {stats.published} live
              </span>
            )}
          </div>

          {products.length === 0 ? (
            /* Empty State */
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b', marginBottom: '0.5rem' }}>No products yet</h3>
              <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Create your first product and start selling on MarketNest!
              </p>
              <button
                onClick={() => navigate('/brand/create-product')}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                  border: 'none', borderRadius: '9999px', padding: '0.7rem 1.75rem',
                  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                }}
              >
                ＋ Create First Product
              </button>
            </div>
          ) : (
            /* Products Table */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Product', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '0.85rem 1.25rem', textAlign: 'left',
                        fontSize: '0.78rem', fontWeight: 700, color: '#71717a',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        borderBottom: '1px solid #f4f4f5',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr
                      key={product._id}
                      style={{ borderBottom: i < products.length - 1 ? '1px solid #f4f4f5' : 'none', transition: 'background 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Product Name + Image */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '42px', height: '42px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', flexShrink: 0, overflow: 'hidden',
                          }}>
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : '👕'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#18181b', fontSize: '0.9rem' }}>{product.name}</div>
                            {product.category && <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.1rem' }}>{product.category}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontWeight: 700, color: '#18181b', fontSize: '0.95rem' }}>
                          ₹{product.price?.toLocaleString()}
                        </span>
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          fontWeight: 600, fontSize: '0.88rem',
                          color: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#10b981',
                        }}>
                          {product.stock === 0 ? 'Out of stock' : `${product.stock} units`}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          padding: '0.3rem 0.75rem', borderRadius: '9999px',
                          fontSize: '0.75rem', fontWeight: 700,
                          ...(product.status === 'published'
                            ? { background: '#d1fae5', color: '#065f46' }
                            : product.status === 'draft'
                            ? { background: '#fef3c7', color: '#92400e' }
                            : { background: '#fee2e2', color: '#991b1b' }),
                        }}>
                          {product.status === 'published' ? '● Live' :
                           product.status === 'draft' ? '● Draft' : '● Archived'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/brand/edit/${product._id}`)}
                            style={{
                              background: '#eef2ff', color: '#4f46e5',
                              border: 'none', borderRadius: '8px',
                              padding: '0.4rem 0.85rem', fontSize: '0.8rem',
                              fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              background: '#fff1f2', color: '#e11d48',
                              border: 'none', borderRadius: '8px',
                              padding: '0.4rem 0.85rem', fontSize: '0.8rem',
                              fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#f43f5e'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── FOOTER NOTE ── */}
        <p style={{ textAlign: 'center', color: '#a1a1aa', fontSize: '0.8rem', marginTop: '2rem' }}>
          MarketNest Seller Dashboard · © 2026
        </p>
      </div>
    </div>
  );
};

export default BrandDashboard;