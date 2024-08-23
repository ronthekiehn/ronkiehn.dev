import React, { useEffect, useState } from 'react';
import '../styles/Projects.css';
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
                <div className="content">
                    <h1>Projects</h1>
                </div>
            )}
        </div>
    );
};

export default Projects;