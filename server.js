const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

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

let monsters = {};

function loadMonsters() {
  const filePath = path.join(__dirname, "monsters.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading monsters.json");
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      monsters = jsonData.monsters;
      console.log("Monsters loaded");
    } catch (parseError) {
      console.log("Error parsing JSON data");
    }
  });
}

loadMonsters();

app.get("/allMonsters", (_, res) => {
  if (monsters && monsters.length > 0) {
    return res.status(200).json({ ok: true, monsters: monsters });
  }
  return res.status(500).json({ ok: false });
});

app.get("/freeMonsters", (_, res) => {
  if (monsters && monsters.length > 0) {
    const freeMonsters = monsters.filter((monster) => monster.price === 0);
    return res.status(200).json({ ok: true, freeMonsters: freeMonsters });
  }
  return res.status(500).json({ ok: false });
});

app.get("/monsterById", (req, res) => {
  const id = req.query.id;

  if (monsters && monsters.length > 0 && id) {
    const monster = monsters.find((monster) => monster.id === parseInt(id));
    if (monster) {
      return res.status(200).json({ ok: true, monster: monster });
    }
    return res.status(404).json({ ok: false, message: "Monster not found" });
  }
  return res.status(400).json({ ok: false, message: "Id parameter missing or invalid" });
});

app.get("/monstersByStrengths", (req, res) => {
  const strengths = req.query.strengths;

  if (strengths) {
    const strengthsArray = Array.isArray(strengths) ? strengths : [strengths];

    const insensitiveStrengths = strengthsArray.map((strength) => strength.toLowerCase());
    const filteredMonsters = monsters.filter((monster) => {
      return monster.strengths.some((strength) => insensitiveStrengths.includes(strength.toLowerCase()));
    });

    return res.status(200).json({ ok: true, monsters: filteredMonsters });
  }

  return res.status(400).json({ ok: false, message: "Strengths parameter missing or invalid" });
});

app.get("/monstersByWeaknesses", (req, res) => {
  const weaknesses = req.query.weaknesses;

  if (weaknesses) {
    const weaknessesArray = Array.isArray(weaknesses) ? weaknesses : [weaknesses];
    const insensitiveWeaknesses = weaknessesArray.map((weakness) => weakness.toLowerCase());
    const filteredMonsters = monsters.filter((monster) => {
      return monster.weaknesses.some((weakness) => insensitiveWeaknesses.includes(weakness.toLowerCase()));
    });

    return res.status(200).json({ ok: true, monsters: filteredMonsters });
  }
  return res.status(400).json({ ok: false, message: "Weaknesses parameter missing or invalid" });
});

app.get("/health", (_, res) => {
  res.send("Server is healty");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
