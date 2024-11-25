import { fetchAllMonsters, fetchRandomMonsters } from "./fetchEndpoints.js";
import { save, load, loadApiConfig, createIconContainer, createBtnIcon, getValueInObj, generateUniqueTeamName } from "./utility.js";
import { Team } from "../classes/team.js";

const creditsKey = "credits";
const teamsKey = "teams";

let apiConfig;

let fetchedMonsters = [];
let visibleMonsters = 10;
let teams = [];
let searchCategory = "name";
let transferTeamData;
let userCredits = 0;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  defaultFetchAllMonsters();
  initSearchBox();
  initSearchCategory();
  initSortDropdown();
  initCreateTeamForm();
  initLoadMoreMonstersBtn();
  initMonsterCatalogue();
  setCredits();
  loadTeams();
  initSerachTeams();
  initSortTeams();
}

function defaultFetchAllMonsters() {
  loadApiConfig().then((endpoints) => {
    apiConfig = endpoints;
    fetchAllMonsters(endpoints.allMonstersEndpoint).then((monsters) => {
      assignAndPopulate(monsters);
    });
  });
}

function loadTeams() {
  const loadedTeams = load(teamsKey);
  if (loadedTeams) {
    loadedTeams.forEach((loadedTeam) => {
      teams.push(Team.fromJSON(loadedTeam));
    });
    teams.forEach((team) => team.setVisible(true));
    defaultSortTeams();
    renderTeams();
  }
}

function updateTeams() {
  save(teamsKey, teams);
  renderTeams();
}

function initCreateTeamForm() {
  const container = document.getElementById("createTeam");
  const form = container.getElementsByTagName("form")[0];
  const input = container.getElementsByTagName("input")[0];
  const message = container.getElementsByTagName("p")[0];
  const sortTeamsDropDown = document.getElementById("sortTeamsDropDown");

  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  input.addEventListener("input", () => {
    message.innerText = "";
    message.setAttribute("class", "hidden");
    container.setAttribute("class", "minimize");

    const trimedValue = input.value.replace(/\s+/g, "");
    const lastCh = trimedValue.slice(-1).toLowerCase();

    const isLetter = lastCh >= "a" && lastCh <= "z";
    const isDigit = digits.includes(lastCh);
    input.value = trimedValue;

    if (!isDigit && !isLetter) {
      input.value = input.value.slice(0, -1);
      message.setAttribute("class", "error");
      message.innerText = "Error! Only letters and digits allowed";

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
      sortTeams(sortTeamsDropDown.value);
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
      sortMonsters(sortOder);
      renderMonsters();
      updateTeams();
    }
  });
}

function initSerachTeams() {
  const serachInput = document.getElementById("serachTeams");

  serachInput.addEventListener("input", () => {
    const serachQuery = serachInput.value.trim().toLowerCase();
    serachInput.value = serachInput.value.trim();
    if (serachQuery !== "") {
      searchTeams(serachQuery);
    } else {
      showAllTeams();
    }
  });
}

function initSortTeams() {
  const dropDown = document.getElementById("sortTeamsDropDown");

  dropDown.addEventListener("change", () => {
    const value = dropDown.value;
    sortTeams(value);
  });
}

function setCredits(creditsChange) {
  const creditsContainer = document.getElementById("credits");
  if (creditsChange) {
    const diff = userCredits - creditsChange;
    userCredits = diff;
    save(creditsKey, diff);
  } else {
    const loadCredits = Number(load(creditsKey));
    if (loadCredits) {
      userCredits = loadCredits;
    } else {
      userCredits = 1000000;
    }
  }

  creditsContainer.setAttribute("class", "creditsContainer");
  creditsContainer.innerHTML = "";
  const displayer = createIconContainer("iconContainer", userCredits, "../icons/diamond.svg", `You have ${userCredits} credits`, `You have ${userCredits} credits`, "Right");
  creditsContainer.appendChild(displayer);
}

function initDropZone(dropZone, team) {
  const dropDown = document.getElementById("sortDropdown");
  const sortOder = dropDown.value;

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const monsterName = e.dataTransfer.getData("text/plain");
    if (team.getMonsters().length < 4) {
      const monster = fetchedMonsters.find((m) => m.monster.name === monsterName);
      if (monster) {
        if (!team.getMonsters().includes(monster)) {
          team.addMonster(monster);
          const draggedElement = document.getElementById(monsterName);
          dropZone.appendChild(draggedElement);
          sortMonsters(sortOder);
          renderMonsters();
          updateTeams();
        } else {
          alert("Cant have duplicates of monsters in same team");
        }
      }
    } else {
      alert("Team is full");
    }
  });
}

function assignAndPopulate(monsters) {
  fetchedMonsters = monsters.map((monster) => ({ monster: monster, visible: true }));
  defaultSortMonsters();
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
  const noMatchingSerach = fetchedMonsters.every((m) => !m.visible);
  if (noMatchingSerach) {
    const serachMonstersErrorMessage = document.createElement("p");
    serachMonstersErrorMessage.setAttribute("class", "searchError error");
    serachMonstersErrorMessage.innerText = "No matching result for your search query";
    monsterContainer.appendChild(serachMonstersErrorMessage);
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
  updateTeams();
}

function deleteTeam(teamToDelete) {
  const dropDown = document.getElementById("sortDropdown");
  const sortOder = dropDown.value;
  teams = teams.filter((team) => team.getTeamName() !== teamToDelete.getTeamName());
  sortMonsters(sortOder);
  renderMonsters();
  updateTeams();
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
      if (team.getVisible()) {
        const teamName = team.getTeamName();
        const monsters = team.getMonsters();
        const teamContainer = document.createElement("div");
        const teamHeader = document.createElement("h2");
        const teamBtnsContainer = document.createElement("div");
        const deleteBtnsContainer = document.createElement("div");
        const teamList = document.createElement("ul");

        const buyTeamBtn = createBtnIcon("btn-green", "../icons/cart.svg", `Buy ${teamName}`);
        const getRandomMonstersBtn = createBtnIcon("btn-blue", "../icons/shuffle.svg", `Get 4 random monsters`);
        const deleteTeamBtn = createBtnIcon("btn-red", "../icons/trashBin.svg", `Delete ${teamName}`);

        teamContainer.setAttribute("class", "teamDiv");
        teamBtnsContainer.setAttribute("class", "teamContainerBtns");
        deleteBtnsContainer.setAttribute("class", "deleteMonstersContainer");
        teamHeader.setAttribute("class", "teamHeader");
        teamHeader.innerText = teamName;
        teamList.setAttribute("id", teamName);

        monsters.forEach((monster) => {
          const monsterData = monster.monster;
          const monsterName = monsterData.name;
          if (!team.getPaidFor()) {
            const deleteMonsterBtn = document.createElement("button");
            const btnIcon = document.createElement("img");
            btnIcon.setAttribute("src", "../icons/cross.svg");
            btnIcon.setAttribute("alt", `Remove ${monsterName} from ${teamName}`);
            btnIcon.setAttribute("title", `Remove ${monsterName} from ${teamName}`);
            btnIcon.setAttribute("class", "icon icon-white");
            deleteMonsterBtn.appendChild(btnIcon);
            deleteMonsterBtn.setAttribute("class", "btn btn-red");
            deleteMonsterBtn.addEventListener("click", () => {
              team.deleteMonster(monster);
              updateTeams();
            });
            deleteBtnsContainer.appendChild(deleteMonsterBtn);
          }

          createMonsterCard(monsterData, teamList);
        });

        teamList.addEventListener("mousedown", () => {
          transferTeamData = teamName;
        });

        buyTeamBtn.addEventListener("click", () => {
          const prices = monsters.map((monster) => monster.monster.price);
          const sum = prices.reduce((acc, curr) => acc + curr, 0);
          if (monsters.length === 4) {
            if (sum <= userCredits) {
              const buy = confirm(`Click to confirm to buy monsters in ${teamName} for ${sum} credits`);
              if (buy) {
                team.setPaidFor(true);
                setCredits(sum);
                buyTeamBtn.remove();
                updateTeams();
              }
            } else {
              alert("You don't have enough credits");
            }
          } else {
            alert("Please fill out all slots in your team");
          }
        });

        getRandomMonstersBtn.addEventListener("click", () => {
          const confirmRandomFetch = confirm("This action will override any progess to your team, click 'OK' to continue");
          if (confirmRandomFetch) {
            fetchRandomMonsters(apiConfig.randomMonstersEndpoint, 4).then((randomMonsters) => {
              console.log("Random Monsters: ", randomMonsters);
              const modifyedMonsters = randomMonsters.map((m) => ({ monster: m, visible: true }));
              team.setMonsters(modifyedMonsters);
              console.log("Teams: ", teams);
              updateTeams();
            });
          }
        });

        deleteTeamBtn.addEventListener("click", () => {
          const icon = deleteTeamBtn.getElementsByTagName("img")[0];
          const src = icon.getAttribute("src");

          if (src.includes("trash")) {
            icon.setAttribute("src", "/icons/checkMark.svg");
            icon.setAttribute("alt", `Confirm delete of ${teamName}`);
            icon.setAttribute("title", `Confirm delete of ${teamName}`);
            setTimeout(() => {
              icon.setAttribute("src", "/icons/trashBin.svg");
              icon.setAttribute("alt", `Delete ${teamName}`);
              icon.setAttribute("title", `Delete ${teamName}`);
            }, 2000);
          } else {
            teamContainer.remove();
            deleteTeam(team);
          }
        });

        teamContainer.appendChild(teamHeader);
        if (!team.getPaidFor()) {
          teamBtnsContainer.appendChild(buyTeamBtn);
          teamBtnsContainer.appendChild(getRandomMonstersBtn);
        }
        teamBtnsContainer.appendChild(deleteTeamBtn);
        teamContainer.appendChild(teamBtnsContainer);
        if (!team.getPaidFor()) {
          teamContainer.appendChild(deleteBtnsContainer);
        }
        teamContainer.appendChild(deleteBtnsContainer);
        teamContainer.appendChild(teamList);
        teamsContainer.appendChild(teamContainer);
        initDropZone(teamList, team);
      }
    });
  }

  const noMatchSerachResult = teams.every((team) => !team.getVisible());
  if (noMatchSerachResult) {
    const serachMonstersErrorMessage = document.createElement("p");
    serachMonstersErrorMessage.setAttribute("class", "searchError error");
    serachMonstersErrorMessage.innerText = "No matching result for your search query";
    teamsContainer.appendChild(serachMonstersErrorMessage);
  }
}

function showAllMonsters() {
  fetchedMonsters.forEach((monster) => (monster.visible = true));
  renderMonsters();
}

function showAllTeams() {
  teams.forEach((team) => team.setVisible(true));
  renderTeams();
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

function searchTeams(query) {
  teams.forEach((team) => {
    if (team.getTeamName().toLowerCase().includes(query)) {
      team.setVisible(true);
    } else {
      team.setVisible(false);
    }
  });
  renderTeams();
}

function defaultSortMonsters() {
  if (fetchedMonsters && fetchedMonsters.length > 0) {
    fetchedMonsters = fetchedMonsters.sort((a, b) => a.monster.name.localeCompare(b.monster.name));
  }
}

function defaultSortTeams() {
  if (teams && teams.length) {
    teams = teams.sort((a, b) => a.getTeamName().localeCompare(b.getTeamName()));
  }
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

function sortTeams(option) {
  switch (option) {
    case "0":
      teams = teams.sort((a, b) => {
        const isADigits = /^\d+$/.test(a.getTeamName());
        const isBDigits = /^\d+$/.test(b.getTeamName());

        if (isADigits && isBDigits) return 0;
        if (isADigits) return 1;
        if (isBDigits) return -1;

        return a.getTeamName().localeCompare(b.getTeamName());
      });
      break;
    case "1":
      teams = teams.sort((a, b) => {
        const isADigits = /^\d+$/.test(a.getTeamName());
        const isBDigits = /^\d+$/.test(b.getTeamName());

        if (isADigits && isBDigits) return 0;
        if (isADigits) return -1;
        if (isBDigits) return 1;

        return b.getTeamName().localeCompare(a.getTeamName());
      });
      break;
    case "2":
      teams = teams.sort((a, b) => {
        return new Date(b.getCreatedAt()) - new Date(a.getCreatedAt());
      });
      break;
    case "3":
      teams = teams.sort((a, b) => {
        return new Date(a.getCreatedAt()) - new Date(b.getCreatedAt());
      });
      break;
    case "4":
      teams.sort((a, b) => {
        const paidA = a.getPaidFor();
        const paidB = b.getPaidFor();

        return paidA === paidB ? 0 : paidA ? -1 : 1;
      });
      break;
    case "5":
      teams.sort((a, b) => {
        const paidA = a.getPaidFor();
        const paidB = b.getPaidFor();

        return paidA === paidB ? 0 : paidA ? 1 : -1;
      });
      break;
    case "6":
      teams = teams.sort((a, b) => b.getMonsters().length - a.getMonsters().length);
      break;
    case "7":
      teams = teams.sort((a, b) => a.getMonsters().length - b.getMonsters().length);
      break;
  }
  renderTeams();
}
