import { fetchAllMonsters } from "./fetchEndpoints.js";
import { save, load, createIconContainer, getValueInObj, generateUniqueTeamName } from "./utility.js";
import { Team } from "../classes/team.js";
const apiConfigKey = "apiconfigure";

let fetchedMonsters = [];
let visibleMonsters = 10;
let teams = [];
let searchCategory = "name";
let transferTeamData;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchEndpoints();
  initSearchBox();
  initSearchCategory();
  initSortDropdown();
  initCreateTeamForm();
  initLoadMoreMonstersBtn();
  initMonsterCatalogue();
}

function fetchEndpoints() {
  const loadApiEndpoints = load(apiConfigKey);

  if (!loadApiEndpoints) {
    const apiConfigPath = "../json/apiConfig.json";
    fetch(apiConfigPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((endpoints) => {
        save(apiConfigKey, endpoints);
        fetchAllMonsters(endpoints.allMonstersEndpoint).then((monsters) => {
          assignAndPopulate(monsters);
        });
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
      });
  } else {
    const endpoints = load(apiConfigKey);
    fetchAllMonsters(endpoints.allMonstersEndpoint).then((monsters) => {
      assignAndPopulate(monsters);
    });
  }
}

function initCreateTeamForm() {
  const container = document.getElementById("createTeam");
  const form = container.getElementsByTagName("form")[0];
  const input = container.getElementsByTagName("input")[0];
  const message = container.getElementsByTagName("p")[0];

  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  input.addEventListener("input", () => {
    //reset message on typing
    message.innerText = "";
    message.setAttribute("class", "hidden");
    container.setAttribute("class", "minimize");

    //get rid of all white spaces
    const trimedValue = input.value.replace(/\s+/g, "");
    const lastCh = trimedValue.slice(-1).toLowerCase();

    //only allow letters and digits
    const isLetter = lastCh >= "a" && lastCh <= "z";
    const isDigit = digits.includes(lastCh);
    input.value = trimedValue;

    if (!isDigit && !isLetter) {
      input.value = input.value.slice(0, -1);
      message.setAttribute("class", "error");
      message.innerText = "Error! Only letters and digits allowed";
      //remove message after 2s
      setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "hidden");
        container.setAttribute("class", "minimize");
      }, 2000);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const teamName = input.value;
    if (teamName !== "") {
      const checkName = generateUniqueTeamName(teams, teamName);

      const controlledName = checkName.name;
      if (!checkName.unique) {
        message.setAttribute("class", "success");
        message.innerText = `${teamName} successfully changed to ${controlledName} due to team name duplicates`;
      } else {
        message.setAttribute("class", "success");
        message.innerText = `${controlledName} successfully created`;
      }
      addTeam(controlledName);
      input.value = "";
    } else {
      message.setAttribute("class", "error");
      message.innerText = "Error! Name must not be empty";
    }
    if (message.innerText !== "") {
      setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "hidden");
        container.setAttribute("class", "minimize");
      }, 3000);
    }
  });
}

function initLoadMoreMonstersBtn() {
  const loadMoreBtn = document.getElementById("loadMoreMonsters");

  loadMoreBtn.addEventListener("click", () => {
    if (fetchedMonsters && visibleMonsters < fetchedMonsters.length) {
      visibleMonsters += 10;
      renderMonsters();
    }
  });

  return loadMoreBtn;
}

function initSearchBox() {
  searchCategory = "name";
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", (e) => {
    const searchQuery = searchBox.value.trim().toLowerCase();
    if (searchQuery !== "") {
      searchMonsters(searchQuery);
    } else {
      showAllMonsters();
    }
  });
}

function initSearchCategory() {
  const searchBox = document.getElementById("searchBox");
  const category = document.getElementById("searchCategory");
  const inputs = Array.from(category.getElementsByTagName("input"));
  inputs.forEach((input) => {
    const index = inputs.indexOf(input);
    input.addEventListener("click", (e) => {
      switch (index) {
        case 0:
          searchCategory = "name";
          break;
        case 1:
          searchCategory = "strengths";
          break;
        case 2:
          searchCategory = "weaknesses";
          break;
      }
      searchBox.value = "";
      showAllMonsters();
    });
  });
}

function initSortDropdown() {
  const dropDown = document.getElementById("sortDropdown");
  dropDown.addEventListener("change", (e) => {
    sortMonsters(dropDown.value);
  });
}

function initMonsterCatalogue() {
  const dropDown = document.getElementById("sortDropdown");
  const monsters = document.getElementById("monsterContainer");
  const sortOder = dropDown.value;

  monsters.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  monsters.addEventListener("drop", (e) => {
    e.preventDefault();
    const monsterName = e.dataTransfer.getData("text/plain");
    const team = teams.find((team) => team.getTeamName() === transferTeamData);
    const monster = team.getMonsters().find((m) => m.monster.name === monsterName);
    if (monster) {
      team.deleteMonster(monster);
      fetchedMonsters.push(monster);
      sortMonsters(sortOder);
      renderMonsters();
      renderTeams();
    }
  });
}

function initDropZone(dropZone, team) {
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const monsterName = e.dataTransfer.getData("text/plain");
    if (team.getMonsters().length < 4) {
      const monster = fetchedMonsters.find((m) => m.monster.name === monsterName);
      if (monster) {
        fetchedMonsters = fetchedMonsters.filter((m) => m.monster.name !== monsterName);
        team.addMonster(monster);
        const draggedElement = document.getElementById(monsterName);
        dropZone.appendChild(draggedElement);
      }
    } else {
      alert("Team is full");
    }
  });
}

function assignAndPopulate(monsters) {
  fetchedMonsters = monsters.map((monster) => ({ monster: monster, visible: true }));
  defaultSort();
  renderMonsters();
}

function renderMonsters() {
  const monsterContainer = document.getElementById("monsterContainer");
  monsterContainer.innerHTML = "";
  for (let i = 0; i < visibleMonsters; i++) {
    if (fetchedMonsters && fetchedMonsters[i].visible) {
      const monster = fetchedMonsters[i].monster;
      createMonsterCard(monster, monsterContainer);
    }
  }
}

function createMonsterCard(newMonster, parent) {
  const monsterName = newMonster.name;
  const monsterSpecs = newMonster.specs;
  const monsterStrengths = newMonster.strengths;
  const monsterWeaknesses = newMonster.weaknesses;
  const monsterHealth = newMonster.health;
  const monsterDamage = newMonster.damage;
  const monsterPrice = newMonster.price;

  const monster = document.createElement("div");
  const name = document.createElement("h2");
  const specs = document.createElement("p");

  const strengths = document.createElement("div");
  const weaknesses = document.createElement("div");

  const strengthsHeader = document.createElement("h3");
  const weaknessesHeader = document.createElement("h3");

  const ablitiesContainer = document.createElement("div");

  const strengthsContent = document.createElement("div");
  const weaknessesContent = document.createElement("div");

  const statsContainer = document.createElement("div");
  const health = createIconContainer("iconContainer", monsterHealth, "../icons/heart.svg", `${monsterName} has ${monsterHealth} of health`, `${monsterName} has ${monsterName} of health`);
  const damage = createIconContainer("iconContainer", monsterDamage, "../icons/skull.svg", `${monsterName} has ${monsterDamage} of damage`, `${monsterName} has ${monsterDamage} of damage`, "Right");

  const priceContainer = document.createElement("div");
  const priceHeader = document.createElement("h4");
  const price = createIconContainer("iconContainer", monsterPrice, "../icons/diamond.svg", `${monsterName} costs ${monsterPrice} diamonds`, `${monsterName} costs ${monsterPrice} diamonds`);

  monster.setAttribute("id", monsterName);
  monster.setAttribute("draggable", true);
  monster.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", monster.id);
  });

  strengthsHeader.innerText = "Strengths";
  weaknessesHeader.innerText = "Weaknesses";

  monster.classList.add("monsterCard");
  name.classList.add("monsterName");
  specs.classList.add("monsterSpec");
  ablitiesContainer.classList.add("abilitesContainer");
  strengths.classList.add("monsterStr", "abilitesContent");
  weaknesses.classList.add("monsterWeak", "abilitesContent");
  statsContainer.classList.add("monsterStatsContainer");
  priceContainer.classList.add("monsterPriceContainer");

  name.innerText = monsterName;
  specs.innerText = monsterSpecs;
  priceHeader.innerText = "Price";

  strengths.appendChild(strengthsHeader);
  weaknesses.appendChild(weaknessesHeader);

  monsterStrengths.forEach((str) => {
    const strengthText = document.createElement("p");
    strengthText.innerText = str;
    strengthText.classList.add("strText");
    strengthsContent.appendChild(strengthText);
  });
  monsterWeaknesses.forEach((weak) => {
    const weakText = document.createElement("p");
    weakText.innerText = weak;
    weakText.classList.add("strText");
    weaknessesContent.appendChild(weakText);
  });

  strengths.appendChild(strengthsContent);
  weaknesses.appendChild(weaknessesContent);

  monster.appendChild(name);
  monster.appendChild(specs);
  statsContainer.appendChild(health);
  statsContainer.appendChild(damage);
  monster.appendChild(statsContainer);
  ablitiesContainer.appendChild(strengths);
  ablitiesContainer.appendChild(weaknesses);
  monster.appendChild(ablitiesContainer);
  priceContainer.appendChild(priceHeader);
  priceContainer.appendChild(price);
  monster.appendChild(priceContainer);
  parent.appendChild(monster);
}

function addTeam(teamName) {
  const newTeam = new Team(teamName);
  teams.push(newTeam);
  renderTeams();
}

function deleteTeam(teamToDelete) {
  const dropDown = document.getElementById("sortDropdown");
  const sortOder = dropDown.value;

  const monsters = teamToDelete.getMonsters();
  monsters.forEach((monster) => {
    fetchedMonsters.push(monster);
  });
  teams = teams.filter((team) => team.getTeamName() !== teamToDelete.getTeamName());
  sortMonsters(sortOder);
  renderMonsters();
  renderTeams();
}

function renderTeams() {
  const teamsContainer = document.getElementById("teamsContainer");
  teamsContainer.innerHTML = "";
  if (teams.length === 0) {
    teamsContainer.classList.add("hidden");
  } else {
    teamsContainer.classList.remove("hidden");
  }
  if (teams && teams.length > 0) {
    teams.forEach((team) => {
      const teamName = team.getTeamName();
      const monsters = team.getMonsters();
      const teamContainer = document.createElement("div");
      const teamHeader = document.createElement("h2");
      const teamList = document.createElement("ul");
      const deleteBtn = document.createElement("img");

      teamContainer.setAttribute("class", "teamDiv");
      teamHeader.innerText = teamName;
      teamList.setAttribute("id", teamName);

      monsters.forEach((monster) => {
        createMonsterCard(monster.monster, teamList);
      });

      teamList.addEventListener("mousedown", () => {
        transferTeamData = teamName;
      });

      deleteBtn.setAttribute("src", "/icons/trashBin.svg");
      deleteBtn.setAttribute("alt", `Delete ${teamName}`);
      deleteBtn.setAttribute("title", `Delete ${teamName}`);
      deleteBtn.setAttribute("class", "deleteTeamBtn");

      deleteBtn.addEventListener("click", () => {
        const src = deleteBtn.getAttribute("src");

        if (src.includes("trash")) {
          deleteBtn.setAttribute("src", "/icons/checkMark.svg");
          deleteBtn.setAttribute("alt", `Confirm delete of ${teamName}`);
          deleteBtn.setAttribute("title", `Confirm delete of ${teamName}`);
          setTimeout(() => {
            deleteBtn.setAttribute("src", "/icons/trashBin.svg");
            deleteBtn.setAttribute("alt", `Delete ${teamName}`);
            deleteBtn.setAttribute("title", `Delete ${teamName}`);
          }, 2000);
        } else {
          teamContainer.remove();
          deleteTeam(team);
        }
      });

      teamContainer.appendChild(teamHeader);
      teamContainer.appendChild(teamList);
      teamContainer.appendChild(deleteBtn);
      teamsContainer.appendChild(teamContainer);
      initDropZone(teamList, team);
    });
  }
}

function showAllMonsters() {
  fetchedMonsters.forEach((monster) => (monster.visible = true));
  renderMonsters();
}

function searchMonsters(query) {
  fetchedMonsters.forEach((monster) => {
    const value = getValueInObj(monster.monster, searchCategory);
    if (value) {
      if (typeof value === "string") {
        if (value.includes(query)) {
          monster.visible = true;
        } else {
          monster.visible = false;
        }
      } else {
        const hasAbility = value.some((ablity) => ablity.toLowerCase().includes(query));
        if (hasAbility) {
          monster.visible = true;
        } else {
          monster.visible = false;
        }
      }
    }
  });

  renderMonsters();
}

function defaultSort() {
  fetchedMonsters = fetchedMonsters.sort((a, b) => a.monster.name.localeCompare(b.monster.name));
}

function sortMonsters(option) {
  switch (option) {
    case "0":
      //alphabetical
      fetchedMonsters = fetchedMonsters.sort((a, b) => a.monster.name.localeCompare(b.monster.name));
      break;
    case "1":
      //alphabetical reverse
      fetchedMonsters = fetchedMonsters.sort((a, b) => b.monster.name.localeCompare(a.monster.name));
      break;
    case "2":
      //highest price first
      fetchedMonsters = fetchedMonsters.sort((a, b) => a.monster.price - b.monster.price);
      break;
    case "3":
      //lowest price first
      fetchedMonsters = fetchedMonsters.sort((a, b) => b.monster.price - a.monster.price);
      break;
    case "4":
      //highest hp first
      fetchedMonsters = fetchedMonsters.sort((a, b) => a.monster.health - b.monster.health);
      break;
    case "5":
      //lowest hp first
      fetchedMonsters = fetchedMonsters.sort((a, b) => b.monster.health - a.monster.health);
      break;

    case "6":
      //highest dmg first
      fetchedMonsters = fetchedMonsters.sort((a, b) => a.monster.damage - b.monster.damage);
      break;
    case "7":
      //lowest dmg first
      fetchedMonsters = fetchedMonsters.sort((a, b) => b.monster.damage - a.monster.damage);
      break;
  }
  renderMonsters();
}
