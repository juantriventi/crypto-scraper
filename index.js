const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://coinmarketcap.com/';
axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const cryptos = [];
    $('tbody tr').each((i, el) => {
        const crypto = {};
        const name = $(el).find('td:nth-child(3) > div > a > div > div > p').text().trim();
        if (name) {
          crypto.name = name;
          crypto.price = $(el).find('td:nth-child(4) > div > a:first-child').text().trim();
          const change_1h_icon = $(el).find('td:nth-child(5) > span > span');
          crypto.change_1h_icon = change_1h_icon && change_1h_icon.attr('class') && change_1h_icon.attr('class').indexOf('up') !== -1 ? '✅' : '❗'; // Verifica si el elemento existe
          crypto.change_1h = $(el).find('td:nth-child(5)').text().trim();
          const change_7d_icon = $(el).find('td:nth-child(7) > span > span');
          crypto.change_7d_icon = change_7d_icon && change_7d_icon.attr('class') && change_7d_icon.attr('class').indexOf('up') !== -1 ? '✅' : '❗'; // Verifica si el elemento existe
          crypto.change_7d = $(el).find('td:nth-child(7)').text().trim();
          cryptos.push(crypto);
        }
      });
        console.log(cryptos);
  })
  .catch(console.error);
