//Js code for team page
import { Team } from "./classes/Team.js";
import { isDigit, isLetter, capitalize, save, load, generateUniqueName, redirect } from "./common/utilities.js";
import { TEAMS_LSK, SELECTEDTEAMSETTINGS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { imgAsBtn, setBtnIcon, populateSelect } from "./common/render.js";
import { useInputEvent, useSubmitEvent } from "./common/useEvent.js";
import { MonsterCard } from "./classes/MonsterCard.js";

const createTeamContainer = document.getElementById("createTeamContainer");
const teamsContainer = document.getElementById("teamsContainer");

let teamsArr = [];
let createTeamFormTimeout;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadTeams();
  renderTeams();
  validateCreateTeam();
  filterTeams();
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
  const sortSelect = document.getElementById("sortTeams");
  const sortOptions = ["A - Z", "Z - A", "Newest - Oldest", "Oldest - Newest", "Strongest - Weakest", "Weakest - Strongest", "Many - Few Battels", "Few - Many Battles", "High - Low Winrate", "Low - High Winrate", "Expensive - Cheap", "Cheap - Expensive", "Paid - Unpaid", "Unpaid - Paid", "Full - Empty", "Empty - Full"];

  populateSelect(sortSelect, sortOptions);
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

function renderTeams() {
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
      const heading = document.createElement("div");
      const header = document.createElement("h2");

      const fightBtn = imgAsBtn("shield", `Fight with '${teamName}'`);
      const settingsBtn = imgAsBtn("settings", `View settings and stats for '${teamName}'`);
      const toggleBtn = imgAsBtn(isVisible ? "upArrow" : "downArrow", isVisible ? `Hide Monsters in team '${teamName}'` : `Show Monsters in team '${teamName}'`);

      const body = document.createElement("div");
      const monsters = document.createElement("div");

      teamCard.setAttribute("class", "teamCard");
      heading.setAttribute("class", "cardHeading");
      header.setAttribute("class", "cardHeader");
      fightBtn.setAttribute("class", "primary-btn fight");
      settingsBtn.setAttribute("class", "primary-btn settings");
      toggleBtn.setAttribute("class", "primary-btn toggle");
      body.setAttribute("class", isVisible ? "cardBody" : "cardBody hidden");
      monsters.setAttribute("class", "cardMonsters");

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

      heading.appendChild(header);

      if (isPaidFor && numTeamMonsters > 0) {
        heading.appendChild(fightBtn);
      }

      heading.appendChild(settingsBtn);

      if (numTeamMonsters > 0) {
        heading.appendChild(toggleBtn);
      }

      body.append(monsters);

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
