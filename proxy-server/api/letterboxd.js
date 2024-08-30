const cheerio = require('cheerio');
const fetch = require('node-fetch');

export default async function handler(req, res) {
  const letterboxdUrl = 'https://letterboxd.com/ronthekiehn/';
  try {
    // Fetch the Letterboxd profile page
    const response = await fetch(letterboxdUrl);
    const html = await response.text();
    
    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Find the first movie in the "Recent Activity" section
    const firstMovie = $('#recent-activity ul.poster-list li.poster-container').first();

    // Extract the movie data
    const movieName = firstMovie.find('.frame-title').text().trim();
    const moviePoster = firstMovie.find('img').attr('src');
    const movieUrl = firstMovie.find('a').attr('href');

    if (movieName && moviePoster && movieUrl) {
      res.status(200).json({
        name: movieName,
        posterUrl: `https://letterboxd.com${moviePoster}`,
        movieUrl: `https://letterboxd.com${movieUrl}`,
      });
    } else {
      res.status(404).json({ message: 'No recent activity found' });
    }
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error);
    res.status(500).json({ message: 'Error fetching Letterboxd data' });
  }
}
