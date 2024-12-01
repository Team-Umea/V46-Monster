import { renderIconWithNumber } from "../common/render.js";

export class MonsterCard {
  constructor(monster, allMonsters, teams) {
    this.monster = monster;
    this.allMonsters = allMonsters;
    this.teams = teams;

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
    this.skeleton = this.monsterLoadingSkeleton();
  }

  setValues(monster, allMonsters, teams) {
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

  monsterContainer() {
    const id = this.id;
    const container = document.createElement("div");
    container.setAttribute("class", "monsterCard");
    container.setAttribute("id", id);
    return container;
  }

  monsterLoadingSkeleton() {
    const container = document.createElement("div");
    container.setAttribute("class", "monsterLoadingSkeleton");
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

    // const rankList = allMonsters.sort((a, b) => {
    //   const ratingA = a.monster.health + a.monster.damage;
    //   const ratingB = b.monster.health + a.monster.damage;

    //   const diff = ratingA - ratingB;
    //   const damage = diff === 0 ? a.monster.damage - b.monster.damage : diff;
    //   const health = damage === 0 ? a.monster.health - b.monster.health : damage;

    //   return health;
    //   // return diff === 0 ? b.monster.name.localeCompare(a.monster.name) : diff;
    // });

    // if (rankList) {
    //   const rank = rankList.indexOf(rankList.find((m) => m.monster.id === id));
    //   const descending = rankList.length - rank;
    //   const controlledRank = descending > 0 ? descending : "";
    rankIconValue = renderIconWithNumber(rank, "../../res/icons/trophy.svg", `${name} is ranked ${rank} of all monsters`);
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
    const container = this.monsterCard;
    container.innerHTML = "";

    const name = this.monsterName();
    const img = this.monsterImg();
    const specs = this.monsterSpecs();
    const stats = this.monsterStats();
    const elements = this.monsterElements();
    const price = this.monsterPrice();
    const select = this.addToTeam();

    this.skeleton.remove();

    container.appendChild(name);
    container.appendChild(img);
    container.appendChild(specs);
    container.appendChild(stats);
    container.appendChild(elements);
    container.appendChild(price);
    container.appendChild(select);
    return container;
  }

  getLoadingSkeletion() {
    const skeleton = this.skeleton;
    const container = this.monsterCard;
    container.appendChild(skeleton);
    return container;
  }
}
