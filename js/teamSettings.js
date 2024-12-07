//Js code for teamControls page
import { useClickEvent } from "./common/useEvent.js";
import { serveData } from "./common/fetch.js";
import { renderIconWithNumber, averageValueIcon, imgAsBtn } from "./common/render.js";
import { load, save, remove } from "./common/utilities.js";
import { SELECTEDTEAMSETTINGS_LSK, TEAMS_LSK, CREDITS_LSK, ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { ALLMONSTERS_TTL } from "./common/ttl.js";
import { useCredits, addCredits } from "./common/credits.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { Team } from "./classes/Team.js";

const navigator = document.getElementById("prevNavigator");
const controlMessage = document.getElementById("controlMessage");
const controlBtns = document.getElementById("controlBtns");
const teamStats = document.getElementById("teamStatsConatiner");
const monstersContainer = document.getElementById("teamMonsters");
const spinner = document.getElementById("spinner");

let teams = load(TEAMS_LSK).map((t) => Team.fromJSON(t)) || [];
let userCredits = load(CREDITS_LSK);

let allMonsters = [];

let team;
let teamName;
let teamMonsters;
let teamCost;
let teamValue;
let isPaidFor;
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
  useData();
}

function render() {
  renderControls();
  renderNumMonstersIcon();
  renderTeamStats();
  renderMonsters();
}

function loadTeam() {
  const loadedTeam = load(SELECTEDTEAMSETTINGS_LSK);
  if (loadedTeam) {
    team = Team.fromJSON(loadedTeam);

    teamName = team.name;
    teamMonsters = team.monsters;
    teamCost = team.teamCost;
    isPaidFor = team.paidFor;
    numMonsters = teamMonsters.length;

    totalRank = team.totalRank;
    totalRating = team.totalRating;
    totalHealth = team.totalHealth;
    totalDamage = team.totalDamage;
  } else {
    navigate;
  }
}

async function useData() {
  const monsterData = await serveData("allMonsters", undefined, spinner, ALLMONSTERS_LSK, ALLMONSTERS_TTL);
  allMonsters = monsterData;

  team.setTeamValue(allMonsters);
  teamValue = team.teamValue;
}

function navigate() {
  window.location.href = "team.html";
}

function updateTeams() {
  save(TEAMS_LSK, teams);
  save(SELECTEDTEAMSETTINGS_LSK, team);
  userCredits = load(CREDITS_LSK);
  loadTeam();
  render();
}

async function shuffleTeam() {
  const randomMonsters = await serveData("randomMonsters", "num=4", monstersContainer);

  const selectedTeam = teams.find((t) => t.name === teamName);

  selectedTeam.setMonsters(randomMonsters);
  selectedTeam.setPaidFor(false);

  team.setMonsters(randomMonsters);
  team.setPaidFor(false);
  updateTeams();
}

function buyTeam() {
  const selectedTeam = teams.find((t) => t.name === teamName);

  selectedTeam.setPaidFor(true);
  team.setPaidFor(true);
  useCredits(teamCost);
  updateTeams();
}

function sellTeam() {
  teams = teams.filter((t) => t.name !== teamName);
  remove(SELECTEDTEAMSETTINGS_LSK);
  save(TEAMS_LSK, teams);
  addCredits(teamValue);
  setTimeout(() => {
    navigate();
  }, 100);
}

function renderControls() {
  controlBtns.innerHTML = "";

  const buyBtn = imgAsBtn(isPaidFor ? "sell" : "cart", isPaidFor ? `Sell '${teamName}' for ${teamCost} credits` : `Buy '${teamName}' for ${teamValue} credits`);
  const shuffleBtn = imgAsBtn("shuffle", `Fill '${teamName}' with 4 random monsters`);
  const fightBtn = imgAsBtn("shield", `Fight with '${teamName}'`);

  buyBtn.setAttribute("class", "controlBtn");
  shuffleBtn.setAttribute("class", "controlBtn");
  fightBtn.setAttribute("class", "controlBtn");

  buyBtn.addEventListener("click", () => {
    const buyIcon = buyBtn.getElementsByTagName("img")[0];
    const isUnchecked = !buyIcon.getAttribute("src").includes("check");

    if (isUnchecked) {
      if (isPaidFor) {
        setBtnIcon(buyIcon, "check", "Click to confirm");
        buyBtn.appendChild(renderIconWithNumber(teamValue, "../../res/icons/diamond.svg", ""));
      } else {
        if (numMonsters === 4) {
          if (teamCost <= userCredits) {
            setBtnIcon(buyIcon, "check", "Click to confirm");
            buyBtn.appendChild(renderIconWithNumber(teamCost, "../../res/icons/diamond.svg", ""));
          } else {
            setBtnIcon(buyIcon, "ban", "You don't have enough credits");
          }
        } else {
          setBtnIcon(buyIcon, "ban", "You must fill all 4 slots in your team before you can buy it");
        }
      }

      setTimeout(() => {
        const secondChild = buyBtn.children[1];
        if (secondChild) {
          secondChild.remove();
        }
        setBtnIcon(buyIcon, "cart", `Buy '${teamName}' for ${teamCost} credits`);
      }, 2000);
    } else {
      const secondChild = buyBtn.children[1];
      if (secondChild) {
        secondChild.remove();
      }
      if (isPaidFor) {
        sellTeam();
        setBtnIcon(buyIcon, "sell", `Sell '${teamName}' for ${teamCost} credits`);
      } else {
        buyTeam();
        setBtnIcon(buyIcon, "cart", `Buy '${teamName}' for ${teamCost} credits`);
      }
    }
  });

  shuffleBtn.addEventListener("click", () => {
    const shuffleIcon = shuffleBtn.getElementsByTagName("img")[0];
    const isUnchecked = !shuffleIcon.getAttribute("src").includes("check");

    if (isUnchecked) {
      setBtnIcon(shuffleIcon, "check", "Click to confirm");

      setTimeout(() => {
        setBtnIcon(shuffleIcon, "shuffle", `Fill '${teamName}' with 4 random monsters`);
      }, 2000);
    } else {
      shuffleTeam();
      setBtnIcon(shuffleIcon, "shuffle", `Fill '${teamName}' with 4 random monsters`);
    }
  });

  controlBtns.append(buyBtn, shuffleBtn, fightBtn);
}

function setBtnIcon(icon, src, altTitle) {
  icon.setAttribute("src", `../../res/icons/${src}.svg`);
  icon.setAttribute("alt", altTitle);
  icon.setAttribute("title", altTitle);
}

function renderNumMonstersIcon() {
  teamStats.innerHTML = "";

  const icon = renderIconWithNumber(numMonsters, "../../res/icons/skull.svg", `There is ${numMonsters} monsters in team '${teamName}'`);
  icon.classList.add("numMonstersIcon");
  teamStats.appendChild(icon);
}

function renderTeamStats() {
  teamStats.innerHTML = "";

  const averageRank = Math.floor(totalRank / numMonsters);
  const averageRating = Math.floor(totalRating / numMonsters);
  const averageHealth = Math.floor(totalHealth / numMonsters);
  const averageDamage = Math.floor(totalDamage / numMonsters);

  const rankIcon = renderIconWithNumber(totalRank, "../../res/icons/ribbon.svg", `Team '${teamName}' has a rank of ${totalRank}`);
  const ratingIcon = renderIconWithNumber(totalRating, "../../res/icons/trophy.svg", `Team '${teamName}' has a combinded rating of ${totalRating}`);
  const healthIcon = renderIconWithNumber(totalHealth, "../../res/icons/heart.svg", `Team '${teamName}' has ${totalHealth} in total health`);
  const damageIcon = renderIconWithNumber(totalDamage, "../../res/icons/barbell.svg", `Team '${teamName}' has ${totalDamage} in total damage`);
  const averageRankIcon = averageValueIcon(averageRank, "ribbon", "skull", `Team '${teamName}' has an average rank of ${averageRank}`);
  const averageRatingIcon = averageValueIcon(averageRating, "trophy", "skull", `Team '${teamName}' has an average rating of ${averageRating}`);
  const averageHealthIcon = averageValueIcon(averageHealth, "heart", "skull", `Team '${teamName}' has ${averageHealth} in average health`);
  const averageDamageIcon = averageValueIcon(averageDamage, "barbell", "skull", `Team '${teamName}' has ${averageDamage} in average damage`);

  rankIcon.classList.add("teamStatsIcon");
  ratingIcon.classList.add("teamStatsIcon");
  healthIcon.classList.add("teamStatsIcon");
  damageIcon.classList.add("teamStatsIcon");
  averageRankIcon.classList.add("teamAverageStatsIcon");
  averageRatingIcon.classList.add("teamAverageStatsIcon");
  averageHealthIcon.classList.add("teamAverageStatsIcon");
  averageDamageIcon.classList.add("teamAverageStatsIcon");

  teamStats.append(rankIcon, ratingIcon, healthIcon, damageIcon, averageRankIcon, averageRatingIcon, averageHealthIcon, averageDamageIcon);
}

function renderMonsters() {
  monstersContainer.innerHTML = "";

  if (teamMonsters) {
    teamMonsters.forEach((monster) => {
      const monsterCard = new MonsterCard(monster, [], true).assembleMonsterCard();
      monstersContainer.appendChild(monsterCard);
    });
  }
}
