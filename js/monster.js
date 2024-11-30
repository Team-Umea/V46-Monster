//Js code for monster page
import { serveData, serveFetchedData } from "./common/fetch.js";
import { useClickEvent, useScrollEvent, useChangeEvent, useInputEvent, useMouseWheelEvent } from "./common/useEvent.js";
import { MONSTERS_LSK, ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { load, isValidObjKey } from "./common/utilities.js";
import { renderSelect } from "./common/render.js";

const monsterContainer = document.getElementById("monsterContainer");
const sortDropDown = document.getElementById("sortDropdown");
const searchButtonGroup = document.getElementById("searchCategory");
const searchBtns = searchButtonGroup.getElementsByTagName("input");
const searchBox = document.getElementById("searchBox");

//time in seconds for how long the data will be cached for before it will refetch
//this way we can limit the number of calls to the api for data that don't need
//constent updates
const ttl = 60;
let allMonsters = [];
let visibleMonsters = load(MONSTERS_LSK) ? load(MONSTERS_LSK).data.length : 20;
const monsterCards = [];
let monsters = [];
let searchCategory;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  allMonsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl);

  useScrollEvent(monsterContainer, infiniteScroll);
  useChangeEvent(sortDropDown, setSortOrder);
  useMouseWheelEvent(monsterContainer, showAllMonsters);

  Array.from(searchBtns).forEach((btn) => {
    useClickEvent(btn, setSearchCategory);
  });

  useInputEvent(searchBox, searchMonsters);
  processMonsters();
  populateSortDropDown();
  setSearchCategory();
}

function constructParams(num, start, sort) {
  return `num=${num}&start=${start}&sort=${sort}`;
}

function populateSortDropDown() {
  serveData("sortOptions", undefined, sortDropDown).then((options) => {
    renderSelect(sortDropDown, options);
  });
}

async function processMonsters() {
  renderLoadingSkeletons(visibleMonsters);
  const params = constructParams(visibleMonsters, 0, 0);

  const monsterData = await serveData("monsters", params, monsterContainer, MONSTERS_LSK, ttl);
  if (monsterData.length > 0) {
    assignMonsters(monsterData);
    appendNewMonsters(monsters);
  }
}

function assignMonsters(data) {
  const mappedData = data.map((data) => ({ monster: data, visible: true }));
  const oldMonsters = monsters;
  monsters = [...oldMonsters, ...mappedData];

  const sortOrder = getSortOrder();
  sortMonsters(sortOrder);
  showAllMonsters();
}

function renderLoadingSkeletons(max) {
  // monsterContainer.innerHTML = "";
  for (let i = 0; i < max; i++) {
    const monsterCard = new MonsterCard();
    const assembleMonsterCard = monsterCard.getLoadingSkeletion();
    monsterCards.push(monsterCard);
    monsterContainer.appendChild(assembleMonsterCard);
  }
}

function appendNewMonsters(monsters) {
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsterCards.forEach((card, index) => {
    const monsterObj = monsters[index];

    if (monsterObj) {
      const monster = monsterObj.monster;
      const id = monster.id;

      card.setValues(monster, allMonsters, tempTeams, id);
      card.assembleMonsterCard();
    }
  });
}

function renderUpdatedMonster(monsters) {
  monsterContainer.innerHTML = "";
  const tempTeams = ["a", "b", "c", "d"];

  monsters.forEach((monsterObj) => {
    const isVisible = monsterObj.visible;
    if (isVisible) {
      const monster = monsterObj.monster;
      const id = monster.id;
      const monsterCard = new MonsterCard(monster, allMonsters, tempTeams, id);
      const assembledMonsterCard = monsterCard.assembleMonsterCard();
      monsterContainer.appendChild(assembledMonsterCard);
    }
  });
}

function getSortOrder() {
  return Number(sortDropDown.value);
}

async function infiniteScroll() {
  if (visibleMonsters < allMonsters.length) {
    const numNewMonsters = 10;
    renderLoadingSkeletons(numNewMonsters);

    const sortOrder = getSortOrder();
    const params = constructParams(visibleMonsters, numNewMonsters, sortOrder);

    visibleMonsters += numNewMonsters;

    const monsterData = await serveFetchedData("monsters", params, monsterContainer, MONSTERS_LSK, ttl);
    const newMonsters = monsterData.slice(-numNewMonsters);

    assignMonsters(newMonsters);
    appendNewMonsters(monsters);
  }
}

function setSortOrder() {
  const sortOrder = Number(sortDropDown.value);
  sortMonsters(sortOrder);
  showAllMonsters();
}

function setSearchCategory() {
  const selectedBtn = Array.from(searchBtns).find((btn) => btn.checked);
  searchCategory = selectedBtn.value;
}

function showAllMonsters() {
  monsters.forEach((monster) => (monster.visible = true));
  searchBox.value = "";
  renderUpdatedMonster(monsters);
}

function searchMonsters() {
  const searchQuery = searchBox.value.trim().toLowerCase();
  monsters.forEach((monsterObj) => {
    const monster = monsterObj.monster;

    if (searchCategory !== "rank") {
      if (searchCategory in monster) {
        const value = monster[searchCategory];
        let valueStrHasQuery;
        let valueArrHasQuery;

        if (typeof value === "string" || typeof value === "number") {
          valueStrHasQuery = value.toString().trim().toLowerCase().startsWith(searchQuery);
        } else {
          valueArrHasQuery = value.some((item) => item.toLowerCase().startsWith(searchQuery));
        }

        if (valueStrHasQuery || valueArrHasQuery) {
          monsterObj.visible = true;
        } else {
          monsterObj.visible = false;
        }
      }
    } else {
      const rankList = getMonstersRankList();
      const rank = rankList.indexOf(rankList.find((m) => m.id === monster.id));
      const descending = (rankList.length - rank).toString();

      if (descending.startsWith(searchQuery)) {
        monsterObj.visible = true;
      } else {
        monsterObj.visible = false;
      }
    }
  });

  renderUpdatedMonster(monsters);
}

function sortMonsters(sortOrder) {
  switch (sortOrder) {
    case 0:
      //A-Z;
      defaultSort("name");
      break;
    case 1:
      //Z-A
      reverseSort("name");
      break;
    case 2:
      //Lo-Hi Price
      defaultSort("price");
      break;
    case 3:
      //Hi-Lo Price
      reverseSort("price");
      break;
    case 4:
      //Lo-Hi Health
      defaultSort("health");
      break;
    case 5:
      //Hi-Lo Health
      reverseSort("health");
      break;
    case 6:
      //Lo-Hi Rank
      sortByLoHiRank();
      break;
    case 7:
      //Hi-Lo Rank
      sortByHiLoRank();
      break;
    case 8:
      //Lo-Hi Damage
      console.log("Sorted");
      defaultSort("damage");
      break;
    case 9:
      //Hi-Lo Damage
      reverseSort("damage");
      break;
    case 10:
      //Few-Many Elements
      console.log("hello");
      sortByFewToManyElements();
      break;
    case 11:
      //Many-Few Elements;
      sortByManyToFewElements();
      break;
    default:
      break;
  }
  renderUpdatedMonster(monsters);
}

function defaultSort(key) {
  const tempMonsters = monsters.map((monster) => monster.monster);
  if (isValidObjKey(tempMonsters, key)) {
    monsters = monsters.sort((a, b) => {
      const monsterA = a.monster;
      const monsterB = b.monster;
      const valueA = monsterA[key];
      const valueB = monsterB[key];
      if (typeof valueA === "string") {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === "number") {
        const diff = valueA - valueB;
        return diff === 0 ? monsterA.name.localeCompare(monsterB.name) : diff;
      }
    });
  }
}

function reverseSort(key) {
  const tempMonsters = monsters.map((monster) => monster.monster);
  if (isValidObjKey(tempMonsters, key)) {
    monsters = monsters.sort((a, b) => {
      const monsterA = a.monster;
      const monsterB = b.monster;
      const valueA = monsterA[key];
      const valueB = monsterB[key];
      if (typeof valueA === "string") {
        return valueB.localeCompare(valueA);
      } else if (typeof valueA === "number") {
        const diff = valueB - valueA;
        return diff === 0 ? monsterA.name.localeCompare(monsterB.name) : diff;
      }
    });
  }
}

function sortByLoHiRank() {
  const rankList = getMonstersRankList();

  monsters = monsters.sort((a, b) => {
    const monsterA = a.monster;
    const monsterB = b.monster;

    const rankA = rankList.length - rankList.indexOf(rankList.find((m) => m.id === monsterA.id));
    const rankB = rankList.length - rankList.indexOf(rankList.find((m) => m.id === monsterB.id));

    const rankDiff = rankB - rankA;
    return rankDiff === 0 ? monsterA.name.localeCompare(monsterB.name) : rankDiff;
  });
}

function sortByHiLoRank() {
  const rankList = getMonstersRankList();

  monsters = monsters.sort((a, b) => {
    const monsterA = a.monster;
    const monsterB = b.monster;

    const rankA = rankList.length - rankList.indexOf(rankList.find((m) => m.id === monsterA.id));
    const rankB = rankList.length - rankList.indexOf(rankList.find((m) => m.id === monsterB.id));

    const rankDiff = rankA - rankB;
    return rankDiff === 0 ? monsterA.name.localeCompare(monsterB.name) : rankDiff;
  });
}

function sortByFewToManyElements() {
  monsters = monsters.sort((a, b) => {
    const monsterA = a.monster;
    const monsterB = b.monster;
    const elementsA = monsterA.elements.length;
    const elementsB = monsterB.elements.length;
    const elementsDifference = elementsA - elementsB;
    return elementsDifference === 0 ? monsterA.name.localeCompare(monsterB.name) : elementsDifference;
  });
}

function sortByManyToFewElements() {
  monsters = monsters.sort((a, b) => {
    const monsterA = a.monster;
    const monsterB = b.monster;
    const elementsA = monsterA.elements.length;
    const elementsB = monsterB.elements.length;
    const elementsDifference = elementsB - elementsA;
    return elementsDifference === 0 ? monsterA.name.localeCompare(monsterB.name) : elementsDifference;
  });
}

function getMonstersRankList() {
  const rankList = allMonsters.sort((a, b) => {
    const ratingA = a.health + a.damage;
    const ratingB = b.health + a.damage;
    return ratingA - ratingB;
  });
  return rankList;
}
