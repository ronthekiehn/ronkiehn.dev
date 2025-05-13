import { parseStringPromise } from 'xml2js';

const RSS_URL = 'https://letterboxd.com/ronthekiehn/rss/';

export default async function handler(req, res) {
  try {
    const response = await fetch(RSS_URL);
    const rssText = await response.text();

    // Parse the XML into JSON
    const parsedData = await parseStringPromise(rssText);
    
    // Navigate to the first item in the feed
    const items = parsedData.rss.channel[0].item.slice(0, 8);

    // Extract the relevant data for the most recent 8 movies
    const movies = items.map(item => {
      const movieTitle = item['letterboxd:filmTitle'][0];
      const posterImage = item.description[0].match(/<img src="(.*?)"/)[1];
      const starRating = item['letterboxd:memberRating'][0];
      const watchedDate = item['letterboxd:watchedDate'][0];
      const [year, month, day] = watchedDate.split('-');
      const formatDate = `${month}-${day}-${year}`;

      return {
        movieTitle,
        posterImage,
        starRating,
        watchedDate: formatDate,
      };
    });

    if (movies.length > 0) {
      res.status(200).json(movies);
    } else {
      res.status(404).json({ message: 'No recent activity found' });
    }
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error);
    res.status(500).json({ message: 'Error fetching Letterboxd data' });
  }
}
