# Critiqo 🌟

> A comprehensive platform for users to create accounts, share product reviews with ratings, categorize reviews, and interact with posts through voting and commenting.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](https://critiqo-frontend.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/AKsamrat/critiqo)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

Critiqo is a modern review platform that allows users to share their experiences with products through detailed reviews and ratings. The platform features premium content with payment integration, community interaction through voting and commenting, and robust admin moderation capabilities.

### Key Highlights

- **User-Centric Design**: Intuitive interface for seamless user experience
- **Premium Content**: Monetization through premium review features
- **Community Driven**: Interactive voting and commenting system
- **Admin Control**: Comprehensive moderation and content management
- **Scalable Architecture**: Built with modern technologies for performance

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based session management
- Password reset functionality
- Profile management

### 📝 Review Management
- Create comprehensive product reviews with ratings
- Edit and update existing reviews
- Delete reviews with proper authorization
- Rich text editor support
- Image upload capabilities

### 🏷️ Categories & Organization
- Organize reviews into product categories
- Advanced filtering and search options
- Sort by ratings, date, popularity
- Tag-based organization

### 💎 Premium Content
- Sell premium reviews and content
- Secure payment processing integration
- Subscription management
- Revenue tracking

### 🤝 Interactive Features
- Upvote and downvote reviews
- Comment on reviews
- Reply to comments
- User reputation system

### 👨‍💼 Admin Moderation
- Review approval workflow
- Content moderation tools
- User management
- Analytics dashboard

### 🖼️ Media Management
- Cloudinary integration for image storage
- Multiple image uploads per review
- Image optimization and compression
- Responsive image delivery

### 🔍 Search & Discovery
- Advanced search functionality
- Filter by categories, ratings, and keywords
- Sort options for better discovery
- Trending and popular content

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development

### Database & ORM
- **PostgreSQL** - Relational database
- **Prisma** - Next-generation ORM

### Authentication & Security
- **JWT** - JSON Web Token authentication
- **Joi** - Request validation
- **Bcrypt** - Password hashing

### File Storage & Processing
- **Cloudinary** - Image and video management
- **Multer** - File upload handling

### Deployment & Infrastructure
- **Vercel** - Frontend deployment
- **Railway/Heroku** - Backend hosting
- **PostgreSQL Cloud** - Database hosting

## 🌐 Live Demo

Visit the live application: **[https://critiqo-frontend.vercel.app](https://critiqo-frontend.vercel.app)**

### Demo Accounts
- **User Account**: demo@critiqo.com / password123
- **Admin Account**: admin@critiqo.com / admin123

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (local or cloud instance)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/AKsamrat/critiqo.git
cd critiqo
```

### Step 2: Install Dependencies

For the frontend:
```bash
# Navigate to frontend directory (if separate)
npm install
# or
yarn install
# or
pnpm install
```

For the backend:
```bash
# Navigate to backend directory (if separate)
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/critiqo"
DIRECT_URL="postgresql://username:password@localhost:5432/critiqo"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Application URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"

# Payment Gateway (if applicable)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Email Configuration (for notifications)
EMAIL_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (if seed file exists)
npx prisma db seed
```

### Step 5: Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at `http://localhost:3000`

## 🎮 Usage

### For Users

1. **Registration/Login**: Create an account or sign in
2. **Browse Reviews**: Explore product reviews by category
3. **Create Reviews**: Share your product experiences
4. **Interact**: Vote on reviews and leave comments
5. **Premium Content**: Access exclusive premium reviews

### For Admins

1. **Admin Dashboard**: Access admin panel at `/admin`
2. **Content Moderation**: Review and approve user submissions
3. **User Management**: Manage user accounts and permissions
4. **Analytics**: View platform statistics and insights

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
GET  /api/auth/profile     - Get user profile
PUT  /api/auth/profile     - Update user profile
```

### Review Endpoints

```
GET    /api/reviews        - Get all reviews
POST   /api/reviews        - Create new review
GET    /api/reviews/:id    - Get specific review
PUT    /api/reviews/:id    - Update review
DELETE /api/reviews/:id    - Delete review
```

### Category Endpoints

```
GET    /api/categories     - Get all categories
POST   /api/categories     - Create new category
PUT    /api/categories/:id - Update category
DELETE /api/categories/:id - Delete category
```

### Interaction Endpoints

```
POST   /api/reviews/:id/vote    - Vote on review
POST   /api/reviews/:id/comment - Comment on review
GET    /api/comments/:id        - Get comment
PUT    /api/comments/:id        - Update comment
DELETE /api/comments/:id        - Delete comment
```

## 📁 Project Structure

```
critiqo/
├── 📁 components/          # Reusable UI components
│   ├── 📁 ui/             # Basic UI components
│   ├── 📁 forms/          # Form components
│   └── 📁 layout/         # Layout components
├── 📁 pages/              # Next.js pages
│   ├── 📁 api/           # API routes
│   ├── 📁 auth/          # Authentication pages
│   └── 📁 admin/         # Admin pages
├── 📁 lib/               # Utility libraries
│   ├── 📄 prisma.ts      # Prisma client
│   ├── 📄 auth.ts        # Authentication utilities
│   └── 📄 utils.ts       # General utilities
├── 📁 styles/            # CSS and styling files
├── 📁 public/            # Static assets
├── 📁 prisma/            # Database schema and migrations
│   ├── 📄 schema.prisma  # Database schema
│   └── 📁 migrations/    # Database migrations
├── 📄 .env.example       # Environment variables template
├── 📄 package.json       # Dependencies and scripts
├── 📄 tailwind.config.js # Tailwind CSS configuration
├── 📄 next.config.js     # Next.js configuration
└── 📄 README.md          # Project documentation
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |
| `BACKEND_URL` | Backend API URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe payment secret key | Optional |
| `EMAIL_USER` | Email service username | Optional |
| `EMAIL_PASS` | Email service password | Optional |

## 🤝 Contributing

We welcome contributions to Critiqo! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/AKsamrat/critiqo.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots if applicable
   - Reference any related issues

### Development Guidelines

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add appropriate comments to complex logic
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Developer**: AKsamrat

- **GitHub**: [@AKsamrat](https://github.com/AKsamrat)
- **Email**: [samratuap52@gmail.com](mailto:your-email@example.com)
- **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/anuwarul-kabir)

### Project Links

- **Live Demo**: [https://critiqo-frontend.vercel.app](https://critiqo-frontend.vercel.app)
- **Repository**: [https://github.com/AKsamrat/critiqo](https://github.com/AKsamrat/critiqo)
- **Issues**: [Report Issues](https://github.com/AKsamrat/critiqo/issues)
- **Discussions**: [Join Discussions](https://github.com/AKsamrat/critiqo/discussions)

---

<div align="center">
  <p>⭐ Star this repository if you found it helpful!</p>
  <p>Made with ❤️ by <a href="https://github.com/AKsamrat">AKsamrat</a></p>
</div>