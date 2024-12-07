//Js code for teamControls page
import { useClickEvent } from "./common/useEvent.js";
import { renderIconWithNumber } from "./common/render.js";
import { load } from "./common/utilities.js";
import { SELECTEDTEAMSETTINGS_LSK } from "./common/localStorageKeys.js";

const navigator = document.getElementById("prevNavigator");
const teamStatsContainer = document.getElementById("teamStatsConatiner");

let team;
let teamName;
let teamMonsters;
let numMonsters;

let totalRank;
let totalRating;
let totalHealth;
let totalDamage;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadTeam();
  render();
  useClickEvent(navigator, navigate);
}

function render() {
  renderNumMonstersIcon();
  renderTeamStats();
}

function loadTeam() {
  const loadedTeam = load(SELECTEDTEAMSETTINGS_LSK);
  if (loadedTeam) {
    team = loadedTeam;

    teamName = team.name;
    teamMonsters = team.monsters;
    numMonsters = teamMonsters.length;

    totalRank = team.totalRank;
    totalRating = team.totalRating;
    totalHealth = team.totalHealth;
    totalDamage = team.totalDamage;
  } else {
    navigate;
  }
}

function navigate() {
  window.location.href = "team.html";
}

function renderNumMonstersIcon() {
  const icon = renderIconWithNumber(numMonsters, "../../res/icons/skull.svg", `There is ${numMonsters} monsters in team '${teamName}'`);
  icon.classList.add("numMonstersIcon");
  teamStatsContainer.appendChild(icon);
}

function renderTeamStats() {
  const rankIcon = renderIconWithNumber(totalRank, "../../res/icons/trophy.svg", `Team '${teamName}' has a rank of ${totalRank}`);
  const ratingIcon = renderIconWithNumber(totalRating, "../../res/icons/trophy.svg", `Team '${teamName}' has a combinded rating of ${totalRating}`);
  const healthIcon = renderIconWithNumber(totalHealth, "../../res/icons/heart.svg", `Team '${teamName}' has ${totalHealth} in total health`);
  const damageIcon = renderIconWithNumber(totalDamage, "../../res/icons/barbell.svg", `Team '${teamName}' has ${totalDamage} in total damage`);

  rankIcon.classList.add("teamStatsIcon");
  ratingIcon.classList.add("teamStatsIcon");
  healthIcon.classList.add("teamStatsIcon");
  damageIcon.classList.add("teamStatsIcon");

  teamStatsContainer.append(rankIcon, ratingIcon, healthIcon, damageIcon);
}
