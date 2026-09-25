# 🚗 CampusRide — College Commute Coordination Platform

**CampusRide** is a portfolio-grade, production-quality MERN web platform for verified college students to coordinate regular daily commutes with peers traveling along similar routes.

Unlike commercial ride-hailing services (such as Uber or Rapido), CampusRide is designed specifically around **recurring college commuting**, community safety, cost sharing, and deterministic schedule matching.

---

## 🌟 Key Features

* **Recurring Commute Manager**: Create weekly commute schedules (e.g., Mon–Fri, 8:00 AM outbound / 5:30 PM return).
* **Deterministic Matching Engine**: Rule-based compatibility algorithm ranking rides out of 100 points (+30 Same College, +30 Route Compatibility, +20 Time Offset Tolerance, +20 Day Overlap). Zero AI dependency.
* **Concurrency-Safe Seat Reservation**: Atomic MongoDB database operations (`$inc` + `$gte` condition) preventing overbooking during race conditions.
* **Trust & Safety Suite**: Peer rating aggregation (1–5 stars), completion verification, and confidential user reporting to campus administration.
* **In-App Notification Hub**: Automatic state-change notifications for ride requests, confirmations, cancellations, and ratings.
* **Modern SaaS UI**: Dark slate theme, desktop-first responsive sidebar layout, skeleton loaders, and interactive filter controls.
* **Administrative Moderation Portal**: Real-time metrics dashboard, route density analytics, user verification/suspension toggles, and report resolution workflow.

---

## 🛠 Tech Stack

* **Frontend**: React (Vite), React Router v6, Axios, Lucide React Icons, Custom Vanilla CSS Design System.
* **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Express Validator.
* **Database**: MongoDB & Mongoose ORM.

---

## 📐 System Architecture

```
React (Vite Frontend)
   │
   ▼ HTTP REST Requests (Axios + Bearer JWT)
Express API Server (Port 5000)
   │
   ├─► Authentication & Ownership Verification Middleware
   ├─► Controller & Deterministic Matching Engine
   └─► Mongoose Models & MongoDB Atlas Cluster
```

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or MongoDB Atlas Connection String)

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campusride
JWT_SECRET=your_jwt_super_secret_key_2026
NODE_ENV=development
```

*(Refer to `backend/.env.example` for reference)*

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Populate Database with Demo Data

```bash
cd backend
npm run seed
```

---

## 🔑 Demo Accounts for Technical Inspection

After running `npm run seed`, use these credentials to log in:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Ride Provider** | `satish.verma@srkr.edu.in` | `password123` | Offered commute from Bhimavaram Town Center |
| **Ride Requester** | `ananya.rao@srkr.edu.in` | `password123` | Commuter seeking seats from Palakoderu |
| **Campus Admin** | `admin@campusride.edu` | `password123` | Access to Administrative Moderation Portal |

*(The login page includes 1-Click Demo Prefill buttons for instant evaluation)*

---

## 🏃 Running the Application Locally

```bash
# Terminal 1: Run Express Backend Server
cd backend
npm run dev

# Terminal 2: Run Vite React Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Technical Interview Explanation Guide

1. **How does Authentication work?**
   * Passwords are salted and hashed using `bcryptjs` (salt rounds = 10).
   * Upon authentication, the server issues a signed JSON Web Token (JWT) containing `user.id` and `user.role`.
   * Requests include `Authorization: Bearer <token>`, verified by `authMiddleware.js`.

2. **How is Overbooking Prevented during Simultaneous Requests?**
   * When a provider accepts a request, `requestController.js` uses an atomic MongoDB update:
     ```js
     await Ride.findOneAndUpdate(
       { _id: rideId, availableSeats: { $gte: seatsRequested } },
       { $inc: { availableSeats: -seatsRequested } },
       { new: true }
     );
     ```
   * If available seats fall below requested seats, the atomic operation fails gracefully without race conditions.

3. **How does the Matching Algorithm operate?**
   * `calculateMatchScore` evaluates 4 criteria: Same College (+30), Source/Destination substring match (+30), Departure time delta $\le 10$ mins (+20), and Recurring day overlap (+20).
   * Results are annotated with human-readable badges (`Highly Compatible`, `Good Match`, `Possible Match`).

---

## 📄 License
ISC License — Created for Academic & Technical Portfolio Demonstration.
