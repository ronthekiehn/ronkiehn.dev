const fs = require('fs');

// Read and parse tweets file directly
const tweetsData = fs.readFileSync('./tweets.js', 'utf8');
const tweets = JSON.parse(tweetsData.replace('window.YTD.tweets.part0 = ', ''));

const tweetTexts = tweets
  .filter(tweet => !tweet.tweet.in_reply_to_status_id_str)
  .map(tweet => tweet.tweet.full_text);

fs.writeFileSync('tweet-texts.txt', tweetTexts.join('\n'), 'utf8');

console.log(`Extracted ${tweetTexts.length} tweets to tweet-texts.txt`);
