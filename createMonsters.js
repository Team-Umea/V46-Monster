readJSON("./monsters/nameSpecsID.json", (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    const loadedMonsters = data;
    readJSON("./json/elements.json", (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        const loadedElements = data;
        const monstersWithHealhAndDamage = addDynamicStats(loadedMonsters, 50, 300, loadedElements);
        writeToJSONFile("./monsters/hpDamage.json", monstersWithHealhAndDamage);
      }
    });
  }
});

function addDynamicStats(monstersFromDB, maxD, maxH, elementsFromDB) {
  const numMonsters = monstersFromDB.length;
  const levels = 20;

  const prices = [0, 100, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000];

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
        const elements = addElements(elementsFromDB, i);
        const price = prices[i];
        const monsterWithHealhAndDamage = { ...monster, health: monsterHealth, damage: monsterDamage, elements: elements, price: price };
        monstersWithHealhAndDamage.push(monsterWithHealhAndDamage);
      }
    }
    return monstersWithHealhAndDamage.sort((a, b) => a.id - b.id);
  }
}

function addElements(elements, level) {
  const mappedRatings = [
    { minLevel: 0, maxLevel: 4, elementRating: 33 },
    { minLevel: 5, maxLevel: 9, elementRating: 50 },
    { minLevel: 10, maxLevel: 13, elementRating: 67 },
    { minLevel: 14, maxLevel: 16, elementRating: 150 },
    { minLevel: 17, maxLevel: 18, elementRating: 200 },
    { minLevel: 19, maxLevel: 20, elementRating: 300 },
  ];

  const monsterElements = [];

  let monsterElementRatings = mappedRatings
    .filter((rating) => {
      return level >= rating.minLevel;
    })
    .map((rating) => rating.elementRating);

  if (monsterElementRatings.length >= 3) {
    monsterElementRatings = monsterElementRatings.slice(-3);
  }

  const possibleElements = elements.filter((element) => monsterElementRatings.includes(element.rating));

  const minNumElements = mappedRatings.indexOf(mappedRatings.find((r) => r.elementRating === monsterElementRatings[0])) + 1;
  const rangeNumElements = minNumElements + mappedRatings.indexOf(mappedRatings.find((r) => r.elementRating === monsterElementRatings[0])) + 1;
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
  return monsterElements.map((element) => element.name).sort((a, b) => a.localeCompare(b));
}
