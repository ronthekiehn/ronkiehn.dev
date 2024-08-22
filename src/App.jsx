import React from 'react';
import AboutMe from './components/AboutMe.jsx';
import ChatBot from './components/ChatBot.jsx';
import Spotify from './components/Spotify.jsx';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className='border'></div>
      <div className='border2'></div>
      <div className="about-me-section">
        <AboutMe />
      </div>
      <div className="projects-section">
        <button className='projects-button'>Projects</button>
        <button className='projects-text'>Projects</button>
      </div>
      <div className="chatbot-section">
        <ChatBot />
      </div>
      <div className="spotify-section">
        <Spotify />
      </div>
      
    </div>
  );
}

export default App
