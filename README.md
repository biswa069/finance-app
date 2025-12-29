# 💰 AI-Powered Personal Finance Manager

A production-grade MERN stack application that helps users track finances, analyze spending habits using Generative AI, and visualize data.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Key Features

* **🤖 AI Financial Advisor:** Integrates **Google Gemini 1.5 Flash** to analyze transaction history and provide personalized budget advice.
* **⚡ Event-Driven Architecture:** Uses **BullMQ** and **Redis** to handle CSV file parsing asynchronously, preventing server blocking during heavy uploads.
* **🚀 High Performance:** Implements **Redis Caching** to store AI insights, reducing API costs and latency.
* **🔐 Secure Authentication:** Custom JWT (JSON Web Token) authentication system with hashed passwords (Bcrypt).
* **📊 Interactive Visualizations:** Dynamic spending breakdown charts using **Chart.js**.
* **🎨 Modern UI:** Responsive design built with React, Bootstrap, and custom CSS styling.

## 🛠️ Tech Stack

### Frontend (Client)
* **React.js (Vite):** Fast UI development.
* **TypeScript:** Type safety for reliable code.
* **React Query:** Server state management and caching.
* **Chart.js:** Data visualization.
* **Bootstrap 5:** Responsive styling.

### Backend (Server)
* **Node.js & Express:** RESTful API server.
* **MongoDB (Mongoose):** NoSQL database for transactions and users.
* **Redis (Upstash):** In-memory data store for caching and job queues.
* **BullMQ:** Background job processing queue.
* **Google Gemini API:** Generative AI model.
* **JWT & Bcrypt:** Security and Authentication.

---

## 🏗️ Architecture

The application uses a decoupled architecture to handle high loads:

1.  **Client:** Uploads CSV -> Sends to API.
2.  **API:** Pushes job to **Redis Queue** (doesn't process immediately).
3.  **Worker:** Picks up job -> Parses CSV -> Saves to MongoDB.
4.  **AI Service:** Fetches data -> Checks **Redis Cache** -> Calls Gemini API if needed.

---

## ⚙️ Environment Variables

You need to configure two `.env` files.

### 1. Server (`server/.env`)
Create this file in the `server` folder.

```env
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/finance?retryWrites=true&w=majority
REDIS_URL=rediss://default:<pass>@<your-upstash-url>:6379

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# AI Service
GEMINI_API_KEY=AIzaSy... (Your Google AI Studio Key)
2. Client (client/.env)
Create this file in the client folder.

Code snippet

# Points to your backend URL (Use localhost for dev, Azure URL for prod)
VITE_API_URL=http://localhost:5000/api
🚀 Getting Started
Prerequisites
Node.js (v18+)

MongoDB Cluster (Atlas recommended)

Redis Instance (Upstash recommended)

Installation
Clone the repository

Bash

git clone [https://github.com/yourusername/finance-app.git](https://github.com/yourusername/finance-app.git)
cd finance-app
Install Dependencies (Root) Recommend installing dependencies for both folders.

Bash

cd server && npm install
cd ../client && npm install
Start the Backend

Bash

cd server
npm run dev
# Server runs on http://localhost:5000
Start the Frontend

Bash

cd client
npm run dev
# Client runs on http://localhost:5173
🧪 Testing the App
Register: Create a new account on the login screen.

Upload: Use the provided sample_data.csv (create a dummy CSV with columns: date,amount,description,category).

Analyze: Click "Get AI Insights" to trigger the Gemini API.

Visualize: View the generated Pie Chart for spending distribution.

📦 Deployment
Frontend: Vercel

Backend: Azure Web Apps (via GitHub Actions)

Database: MongoDB Atlas

📄 License
This project is open source and available under the MIT License.