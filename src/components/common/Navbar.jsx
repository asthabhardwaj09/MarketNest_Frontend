import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Men', 'Women', 'Kids', 'Beauty', 'Accessories'];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    navigate(`/marketplace?category=${encodeURIComponent(cat)}`);
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'white',
      borderBottom: '1px solid #e4e4e7',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
      }}>
        <div
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.5rem', fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #f43f5e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer', whiteSpace: 'nowrap',
            letterSpacing: '-0.5px', userSelect: 'none',
          }}
        >
          MarketNest
        </div>
        {(!user || user.role === 'Customer') && (
          <form
            onSubmit={handleSearch}
            style={{
              flex: 1, maxWidth: '520px',
              display: 'flex', alignItems: 'center',
              background: '#f4f4f5', borderRadius: '9999px',
              padding: '0.5rem 1rem', gap: '0.5rem',
              border: '1.5px solid transparent',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#6366f1'}
            onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <span style={{ fontSize: '1rem', color: '#a1a1aa' }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              style={{
                flex: 1, border: 'none', background: 'transparent',
                outline: 'none', fontSize: '0.9rem', color: '#18181b',
                width: '100%', padding: 0,
              }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1 }}>
                ✕
              </button>
            )}
          </form>
        )}

        {user?.role === 'Brand' && <div style={{ flex: 1 }} />}


        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap' }}>

          {user ? (
            user.role === 'Brand' ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.55rem',
                  background: '#eef2ff',
                  border: '1.5px solid #c7d2fe',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ lineHeight: 1.25 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3730a3' }}>
                      {user.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.66rem', fontWeight: 600, color: '#6366f1', letterSpacing: '0.2px' }}>
                      Seller
                    </div>
                  </div>
                </div>
                <div style={{ width: '1px', height: '22px', background: '#e4e4e7', flexShrink: 0 }} />
                <button
                  onClick={() => navigate('/brand/dashboard')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: 'none', border: 'none',
                    padding: '0.45rem 0.75rem', borderRadius: '8px',
                    fontSize: '0.85rem', fontWeight: 600,
                    color: '#52525b', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}
                >
                  <span style={{ fontSize: '0.95rem' }}></span>
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/brand/create-product')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                    border: 'none', borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem', fontWeight: 700,
                    color: 'white', cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(99,102,241,0.4)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(99,102,241,0.3)'; }}
                >
                  ＋ New Product
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'white', border: '1.5px solid #e4e4e7',
                    borderRadius: '9999px', padding: '0.45rem 0.9rem',
                    fontSize: '0.85rem', fontWeight: 600,
                    color: '#71717a', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#e11d48'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = '#e4e4e7'; }}
                >
                  Logout
                </button>
              </>

            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.85rem',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#18181b' }}>
                      {user.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10b981' }}>
                      Buyer
                    </div>
                  </div>
                </div>

                <div style={{ width: '1px', height: '24px', background: '#e4e4e7' }} />

                <button
                  onClick={() => navigate('/marketplace')}
                  style={{
                    background: 'none', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    cursor: 'pointer', color: '#52525b',
                    fontSize: '0.85rem', fontWeight: 600,
                    padding: '0.4rem 0.6rem', borderRadius: '8px',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#10b981'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}
                >
                  <span></span> Marketplace
                </button>

                <button
                  style={{
                    background: 'none', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    cursor: 'pointer', color: '#52525b',
                    fontSize: '0.85rem', fontWeight: 600,
                    padding: '0.4rem 0.6rem', borderRadius: '8px',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#f43f5e'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}
                >
                  <span></span> Wishlist
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    background: 'white', border: '1.5px solid #e4e4e7',
                    borderRadius: '9999px', padding: '0.45rem 1rem',
                    fontSize: '0.85rem', fontWeight: 600,
                    color: '#71717a', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#e11d48'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = '#e4e4e7'; }}
                >
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none', border: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  cursor: 'pointer', color: '#52525b', fontSize: '0.78rem', fontWeight: 500,
                  transition: 'color 0.15s', padding: '0.25rem 0.5rem',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#4f46e5'}
                onMouseOut={e => e.currentTarget.style.color = '#52525b'}
              >
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                Profile
              </button>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none', border: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  cursor: 'pointer', color: '#52525b', fontSize: '0.78rem', fontWeight: 500,
                  transition: 'color 0.15s', padding: '0.25rem 0.5rem',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#f43f5e'}
                onMouseOut={e => e.currentTarget.style.color = '#52525b'}
              >
                <span style={{ fontSize: '1.2rem' }}></span>
                Wishlist
              </button>

              <div style={{ width: '1px', height: '24px', background: '#e4e4e7' }} />

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none', border: '1.5px solid #d4d4d8',
                  borderRadius: '9999px', padding: '0.45rem 1.25rem',
                  fontSize: '0.9rem', fontWeight: 600, color: '#3f3f46',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseOver={e => { e.target.style.borderColor = '#6366f1'; e.target.style.color = '#4f46e5'; }}
                onMouseOut={e => { e.target.style.borderColor = '#d4d4d8'; e.target.style.color = '#3f3f46'; }}
              >
                Login
              </button>

              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none', borderRadius: '9999px', padding: '0.45rem 1.25rem',
                  fontSize: '0.9rem', fontWeight: 600, color: 'white',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {(!user || user.role === 'Customer') && (
        <div style={{ borderTop: '1px solid #f4f4f5', background: 'white' }}>
          <div style={{
            maxWidth: '1400px', margin: '0 auto',
            padding: '0 1.25rem',
            display: 'flex', alignItems: 'center',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  background: 'none', border: 'none',
                  padding: '0.7rem 1.25rem',
                  fontSize: '0.88rem', fontWeight: 600,
                  color: activeCategory === cat ? '#4f46e5' : '#52525b',
                  cursor: 'pointer',
                  borderBottom: activeCategory === cat ? '2px solid #6366f1' : '2px solid transparent',
                  transition: 'all 0.15s', whiteSpace: 'nowrap', letterSpacing: '0.2px',
                }}
                onMouseOver={e => { if (activeCategory !== cat) e.currentTarget.style.color = '#4f46e5'; }}
                onMouseOut={e => { if (activeCategory !== cat) e.currentTarget.style.color = '#52525b'; }}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => handleCategoryClick('New Arrivals')}
              style={{
                background: 'none', border: 'none', padding: '0.7rem 1.25rem',
                fontSize: '0.88rem', fontWeight: 600, color: '#f43f5e',
                cursor: 'pointer', borderBottom: '2px solid transparent',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
            >
              New Arrivals
              <span style={{ background: '#f43f5e', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.35rem', borderRadius: '9999px' }}>NEW</span>
            </button>
          </div>
        </div>
      )}

      {user?.role === 'Brand' && (
        <div style={{ borderTop: '1px solid #f4f4f5', background: '#fafafa' }}>
          <div style={{
            maxWidth: '1400px', margin: '0 auto',
            padding: '0.45rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Seller Portal</span>
            <span style={{ color: '#d4d4d8', fontSize: '0.75rem' }}>›</span>
            <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>Dashboard</span>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
