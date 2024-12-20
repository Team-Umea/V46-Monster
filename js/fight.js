//Js code for fight page
import { TEAMS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { load } from "./common/utilities.js";
import { MonsterFighCard } from "./classes/MonsterFighCard.js";
import { valueWithHeader, progressBar, setBtnIcon, renderIconWithNumber, averageValueIcon, imgAsBtn, accuracyMeter } from "./common/render.js";
import { useClickEvent } from "./common/useEvent.js";

const teamsContainerToggle = document.getElementById("teamsContainerToggle");
const teamsContainerBody = document.getElementById("teamsContainerBody");
const teamOneContainer = document.getElementById("teamOne");
const teamTwoContainer = document.getElementById("teamTwo");
const battleContainer = document.getElementById("battleContainer");
const fightBtn = document.getElementById("fightBtn");
const hitContainer = document.getElementById("hitContainer");

const teams = load(TEAMS_LSK) || [];
const selectedTeam = load(SELECTEDFIGHTTEAM_LSK) || null;

let currentFight = 0;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  render();
  toggleTeamMonsters();
  useClickEvent(fightBtn, slideFightCards);
  useClickEvent(teamsContainerToggle, toggleTeamsHeadToHead);
}

function render() {
  renderTeam(teams[0], teamOneContainer);
  renderTeam(teams[1], teamTwoContainer);
  renderBattleMonsters();
}

function slideFightCards() {
  if (currentFight < 4) {
    const fightContainer = battleContainer.children[currentFight];
    const monsterCardTeam1 = getCurrentFighCards(currentFight).monsterCardTeam1;
    const monsterCardTeam2 = getCurrentFighCards(currentFight).monsterCardTeam2;

    const cardWidth = monsterCardTeam1.clientWidth;

    const sildeDist = battleContainer.children[0].getElementsByClassName("monster1FightContainer")[0].clientWidth - cardWidth;

    if (currentFight > 0) {
      const prevFightContainer = battleContainer.children[currentFight - 1];
      const prevMonsterCardTeam1 = getCurrentFighCards(currentFight - 1).monsterCardTeam1;
      const prevMonsterCardTeam2 = getCurrentFighCards(currentFight - 1).monsterCardTeam2;

      const originalContainerWidth = 100 - (currentFight - 1) * 2;

      prevFightContainer.style.width = `${originalContainerWidth}%`;

      prevMonsterCardTeam1.style.transform = `translateX(0)`;
      prevMonsterCardTeam2.style.transform = `translateX(0)`;
    }

    fightContainer.style.width = "100%";
    monsterCardTeam1.style.transform = `translateX(${sildeDist}px)`;
    monsterCardTeam2.style.transform = `translateX(-${sildeDist}px)`;

    currentFight++;
    renderHitControls();
  }
}

function getCurrentFighCards(index) {
  const currentFightConatiner = battleContainer.children[index];

  const monsterCardTeam1 = currentFightConatiner.getElementsByClassName("monster1FightContainer")[0].getElementsByClassName("monsterFighCard")[0];
  const monsterCardTeam2 = currentFightConatiner.getElementsByClassName("monster2FightContainer")[0].getElementsByClassName("monsterFighCard")[0];

  return {
    monsterCardTeam1,
    monsterCardTeam2,
  };
}

function renderHitControls() {
  hitContainer.innerHTML = "";

  const meter = accuracyMeter();
  const meterPin = meter.getElementsByClassName("pin")[0];
  const hitBtn = imgAsBtn("sword", "Hit");

  hitBtn.setAttribute("class", "hitBtn icon icon-scale");

  useClickEvent(hitBtn, () => {
    let meterIsRunning = meter.style.animationPlayState !== "paused";

    if (meterIsRunning) {
      meterPin.style.animationPlayState = "paused";
      setTimeout(() => {
        meterPin.style.animationPlayState = "running";
        meterIsRunning = meterPin.style.animationPlayState !== "paused";
      }, 1000);
    }
  });

  hitContainer.append(meter, hitBtn);
}

function toggleTeamsHeadToHead() {
  const isExtended = teamsContainerToggle.getAttribute("src").includes("upArrow");

  if (isExtended) {
    teamsContainerBody.setAttribute("class", "teamsContainerBody none");
    setBtnIcon(teamsContainerToggle, "downArrow", "Show head to head stats");
  } else {
    teamsContainerBody.setAttribute("class", "teamsContainerBody flez");
    setBtnIcon(teamsContainerToggle, "upArrow", "Hide head to head stats");
  }
}

function toggleTeamMonsters() {
  const toggleEls = document.querySelectorAll(".teamMonsterToggle");

  const toggles = Array.from(toggleEls);

  toggles.forEach((toggle) => {
    const index = toggles.indexOf(toggle);

    toggle.addEventListener("click", () => {
      switch (index) {
        case 0:
          const teamOneToggle = teamOneContainer.getElementsByClassName("teamMonsterToggle")[0];
          const teamOneStats = teamOneContainer.getElementsByClassName("teamStats")[0];
          const teamOneMonsters = teamOneContainer.getElementsByClassName("teamMonsters")[0];

          const teamOneStatsVisible = teamOneToggle.getAttribute("src").includes("skull");

          if (teamOneStatsVisible) {
            teamOneStats.setAttribute("class", "teamStats opacity-0 noneVisible");
            teamOneMonsters.setAttribute("class", "teamMonsters opacity-1 visible");
            setBtnIcon(teamOneToggle, "teams", "Show team stats");
          } else {
            teamOneStats.setAttribute("class", "teamStats opacity-1 visible");
            teamOneMonsters.setAttribute("class", "teamMonsters opacity-0 noneVisible");
            setBtnIcon(teamOneToggle, "skull", "Show team monsters");
          }
          break;
        case 1:
          const teamTwoToggle = teamTwoContainer.getElementsByClassName("teamMonsterToggle")[0];
          const teamTwoStats = teamTwoContainer.getElementsByClassName("teamStats")[0];
          const teamTwoMonsters = teamTwoContainer.getElementsByClassName("teamMonsters")[0];

          const teamTwoStatsVisible = teamTwoToggle.getAttribute("src").includes("skull");

          if (teamTwoStatsVisible) {
            teamTwoStats.setAttribute("class", "teamStats opacity-0 noneVisible");
            teamTwoMonsters.setAttribute("class", "teamMonsters opacity-1 visible");
            setBtnIcon(teamTwoToggle, "teams", "Show team stats");
          } else {
            teamTwoStats.setAttribute("class", "teamStats opacity-1 visible");
            teamTwoMonsters.setAttribute("class", "teamMonsters opacity-0 noneVisible");
            setBtnIcon(teamTwoToggle, "skull", "Show team monsters");
          }
          break;
        default:
          break;
      }
    });
  });
}

function renderTeamStats(parent, team) {
  const container = document.createElement("div");
  const topStats = document.createElement("div");
  const averageStats = document.createElement("div");
  const battleContainer = document.createElement("div");
  const fightContainer = document.createElement("div");
  const roundContainer = document.createElement("div");
  const performaceStats = document.createElement("div");

  const averageRank = Math.floor(team.totalRank / team.monsters.length);
  const averageRating = Math.floor(team.totalRating / team.monsters.length);
  const averageHealth = Math.floor(team.totalHealth / team.monsters.length);
  const averageDamage = Math.floor(team.totalDamage / team.monsters.length);
  const rankIcon = renderIconWithNumber(team.totalRank, "../../res/icons/ribbon.svg", `Team '${team.name}' has a rank of ${team.totalRank}`);
  const ratingIcon = renderIconWithNumber(team.totalRating, "../../res/icons/trophy.svg", `Team '${team.name}' has a combinded rating of ${team.totalRating}`);
  const healthIcon = renderIconWithNumber(team.totalHealth, "../../res/icons/heart.svg", `Team '${team.name}' has ${team.totalHealth} in total health`);
  const damageIcon = renderIconWithNumber(team.totalDamage, "../../res/icons/barbell.svg", `Team '${team.name}' has ${team.totalDamage} in total damage`);
  const averageRankIcon = averageValueIcon(averageRank, "ribbon", "skull", `Team '${team.name}' has an average rank of ${averageRank}`);
  const averageRatingIcon = averageValueIcon(averageRating, "trophy", "skull", `Team '${team.name}' has an average rating of ${averageRating}`);
  const averageHealthIcon = averageValueIcon(averageHealth, "heart", "skull", `Team '${team.name}' has ${averageHealth} in average health`);
  const averageDamageIcon = averageValueIcon(averageDamage, "barbell", "skull", `Team '${team.name}' has ${averageDamage} in average damage`);

  const battleBar = progressBar(team.wonBattels, team.drawnBattels, team.lostBattels);
  const fightBar = progressBar(team.wonFights, team.drawnFights, team.lostFights);
  const roundBar = progressBar(team.wonRounds, team.drawnRounds, team.lostRounds);
  const winRateEl = renderIconWithNumber(`${team.winRate}%`, "../../res/icons/rate.svg", `Winrate of '${team.name}' is ${team.winRate}%`, "right");
  const pointsEl = renderIconWithNumber(team.totalPoints, "../../res/icons/points.svg", `'${team.name}' has ${team.totalPoints} of points`, "Sright");
  const numBattelsEl = valueWithHeader(team.numBattels, "Battels");
  const wonBattlesEl = valueWithHeader(team.wonBattels, "Won");
  const drawnBattelsEl = valueWithHeader(team.drawnBattels, "Drawn");
  const lostBattelsEl = valueWithHeader(team.lostBattels, "Lost");
  const numFightsEl = valueWithHeader(team.numFights, "Fights");
  const wonFightsEl = valueWithHeader(team.wonFights, "Won");
  const drawnFightsEl = valueWithHeader(team.drawnFights, "Drawn");
  const lostFightsEl = valueWithHeader(team.lostFights, "Lost");
  const numRoundsEl = valueWithHeader(team.numRounds, "Rounds");
  const wonRounsEl = valueWithHeader(team.wonRounds, "Won");
  const drawnRoundsEl = valueWithHeader(team.drawnRounds, "Drawn");
  const lostRoundsEl = valueWithHeader(team.lostRounds, "Lost");

  container.setAttribute("class", "teamStatsContainer");
  topStats.setAttribute("class", "topStats");
  averageStats.setAttribute("class", "averageStats");
  battleContainer.setAttribute("class", "battleStatsContainer statsContainer");
  fightContainer.setAttribute("class", "fightStatsContainer statsContainer");
  roundContainer.setAttribute("class", "roundStatsContainer statsContainer");
  performaceStats.setAttribute("class", "performanceStats");
  rankIcon.classList.add("teamStatsIcon");
  ratingIcon.classList.add("teamStatsIcon");
  healthIcon.classList.add("teamStatsIcon");
  damageIcon.classList.add("teamStatsIcon");
  averageRankIcon.classList.add("teamAverageStatsIcon");
  averageRatingIcon.classList.add("teamAverageStatsIcon");
  averageHealthIcon.classList.add("teamAverageStatsIcon");
  averageDamageIcon.classList.add("teamAverageStatsIcon");
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

  performaceStats.append(winRateEl, pointsEl);
  topStats.append(rankIcon, ratingIcon, healthIcon, damageIcon);
  averageStats.append(averageRankIcon, averageRatingIcon, averageHealthIcon, averageDamageIcon);
  battleContainer.append(numBattelsEl, wonBattlesEl, drawnBattelsEl, lostBattelsEl);
  fightContainer.append(numFightsEl, wonFightsEl, drawnFightsEl, lostFightsEl);
  roundContainer.append(numRoundsEl, wonRounsEl, drawnRoundsEl, lostRoundsEl);

  container.append(topStats, averageStats, battleContainer, battleBar, fightContainer, fightBar, roundContainer, roundBar, performaceStats);

  parent.appendChild(container);
}

function renderTeam(team, container) {
  const teamNameHeader = container.getElementsByClassName("teamName")[0];
  const teamStats = container.getElementsByClassName("teamStats")[0];
  const teamMonsterContainer = container.getElementsByClassName("teamMonsters")[0];

  const teamMonsterStats = container.getElementsByClassName("monsterStats")[0];
  const teamMonsters = container.getElementsByClassName("monsters")[0];
  const teamFightRecord = container.getElementsByClassName("monsterFought")[0];

  if (team) {
    const teamName = team.name;
    const monsters = team.monsters;

    teamNameHeader.innerText = teamName;

    const carousel = document.createElement("div");

    carousel.setAttribute("class", "carousel");

    monsters.forEach((monster, index) => {
      teamFightRecord.innerHTML = "";
      const monsterCard = new MonsterFighCard(monster).card();
      const carouselBtn = document.createElement("button");

      carouselBtn.setAttribute("class", `${index === 0 ? "carouselBtn carouselBtn-checked" : "carouselBtn"}`);

      if (index === 0) {
        renderMonsterStats(teamMonsterStats, monster);
      }

      renderMonstersFought(teamFightRecord, "Won against", monster.wonAgainst);
      renderMonstersFought(teamFightRecord, "Drawn against", monster.drawnAgainst);
      renderMonstersFought(teamFightRecord, "Lost against", monster.lostAgainst);

      teamMonsters.appendChild(monsterCard);
      carousel.appendChild(carouselBtn);
    });

    const carouselBtns = Array.from(carousel.children);
    const monsterCards = Array.from(teamMonsters.children);

    carouselBtns.forEach((carouselBtn) => {
      const index = carouselBtns.indexOf(carouselBtn);
      const monster = monsters[index];

      carouselBtn.addEventListener("click", () => {
        teamFightRecord.innerHTML = "";
        carouselBtns.forEach((btn) => btn.setAttribute("class", "carouselBtn"));
        monsterCards.forEach((montserCard) => montserCard.setAttribute("class", "monsterFighCard opacity-0"));

        carouselBtn.setAttribute("class", "carouselBtn carouselBtn-checked");

        const monsterCard = teamMonsters.children[index];

        if (monsterCard) {
          monsterCard.setAttribute("class", "monsterFighCard opacity-1");
        }

        renderMonsterStats(teamMonsterStats, monster);
        renderMonstersFought(teamFightRecord, "Won against", monster.wonAgainst);
        renderMonstersFought(teamFightRecord, "Drawn against", monster.drawnAgainst);
        renderMonstersFought(teamFightRecord, "Lost against", monster.lostAgainst);
      });
    });

    teamMonsterContainer.appendChild(carousel);
  }
  renderTeamStats(teamStats, team);
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

function renderBattleMonsters() {
  battleContainer.innerHTML = "";

  const team1 = teams[0].monsters;
  const team2 = teams[1].monsters;

  team1.forEach((_, index) => {
    const team1Monsters = team1[index];
    const team2Monsters = team2[index];

    const fightContainer = document.createElement("div");
    const monster1Conatiner = document.createElement("div");
    const monster2Container = document.createElement("div");

    fightContainer.setAttribute("class", "fightContainer");
    monster1Conatiner.setAttribute("class", "monster1FightContainer monsterFightContainer");
    monster2Container.setAttribute("class", "monster2FightContainer monsterFightContainer");

    const monsterCardTeam1 = new MonsterFighCard(team1Monsters).card();
    const monsterCardTeam2 = new MonsterFighCard(team2Monsters).card();

    monster1Conatiner.appendChild(monsterCardTeam1);
    monster2Container.appendChild(monsterCardTeam2);

    fightContainer.append(monster1Conatiner, monster2Container);

    battleContainer.appendChild(fightContainer);
  });
}
