import React, { useEffect, useState } from 'react';
import '../styles/AboutMe.css';
import { InstagramIcon, GitHubIcon, LinkedInIcon, GoodReadsIcon, LetterBoxdIcon } from "./icons"

const Projects = () => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='container'>
            {showContent && (
                <div className="about-me">
                    <h2>Ron Kiehn</h2>
                    <div className='nav-icons'>
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
            )}
        </div>
    );
};

export default Projects;