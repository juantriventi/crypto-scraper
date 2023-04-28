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
  const urlDolar = 'https://www.lanacion.com.ar/';
  const urlDolarCompraVenta = 'https://www.lanacion.com.ar/tema/dolar-blue-tid67294/';

  Promise.all([
    axios.get(url),
    axios.get(urlDolar),
    axios.get(urlDolarCompraVenta),
    axios.get(urlDolarCompraVenta)
  ])
  
  .then(([response, responseDolar, responseDolarOficialCompra, responseDolarBlueCompra]) => {
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

    const htmlDolar = responseDolar.data;
    const $dolar = cheerio.load(htmlDolar);
    const dolarOficial = $dolar('div.dollar-container > div > ul.dollar > li:nth-child(1) > a').text();
    const dolarBlue = $dolar('div.dollar-container > div > ul.dollar > li:nth-child(2) > a').text();

    const htmlDolar_oficial_compra = responseDolarOficialCompra.data;
    const $dolar_oficial_compra = cheerio.load(htmlDolar_oficial_compra);
    const dolar_ofi_compra = $dolar_oficial_compra('div.dolar > ul.dolar-subgroup > li:nth-child(1) > div.currency-data > p.com-text').text();

    const htmlDolar_blue_compra = responseDolarBlueCompra.data;
    const $dolar_blue_compra = cheerio.load(htmlDolar_blue_compra);
    const dolar_blu_compra = $dolar_blue_compra('div.dolar > ul.dolar-subgroup > li:nth-child(2) > div.currency-data > p.com-text').text();

    res.render('index', { data: cryptos, dolar: dolarOficial , dolar2: dolarBlue , oficial: dolar_ofi_compra, blue:dolar_blu_compra });
  })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error al obtener los datos'); // Manejar errores de solicitud
    });
});


  app.listen(3030, (req,res) => {
    console.log("app en puerto 3030")
  })
