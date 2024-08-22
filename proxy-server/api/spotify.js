const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
    const basic = btoa(`${client_id}:${client_secret}`); // Base64 encode
  
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
  
    return response.json();
  };
  

export const getNowPlaying = async (client_id, client_secret, refresh_token) => {
    const { access_token } = await getAccessToken(
        client_id,
        client_secret,
        refresh_token
    );
    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function handler(req, res) {
    const response = await getNowPlaying(client_id, client_secret, refresh_token);
    if (response.status === 204 || response.status > 400) {
        return false;
    }
    const song = await response.json();
    const nowPlayingData = {
      albumImageUrl: song.item.album.images[0].url,
      artist: song.item.artists.map((_artist) => _artist.name).join(", "),
      isPlaying: song.is_playing,
      songUrl: song.item.external_urls.spotify,
      title: song.item.name,
      song: nowPlayingResponse.data
    };

    res.json(nowPlayingData);
}

// const getAccessToken = async () => {
//   const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
//   console.log("TOKENS:", process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, process.env.SPOTIFY_REFRESH_TOKEN);
//   const response = await fetch(
//     TOKEN_ENDPOINT,
//     new URLSearchParams({
//       grant_type: 'refresh_token',
//       refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
//     }),
//     {
//       headers: {
//         Authorization: `Basic ${authString}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     }
//   );
//   console.log("RESPONSE:", response);
//   return response.json;
// };

// export default async function handler(req, res) {
//   try {
//     const accessToken = await getAccessToken();

//     const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
//       return res.json({ isPlaying: false });
//     }

//     const song = nowPlayingResponse.data;

//     const nowPlayingData = {
//       albumImageUrl: song.item.album.images[0].url,
//       artist: song.item.artists.map((artist) => artist.name).join(', '),
//       isPlaying: song.is_playing,
//       songUrl: song.item.external_urls.spotify,
//       title: song.item.name,
//     };

//     res.json(nowPlayingData);
//   } catch (error) {
//     console.error('Error fetching now playing data:', error);
//     res.status(500).json({ error: 'Failed to fetch now playing data' });
//   }
// };