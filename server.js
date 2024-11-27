const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

let monsters = [];
let elements = [];
let abilities = [];

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
    path: "/abilities",
    desc: "Returns a list of abilities. No parameters needed. Returns a JSON object with 'ok' status and an array of ability objects, or a 500 error if there are no abilities available.",
  },
  {
    path: "/generateTeam",
    desc: "Generates a random team of 4 monsters based on the specified level. Requires a query parameter 'level' (integer) to specify the monster level. Returns a JSON object with 'ok' status and an array of selected monster objects, or a 400 error if the level is missing or invalid, and a 400 error if there are not enough monsters available.",
  },
  {
    path: "/fight",
    desc: "Initiates a battle between two teams of monsters. Requires query parameters 'team1' and 'team2' (comma-separated monster IDs for each team). Returns a JSON object with 'ok' status and the battle result, or a 400 error if the teams are invalid or missing.",
  },
];

init();

function init() {
  readJSON("./monsters/monsters.json", (err, data) => {
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
    }
  });
  readJSON("./json/abilities.json", (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      abilities = data;
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

app.get("/abilities", (_, req) => {
  if (abilities) {
    return res.status(200).json({ ok: true, abilities: abilities });
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

function fight(team1, team2, team1IDs, team2IDs) {
  let team1FighterNames;
  let team2FighterNames;
  let team1Points = 0;
  let team2Points = 0;

  const combindedFigthers = [...team1IDs, ...team2IDs].sort((a, b) => Number(a) - Number(b)).join("/");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const date = `${year}:${month}:${day}:${hour}:${minute}:${seconds}`;
  const battleID = `${date}@${combindedFigthers}`;

  const battle = [];
  const teamStats = {};
  const remainingHP = {};

  if (team1 && team1.length === 4 && team2 && team2.length === 4) {
    const team1TotalRating = team1.reduce((acc, curr) => acc + (curr.health + curr.damage), 0);
    const team2TotalRating = team2.reduce((acc, curr) => acc + (curr.health + curr.damage), 0);

    const team1Stats = getTeamStats(team1, team1TotalRating);
    const team2Stats = getTeamStats(team2, team2TotalRating);

    teamStats["team1"] = team1Stats;
    teamStats["team2"] = team2Stats;

    team1FighterNames = team1.map((fighter) => fighter.name);
    team2FighterNames = team2.map((fighter) => fighter.name);

    let startTeam = team1TotalRating < team2TotalRating ? team1 : team2TotalRating < team1TotalRating ? team2 : "Random";

    if (startTeam === "Random") {
      let random = Math.floor(Math.random() * 2);
      if (random === 0) {
        startTeam = team1;
      } else {
        startTeam = team2;
      }
    }

    team1.forEach((fighter, index) => {
      const fighterTeam1 = fighter;
      const fighterTeam2 = team2[index];
      const fighter1Name = fighterTeam1.name;
      const fighter2Name = fighterTeam2.name;

      let fighter1Health = fighterTeam1.health;
      let fighter2Health = fighterTeam2.health;

      const currentFight = battle.length + 1;
      let rounds = [];

      do {
        const currentRound = rounds.length + 1;

        const fighter1Stats = [fighter1Health];
        const fighter2Stats = [fighter2Health];

        const fighter1Damage = fighterTeam1.damage;
        const fighter2Damage = fighterTeam2.damage;

        let totalDamageFigther1 = fighter1Damage;
        let totalDamageFigther2 = fighter2Damage;

        if (startTeam === team1) {
          fighter2Health -= totalDamageFigther1;
          fighter2Stats.push(fighter2Health);

          if (fighter2Health <= 0) {
            break;
          }

          fighter1Health -= totalDamageFigther2;
          fighter1Stats.push(fighter1Health);
        } else {
          fighter1Health -= totalDamageFigther2;
          fighter1Stats.push(fighter1Health);

          if (fighter1Health <= 0) {
            break;
          }

          fighter2Health -= totalDamageFigther1;
          fighter2Stats.push(fighter2Health);
        }

        fighter1Stats.push(totalDamageFigther2);
        fighter1Stats.push(totalDamageFigther1);

        fighter2Stats.push(totalDamageFigther1);
        fighter2Stats.push(totalDamageFigther2);

        const roundWinner = fighter1Health > fighter2Health ? "1" : fighter2Health > fighter1Health ? "2" : "0";

        const roundWinnerByTeam = roundWinner === "1" ? team1FighterNames : roundWinner === "2" ? team2FighterNames : "Draw";
        const roundWinnerByFighterName = roundWinner === "1" ? fighter1Name : roundWinner === "2" ? fighter2Name : "Draw";

        const round = {
          round: currentRound,
          wonBy: {
            team: roundWinnerByTeam,
            fighter: roundWinnerByFighterName,
          },
          figther1: {
            name: fighter1Name,
            startHP: fighter1Stats[0],
            remainingHP: fighter1Stats[1] >= 0 ? fighter1Stats[1] : 0,
            sufferedDamage: fighter1Stats[2],
            distributedDamage: fighter1Stats[3],
          },
          figther2: {
            name: fighter2Name,
            startHP: fighter2Stats[0],
            remainingHP: fighter2Stats[1] >= 0 ? fighter2Stats[1] : 0,
            sufferedDamage: fighter2Stats[2],
            distributedDamage: fighter2Stats[3],
          },
        };

        rounds.push(round);
      } while (fighter1Health > 0 && fighter2Health > 0);

      let fightWinners;
      const team1Rounds = rounds.filter((round) => round.wonBy.team === team1FighterNames).length;
      const team2Rounds = rounds.filter((round) => round.wonBy.team === team2FighterNames).length;

      if (team1Rounds > team2Rounds) {
        team1Points++;
        fightWinners = team1FighterNames;
        if (fighterTeam2.health > 0) {
          fighterTeam2.health--;
        }
      } else if (team2Rounds > team1Rounds) {
        team2Points++;
        fightWinners = team2FighterNames;
        if (fighterTeam1.health > 0) {
          fighterTeam1.health--;
        }
      } else {
        fightWinners = "Draw";
      }

      battle.push({ fight: currentFight, fighter1: fighter1Name, fighter2: fighter2Name, wonBy: fightWinners, rounds: rounds });
    });
  }

  let battleWinners = null;
  let teamWon = null;

  const team1RemainingHp = getRemainingHealth(team1);
  const team2RemainingHp = getRemainingHealth(team2);

  remainingHP["team1"] = team1RemainingHp;
  remainingHP["team2"] = team2RemainingHp;

  if (team1FighterNames && team2FighterNames) {
    if (team1Points > team2Points) {
      battleWinners = team1FighterNames;
      teamWon = "Team 1";
    } else if (team2Points > team1Points) {
      battleWinners = team2FighterNames;
      teamWon = "Team 2";
    } else {
      battleWinners = "Draw";
      teamWon = "Draw";
    }
  }

  return { battleID: battleID, battleWinners: battleWinners, teamWon: teamWon, team1Points: team1Points, team2Points: team2Points, teamStats: teamStats, remainingHP, remainingHP, battle: battle };
}

function getTeamStats(team, teamRating) {
  const teamPrice = team.reduce((acc, curr) => acc + curr.price, 0);
  const teamElements = team.map((monster) => monster.elements);
  const cleanedTeamElements = teamElements.filter((element, index, self) => self.indexOf(element) === index).flat();
  const cleanedTeamElementsObjects = elements.filter((element) => cleanedTeamElements.includes(element.name));
  const cleanedTeamElementRatings = cleanedTeamElementsObjects.reduce((acc, curr) => acc + curr.rating, 0);

  const monsterStats = team.map((fighter) => {
    const rating = fighter.health + fighter.damage;
    const rank =
      monsters
        .sort((a, b) => {
          const monsterRatingA = a.health + a.damage;
          const monsterRatingB = b.health + b.damage;
          return monsterRatingA - monsterRatingB;
        })
        .indexOf(fighter) + 1;
    return { ...fighter, rating, rank };
  });

  const sortedByRank = monsterStats.sort((a, b) => b.rank - a.rank);

  return {
    teamRating,
    teamPrice,
    teamElements: cleanedTeamElements,
    teamElementRastings: cleanedTeamElementRatings,
    monsterStats: sortedByRank,
  };
}

function getRemainingHealth(team) {
  const fighters = {};
  team.forEach((fighter) => {
    const name = fighter.name;
    const id = fighter.id;
    const hp = fighter.health;
    fighters[name] = {
      id,
      hp,
    };
  });
  return fighters;
}

app.get("/fight", (req, res) => {
  const team1IDs = req.query.team1;
  const team2IDs = req.query.team2;

  if (team1IDs && team2IDs) {
    const fightersTeam1 = team1IDs.split(",");
    const fightersTeam2 = team2IDs.split(",");
    if (fightersTeam1.length === 4 && fightersTeam2.length === 4) {
      const team1 = monsters.filter((monster) => fightersTeam1.includes(monster.id.toString()));
      const team2 = monsters.filter((monster) => fightersTeam2.includes(monster.id.toString()));
      const battle = fight(team1, team2, fightersTeam1, fightersTeam2);
      return res.status(200).json({ ok: true, battle: battle });
    }
    return res.status(400).json({ ok: false, message: "Invalid teams" });
  }
  return res.status(400).json({ ok: false, message: "Teams params is missing" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
