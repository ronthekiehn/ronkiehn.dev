import React, { useEffect, useState } from 'react';

const LetterBoxd = () => {
  const [recentMovie, setRecentMovie] = useState(null);

  useEffect(() => {
    const fetchRecentMovie = async () => {
      try {
        const response = await fetch('https://letterboxd.com/ronthekiehn/');
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        const movieElement = doc.querySelector('.poster-container');
        if (movieElement) {
          const title = movieElement.querySelector('.film-poster').getAttribute('alt');
          const imageUrl = movieElement.querySelector('.film-poster').getAttribute('data-src');
          const movieLink = movieElement.querySelector('a').getAttribute('href');

          setRecentMovie({
            title,
            imageUrl: `https://letterboxd.com${imageUrl}`,
            movieLink: `https://letterboxd.com${movieLink}`
          });
        }
      } catch (error) {
        console.error('Error fetching recent movie:', error);
      }
    };

    fetchRecentMovie();
  }, []);

  return (
    <div className="recent-movie">
      {recentMovie ? (
        <div>
          <h3>Most Recently Watched Movie</h3>
          <a href={recentMovie.movieLink} target="_blank" rel="noopener noreferrer">
            <img src={recentMovie.imageUrl} alt={recentMovie.title} />
            <p>{recentMovie.title}</p>
          </a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LetterBoxd;
