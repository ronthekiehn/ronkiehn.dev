const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require ("@google/generative-ai");
const systemPrompt = require("../prompt/systemPrompt.json");



const apiKey = process.env.GOOGLE_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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
  model: 'gemini-2.5-flash',
  systemInstruction: systemPrompt.prompt,
  safetySettings
});



const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export default async function handler (req, res) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
  }
    const { userInput, chatHistory } = req.body;
  
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: chatHistory,
        });
  
      const result = await chatSession.sendMessage(userInput);
      const botOutput = result.response.text();

      res.json({ botOutput: botOutput });
    } catch (error) {
      console.error('Error fetching chat response:', error);
      res.status(500).json({ error: 'Failed to fetch chat response' });
    }
  };
