import { parseStringPromise } from 'xml2js';

// Goodreads RSS feed URL for user updates
const RSS_URL = 'https://www.goodreads.com/user/updates_rss/153869783?key=pJcJ9em9HSEt5aFy5OKn4cjGVq0Pp3-q7_wncSZusS4S4q_h';

// Helper function to extract rating from description text (adjust regex as needed based on actual feed)
function extractRating(description) {
  const ratingMatch = description.match(/gave (\d+) stars? to/);
  if (ratingMatch && ratingMatch[1]) {
    return parseInt(ratingMatch[1], 10);
  }
  return null;
}

// Helper function to format date
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  } catch (e) {
    return null; // Invalid date format
  }
}

// Helper function to transform image URLs to high quality versions
function getHighQualityImageUrl(lowQualityUrl) {
  // Transform URL from:
  // https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1737312514l/176444106._SY75_.jpg
  // to:
  // https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1737312514i/176444106.jpg
  
  return lowQualityUrl
    .replace('i.gr-assets.com', 'images-na.ssl-images-amazon.com') // Change domain
    .replace('/l/', '/i/') // Change image type
    .replace(/\._SY\d+_/, ''); // Remove size constraint
}

export default async function handler(req, res) {
  try {
    const response = await fetch(RSS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    const rssText = await response.text();

    // Parse the XML into JSON
    const parsedData = await parseStringPromise(rssText);

    const items = parsedData.rss.channel[0].item;
    const books = [];

    for (const item of items) {
        let title, description, pubDate;
        try {
            title = item.title[0];
            description = item.description[0];
            pubDate = item.pubDate[0];
        } catch (error) {
            console.error('Error parsing item:', error);
            continue;
        }

      // Only process items that are book reviews/ratings
      if (!title.includes('added') && !description.includes('gave')) {
        continue;
      }

      // Extract book title (from the link text in description)
      const titleMatch = description.match(/<a class="bookTitle"[^>]*>(.*?)<\/a>/);
      if (!titleMatch) continue;
      const bookTitle = titleMatch[1].replace(/\s*\([^)]*\)/, ''); // Remove format info in parentheses

      // Extract cover image and transform to high quality version
      const coverMatch = description.match(/<img[^>]*src="([^"]*)"[^>]*>/);
      if (!coverMatch) continue;
      const coverImage = getHighQualityImageUrl(coverMatch[1]);

      // Extract rating
      const rating = extractRating(description);
      if (!rating) continue;

      // Format date
      const dateRead = formatDate(pubDate);
      if (!dateRead) continue;

      books.push({
        bookTitle,
        coverImage,
        rating,
        dateRead,
      });

      // Only get the first 4 books
      if (books.length >= 4) {
        break;
      }
    }

    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: 'No recent book activity found' });
    }
  } catch (error) {
    console.error('Error fetching Goodreads data:', error);
    res.status(500).json({ message: 'Error fetching Goodreads data' });
  }
}