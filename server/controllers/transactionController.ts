// import { Request, Response } from 'express';
// import { transactionQueue } from '../queue/transactionQueue';
// import IORedis from 'ioredis';
// import Transaction from '../models/Transaction';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // --- CONFIGURATION ---

// // 1. Redis Connection (Upstash compatible)
// const redis = new IORedis(process.env.REDIS_URL as string, {
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // 2. Gemini AI Setup
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // --- HELPER FUNCTIONS ---

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// // --- CONTROLLERS ---

// export const uploadCSV = async (req: Request, res: Response): Promise<void> => {
//   if (!req.file) {
//     res.status(400).json({ msg: 'No file uploaded' });
//     return;
//   }

//   const userId = 'demo-user-123'; 

//   await transactionQueue.add('parse-csv', { 
//     filePath: req.file.path, 
//     userId 
//   });

//   res.status(202).json({ msg: 'File uploaded. Processing in background...', status: 'queued' });
// };

// export const getTransactions = async (req: Request, res: Response): Promise<void> => {
//   const userId = 'demo-user-123';
//   try {
//     const txs = await Transaction.find({ userId }).sort({ date: -1 });
//     res.json(txs);
//   } catch (err) {
//     console.error('Database Error:', err);
//     res.status(500).send('Server Error');
//   }
// };

// export const getInsights = async (req: Request, res: Response): Promise<void> => {
//   const userId = 'demo-user-123';
//   const cacheKey = `insights:${userId}`;

//   try {
//     // A. Check Redis Cache First
//     const cachedData = await redis.get(cacheKey);
//     if (cachedData) {
//       console.log('✅ Serving from Upstash Cache (Fast)');
//       res.json(JSON.parse(cachedData));
//       return;
//     }

//     // B. Fetch Data for Analysis
//     const txs = await Transaction.find({ userId }).limit(20);

//     if (txs.length === 0) {
//         res.json({ budget_suggestion: "Upload data first", tip: "No transactions found" });
//         return;
//     }

//     const prompt = `
//       You are a financial advisor. Analyze these transactions: ${JSON.stringify(txs)}. 
//       Return a RAW JSON object (no markdown, no code blocks) with exactly these keys: 
//       "budget_suggestion" (string) and "tip" (string).
//     `;

//     // C. Call Gemini with Retry Logic + FALLBACK MODE
//     let attempts = 0;
//     let success = false;
//     let text = "";

//     console.log('🤖 Asking Gemini (Attempt 1)...');

//     while (attempts < 2 && !success) { // Reduced to 2 attempts to be faster
//       try {
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         text = response.text();
//         success = true; 
//       } catch (error: any) {
//         attempts++;
//         if (error.status === 429 || error.message?.includes('429')) {
//           console.warn(`⚠️ Rate Limit Hit. Waiting 2s before retry...`);
//           await delay(2000); // Short wait
//         } else {
//           console.error("Non-Rate Limit Error:", error);
//           break; 
//         }
//       }
//     }

//     // --- FALLBACK BLOCK (This fixes your error) ---
//     if (!success) {
//         console.warn('⚠️ API Quota Exceeded. Switching to "Demo Mode" (Mock Data).');

//         const mockAnalysis = {
//             budget_suggestion: "⚠️ (Demo Mode) Based on your recent activity, try to limit dining out to weekends only. You spent significantly on food this week.",
//             tip: "Consider setting up a recurring transfer of $50 to your savings account immediately after payday."
//         };

//         // Cache this mock result so the frontend feels instant next time
//         await redis.set(cacheKey, JSON.stringify(mockAnalysis), 'EX', 300);

//         res.json(mockAnalysis);
//         return;
//     }

//     // D. Clean Response & Parse (Only if AI succeeded)
//     text = text.replace(/```json/g, '').replace(/```/g, '').trim();
//     const analysis = JSON.parse(text);

//     // E. Save Real Result to Cache
//     await redis.set(cacheKey, JSON.stringify(analysis), 'EX', 3600);

//     res.json(analysis);

//   } catch (e) {
//     console.error('❌ System Error:', e);
//     // Even if system crashes, return something safe
//     res.json({ 
//         budget_suggestion: "Review your subscription services.", 
//         tip: "Track daily expenses to identify small leaks in your budget." 
//     });
//   }
// };
import { Request, Response } from 'express';
import { transactionQueue } from '../queue/transactionQueue';
import IORedis from 'ioredis';
import Transaction from '../models/Transaction';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuthRequest } from '../middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();

// --- CONFIGURATION ---

// 1. Redis Connection (Upstash compatible)
const redis = new IORedis(process.env.REDIS_URL as string, {
  tls: {
    rejectUnauthorized: false
  }
});

// 2. Gemini AI Setup (Safe Initialization)
const apiKey = process.env.GEMINI_API_KEY;
let model: any = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using 'gemini-2.0-flash' as seen in your available models list
  // If this fails, try 'gemini-1.5-flash'
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
} else {
  console.warn("⚠️ WARNING: GEMINI_API_KEY is missing. AI features will fail.");
}

// --- HELPER FUNCTIONS ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- CONTROLLERS ---

export const uploadCSV = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ msg: 'No file uploaded' });
    return;
  }

  const userId = (req as AuthRequest).user?.id;

  await transactionQueue.add('parse-csv', {
    filePath: req.file.path,
    userId
  });

  res.status(202).json({ msg: 'File uploaded. Processing in background...', status: 'queued' });
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  try {
    const txs = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).send('Server Error');
  }
};

export const getInsights = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  const cacheKey = `insights:${userId}`;

  try {
    // A. Check Redis Cache First
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('✅ Serving from Upstash Cache (Fast)');
      res.json(JSON.parse(cachedData));
      return;
    }

    // B. Fetch Data for Analysis
    const txs = await Transaction.find({ userId }).limit(20);

    if (txs.length === 0) {
      res.json({ budget_suggestion: "Upload data first", tip: "No transactions found" });
      return;
    }

    const prompt = `
      You are a financial advisor. Analyze these transactions: ${JSON.stringify(txs)}. 
      Return a RAW JSON object (no markdown, no code blocks) with exactly these keys: 
      "budget_suggestion" (string) and "tip" (string).
    `;

    // C. Call Gemini with Retry Logic + FALLBACK MODE
    let attempts = 0;
    let success = false;
    let text = "";

    if (!model) {
      throw new Error("Gemini API Key is missing");
    }

    console.log('🤖 Asking Gemini (Attempt 1)...');

    while (attempts < 2 && !success) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        success = true;
      } catch (error: any) {
        attempts++;
        // Handle Rate Limits (429) OR Safety Blocks
        if (error.status === 429 || error.message?.includes('429')) {
          console.warn(`⚠️ Rate Limit Hit. Waiting 2s before retry...`);
          await delay(2000);
        } else {
          console.error("API Error:", error.message);
          break; // Don't retry real errors
        }
      }
    }

    // --- FALLBACK BLOCK (The "Demo Mode" Fix) ---
    if (!success) {
      console.warn('⚠️ API Quota Exceeded or Error. Switching to "Demo Mode" (Mock Data).');

      const mockAnalysis = {
        budget_suggestion: "⚠️ (Demo Mode) Based on your recent activity, try to limit dining out to weekends only. You spent significantly on food this week.",
        tip: "Consider setting up a recurring transfer of $50 to your savings account immediately after payday."
      };

      // Cache this mock result for 5 minutes
      await redis.set(cacheKey, JSON.stringify(mockAnalysis), 'EX', 300);

      res.json(mockAnalysis);
      return;
    }

    // D. Clean Response & Parse
    // Remove markdown code blocks if Gemini added them
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      // If AI returns bad JSON, also fallback to mock data
      console.error("JSON Parse Error on AI response");
      analysis = { budget_suggestion: "AI Output Error", tip: "Could not parse suggestion." };
    }

    // E. Save Real Result to Cache
    await redis.set(cacheKey, JSON.stringify(analysis), 'EX', 3600);

    res.json(analysis);

  } catch (e) {
    console.error('❌ System Error:', e);
    res.json({
      budget_suggestion: "System Error or Invalid API Key",
      tip: "Please check server logs."
    });
  }
};