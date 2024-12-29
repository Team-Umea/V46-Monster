import { TEAMS_LSK, SELECTEDFIGHTTEAM_LSK, OPPOSINGFIGHTTEAM_LSK, ELEMENTS_LSK } from "./common/localStorageKeys.js";
import { ELEMENTS_TTL } from "./common/ttl.js";
import { save, load, redirect } from "./common/utilities.js";
import { useChangeEvent, useClickEvent } from "./common/useEvent.js";
import { serveData } from "./common/fetch.js";
import { Team } from "./classes/Team.js";
import { MonsterFighCard } from "./classes/MonsterFighCard.js";

const selectedTeamEl = document.getElementById("selectedTeam");
const userTeamSelectEl = document.getElementById("availableTeams");
const userTeamMonstersEl = document.getElementById("userTeamMonsters");
const fightBtn = document.getElementById("fightBtn");
const opposingTeamListEl = document.getElementById("opposingTeamList");
const opposingTeamMonstersEl = document.getElementById("opposingTeamMonters");

const teams = load(TEAMS_LSK).map((team) => team.name) || [];
const selectedTeam = load(SELECTEDFIGHTTEAM_LSK) || teams[0];

let userTeamMonsters = load(TEAMS_LSK).find((team) => team.name === selectedTeam).monsters || [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  populateUserTeamSelect();
  populateOpposingTeamList();
  renderMonsters(userTeamMonstersEl, userTeamMonsters);
  setSelectedTeam();
  useClickEvent(fightBtn, () => redirect("fight.html"));
  useChangeEvent(userTeamSelectEl, selectTeam);
}

function setSelectedTeam() {
  if (selectedTeam) {
    selectedTeamEl.innerText = `Selected Team '${selectedTeam}'`;
    userTeamSelectEl.value = selectedTeam;
  }
}

function selectTeam() {
  const teamName = userTeamSelectEl.value;
  selectedTeamEl.innerText = `Selected Team '${teamName}'`;

  userTeamMonsters = load(TEAMS_LSK).find((team) => team.name === teamName).monsters || [];

  save(SELECTEDFIGHTTEAM_LSK, teamName);
  renderMonsters(userTeamMonstersEl, userTeamMonsters);
}

async function getOpposingTeam(level) {
  const opposingTeam = new Team(`AI ${level}`);

  const opposingTeamPromises = [serveData("generateTeam", `&level=${level}`, opposingTeamMonstersEl), serveData("elements", undefined, opposingTeamMonstersEl, ELEMENTS_LSK, ELEMENTS_TTL)];

  const opposingTeamData = await Promise.all(opposingTeamPromises);

  const opposingTeamMonsters = opposingTeamData[0];
  const elements = opposingTeamData[1];

  assignOpposingTeamElements(elements, opposingTeamMonsters, level);
  opposingTeam.setMonsters(opposingTeamMonsters);

  save(OPPOSINGFIGHTTEAM_LSK, opposingTeam);

  renderMonsters(opposingTeamMonstersEl, opposingTeamMonsters);
  fightBtn.classList.remove("hidden");
}

function assignOpposingTeamElements(elements, monsters, level) {
  const numElementsProbability = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4];
  const numElements = numElementsProbability[Math.floor(Math.random() * numElementsProbability.length)];

  const elementRatings = elements
    .map((element) => element.rating)
    .filter((item, index, self) => self.indexOf(item) === index)
    .sort((a, b) => a - b);

  const elementLevel = Math.min(elementRatings.length - 1, level - 1);
  const allowedRatings = level <= 2 ? [elementRatings[elementLevel]] : [...elementRatings.slice(elementLevel - 2, elementLevel + 1)];

  const possibleElements = [...elements]
    .filter((element) => {
      return allowedRatings.includes(element.rating);
    })
    .sort((a, b) => a.rating - b.rating);

  const randomElementIndexes = new Set();
  const randomMonsterIndexes = new Set();

  while (randomElementIndexes.size < numElements) {
    const randomElementIndex = Math.floor(Math.random() * possibleElements.length);
    randomElementIndexes.add(randomElementIndex);
  }

  while (randomMonsterIndexes.size < numElements) {
    const randomMonsterIndex = Math.floor(Math.random() * monsters.length);
    randomMonsterIndexes.add(randomMonsterIndex);
  }

  monsters.forEach((monster) => (monster.elements = []));

  Array.from(randomElementIndexes).forEach((randInd, ind) => {
    const monsterIndex = Array.from(randomMonsterIndexes)[ind];
    monsters[monsterIndex].elements = [possibleElements[randInd]];
  });
}

function populateUserTeamSelect() {
  userTeamSelectEl.innerHTML = "";

  teams.forEach((team) => {
    const teamOptionEl = document.createElement("option");
    teamOptionEl.setAttribute("class", "userTeamOption");
    teamOptionEl.setAttribute("value", team);
    teamOptionEl.innerText = team;

    userTeamSelectEl.appendChild(teamOptionEl);
  });
}

function renderMonsters(parent, monsters) {
  parent.innerHTML = "";

  monsters.forEach((monster) => {
    parent.appendChild(new MonsterFighCard(monster).card());
  });
}

function populateOpposingTeamList() {
  opposingTeamListEl.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const level = i + 1;
    const listItem = document.createElement("li");
    const teamLevelBtn = document.createElement("button");

    listItem.setAttribute("class", "opposingTeamListItem");
    teamLevelBtn.setAttribute("class", "opposingTeamLevlBtn primary-btn");

    teamLevelBtn.innerText = `Level ${level}`;

    useClickEvent(teamLevelBtn, () => {
      getOpposingTeam(level);
    });

    listItem.appendChild(teamLevelBtn);
    opposingTeamListEl.appendChild(listItem);
  }
}
