const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors(), express.json());

// Load Key from Environment
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// --- SIMULATED FINTECH BACKEND ---
const DATA_FILE = path.join(__dirname, 'local_storage.json');

// Mock Data
const MOCK_DB = {
    budget: { limit: 2000, spent: 1450, remaining: 550, currency: "USD" },
    expenses: [
        { id: 1, date: "2026-01-08", category: "Food", amount: 15.50, description: "Lunch at Cafe" },
        { id: 2, date: "2026-01-08", category: "Transport", amount: 5.00, description: "Subway" },
        { id: 3, date: "2026-01-07", category: "Groceries", amount: 85.20, description: "Weekly Groceries" },
        { id: 4, date: "2026-01-07", category: "Entertainment", amount: 120.00, description: "Concert Tickets" },
        { id: 5, date: "2026-01-06", category: "Utilities", amount: 60.00, description: "Internet Bill" },
    ]
};

// Tools Definition
const tools = [{
    functionDeclarations: [
        {
            name: "getExpenses",
            description: "Retrieves expense history, optionally filtered by date (YYYY-MM-DD) or 'today'/'yesterday'.",
            parameters: {
                type: "object",
                properties: {
                    date: { type: "string", description: "Date to filter expenses by (e.g. '2026-01-07', 'today', 'yesterday')" }
                }
            }
        },
        {
            name: "getBudget",
            description: "Retrieves the current budget status including limit, spent, and remaining details.",
            parameters: { type: "object", properties: {} } // No params needed
        }
    ]
}];

const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview", tools });
const chats = {};

// Helper to save data strictly as requested
function storeLocally(data) {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, data };

    // Append to file (or create)
    let history = [];
    if (fs.existsSync(DATA_FILE)) {
        try { history = JSON.parse(fs.readFileSync(DATA_FILE)); } catch (e) { }
    }
    history.push(entry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2));
    console.log("Data stored locally:", JSON.stringify(entry));
    return entry;
}

// Backend Internal API Functions
const BACKEND_API = {
    getExpenses: (args) => {
        let targetDate = args.date;
        const today = new Date();

        // Simple natural language date parsing
        if (targetDate === 'today') {
            targetDate = today.toISOString().split('T')[0];
        } else if (targetDate === 'yesterday') {
            const y = new Date(today);
            y.setDate(y.getDate() - 1);
            targetDate = y.toISOString().split('T')[0];
        }

        if (targetDate) {
            return MOCK_DB.expenses.filter(e => e.date === targetDate);
        }
        return MOCK_DB.expenses.slice(0, 5); // Return recent if no date
    },
    getBudget: () => MOCK_DB.budget
};

app.post('/chat', async (req, res) => {
    const { userId, message } = req.body;
    if (!chats[userId]) {
        chats[userId] = model.startChat({
            history: [
                { role: "user", parts: [{ text: "You are a specialized Fintech Assistant. Use the provided tools to fetch financial data when asked. Always answer in a helpful, concise manner. Do NOT use markdown bolding (**) in your responses, especially for numbers." }] },
                { role: "model", parts: [{ text: "Understood. I will help you with your finances and provide plain text responses without bold formatting." }] }
            ]
        });
    }

    try {
        const chat = chats[userId];
        let result = await chat.sendMessage(message);
        let response = await result.response;
        let functionCalls = response.functionCalls();

        // Handle Function Calls loop (Simulate agentic loop)
        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            const fnName = call.name;
            const fnArgs = call.args;

            console.log(`Calling tool: ${fnName} with args:`, fnArgs);

            // 1. Execute "API"
            let apiData = null;
            if (BACKEND_API[fnName]) {
                apiData = BACKEND_API[fnName](fnArgs);
            } else {
                apiData = { error: "Function not found" };
            }

            // 2. "Store locally" as requested
            storeLocally({ function: fnName, result: apiData });

            // 3. Pass result back to model
            result = await chat.sendMessage([
                {
                    functionResponse: {
                        name: fnName,
                        response: { content: apiData }
                    }
                }
            ]);
            response = await result.response;
        }

        let text = response.text();

        // Final cleanup for any stray markdown bolding
        text = text.replace(/\*\*/g, '');

        res.json({ type: 'text', content: text });

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ content: "I encountered an error processing your request." });
    }
});

app.listen(3000, () => console.log("Server active on http://localhost:3000"));