# React Dashboard

A React dashboard application built with **React**, **Vite**, **Tailwind CSS**, **Express.js**, and **MongoDB**.

This project features:

- User authentication (Sign up, Login, Logout)
- Protected dashboard routes
- User management (search, filter, sort, pagination)
- Export data to **CSV**, **Excel**, or **PDF**
- Responsive UI using Tailwind CSS

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/naman-0105/react-dashboard-assignment.git
cd react-dashboard-assignment
```

### 2. Configure Environment Variables

Create a .env inside the server/ directory:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```
- Replace your-mongodb-connection-string with your actual MongoDB URI.

- Replace your-secret-key with a secure random string for JWT.

### 3. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd..
```

### 4. Start the Application

```bash
# Start frontend
npm run dev

# Start backend
cd server
node index.js
```
