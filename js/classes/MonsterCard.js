import { renderIconWithNumber } from "../common/render.js";

export class MonsterCard {
  constructor(monster, allMonsters, teams) {
    this.monster = monster;
    this.allMonsters = allMonsters;
    this.teams = teams;

    this.name = monster.name;
    this.specs = monster.specs;
    this.health = monster.health;
    this.damage = monster.damage;
    this.elements = monster.elements;
    this.price = monster.price;
  }

  monsterContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "monsterCard");
    return container;
  }

  monsterName() {
    const nameH2 = document.createElement("h2");
    const name = this.name;
    nameH2.setAttribute("class", "monsterName");
    nameH2.innerText = name;
    return nameH2;
  }

  monsterSpecs() {
    const specsP = document.createElement("p");
    const specs = this.specs;
    specsP.setAttribute("class", "monsterSpecs");
    specsP.innerText = specs;
    return specsP;
  }

  monsterStats() {
    const statsContainer = document.createElement("ul");

    const name = this.name;
    const monster = this.monster;
    const health = this.health;
    const damage = this.damage;

    const healthIconValue = renderIconWithNumber(health, "../../res/icons/heart.svg", `${name} has ${health} of health`);
    const damageIconValue = renderIconWithNumber(damage, "../../res/icons/skull.svg", `${name} has ${damage} of damage`);
    let rankIconValue;

    statsContainer.setAttribute("class", "monsterStats");

    const rankList = this.allMonsters.sort((a, b) => {
      const ratingA = a.health + a.damage;
      const ratingB = b.health + a.damage;
      return ratingA - ratingB;
    });

    if (rankList) {
      const rank = rankList.indexOf(monster) + 1;
      const controlledRank = rank > 0 ? rank : "";
      rankIconValue = renderIconWithNumber(controlledRank, "../../res/icons/trophy.svg", `${name} is ranked ${rank} of all monsters`);
      rankIconValue.classList.add("monsterRank");
    }

    statsContainer.appendChild(healthIconValue);
    if (rankIconValue) {
      statsContainer.appendChild(rankIconValue);
    }
    statsContainer.appendChild(damageIconValue);

    return statsContainer;
  }

  monsterElements() {
    const elementsContainer = document.createElement("div");
    const elementList = document.createElement("ul");
    const elementHeader = document.createElement("h3");
    const elements = this.elements;

    elementsContainer.setAttribute("class", "monsterElements");
    elementHeader.setAttribute("class", "elementHeader");
    elementList.setAttribute("class", "elementList");

    elementHeader.innerText = elements.length === 1 ? "Element" : "Elements";

    elements.forEach((element) => {
      const elementP = document.createElement("p");
      elementP.setAttribute("class", "monsterElement");
      elementP.innerText = element;
      elementList.appendChild(elementP);
    });

    elementsContainer.appendChild(elementHeader);
    elementsContainer.appendChild(elementList);

    return elementsContainer;
  }

  monsterPrice() {
    const price = this.price;
    const name = this.name;
    const priceContainer = document.createElement("div");
    const priceHeader = document.createElement("h2");
    const priceIconValue = renderIconWithNumber(price, "../../res/icons/diamond.svg", `${name} costs ${price} credits`);

    priceContainer.setAttribute("class", "monsterPriceContainer");
    priceHeader.setAttribute("class", "monsterPriceHeader");
    priceIconValue.classList.add("monsterPrice");

    priceHeader.innerText = "Price";

    priceContainer.appendChild(priceHeader);
    priceContainer.appendChild(priceIconValue);

    return priceContainer;
  }

  addToTeam() {
    const teamSelector = document.createElement("select");

    teamSelector.setAttribute("class", "monsterSelect");

    this.teams.forEach((team, index) => {
      const option = document.createElement("option");
      option.setAttribute("value", index);
      option.setAttribute("class", "monsterSelectOption");
      if (index === 0) {
        option.innerText = "Add to team";
      } else {
        option.innerText = team;
      }
      teamSelector.appendChild(option);
    });

    return teamSelector;
  }

  assembleMonsterCard() {
    const container = this.monsterContainer();
    const name = this.monsterName();
    const specs = this.monsterSpecs();
    const stats = this.monsterStats();
    const elements = this.monsterElements();
    const price = this.monsterPrice();
    const select = this.addToTeam();

    container.appendChild(name);
    container.appendChild(specs);
    container.appendChild(stats);
    container.appendChild(elements);
    container.appendChild(price);
    container.appendChild(select);
    return container;
  }
}
