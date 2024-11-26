let monsters = {};

function addPriceAndElementToMonster() {
  readJSON("./json/newMonsters.json", (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      const monstersFromDB = data;
      monsters = addPriceTags(monstersFromDB);
      readJSON("./json/elements.json", (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
          const elements = data;
          monsters = addElements(monsters, elements);
          writeToJSONFile("./json/monsters.json", monsters);
        }
      });
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

function addElements(monstersFromDB, elements) {
  const mappedRatings = [
    { monsterMin: 0, monsterMax: 38, elementRating: 33 },
    { monsterMin: 39, monsterMax: 74, elementRating: 50 },
    { monsterMin: 75, monsterMax: 105, elementRating: 67 },
    { monsterMin: 106, monsterMax: 130, elementRating: 150 },
    { monsterMin: 131, monsterMax: 157, elementRating: 200 },
    { monsterMin: 158, monsterMax: 200, elementRating: 300 },
  ];

  const monstersWithElements = monstersFromDB.map((monster) => {
    const monsterElements = [];
    const monsterRating = monster.health + monster.damage;
    const monsterElementRating = mappedRatings.find((rating) => {
      return monsterRating <= rating.monsterMax && monsterRating >= rating.monsterMin;
    }).elementRating;

    const possibleElements = elements.filter((element) => element.rating === monsterElementRating);

    const minNumElements = mappedRatings.indexOf(mappedRatings.find((r) => r.elementRating === monsterElementRating)) + 1;
    const rangeNumElements = minNumElements + mappedRatings.indexOf(mappedRatings.find((r) => r.elementRating === monsterElementRating)) + 1;
    let numElements = Math.floor(Math.random() * rangeNumElements + minNumElements);
    if (numElements >= possibleElements.length) {
      numElements = possibleElements.length;
    }

    let uniqueElementIndexes = new Set();

    for (let i = 0; i < numElements; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * possibleElements.length);
      } while (uniqueElementIndexes.has(randomIndex));
      uniqueElementIndexes.add(randomIndex);
      monsterElements.push(possibleElements[randomIndex]);
    }
    const newMonster = { ...monster, elements: monsterElements };
    return newMonster;
  });
  return monstersWithElements;
}

function createElements(elmentsName, abilities) {
  const elements = [];
  elmentsName.forEach((elmentName) => {
    const name = elmentName;
    const strongAgainst = [];
    const weakAgainst = [];
    let rating = 0;

    const possibleNumStrengths = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    const possibleNumWeaknesses = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];

    const numStrengths = possibleNumStrengths[Math.floor(Math.random() * possibleNumStrengths.length)];
    const numWeaknesses = possibleNumWeaknesses[Math.floor(Math.random() * possibleNumWeaknesses.length)];

    const uniqueStrengthIndexes = new Set();
    const uniqueWeaknessIndexes = new Set();

    for (let i = 0; i < numStrengths; i++) {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * abilities.length);
      } while (uniqueStrengthIndexes.has(randomIndex));

      uniqueStrengthIndexes.add(randomIndex);
      strongAgainst.push(abilities[randomIndex]);
    }

    for (let i = 0; i < numWeaknesses; i++) {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * abilities.length);
      } while (uniqueWeaknessIndexes.has(randomIndex));

      uniqueWeaknessIndexes.add(randomIndex);
      weakAgainst.push(abilities[randomIndex]);
    }

    rating = (strongAgainst.length / weakAgainst.length).toFixed(2) * 100;

    const element = {
      name: elmentName,
      strongAgainst: strongAgainst,
      weakAgainst: weakAgainst,
      rating: rating,
    };
    elements.push(element);
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
