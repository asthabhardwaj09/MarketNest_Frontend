import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <section style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #ec4899 80%, #f43f5e 100%)',
        padding: '3.5rem 1.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '9999px', padding: '0.3rem 0.85rem',
            color: 'white', fontSize: '0.78rem', fontWeight: 600,
            marginBottom: '0.9rem',
            letterSpacing: '0.4px',
          }}>
            India's #1 Fashion Marketplace
          </div>


          <h1 style={{
            fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '0.6rem',
            letterSpacing: '-1.5px',
            whiteSpace: 'nowrap',
          }}>
            Welcome to{' '}
            <span style={{
              background: 'linear-gradient(90deg, #fde68a 0%, #fca5a5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              MarketNest
            </span>
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.8)',
            margin: '0 auto 1.5rem',
            whiteSpace: 'nowrap',
            letterSpacing: '0.1px',
          }}>
            Discover trends, connect with creators, and shop with confidence.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {user ? (
              <button
                onClick={() => navigate(user.role === 'Brand' ? '/brand/dashboard' : '/marketplace')}
                style={{
                  background: 'white', color: '#4f46e5', border: 'none',
                  borderRadius: '9999px', padding: '0.6rem 1.6rem',
                  fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)', transition: 'all 0.2s',
                }}
                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
              >
                {user.role === 'Brand' ? ' Go to Dashboard' : ' Browse Products'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    background: 'white', color: '#4f46e5', border: 'none',
                    borderRadius: '9999px', padding: '0.6rem 1.6rem',
                    fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'rgba(255,255,255,0.12)', color: 'white',
                    border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '9999px',
                    padding: '0.6rem 1.6rem',
                    fontSize: '0.88rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
                  }}
                  onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.22)'; e.target.style.borderColor = 'white'; }}
                  onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          <div style={{
            display: 'inline-flex',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '14px', overflow: 'hidden',
          }}>
            {[['10K+', 'Products'], ['500+', 'Brands'], ['50K+', 'Customers']].map(([num, label], i) => (
              <div key={label} style={{
                padding: '0.75rem 1.75rem',
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section style={{ background: 'white', borderBottom: '1px solid #f4f4f5', padding: '1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Men', emoji: '', color: '#3b82f6' },
              { label: 'Women', emoji: '', color: '#ec4899' },
              { label: 'Kids', emoji: '', color: '#f59e0b' },
              { label: 'Beauty', emoji: '', color: '#a855f7' },
              { label: 'Accessories', emoji: '', color: '#10b981' },
              { label: 'New Arrivals', emoji: '', color: '#f43f5e' },
            ].map(({ label, emoji, color }) => (
              <button
                key={label}
                onClick={() => navigate(`/marketplace?category=${encodeURIComponent(label)}`)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                  padding: '0.75rem 1.25rem', border: '1.5px solid #f4f4f5',
                  borderRadius: '12px', background: 'white', cursor: 'pointer',
                  transition: 'all 0.2s', minWidth: '80px',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}15`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#f4f4f5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3f3f46' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: '9999px', padding: '0.3rem 0.9rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Why MarketNest</span>
            <h2 style={{ marginTop: '0.9rem', fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 800, color: '#18181b', letterSpacing: '-0.5px' }}>Everything you need in one place</h2>
            <p style={{ color: '#71717a', marginTop: '0.5rem', fontSize: '1rem' }}>Built for modern fashion buyers and sellers</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '', title: 'Dual Marketplace', desc: 'Both buyers and sellers in one platform. Access exclusive deals or reach millions of customers.', color: '#6366f1', bg: '#eef2ff' },
              { icon: '', title: 'Rich Product Gallery', desc: 'Upload multiple high-quality images with Cloudinary integration for stunning product showcases.', color: '#ec4899', bg: '#fdf2f8' },
              { icon: '', title: 'Secure & Safe', desc: 'Enterprise-grade security with JWT authentication, refresh tokens, and encrypted data.', color: '#10b981', bg: '#f0fdf4' },
              { icon: '', title: 'Lightning Fast', desc: 'Powered by React, Node.js, and MongoDB for blazing-fast performance at scale.', color: '#f59e0b', bg: '#fffbeb' },
              { icon: '', title: 'Smart Filtering', desc: 'Advanced search, category filters, and price ranges to find exactly what you need.', color: '#3b82f6', bg: '#eff6ff' },
              { icon: '', title: 'Seller Dashboard', desc: 'Complete analytics and management tools to grow your fashion brand effortlessly.', color: '#a855f7', bg: '#faf5ff' },
            ].map(({ icon, title, desc, color, bg }) => (
              <div key={title} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1.5px solid #f4f4f5', transition: 'all 0.25s', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${color}20`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#f4f4f5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#18181b', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#71717a', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section style={{ padding: '5rem 1.5rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: '#fff1f2', color: '#e11d48', borderRadius: '9999px', padding: '0.3rem 0.9rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Simple Process</span>
            <h2 style={{ marginTop: '0.9rem', fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 800, color: '#18181b', letterSpacing: '-0.5px' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1.5px solid #e0e7ff', boxShadow: '0 4px 24px rgba(99,102,241,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eef2ff', borderRadius: '9999px', padding: '0.35rem 0.9rem', marginBottom: '1.5rem' }}>
                <span></span><span style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.85rem' }}>For Sellers (Brands)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[['Create Account', 'Sign up and select "Brand" role'], ['Add Products', 'Upload details with multiple images'], ['Manage Inventory', 'Publish, draft, or archive anytime'], ['Track Statistics', 'Monitor product performance']].map(([title, desc], i) => (
                  <div key={title} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                    <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 3px 8px rgba(99,102,241,0.3)', flexShrink: 0 }}>{i + 1}</div>
                    <div><div style={{ fontWeight: 600, color: '#18181b', fontSize: '0.92rem' }}>{title}</div><div style={{ fontSize: '0.83rem', color: '#71717a', marginTop: '0.1rem' }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1.5px solid #d1fae5', boxShadow: '0 4px 24px rgba(16,185,129,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#d1fae5', borderRadius: '9999px', padding: '0.35rem 0.9rem', marginBottom: '1.5rem' }}>
                <span></span><span style={{ fontWeight: 700, color: '#065f46', fontSize: '0.85rem' }}>For Buyers (Customers)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[['Browse Marketplace', 'Discover thousands of fashion products'], ['Search & Filter', 'Find by category, price, and more'], ['View Details', 'Check product info and images'], ['Add to Cart', 'Save and purchase your favorites']].map(([title, desc], i) => (
                  <div key={title} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                    <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 3px 8px rgba(16,185,129,0.3)', flexShrink: 0 }}>{i + 1}</div>
                    <div><div style={{ fontWeight: 600, color: '#18181b', fontSize: '0.92rem' }}>{title}</div><div style={{ fontSize: '0.83rem', color: '#71717a', marginTop: '0.1rem' }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #f43f5e 100%)', padding: '4.5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '9999px', padding: '0.3rem 0.85rem', color: 'white', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.25rem' }}>Join 50,000+ Happy Customers</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Ready to Get Started?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 2rem', lineHeight: 1.65 }}>Join thousands of fashion enthusiasts and sellers already on MarketNest</p>
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} style={{ background: 'white', color: '#4f46e5', border: 'none', borderRadius: '9999px', padding: '0.6rem 1.6rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Create Free Account</button>
              <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '9999px', padding: '0.6rem 1.6rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.22)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.12)'}>Sign In</button>
            </div>
          </div>
        </section>
      )}


      <footer style={{ background: '#18181b', padding: '4rem 1.5rem 2rem', color: '#71717a' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg, #818cf8, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.75rem', display: 'block' }}> MarketNest</div>
              <p style={{ fontSize: '0.87rem', lineHeight: 1.7, color: '#52525b', marginBottom: '1.25rem' }}>Your premier fashion marketplace. Discover, connect, and shop with confidence.</p>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {['', '', ''].map((icon, i) => (
                  <a key={i} href="#" style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#27272a', border: '1px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.borderColor = '#6366f1'; }} onMouseOut={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.borderColor = '#3f3f46'; }}>{icon}</a>
                ))}
              </div>
            </div>
            {[
              { heading: 'For Sellers', links: ['Become a Seller', 'Pricing', 'Seller Guide', 'Dashboard'] },
              { heading: 'For Buyers', links: ['Browse Products', 'Help Center', 'Track Order', 'Returns'] },
              { heading: 'Company', links: ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <div style={{ color: '#fafafa', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: '1.25rem' }}>{heading}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {links.map(link => (<li key={link}><a href="#" style={{ color: '#71717a', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.15s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#71717a'}>{link}</a></li>))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #27272a', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.84rem', color: '#52525b', margin: 0 }}>© 2026 MarketNest. All rights reserved. Made with  using MERN Stack</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy', 'Terms', 'Cookies'].map(link => (<a key={link} href="#" style={{ color: '#52525b', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#52525b'}>{link}</a>))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
