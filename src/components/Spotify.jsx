import { useEffect, useState } from "react";
import getNowPlayingItem from "../utils/spotifyAPI";
import '../styles/Spotify.css';
import { SpotifyIcon } from "./icons"
// import SpotifyPlayingAnimation from "./SpotifyPlayingAnimation";

const Spotify = (props) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState({});
  
    useEffect(() => {
      const fetchNowPlaying = async () => {
          const results = await getNowPlayingItem(
            props.client_id,
            props.client_secret,
            props.refresh_token
          );
          setResult(results);
          setLoading(false);
      };
  
      fetchNowPlaying();
      
      //only going to check every 10 seconds to not spam the api
      const intervalId = setInterval(fetchNowPlaying, 10000);
  
      return () => clearInterval(intervalId);
    }, [props.client_id, props.client_secret, props.refresh_token]);
  
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
                        <img src={result.albumImageUrl} alt={`${result.title} album art`}/>
                        <div className="song-info">
                            <a href={result.songUrl} target="_blank">{result.title}</a>
                            <p>{result.artist}</p>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
};

export default Spotify;
