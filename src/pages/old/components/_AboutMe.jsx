import { useEffect } from 'react';
import '../styles/_AboutMe.css';

const name = ['r', 'o', 'n'];
let alt = false;


const AboutMe = () => {
    useEffect(() => {
        const container = document.querySelector('.box-container');
        
        const handleTouchMove = (e) => {
          e.preventDefault(); // Prevent scrolling
          const touch = e.touches[0];
          const element = document.elementFromPoint(touch.clientX, touch.clientY);
          if (element && element.classList.contains('box')) {
            element.classList.add('hovered');
            setTimeout(() => element.classList.remove('hovered'), 500); // Remove class after 500ms
          }
        };
    
        const handleTouchEnd = () => {
          const hoveredSquares = document.querySelectorAll('.box.hovered');
          hoveredSquares.forEach(square => square.classList.remove('hovered'));
        };
    
        container.addEventListener('touchmove', handleTouchMove, { passive: true });
        container.addEventListener('touchend', handleTouchEnd,  { passive: true });
    
        return () => {
          container.removeEventListener('touchmove', handleTouchMove);
          container.removeEventListener('touchend', handleTouchEnd);
        };
      }, []);
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