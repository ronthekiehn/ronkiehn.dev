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
  const [retryCount, setRetryCount] = useState(0); // State to track retry count
  let errorInput = '';
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

  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3) {
      handleSubmit(undefined, retryCount);
    }
  }, [retryCount]);

  const handleSubmit = async (event, retryCount = 0) => {
    if (event) {
      event.preventDefault();
    } else {
      errorInput = writeHistory[writeHistory.length - 1]?.text || '';
      setWriteHistory((prev) => [
        ...prev.slice(0, -1),
      ]);
    }

    let input = errorInput || userInput;
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWriteHistory((prev) => [
      ...prev,
      { role: 'user', text: input, time: time },
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
      //throw new Error("Intentional error");

      const data = await response.json();
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
      if (retryCount < 3) {
        setRetryCount(retryCount + 1);
      } else {
        setWriteHistory((prev) => [
          ...prev,
          { role: 'model', text: 'Sorry, I encountered an error. Please try again.', time: time }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
      <div className="title">RawnBot 1.1</div>
        <div className="chat-history" ref={chatContainerRef}>
          {writeHistory.map((msg, index) => (
            <div key={index}>
              <div className={`message ${msg.role}`}>
                <p className="message-content" dangerouslySetInnerHTML={{ __html: marked(msg.text) }} />
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
          <button type="submit" disabled={isLoading}>
            <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
