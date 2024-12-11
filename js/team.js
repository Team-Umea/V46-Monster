//Js code for team page
import { Team } from "./classes/Team.js";
import { save, load, generateUniqueName, redirect } from "./common/utilities.js";
import { TEAMS_LSK, SELECTEDTEAMSETTINGS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { imgAsBtn, setBtnIcon } from "./common/render.js";
import { MonsterCard } from "./classes/MonsterCard.js";

const teamsContainer = document.getElementById("teamsContainer");

let teamsArr = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  initCreateTeamForm();

  loadTeams();
  renderTeams();
}

function initCreateTeamForm() {
  const container = document.getElementById("createTeam");
  const form = container.getElementsByTagName("form")[0];
  const input = container.getElementsByTagName("input")[0];
  const message = container.getElementsByTagName("p")[0];

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
      const checkName = generateUniqueName(teamsArr, teamName);

      let controlledName = "";

      if (checkName.nonUnique) {
        controlledName = checkName.name;
        message.setAttribute("class", "success");
        message.innerText = `${teamName} successfully changed to ${controlledName} due to team name duplicates`;
      } else {
        controlledName = teamName;
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
      const controls = document.createElement("div");

      const fightBtn = imgAsBtn("shield", `Fight with '${teamName}'`);
      const settingsBtn = imgAsBtn("settings", `View settings and stats for '${teamName}'`);
      const toggleBtn = imgAsBtn(isVisible ? "upArrow" : "downArrow", isVisible ? `Hide '${teamName}'` : `Show '${teamName}'`);

      const body = document.createElement("div");
      const monsters = document.createElement("div");

      teamCard.setAttribute("class", "teamCard");
      heading.setAttribute("class", "cardHeading");
      header.setAttribute("class", "cardHeader");
      controls.setAttribute("class", "cardControls");
      fightBtn.setAttribute("class", "primary-btn");
      settingsBtn.setAttribute("class", "primary-btn");
      toggleBtn.setAttribute("class", "primary-btn");
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
          setBtnIcon(toggleIcon, "upArrow", "Hide Elements");
        } else {
          body.setAttribute("class", "cardBody hidden");
          setBtnIcon(toggleIcon, "downArrow", "Show Elements");
        }

        team.isVisible = !team.isVisible;
        updateTeams();
      });

      teamMonsters.forEach((monster) => {
        const monsterCard = new MonsterCard(monster, [], true).assembleMonsterCard();
        monsters.appendChild(monsterCard);
      });

      if (isPaidFor && numTeamMonsters > 0) {
        controls.appendChild(fightBtn);
      }

      controls.appendChild(settingsBtn);

      if (numTeamMonsters > 0) {
        controls.appendChild(toggleBtn);
      }

      heading.append(header, controls);
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
