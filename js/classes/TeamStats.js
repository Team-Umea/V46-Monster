import { useClickEvent } from "../common/useEvent.js";
import { renderIconWithNumber, valueWithHeader } from "../common/render.js";

export class TeamStat {
  constructor(team, elements, updateTeamCallback) {
    this.team = team;
    this.elements = elements;
    this.updateTeamCallback = updateTeamCallback;

    this.teamName = team.getTeamName();
    this.teamMonsters = team.getMonsters();
    this.monsterNames = this.getAllMonsterNames();
    this.totalRating = this.calcTeamRating();
    this.totalHealh = this.calcTeamHealth();
    this.totalDamage = this.calcTeamDamage();
    this.topMonster = this.findTopMonster();
    this.bottomMonster = this.findBottomMonster();
    this.teamElements = this.getAllMonsterElements();
    this.teamBodyVisible = team.getTeamBodyVisible();

    this.headerContainerEl = null;
    this.bodyContainerEl = null;
    this.toggleEl = null;

    this.sortMonstersByHighRating();
    // this.sortElementsByRating();
  }

  container() {
    const container = document.createElement("li");
    container.setAttribute("class", "teamStatContainer");
    return container;
  }

  headerContainer() {
    const headerContainerEl = document.createElement("div");
    headerContainerEl.setAttribute("class", "teamStatHeaderContainer");

    this.headerContainerEl = headerContainerEl;
    return this.headerContainerEl;
  }

  monsterInTeam() {
    const teamMonsters = this.teamMonsters;
    const numMonster = teamMonsters.length;
    const teamName = this.teamName;
    const pluralOrSingular = numMonster < 2 ? "monster" : "monsters";

    const monsterIcon = renderIconWithNumber(numMonster, "../../res/icons/skull.svg", `There is ${numMonster} ${pluralOrSingular} in '${teamName}'`);
    monsterIcon.classList.add("teamStatNumMonsters");

    return monsterIcon;
  }

  header() {
    const header = document.createElement("h2");
    header.setAttribute("class", "teamStatHeader");

    const name = this.teamName;

    header.innerText = name;

    return header;
  }

  toggle() {
    const toggle = document.createElement("img");
    toggle.setAttribute("class", "teamStatToggle icon icon-scale");

    const teamName = this.teamName;

    toggle.setAttribute("src", "../../res/icons/downArrow.svg");
    toggle.setAttribute("alt", `Show stats for '${teamName}'`);
    toggle.setAttribute("title", `Show stats for '${teamName}'`);

    this.toggleEl = toggle;

    const toggleStats = this.toggleStats.bind(this);

    useClickEvent(toggle, toggleStats);

    return toggle;
  }

  bodyContainer() {
    const bodyContainerEl = document.createElement("div");
    bodyContainerEl.setAttribute("class", "teamStatBodyContainer");

    const teamBodyVisible = this.teamBodyVisible;

    this.bodyContainerEl = bodyContainerEl;

    if (teamBodyVisible) {
      this.showStats();
    } else {
      this.hideStats();
    }

    return this.bodyContainerEl;
  }

  topStats() {
    const container = document.createElement("div");

    container.setAttribute("class", "teamStatTopStatsContainer");

    const teamName = this.teamName;
    const totalRating = this.totalRating;
    const totalHealth = this.totalHealh;
    const totalDamage = this.totalDamage;

    const rating = renderIconWithNumber(totalRating, "../../res/icons/trophy.svg", `Team '${teamName}' has a combined rating of ${totalRating}`);
    const health = renderIconWithNumber(totalHealth, "../../res/icons/heart.svg", `Team '${teamName}' has ${totalHealth} combined health`);
    const damage = renderIconWithNumber(totalDamage, "../../res/icons/skull.svg", `Team '${teamName}' has ${totalDamage} combined damage`, "right");

    rating.classList.add("teamStatTopStatsIcon");
    health.classList.add("teamStatTopStatsIcon");
    damage.classList.add("teamStatTopStatsIcon");

    container.appendChild(rating);
    container.appendChild(health);
    container.appendChild(damage);

    return container;
  }

  averageStats() {
    const container = document.createElement("div");

    container.setAttribute("class", "teamStatAverageStatsContainer");

    const team = this.team;
    const numMonsters = team.getMonsters().length;
    const totalRating = this.totalRating;
    const totalHealth = this.totalHealh;
    const totalDamage = this.totalDamage;

    let averageRating = totalRating;
    let averageHealth = totalHealth;
    let averageDamage = totalDamage;

    if (numMonsters > 0) {
      averageRating = Math.floor(totalRating / numMonsters);
      averageHealth = Math.floor(totalHealth / numMonsters);
      averageDamage = Math.floor(totalDamage / numMonsters);
    }

    const rating = valueWithHeader(averageRating, "Avg rating");
    const health = valueWithHeader(averageHealth, "Avg health");
    const damage = valueWithHeader(averageDamage, "Avg damage");

    rating.classList.add("teamStatAverageStatsValue");
    health.classList.add("teamStatAverageStatsValue");
    damage.classList.add("teamStatAverageStatsValue");

    container.appendChild(rating);
    container.appendChild(health);
    container.appendChild(damage);

    return container;
  }

  endToEndMonsters() {
    const container = document.createElement("div");

    const topMonster = this.topMonster;
    const bottomMonster = this.bottomMonster;

    const onlyOneMonster = topMonster === bottomMonster;

    if (onlyOneMonster) {
      const topMonsterEl = this.focusMonster(topMonster, "Strongest", "teamStatStrongMonster teamStatAloneMonster", "left");

      container.setAttribute("class", "teamStatEndToEndMonstersContainer teamStatCenterTopMonster");
      container.appendChild(topMonsterEl);
    } else {
      const topMonsterEl = this.focusMonster(topMonster, "Strongest", "teamStatStrongMonster", "left");
      const bottomMonsterEl = this.focusMonster(bottomMonster, "Weakest", "teamStatWeakMonster", "right");

      container.setAttribute("class", "teamStatEndToEndMonstersContainer");
      container.appendChild(topMonsterEl);
      container.appendChild(bottomMonsterEl);
    }

    return container;
  }

  allTeamMonsters() {
    const container = document.createElement("div");
    const header = document.createElement("h2");
    const monsters = document.createElement("div");

    container.setAttribute("class", "teamStatMonstersContainer");
    header.setAttribute("class", "teamStatMonstersHeader");
    monsters.setAttribute("class", "teamStatMonsters");

    const teamMonsters = this.teamMonsters;

    header.innerText = "Monsters";

    teamMonsters.forEach((monster) => {
      const monsterConatiner = document.createElement("div");
      const name = document.createElement("p");
      const stats = this.monsterStats(monster);

      const monsterName = monster.name;

      monsterConatiner.setAttribute("class", "teamStatMonsterInfoContainer");
      name.setAttribute("class", "teamStatMonsterName");

      name.innerText = monsterName;

      monsterConatiner.appendChild(name);
      monsterConatiner.appendChild(stats);
      monsters.appendChild(monsterConatiner);
    });

    container.appendChild(header);
    container.appendChild(monsters);

    return container;
  }

  allTeamElements() {
    const container = document.createElement("div");
    const heading = document.createElement("div");
    const header = document.createElement("h2");
    const numElements = document.createElement("p");
    const elements = document.createElement("div");

    container.setAttribute("class", "teamStatElementsContainer");
    heading.setAttribute("class", "teamStatElementsHeading");
    header.setAttribute("class", "teamStatElmentsHeader");
    numElements.setAttribute("class", "teamStatNumElements");
    elements.setAttribute("class", "teamStatElements");

    const teamName = this.teamName;
    const teamElements = this.teamElements;
    const teamNumElments = teamElements.length;

    header.setAttribute("data-elements", teamNumElments);

    header.innerText = "Elments";
    numElements.innerText = `${teamNumElments}x`;

    teamElements.forEach((teamElement) => {
      const element = document.createElement("div");
      const name = document.createElement("p");

      element.setAttribute("class", "teamStatElementContainer");
      name.setAttribute("class", "teamStatElementName");

      const elementName = Object.keys(teamElement)[0];
      const elementInstances = teamElement[elementName];
      const elementRating = teamElement.rating;

      const rating = renderIconWithNumber(elementRating, "../../res/icons/trophy.svg", `Rating of ${elementName} is ${elementRating}`, "right");
      rating.classList.add("teamStatElementRating");

      name.innerText = `${elementInstances}x ${elementName}`;

      element.appendChild(name);
      element.appendChild(rating);

      elements.appendChild(element);
    });

    heading.appendChild(header);
    heading.appendChild(numElements);

    container.appendChild(heading);
    container.appendChild(elements);

    return container;
  }

  monsterStats(monster) {
    const container = document.createElement("div");

    container.setAttribute("class", "teamStatMonsterStats");

    const monsterName = monster.name;
    const monsterHealth = monster.health;
    const monsterDamage = monster.damage;
    const monsterRating = monsterHealth + monsterDamage;

    const rating = renderIconWithNumber(monsterRating, "../../res/icons/trophy.svg", `${monsterName} has a rating of ${monsterRating}`);
    const health = renderIconWithNumber(monsterHealth, "../../res/icons/heart.svg", `${monsterName} has ${monsterHealth} in health`);
    const damage = renderIconWithNumber(monsterDamage, "../../res/icons/skull.svg", `${monsterName} has ${monsterDamage} in damage`);

    rating.classList.add("teamStatFocusMonsterIcon");
    health.classList.add("teamStatFocusMonsterIcon");
    damage.classList.add("teamStatFocusMonsterIcon");

    container.appendChild(rating);
    container.appendChild(health);
    container.appendChild(damage);

    return container;
  }

  toggleStats() {
    const toggle = this.toggleEl;
    const src = toggle.getAttribute("src");
    const isExtended = src.includes("upArrow");

    if (isExtended) {
      this.hideStats();
    } else {
      this.showStats();
    }

    this.updateTeamCallback();
  }

  showStats() {
    const toggle = this.toggleEl;
    const bodyContainer = this.bodyContainerEl;
    const team = this.team;
    const teamName = this.teamName;

    team.setTeamBodyVisible(true);

    toggle.setAttribute("src", "../../res/icons/upArrow.svg");
    toggle.setAttribute("alt", `Hide stats for '${teamName}'`);
    toggle.setAttribute("title", `Hide stats for '${teamName}'`);

    bodyContainer.setAttribute("class", "teamStatBodyContainer");
  }

  hideStats() {
    const toggle = this.toggleEl;
    const bodyContainer = this.bodyContainerEl;
    const team = this.team;
    const teamName = this.teamName;

    team.setTeamBodyVisible(false);

    toggle.setAttribute("src", "../../res/icons/downArrow.svg");
    toggle.setAttribute("alt", `Show stats for '${teamName}'`);
    toggle.setAttribute("title", `Show stats for '${teamName}'`);

    bodyContainer.setAttribute("class", "teamStatBodyContainer hidden");
  }

  focusMonster(monster, headerText, clasName, iconDir) {
    const container = document.createElement("div");
    const header = document.createElement("h2");
    const name = document.createElement("h3");

    container.setAttribute("class", `teamStatFocusMonsterContainer ${clasName}`);
    header.setAttribute("class", "teamStatFocusMonsterHeader");
    name.setAttribute("class", "teamStatFocusMonsterName");

    header.innerText = headerText;

    const monsterName = monster.name;
    const monsterHealth = monster.health;
    const monsterDamage = monster.damage;
    const monsterRating = monsterHealth + monsterDamage;
    // const monsterRank = monster.rank; - add this when api reponse includes a rank property in monsters

    name.innerText = monsterName;

    const rating = renderIconWithNumber(monsterRating, "../../res/icons/trophy.svg", `${monsterName} has a rating of ${monsterRating}`, iconDir);
    const health = renderIconWithNumber(monsterHealth, "../../res/icons/heart.svg", `${monsterName} has ${monsterHealth} in health`, iconDir);
    const damage = renderIconWithNumber(monsterDamage, "../../res/icons/skull.svg", `${monsterName} has ${monsterDamage} in damage`, iconDir);

    rating.classList.add("teamStatFocusMonsterIcon");
    health.classList.add("teamStatFocusMonsterIcon");
    damage.classList.add("teamStatFocusMonsterIcon");

    container.appendChild(header);
    container.appendChild(name);
    container.appendChild(rating);
    container.appendChild(health);
    container.appendChild(damage);

    return container;
  }

  calcTeamRating() {
    const team = this.team;
    const monsters = team.getMonsters();
    const rating = monsters.reduce((acc, curr) => acc + curr.health + curr.damage, 0);
    return rating;
  }

  calcTeamHealth() {
    const team = this.team;
    const monsters = team.getMonsters();
    const health = monsters.reduce((acc, curr) => acc + curr.health, 0);
    return health;
  }

  calcTeamDamage() {
    const team = this.team;
    const monsters = team.getMonsters();
    const damage = monsters.reduce((acc, curr) => acc + curr.damage, 0);
    return damage;
  }

  sortMonstersByHighRating() {
    const monsters = this.teamMonsters;
    if (monsters) {
      const sortedByHighRating = monsters.sort((a, b) => {
        const healthA = a.health;
        const healthB = b.health;
        const damageA = a.damage;
        const damageB = b.damage;
        const ratingA = healthA + damageA;
        const ratingB = healthB + damageB;

        return ratingB - ratingA;
      });
      return sortedByHighRating;
    }
    return [];
  }

  findTopMonster() {
    const monsters = this.sortMonstersByHighRating();
    const topMonster = monsters[0];
    return topMonster;
  }

  findBottomMonster() {
    const monsters = this.teamMonsters;
    const sortedByLowRating = monsters.sort((a, b) => {
      const healthA = a.health;
      const healthB = b.health;
      const damageA = a.damage;
      const damageB = b.damage;
      const ratingA = healthA + damageA;
      const ratingB = healthB + damageB;

      return ratingA - ratingB;
    });

    const bottomMonster = sortedByLowRating[0];
    return bottomMonster;
  }

  getAllMonsterNames() {
    const teamMonsters = this.teamMonsters;
    const monsterNames = teamMonsters.map((monster) => monster.name);

    return monsterNames;
  }

  //   sortElementsByRating() {
  //     const teamElements = this.teamElements;
  //     if (teamElements) {
  //       const sortedByHighRating = teamElements.sort((a, b) => {
  //         const elementNameA = a.name;
  //         const elementNameB = b.name;
  //         const ratingA = a.rating;
  //         const ratingB = b.rating;

  //         const ratingDifference = ratingA - ratingB;

  //         return ratingDifference === 0 ? elementNameA.localeCompare(elementNameB) : ratingDifference;
  //       });
  //       return sortedByHighRating;
  //     }
  //     return [];
  //   }

  getAllMonsterElements() {
    const teamMonsters = this.teamMonsters;
    const allElements = this.elements;

    const elements = teamMonsters.map((monster) => monster.elements).flat();

    const instancesOfElements = elements.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const entriesArray = Object.keys(instancesOfElements).map((key) => ({
      [key]: instancesOfElements[key],
    }));

    const sortedInstances = entriesArray.sort((a, b) => {
      const countA = Object.values(a)[0];
      const countB = Object.values(b)[0];

      if (countB - countA !== 0) {
        return countB - countA;
      }

      const keyA = Object.keys(a)[0];
      const keyB = Object.keys(b)[0];
      return keyA.localeCompare(keyB);
    });

    const sortElementsWithRating = sortedInstances.map((element) => {
      const elementName = Object.keys(element)[0];
      const rating = allElements.find((teamElement) => teamElement.name === elementName).rating;
      return { ...element, rating: rating };
    });

    return sortElementsWithRating;
  }
}
