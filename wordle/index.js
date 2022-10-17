const PORT = 5000;
const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.get("/random-word", (req, res) => {
  const options = {
    method: "GET",
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom",
    params: { count: "1", wordLength: "5" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(PORT, () => console.log(`Server running on localhost:${PORT}...`));
