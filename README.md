# 💰 AI-Powered Personal Finance Manager

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Azure](https://img.shields.io/badge/Azure-Deployed-0078D4)

A production-grade MERN stack application that helps users track finances, analyze spending habits using Generative AI, and visualize data.

Built with an **Event-Driven Architecture** to handle heavy workloads and deployed using **CI/CD** pipelines.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://your-app-name.vercel.app](https://finance-app-weld-nine.vercel.app/)
- **Backend API (Azure):** [https://finance-api-demo-cbh7cvfqctgvcqf3.centralindia-01.azurewebsites.net/api](https://finance-api-demo-cbh7cvfqctgvcqf3.centralindia-01.azurewebsites.net/api)

---

## ✨ Key Features

- **🤖 AI Financial Advisor:** Integrates **Google Gemini 2.5 Flash Lite** to analyze transaction history and provide personalized budget advice.
- **⚡ Event-Driven Architecture:** Uses **BullMQ** and **Redis** to handle CSV file parsing asynchronously, preventing server blocking during heavy uploads.
- **🚀 High Performance:** Implements **Redis Caching (Upstash)** to store AI insights, reducing API costs and latency.
- **🔐 Secure Authentication:** Custom JWT (JSON Web Token) authentication system with hashed passwords (Bcrypt).
- **📊 Interactive Visualizations:** Dynamic spending breakdown charts using **Chart.js**.
- **🎨 Modern UI:** Responsive design built with React (Vite), Bootstrap, and custom CSS.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
- **React.js (Vite):** Fast UI development.
- **TypeScript:** Type safety for reliable code.
- **Chart.js:** Data visualization for spending reports.
- **Bootstrap 5:** Responsive styling grid.

### **Backend (Server)**
- **Node.js & Express:** RESTful API server.
- **MongoDB (Mongoose):** NoSQL database for transactions and users.
- **Redis (Upstash):** In-memory data store for caching and job queues.
- **BullMQ:** Background job processing queue.
- **Google Gemini API:** Generative AI model.
- **Swagger / OpenAPI:** Automated API documentation.

---

## 🏗️ Architecture

The application uses a decoupled architecture to handle high loads:

1. **Client:** Uploads CSV → Sends to API.
2. **API:** Pushes job to **Redis Queue** (Return 202 Accepted immediately).
3. **Worker:** Picks up job → Parses CSV → Saves to MongoDB.
4. **AI Service:** Fetches data → Checks **Redis Cache** → Calls Gemini API (if no cache).

---

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files.

### **1. Server (`server/.env`)**
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
Code snippet

# Use localhost for dev, Azure URL for prod
VITE_API_URL=http://localhost:5000/api
🚀 Getting Started
Prerequisites
Node.js (v18 or v20 Recommended)

MongoDB Cluster (Atlas)

Redis Instance (Upstash)

Installation
Clone the repository

Bash

git clone [https://github.com/biswa069/finance-app.git](https://github.com/biswa069/finance-app.git)
cd finance-app
Install Dependencies

Bash

# Install Server Deps
cd server
npm install

# Install Client Deps
cd ../client
npm install
Start the Application

Bash

# Run Backend (http://localhost:5000)
cd server
npm run dev

# Run Frontend (http://localhost:5173)
cd client
npm run dev
🧪 Testing the App
Register: Create a new account on the login screen.

Upload: Use a sample CSV file with columns: date, amount, description, category.

Analyze: Click "Get AI Insights" to trigger the Gemini API.

Visualize: View the generated Pie Chart for spending distribution.

📦 Deployment
Frontend: Vercel (Auto-deployed via Git)

Backend: Azure Web Apps (Deployed via GitHub Actions)

Database: MongoDB Atlas

Cache: Upstash Redis

📄 License
This project is open source and available under the MIT License.
This project is open source and available under the MIT License.
