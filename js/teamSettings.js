//Js code for teamControls page
import { useClickEvent, useFocusEvent } from "./common/useEvent.js";
import { serveData } from "./common/fetch.js";
import { renderIconWithNumber, averageValueIcon, imgAsBtn, valueWithHeader, progressBar, dataList, setBtnIcon } from "./common/render.js";
import { load, save, remove, redirect, formatLargeNumber } from "./common/utilities.js";
import { USER_LSK, SELECTEDTEAMSETTINGS_LSK, TEAMS_LSK, SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { Team } from "./classes/Team.js";
import { user, updateUser } from "./common/user.js";
import { ELEMENTS_LSK } from "./common/localStorageKeys.js";
import { ELEMENTS_TTL } from "./common/ttl.js";

const navigator = document.getElementById("prevNavigator");
const defaultMessage = document.getElementById("defaultMessage");
const actionMessage = document.getElementById("message");
const controls = document.getElementById("headerControls");
const teamStats = document.getElementById("teamStatsConatiner");
const monstersContainer = document.getElementById("teamMonsters");
const teamElementsContainer = document.getElementById("teamElementsContainer");
const battleRecordContainer = document.getElementById("battleRecordContainer");
const dangerZone = document.getElementById("dangerZone");

let teams;
let userCredits = load(USER_LSK).credits;

let linkedBtns = [];
let timeOutBtns = [];
let controlMessageTimeout;

let team;
let teamName;
let teamMonsters;
let teamCost;
let teamValue;
let teamProfit;
let teamElements;
let isPaidFor;
let numMonsters;

let totalRank;
let totalRating;
let totalHealth;
let totalDamage;

let numBattels;
let wonBattels;
let drawnBattels;
let lostBattels;
let totalPoints;
let winRate;

let numFights;
let wonFights;
let drawnFights;
let lostFights;

let numRounds;
let wonRounds;
let drawnRounds;
let lostRounds;

let lostHp;
let remainingHP;
let sufferedDamage;
let distributedDamage;

let wonAgainst;
let lostAgainst;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadTeam();
  render();
  postionDangerZone();
  validateDeleteTeam();
  useClickEvent(navigator, navigate);
}

function render() {
  linkedBtns = [];
  renderPageInfo();
  renderDefaultMessage();
  renderControlBtns();
  renderTeamStats();
  renderMonsters();
  loadElements();
  renderBattleRecord();
  postionDangerZone();
  placeUserCredits();
}

function loadAllTeams() {
  const loaded = load(TEAMS_LSK);

  if (loaded) {
    teams = loaded.map((t) => Team.fromJSON(t));
  }
}

function loadTeam() {
  loadAllTeams();
  const loadedTeam = load(SELECTEDTEAMSETTINGS_LSK);
  if (loadedTeam) {
    team = Team.fromJSON(loadedTeam);

    teamName = team.name;
    teamMonsters = team.monsters;
    teamCost = team.teamCost;
    teamValue = team.teamValue;
    teamProfit = team.teamProfit;
    teamElements = team.elements;
    isPaidFor = team.paidFor;
    numMonsters = teamMonsters.length;

    totalRank = team.totalRank;
    totalRating = team.totalRating;
    totalHealth = team.totalHealth;
    totalDamage = team.totalDamage;

    numBattels = team.numBattels;
    wonBattels = team.wonBattels;
    drawnBattels = team.drawnBattels;
    lostBattels = team.lostBattels;
    totalPoints = team.totalPoints;
    winRate = `${team.winRate}%`;

    numFights = team.numFights;
    wonFights = team.wonFights;
    drawnFights = team.drawnFights;
    lostFights = team.lostFights;

    numRounds = team.numRounds;
    wonRounds = team.wonRounds;
    drawnRounds = team.drawnRounds;
    lostRounds = team.lostRounds;

    lostHp = team.lostHp;
    remainingHP = team.remainingHP;
    sufferedDamage = team.sufferedDamage;
    distributedDamage = team.distributedDamage;

    wonAgainst = team.wonAgainst;
    lostAgainst = team.lostAgainst;
  } else {
    navigate();
  }
}

async function loadElements() {
  const allElements = await serveData("elements", undefined, undefined, ELEMENTS_LSK, ELEMENTS_TTL);

  teamElements = team.getAllMonsterElements(allElements);

  renderElements();
}

function navigate() {
  window.location.href = "team.html";
}

function updateTeams() {
  save(TEAMS_LSK, teams);
  save(SELECTEDTEAMSETTINGS_LSK, team);
  loadTeam();
  render();
}

async function shuffleTeam() {
  const randomMonsters = await serveData("randomMonsters", "num=4", monstersContainer);

  const selectedTeam = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase());

  selectedTeam.setMonsters(randomMonsters);
  selectedTeam.setPaidFor(false);

  team.setMonsters(randomMonsters);
  team.setPaidFor(false);
  updateTeams();
}

function buyTeam() {
  const selectedTeam = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase());

  selectedTeam.setPaidFor(true);
  team.setPaidFor(true);
  const currentCredits = user.credits;
  const newCredits = currentCredits - teamCost;
  updateUser("credits", newCredits);
  updateTeams();
}

function sellTeam() {
  teams = teams.filter((t) => t.name.toLowerCase() !== teamName.toLowerCase());
  remove(SELECTEDTEAMSETTINGS_LSK);
  save(TEAMS_LSK, teams);
  const currentCredits = user.credits;
  const newCredits = currentCredits + teamValue;
  updateUser("credits", newCredits);
  setTimeout(() => {
    navigate();
  }, 100);
}

function fightTeam() {
  save(SELECTEDFIGHTTEAM_LSK, team.name);
  setTimeout(() => {
    redirect("setUpFight.html");
  }, 100);
}

function shiftTeamOrder(id) {
  const selectedTeam = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase());
  selectedTeam.shiftMonsters(id);
  team.shiftMonsters(id);
  updateTeams();
}

function removeMonster(id) {
  const selectedTeam = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase());
  selectedTeam.deleteMonster(id);
  team.deleteMonster(id);
  updateTeams();
}

function deleteTeam() {
  teams = teams.filter((t) => t.name.toLowerCase() !== teamName.toLowerCase());
  remove(SELECTEDTEAMSETTINGS_LSK);
  save(TEAMS_LSK, teams);
  setTimeout(() => {
    navigate();
  }, 100);
}

function setActionMessage(className, message) {
  actionMessage.setAttribute("class", `message ${className}`);
  actionMessage.innerText = formatLargeNumber(message);

  if (controlMessageTimeout) {
    clearTimeout(controlMessageTimeout);
  }

  if (actionMessage.innerText !== "") {
    controlMessageTimeout = setTimeout(() => {
      actionMessage.innerText = "message";
      actionMessage.setAttribute("class", "message hide");
    }, 7000);
  }
}

function useBtnLinks() {
  timeOutBtns.forEach((timeOut) => {
    clearTimeout(timeOut);
  });
  timeOutBtns = [];

  linkedBtns.forEach((btn) => {
    const icon = btn.getElementsByTagName("img")[0];
    setActionMessage("hide", "message");

    const secondChild = btn.children[1];
    if (secondChild) {
      secondChild.remove();
    }

    const classList = btn.getAttribute("class");

    if (classList.includes("removeMonsterBtn")) {
      setBtnIcon(icon, "x", `Remove from '${teamName}'`);
    } else if (classList.includes("controlBtn")) {
      if (classList.includes("buySell")) {
        if (isPaidFor) {
          setBtnIcon(icon, "sell", `Sell '${teamName}' for ${teamValue} credits`);
        } else {
          setBtnIcon(icon, "cart", `Buy '${teamName}' for ${teamCost} credits`);
        }
      } else if (classList.includes("shuffle")) {
        setBtnIcon(icon, "shuffle", `Fill '${teamName}' with 4 random monsters`);
      } else if (classList.includes("fight")) {
        setBtnIcon(icon, "shield", `Fight with '${teamName}'`);
      }
    } else if (classList.includes("removeTeamBtn")) {
      setBtnIcon(icon, "trashRed", `Delete team '${teamName}'`);
    }
  });
}

function populateElementsSortSelect(select) {
  const options = ["Many-Few Instances", "Few-Many Instances", "High-Low Rating", "Low-High Rating", "A-Z", "Z-A"];

  options.forEach((opt, index) => {
    const option = document.createElement("option");
    option.setAttribute("class", "teamStatSearchElementsOption");
    option.innerText = opt;
    option.value = index;
    select.appendChild(option);
  });
}

function createElementContainers(elementsEl, condition) {
  elementsEl.innerHTML = "";

  teamElements.forEach((teamElement) => {
    const element = document.createElement("div");
    const name = document.createElement("p");

    element.setAttribute("class", "elementContainer");
    name.setAttribute("class", "elementName");

    const elementName = Object.keys(teamElement)[0];
    const elementInstances = teamElement[elementName];
    const elementRating = teamElement.rating;

    const rating = renderIconWithNumber(elementRating, "../../res/icons/trophy.svg", `Rating of ${elementName} is ${elementRating}`, "right");
    rating.classList.add("elementRating");

    name.innerText = `${elementInstances}x ${elementName}`;

    element.appendChild(name);
    element.appendChild(rating);
    elementsEl.appendChild(element);

    if (condition !== undefined && condition !== null) {
      if (typeof condition === "function") {
        if (condition(elementName) === false) {
          element.classList.add("opacity-0");
        }
      } else {
        if (condition === false) {
          element.classList.add("opacity-0");
        }
      }
    }
  });

  const sortedByVisible = Array.from(elementsEl.children).sort((a, b) => {
    const aIsHidden = a.classList.contains("opacity-0");
    const bIsHidden = b.classList.contains("opacity-0");
    return aIsHidden - bIsHidden;
  });

  elementsEl.innerHTML = "";

  sortedByVisible.forEach((el) => elementsEl.appendChild(el));
}

function searchElements(elementsEl, searchElementsInput) {
  const searchQuery = searchElementsInput.value;

  const nameMatchesSearchQuery = (elementName) => {
    return elementName.toLowerCase().includes(searchQuery.trim().toLowerCase());
  };

  createElementContainers(elementsEl, nameMatchesSearchQuery);
}

function setSortOrder(elementsEl, sortElementsSelect, searchElementsInput) {
  const sortOrder = Number(sortElementsSelect.value);
  const searchQuery = searchElementsInput.value;

  sortElements(sortOrder);

  const nameMatchesSearchQuery = (elementName) => {
    return elementName.toLowerCase().includes(searchQuery.trim().toLowerCase());
  };

  createElementContainers(elementsEl, nameMatchesSearchQuery);
}

function sortElements(sortOrder) {
  let sorted = [];

  switch (sortOrder) {
    case 0:
      sorted = teamElements.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];
        const countA = a[keyA];
        const countB = b[keyB];

        const ratingA = a["rating"];
        const ratingB = b["rating"];
        const countDifference = countB - countA;
        const ratingDifference = ratingB - ratingA;

        return countDifference === 0 ? ratingDifference : countDifference;
      });
      break;
    case 1:
      sorted = teamElements.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];
        const countA = a[keyA];
        const countB = b[keyB];

        const ratingA = a["rating"];
        const ratingB = b["rating"];
        const countDifference = countA - countB;
        const ratingDifference = ratingB - ratingA;

        return countDifference === 0 ? ratingDifference : countDifference;
      });
      break;
    case 2:
      sorted = teamElements.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];
        const ratingA = a["rating"];
        const ratingB = b["rating"];

        const ratingDifference = ratingB - ratingA;
        const alphaDifference = keyA.localeCompare(keyB);

        return ratingDifference === 0 ? alphaDifference : ratingDifference;
      });
      break;
    case 3:
      sorted = teamElements.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];
        const ratingA = a["rating"];
        const ratingB = b["rating"];

        const ratingDifference = ratingA - ratingB;
        const alphaDifference = keyA.localeCompare(keyB);

        return ratingDifference === 0 ? alphaDifference : ratingDifference;
      });
      break;
    case 4:
      sorted = teamElements.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];

        return keyA.localeCompare(keyB);
      });
      break;
    case 5:
      sorted = teamElements.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];

        return keyB.localeCompare(keyA);
      });
      break;
    default:
      break;
  }

  if (sorted.length > 0) {
    teamElements = sorted;
  }
}

function validateDeleteTeam() {
  const delBtn = document.getElementById("deleteTeamBtn");
  const delIcon = delBtn.getElementsByTagName("img")[0];
  const nameInput = document.getElementById("teamName");
  const message = document.getElementById("deleteMessage");

  setBtnIcon(delIcon, "trashRed", `Delete team '${teamName}'`);

  linkedBtns = linkedBtns.filter((btn) => btn !== delBtn);
  linkedBtns.push(delBtn);

  delBtn.addEventListener("click", () => {
    const isUnchecked = !delIcon.getAttribute("src").includes("check");
    const teamToDel = nameInput.value.trim();

    nameInput.value = "";

    useBtnLinks();

    if (isUnchecked) {
      if (teamToDel === teamName) {
        message.innerText = `Warning! You are about to delete team '${teamName}'.This action can't be undone and all progress will be lost. Click to confirm`;
        setBtnIcon(delIcon, "checkRed", "Click to confirm");
      } else {
        if (teamToDel === "") {
          message.innerText = "Enter team name";
          setBtnIcon(delIcon, "banRed", "Enter team name");
        } else {
          message.innerText = "Incorrect team name";
          setBtnIcon(delIcon, "banRed", "Incorrect team name");
        }
      }

      const timeOut = setTimeout(() => {
        message.innerText = "";
        setBtnIcon(delIcon, "trashRed", `Delete team '${teamName}'`);
      }, 7000);
      timeOutBtns = timeOutBtns.filter((time) => time !== timeOut);
      timeOutBtns.push(timeOut);
    } else {
      message.innerText = "";
      nameInput.value = "";
      setBtnIcon(delIcon, "trashRed", `Delete team '${teamName}'`);
      deleteTeam();
    }
  });

  const resetStatus = () => {
    setBtnIcon(delIcon, "trashRed", `Delete team '${teamName}'`);
    message.innerText = "";
  };

  useFocusEvent(nameInput, resetStatus);
}

function postionDangerZone() {
  if (numMonsters > 0) {
    dangerZone.setAttribute("class", "dangerZone");
  } else {
    dangerZone.setAttribute("class", "dangerZone position-bottom");
  }
}

function placeUserCredits() {
  const credz = document.getElementsByClassName("userCredits")[0];
  if (credz) {
    credz.classList.remove("userCredits");
  }
}

function renderControlBtns() {
  let controlBtns = document.createElement("div");

  const controlBtnsExists = document.getElementsByClassName("controlBtns")[0];

  if (controlBtnsExists) {
    controlBtns = controlBtnsExists;
  }

  controlBtns.innerHTML = "";

  const buyBtn = imgAsBtn(isPaidFor ? "sell" : "cart", isPaidFor ? `Sell '${teamName}' for ${teamValue} credits` : `Buy '${teamName}' for ${teamCost} credits`);
  const shuffleBtn = imgAsBtn("shuffle", `Fill '${teamName}' with 4 random monsters`);
  const fightBtn = imgAsBtn("shield", `Fight with '${teamName}'`);

  controlBtns.setAttribute("class", "controlBtns");
  buyBtn.setAttribute("class", "controlBtn buySell");
  shuffleBtn.setAttribute("class", "controlBtn shuffle");
  fightBtn.setAttribute("class", "controlBtn fight");

  linkedBtns.push(buyBtn);
  linkedBtns.push(shuffleBtn);
  linkedBtns.push(fightBtn);

  buyBtn.addEventListener("click", () => {
    const buyIcon = buyBtn.getElementsByTagName("img")[0];
    const isUnchecked = !buyIcon.getAttribute("src").includes("check");
    useBtnLinks();

    if (isUnchecked) {
      if (isPaidFor) {
        setBtnIcon(buyIcon, "check", "Click to confirm");
        buyBtn.appendChild(renderIconWithNumber(teamValue, "../../res/icons/diamond.svg", ""));
        setActionMessage("", `Click to confirm that you want to sell '${teamName}' for ${teamValue} credits`);
      } else {
        if (numMonsters === 4) {
          if (teamCost <= userCredits) {
            setBtnIcon(buyIcon, "check", "Click to confirm");
            buyBtn.appendChild(renderIconWithNumber(teamCost, "../../res/icons/diamond.svg", ""));
            setActionMessage("", `Click to confirm that you want to buy '${teamName}' for ${teamCost} credits`);
          } else {
            setBtnIcon(buyIcon, "ban", "You don't have enough credits");
            setActionMessage("error", `You don't have enough credits to buy '${teamName}'. Total cost is ${teamCost} credits but you only have ${userCredits}`);
          }
        } else {
          setBtnIcon(buyIcon, "ban", "You must fill all 4 slots in your team before you can buy it");
          setActionMessage("error", `All 4 slots must be filled before you can buy '${teamName}'`);
        }
      }

      const timeOut = setTimeout(() => {
        const secondChild = buyBtn.children[1];
        if (secondChild) {
          secondChild.remove();
        }
        if (isPaidFor) {
          setBtnIcon(buyIcon, "sell", `Sell '${teamName}' for ${teamValue} credits`);
        } else {
          setBtnIcon(buyIcon, "cart", `Buy '${teamName}' for ${teamCost} credits`);
        }
      }, 7000);
      timeOutBtns.push(timeOut);
    } else {
      const secondChild = buyBtn.children[1];
      if (secondChild) {
        secondChild.remove();
      }
      if (isPaidFor) {
        sellTeam();
        setBtnIcon(buyIcon, "sell", `Sell '${teamName}' for ${teamValue} credits`);
        setActionMessage("hide", "message");
      } else {
        buyTeam();
        setBtnIcon(buyIcon, "cart", `Buy '${teamName}' for ${teamCost} credits`);
        setActionMessage("hide", "message");
      }
    }
  });

  shuffleBtn.addEventListener("click", () => {
    const shuffleIcon = shuffleBtn.getElementsByTagName("img")[0];
    const isUnchecked = !shuffleIcon.getAttribute("src").includes("check");
    useBtnLinks();

    if (isUnchecked) {
      setBtnIcon(shuffleIcon, "check", "Click to confirm");
      setActionMessage("", `Click to confirm that you want to replace all monsters in '${teamName}'. This action can't be undone`);
      const timeOut = setTimeout(() => {
        setBtnIcon(shuffleIcon, "shuffle", `Fill '${teamName}' with 4 random monsters`);
      }, 7000);
      timeOutBtns.push(timeOut);
    } else {
      shuffleTeam();
      setBtnIcon(shuffleIcon, "shuffle", `Fill '${teamName}' with 4 random monsters`);
      setActionMessage("hide", "message");
    }
  });

  fightBtn.addEventListener("click", () => {
    const fightIcon = fightBtn.getElementsByTagName("img")[0];
    const isUnchecked = !fightIcon.getAttribute("src").includes("check");
    useBtnLinks();

    if (isUnchecked) {
      if (isPaidFor) {
        setBtnIcon(fightIcon, "check", "Click to confirm");
        setActionMessage("", `Click to confirm to fight with '${teamName}'. You will redirected to the fight page`);
      } else {
        setBtnIcon(fightIcon, "ban", `You must buy team '${teamName}' before you can fight with it`);
        setActionMessage("error", `You must buy team '${teamName}' before you can fight with it`);
      }
      const timeOut = setTimeout(() => {
        setBtnIcon(fightIcon, "shield", `Fight with '${teamName}'`);
      }, 7000);
      timeOutBtns.push(timeOut);
    } else {
      if (isPaidFor) {
        fightTeam();
      }
      setBtnIcon(fightIcon, "shield", `Fight with '${teamName}'`);
      setActionMessage("hide", "message");
    }
  });

  controlBtns.appendChild(buyBtn);
  if (!isPaidFor) {
    controlBtns.appendChild(shuffleBtn);
  }
  controlBtns.appendChild(fightBtn);

  controls.appendChild(controlBtns);
}

function renderPageInfo() {
  const pageInfoEl = document.getElementById("pageInfo");
  const teamCostEl = renderIconWithNumber(teamCost, "../../res/icons/diamond.svg", `Total cost of '${teamName}' is ${teamCost} credits`);
  const teamNameEl = document.createElement("h1");
  const pageNameEl = document.createElement("h2");

  pageInfoEl.innerHTML = "";

  teamNameEl.innerText = `Team ${teamName}`;
  pageNameEl.innerText = "Settings and stats";

  teamCostEl.classList.add("pageInfoTeamCost");
  teamNameEl.setAttribute("class", "teamName");
  pageNameEl.setAttribute("class", "pageName");

  pageInfoEl.append(teamNameEl, teamCostEl, pageNameEl);
}

function renderDefaultMessage() {
  if (numMonsters > 0) {
    defaultMessage.setAttribute("class", "defaultMessage hidden");
  } else {
    defaultMessage.setAttribute("class", "defaultMessage");
  }
}

function renderTeamStats() {
  teamStats.innerHTML = "";

  if (numMonsters > 0) {
    teamStats.setAttribute("class", "teamStatsConatiner border-gold");

    const averageRank = Math.floor(totalRank / numMonsters);
    const averageRating = Math.floor(totalRating / numMonsters);
    const averageHealth = Math.floor(totalHealth / numMonsters);
    const averageDamage = Math.floor(totalDamage / numMonsters);

    const numMonstersIcon = renderIconWithNumber(numMonsters, "../../res/icons/skull.svg", `There is ${numMonsters} monsters in team '${teamName}'`);
    const winRateIcon = renderIconWithNumber(winRate, "../../res/icons/rate.svg", `Team '${teamName}' has a winrate of ${winRate}`, "right");
    const rankIcon = renderIconWithNumber(totalRank, "../../res/icons/ribbon.svg", `Team '${teamName}' has a rank of ${totalRank}`);
    const ratingIcon = renderIconWithNumber(totalRating, "../../res/icons/trophy.svg", `Team '${teamName}' has a combinded rating of ${totalRating}`);
    const healthIcon = renderIconWithNumber(totalHealth, "../../res/icons/heart.svg", `Team '${teamName}' has ${totalHealth} in total health`);
    const damageIcon = renderIconWithNumber(totalDamage, "../../res/icons/barbell.svg", `Team '${teamName}' has ${totalDamage} in total damage`);
    const averageRankIcon = averageValueIcon(averageRank, "ribbon", "skull", `Team '${teamName}' has an average rank of ${averageRank}`);
    const averageRatingIcon = averageValueIcon(averageRating, "trophy", "skull", `Team '${teamName}' has an average rating of ${averageRating}`);
    const averageHealthIcon = averageValueIcon(averageHealth, "heart", "skull", `Team '${teamName}' has ${averageHealth} in average health`);
    const averageDamageIcon = averageValueIcon(averageDamage, "barbell", "skull", `Team '${teamName}' has ${averageDamage} in average damage`);

    numMonstersIcon.classList.add("border-icon");
    winRateIcon.classList.add("border-icon", "border-icon-right");
    rankIcon.classList.add("teamStatsIcon");
    ratingIcon.classList.add("teamStatsIcon");
    healthIcon.classList.add("teamStatsIcon");
    damageIcon.classList.add("teamStatsIcon");
    averageRankIcon.classList.add("teamAverageStatsIcon");
    averageRatingIcon.classList.add("teamAverageStatsIcon");
    averageHealthIcon.classList.add("teamAverageStatsIcon");
    averageDamageIcon.classList.add("teamAverageStatsIcon");

    teamStats.append(numMonstersIcon, winRateIcon, rankIcon, ratingIcon, healthIcon, damageIcon, averageRankIcon, averageRatingIcon, averageHealthIcon, averageDamageIcon);
  } else {
    teamStats.setAttribute("class", "teamStatsConatiner hidden");
  }
}

function renderMonsters() {
  monstersContainer.innerHTML = "";

  if (teamMonsters && numMonsters > 0) {
    monstersContainer.setAttribute("class", "teamMonsters");

    teamMonsters.forEach((monster) => {
      const monsterId = monster.id;
      const monsterName = monster.name;
      const monsterCardContainer = document.createElement("div");
      const monsterCard = new MonsterCard(monster, [], true).assembleMonsterCard();
      const removeBtn = imgAsBtn("x", `Remove from '${teamName}'`);
      const shiftPlaceBtn = imgAsBtn("rightFlatArrow", "Change fight order. Monster furthest to the left will start");

      const monsterTeamRank = team.getMonsterTeamRank(monster.id);

      monsterCardContainer.setAttribute("class", "monsterCardContainer");
      monsterCardContainer.setAttribute("data-teamRank", `#${monsterTeamRank}`);

      removeBtn.setAttribute("class", "removeMonsterBtn primary-btn btn-small");
      shiftPlaceBtn.setAttribute("class", "shiftMonsterBtn primary-btn");
      linkedBtns.push(removeBtn);

      removeBtn.addEventListener("click", () => {
        const removeIcon = removeBtn.getElementsByTagName("img")[0];
        const isUnchecked = !removeIcon.getAttribute("src").includes("check");
        useBtnLinks();

        if (isUnchecked) {
          setBtnIcon(removeIcon, "check", "Click to confirm");
          setActionMessage("", `Click to confirm that you want to remove ${monsterName} from '${teamName}'`);
          const timeOut = setTimeout(() => {
            setBtnIcon(removeIcon, "x", `Remove from '${teamName}'`);
          }, 7000);
          timeOutBtns.push(timeOut);
        } else {
          removeMonster(monster.id);
          setActionMessage("hide", "message");
          setBtnIcon(removeIcon, "x", `Remove from '${teamName}'`);
          setActionMessage("hide", "message");
        }
      });

      shiftPlaceBtn.addEventListener("click", () => {
        shiftTeamOrder(monsterId);
      });

      monsterCard.appendChild(removeBtn);
      monsterCardContainer.appendChild(shiftPlaceBtn);
      monsterCardContainer.appendChild(monsterCard);
      monstersContainer.appendChild(monsterCardContainer);
    });
  } else {
    monstersContainer.setAttribute("class", "teamMonsters hidden");
  }
}

function renderElements() {
  teamElementsContainer.innerHTML = "";
  const numElements = teamElements.length;

  if (numMonsters > 0) {
    teamElementsContainer.setAttribute("class", "teamElementsContainer border-gold");

    const heading = document.createElement("div");
    const elementsIcon = renderIconWithNumber(numElements, "../../res/icons/element.svg", `There is ${numElements} elements available`);
    const header = document.createElement("h2");
    const toggle = imgAsBtn("downArrow", "Hide Elements");
    const body = document.createElement("div");
    const filters = document.createElement("div");
    const search = document.createElement("input");
    const sort = document.createElement("select");
    const elements = document.createElement("div");

    heading.setAttribute("class", "teamElementsHeading");
    elementsIcon.classList.add("border-icon");
    header.setAttribute("class", "teamElementsHeader");
    toggle.setAttribute("class", "primary-btn teamElmentsToggle");
    body.setAttribute("class", "teamElementsBody hidden");
    filters.setAttribute("class", "teamElementsFilters");
    search.setAttribute("class", "teamElementsSearch");
    sort.setAttribute("class", "teamElementsSort");
    elements.setAttribute("class", "teamElements");

    header.innerText = "Available elements";

    search.setAttribute("placeholder", "Search by element name");
    populateElementsSortSelect(sort);

    createElementContainers(elements);

    toggle.addEventListener("click", () => {
      const toggleIcon = toggle.getElementsByTagName("img")[0];
      const isExtended = toggleIcon.getAttribute("src").includes("downArrow");

      if (isExtended) {
        body.setAttribute("class", "teamElementsBody");
        setBtnIcon(toggleIcon, "upArrow", "Hide Elements");
      } else {
        body.setAttribute("class", "teamElementsBody hidden");
        setBtnIcon(toggleIcon, "downArrow", "Show Elements");
      }
    });

    search.addEventListener("input", () => {
      searchElements(elements, search);
    });

    sort.addEventListener("change", () => {
      setSortOrder(elements, sort, search);
    });

    heading.append(elementsIcon, header, toggle);
    filters.append(search, sort);
    body.append(filters, elements);

    teamElementsContainer.append(heading, body);
  } else {
    teamElementsContainer.setAttribute("class", "teamElementsContainer border-gold hidden");
  }
}

function renderBattleRecord() {
  battleRecordContainer.innerHTML = "";

  if (numMonsters > 0) {
    battleRecordContainer.setAttribute("class", "battleRecordContainer border-gold");

    const heading = document.createElement("div");
    const battleIcon = renderIconWithNumber(numBattels, "../../res/icons/shield.svg", `Team '${teamName}' has fought ${numBattels} battles`);
    const teamProfitIcon = renderIconWithNumber(teamProfit, "../../res/icons/diamond.svg", `Team '${teamName}' has genereated a profit of ${teamProfit} credits`, "right");
    const header = document.createElement("h2");
    const toggle = imgAsBtn("downArrow", "Hide Elements");
    const body = document.createElement("div");
    const stats = document.createElement("div");

    const battleValues = document.createElement("div");
    const fightValues = document.createElement("div");
    const roundValues = document.createElement("div");
    const monsterStatsValues = document.createElement("div");

    const battleBar = progressBar(wonBattels, drawnBattels, lostBattels);
    const fightBar = progressBar(wonFights, drawnFights, lostFights);
    const roundBar = progressBar(wonRounds, drawnRounds, lostRounds);

    const wonBattelsEl = valueWithHeader(wonBattels, "Won Battels");
    const drawnBattelsEl = valueWithHeader(drawnBattels, "Drawn Battels");
    const lostBattelsEl = valueWithHeader(lostBattels, "Lost Battels");
    const totalPointsEl = valueWithHeader(totalPoints, "Total points");

    const numFightsEl = valueWithHeader(numFights, "Fights");
    const wonFightsEl = valueWithHeader(wonFights, "Won fights");
    const drawnFightsEl = valueWithHeader(drawnFights, "Drawn fights");
    const lostFightsEl = valueWithHeader(lostFights, "Lost fights");

    const numRoundsEl = valueWithHeader(numRounds, "Rounds");
    const wonRoundsEl = valueWithHeader(wonRounds, "Won rounds");
    const drawnRoundsEl = valueWithHeader(drawnRounds, "Drawn rounds");
    const lostRoundsEl = valueWithHeader(lostRounds, "Lost rounds");

    const lostHpEl = valueWithHeader(lostHp, "Lost health");
    const remainingHpEl = valueWithHeader(`${remainingHP}%`, "Remaining health");
    const sufferedDamageEl = valueWithHeader(sufferedDamage, "Suffered damage");
    const distributedDamageEl = valueWithHeader(distributedDamage, "Distributed damage");

    heading.setAttribute("class", "heading");
    battleIcon.classList.add("border-icon");
    teamProfitIcon.classList.add("border-icon", "border-icon-right");
    header.setAttribute("class", "header");
    toggle.setAttribute("class", "primary-btn toggle");
    body.setAttribute("class", "body hidden");
    stats.setAttribute("class", "stats");

    battleValues.setAttribute("class", "statsGroup");
    fightValues.setAttribute("class", "statsGroup");
    roundValues.setAttribute("class", "statsGroup");
    monsterStatsValues.setAttribute("class", "statsGroup");

    wonBattelsEl.setAttribute("class", "stat");
    drawnBattelsEl.setAttribute("class", "stat");
    lostBattelsEl.setAttribute("class", "stat");
    totalPointsEl.setAttribute("class", "stat");

    numFightsEl.setAttribute("class", "stat");
    wonFightsEl.setAttribute("class", "stat");
    drawnFightsEl.setAttribute("class", "stat");
    lostFightsEl.setAttribute("class", "stat");

    numRoundsEl.setAttribute("class", "stat");
    wonRoundsEl.setAttribute("class", "stat");
    drawnRoundsEl.setAttribute("class", "stat");
    lostRoundsEl.setAttribute("class", "stat");

    lostHpEl.setAttribute("class", "stat");
    remainingHpEl.setAttribute("class", "stat");
    sufferedDamageEl.setAttribute("class", "stat");
    distributedDamageEl.setAttribute("class", "stat");

    header.innerText = "Battle record";

    battleValues.append(wonBattelsEl, drawnBattelsEl, lostBattelsEl, totalPointsEl);
    fightValues.append(numFightsEl, wonFightsEl, drawnFightsEl, lostFightsEl);
    roundValues.append(numRoundsEl, wonRoundsEl, drawnRoundsEl, lostRoundsEl);
    monsterStatsValues.append(lostHpEl, remainingHpEl, sufferedDamageEl, distributedDamageEl);

    stats.append(battleValues, battleBar, fightValues, fightBar, roundValues, roundBar, monsterStatsValues);

    toggle.addEventListener("click", () => {
      const toggleIcon = toggle.getElementsByTagName("img")[0];
      const isExtended = toggleIcon.getAttribute("src").includes("downArrow");

      if (isExtended) {
        body.setAttribute("class", "body");
        setBtnIcon(toggleIcon, "upArrow", "Hide Elements");
      } else {
        body.setAttribute("class", "body hidden");
        setBtnIcon(toggleIcon, "downArrow", "Show Elements");
      }
    });

    heading.append(battleIcon, teamProfitIcon, header, toggle);
    body.append(stats, renderFoughtMonsters(), renderMonsterRecords());

    battleRecordContainer.append(heading, body);
  } else {
    battleRecordContainer.setAttribute("class", "battleRecordContainer border-gold hidden");
  }
}

function renderFoughtMonsters() {
  const container = document.createElement("div");
  const wonContainer = document.createElement("div");
  const lostContainer = document.createElement("div");
  const wonHeader = document.createElement("h2");
  const lostHeader = document.createElement("h2");
  const won = document.createElement("div");
  const lost = document.createElement("div");

  container.setAttribute("class", "foughtMonsters");
  wonContainer.setAttribute("class", "container");
  lostContainer.setAttribute("class", "container");
  wonHeader.setAttribute("class", "header");
  lostHeader.setAttribute("class", "header");
  won.setAttribute("class", "monsters");
  lost.setAttribute("class", "monsters");

  wonHeader.innerText = "Won against";
  lostHeader.innerText = "Lost against";

  wonAgainst.forEach((w) => {
    const value = `${Object.values(w)[0]}x ${Object.keys(w)[0]}`;
    const p = document.createElement("p");
    p.setAttribute("class", "monster");
    p.innerText = value;
    won.appendChild(p);
  });

  lostAgainst.forEach((l) => {
    const value = `${Object.values(l)[0]}x ${Object.keys(l)[0]}`;
    const p = document.createElement("p");
    p.setAttribute("class", "monster");
    p.innerText = value;
    lost.appendChild(p);
  });

  wonContainer.append(wonHeader, won);
  lostContainer.append(lostHeader, lost);
  container.append(wonContainer, lostContainer);

  return container;
}

function renderMonsterRecords() {
  const container = document.createElement("div");

  container.setAttribute("class", "monsterRecords");

  teamMonsters.forEach((monster) => {
    const card = document.createElement("div");
    const cardHeader = document.createElement("h2");
    const cardBody = document.createElement("div");
    const monsterImage = new MonsterCard(monster, [], true).getImage();
    const record = document.createElement("div");
    const monsterStats = document.createElement("div");
    const fights = document.createElement("div");
    const rounds = document.createElement("div");
    const fought = document.createElement("div");
    const fightBar = progressBar(monster.wonFights, monster.drawnFights, monster.lostFights);
    const roundBar = progressBar(monster.wonRounds, monster.drawnRounds, monster.lostRounds);
    const wins = dataList("Won against", monster.wonAgainst);
    const draws = dataList("Won against", monster.drawnAgainst);
    const losses = dataList("Won against", monster.lostAgainst);

    const lostHpEl = valueWithHeader(monster.lostHP, "Lost health");
    const remainingHpEl = valueWithHeader(monster.percentHP, "Remaining health");
    const sufferedDamageEl = valueWithHeader(monster.sufferedDamage, "Suffered damage");
    const distributedDamageEl = valueWithHeader(monster.distributedDamage, "Distributed damage");

    const numFights = valueWithHeader(monster.numFights, "Fights");
    const wonFights = valueWithHeader(monster.wonFights, "Won");
    const drawnFights = valueWithHeader(monster.drawnFights, "Drawn");
    const lostFights = valueWithHeader(monster.lostFights, "Lost");
    const points = valueWithHeader(monster.points, "Points");

    const numRounds = valueWithHeader(monster.numRounds, "Rounds");
    const wonRounds = valueWithHeader(monster.wonRounds, "Won");
    const drawnRounds = valueWithHeader(monster.drawnRounds, "Drawn");
    const lostRounds = valueWithHeader(monster.lostRounds, "Lost");
    const winRate = valueWithHeader(monster.winRate, "Winrate");

    card.setAttribute("class", "card");
    cardHeader.setAttribute("class", "cardHeader");
    cardBody.setAttribute("class", "cardBody");
    monsterImage.classList.add("filter");
    record.setAttribute("class", "record");
    monsterStats.setAttribute("class", "monsterStats");
    fights.setAttribute("class", "fights");
    rounds.setAttribute("class", "rounds");
    fought.setAttribute("class", "fought");
    lostHpEl.setAttribute("class", "stat");
    remainingHpEl.setAttribute("class", "stat");
    sufferedDamageEl.setAttribute("class", "stat");
    distributedDamageEl.setAttribute("class", "stat");
    numFights.setAttribute("class", "stat");
    wonFights.setAttribute("class", "stat");
    drawnFights.setAttribute("class", "stat");
    lostFights.setAttribute("class", "stat");
    points.setAttribute("class", "stat");
    numRounds.setAttribute("class", "stat");
    wonRounds.setAttribute("class", "stat");
    drawnRounds.setAttribute("class", "stat");
    lostRounds.setAttribute("class", "stat");
    winRate.setAttribute("class", "stat");
    wins.setAttribute("class", "fightResult");
    draws.setAttribute("class", "fightResult");
    losses.setAttribute("class", "fightResult");

    cardHeader.innerText = monster.name;

    monsterStats.append(lostHpEl, remainingHpEl, sufferedDamageEl, distributedDamageEl);
    fights.append(numFights, wonFights, drawnFights, lostFights, points);
    rounds.append(numRounds, wonRounds, drawnRounds, lostRounds, winRate);
    fought.append(wins, draws, losses);

    record.append(fights, fightBar, rounds, roundBar, fought);

    cardBody.append(monsterImage, record);

    card.append(cardHeader, monsterStats, cardBody);

    container.appendChild(card);
  });

  return container;
}
