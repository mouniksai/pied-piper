// src/services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseTransactionWithAI = async (emailSnippet, emailDate) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a financial parser. Extract transaction details from the email snippet below.
      
      Snippet: "${emailSnippet}"
      Email Date: "${emailDate}"

      Rules:
      1. Identify the Merchant (e.g., "Uber", "Swiggy", "HDFC Bank").
      2. Identify the Amount (numeric only).
      3. Identify the Currency (default INR).
      4. Categorize it (e.g., "Food", "Travel", "Bills", "Shopping").
      5. Extract any Bank Name or Account Last 4 digits if present.
      6. Return ONLY valid JSON. No Markdown. No comments.
      
      JSON Schema:
      {
        "merchant": "String",
        "amount": Number,
        "currency": "String",
        "date": "ISO String (use email date if specific transaction date is missing)",
        "category": "String",
        "bankName": "String or null",
        "accountLast4": "String or null",
        "isTransaction": Boolean (true if this is actually a spend/receive alert, false if spam/promo)
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if Gemini adds them
    const jsonStr = text.replace(/```json|```/g, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Parse Error:", error);
    return null;
  }
};

export const generateFinancialSummary = async (stats) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      You are a friendly financial assistant named Jared.
      Analyze the following monthly stats and give a very short, concise summary (max 2 sentences).
      Be encouraging but realistic.

      Stats:
      - Total Spent: ${stats.totalSpent}
      - Monthly Budget: ${stats.budget}
      - Spending Trend: ${stats.trend.isIncrease ? 'Up' : 'Down'} by ${stats.trend.value}%
      
      Response:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "I couldn't generate a summary right now, but your stats are loaded below.";
  }
};