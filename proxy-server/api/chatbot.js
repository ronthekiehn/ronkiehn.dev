const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require ("@google/generative-ai");
const systemPrompt = require("../prompt/systemPrompt.json");



const apiKey = process.env.GOOGLE_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const modelName = process.env.GOOGLE_MODEL || 'gemini-3.1-flash-lite';

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ]

const model = genAI.getGenerativeModel({
  model: modelName,
  safetySettings
});



const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1024,
  responseMimeType: 'text/plain',
};

export default async function handler (req, res) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
  }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    if (!apiKey) {
      console.error('Missing GOOGLE_KEY for chatbot API');
      res.status(500).json({ error: 'Chatbot is not configured' });
      return;
    }

    const { userInput, chatHistory } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      res.status(400).json({ error: 'Missing user input' });
      return;
    }
  
    try {
        // Prepend system prompt as first exchange in history
        const historyWithSystem = [
            { role: 'user', parts: [{ text: systemPrompt.prompt }] },
            { role: 'model', parts: [{ text: 'Got it. I\'m Ron now.' }] },
            ...(chatHistory || [])
        ];
        
        const chatSession = model.startChat({
            generationConfig,
            history: historyWithSystem,
        });
  
      const result = await chatSession.sendMessage(userInput);
      const botOutput = result.response.text();

      res.json({ botOutput: botOutput });
    } catch (error) {
      console.error(`Error fetching chat response with ${modelName}:`, error);
      res.status(502).json({ error: 'Failed to fetch chat response' });
    }
  };
