const express = require("express");
const app = express();
const cheerio = require("cheerio");
//Request promise para traer varias paginas 
const request = require("request-promise");

// Configuración de Express
app.set("view engine", "ejs");

// Definición de rutas
app.get("/", (req, res) => {
  res.render("index");
});

const pages = [
  "https://ejemplo1.com",
  "https://ejemplo2.com",
  "https://ejemplo3.com",
];

Promise.all(pages.map((url) => request(url)))
  .then((htmls) => {
    htmls.forEach((html, index) => {
      const $ = cheerio.load(html);
      const prices = $('h1:contains("$"), h3:contains("$")').filter(
        function () {
          return /\$\d+(\.\d{1,2})?/.test($(this).text());
        }
      );

      console.log(`Precios encontrados en ${pages[index]}:`);
      prices.each(function () {
        console.log($(this).text());
      });
    });
  })
  .catch((error) => console.error(error));
// Iniciar la aplicación
app.listen(3000, () => {
  console.log("La aplicación está escuchando en el puerto 3000");
});
