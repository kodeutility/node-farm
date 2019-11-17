const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //Overview
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { "Content-type": "text/html" });

        const cardsHtml = dataObject.map(el => replaceTemplate(templateCard, el)).join("");
        const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

        res.end(output);

        //Product
    } else if (pathname === "/product") {
        const product = dataObject[query.id];
        res.writeHead(200, { "Content-type": "text/html" });
        const output = replaceTemplate(templateProduct, product);
        res.end(output);

        //API
    } else if (pathname === "/api") {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(data);
    } else {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("Page not Found");
    }
});

server.listen(3000);
