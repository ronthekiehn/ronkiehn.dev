import React, { useState, useEffect } from 'react';
import AboutMe from './components/_AboutMe.jsx';
import ChatBot from './components/_ChatBot.jsx';
import Spotify from './components/_Spotify.jsx';
import Projects from './components/_Projects.jsx';
import { GitHubIcon, LinkedInIcon, GoodReadsIcon, LetterBoxdIcon, CloseIcon, TwitterIcon } from "./components/_icons.jsx"
import './_App.css'
import './_index.css'

function App() {
  const [showProjects, setShowProjects] = useState(false);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [loadedText, setLoadedText] = useState(false);
  const [textPos, setTextPos] = useState({ top: '50%', left: '50%'});

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setTimeout(() => {
      const title = document.querySelector('.about-me h2');
      if (title) {
        const { top, left } = title.getBoundingClientRect();
        setTextPos({ top, left, transform: 'none' });
        setTimeout(() => {
          setLoadedText(true);
        }, 2000);
      }
    }, 2000);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    const iconsElement = document.querySelector('.icons');
    if (iconsElement) {
      const { top, left } = iconsElement.getBoundingClientRect();
      setIconPosition({ top, left });
    }

    // Prevent scrolling on desktop only
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, [isMobile]);
  
  const handleProjectsButtonClick = () => {
    setShowProjects(!showProjects);
    const iconsElement = document.querySelector('.icons');
    if (iconsElement) {
      const { top, left } = iconsElement.getBoundingClientRect();
      setIconPosition({ top, left });
    }
    if (!showProjects) {
      setIconPosition({ top: 0, left: '50px' });
    }
  };

  return (
    <div className="App">
      {!loadedText && <div className="typewriter" style={textPos}>
          <h2>Ron Kiehn</h2>
        </div>}
      {!isMobile && <div className={`border ${showProjects ? 'slide' : ''}`}></div>}
      {!isMobile && <div className={`border2 ${showProjects ? 'slide' : ''}`}></div>}
      <div className={`app-container ${!isMobile && showProjects ? 'projects' : 'home'}`}>
        <div className="about-me-section">
          <AboutMe />
          <div className="about-me"> 
            <h2 className={`${loadedText ? 'show' : ''}`}>
              {'Ron'.split('').map((char, index) => (
                  <span key={index} className="letter first-name">{char}</span>
            ))} 
            <span> </span>
            {'Kiehn'.split('').map((char, index) => (
                  <span key={index} className="letter last-name">{char}</span>
            ))}
            </h2>
            <div className='underbar'>
              <div className={`icons ${showProjects && !isMobile ? 'hide' : 'show'}`}>
                <a href="https://github.com/ronthekiehn/" target="_blank" rel="noreferrer">
                  <GitHubIcon />
                </a>
                <a href="https://www.linkedin.com/in/ron-kiehn-a41932235/" target="_blank" rel="noreferrer">
                  <LinkedInIcon />
                </a>
                <a href="https://x.com/rrawnyy" target="_blank" rel="noreferrer">
                  <TwitterIcon />
                </a>
                <a href="https://letterboxd.com/ronthekiehn/" target="_blank" rel="noreferrer">
                  <LetterBoxdIcon />
                </a>
                <a href="https://www.goodreads.com/user/show/153869783-ron-kiehn" target="_blank" rel="noreferrer">
                  <GoodReadsIcon />
                </a>
              </div>
              <div className='under-text'>
                <span>cs & philosophy @ uchicago </span>
                <span>hire me: ronki@uchicago.edu</span>
              </div>
            </div>
            {isMobile && (<div className='scroll'>
              <span>scroll</span>
              <CloseIcon />
              </div>)}
          </div>
        </div>
        {!isMobile && (
          <div className="projects-section">
          <button className='projects-button' onClick={handleProjectsButtonClick}>
            Projects
          </button>
          <button className='projects-text'>Projects</button>
        </div>
        )}
        
        <div className="chatbot-section">
          <ChatBot />
        </div>
        <div className="spotify-section">
          <Spotify />
        </div>
      </div>
      <div className={`projects-container ${showProjects || isMobile ? 'show' : 'hidden'}`}>
        {!isMobile && (
          <div className='nav-icons' style={iconPosition}>
            <a href="https://github.com/ronthekiehn/" target="_blank" rel="noreferrer">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/ron-kiehn-a41932235/" target="_blank" rel="noreferrer">
              <LinkedInIcon />
            </a>
            <a href="https://x.com/rrawnyy" target="_blank" rel="noreferrer">
                <TwitterIcon />
              </a>
            <a href="https://letterboxd.com/ronthekiehn/" target="_blank" rel="noreferrer">
              <LetterBoxdIcon />
            </a>
            <a href="https://www.goodreads.com/user/show/153869783-ron-kiehn" target="_blank" rel="noreferrer">
              <GoodReadsIcon />
            </a>
          </div>
        )}
        {(showProjects || isMobile) && <Projects />}
        {!isMobile && (
          <button className={`close-button ${showProjects ? '' : 'hide'}`} onClick={handleProjectsButtonClick}>
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;