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
  {
    path: "/generateTeam",
    desc: "Generates a random team of 4 monsters based on the specified level. Requires a query parameter 'level' (integer) to specify the monster level. Returns a JSON object with 'ok' status and an array of selected monster objects, or a 400 error if the level is missing or invalid, and a 400 error if there are not enough monsters available.",
  },
];

init();

function init() {
  // readJSON("./json/monsters.json", (err, data) => {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     monsters = data;
  //     prepareFight(monsters);
  //   }
  // });
  // readJSON("./json/elements.json", (err, data) => {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     elements = data;
  //   }
  // });
  readJSON("./monsters/nameSpecsID.json", (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      const loadedMonsters = data;
      const monstersWithHealhAndDamage = addHealthAndDamage(loadedMonsters, 20, 50, 300);
      console.log("Monsters Len: ", monstersWithHealhAndDamage.length);
      // const addID = loadedMonsters.map((monster, index) => ({ id: index, name: monster.name, specs: monster.specs }));
      // console.log("added id: ", addID);
      writeToJSONFile("./monsters/hpDamage.json", monstersWithHealhAndDamage);
    }
  });
}

function addHealthAndDamage(monstersFromDB, levels, maxD, maxH) {
  const numMonsters = monstersFromDB.length;

  let monstersWithHealhAndDamage = [];

  if (numMonsters % levels === 0) {
    const monstersPerLevel = numMonsters / levels;
    const maxDamage = maxD;
    const maxHP = maxH;
    const minDamage = 1;
    const minHP = 5;
    const rangeDamage = maxDamage / levels;
    const rangeHP = maxHP / levels;

    for (let i = 0; i < levels; i++) {
      let levelMinHp = rangeHP * i;
      let levelMinDamage = rangeDamage * i;
      let levelMaxHp = rangeHP * (i + 1);
      let levelMaxDamage = rangeDamage * (i + 1);

      if (i === 0) {
        levelMinHp = minHP;
        levelMinDamage = minDamage;
      }

      for (let j = 0; j < monstersPerLevel; j++) {
        const monsterIndex = i * monstersPerLevel + j;
        let monsterHealth;
        let monsterDamage;
        if (i !== 0 && i % 2 === 0) {
          monsterHealth = Math.ceil(Math.random() * (levelMaxHp - levelMinHp + 1) + levelMinHp);
          monsterDamage = Math.ceil(Math.random() * (levelMaxDamage - levelMinDamage + 1) + levelMinDamage);
        } else {
          monsterHealth = Math.ceil(Math.random() * (levelMaxHp - levelMinHp + 1) + levelMinHp);
          monsterDamage = Math.ceil(Math.random() * (levelMaxDamage - levelMinDamage + 1) + levelMinDamage);
        }
        const monster = monstersFromDB[monsterIndex];
        const monsterWithHealhAndDamage = { ...monster, health: monsterHealth, damage: monsterDamage };
        monstersWithHealhAndDamage.push(monsterWithHealhAndDamage);
      }
    }
    return monstersWithHealhAndDamage.sort((a, b) => a.id - b.id);
  }
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

function writeToJSONFile(path, data) {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("Data written to file successfully!");
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
  const elmentsNameAndRating = elements.map((elment) => ({ name: elment.name, rating: elment.rating }));
  if (elmentsNameAndRating) {
    const sortedByRating = elmentsNameAndRating.sort((a, b) => a.rating - b.rating);
    return res.status(200).json({ ok: true, elements: sortedByRating });
  }
  return res.status(500).json({ ok: false });
});

app.get("/generateTeam", (req, res) => {
  const level = req.query.level;

  const levels = [
    { min: 0, max: 10, level: 1 },
    { min: 11, max: 33, level: 2 },
    { min: 34, max: 55, level: 3 },
    { min: 56, max: 80, level: 4 },
    { min: 81, max: 100, level: 5 },
    { min: 101, max: 120, level: 6 },
    { min: 121, max: 140, level: 7 },
    { min: 141, max: 160, level: 8 },
    { min: 161, max: 180, level: 9 },
    { min: 181, max: 200, level: 10 },
  ];

  let requestedLevel = levels.find((l) => l.level === parseInt(level));

  if (!requestedLevel) {
    requestedLevel = { min: 0, max: 10, level: 1 };
  }

  const possibleFighters = monsters.filter((monster) => {
    const monsterRating = monster.health + monster.damage;
    return monsterRating <= requestedLevel.max && monsterRating >= requestedLevel.min;
  });

  if (possibleFighters.length >= 4) {
    const uniqueFighterIndexes = new Set();
    const team = [];

    while (team.length < 4) {
      const randomIndex = Math.floor(Math.random() * possibleFighters.length);

      if (!uniqueFighterIndexes.has(randomIndex)) {
        uniqueFighterIndexes.add(randomIndex);
        team.push(possibleFighters[randomIndex]);
      }
    }

    return res.status(200).json({ ok: true, team: team });
  }

  return res.status(400).json({ ok: false, message: "Not enough fighters available for the requested level." });
});

function prepareFight(monstersFromDB) {
  const team1IDs = ["1", "2", "3", "4"];
  const team2IDs = ["5", "6", "7", "8"];

  const team1 = [
    {
      name: "a1",
      health: 4,
      damage: 1,
    },
    {
      name: "a2",
      health: 5,
      damage: 1,
    },
    {
      name: "a3",
      health: 6,
      damage: 2,
    },
    {
      name: "a4",
      health: 5,
      damage: 3,
    },
  ];

  const team2 = [
    {
      name: "b1",
      health: 5,
      damage: 1,
    },
    {
      name: "b2",
      health: 7,
      damage: 1,
    },
    {
      name: "b3",
      health: 4,
      damage: 2,
    },
    {
      name: "b4",
      health: 6,
      damage: 2,
    },
  ];

  // const team1 = monstersFromDB.filter((monster) => team1IDs.includes(monster.id.toString()));
  // const team2 = monstersFromDB.filter((monster) => team2IDs.includes(monster.id.toString()));

  let team1Points = 0;
  let team2Points = 0;

  //fights[] => rounds[] => round{}

  let fights = [];

  if (team1 && team1.length === 4 && team2 && team2.length === 4) {
    const team1TotalRating = team1.reduce((acc, curr) => acc + (curr.health + curr.damage), 0);
    const team2TotalRating = team2.reduce((acc, curr) => acc + (curr.health + curr.damage), 0);

    let startTeam = team1TotalRating < team2TotalRating ? team1 : team2TotalRating < team1TotalRating ? team2 : "Random";

    if (startTeam === "Random") {
      let random = Math.floor(Math.random() * 2);
      if (random === 0) {
        startTeam = team1;
      } else {
        startTeam = team2;
      }
    }

    console.log("Start Team: ", startTeam);
    console.log();
    console.log("Total rating team 1", team1TotalRating);
    console.log("Total rating team 2", team2TotalRating);
    console.log();

    team1.forEach((fighterTeam1, index) => {
      const fighterTeam2 = team2[index];

      const currentFight = fights.length + 1;

      let rounds = [];
      let fighter1Health = fighterTeam1.health;
      let fighter2Health = fighterTeam2.health;

      const fighter1Name = fighterTeam1.name;
      const fighter2Name = fighterTeam2.name;

      do {
        //fight
        const currentRound = rounds.length + 1;
        const fighter1StartHealth = fighter1Health;
        const fighter2StartHealth = fighter2Health;

        const fighter1Stats = [fighter1Health];
        const fighter2Stats = [fighter2Health];

        if (startTeam === team1) {
          fighterTeam2.health -= fighterTeam1.damage;
          fighter2Health = fighterTeam2.health;
          fighter2Stats.push(fighter2Health);
          if (fighter2Health.health <= 0) {
            break;
          }
          fighterTeam1.health -= fighterTeam2.damage;
          fighter1Health.health = fighterTeam1.health;
          fighter1Stats.push(fighter1Health);
        } else {
          fighterTeam1.health -= fighterTeam2.damage;
          fighter1Health.health = fighterTeam1.health;
          if (fighter1Health.health <= 0) {
            break;
          }
          fighterTeam2.health -= fighterTeam1.damage;
          fighter2Health = fighterTeam2.health;
        }

        fighter1Stats.push(fighterTeam2.damage);
        fighter1Stats.push(fighterTeam1.damage);

        fighter2Stats.push(fighterTeam1.damage);
        fighter2Stats.push(fighterTeam2.damage);

        const round = {
          Round: currentRound,
          "Figther 1": {
            "Start HP": fighter1Stats[0],
            "Remaining HP": fighter1Stats[1],
            "Suffered damage": fighter1Stats[2],
            "Distributed damage": fighter1Stats[3],
          },
          "Figther 2": {
            "Start HP": fighter1Stats[1],
            "Remaining HP": fighter1Stats[2],
            "Suffered damage": fighter1Stats[3],
            "Distributed damage": fighter1Stats[4],
          },
        };

        rounds.push(round);
      } while (fighter1Health > 0 && fighter2Health > 0);

      fights.push({ fight: currentFight, rounds: rounds, fighter1: fighter1Name, fighter2: fighter2Name });

      // const winner = fight(fighterTeam1, fighterTeam2);

      // if (winner === "1") {
      //   team1Points++;
      // } else if (winner === "2") {
      //   team2Points++;
      // }
    });
    // console.log("Fights: ", fights);
  }

  // console.log("Team 1 points: ", team1Points);
  // console.log("Team 2 points: ", team2Points);

  // console.log("Team 1: ", team1);
  // console.log("Team 2: ", team2);
  console.log("Figths: ", fights);
}

function fight(monster1, monster2) {
  const monster1Damage = monster1.damage;
  const monster2Damage = monster2.damage;

  let damagedHealthMonster1 = monster1.health - monster2Damage;
  let damagedHealthMonster2 = monster2.health - monster1Damage;

  monster1.health = damagedHealthMonster1;
  monster2.health = damagedHealthMonster2;

  if (monster1.health < 0) {
    monster1.health = 0;
  }

  if (monster2.health < 0) {
    monster2.health = 0;
  }

  const winner = monster1.health > monster2.health ? "1" : monster2.health > monster1.health ? "2" : null;
  return winner;
}

app.get("/fight", (req, res) => {
  const team1IDs = req.query.team1;
  const team2IDs = req.query.team2;

  const team1 = monsters.filter((monster) => team1IDs.includes(monster.id.toString()));
  const team2 = monsters.filter((monster) => team2IDs.includes(monster.id.toString()));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
