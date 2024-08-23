import React from 'react';
import '../styles/AboutMe.css';

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
    </div>
    
);
};

export default AboutMe;