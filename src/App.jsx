import React, { useState } from 'react';
import AboutMe from './components/AboutMe.jsx';
import ChatBot from './components/ChatBot.jsx';
import Spotify from './components/Spotify.jsx';
import Projects from './components/Projects.jsx';
import { InstagramIcon, GitHubIcon, LinkedInIcon, GoodReadsIcon, LetterBoxdIcon } from "./components/icons"
import './App.css'

function App() {
  const [showProjects, setShowProjects] = useState(false);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  const handleProjectsButtonClick = () => {
    setShowProjects(!showProjects);
    const iconsElement = document.querySelector('.icons');
    const { top, left } = iconsElement.getBoundingClientRect();
    setIconPosition({ top, left });
    if (!showProjects) {
        const { top, left } ={ top: 0, left: '50px' };
        setIconPosition({ top, left });
      }
  };

  return (
    <div className="App">
      <div className={`border ${showProjects ? 'slide' : ''}`}></div>
      <div className={`border2 ${showProjects ? 'slide' : ''}`}></div>
      <div className={`app-container ${showProjects ? 'projects' : 'home'}`}>
        
        <div className="about-me-section">
          <AboutMe />
          <div className="about-me"> 
            <h2>Ron Kiehn</h2>
                <div className={`icons ${showProjects ? 'hide' : 'show'}`}>
                    <a href="https://github.com/ronthekiehn/" target="_blank" rel="noreferrer">
                        <GitHubIcon />
                    </a>
                    <a href="https://www.linkedin.com/in/ron-kiehn-a41932235/" target="_blank" rel="noreferrer">
                        <LinkedInIcon />
                    </a>
                    <a href="https://www.instagram.com/ronthekiehn/" target="_blank" rel="noreferrer">
                        <InstagramIcon />
                    </a>
                    <a href="https://letterboxd.com/ronthekiehn/" target="_blank" rel="noreferrer">
                        <LetterBoxdIcon />
                    </a>
                    <a href="https://www.goodreads.com/user/show/153869783-ron-kiehn" target="_blank" rel="noreferrer">
                        <GoodReadsIcon />
                    </a>
                </div>
            </div>
        </div>
        <div className="projects-section">
          <button className='projects-button' onClick={handleProjectsButtonClick}>
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
             <div className='nav-icons' style={iconPosition}>
                    <a href="https://github.com/ronthekiehn/" target="_blank" rel="noreferrer">
                        <GitHubIcon />
                    </a>
                    <a href="https://www.linkedin.com/in/ron-kiehn-a41932235/" target="_blank" rel="noreferrer">
                        <LinkedInIcon />
                    </a>
                    <a href="https://www.instagram.com/ronthekiehn/" target="_blank" rel="noreferrer">
                        <InstagramIcon />
                    </a>
                    <a href="https://letterboxd.com/ronthekiehn/" target="_blank" rel="noreferrer">
                        <LetterBoxdIcon />
                    </a>
                    <a href="https://www.goodreads.com/user/show/153869783-ron-kiehn" target="_blank" rel="noreferrer">
                        <GoodReadsIcon />
                    </a>
              </div>
        {showProjects && <Projects />}
        <button className={`close-button ${showProjects ? '' : 'hide'}`} onClick={handleProjectsButtonClick}></button>
      </div>
      
    </div>
      
  );
}

export default App;
