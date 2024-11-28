//Js code for monster page
import { serveData } from "./common/fetch.js";
import { useClickEvent } from "./common/useEvent.js";
import { renderDataAsUl } from "./common/render.js";
import { MONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";

const fetchBtn = document.getElementById("fetchMonsters");
const monsterContainer = document.getElementById("monsterContainer");

//time in seconds for how long the data will be cached for before it will refetch
//this way we can limit the number of calls to the api for data that don't need
//constent updates
const ttl = 60;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(fetchBtn, processMonsters);
}

async function processMonsters() {
  const monsters = await serveData("monsters", "&num=10", monsterContainer, MONSTERS_LSK, ttl);
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
    const createMonsterCard = new MonsterCard(monster, monsters, tempTeams);
    const assembleMonsterCard = createMonsterCard.assembleMonsterCard();
    monsterContainer.appendChild(assembleMonsterCard);
  });
}
