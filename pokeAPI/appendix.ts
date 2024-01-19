const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('title').text();
    console.log(`ページタイトル: ${title}`);
  } catch (error) {
    console.error(`エラーが発生しました: ${error}`);
  }
}

scrapeWebsite('https://example.com');
