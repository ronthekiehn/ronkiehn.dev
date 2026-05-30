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
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
  
    setWriteHistory([{ role: 'model', text: "hi, i'm google gemini tuned to act like ron. talk to me about coding, philosophy, movies, or anything else!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

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
    <div className="flex h-full flex-col items-center text-sm">
      <span className="text-zinc-200 font-bold py-4">RawnBot 1.2</span>
      <div 
        className="bg-black max-w-3xl w-full h-full overflow-y-auto no-scrollbar p-4"
        ref={chatContainerRef}
      >
        {writeHistory.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 mt-1 rounded-full flex-shrink-0 text-xs ${
                msg.role === 'user' ? 'bg-blue-500' : 'bg-red-500'
              } flex items-center justify-center text-white`}>
                {msg.role === 'user' ? 'y' : 'r'}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${
                    msg.role === 'user' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {msg.role === 'user' ? 'you' : 'rawnbot'}
                  </span>
                  <span className="text-xs text-zinc-400">{msg.time}</span>
                </div>
                <div 
                  className={`mt-1 ${msg.isError ? 'text-red-400' : 'text-zinc-100'}`}
                  dangerouslySetInnerHTML={{ __html: marked(msg.text || '') }}
                />
                {msg.isError && (
                  <button
                    type="button"
                    className="mt-2 rounded border border-zinc-600 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
                    onClick={() => sendMessage(msg.retryInput, false)}
                    disabled={isLoading}
                  >
                    retry
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ml-10 flex items-center space-x-2 text-zinc-400 p-4">
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
            className="ml-1 w-full bg-transparent text-zinc-100 px-4 py-3 focus:outline-none"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="type ur message..."
            disabled={isLoading}
          />
          <button 
            className="w-8 h-8 mr-1 disabled:opacity-50"
            type="submit"
            disabled={isLoading || !userInput.trim()}
          >
           <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
