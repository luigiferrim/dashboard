# 📊 Stock & Finance Management System

![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Neon DB](https://img.shields.io/badge/Database-Neon_Serverless-00E599?style=flat&logo=neon&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

> **A production-ready, full-stack inventory and financial management dashboard built with the latest web technologies.**

This project is a comprehensive solution for managing stock lots, tracking expiration dates, and analyzing financial performance. It leverages **Next.js 15 App Router** and **Serverless PostgreSQL** to ensure performance, scalability, and type safety.

---

## ✨ Key Features

* **🔐 Secure Authentication:** Robust login and registration system using **NextAuth v4** (Credentials Provider) with **bcrypt** encryption.
* **📈 Real-time Dashboard:** Interactive overview featuring live metrics, expiration alerts (color-coded), and data visualization using **Recharts**.
* **📦 Advanced Inventory Control:** Complete CRUD for batch/lot management with real-time search, filtering, and modal-based creation.
* **💰 Financial Analytics:** Detailed financial breakdown including profit margins, sales rankings, and cost-vs-revenue pie charts.
* **🛡️ Audit & Logging:** A dedicated audit system that tracks every critical action (Create, Update, Delete, Login) for security and accountability.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & shadcn/ui components
* **Database:** [Neon](https://neon.tech/) (Serverless PostgreSQL)
* **Auth:** [NextAuth.js](https://next-auth.js.org/)
* **Validation:** [Zod](https://zod.dev/) + React Hook Form
* **Charts:** Recharts
* **Utilities:** date-fns, lucide-react

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone [https://github.com/luigiferrim/YOUR-REPO-NAME.git](https://github.com/luigiferrim/YOUR-REPO-NAME.git)
cd YOUR-REPO-NAME
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Variables
```bash
# Neon Database Connection String
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key"  # Generate using: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

You can execute the SQL script directly via the Neon Dashboard or using psql:
```bash
# The script is located at: scripts/001-create-tables.sql
psql $DATABASE_URL -f scripts/001-create-tables.sql
```

### 5. Run the development server

```bash
npm run dev
```

# 📂 Project Structure

.
├── app/
│   ├── api/                   # API Routes (Next.js App Router)
│   │   ├── auth/              # NextAuth Handlers
│   │   ├── lots/              # Inventory CRUD
│   │   └── logs/              # Audit System
│   ├── dashboard/             # Protected Dashboard Views
│   ├── estoque/               # Inventory Management Page
│   ├── financeiro/            # Financial Analytics Page
│   └── login/                 # Public Login Page
├── components/
│   ├── ui/                    # Reusable Shadcn UI components
│   └── dashboard/             # Specific Chart/Stats components
├── lib/
│   ├── db.ts                  # Neon Database Client connection
│   └── auth.ts                # NextAuth Configuration
└── middleware.ts              # Route Protection Logic

# 🔒 Security & Quality Assurance

As a system built with QA principles in mind, this project implements:

* **Middleware Protection**: All private routes (/dashboard, /estoque, etc.) are protected at the edge.

* **SQL Injection Prevention**: Uses parameterized queries via the Neon driver.

* **Data Validation**: Strict input validation using Zod schemas on both client and server sides.

* **Audit Trails**: Every state-changing action is logged to the database for accountability.

# ☁️ Deployment (Vercel)
Push your code to GitHub.

Import the project to Vercel.

Add the Environment Variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL) in the Vercel Project Settings.

Deploy! 🚀

# 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

# 📝 License
This project is licensed under the MIT License.



<div align="center"> Made with 💻 and ☕ by <strong>Luigi Ferri Maines</strong> </div>
