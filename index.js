const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');

// Establecer el motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {

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
            crypto.change_1h_icon = change_1h_icon && change_1h_icon.attr('class') && change_1h_icon.attr('class').indexOf('up') !== -1 ? '+' : '-'; 
            crypto.change_1h = $(el).find('td:nth-child(5)').text().trim();
            const change_7d_icon = $(el).find('td:nth-child(7) > span > span');
            crypto.change_7d_icon = change_7d_icon && change_7d_icon.attr('class') && change_7d_icon.attr('class').indexOf('up') !== -1 ? '+' : '-';
            crypto.change_7d = $(el).find('td:nth-child(7)').text().trim();
            cryptos.push(crypto);
          }
        });
      console.log(cryptos);
      res.render('index', { data:cryptos }); // Renderizar la plantilla con los datos
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error al obtener los datos de coinmarketcap.com'); // Manejar errores de solicitud
    });
});


  app.listen(3030, (req,res) => {
    console.log("app en puerto 3030")
  })
