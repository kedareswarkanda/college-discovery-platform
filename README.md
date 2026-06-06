# CampusFind: College Discovery Platform

CampusFind is a modern, responsive, and functional full-stack web application designed for students to explore, compare, and save top engineering colleges in India. It features a custom rule-based **College Predictor** to recommend matching colleges based on JEE ranks.

Built with **Next.js 15/16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL (Neon)**, and **NextAuth**.

---

## 🚀 Key Features

1. **Interactive Home Page**: Clean, modern landing page with a hero search bar to query colleges by name or location.
2. **College Catalog (Listing Page)**:
   - Live **server-side filtering** by name, city, annual fees, and ratings.
   - Page navigation and result indicators via pagination.
3. **Detailed Profiles**:
   - Organized tabs for **Overview**, **Offered Courses**, **Placement Statistics**, and **Student Reviews**.
   - Authenticated toggle to **Save College** for tracking.
4. **Side-by-Side College Comparison**:
   - Compare details of any two engineering colleges in a structured table.
   - Evaluates locations, fees, rating metrics, placements, and courses.
5. **College Predictor Tool**:
   - Predicts and recommends top-tier institutions (IITs, NITs, IIITs) based on your JEE Main or JEE Advanced CRL rank.
6. **Authentication & Session Management**:
   - Secure login and signup powered by **NextAuth Credentials Provider**.
   - Password encryption using **bcrypt**.
   - Route protection for saving favorite colleges and viewing the saved list.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, Server Actions, API routes)
- **Frontend Library**: React, Lucide React (Icons)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Hosted on Neon)
- **ORM**: Prisma Client
- **Authentication**: NextAuth.js
- **Password Hashing**: bcrypt

---

## 📂 Project Architecture

```
my-app/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # 25 college seed script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts  # NextAuth handlers
│   │   │   │   └── register/route.ts       # Signup API endpoint
│   │   │   ├── colleges/
│   │   │   │   ├── route.ts                # Server-side search/filters API
│   │   │   │   ├── saved/                  # Fetch user's saved colleges
│   │   │   │   ├── compare/route.ts        # Comparison details fetch API
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts            # Fetch single college
│   │   │   │       └── save/route.ts       # Save/unsave toggle (Protected)
│   │   │   └── predict/
│   │   │       └── route.ts                # College predictor logic API
│   │   ├── colleges/
│   │   │   ├── page.tsx            # Listing page with search/filters
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Details page (Overview, Courses, etc.)
│   │   ├── compare/
│   │   │   └── page.tsx            # Compare colleges page
│   │   ├── saved/
│   │   │   └── page.tsx            # Saved colleges page (Protected)
│   │   ├── predictor/
│   │   │   └── page.tsx            # Predictor tool page
│   │   ├── login/
│   │   │   └── page.tsx            # Sign-in UI
│   │   ├── signup/
│   │   │   └── page.tsx            # Sign-up UI
│   │   ├── layout.tsx              # Main layout (Navbar, Footer, Provider)
│   │   └── page.tsx                # Home/Landing page
│   ├── components/
│   │   ├── Navbar.tsx              # App navigation header
│   │   ├── Footer.tsx              # Footer section
│   │   ├── CollegeCard.tsx         # Reusable card component
│   │   └── Provider.tsx            # NextAuth SessionProvider wrapper
│   └── lib/
│       └── prisma.ts               # Prisma client singleton instance
```

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js (v18.x or above)** and **npm** installed on your machine.

### 2. Clone and Install Dependencies
```bash
# Clone the repository and navigate into it
cd "FULL STACK PROJECT"

# Install npm packages
npm install
```

### 3. Database Setup (Neon PostgreSQL)
1. Head over to [Neon Database](https://neon.tech/) and create a free account.
2. Create a new project/database and copy the connection string.
3. Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<neon-host>/<db-name>?sslmode=require"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-32-character-secret-key"
   ```

### 4. Database Migrations & Seeding
Deploy database schemas and seed the initial catalog of 25 engineering colleges:
```bash
# Generate Prisma Client
npx prisma generate

# Create and execute DB migrations
npx prisma migrate dev --name init

# Seed the 25 engineering colleges
npx prisma db seed
```

### 5. Running the Application
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Vercel Deployment Instructions

1. **Push Code to GitHub**:
   Initialize Git, commit your files, and push to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "College Discovery Platform"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to the Vercel Dashboard and click **Add New > Project**.
   - Import your GitHub repository.
   - Under **Environment Variables**, add:
     - `DATABASE_URL` (your Neon connection string)
     - `NEXTAUTH_SECRET` (generate using `openssl rand -base64 32` or type a secret)
     - `NEXTAUTH_URL` (your Vercel project deployment URL)
   - Click **Deploy**. Vercel will automatically run the build command (`next build`).
