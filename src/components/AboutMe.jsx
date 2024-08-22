import React from 'react';
import '../styles/AboutMe.css';
import { InstagramIcon, GitHubIcon, LinkedInIcon, GoodReadsIcon, LetterBoxdIcon } from "./icons"

const name = ['r', 'o', 'n'];
let alt = false;
const AboutMe = () => {
return (
    <div className='container'>
            <div className="box-container">
                    {Array.from({ length: 1600 }, (_, index) => {
                        if (index % 3 === 0) {
                            alt = !alt;
                        }
                        return <div key={index} className={`box ${alt ? 'altcolor' : ''}`} >{name[index % 3]}</div>;
                    })}
            </div> 
            <div className="about-me">
            <h2>Ron Kiehn</h2>
                <div className='icons'>
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
    
);
};

export default AboutMe;