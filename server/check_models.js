const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No API Key found in .env");
    process.exit(1);
}

console.log("Checking models for API Key starting with:", apiKey.substring(0, 5) + "...");

// Function to fetch models via REST API (since SDK listModels is tricky)
async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
        } else {
            console.log("✅ Available Models for this Key:");
            data.models.forEach(m => {
                // Only show generateContent supported models
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(` - ${m.name.replace('models/', '')}`);
                }
            });
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

listModels();