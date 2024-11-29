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

"?team1=12,22,123,234&team2=99,98,97,109"

 
async function init() {

  // useClickEvent(fetchBtn, processMonsters);
  allMonsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl);
  useScrollEvent(monsterContainer, infiniteScroll);
  processMonsters();
}

async function processMonsters() { 
  const monsters = await serveData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl,true);

  if(monsters.length>0){
    renderMonsters(monsters);
  }
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
    const monsters = await serveFetchedData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl);
    const newMonsters = monsters.slice(-10);
    appendMonsters(newMonsters);
  }
}
