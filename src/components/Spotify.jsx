import { useEffect, useState } from 'react';
import '../styles/Spotify.css';
import { SpotifyIcon } from './icons';

const myApi = 'https://ronkiehn-dev.vercel.app';

const Spotify = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});

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

    fetchNowPlaying();

    // Fetch every 10 seconds
    const intervalId = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="spotify-container">
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <div className="spotify-content">
          <div className="playing-text">
            <SpotifyIcon className="icon spotify-icon" />
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
                <a className="song-title" href={result.songUrl} target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </a>
                  <p className="song-artist">{result.artist}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Spotify;