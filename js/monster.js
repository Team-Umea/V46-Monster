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
const searchSortContainer = document.getElementById("searchSortContainer");
const filterToggle = document.getElementById("filterToggle");

const ttl = 60;
let visibleMonsters = 20;
const monsterCards = [];
let monsters = [];
let searchCategory;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(filterToggle, toggleFilter);
  useScrollEvent(monsterContainer, infiniteScroll);
  useChangeEvent(sortDropDown, setSortOrder);
  useInputEvent(searchBox, searchMonsters);
  useMouseWheelEvent(monsterContainer, showAllMonsters);

  Array.from(searchBtns).forEach((btn) => {
    useClickEvent(btn, setSearchCategory);
  });

  useMonsterData();
  populateSortDropDown();
  setSearchCategory();
}

function populateSortDropDown() {
  serveData("sortOptions", undefined, sortDropDown).then((options) => {
    renderSelect(sortDropDown, options);
  });
}

async function useMonsterData() {
  renderLoadingSkeletons(visibleMonsters);

  const monsterData = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl);
  monsters = monsterData.map((data) => ({ monster: data, visible: true }));

  showMonsters();

  renderMonsters();
}

function showMonsters() {
  const sortOrder = Number(sortDropDown.value);
  sortMonsters(sortOrder);

  monsters.forEach((monster, index) => {
    if (index >= visibleMonsters) {
      monster.visible = false;
    } else {
      monster.visible = true;
    }
  });
}

function renderLoadingSkeletons(max) {
  for (let i = 0; i < max; i++) {
    const monsterCard = new MonsterCard();
    const assembleMonsterCard = monsterCard.getLoadingSkeletion();
    monsterCards.push(monsterCard);
    monsterContainer.appendChild(assembleMonsterCard);
  }
}

function renderMonsters() {
  monsterContainer.innerHTML = "";
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsters.forEach((monsterObj) => {
    const isVisible = monsterObj.visible;
    if (isVisible) {
      const monster = monsterObj.monster;
      const id = monster.id;
      const allMonsters = [...monsters];
      const monsterCard = new MonsterCard(monster, allMonsters, tempTeams, id);
      const assembledMonsterCard = monsterCard.assembleMonsterCard();
      monsterContainer.appendChild(assembledMonsterCard);
    }
  });
}

function infiniteScroll() {
  if (visibleMonsters < monsters.length) {
    visibleMonsters += 10;
    showMonsters();
    renderMonsters();
  }
}

function setSortOrder() {
  const sortOrder = Number(sortDropDown.value);
  sortMonsters(sortOrder);
  showAllMonsters();
  renderMonsters();
}

function setSearchCategory() {
  const selectedBtn = Array.from(searchBtns).find((btn) => btn.checked);
  searchCategory = selectedBtn.value;
}

function showAllMonsters() {
  const hasSearchQuery = searchBox.value !== "";
  if (hasSearchQuery) {
    monsters.forEach((monster) => (monster.visible = true));
    searchBox.value = "";
    renderMonsters();
  }
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

  renderMonsters();
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
      defaultSort("damage");
      break;
    case 9:
      //Hi-Lo Damage
      reverseSort("damage");
      break;
    case 10:
      //Few-Many Elements
      sortByFewToManyElements();
      break;
    case 11:
      //Many-Few Elements;
      sortByManyToFewElements();
      break;
    default:
      break;
  }
}

function defaultSort(key) {
  const tempMonsters = [...monsters].map((monster) => monster.monster);
  if (isValidObjKey(tempMonsters, key)) {
    monsters = [...monsters].sort((a, b) => {
      const valueA = a.monster[key];
      const valueB = b.monster[key];
      if (typeof valueA === "string") {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      } else if (typeof valueA === "number") {
        const diff = valueA - valueB;
        return diff === 0 ? a.monster.name.toLowerCase().localeCompare(b.monster.name.toLowerCase()) : diff;
      }
    });
  }
}

function reverseSort(key) {
  const tempMonsters = [...monsters].map((monster) => monster.monster);
  if (isValidObjKey(tempMonsters, key)) {
    monsters = [...monsters].sort((a, b) => {
      const valueA = a.monster[key];
      const valueB = b.monster[key];
      if (typeof valueA === "string") {
        return valueB.localeCompare(valueA);
      } else if (typeof valueA === "number") {
        const diff = valueB - valueA;
        return diff === 0 ? a.monster.name.localeCompare(b.monster.name) : diff;
      }
    });
  }
}

function sortByLoHiRank() {
  const rankList = getMonstersRankList();

  monsters = [...monsters].sort((a, b) => {
    const rankA = rankList.length - rankList.indexOf(rankList.find((m) => m.id === a.monster.id));
    const rankB = rankList.length - rankList.indexOf(rankList.find((m) => m.id === b.monster.id));

    const rankDiff = rankB - rankA;
    return rankDiff === 0 ? a.monster.name.localeCompare(b.monster.name) : rankDiff;
  });
}

function sortByHiLoRank() {
  const rankList = getMonstersRankList();

  monsters = [...monsters].sort((a, b) => {
    const rankA = rankList.length - rankList.indexOf(rankList.find((m) => m.id === a.monster.id));
    const rankB = rankList.length - rankList.indexOf(rankList.find((m) => m.id === b.monster.id));

    const rankDiff = rankA - rankB;
    return rankDiff === 0 ? a.monster.name.localeCompare(b.monster.name) : rankDiff;
  });
}

function sortByFewToManyElements() {
  monsters = [...monsters].sort((a, b) => {
    const elementsA = a.monster.elements.length;
    const elementsB = b.monster.elements.length;
    const elementsDifference = elementsA - elementsB;
    return elementsDifference === 0 ? a.monster.name.localeCompare(b.monster.name) : elementsDifference;
  });
}

function sortByManyToFewElements() {
  monsters = [...monsters].sort((a, b) => {
    const elementsA = a.monster.elements.length;
    const elementsB = b.monster.elements.length;
    const elementsDifference = elementsB - elementsA;
    return elementsDifference === 0 ? a.monster.name.localeCompare(b.monster.name) : elementsDifference;
  });
}

function getMonstersRankList() {
  const rankList = [...monsters].sort((a, b) => {
    const ratingA = a.monster.health + a.monster.damage;
    const ratingB = b.monster.health + a.monster.damage;
    return ratingA - ratingB;
  });
  return rankList;
}

function toggleFilter() {
  const src = filterToggle.getAttribute("src");

  if (src.includes("downArrow")) {
    filterToggle.setAttribute("src", "../res/icons/upArrow.svg");
    filterToggle.setAttribute("alt", "Hide filters");
    filterToggle.setAttribute("title", "Hide filters");
    searchSortContainer.setAttribute("class", "searchSortContainer");
  } else {
    filterToggle.setAttribute("src", "../res/icons/downArrow.svg");
    filterToggle.setAttribute("alt", "Show filters");
    filterToggle.setAttribute("title", "Show filters");
    searchSortContainer.setAttribute("class", "hidden");
  }
}
