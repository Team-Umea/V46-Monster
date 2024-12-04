//Js code for team page
import { Team } from "./classes/Team.js";
import { save, load, generateUniqueName } from "./common/utilities.js";
import { TEAMS_LSK, ALLMONSTERS_LSK, CREDITS_LSK } from "./common/localStorageKeys.js";
import { serveData } from "./common/fetch.js";
import { ALLMONSTERS_TTL } from "./common/ttl.js";
import { TeamCard } from "./classes/TeamCard.js";
import { TeamStat } from "./classes/TeamStats.js";
import { ConfirmModule } from "./classes/ConfirmModule.js";
import { useCredits, addCredits } from "./common/credits.js";
import { useClickEvent } from "./common/useEvent.js";

const teamsContainer = document.getElementById("teamsContainer");
const allMonstersContainer = document.createElement("div");

const teamStatsContainer = document.getElementById("teamStatsContainer");
const teamStatsToggle = document.getElementById("teamStatsToggle");
const teamStatsList = document.getElementById("teamStatsList");

let allMonsters = [];
let teamsArr = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  initCreateTeamForm();
  getAllMonsters();

  useClickEvent(teamStatsToggle, toggleTeamStats);
}

async function getAllMonsters() {
  const monsterData = await serveData("allMonsters", undefined, allMonstersContainer, ALLMONSTERS_LSK, ALLMONSTERS_TTL);
  const mappedData = monsterData.map((monster) => ({ monster: monster, visible: true }));

  allMonsters = mappedData;

  loadTeams();
  renderTeams();
  renderTeamStats();
  setTeamsValue();
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
  renderTeams();
  renderTeamStats();
}

function setTeamsValue() {
  teamsArr.forEach((team) => {
    team.setTeamValue(allMonsters);
  });
}

function addTeam(teamName) {
  const newTeam = new Team(teamName);
  teamsArr.push(newTeam);
  updateTeams();
}

function sellTeam(teamName) {
  const team = teamsArr.find((team) => team.getTeamName() === teamName);
  const profit = team.getTeamProfit();
  addCredits(profit);

  const filteredTeams = [...teamsArr].filter((team) => team.getTeamName() !== teamName);
  teamsArr = filteredTeams;
  updateTeams();
}

function buyTeam(teamName) {
  const userCredits = load(CREDITS_LSK);

  if (userCredits) {
    const team = teamsArr.find((t) => t.getTeamName() === teamName);
    const teamCost = team.getTeamCost();
    const numMonsters = team.getMonsters().length;

    if (numMonsters === 4 && userCredits >= teamCost) {
      team.setPaidFor(true);
      const usedCredits = teamCost;
      useCredits(usedCredits);
      updateTeams();
    }
  }
}

async function shuffleTeam(teamName) {
  const team = teamsArr.find((t) => t.getTeamName() === teamName);
  team.setPaidFor(false);

  const randomMonsters = await serveData("randomMonsters", "num=4", teamsContainer);
  team.setMonsters(randomMonsters);
  team.setPaidFor(false);
  updateTeams();
}

function removeMonster(teamName, id) {
  const team = teamsArr.find((t) => t.getTeamName() === teamName);
  team.deleteMonster(id);
  updateTeams();
}

function deleteTeam(teamName) {
  const filteredTeams = [...teamsArr].filter((team) => team.getTeamName() !== teamName);
  teamsArr = filteredTeams;
  updateTeams();
}

function showModuleOnTeamDelete(teamName) {
  new ConfirmModule("Warning!", `Are you sure that you want to delete team '${teamName}'. This action can't be undone`, teamName, deleteTeam);
}

function toggleTeamStats() {
  const src = teamStatsToggle.getAttribute("src");
  const isExtended = src.includes("rightArrow");

  if (isExtended) {
    teamStatsToggle.setAttribute("src", "../../res/icons/leftArrow.svg");
    teamStatsToggle.setAttribute("alt", "Hide team stats");
    teamStatsToggle.setAttribute("title", "Hide team stats");
    teamStatsContainer.setAttribute("class", "teamStatsContainer extended");
  } else {
    teamStatsToggle.setAttribute("src", "../../res/icons/rightArrow.svg");
    teamStatsToggle.setAttribute("alt", "Show team stats");
    teamStatsToggle.setAttribute("title", "Show team stats");
    teamStatsContainer.setAttribute("class", "teamStatsContainer collapsed");
  }
}

function renderTeams() {
  teamsContainer.innerHTML = "";

  if (teamsArr) {
    teamsContainer.setAttribute("class", "teamsContainer");
    teamsArr.forEach((team) => {
      const teamCard = new TeamCard(team, allMonsters, updateTeams, sellTeam, buyTeam, shuffleTeam, showModuleOnTeamDelete, removeMonster);

      const teamContainer = teamCard.teamContainer();
      const teamHeaderContainer = teamCard.teamHeaderContainer();
      const teamSell = teamCard.teamSell();
      const teamHeader = teamCard.teamHeader();
      const teamToggle = teamCard.teamToggle();
      const teamBodyContainer = teamCard.teamBodyContainer();
      const teamMessage = teamCard.getTeamMsg();
      const teamControls = teamCard.teamControls();
      const teamMonsters = teamCard.teamMonsters();

      teamHeaderContainer.appendChild(teamSell);
      teamHeaderContainer.appendChild(teamHeader);
      teamHeaderContainer.appendChild(teamToggle);

      teamBodyContainer.appendChild(teamMessage);
      teamBodyContainer.appendChild(teamControls);
      teamBodyContainer.appendChild(teamMonsters);

      teamContainer.appendChild(teamHeaderContainer);
      teamContainer.appendChild(teamBodyContainer);

      teamsContainer.appendChild(teamContainer);
    });
  } else {
    teamsContainer.setAttribute("class", "teamsContainer hidden");
  }
}

function renderTeamStats() {
  teamStatsList.innerHTML = "";

  if (teamsArr) {
    teamsArr.forEach((team) => {
      const teamStat = new TeamStat(team, updateTeams);

      const teamStatContainer = teamStat.container();
      const teamStatHeaderContainer = teamStat.headerContainer();
      const teamStatHeader = teamStat.header();
      const teamStatToggle = teamStat.toggle();
      const teamStatBodyContainer = teamStat.bodyContainer();
      const teamStatTopStats = teamStat.topStats();
      const teamStatAverageStats = teamStat.averageStats();
      // const teamStatRating = teamStat.teamRating();

      teamStatHeaderContainer.appendChild(teamStatHeader);
      teamStatHeaderContainer.appendChild(teamStatToggle);

      teamStatBodyContainer.appendChild(teamStatTopStats);
      teamStatBodyContainer.appendChild(teamStatAverageStats);
      // teamStatBodyContainer.appendChild(teamStatRating);

      teamStatContainer.appendChild(teamStatHeaderContainer);
      teamStatContainer.appendChild(teamStatBodyContainer);

      teamStatsList.appendChild(teamStatContainer);
    });
  }
}
