const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require ("@google/generative-ai");
import systemPrompt from './prompt.systemPrompt.json';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

const getAccessToken = async () => {
  const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(
    TOKEN_ENDPOINT,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
    {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
};

app.get('/api/spotify-now-playing', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const nowPlayingResponse = await axios.get(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      return res.json({ isPlaying: false });
    }

    const song = nowPlayingResponse.data;

    const nowPlayingData = {
      albumImageUrl: song.item.album.images[0].url,
      artist: song.item.artists.map((artist) => artist.name).join(', '),
      isPlaying: song.is_playing,
      songUrl: song.item.external_urls.spotify,
      title: song.item.name,
    };

    res.json(nowPlayingData);
  } catch (error) {
    console.error('Error fetching now playing data:', error);
    res.status(500).json({ error: 'Failed to fetch now playing data' });
  }
});

const apiKey = import.meta.env.VITE_GOOGLE_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ]

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: systemPrompt.prompt,
  safetySettings
});



const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

app.post('/api/chat', async (req, res) => {
    const { userInput, chatHistory } = req.body;
  
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: chatHistory,
        });
  
      const result = await chatSession.sendMessage(userInput);
      const botOutput = result.response.text();

      res.json({ botResponse: botOutput });
    } catch (error) {
      console.error('Error fetching chat response:', error);
      res.status(500).json({ error: 'Failed to fetch chat response' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

