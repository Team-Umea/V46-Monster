import { renderIconWithNumber } from "../common/render";

class MonsterCard {
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

  monsterRank() {
    const rankP = document.createElement("p");
    let rank = "";
    const rankList = this.allMonsters.sort((a, b) => {
      const ratingA = a.health + a.damage;
      const ratingB = b.health + a.damage;
      return ratingA - ratingB;
    });

    if (rankList) {
      rank = rankList.indexOf(this.monster) + 1;
    }

    rankP.setAttribute("class", "monsterRank");
    rankP.innerText = rank;
    return rankP;
  }

  monsterStats() {
    const health = this.health;
    const damage = this.damage;
    const name = this.name;

    const healthIconValue = renderIconWithNumber(health, "../../res/icons/heart.svg", `${name} has ${health} of health`);
    const damageIconValue = renderIconWithNumber(health, "../../res/icons/heart.svg", `${name} has ${damage} of damage`);

    const statsContainer = document.createElement("ul");
    statsContainer.setAttribute("class", "monsterStats");
    statsContainer.appendChild(healthIconValue);
    statsContainer.appendChild(damageIconValue);

    return statsContainer;
  }

  monsterElements() {
    const elementsContainer = document.createElement("div");
    const elementList = document.createElement("ul");
    const elementHeader = document.createElement("h3");
    const elements = this.elements;

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
    const priceIconValue = renderIconWithNumber("iconContainer", "../../res/icons/diamond.svg", `${name} costs ${price} credits`);

    priceContainer.setAttribute("class", "monsterPriceContainer");
    priceHeader.setAttribute("class", "monsterPriceHeader");
    priceIconValue.classList.add("monsterPrice");

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
    const elements = this.elements();
    const price = this.price();
    const select = this.addToTeam();

    container.appendChild(name);
    container.appendChild(specs);
    container.appendChild(stats);
    container.appendChild(elements);
    container.appendChild(price);
    container.appendChild(select);
  }
}
