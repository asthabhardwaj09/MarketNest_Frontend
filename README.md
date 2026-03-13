# 🛍️ MarketNest — Mini Fashion Marketplace

A full-stack fashion marketplace built with the **MERN stack**, supporting two user roles: **Brand (Seller)** and **Customer (Buyer)**. Brands can manage products with image uploads, while customers can browse, search, and filter the marketplace.

---

## 🔗 Live Links

| Resource | URL |
|----------|-----|
| 🌐 Frontend | https://market-nest-frontend-umber.vercel.app/ |
| 🔧 Backend API | https://marketnest-backend-kxer.onrender.com/ |
| 📦 GitHub Repo Frontend | https://github.com/asthabhardwaj09/MarketNest_Frontend/ |
| 📦 GitHub Repo Backend| | https://github.com/asthabhardwaj09/MarketNest_Backend/ |



## 🏗️ Architecture Explanation

MarketNest follows a classic **Client-Server architecture** with a clear separation between the frontend and backend.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React.js)                   │
│  - Role-based UI (Brand Dashboard / Customer Marketplace│
│  - JWT stored in memory (access) + httpOnly cookie      │
│    (refresh)                                            │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP Requests (REST API)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + Express)              │
│  - JWT Authentication Middleware                        │
│  - Role-based Access Control Middleware                 │
│  - RESTful API Routes                                   │
│  - Cloudinary Integration (image uploads)               │
└───────────┬─────────────────────────┬───────────────────┘
            │                         │
            ▼                         ▼
┌───────────────────┐     ┌──────────────────────┐
│   MongoDB Atlas   │     │      Cloudinary       │
│  (Database)       │     │  (Image Storage)      │
└───────────────────┘     └──────────────────────┘
```

### Key Architectural Decisions

- **Stateless REST API**: The backend is fully stateless. All authentication state is managed via JWT tokens, not server-side sessions.
- **Dual Token Strategy**: Short-lived access tokens for API calls + long-lived refresh tokens stored in httpOnly cookies to balance security and usability.
- **Role-Based Access Control (RBAC)**: Middleware enforces role permissions at the route level, keeping business logic clean and centralized.
- **Cloudinary for Media**: Product images are uploaded directly to Cloudinary. Only image URLs are stored in MongoDB, keeping the database lightweight.
- **Soft Deletes**: Products are never permanently removed from the database — they are archived using a status flag, preserving data integrity.

---

## 🔐 Authentication Flow

MarketNest uses **JWT Access + Refresh Token** authentication.

### Signup Flow
```
User fills Signup form (name, email, password, role)
        │
        ▼
POST /api/auth/signup
        │
        ▼
Password hashed with bcrypt
        │
        ▼
User saved to MongoDB with role (brand / customer)
        │
        ▼
Access Token (15min) + Refresh Token (7d) generated
        │
        ├──► Access Token → returned in response body
        └──► Refresh Token → set as httpOnly cookie
```

### Login Flow
```
User submits credentials
        │
        ▼
POST /api/auth/login
        │
        ▼
Password verified with bcrypt.compare()
        │
        ▼
New Access Token + Refresh Token issued
        │
        ├──► Access Token → returned in response body
        └──► Refresh Token → set as httpOnly cookie
```

### Protected Request Flow
```
Client sends request with Authorization: Bearer <accessToken>
        │
        ▼
auth.js middleware verifies JWT
        │
        ├── Valid  ──► Attach user to req.user → proceed
        └── Expired ─► Client calls POST /api/auth/refresh-token
                              │
                              ▼
                        Refresh token read from httpOnly cookie
                              │
                              ▼
                        New access token issued → client retries
```

### Logout Flow
```
POST /api/auth/logout
        │
        ▼
Refresh token cookie cleared (res.clearCookie)
        │
        ▼
Client removes access token from memory
```

### Role-Based Access
- `auth.js` → verifies the JWT and attaches `req.user`
- `roleCheck.js` → checks `req.user.role` against allowed roles for the route
- Brand-only routes (create/edit/delete products) return `403 Forbidden` if accessed by a Customer

---

## 📁 Folder Structure

```
MarketNest/
│
├── Backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, logout, refresh token
│   │   ├── productController.js   # CRUD for products, dashboard summary
│   │   └── userController.js      # User profile operations
│   │
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, role)
│   │   ├── Product.js             # Product schema (title, images, status, owner)
│   │   └── Category.js            # Category schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── productRoutes.js       # /api/products/*
│   │   └── userRoutes.js          # /api/users/*
│   │
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── roleCheck.js           # Role-based access middleware
│   │
│   ├── .env                       # Environment variables (never committed)
│   ├── .gitignore
│   ├── index.js                   # App entry point, server setup
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx         # Top navigation bar
    │   │   │   ├── Sidebar.jsx        # Side navigation
    │   │   │   └── ProtectedRoute.jsx # Guards private routes by role
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── Login.jsx          # Login form
    │   │   │   └── Signup.jsx         # Signup form with role selection
    │   │   │
    │   │   ├── brand/
    │   │   │   ├── BrandDashboard.jsx # Dashboard with product stats
    │   │   │   ├── ProductForm.jsx    # Create / edit product form
    │   │   │   ├── ProductList.jsx    # Brand's product list view
    │   │   │   └── ProductCard.jsx    # Individual product card (brand view)
    │   │   │
    │   │   └── customer/
    │   │       ├── Marketplace.jsx    # Product browsing page
    │   │       ├── ProductDetails.jsx # Single product detail view
    │   │       ├── SearchBar.jsx      # Search by product name
    │   │       └── FilterSidebar.jsx  # Filter by category
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx               # Landing page
    │   │   ├── AuthPage.jsx           # Login / Signup wrapper
    │   │   ├── BrandPage.jsx          # Brand-protected page
    │   │   └── CustomerPage.jsx       # Customer-protected page
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx        # Auth state (user, token, login/logout)
    │   │   └── ProductContext.jsx     # Product state management
    │   │
    │   ├── services/
    │   │   ├── api.js                 # Axios instance with interceptors
    │   │   ├── authService.js         # Auth API calls (login, signup, refresh)
    │   │   └── productService.js      # Product API calls
    │   │
    │   ├── styles/
    │   │   └── index.css
    │   │
    │   ├── App.jsx                    # Routes and layout
    │   └── main.jsx                   # React entry point
    │
    ├── .env
    ├── package.json
    └── index.html
```

---

## 🔒 Security Decisions

| Decision | Reason |
|----------|--------|
| **Passwords hashed with bcrypt** | Plain-text password storage is never acceptable. bcrypt's salting protects against rainbow table attacks. |
| **Access token short expiry (15 min)** | Limits the damage window if an access token is stolen. |
| **Refresh token in httpOnly cookie** | JavaScript cannot access httpOnly cookies, preventing XSS attacks from stealing the refresh token. |
| **Refresh token NOT in localStorage** | localStorage is accessible via JS and is a common XSS target. |
| **JWT secret stored in .env** | Secrets never hardcoded in source code. `.env` is in `.gitignore`. |
| **Role-based middleware on backend** | Frontend role checks can be bypassed. All authorization is enforced server-side. |
| **Ownership enforcement on product edits** | Each update/delete operation checks that `product.owner === req.user.id`, preventing Brands from editing other Brands' products. |
| **Soft deletes for products** | Products are archived (status: 'archived') rather than permanently deleted, preserving data and preventing accidental data loss. |
| **Cloudinary for image storage** | Images are never stored on the server filesystem. Cloudinary provides secure, CDN-backed storage with transformation capabilities. |
| **Environment variables for all secrets** | MongoDB URI, JWT secret, Cloudinary credentials are all stored in `.env` files and excluded from version control. |
| **CORS configured for specific origins** | The backend only accepts requests from the deployed frontend domain, preventing unauthorized cross-origin requests. |

---


## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup
```bash
cd Backend
npm install
# Add your .env file
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
# Add your .env file
npm run dev
```

---

## 👤 User Roles & Permissions

| Feature | Brand | Customer |
|---------|-------|----------|
| Signup / Login | ✅ | ✅ |
| Browse Marketplace | ✅ | ✅ |
| View Product Details | ✅ | ✅ |
| Search & Filter Products | ✅ | ✅ |
| Access Brand Dashboard | ✅ | ❌ |
| Create Products | ✅ | ❌ |
| Edit Own Products | ✅ | ❌ |
| Delete (Archive) Own Products | ✅ | ❌ |
| Edit Other Brand's Products | ❌ | ❌ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Axios, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (Access + Refresh Tokens) |
| Image Storage | Cloudinary |
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Render |
