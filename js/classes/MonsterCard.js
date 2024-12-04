import { TEAMS_LSK } from "../common/localStorageKeys.js";
import { renderIconWithNumber } from "../common/render.js";
import { save } from "../common/utilities.js";

export class MonsterCard {
  constructor(monster, allMonsters, teams, hideSelect) {
    this.monster = monster;
    this.allMonsters = allMonsters;
    this.teams = teams;
    this.hideSelect = hideSelect;

    if (monster) {
      this.id = monster.id;
      this.name = monster.name;
      this.specs = monster.specs;
      this.health = monster.health;
      this.damage = monster.damage;
      this.elements = monster.elements;
      this.price = monster.price;
      this.rank = this.calcRank();
    }

    this.monsterCard = this.monsterContainer();
  }

  calcRank() {
    const id = this.monster.id;
    const allMonsters = this.allMonsters;

    const rankList = allMonsters.sort((a, b) => {
      const ratingA = a.monster.health + a.monster.damage;
      const ratingB = b.monster.health + a.monster.damage;

      const diff = ratingA - ratingB;
      const damage = diff === 0 ? a.monster.damage - b.monster.damage : diff;
      const health = damage === 0 ? a.monster.health - b.monster.health : damage;
      const name = health === 0 ? a.monster.name.localeCompare(b.monster.name) : health;

      return name;
    });

    const rank = rankList.indexOf(rankList.find((m) => m.monster.id === id));

    const descending = rankList.length - rank;
    return descending;
  }

  getRank() {
    const id = this.id;
    const rank = this.rank;
    const rankID = { id, rank };
    return rankID;
  }

  getMonsterCard() {
    return this.monsterCard;
  }

  monsterContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "monsterCard");

    const skeleton = document.createElement("div");
    skeleton.setAttribute("class", "monsterLoadingSkeleton");
    container.appendChild(skeleton);

    return container;
  }

  monsterImg() {
    const img = document.createElement("img");
    img.setAttribute("alt", "Monster img placeholder");
    img.setAttribute("class", "monsterImg");
    img.setAttribute("src", "../../res/img/monsterPlaceholder.webp");
    return img;
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
    const health = this.health;
    const damage = this.damage;
    const rank = this.rank;

    const healthIconValue = renderIconWithNumber(health, "../../res/icons/heart.svg", `${name} has ${health} of health`);
    const damageIconValue = renderIconWithNumber(damage, "../../res/icons/skull.svg", `${name} has ${damage} of damage`);
    let rankIconValue;

    statsContainer.setAttribute("class", "monsterStats");

    rankIconValue = renderIconWithNumber(rank, "../../res/icons/ribbon.svg", `${name} is ranked ${rank} of all monsters`);
    rankIconValue.classList.add("monsterRank");

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
    const priceIconValue = renderIconWithNumber(price, "../../res/icons/diamond.svg", `${name} costs ${price} credits`);
    priceIconValue.classList.add("monsterPrice");
    return priceIconValue;
  }

  monsterSelect() {
    const teamSelector = document.createElement("select");

    const teams = this.teams;
    const monster = this.monster;

    teamSelector.setAttribute("class", "monsterSelect");
    const firstOption = document.createElement("option");
    firstOption.innerText = "Add to Team";
    teamSelector.appendChild(firstOption);

    teams.forEach((team, index) => {
      const option = document.createElement("option");
      option.setAttribute("value", index);
      option.setAttribute("class", "monsterSelectOption");
      option.innerText = team.getTeamName();
      option.value = team.getTeamName();
      teamSelector.appendChild(option);
    });

    teamSelector.addEventListener("change", () => {
      const selectedOption = teamSelector.options[teamSelector.selectedIndex].value;
      const selectedTeam = teams.find((team) => selectedOption === team.getTeamName());

      selectedTeam.addMonsterToTeam(monster);
      save(TEAMS_LSK, teams);
    });

    return teamSelector;
  }

  assembleMonsterCard() {
    const container = this.monsterCard;
    container.innerHTML = "";

    const name = this.monsterName();
    const img = this.monsterImg();
    const specs = this.monsterSpecs();
    const stats = this.monsterStats();
    const elements = this.monsterElements();
    const price = this.monsterPrice();
    const select = this.monsterSelect();

    container.appendChild(name);
    container.appendChild(img);
    container.appendChild(specs);
    container.appendChild(stats);
    container.appendChild(elements);
    container.appendChild(price);
    if (select.children.length > 0 && this.hideSelect !== true) {
      container.appendChild(select);
    }
    return container;
  }
}
