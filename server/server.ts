import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import transactionRoutes from './routes/transactionRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
connectDB();





const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});