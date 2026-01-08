const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(cors(), express.json());

// Your Hardcoded Key
const API_KEY = "AIzaSyBS1cKk0AdOo_ThGMcw6REpNMd-sp9VYyg";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
const chats = {};

app.post('/chat', async (req, res) => {
    const { userId, message } = req.body;
    if (!chats[userId]) {
        chats[userId] = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are a helpful and intelligent voice assistant. Keep your responses concise and conversational." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hello! I'm your AI assistant. detailed and ready to help. What can I do for you?" }],
                },
            ],
        });
    }

    try {
        const result = await chats[userId].sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ type: 'text', content: text });
    } catch (err) {
        console.error("API Error:", err.message);
        res.status(500).json({ content: "Error: " + err.message });
    }
});

app.listen(3000, () => console.log("Server active on http://localhost:3000"));