import { parseStringPromise } from 'xml2js';

const RSS_URL = 'https://letterboxd.com/ronthekiehn/rss/';

export default async function handler(req, res) {
  try {
    const response = await fetch(RSS_URL);
    const rssText = await response.text();

    // Parse the XML into JSON
    const parsedData = await parseStringPromise(rssText);
    
    // Navigate to the first item in the feed
    const item = parsedData.rss.channel[0].item[0];

    // Extract the relevant data
    const movieTitle = item['letterboxd:filmTitle'][0];
    const posterImage = item.description[0].match(/<img src="(.*?)"/)[1];
    const starRating = item['letterboxd:memberRating'][0];
    const watchedDate = item['letterboxd:watchedDate'][0];

    console.log(movieTitle, posterImage, starRating, watchedDate);
    console.log("here");
    if (movieTitle && posterImage && starRating && watchedDate) {
      res.status(200).json({
        movieTitle: movieTitle,
        posterImage: posterImage,
        starRating: starRating,
        watchedDate: watchedDate,
      });
    } else {
      res.status(404).json({ message: 'No recent activity found' });
    }
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error);
    res.status(500).json({ message: 'Error fetching Letterboxd data' });
  }
}
