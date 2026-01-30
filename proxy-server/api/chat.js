const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const systemPrompt = require("../prompt/systemPrompt.json");

const apiKey = process.env.GOOGLE_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const model = genAI.getGenerativeModel({
  model: 'gemma-3-27b-it',
  safetySettings
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1024,
  responseMimeType: 'text/plain',
};

export default async function handler(req, res) {
  // GET endpoint for AI agents to chat with Ron-bot
  const message = req.query.q || req.query.message;
  
  if (!message) {
    return res.status(400).json({ 
      error: "Missing query parameter. Use ?q=your+question",
      example: "/api/chat?q=what%20projects%20has%20ron%20built"
    });
  }

  try {
    const historyWithSystem = [
      { role: 'user', parts: [{ text: systemPrompt.prompt }] },
      { role: 'model', parts: [{ text: "Got it. I'm Ron now." }] },
    ];

    const chatSession = model.startChat({
      generationConfig,
      history: historyWithSystem,
    });

    const result = await chatSession.sendMessage(message);
    const response = result.response.text();

    res.status(200).json({
      question: message,
      response: response,
      note: "This is Ron's AI chatbot. For the real Ron, email ronki@uchicago.edu"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
