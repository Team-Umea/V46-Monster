import { TEAMS_LSK } from "../common/localStorageKeys.js";
import { renderIconWithNumber } from "../common/render.js";
import { save, loadTeams } from "../common/utilities.js";

export class MonsterCard {
  constructor(monster, setSelectMessage, hideSelect) {
    this.monster = monster;
    this.teams = loadTeams();
    this.hideSelect = hideSelect;
    this.setSelectMessage = setSelectMessage;

    this.tempMonsters = [];

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
    const skeleton = document.createElement("div");

    container.setAttribute("class", "monsterCard");
    skeleton.setAttribute("class", "monsterLoadingSkeleton");

    container.appendChild(skeleton);

    return container;
  }

  monsterImg() {
    const img = document.createElement("div");
    const src = this.imagePath;
    img.setAttribute("class", "monsterImg");
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
    const monster = this.monster;
    let teams = loadTeams();
    const availableTeams = teams.filter((team) => team.monsters.length < 4);

    teamSelector.setAttribute("class", "monsterSelect");
    const firstOption = document.createElement("option");
    firstOption.innerText = "Add to Team";
    teamSelector.appendChild(firstOption);

    availableTeams.forEach((team, index) => {
      const option = document.createElement("option");
      option.setAttribute("value", index);
      option.setAttribute("class", "monsterSelectOption");
      option.innerText = team.name;
      option.value = team.name;
      teamSelector.appendChild(option);
    });

    teamSelector.addEventListener("change", () => {
      teams = loadTeams();

      const selectedOption = teamSelector.options[teamSelector.selectedIndex].value;
      const selectedTeamIndex = teams.indexOf(teams.find((team) => selectedOption === team.name));
      const selectedTeam = teams[selectedTeamIndex];

      const isNewMonster = ![...selectedTeam.monsters].map((m) => m.id).includes(monster.id);

      if (isNewMonster) {
        teams[selectedTeamIndex].addMonsterToTeam(monster).then((_) => {
          save(TEAMS_LSK, teams);
        });
        this.setSelectMessage("success", `${monster.name} successfully added to team '${selectedTeam.name}'`);
      } else {
        this.setSelectMessage("error", `${monster.name} alreday exists in team '${selectedTeam.name}'`);
      }
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
    const price = this.monsterPrice();
    const select = this.monsterSelect();

    container.appendChild(name);
    img.appendChild(price);
    container.appendChild(img);
    container.appendChild(specs);
    container.appendChild(stats);

    const teams = this.teams;
    const availableTeams = teams.filter((team) => team.monsters.length < 4);

    if (select.children.length > 0 && this.hideSelect !== true && availableTeams.length > 0) {
      container.appendChild(select);
    }
    return container;
  }
}
