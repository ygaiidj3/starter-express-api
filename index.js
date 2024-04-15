const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;
let api_url = process.env.API_URL;
let token = process.env.API_TOKEN;
let group_id = process.env.GROUP_ID;

api_url = api_url.replace("$API_TOKEN$", token);

function read_client_info(req, res, next) {
  const message = {
    chat_id: group_id,
    text: "```json\n" + JSON.stringify(req.headers, null, 2) + "\n```",
    parse_mode: "Markdown",
  };
  axios.post(api_url, message);
  next();
}

app.use(express.json());
app.use(read_client_info);

app.get("/", (req, res) => {
  res.send("You found me :D");
});

// Route handler for POST requests
app.post("/headers", async (req, res) => {
  try {
    const { url } = req.body;
    const headers = await fetchHeaders(url);
    res.json(headers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching headers" });
  }
});

// Route handler for GET requests
app.get("/headers", async (req, res) => {
  try {
    const { url } = req.query;
    const headers = await fetchHeaders(url);
    res.json(headers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching headers" });
  }
});

// Function to fetch headers from a given URL
async function fetchHeaders(url) {
  // Make request to the provided URL
  const response = await axios.get(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      cookie: "ps_n=0; ps_l=0",
      "sec-ch-ua": '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    },
  });

  // Extract headers from the response
  let notMuch = decodeURIComponent(response.headers.link).split(";")[0].trim();
  url = notMuch.replace("<", "").replace(">", "");
  a = new URL(url);
  return { url: "https://mbasic.facebook.com" + a.pathname };
}

app.listen(port, () => {
  console.log(`Server is running on https://fbwatch.cyclic.app`);
});
