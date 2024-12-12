//Js code for team page
import { Team } from "./classes/Team.js";
import { isDigit, isLetter, capitalize, save, load, generateUniqueName, redirect } from "./common/utilities.js";
import { TEAMS_LSK, SELECTEDTEAMSETTINGS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { imgAsBtn, setBtnIcon, populateSelect, renderIconWithNumber } from "./common/render.js";
import { useInputEvent, useSubmitEvent, useChangeEvent, useClickEvent } from "./common/useEvent.js";
import { MonsterCard } from "./classes/MonsterCard.js";

const portalToggle = document.getElementById("portalToggle");
const actionContainer = document.getElementById("actionContainer");
const createTeamContainer = document.getElementById("createTeamContainer");
const teamsContainer = document.getElementById("teamsContainer");

let teamsArr = [];
let createTeamFormTimeout;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadTeams();
  sortTeams(0);
  renderTeams();
  useClickEvent(portalToggle, togglePortal);
  validateCreateTeam();
  filterTeams();
}

function togglePortal() {
  const isExtended = portalToggle.getAttribute("src").includes("upArrow");

  if (isExtended) {
    actionContainer.style.display = "none";
    portalToggle.setAttribute("src", "../../res/icons/downArrow.svg");
    portalToggle.setAttribute("alt", "Show team portal");
    portalToggle.setAttribute("title", "Show team portal");
  } else {
    actionContainer.style.display = "flex";
    portalToggle.setAttribute("src", "../../res/icons/upArrow.svg");
    portalToggle.setAttribute("alt", "Hide team portal");
    portalToggle.setAttribute("title", "Hide team portal");
  }
}

function validateCreateTeam() {
  const form = createTeamContainer.getElementsByTagName("form")[0];
  const input = createTeamContainer.getElementsByTagName("input")[0];
  const message = createTeamContainer.getElementsByTagName("p")[0];

  const checkInput = () => {
    message.innerText = "";
    message.setAttribute("class", "createTeamMessage hidden");

    const trimedValue = input.value.replace(/\s+/g, "");
    const lastCh = trimedValue.slice(-1).toLowerCase();
    input.value = trimedValue;

    if (!isDigit(lastCh) && !isLetter(lastCh)) {
      input.value = input.value.slice(0, -1);
      message.setAttribute("class", "createTeamMessage error");
      message.innerText = "Error! Only letters and digits allowed";

      clearTimeout(createTeamFormTimeout);

      createTeamFormTimeout = setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "createTeamMessage hidden");
      }, 3000);
    } else if (trimedValue.length > 20) {
      input.value = input.value.slice(0, -1);
      message.setAttribute("class", "createTeamMessage error");
      message.innerText = `Error! Max number of characters allowed in a team name is 20 (counting ${trimedValue.length})`;

      clearTimeout(createTeamFormTimeout);

      createTeamFormTimeout = setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "createTeamMessage hidden");
      }, 3000);
    }
  };

  const createTeam = () => {
    const teamName = input.value;
    input.value = "";

    if (teamName !== "" && teamName.length <= 20) {
      const teamNames = teamsArr.map((team) => team.name);
      const checkName = generateUniqueName(teamNames, teamName);

      let controlledName = "";

      if (checkName.noneUnique) {
        controlledName = capitalize(checkName.name);
        message.setAttribute("class", "createTeamMessage success");
        message.innerText = `${capitalize(teamName)} changed to ${controlledName} due to team name duplicates`;
      } else {
        controlledName = capitalize(teamName);
        message.setAttribute("class", "createTeamMessage success");
        message.innerText = `${controlledName} successfully created`;
      }
      addTeam(controlledName);
      setSortOrder();
    } else if (teamName === "") {
      message.setAttribute("class", "createTeamMessage error");
      message.innerText = "Error! Team name must not be empty";
    } else if (teamName.length > 20) {
      message.setAttribute("class", "createTeamMessage error");
      message.innerText = `Error! Max number of characters allowed in a team name is 20 (counting ${teamName.length})`;

      clearTimeout(createTeamFormTimeout);

      createTeamFormTimeout = setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "createTeamMessage hidden");
      }, 3000);
    }
    if (message.innerText !== "") {
      clearTimeout(createTeamFormTimeout);

      createTeamFormTimeout = setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "createTeamMessage hidden");
      }, 5000);
    }
  };

  useInputEvent(input, checkInput);
  useSubmitEvent(form, createTeam);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

function filterTeams() {
  const searchInput = document.getElementById("searchTeams");
  const sortSelect = document.getElementById("sortTeams");
  const sortOptions = ["A - Z", "Z - A", "Newest - Oldest", "Oldest - Newest", "Strongest - Weakest", "Weakest - Strongest", "Many - Few Battels", "Few - Many Battles", "High - Low Winrate", "Low - High Winrate", "Expensive - Cheap", "Cheap - Expensive", "Paid - Unpaid", "Unpaid - Paid", "Full - Empty", "Empty - Full"];

  populateSelect(sortSelect, sortOptions);

  useInputEvent(searchInput, searchTeams);
  useChangeEvent(sortSelect, setSortOrder);
}

function searchTeams() {
  const searchInput = document.getElementById("searchTeams");
  const searchQuery = searchInput.value.trim().toLowerCase();

  const matchingNames = (teamName) => {
    return teamName.toLowerCase().startsWith(searchQuery);
  };

  renderTeams(matchingNames);
}

function setSortOrder() {
  const sortSelect = document.getElementById("sortTeams");
  const sortOrder = Number(sortSelect.value);

  sortTeams(sortOrder);

  searchTeams();
}

function sortTeams(sortOrder) {
  let sortedTeams = [];

  switch (sortOrder) {
    case 0:
      sortedTeams = [...teamsArr].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      break;
    case 1:
      sortedTeams = [...teamsArr].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      break;
    case 2:
      sortedTeams = [...teamsArr].sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      break;
    case 3:
      sortedTeams = [...teamsArr].sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
      break;
    case 4:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const ratingDifference = b.totalRating - a.totalRating;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 5:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const ratingDifference = a.totalRating - b.totalRating;
        const rankDifference = ratingDifference === 0 ? a.totalRank - b.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 6:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const battleDifference = b.numBattels - a.numBattels;
        const ratingDifference = battleDifference === 0 ? b.totalRating - a.totalRating : battleDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 7:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const battleDifference = a.numBattels - b.numBattels;
        const ratingDifference = battleDifference === 0 ? b.totalRating - a.totalRating : battleDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 8:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const winRateDifference = b.winRate - a.winRate;
        const ratingDifference = winRateDifference === 0 ? b.totalRating - a.totalRating : winRateDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 9:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const winRateDifference = a.winRate - b.winRate;
        const ratingDifference = winRateDifference === 0 ? b.totalRating - a.totalRating : winRateDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 10:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const priceDifference = b.teamCost - a.teamCost;
        const ratingDifference = priceDifference === 0 ? b.totalRating - a.totalRating : priceDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 11:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const priceDifference = a.teamCost - b.teamCost;
        const ratingDifference = priceDifference === 0 ? b.totalRating - a.totalRating : priceDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 12:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const isPaidForDifference = Number(b.paidFor) - Number(a.paidFor);
        const ratingDifference = isPaidForDifference === 0 ? b.totalRating - a.totalRating : isPaidForDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 13:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const isPaidForDifference = Number(a.paidFor) - Number(b.paidFor);
        const ratingDifference = isPaidForDifference === 0 ? b.totalRating - a.totalRating : isPaidForDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 14:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const numMonsterDifference = b.monsters.length - a.monsters.length;
        const ratingDifference = numMonsterDifference === 0 ? b.totalRating - a.totalRating : numMonsterDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 15:
      sortedTeams = [...teamsArr].sort((a, b) => {
        const numMonsterDifference = a.monsters.length - b.monsters.length;
        const ratingDifference = numMonsterDifference === 0 ? b.totalRating - a.totalRating : numMonsterDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    default:
      break;
  }

  if (sortedTeams.length > 0) {
    teamsArr = sortedTeams;
  }
}

function loadTeams() {
  const loadedTeams = load(TEAMS_LSK);
  if (loadedTeams) {
    loadedTeams.forEach((loadedTeam) => {
      teamsArr.push(Team.fromJSON(loadedTeam));
    });
    renderTeams();
  }
}

function updateTeams() {
  save(TEAMS_LSK, teamsArr);
}

function addTeam(teamName) {
  const newTeam = new Team(teamName);
  teamsArr.push(newTeam);
  updateTeams();
  renderTeams();
}

function redirectToSettingsPage(team) {
  save(SELECTEDTEAMSETTINGS_LSK, team);
  setTimeout(() => {
    window.location.href = "teamSettings.html";
  }, 100);
}

function renderTeams(condition) {
  teamsContainer.innerHTML = "";

  if (teamsArr) {
    teamsContainer.setAttribute("class", "teamsContainer");
    teamsArr.forEach((team) => {
      const teamName = team.name;
      const teamMonsters = team.monsters;
      const numTeamMonsters = teamMonsters.length;
      const isPaidFor = team.paidFor;
      const isVisible = team.isVisible;

      const teamCard = document.createElement("div");
      const quickInfo = document.createElement("div");
      const numMonstersIcon = renderIconWithNumber(numTeamMonsters, "../../res/icons/skull.svg", `There is ${numTeamMonsters} in team '${teamName}'`, "right");
      const paidStatus = document.createElement("div");
      const heading = document.createElement("div");
      const header = document.createElement("h2");
      const fightBtn = imgAsBtn("shield", `Fight with '${teamName}'`);
      const settingsBtn = imgAsBtn("settings", `View settings and stats for '${teamName}'`);
      const toggleBtn = imgAsBtn(isVisible ? "upArrow" : "downArrow", isVisible ? `Hide Monsters in team '${teamName}'` : `Show Monsters in team '${teamName}'`);

      const body = document.createElement("div");
      const monsters = document.createElement("div");

      teamCard.setAttribute("class", "teamCard");
      quickInfo.setAttribute("class", "quickInfo");
      numMonstersIcon.classList.add("numMonstersIcon");
      paidStatus.setAttribute("class", `paidStatus ${isPaidFor ? "paid" : "unPaid"}`);
      heading.setAttribute("class", "cardHeading");
      header.setAttribute("class", "cardHeader");
      fightBtn.setAttribute("class", "primary-btn fight");
      settingsBtn.setAttribute("class", "primary-btn settings");
      toggleBtn.setAttribute("class", "primary-btn toggle");
      body.setAttribute("class", isVisible ? "cardBody" : "cardBody hidden");
      monsters.setAttribute("class", "cardMonsters");

      paidStatus.setAttribute("title", `${isPaidFor ? `Team '${teamName}' is bought` : `Team '${teamName}' is not bought`}`);

      if (condition !== undefined && condition !== null) {
        if (typeof condition === "function") {
          if (condition(teamName) === false) {
            teamCard.classList.add("hidden");
          }
        } else {
          if (condition === false) {
            teamCard.classList.add("hidden");
          }
        }
      }

      header.innerText = teamName;

      fightBtn.addEventListener("click", () => {
        save(SELECTEDFIGHTTEAM_LSK, team);
        setTimeout(() => {
          redirect("fight.html");
        }, 100);
      });

      settingsBtn.addEventListener("click", () => {
        redirectToSettingsPage(team);
      });

      toggleBtn.addEventListener("click", () => {
        const toggleIcon = toggleBtn.getElementsByTagName("img")[0];
        const isExtended = toggleIcon.getAttribute("src").includes("downArrow");

        if (isExtended) {
          body.setAttribute("class", "cardBody");
          setBtnIcon(toggleIcon, "upArrow", `Hide Monsters in team '${teamName}'`);
        } else {
          body.setAttribute("class", "cardBody hidden");
          setBtnIcon(toggleIcon, "downArrow", `Show Monsters in team '${teamName}'`);
        }

        team.isVisible = !team.isVisible;
        updateTeams();
      });

      teamMonsters.forEach((monster) => {
        const monsterCard = new MonsterCard(monster, [], true).assembleMonsterCard();
        monsters.appendChild(monsterCard);
      });

      quickInfo.append(numMonstersIcon, paidStatus);

      heading.appendChild(header);

      if (numTeamMonsters > 0) {
        heading.appendChild(toggleBtn);
      }

      if (isPaidFor && numTeamMonsters > 0) {
        heading.appendChild(fightBtn);
      }

      heading.appendChild(settingsBtn);

      body.append(monsters);

      teamCard.appendChild(quickInfo);
      teamCard.appendChild(heading);

      if (numTeamMonsters > 0) {
        teamCard.appendChild(body);
      }

      teamsContainer.appendChild(teamCard);
    });
  } else {
    teamsContainer.setAttribute("class", "teamsContainer hidden");
  }
}
