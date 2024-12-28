//Js code for fight page
import { TEAMS_LSK, SELECTEDFIGHTTEAM_LSK, OPPOSINGFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { load, save, convertInstancesToStr } from "./common/utilities.js";
import { MonsterFighCard } from "./classes/MonsterFighCard.js";
import { valueWithHeader, progressBar, setBtnIcon, renderIconWithNumber, averageValueIcon, imgAsBtn, accuracyMeter } from "./common/render.js";
import { useClickEvent } from "./common/useEvent.js";
import { Team } from "./classes/Team.js";
import { user, updateUser } from "./common/user.js";

const teamsContainerToggle = document.getElementById("teamsContainerToggle");
const teamsContainerBody = document.getElementById("teamsContainerBody");
const teamOneContainer = document.getElementById("teamOne");
const teamTwoContainer = document.getElementById("teamTwo");
const fightOrderContainer = document.getElementById("fightOrderContainer");
const battleContainer = document.getElementById("battleContainer");
const fightBtn = document.getElementById("fightBtn");
const score = document.getElementById("score");
const userLostHpIconHolder = document.getElementById("userLostHpIconHolder");
const opponentLostHpIconHolder = document.getElementById("opponentLostHpIconHolder");
const hitContainer = document.getElementById("hitContainer");

const teams = load(TEAMS_LSK) || [];
const selctedTeam = load(SELECTEDFIGHTTEAM_LSK) || teams[0].name;
const team = teams.find((team) => team.name === selctedTeam) || teams[0] || null;
const userTeamMonsters = teams.find((team) => team.name === selctedTeam).monsters || [];
const userTeam = Team.fromJSON(team);
userTeam.setMonsters(userTeamMonsters);
const opposingTeam = load(OPPOSINGFIGHTTEAM_LSK) || null;

let monster = { ...userTeam.monsters[0] };
let opponent = { ...opposingTeam.monsters[0] };

let currentFight = 0;
let userPoints = 0;
let oppoentPoints = 0;
let totalRounds = 0;
let battleCredits = 0;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  render();
  toggleTeamMonsters();
  useClickEvent(fightBtn, startFight);
  useClickEvent(teamsContainerToggle, toggleTeamsHeadToHead);
}

function render() {
  renderTeam(userTeam, teamOneContainer);
  renderTeam(opposingTeam, teamTwoContainer);
  renderFightOrder();
  renderBattleMonsters();
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

function startFight() {
  currentFight = 0;
  userPoints = 0;
  oppoentPoints = 0;
  totalRounds = 0;
  battleCredits = 0;

  fightOrderContainer.innerHTML = "";
  fightBtn.classList.add("hidden");
  hitContainer.setAttribute("class", "hitContainer");

  const battleMessage = document.getElementsByClassName("battleMessage")[0];

  if (battleMessage) {
    battleMessage.remove();
  }

  slideFightCards();

  score.innerText = `${userPoints} - ${oppoentPoints}`;
}

function slideFightCards() {
  if (currentFight < 4) {
    const fightContainer = battleContainer.children[3 - currentFight];
    const monsterCardTeam1 = getCurrentFightCards(3 - currentFight).monsterCardTeam1;
    const monsterCardTeam2 = getCurrentFightCards(3 - currentFight).monsterCardTeam2;

    const cardWidth = monsterCardTeam1.clientWidth;

    const sildeDist = battleContainer.children[0].getElementsByClassName("monster1FightContainer")[0].clientWidth - cardWidth;

    if (currentFight > 0) {
      resetPrevFight();
    }

    fightContainer.style.width = "100%";
    monsterCardTeam1.style.transform = `translateX(${sildeDist}px)`;
    monsterCardTeam2.style.transform = `translateX(-${sildeDist}px)`;

    currentFight++;

    monster = { ...userTeam.monsters[4 - currentFight] };
    opponent = { ...opposingTeam.monsters[4 - currentFight] };

    renderHitControls();
  } else {
    evalBattle();
  }
}

function calcBattleCredits() {
  const userTeamRating = userTeam.totalRating;
  const opposingTeamRating = opposingTeam.totalRating;
  const ratingDifference = Math.abs(userTeamRating - opposingTeamRating);

  const maxCredits = 10000 * userTeamRating * (1 / (ratingDifference * 5)) * userPoints;
  const minRounds = 4;

  const performanceFactor = minRounds / totalRounds;

  const ratingDifferenceFactor = Math.max(2, ratingDifference * 0.1);

  const total = (maxCredits * performanceFactor) / ratingDifferenceFactor;

  if (total > 100) {
    battleCredits = Math.round(total / 100) * 100;
  }

  if (userPoints < oppoentPoints) {
    battleCredits = 0;
  }

  const currentCredits = user.credits;
  const newCredits = currentCredits + battleCredits;
  userTeam.teamProfit += battleCredits;
  updateUser("credits", newCredits);
}

function evalBattle() {
  userTeam.numBattels++;
  if (userPoints === oppoentPoints) {
    userTeam.drawnBattels++;
  } else if (userPoints < oppoentPoints) {
    userTeam.lostBattels++;
  } else if (userPoints > oppoentPoints) {
    userTeam.wonBattels++;
  }

  const winner = userPoints > oppoentPoints ? `Battle won by ${userTeam.name}` : userPoints < oppoentPoints ? `Battle won by ${opposingTeam.name}` : "Battle ended in a draw";

  fightBtn.classList.remove("hidden");
  hitContainer.setAttribute("class", "hitContainer hidden");

  calcBattleCredits();
  updateTeams();
  resetPrevFight();
  render();
  renderBattleResult(winner);
}

function getCurrentFightCards(index) {
  const currentFightConatiner = battleContainer.children[index];

  const monsterCardTeam1 = currentFightConatiner.getElementsByClassName("monster1FightContainer")[0].getElementsByClassName("monsterFighCard")[0];
  const monsterCardTeam2 = currentFightConatiner.getElementsByClassName("monster2FightContainer")[0].getElementsByClassName("monsterFighCard")[0];

  return {
    monsterCardTeam1,
    monsterCardTeam2,
  };
}

function resetPrevFight() {
  const prevFightContainer = battleContainer.children[4 - currentFight];
  const prevMonsterCardTeam1 = getCurrentFightCards(4 - currentFight).monsterCardTeam1;
  const prevMonsterCardTeam2 = getCurrentFightCards(4 - currentFight).monsterCardTeam2;

  const originalContainerWidth = 100 - (4 - currentFight) * 2;

  prevFightContainer.style.width = `${originalContainerWidth}%`;

  prevMonsterCardTeam1.style.transform = `translateX(0)`;
  prevMonsterCardTeam2.style.transform = `translateX(0)`;
}

function calcUserDamage(monster, meter, meterPin) {
  const maxDamage = monster.damage;

  const max = meter.clientWidth;
  const middle = Math.floor(max / 2);
  const offset = parseInt(getComputedStyle(meterPin).left);
  const absDifference = Math.abs(offset - middle);

  const hitValue = 100 - Math.floor((absDifference / middle) * 100);
  const boosted = Math.floor(hitValue * 1.02);

  let vaildHit = boosted;

  if (vaildHit < 30) {
    vaildHit = 30;
  } else if (vaildHit > 100) {
    vaildHit = 100;
  }

  const percentage = vaildHit / 100;
  const damage = Math.floor(maxDamage * percentage);

  return damage === 0 ? 1 : damage;
}

function calcOpposingDamage(monster) {
  const maxDamage = monster.damage;

  const hitValue = 100 - (Math.random() * 100 + 1);
  const boosted = Math.floor(hitValue * 1.05);

  let vaildHit = boosted;

  if (vaildHit < 30) {
    vaildHit = 30;
  } else if (vaildHit > 100) {
    vaildHit = 100;
  }

  const percentage = vaildHit / 100;
  const damage = Math.floor(maxDamage * percentage);

  return damage === 0 ? 1 : damage;
}

function updateScore(monster, opponent) {
  if (monster.remainingHP <= 0) {
    oppoentPoints++;
  } else if (opponent.remainingHP <= 0) {
    userPoints++;
  }

  score.innerText = `${userPoints} - ${oppoentPoints}`;
}

function updateHp(damage, monster, monsterCard, lostHpIconHolder, iconDir) {
  const healthEl = monsterCard.getElementsByClassName("stats")[0].children[0].getElementsByTagName("p")[0];
  const lostHpIcon = renderIconWithNumber(`-${damage}`, "../../res/icons/heartRed.svg", "", iconDir);
  lostHpIcon.classList.add("lostHpIcon");

  const health = monster.remainingHP;
  let updatedHealth = health - damage;

  lostHpIconHolder.appendChild(lostHpIcon);

  if (updatedHealth <= 0) {
    updatedHealth = 0;
  }

  monster.remainingHP = updatedHealth;
  healthEl.innerText = updatedHealth;

  setTimeout(() => {
    lostHpIcon.remove();
  }, 1000);
}

function removeAllLostHpIcons() {
  userLostHpIconHolder.innerHTML = "";
  opponentLostHpIconHolder.innerHTML = "";
}

function updateUserTeamMonster(currentMonster, currentOpponent, userDamage, opposingDamage) {
  userTeam.monsters.forEach((monster) => {
    if (monster.id === currentMonster.id) {
      monster.numRounds++;
      monster.distributedDamage += userDamage;
      monster.sufferedDamage += opposingDamage;

      if (currentMonster.remainingHP === currentOpponent.remainingHP) {
        monster.drawnRounds++;
      } else if (currentMonster.remainingHP < currentOpponent.remainingHP) {
        monster.lostRounds++;
      } else if (currentMonster.remainingHP > currentOpponent.remainingHP) {
        monster.wonRounds++;
      }

      if (currentMonster.remainingHP <= 0 && currentOpponent.remainingHP <= 0) {
        monster.drawnFights++;
        monster.drawnAgainst.push(currentOpponent.name);
      } else if (currentMonster.remainingHP <= 0) {
        monster.remainingHP--;
        monster.lostFights++;
        monster.lostAgainst.push(currentOpponent.name);
      } else if (currentOpponent.remainingHP <= 0) {
        monster.points++;
        monster.wonFights++;
        monster.wonAgainst.push(currentOpponent.name);
      }
      monster.calc();
    }
  });
  updateTeams();
}

function updateTeams() {
  const updatedTeams = teams.map((team) => {
    if (team.name === userTeam.name) {
      return userTeam;
    }
    return team;
  });

  save(TEAMS_LSK, updatedTeams);
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

  teamStats.innerHTML = "";
  teamMonsterStats.innerHTML = "";
  teamMonsters.innerHTML = "";
  teamFightRecord.innerHTML = "";

  if (team) {
    const teamName = team.name;

    teamNameHeader.innerText = teamName;

    const carousel = document.createElement("div");

    carousel.setAttribute("class", "carousel");

    team.monsters.forEach((monster, index) => {
      teamFightRecord.innerHTML = "";
      const monsterCard = new MonsterFighCard(monster).card();
      const carouselBtn = document.createElement("button");

      carouselBtn.setAttribute("class", `${index === 0 ? "carouselBtn carouselBtn-checked" : "carouselBtn"}`);

      if (index === 0) {
        renderMonsterStats(teamMonsterStats, monster);
      }

      renderMonstersFought(teamFightRecord, "Won against", convertInstancesToStr(monster.wonAgainst));
      renderMonstersFought(teamFightRecord, "Drawn against", convertInstancesToStr(monster.drawnAgainst));
      renderMonstersFought(teamFightRecord, "Lost against", convertInstancesToStr(monster.lostAgainst));

      teamMonsters.appendChild(monsterCard);
      carousel.appendChild(carouselBtn);
    });

    const carouselBtns = Array.from(carousel.children);
    const monsterCards = Array.from(teamMonsters.children);

    monsterCards.forEach((monsterCard) => monsterCard.setAttribute("class", "monsterFighCard opacity-0"));
    teamFightRecord.innerHTML = "";

    const firstMonster = team.monsters[0];
    const firstMonsterCrd = teamMonsters.children[0];

    if (firstMonsterCrd) {
      firstMonsterCrd.setAttribute("class", "monsterFighCard opacity-1");
    }

    renderMonsterStats(teamMonsterStats, firstMonster);
    renderMonstersFought(teamFightRecord, "Won against", convertInstancesToStr(firstMonster.wonAgainst));
    renderMonstersFought(teamFightRecord, "Drawn against", convertInstancesToStr(firstMonster.drawnAgainst));
    renderMonstersFought(teamFightRecord, "Lost against", convertInstancesToStr(firstMonster.lostAgainst));

    carouselBtns.forEach((carouselBtn) => {
      carouselBtn.addEventListener("click", () => {
        const index = carouselBtns.indexOf(carouselBtn);
        const monster = team.monsters[index];

        teamFightRecord.innerHTML = "";
        carouselBtns.forEach((btn) => btn.setAttribute("class", "carouselBtn"));
        monsterCards.forEach((monsterCard) => monsterCard.setAttribute("class", "monsterFighCard opacity-0"));

        carouselBtn.setAttribute("class", "carouselBtn carouselBtn-checked");

        const monsterCard = teamMonsters.children[index];

        if (monsterCard) {
          monsterCard.setAttribute("class", "monsterFighCard opacity-1");
        }

        renderMonsterStats(teamMonsterStats, monster);
        renderMonstersFought(teamFightRecord, "Won against", convertInstancesToStr(monster.wonAgainst));
        renderMonstersFought(teamFightRecord, "Drawn against", convertInstancesToStr(monster.drawnAgainst));
        renderMonstersFought(teamFightRecord, "Lost against", convertInstancesToStr(monster.lostAgainst));
      });
    });

    if (!teamMonsterContainer.children[2]) {
      teamMonsterContainer.appendChild(carousel);
    }
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
  const wonRounds = monster.wonRounds;
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

function renderFightOrder() {
  fightOrderContainer.innerHTML = "";

  userTeam.monsters.forEach((monster) => {
    const monsterCard = new MonsterFighCard(monster).card();
    const shiftPlaceBtn = imgAsBtn("rightFlatArrow", "Change fight order. Monster furthest to the left will start");

    shiftPlaceBtn.setAttribute("class", "shiftMonsterBtn primary-btn");

    useClickEvent(shiftPlaceBtn, () => {
      userTeam.shiftMonsters(monster.id);
      updateTeams();
      renderFightOrder();
      renderBattleMonsters();
      renderTeam(userTeam, teamOneContainer);
      renderTeam(opposingTeam, teamTwoContainer);
    });

    monsterCard.appendChild(shiftPlaceBtn);
    fightOrderContainer.appendChild(monsterCard);
  });
}

function renderBattleResult(message) {
  const battleResultContainer = document.createElement("div");
  const battleMessage = document.createElement("h2");
  const battleCreditsIcon = renderIconWithNumber(battleCredits, "../../res/icons/diamond.svg", `Battle generated ${battleCredits} of credits`);

  battleResultContainer.setAttribute("class", "battleResultContainer");
  battleMessage.setAttribute("class", "battleMessage");

  battleMessage.innerText = message;
  battleResultContainer.append(battleMessage, battleCreditsIcon);
  battleContainer.appendChild(battleResultContainer);
}

function renderBattleMonsters() {
  battleContainer.innerHTML = "";

  const team1 = userTeam.monsters;
  const team2 = opposingTeam.monsters;

  team1.forEach((_, index) => {
    const team1Monsters = team1[team1.length - 1 - index];
    const team2Monsters = team2[team2.length - 1 - index];

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

function renderHitControls() {
  hitContainer.innerHTML = "";

  const meter = accuracyMeter();
  const meterPin = meter.getElementsByClassName("pin")[0];
  const hitBtn = imgAsBtn("sword", "Hit");

  hitBtn.setAttribute("class", "hitBtn icon icon-scale");

  let meterIsRunning = true;

  useClickEvent(hitBtn, () => {
    if (meterIsRunning) {
      removeAllLostHpIcons();

      totalRounds++;

      meterPin.style.animationPlayState = "paused";
      meterIsRunning = false;

      const userDamage = calcUserDamage(monster, meter, meterPin);
      const opposingDamage = calcOpposingDamage(opponent);
      const userCurrentFightCard = getCurrentFightCards(4 - currentFight).monsterCardTeam1;
      const opponentCurrentFightCard = getCurrentFightCards(4 - currentFight).monsterCardTeam2;

      updateHp(userDamage, opponent, opponentCurrentFightCard, opponentLostHpIconHolder, "right");
      updateHp(opposingDamage, monster, userCurrentFightCard, userLostHpIconHolder, "left");

      const nextFight = monster.remainingHP <= 0 || opponent.remainingHP <= 0;
      updateUserTeamMonster(monster, opponent, userDamage, opposingDamage);

      if (nextFight) {
        updateScore(monster, opponent);
        slideFightCards();
      }

      setTimeout(() => {
        meterPin.style.animationPlayState = "running";
        meterIsRunning = true;
      }, 1000);
    }
  });

  hitContainer.append(meter, hitBtn);
}
