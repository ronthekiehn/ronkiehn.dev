import React, { useState, useEffect, useRef } from 'react';
import '../styles/_ChatBot.css';
import { ArrowIcon } from './_icons';
import { marked } from 'marked';
const myApi = 'https://ronkiehn-dev.vercel.app';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]); 
  const [writeHistory, setWriteHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWriteHistory([{ role: 'model', text: "Hi, I'm a Gemini instance tuned to act like Ron. Ask me anything!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [writeHistory]);

  const sendMessage = async (input, addUserMessage = true) => {
    if (!input || isLoading) return;

    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setWriteHistory((prev) => {
      const withoutErrorForInput = prev.filter((msg) => !(msg.isError && msg.retryInput === input));
      return addUserMessage
        ? [...withoutErrorForInput, { role: 'user', text: input, time }]
        : withoutErrorForInput;
    });
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
      if (!response.ok) {
        throw new Error(data?.error || `Request failed with ${response.status}`);
      }
      if (!data?.botOutput) {
        throw new Error('Chatbot returned an empty response');
      }

      time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: input }] },
        { role: 'model', parts: [{ text: data.botOutput }] }
      ]);

      setWriteHistory((prev) => [
        ...prev, 
        { role: 'model', text: data.botOutput, time: time }
      ]);
    } catch (error) {
      console.error('Error:', error);
      time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setWriteHistory((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'an error occurred',
          time,
          isError: true,
          retryInput: input,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(userInput.trim());
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
      <div className="title">RawnBot 1.1</div>
        <div className="chat-history" ref={chatContainerRef}>
          {writeHistory.map((msg, index) => (
            <div key={index}>
              <div className={`message ${msg.role}`}>
                <p className={`message-content ${msg.isError ? 'error-message' : ''}`} dangerouslySetInnerHTML={{ __html: marked(msg.text || '') }} />
                {msg.isError && (
                  <button
                    type="button"
                    className="retry-button"
                    onClick={() => sendMessage(msg.retryInput, false)}
                    disabled={isLoading}
                  >
                    retry
                  </button>
                )}
              </div>
              <div className={`message ${msg.role}`}>
                <p className="timestamp">{msg.time}</p>
              </div>
            </div>
          ))}
          {isLoading && (<div className="loading-message">
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>)}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading} 
          />
          <button type="submit" disabled={isLoading || !userInput.trim()}>
            <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
