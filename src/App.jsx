import React, { useState } from 'react';
import AboutMe from './components/AboutMe.jsx';
import ChatBot from './components/ChatBot.jsx';
import Spotify from './components/Spotify.jsx';
import Projects from './components/Projects.jsx';
import './App.css'

function App() {
  const [showProjects, setShowProjects] = useState(false);
  

  const handleProjectsButtonClick = () => {
    setShowProjects(!showProjects);
  };

  return (
    <div className="App">
      <div className={`border ${showProjects ? 'slide' : ''}`}></div>
      <div className={`border2 ${showProjects ? 'slide' : ''}`}></div>
      <div className={`app-container ${showProjects ? 'projects' : 'home'}`}>
        
        <div className="about-me-section">
          <AboutMe />
        </div>
        <div className="projects-section">
          <button className={`projects-button ${showProjects ? 'show' : ''}`} onClick={handleProjectsButtonClick}>
            Projects
          </button>
          <button className='projects-text'>Projects</button>
        </div>
        <div className="chatbot-section">
          <ChatBot />
        </div>
        <div className="spotify-section">
          <Spotify />
        </div>
    </div>
      <div className={`projects-container ${showProjects ? 'show' : 'hidden'}`}>
        {showProjects && <Projects />}
        <button className={`close-button ${showProjects ? '' : 'hide'}`} onClick={handleProjectsButtonClick}></button>
      </div>
      
    </div>
      
  );
}

export default App;
