const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/get_info/:id", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    await page.goto(
      `https://www.copart.com/public/data/lotdetails/solr/lotImages/${req.params.id}/USA`,
      {
        waitUntil: "domcontentloaded",
      }
    );

    let data = await page.evaluate(() => {
      return document.querySelector("pre").innerHTML;
    });

    await browser.close();
    const dat = JSON.parse(data);
    res.send(JSON.parse(data));
  } catch (err) {}
});

app.listen(8000, function () {
  console.log("started");
});
