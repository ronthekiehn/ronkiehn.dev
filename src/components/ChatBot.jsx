import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatBot.css';
const myApi = 'https://ronkiehn-dev.vercel.app';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]); 
  const [writeHistory, setWriteHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 

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

    try {
      const response = await fetch(`${myApi}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          chatHistory: chatHistory,
        }),
      });

      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        { role: 'user', text: userInput },
        { role: 'model', text: data.botResponse },
      ]);

      setWriteHistory((prev) => [
        ...prev.slice(0, -1), // Remove 'Generating...' message
        { role: 'model', text: data.botResponse }
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
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
