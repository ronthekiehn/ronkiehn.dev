import { useEffect, useState } from 'react';
import '../styles/_Spotify.css';
import { SpotifyIcon, LetterBoxdIcon } from './_icons';
const myApi = 'https://ronkiehn-dev.vercel.app';

const Spotify = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});
  const [movie, setMovie] = useState(null); 

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch(`${myApi}/api/spotify`);
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error fetching now playing data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLetterboxdMovie = async () => {
      try {
        const response = await fetch(`${myApi}/api/letterboxd`);
        const movieData = await response.json();
        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching Letterboxd movie data:', error);
      }
    };

    fetchNowPlaying();
    fetchLetterboxdMovie();

    // Fetch Spotify data every 10 seconds
    const intervalId = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="spotify-container">
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <div className="spotify-content">
          <div className="playing-text">
            <SpotifyIcon />
            Now playing
          </div>
          <div className="song-container">
            {!result.isPlaying && (
              <div className="song offline">
                Currently offline
              </div>
            )} 
            {result.isPlaying && (
              <div className="song">
                {result.albumImageUrl && (
                  <img src={result.albumImageUrl} alt={result.album} />
                )}
                <div className="song-info">
                  <p><strong>{result.title}</strong></p>
                  <p className="song-artist">{result.artist}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        {movie && (
          <div className='other-stuff'>
            <div className="playing-text">
              <LetterBoxdIcon />
              Last watched
            </div>
          <div className="letterboxd-movie">
            <img src={movie.posterImage} alt={movie.movieTitle} />
            <div className="movie-info">
              <p><strong>{movie.movieTitle}</strong></p>
              <p>{movie.starRating} Stars</p>
              <p>Watched on {movie.watchedDate}</p>
            </div>
            
          </div>
          </div>
        )}
      </div>
   
  );
};

export default Spotify;
