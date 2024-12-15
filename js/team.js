//Js code for team page
import { Team } from "./classes/Team.js";
import { isDigit, isLetter, capitalize, save, load, generateUniqueName, redirect, sortTeams } from "./common/utilities.js";
import { TEAMS_LSK, SELECTEDTEAMSETTINGS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { imgAsBtn, setBtnIcon, populateSelect, renderIconWithNumber } from "./common/render.js";
import { useInputEvent, useSubmitEvent, useChangeEvent, useClickEvent } from "./common/useEvent.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { user, updateUser } from "./common/user.js";

const portalToggle = document.getElementById("portalToggle");
const actionContainer = document.getElementById("actionContainer");
const createTeamContainer = document.getElementById("createTeamContainer");
const teamsContainer = document.getElementById("teamsContainer");

let teams = [];
let createTeamFormTimeout;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  togglePortalOnRefresh();
  loadTeams();
  teams = sortTeams(teams, user.teamSort || 0);
  renderTeams();
  useClickEvent(portalToggle, togglePortal);
  validateCreateTeam();
  filterTeams();
}

function togglePortalOnRefresh() {
  if (user.teamPortalVisible) {
    actionContainer.style.display = "flex";
    portalToggle.setAttribute("src", "../../res/icons/upArrow.svg");
    portalToggle.setAttribute("alt", "Hide team portal");
    portalToggle.setAttribute("title", "Hide team portal");
  } else {
    actionContainer.style.display = "none";
    portalToggle.setAttribute("src", "../../res/icons/downArrow.svg");
    portalToggle.setAttribute("alt", "Show team portal");
    portalToggle.setAttribute("title", "Show team portal");
  }
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

  updateUser("teamPortalVisible", !isExtended);
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
      const teamNames = teams.map((team) => team.name);
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

  sortSelect.value = user.teamSort || 0;

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

  updateUser("teamSort", sortOrder);
  teams = sortTeams(teams, sortOrder);

  searchTeams();
}

function loadTeams() {
  const loadedTeams = load(TEAMS_LSK);
  if (loadedTeams) {
    loadedTeams.forEach((loadedTeam) => {
      teams.push(Team.fromJSON(loadedTeam));
    });
    renderTeams();
  }
}

function updateTeams() {
  save(TEAMS_LSK, teams);
}

function addTeam(teamName) {
  const newTeam = new Team(teamName);
  teams.push(newTeam);
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

  if (teams) {
    teamsContainer.setAttribute("class", "teamsContainer");
    teams.forEach((team) => {
      const teamName = team.name;
      const teamMonsters = team.monsters;
      const teamRating = team.totalRating;
      const numTeamMonsters = teamMonsters.length;
      const winRate = `${team.winRate}%`;
      const teamCost = team.teamCost;
      const isPaidFor = team.paidFor;
      const isVisible = team.isVisible;

      const teamCard = document.createElement("div");
      const quickInfo = document.createElement("div");
      const teamRatingIcon = renderIconWithNumber(teamRating, "../../res/icons/trophy.svg", `Team '${teamName}' has a rating of ${teamRating}`, "right");
      const numMonstersIcon = renderIconWithNumber(numTeamMonsters, "../../res/icons/skull.svg", `There is ${numTeamMonsters} monsters in team '${teamName}'`, "right");
      const winRateIcon = renderIconWithNumber(winRate, "../../res/icons/rate.svg", `Team '${teamName}' has a winrate of ${winRate}`, "right");
      const teamCostIcon = renderIconWithNumber(teamCost, "../../res/icons/diamond.svg", `Totalt cost of team '${teamName}' is ${teamCost} credits`, "right");

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
      teamRatingIcon.classList.add("teamRatingIcon", "icon");
      numMonstersIcon.classList.add("numMonstersIcon", "icon");
      winRateIcon.classList.add("winRateIcon", "icon");
      teamCostIcon.classList.add("teamCostIcon", "icon");
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
        const monsterCard = new MonsterCard(monster, undefined, true).assembleMonsterCard();
        monsters.appendChild(monsterCard);
      });

      quickInfo.append(teamRatingIcon, numMonstersIcon, winRateIcon, teamCostIcon, paidStatus);

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
