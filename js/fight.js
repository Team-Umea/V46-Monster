//Js code for fight page
import { TEAMS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { load } from "./common/utilities.js";
import { serveData } from "./common/fetch.js";
import { Team } from "./classes/Team.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { MonsterFighCard } from "./classes/MonsterFighCard.js";
import { valueWithHeader, progressBar } from "./common/render.js";

const teamsStatsContainer = document.getElementById("teamsStatsContainer");
const teamOneContainer = document.getElementById("teamOne");
const teamTwoContainer = document.getElementById("teamTwo");

const teams = load(TEAMS_LSK) || [];
const selectedTeam = load(SELECTEDFIGHTTEAM_LSK) || null;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  //*
  render();
}

function render() {
  renderTeam(teams[0], teamOneContainer);
  renderTeam(teams[1], teamTwoContainer);
}

function renderTeamStats(parent, team) {
  const container = document.createElement("div");
  const battleContainer = document.createElement("div");
  const fightContainer = document.createElement("div");
  const roundContainer = document.createElement("div");

  container.setAttribute("class", "teamStatsContainer");
  battleContainer.setAttribute("class", "battleStatsContainer statsContainer");
  fightContainer.setAttribute("class", "fightStatsContainer statsContainer");
  roundContainer.setAttribute("class", "roundStatsContainer statsContainer");

  const numBattelsEl = valueWithHeader(team.numBattels, "Battels");
  const winRateEl = valueWithHeader(team.winRate, "Winrate");
  const wonBattlesEl = valueWithHeader(team.wonBattels, "Won");
  const drawnBattelsEl = valueWithHeader(team.drawnBattels, "Drawn");
  const lostBattelsEl = valueWithHeader(team.lostBattels, "Lost");
  const pointsEl = valueWithHeader(team.totalPoints, "Points");

  const numFightsEl = valueWithHeader(team.numFights, "Fights");
  const wonFightsEl = valueWithHeader(team.wonFights, "Won");
  const drawnFightsEl = valueWithHeader(team.drawnFights, "Drawn");
  const lostFightsEl = valueWithHeader(team.lostFights, "Lost");

  const numRoundsEl = valueWithHeader(team.numRounds, "Rounds");
  const wonRounsEl = valueWithHeader(team.wonRounds, "Won");
  const drawnRoundsEl = valueWithHeader(team.drawnRounds, "Drawn");
  const lostRoundsEl = valueWithHeader(team.lostRounds, "Lost");

  numBattelsEl.classList.add("teamStat");
  winRateEl.classList.add("teamStat");
  wonBattlesEl.classList.add("teamStat");
  drawnBattelsEl.classList.add("teamStat");
  lostBattelsEl.classList.add("teamStat");
  pointsEl.classList.add("teamStat");
  numFightsEl.classList.add("teamStat");
  wonFightsEl.classList.add("teamStat");
  drawnFightsEl.classList.add("teamStat");
  lostFightsEl.classList.add("teamStat");
  numRoundsEl.classList.add("teamStat");
  wonRounsEl.classList.add("teamStat");
  drawnRoundsEl.classList.add("teamStat");
  lostRoundsEl.classList.add("teamStat");

  battleContainer.append(numBattelsEl, winRateEl, wonBattlesEl, drawnBattelsEl, lostBattelsEl, pointsEl);
  fightContainer.append(numFightsEl, wonFightsEl, drawnFightsEl, lostFightsEl);
  roundContainer.append(numRoundsEl, wonRounsEl, drawnRoundsEl, lostRoundsEl);

  container.append(battleContainer, fightContainer, roundContainer);

  parent.appendChild(container);
}

function renderTeam(team, container) {
  const teamNameHeader = container.children[0];
  const teamStatsContainer = container.children[1];
  const teamContainer = container.children[2];
  const fightRecordContainer = container.children[3];
  const monsterStatsContainer = teamContainer.children[0];
  const monsterContainer = teamContainer.children[1];

  if (team) {
    const teamName = team.name;
    const monsters = team.monsters;

    monsterContainer.innerHTML = "";
    teamNameHeader.innerText = teamName;

    const carousel = document.createElement("div");

    carousel.setAttribute("class", "carousel");

    monsters.forEach((monster, index) => {
      fightRecordContainer.innerHTML = "";
      const monsterCard = new MonsterFighCard(monster).card();
      const carouselBtn = document.createElement("button");

      carouselBtn.setAttribute("class", `${index === 0 ? "carouselBtn carouselBtn-checked" : "carouselBtn"}`);

      if (index === 0) {
        renderMonsterStats(monsterStatsContainer, monster);
      }

      renderMonstersFought(fightRecordContainer, "Won against", monster.wonAgainst);
      renderMonstersFought(fightRecordContainer, "Drawn against", monster.drawnAgainst);
      renderMonstersFought(fightRecordContainer, "Lost against", monster.lostAgainst);

      monsterContainer.appendChild(monsterCard);
      carousel.appendChild(carouselBtn);
    });

    const carouselBtns = Array.from(carousel.children);
    const monsterCards = Array.from(monsterContainer.children);

    carouselBtns.forEach((carouselBtn) => {
      const index = carouselBtns.indexOf(carouselBtn);
      const monster = monsters[index];

      carouselBtn.addEventListener("click", () => {
        fightRecordContainer.innerHTML = "";
        carouselBtns.forEach((btn) => btn.setAttribute("class", "carouselBtn"));
        monsterCards.forEach((montserCard) => montserCard.setAttribute("class", "monsterFighCard opa-0"));

        carouselBtn.setAttribute("class", "carouselBtn carouselBtn-checked");

        const monsterCard = monsterContainer.children[index];

        if (monsterCard) {
          monsterCard.setAttribute("class", "monsterFighCard opa-1");
        }

        renderMonsterStats(monsterStatsContainer, monster);
        renderMonstersFought(fightRecordContainer, "Won against", monster.wonAgainst);
        renderMonstersFought(fightRecordContainer, "Drawn against", monster.drawnAgainst);
        renderMonstersFought(fightRecordContainer, "Lost against", monster.lostAgainst);
      });
    });

    container.appendChild(carousel);
  }
  renderTeamStats(teamStatsContainer, team);
}

function renderMonsterStats(container, monster) {
  container.innerHTML = "";

  const allStats = document.createElement("div");
  const mainStats = document.createElement("div");
  const fightStats = document.createElement("div");
  const roundStats = document.createElement("div");

  const lostHealth = monster.lostHP;
  const remainingHP = monster.percentHP;
  const sufferedDamage = monster.sufferedDamage;
  const distributedDamage = monster.distributedDamage;
  const numFights = monster.numFights;
  const wonFights = monster.wonFights;
  const drawnFights = monster.drawnFights;
  const lostFights = monster.lostFights;
  const points = monster.points;
  const numRounds = monster.numRounds;
  const wonRounds = monster.numRounds;
  const drawnRounds = monster.drawnRounds;
  const lostRounds = monster.lostRounds;
  const winRate = monster.winRate;

  const lostHealthEl = valueWithHeader(lostHealth, "Lost health");
  const remainingHPEl = valueWithHeader(remainingHP, "Remaining health");
  const sufferedDamageEl = valueWithHeader(sufferedDamage, "Suffered damage");
  const distributedDamageEl = valueWithHeader(distributedDamage, "Distributed damage");
  const numFightsEl = valueWithHeader(numFights, "Fights");
  const wonFightsEl = valueWithHeader(wonFights, "Won");
  const drawnFightsEl = valueWithHeader(drawnFights, "Drawn");
  const lostFightsEl = valueWithHeader(lostFights, "Lost");
  const pointsEl = valueWithHeader(points, "Points");
  const numRoundsEl = valueWithHeader(numRounds, "Rounds");
  const wonRoundsEl = valueWithHeader(wonRounds, "Won");
  const drawnRoundsEl = valueWithHeader(drawnRounds, "Drawn");
  const lostRoundsEl = valueWithHeader(lostRounds, "Lost");
  const winRateEl = valueWithHeader(winRate, "Winrate");
  const fightBar = progressBar(wonFights, drawnFights, lostFights);
  const roundBar = progressBar(wonRounds, drawnRounds, lostRounds);

  allStats.setAttribute("class", "monsterAllStats");
  mainStats.setAttribute("class", "mainStats");
  fightStats.setAttribute("class", "fightStats generalStats");
  roundStats.setAttribute("class", "roundsStats generalStats");

  lostHealthEl.classList.add("monsterStat");
  remainingHPEl.classList.add("monsterStat");
  sufferedDamageEl.classList.add("monsterStat");
  distributedDamageEl.classList.add("monsterStat");
  numFightsEl.classList.add("generalStat");
  wonFightsEl.classList.add("generalStat");
  drawnFightsEl.classList.add("generalStat");
  lostFightsEl.classList.add("generalStat");
  pointsEl.classList.add("generalStat");
  numRoundsEl.classList.add("generalStat");
  wonRoundsEl.classList.add("generalStat");
  drawnRoundsEl.classList.add("generalStat");
  lostRoundsEl.classList.add("generalStat");
  winRateEl.classList.add("generalStat");
  fightBar.classList.add("fightBar", "statsBar");
  roundBar.classList.add("roundBar", "statsBar");

  mainStats.append(lostHealthEl, remainingHPEl, sufferedDamageEl, distributedDamageEl);

  fightStats.append(numFightsEl, wonFightsEl, drawnFightsEl, lostFightsEl, pointsEl);
  roundStats.append(numRoundsEl, wonRoundsEl, drawnRoundsEl, lostRoundsEl, winRateEl);

  allStats.append(mainStats, fightStats, fightBar, roundStats, roundBar);

  container.appendChild(allStats);
}

function renderMonstersFought(parent, headerText, record) {
  const container = document.createElement("div");
  const header = document.createElement("h2");
  const recordList = document.createElement("ul");

  container.setAttribute("class", "fightRecord");
  header.setAttribute("class", "fightRecordHeader");
  recordList.setAttribute("class", "fightRecordList");

  header.innerText = headerText;

  record.forEach((rec) => {
    const recordItem = document.createElement("li");

    recordItem.setAttribute("class", "recordItem");
    recordItem.innerText = rec;
    recordList.appendChild(recordItem);
  });

  container.append(header, recordList);
  parent.appendChild(container);
}

// const fightContainer = document.getElementById("fightContainer");
// const fightBtn = document.getElementById("fightBtn");
// const team1Selector = document.getElementById("team1Selector");
// const team2Selector = document.getElementById("team2Selector");
// let teams = [];

// async function exampleFight() {
//   let team1 = await createRandomTeam(3, 4);
//   let team2 = await createRandomTeam(3, 4);
//   let param = await buildParam(team1, team2);

//   const data = await serveData("fight", param, fightContainer);
//   console.log(data);

//   let fightWinner = document.createElement("h2");
//   fightWinner.setAttribute("class", "winner");
//   fightWinner.innerText = `${data["teamWon"]} won!`;

//   // Create separate containers for Team 1 and Team 2 details
//   let team1Details = `<div class="team-details"><h3>Team 1</h3>`;
//   team1Details += `
//         <div class="detail"><strong>Battle ID:</strong> ${data.battleID}</div>
//         <div class="detail"><strong>Team Points:</strong> ${data.team1Points}</div>
//         <div class="detail"><strong>Remaining HP:</strong></div>
//     `;

//   // Loop through Remaining HP for Team 1
//   for (const monster in data.remainingHP.team1) {
//     const hp = data.remainingHP.team1[monster].hp;
//     team1Details += `<div class="detail">${monster} has ${hp} HP</div>`;
//   }

//   // Append Team Stats for Team 1
//   team1Details += `<div class="detail"><strong>Team Stats:</strong></div>`;
//   const monsterStats1 = data.teamStats.team1.monsterStats;
//   for (const monster of monsterStats1) {
//     team1Details += `<div class="detail">Monster: ${monster.name}, Health: ${monster.health}, Damage: ${monster.damage}</div>`;
//   }
//   team1Details += `</div>`; // Close Team 1 details div

//   // Create separate container for Team 2 details
//   let team2Details = `<div class="team-details"><h3>Team 2</h3>`;
//   team2Details += `
//         <div class="detail"><strong>Team Points:</strong> ${data.team2Points}</div>
//         <div class="detail"><strong>Remaining HP:</strong></div>
//     `;

//   // Loop through Remaining HP for Team 2
//   for (const monster in data.remainingHP.team2) {
//     const hp = data.remainingHP.team2[monster].hp;
//     team2Details += `<div class="detail">${monster} has ${hp} HP</div>`;
//   }

//   // Append Team Stats for Team 2
//   team2Details += `<div class="detail"><strong>Team Stats:</strong></div>`;
//   const monsterStats2 = data.teamStats.team2.monsterStats;
//   for (const monster of monsterStats2) {
//     team2Details += `<div class="detail">Monster: ${monster.name}, Health: ${monster.health}, Damage: ${monster.damage}</div>`;
//   }
//   team2Details += `</div>`; // Close Team 2 details div

//   // Update the innerHTML of the fightContainer
//   fightContainer.innerHTML += team1Details + team2Details;

//   // Append Team Won information
//   fightContainer.innerHTML += `<div class="detail"><strong>Team Won:</strong> ${data.teamWon}</div>`;

//   // Append the fight winner
//   fightContainer.append(fightWinner);

//   console.log(fightWinner);
// }

// window.addEventListener("DOMContentLoaded", () => {
//   init();
// });

// function init() {
//   loadTeams();
//   addTeamsToSelect();
//   exampleFight();
// }

// function loadTeams() {
//   const loadedTeams = load(TEAMS_LSK);
//   if (loadedTeams) {
//     loadedTeams.forEach((loadedTeam) => {
//       teams.push(Team.fromJSON(loadedTeam));
//     });
//   }
// }

// function addTeamsToSelect() {
//   team1Selector.setAttribute("class", "teamSelect");
//   team2Selector.setAttribute("class", "teamSelect");

//   const firstOption1 = document.createElement("option");
//   const firstOption2 = document.createElement("option");

//   const team1Text = "Choose team 1";

//   firstOption1.innerText = team1Text;
//   team1Selector.appendChild(firstOption1);

//   const team2Text = "Choose team 2";

//   firstOption2.innerText = team2Text;
//   team2Selector.appendChild(firstOption2);

//   teams.forEach((team, index) => {
//     const option = document.createElement("option");
//     option.setAttribute("value", index);
//     option.setAttribute("class", "monsterSelectOption");
//     option.innerText = team.getTeamName();
//     option.value = team.getTeamName();
//     team1Selector.appendChild(option);
//   });
//   teams.forEach((team, index) => {
//     const option = document.createElement("option");
//     option.setAttribute("value", index);
//     option.setAttribute("class", "monsterSelectOption");
//     option.innerText = team.getTeamName();
//     option.value = team.getTeamName();
//     team2Selector.appendChild(option);
//   });
// }

// async function startFight() {
//   let team1 = teams.find((team) => team.getTeamName() === team1Selector.options[team1Selector.selectedIndex].value);
//   let team2 = teams.find((team) => team.getTeamName() === team2Selector.options[team2Selector.selectedIndex].value);

//   fightContainer.innerHTML = "";
//   let param = await buildParam(team1.monsters, team2.monsters);
//   const data = await serveData("fight", param, fightContainer);

//   let fightWinner = document.createElement("h2");
//   fightWinner.setAttribute("class", "winner");
//   fightWinner.innerText = `${data["teamWon"]} won!`;
//   const details = `
//     <div class="detail"><strong>Battle ID:</strong> ${data.battleID}</div>
//     <div class="detail"><strong>Battle Winners:</strong> ${data.battleWinners}</div>
//     <div class="detail"><strong>Team Points (Team 1):</strong> ${data.team1Points}</div>
//     <div class="detail"><strong>Team Points (Team 2):</strong> ${data.team2Points}</div>
//     <div class="detail"><strong>Remaining HP:</strong> ${JSON.stringify(data.remainingHP)}</div>
//     <div class="detail"><strong>Team Stats:</strong></div>
//     <div class="detail"><strong>Team 1:</strong> ${JSON.stringify(data.teamStats.team1)}</div>
//     <div class="detail"><strong>Team 2:</strong> ${JSON.stringify(data.teamStats.team2)}</div>
//     <div class="detail"><strong>Team Won:</strong> ${data.teamWon}</div>
//     `;

//   fightContainer.innerHTML += details;

//   fightContainer.append(fightWinner);

//   console.log(fightWinner);
// }

// fightBtn.addEventListener("click", () => {
//   startFight();
// });

// // Create Random Team based on Int (1-10 range for levels)
// async function createRandomTeam(low, high) {
//   return await serveData("generateTeam", `&level=${getRandomInt(low, high)}`, fightContainer);
// }

// //Create parameters to send to API with team1, team2.
// async function buildParam(team1, team2) {
//   let team1params = "";
//   let team2params = "";
//   let param = "team1=";

//   console.log(team1);
//   console.log(team2);
//   for (let i = 0; i < team1.length || i < team2.length; i++) {
//     if (i < team1.length) {
//       team1params += team1[i].id; // Concatenate team1's id
//       team1params += ","; // Add a comma
//     }

//     if (i < team2.length) {
//       team2params += Number(team2[i].id); // Concatenate team2's id
//       team2params += ","; // Add a comma
//     }
//   }

//   // Optional: Remove the trailing comma from the parameters
//   team1params = team1params.slice(0, -1);
//   team2params = team2params.slice(0, -1);

//   // Return or use the parameters as needed
//   return param + team1params + "&team2=" + team2params;
// }

// //Random Int 1-10 range for levels
// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
