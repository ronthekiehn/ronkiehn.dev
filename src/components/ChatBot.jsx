import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import '../styles/scrollbar.css';
import { ArrowIcon } from '../icons/ArrowIcon';

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
  
    setWriteHistory([{ role: 'model', text: "hi, i'm google gemini tuned to act like ron. talk to me about coding, philosophy, movies, or anything else!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

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
          { role: 'model', text: 'sorry, i encountered an error. please try again.', time: time }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center ">
      <span className="text-gray-200 text-xl font-bold py-4">RawnBot 1.2</span>
      <div 
        className="bg-black max-w-3xl w-full h-full overflow-y-auto no-scrollbar p-4"
        ref={chatContainerRef}
      >
        {writeHistory.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 mt-2 rounded-full flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-500' : 'bg-red-500'
              } flex items-center justify-center text-white`}>
                {msg.role === 'user' ? 'y' : 'r'}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    msg.role === 'user' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {msg.role === 'user' ? 'you' : 'rawnbot'}
                  </span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <div 
                  className="text-gray-100 mt-1"
                  dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
                />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ml-10 flex items-center space-x-2 text-gray-400 p-4">
            <div className="animate-bounce">•</div>
            <div className="animate-bounce" style={{ animationDelay: '100ms' }}>•</div>
            <div className="animate-bounce" style={{ animationDelay: '200ms' }}>•</div>
          </div>
        )}
      </div>
      <div className="w-full px-4 pb-4 sticky mb-2 bottom-0  bg-gradient-to-t from-black via-black to-transparent pt-8">
        <form 
          className="relative bg-[#383A40] max-w-2xl mx-auto rounded-full flex justify-between items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="ml-1 w-full bg-transparent text-gray-100 px-4 py-3 focus:outline-none"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="type ur message..."
            disabled={isLoading}
          />
          <button 
            className="w-8 h-8 mr-1 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
           <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
