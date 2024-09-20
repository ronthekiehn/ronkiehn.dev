import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatBot.css';
import { ArrowIcon } from './icons';
const myApi = 'https://ronkiehn-dev.vercel.app';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]); 
  const [writeHistory, setWriteHistory] = useState([{ role: 'model', text: "Hi, I'm a Gemini instance tuned to act like Ron. Ask me anything!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [retry, setRetry]= useState(false);
  let errorInput = '';
  const chatContainerRef = useRef(null);
  
  // Auto-scroll to the bottom when writeHistory updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [writeHistory]);


  const handleRetry = () => {
    setRetry(false);
    handleSubmit(undefined);
  };

  const handleSubmit = async (event, retryCount = 0) => {
    if (event) {
      event.preventDefault();
    } else {
      errorInput = writeHistory[writeHistory.length - 2]?.text || '';
      setWriteHistory((prev) => [
        ...prev.slice(0, -2),
      ]);
    }

    let input = errorInput || userInput;
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWriteHistory((prev) => [
      ...prev,
      { role: 'user', text: input, time: time },
      { role: 'model', text: ' ' }
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
          userInput: input,
          chatHistory: chatHistory,
        }),
      });

      const data = await response.json();
      time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: input }] },
        { role: 'model', parts: [{ text: data.botOutput }] }
      ]);

      setWriteHistory((prev) => [
        ...prev.slice(0, -1), // Remove ' ' message
        { role: 'model', text: data.botOutput, time: time }
      ]);
    } catch (error) {
      console.error('Error:', error);
      if (retryCount < 3) {
        console.log('Retrying...');
        handleSubmit(undefined, retryCount + 1);
      } else {
        setWriteHistory((prev) => [
          ...prev.slice(0, -1), // Remove ' ' message
          { role: 'model', text: 'Sorry, I encountered an error. Please try again.', time: time }
        ]);
        setRetry(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        <div className="chat-history" ref={chatContainerRef}>
          {writeHistory.map((msg, index) => (
            <>
            <div key={index} className={`message ${msg.role}`}>
              <p className="message-content">
                  {msg.text === ' ' ? (
                    <span className="loading-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  ) : (
                    msg.text
                  )}
                </p>
            </div>
            <div className={`message ${msg.role}`}>
              <p className="timestamp">{msg.time}</p>
            </div>
            </>
          ))}
        </div>
        {retry && (
          <button className='retry-button' onClick={handleRetry}>Retry</button>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading} 
          />
          <button type="submit" disabled={isLoading}>
            <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
