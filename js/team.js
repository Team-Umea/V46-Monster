//Js code for team page
import { Team } from "./classes/Team.js";
import { save, load, generateUniqueName } from "./common/utilities.js";
import { TEAMS_LSK, ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { serveData } from "./common/fetch.js";
import { ALLMONSTERS_TTL } from "./common/ttl.js";
import { TeamCard } from "./classes/TeamCard.js";

const teamsContainer = document.getElementById("teamsContainer");
const allMonstersCon = document.getElementById("allMonstersContainer");

let allMonsters = [];

const teamsArr = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  initCreateTeamForm();
  getAllMonsters();
}

async function getAllMonsters() {
  const monsterData = await serveData("allMonsters", undefined, allMonstersCon, ALLMONSTERS_LSK, ALLMONSTERS_TTL);
  const mappedData = monsterData.map((monster) => ({ monster: monster, visible: true }));

  allMonsters = mappedData;

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

function addTeam(teamName) {
  const newTeam = new Team(teamName);
  teamsArr.push(newTeam);
  updateTeams();
}

function updateTeams() {
  save(TEAMS_LSK, teamsArr);
  renderTeams();
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

function renderTeams() {
  teamsContainer.innerHTML = "";
  if (teamsArr.length > 0) {
    teamsArr.forEach((team) => {
      const teamName = team.getTeamName();
      const monsterInTeam = team.getMonsters();

      const teamCard = new TeamCard(teamName, monsterInTeam, allMonsters);

      const teamContainer = teamCard.teamContainer();
      const teamHeader = teamCard.teamHeader();
      const teamControls = teamCard.teamControls();
      const teamMonsters = teamCard.teamMonsters();

      teamContainer.appendChild(teamHeader);
      teamContainer.appendChild(teamControls);
      teamContainer.appendChild(teamMonsters);

      teamsContainer.appendChild(teamContainer);
    });
  }
}
