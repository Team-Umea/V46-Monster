//Js code for monster page
import { serveData, serveFetchedData } from "./common/fetch.js";
import { useClickEvent, useScrollEvent } from "./common/useEvent.js";
import { renderDataAsUl } from "./common/render.js";
import { MONSTERS_LSK, ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";

const fetchBtn = document.getElementById("fetchMonsters");
const monsterContainer = document.getElementById("monsterContainer");

//time in seconds for how long the data will be cached for before it will refetch
//this way we can limit the number of calls to the api for data that don't need
//constent updates
const ttl = 60;
let allMonsters = [];
let visibleMonsters = 20;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  // useClickEvent(fetchBtn, processMonsters);
  allMonsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl);
  console.log("All Monsters: ", allMonsters);

  useScrollEvent(monsterContainer, infiniteScroll);
  processMonsters();
}

async function processMonsters() {
  const monsters = await serveData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl);
  // const monsters = response.map((res) => res.name);
  // renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  renderMonsters(monsters);

  //simulate request timeout
  // setTimeout(() => {
  //   if (response.ok) {
  //     const monsters = response.data.monsters.map((res) => res.name);
  //     renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  //   }
  // }, 10000);

  //simulate loading
  // setTimeout(() => {
  //   if (response.ok) {
  //     const monsters = response.data.monsters.map((res) => res.name);
  //     renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  //   }
  // }, 1000);
}

function renderMonsters(monsters) {
  monsterContainer.innerHTML = "";
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsters.forEach((monster) => {
    const id = monster.id;
    const createMonsterCard = new MonsterCard(monster, allMonsters, tempTeams, id);
    const assembleMonsterCard = createMonsterCard.assembleMonsterCard();
    monsterContainer.appendChild(assembleMonsterCard);
  });
}

function appendMonsters(newMonsters) {
  const monsterCards = Array.from(monsterContainer.children);
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  newMonsters.forEach((monster) => {
    const id = monster.id;
    const createMonsterCard = new MonsterCard(monster, allMonsters, tempTeams, id);
    const assembleMonsterCard = createMonsterCard.assembleMonsterCard();
    monsterContainer.appendChild(assembleMonsterCard);
  });
}

async function infiniteScroll() {
  if (monsterContainer.scrollTop + monsterContainer.clientHeight >= monsterContainer.scrollHeight && visibleMonsters < allMonsters.length) {
    visibleMonsters += 10;
    const monsters = await serveFetchedData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl, true);
    const newMonsters = monsters.slice(-10);
    appendMonsters(newMonsters);
  }
}
