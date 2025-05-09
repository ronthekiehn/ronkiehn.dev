const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const RECENT_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=8`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
    try {
        const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64'); // Base64 encode

        const params = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        });

        const response = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.statusText}`);
        }
        
        return response.json();
    } catch (error) {
        console.error("Error in getAccessToken:", error);
        throw error;
    }
};

const getRecentTracks = async (client_id, client_secret, refresh_token) => {
  const { access_token } = await getAccessToken(
      client_id,
      client_secret,
      refresh_token
  );
  return fetch(RECENT_TRACKS_ENDPOINT, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      },
  });
};

const getRecentTracksItem = async () => {
      const response = await getRecentTracks(client_id, client_secret, refresh_token);
      if (response.status === 204 || response.status > 400) {
          return false;
      }
      const tracks = await response.json();
      return tracks;
};

export default async function handler(req, res) {
    try {
        const tracks = await getRecentTracksItem();

        if (!tracks || !tracks.items || tracks.items.length === 0) {
            res.status(204).send();
            return;
        }

        const recentTracks = tracks.items.map(item => ({
            albumImageUrl: item.track.album.images[0].url,
            artist: item.track.artists.map(artist => artist.name).join(", "),
            title: item.track.name,
            album: item.track.album.name,
            playedAt: item.played_at
        }));

        res.status(200).json(recentTracks);
    } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: 'Failed to fetch recent tracks data' });
    }
}
