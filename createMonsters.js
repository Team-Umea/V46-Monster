readJSON("./monsters/monsterNames.json", (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    const nameData = data;

    readJSON("./monsters/specs.json", (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        const specsData = data;

        readJSON("./json/elements.json", (err, data) => {
          if (err) {
            console.log("Error", err);
          } else {
            const elementData = data;
            const monsters = generateMonsters(1000, nameData, specsData, elementData);

            writeToJSONFile("./monsters/monsters.json", monsters);
          }
        });
      }
    });
  }
});

function generateMonsters(num, nameData, specsData, elementData) {
  let monsters = [];

  const ids = generateIDs(num);
  const names = generateNames(num, nameData);
  const specss = generateSpecs(num, specsData);

  const maxLevel = findMaxLevel(num);

  for (let i = 0; i < num; i++) {
    const id = ids[i];
    const name = names[i];
    const specs = specss[i];
    const monster = { id, name, specs };
    monsters.push(monster);
  }

  const completeMonsters = assignDynamicStats(maxLevel, monsters, elementData);

  return completeMonsters;
}

function assignDynamicStats(maxLevel, monsters, elementData) {
  const num = monsters.length;
  const stats = [];
  const monsterPerLevel = num / maxLevel;

  const minHP = 5;
  const minDamage = 1;
  const minPrice = 0;
  const minElements = 1;

  const rangeHp = 10;
  const rangeDamage = 2;
  const rangePrice = 2500;
  const rangeElements = 2;

  const steps = [maxLevel * 0.1, maxLevel * 0.25, maxLevel * 0.4, maxLevel * 0.55, maxLevel * 0.6, maxLevel * 0.75, maxLevel * 0.9];
  const elementDataRatings = elementData.map((element) => element.rating);
  const elementRatings = elementDataRatings.filter((element, index) => elementDataRatings.indexOf(element) === index).sort((a, b) => a - b);

  let pricePercentage = 1.2;

  for (let i = 0; i < maxLevel; i++) {
    let currentStats = [];
    let currentElements = elementData.filter((element) => element.rating === elementRatings[0]);
    let currentMinHp;
    let currentMinDamage;
    let currentMinPrice;
    let currentMinElements = minElements;

    let currentRangeHp;
    let currentRangeDamage;
    let currentRangeElements = rangeElements;

    if (i === 0) {
      currentMinHp = minHP;
      currentMinDamage = minDamage;
      currentMinPrice = minPrice;

      currentRangeHp = rangeHp;
      currentRangeDamage = rangeDamage;
    } else {
      currentMinHp = minHP + rangeHp * i;
      currentMinDamage = minDamage + rangeDamage * i;
      currentMinPrice = minPrice + rangePrice * pricePercentage * i;

      currentRangeHp = currentMinHp + rangeHp;
      currentRangeDamage = currentMinDamage + rangeDamage;
      pricePercentage *= 1.1;
    }

    let price = roundPrice(currentMinPrice);

    const progess = steps.filter((step) => step <= i);
    if (progess.length > 0) {
      const highestProgess = progess[progess.length - 1];
      const index = steps.indexOf(highestProgess);

      currentElements = elementData.filter((element) => element.rating <= elementRatings[index]);

      currentMinElements = index + 2;

      if (index > steps.length / 2) {
        currentRangeElements = currentMinElements + 3;
      } else {
        currentRangeElements = currentMinElements + 3;
      }
    }

    for (let j = 0; j < monsterPerLevel; j++) {
      let health = Math.floor(Math.random() * currentRangeHp + currentMinHp);
      let damage = Math.floor(Math.random() * currentRangeDamage + currentMinDamage);

      let numElements = Math.floor(Math.random() * currentRangeElements + currentMinElements);
      if (numElements > 12) {
        numElements = 12;
      }
      const elements = [];
      const uniqueElementIndexes = new Set();

      for (let i = 0; i < numElements; i++) {
        let randomIndex;

        do {
          randomIndex = Math.floor(Math.random() * currentElements.length);
        } while (uniqueElementIndexes.has(randomIndex));

        uniqueElementIndexes.add(randomIndex);

        const element = currentElements[randomIndex].name;

        elements.push(element);
      }

      const stats = { health, damage, price, elements };
      currentStats.push(stats);
    }

    const sortedByRating = [...currentStats].sort((a, b) => {
      const ratingA = a.health + a.damage;
      const ratingB = b.health + b.damage;
      return ratingA - ratingB;
    });

    stats.push(sortedByRating);
  }

  const cleanedStats = stats.flat();

  const updatedMonsters = [...monsters].map((monster, index) => {
    const health = cleanedStats[index].health;
    const damage = cleanedStats[index].damage;
    const price = cleanedStats[index].price;
    const elements = cleanedStats[index].elements;
    return { ...monster, health, damage, price, elements };
  });

  return updatedMonsters;
}

function roundPrice(price) {
  if (price > 0) {
    if (price <= 5000) {
      return Math.round(price / 500) * 500;
    } else if (price <= 10000) {
      return Math.round(price / 1000) * 1000;
    } else if (price <= 50000) {
      return Math.round(price / 5000) * 5000;
    } else if (price <= 100000) {
      return Math.round(price / 10000) * 10000;
    } else if (price <= 1000000) {
      return Math.round(price / 50000) * 50000;
    } else {
      return Math.round(price / 500000) * 500000;
    }
  } else {
    return price;
  }
}

function findMaxLevel(num) {
  let maxLevel;

  for (let i = 1; i < num; i++) {
    const quota = num / i;
    if (i > quota) {
      while (num % i !== 0) {
        i++;
      }
      maxLevel = i;
      break;
    }
  }
  return maxLevel;
}

function generateSpecs(num, specsData) {
  const entity = specsData.entity;
  const origin = specsData.origin;
  const condition = specsData.condition;
  const action = specsData.action;
  const outcome = specsData.outcome;

  const specs = new Set();

  for (let i = 0; i < num; i++) {
    let entityInd;
    let originInd;
    let conditionInd;
    let actionInd;
    let outcomeInd;

    let spec;

    do {
      entityInd = Math.floor(Math.random() * entity.length);
      originInd = Math.floor(Math.random() * origin.length);
      conditionInd = Math.floor(Math.random() * condition.length);
      actionInd = Math.floor(Math.random() * action.length);
      outcomeInd = Math.floor(Math.random() * outcome.length);

      spec = `${entity[entityInd]} ${origin[originInd]} ${condition[conditionInd]} ${action[actionInd]} ${outcome[outcomeInd]}`;
    } while (specs.has(spec));

    specs.add(spec);
  }

  return Array.from(specs);
}

function generateIDs(num) {
  const ids = [];
  for (let i = 0; i < num; i++) {
    ids.push(i);
  }
  return ids;
}

function generateNames(num, nameData) {
  const pre = nameData.pre;
  const suf = nameData.suf;
  const names = new Set();

  for (let i = 0; i < num; i++) {
    let preInd;
    let sufInd;
    let name;

    do {
      preInd = Math.floor(Math.random() * pre.length);
      sufInd = Math.floor(Math.random() * suf.length);

      const preName = capitalize(pre[preInd]);
      const sufName = capitalize(suf[sufInd]);

      name = `${preName} ${sufName}`;
    } while (names.has(name));

    names.add(name);
  }

  return Array.from(names);
}

function findDuplicates(arr) {
  return arr.filter((item, index, self) => self.indexOf(item) !== index);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
