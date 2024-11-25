const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// const corsOptions = {
//   origin: "*",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   optionSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

let monsters = {};

init();

function init() {
  readJSON("newMonsters.json", (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      monsters = addPriceTags(data);
      console.log(monsters);
    }
  });
}

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

function readJSON(fileName, callback) {
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading monsters.json");
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (parseError) {
      console.log("Error parsing JSON data");
    }
  });
}

function addPriceTags(monstersFromDB) {
  const prices = [
    { min: 0, max: 5, price: 0 },
    { min: 6, max: 10, price: 100 },
    { min: 11, max: 16, price: 150 },
    { min: 17, max: 21, price: 250 },
    { min: 22, max: 26, price: 500 },
    { min: 27, max: 33, price: 1000 },
    { min: 34, max: 39, price: 2000 },
    { min: 40, max: 46, price: 5000 },
    { min: 47, max: 55, price: 10000 },
    { min: 56, max: 62, price: 20000 },
    { min: 62, max: 68, price: 30000 },
    { min: 69, max: 74, price: 40000 },
    { min: 75, max: 80, price: 50000 },
    { min: 81, max: 86, price: 75000 },
    { min: 87, max: 93, price: 100000 },
    { min: 94, max: 100, price: 125000 },
    { min: 101, max: 109, price: 150000 },
    { min: 110, max: 119, price: 175000 },
    { min: 120, max: 129, price: 200000 },
    { min: 130, max: 139, price: 250000 },
    { min: 140, max: 149, price: 300000 },
    { min: 150, max: 159, price: 400000 },
    { min: 160, max: 169, price: 500000 },
    { min: 170, max: 179, price: 600000 },
    { min: 180, max: 189, price: 750000 },
    { min: 190, max: 195, price: 950000 },
    { min: 196, max: 200, price: 1000000 },
  ];

  const monstersWithPriceTag = monstersFromDB.map((monster) => {
    const rating = monster.damage + monster.health;
    const price = prices.find((p) => rating >= p.min && rating <= p.max).price;
    return { ...monster, price: price };
  });

  return monstersWithPriceTag;
}

app.get("/allMonsters", (_, res) => {
  if (monsters && monsters.length > 0) {
    return res.status(200).json({ ok: true, monsters: monsters });
  }
  return res.status(500).json({ ok: false });
});

app.get("/monsters", (req, res) => {
  let numMonsters = parseInt(req.query.num);
  if (isNaN(numMonsters) || numMonsters <= 0) {
    return res.status(400).json({ ok: false, message: "Num parameter missing or invalid" });
  }
  if (numMonsters > monsters.length) {
    numMonsters = monsters.length;
  }
  const monstersToReturn = monsters.slice(0, numMonsters);
  return res.status(200).json({ ok: true, monsters: monstersToReturn });
});

app.get("/freeMonsters", (_, res) => {
  if (monsters && monsters.length > 0) {
    const freeMonsters = monsters.filter((monster) => monster.price === 0);
    return res.status(200).json({ ok: true, freeMonsters: freeMonsters });
  }
  return res.status(500).json({ ok: false });
});

app.get("/randomMonsters", (req, res) => {
  let numMonsters = parseInt(req.query.num);
  const totalMonsters = monsters.length;

  if (isNaN(numMonsters) || numMonsters <= 0) {
    return res.status(400).json({ ok: false, message: "Num parameter missing or invalid" });
  }

  if (numMonsters > totalMonsters) {
    numMonsters = totalMonsters;
  }

  const randomIndices = new Set();
  while (randomIndices.size < numMonsters) {
    const randomIndex = Math.floor(Math.random() * totalMonsters);
    randomIndices.add(randomIndex);
  }

  const monstersToReturn = Array.from(randomIndices).map((index) => monsters[index]);
  return res.status(200).json({ ok: true, monsters: monstersToReturn });
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
