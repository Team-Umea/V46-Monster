const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let monsters = []; //load from .json file

app.get("/monsters", (req, res) => {
  if (monsters && monsters.length > 0) {
    return res.status(200).json({ ok: true, monsters: monsters });
  }
  return res.status(500).json({ ok: false });
});

app.get("/health", (req, res) => {
  res.send("Server is healty");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
