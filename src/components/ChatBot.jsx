import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import systemPrompt from '../assets/systemPrompt.json';
import '../styles/ChatBot.css';

const apiKey = import.meta.env.VITE_GOOGLE_KEY;
console.log(apiKey);
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
  model: 'gemini-1.5-flash',
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

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]); // Maintains the chat history for Gemini
    const [writeHistory, setWriteHistory] = useState([]); // What we actually type
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    

    const chatContainerRef = useRef(null);

    // Auto-scroll to the bottom when writeHistory updates
    useEffect(() => {
        if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [writeHistory]);

    const handleSubmit = async (event) => {
      event.preventDefault();
  
      setWriteHistory((prev) => [
        ...prev,
        { role: 'user', text: userInput },
        { role: 'model', text: 'Generating...' }
      ]);

      setUserInput('');

        setIsLoading(true);
  
      const chatSession = model.startChat({
        generationConfig,
        history: chatHistory,
      });
  
      try {
        const result = await chatSession.sendMessage(userInput);
        const botOutput = result.response.text();
  
        // Update both chatHistory and writeHistory with the bot's response
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', parts: [{ text: userInput }] },
          { role: 'model', parts: [{ text: botOutput }] }
        ]);
  
        setWriteHistory((prev) => [
          ...prev.slice(0, -1), // Remove 'Generating...' message
          { role: 'model', text: botOutput }
        ]);
  
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Re-enable input field after response
        setIsLoading(false);
      }
    };
  
    return (
      <div className="chatbot">
        <div className="chat-window">
          <div className="chat-history" ref={chatContainerRef}>
            {writeHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading} // Disable input when loading
            />
            <button type="submit" disabled={isLoading}></button>
          </form>
        </div>
      </div>
    );
  };
    
  export default Chatbot;