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
const monsterCards = [];
let monsters = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

 
async function init() {

  // useClickEvent(fetchBtn, processMonsters);
  allMonsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl);
  useScrollEvent(monsterContainer, infiniteScroll);
  processMonsters();
}

async function processMonsters() { 
  renderLoadingSkeletons(visibleMonsters);
  const monsterData = await serveData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl);
  if(monsterData.length>0){
    monsters = monsterData
    renderMonsters(monsterData);
  }
}

function renderLoadingSkeletons(max){
  for (let i = 0; i < max; i++) {
    const monsterCard = new MonsterCard();
    const assembleMonsterCard = monsterCard.getLoadingSkeletion();
    monsterCards.push(monsterCard);
    monsterContainer.appendChild(assembleMonsterCard);
  }
}

function renderMonsters(monsters) {
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsterCards.forEach((card,index)=>{
    const monster = monsters[index];
    const id = monster.id;

    card.setValues(monster, allMonsters, tempTeams, id);
    card.assembleMonsterCard(); 
  })
}

function appendMonsters() {
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  console.log(monsters.length, monsterCards.length)

  monsterCards.forEach((card,index) => {
    const monster = monsters[index];
    const id = monster.id;

    card.setValues(monster, allMonsters, tempTeams, id);
    card.assembleMonsterCard(); 
  });
}

async function infiniteScroll() {
  if (monsterContainer.scrollTop + monsterContainer.clientHeight >= monsterContainer.scrollHeight -1200 && visibleMonsters < allMonsters.length) {
    const numNewMonsters = 10; 
    visibleMonsters += numNewMonsters;
    renderLoadingSkeletons(numNewMonsters);
    const monsterData = await serveFetchedData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl);
    const newMonsters = monsterData.slice(-10);
    newMonsters.forEach(monster=>{
      monsters.push(monster);
    })
    appendMonsters(newMonsters);
  }
}
