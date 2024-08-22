import { useEffect, useState } from 'react';
import '../styles/Spotify.css';
import { SpotifyIcon } from './icons';

const Spotify = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify-now-playing');
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
      {loading && <p>Loading...</p>}
      {!loading && !result.isPlaying && (
        <div className="playing-text">
          <SpotifyIcon />
          <span>Currently offline</span>
        </div>
      )}
      {!loading && result.isPlaying && (
        <div>
          <div className="playing-text">
            <SpotifyIcon />
            <span>Now playing</span>
          </div>
          <div className="song">
            <img src={result.albumImageUrl} alt={`${result.title} album art`} />
            <div className="song-info">
              <a href={result.songUrl} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
              <p>{result.artist}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spotify;
