import { TEAMS_LSK } from "../common/localStorageKeys.js";
import { renderIconWithNumber } from "../common/render.js";
import { save } from "../common/utilities.js";

export class MonsterCard {
  constructor(monster, teams, hideSelect) {
    this.monster = monster;
    this.teams = teams;
    this.hideSelect = hideSelect;

    if (monster) {
      this.id = monster.id;
      this.name = monster.name;
      this.specs = monster.specs;
      this.health = monster.health;
      this.damage = monster.damage;
      this.rank = monster.rank;
      this.elements = monster.elements;
      this.price = monster.price;
      this.imagePath = `https://ozzodevmonsterapi.azurewebsites.net${monster.img}`;
    }

    this.monsterCard = this.monsterContainer();
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
    const img = document.createElement("div");
    const src = this.imagePath;
    // img.setAttribute("alt", "Monster img placeholder");
    img.setAttribute("class", "monsterImg");
    // img.setAttribute("src", src);
    img.style.backgroundImage = `url(${src})`;

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
    const damageIconValue = renderIconWithNumber(damage, "../../res/icons/barbell.svg", `${name} has ${damage} of damage`);
    const rankIconValue = renderIconWithNumber(rank, "../../res/icons/ribbon.svg", `${name} is ranked ${rank} of all monsters`);

    statsContainer.setAttribute("class", "monsterStats");

    statsContainer.appendChild(healthIconValue);
    statsContainer.appendChild(rankIconValue);
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

  getImage() {
    const monsterImage = document.createElement("div");
    const src = this.imagePath;

    monsterImage.setAttribute("class", "monsterImage");
    monsterImage.style.backgroundImage = `url(${src})`;
    return monsterImage;
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
    img.appendChild(price);
    container.appendChild(img);
    container.appendChild(specs);
    container.appendChild(stats);
    // container.appendChild(elements);
    // container.appendChild(price);
    if (select.children.length > 0 && this.hideSelect !== true) {
      container.appendChild(select);
    }
    return container;
  }
}
