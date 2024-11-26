const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

let monsters = {};
let elements = [];

const endpoints = [
  {
    path: "/allMonsters",
    desc: "Returns a list of all monsters. No parameters needed. Returns a JSON object with 'ok' status and an array of all monster objects, or a 500 error if there are no monsters.",
  },
  {
    path: "/monsters",
    desc: "Returns a specified number of monsters. Requires a query parameter 'num' (positive integer) indicating how many monsters to return. Returns a JSON object with 'ok' status and an array of monster objects, or a 400 error if 'num' is missing or invalid.",
  },
  {
    path: "/freeMonsters",
    desc: "Returns a list of monsters that are free (price = 0). No parameters needed. Returns a JSON object with 'ok' status and an array of free monster objects, or a 500 error if there are no monsters.",
  },
  {
    path: "/randomMonsters",
    desc: "Returns a specified number of random monsters. Requires a query parameter 'num' (positive integer) indicating how many random monsters to return. Returns a JSON object with 'ok' status and an array of randomly selected monster objects, or a 400 error if 'num' is missing or invalid.",
  },
  {
    path: "/monsterById",
    desc: "Returns a monster by its unique ID. Requires a query parameter 'id' (integer) for the unique identifier of the monster. Returns a JSON object with 'ok' status and the monster object if found, or a 404 error if no monster matches the given ID, and a 400 error if 'id' is missing or invalid.",
  },
  {
    path: "/elements",
    desc: "Returns a list of elements with their names and ratings. No parameters needed. Returns a JSON object with 'ok' status and an array of objects containing element names and ratings, or a 500 error if there are any issues.",
  },
];

init();

function init() {
  readJSON("./json/monsters.json", (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      monsters = data;
    }
  });
  readJSON("./json/elements.json", (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      elements = data;
      console.log("Els: ", elements);
    }
  });
}

function readJSON(path, callback) {
  fs.readFile(path, "utf8", (err, data) => {
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

app.get("/", (_, res) => {
  const welcome = endpoints.map((end) => `${end.path} - ${end.desc}`).join("\n\n");
  res.setHeader("Content-Type", "text/plain");
  res.send(welcome);
});

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

app.get("/elements", (_, res) => {
  const elmentsNameAndRating = elements.map((elment) => ({ rating: elment.name, rating: elment.rating }));
  if (elmentsNameAndRating) {
    return res.status(200).json({ ok: true, elements: elmentsNameAndRating });
  }
  return res.status(500).json({ ok: false });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
