import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import Transaction from '../models/Transaction';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import path from 'path';

// 1. FORCE LOAD .ENV (CORRECTED PATH)
// We go up ONE level ('../') from 'queue' to find '.env' in 'server'
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// 2. DEBUGGING & SAFETY CHECK
const redisUrl = process.env.REDIS_URL;

console.log('---------------------------------------------------');
console.log('🔍 Debug: Looking for .env at:', envPath);
if (!fs.existsSync(envPath)) {
  console.error('❌ CRITICAL: .env file NOT FOUND at this path!');
} else {
  console.log('✅ Debug: .env file found.');
}

if (!redisUrl) {
  console.error('❌ CRITICAL ERROR: REDIS_URL is missing from process.env');
  console.error('   Current Environment Variables:', Object.keys(process.env));
  process.exit(1); // Stop the app immediately to prevent localhost connection errors
}

// Hide password for security when logging
const safeLogUrl = redisUrl.replace(/:[^:@]*@/, ':****@');
console.log(`✅ Connecting to Redis at: ${safeLogUrl}`);
console.log('---------------------------------------------------');

// 3. CONFIGURE CONNECTION (UPSTASH)
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  tls: {
    rejectUnauthorized: false
  }
});

export const transactionQueue = new Queue('transaction-upload', { connection });

// 4. WORKER
new Worker('transaction-upload', async (job) => {
  const { filePath, userId } = job.data;
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          userId,
          date: new Date(data.Date || Date.now()),
          description: data.Description || 'Unknown',
          amount: parseFloat(data.Amount || '0'),
          type: parseFloat(data.Amount) > 0 ? 'income' : 'expense',
          category: data.Category || 'Uncategorized'
        });
      })
      .on('end', async () => {
        try {
          if (results.length > 0) await Transaction.insertMany(results);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          resolve('Done');
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => reject(err));
  });
}, { connection });