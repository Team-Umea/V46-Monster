//Js code for monster page
import { serveData, serveFetchedData } from "./common/fetch.js";
import { useClickEvent, useScrollEvent, useChangeEvent } from "./common/useEvent.js";
import { MONSTERS_LSK, ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { isValidObjKey } from "./common/utilities.js";

const fetchBtn = document.getElementById("fetchMonsters");
const monsterContainer = document.getElementById("monsterContainer");
const sortDropDown = document.getElementById("sortDropdown");

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
  allMonsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl);
  useScrollEvent(monsterContainer, infiniteScroll);
  useChangeEvent(sortDropDown, changeSortOrder)
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

function renderUpdatedMonster(monsters){
  monsterContainer.innerHTML=""; 
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsters.forEach(monster=>{
    const id = monster.id; 
    const monsterCard = new MonsterCard(monster,allMonsters, tempTeams, id); 
    const assembledMonsterCard = monsterCard.assembleMonsterCard();
    monsterContainer.appendChild(assembledMonsterCard);
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
    changeSortOrder();
  }
}

function changeSortOrder(){
  const sortOrder = Number(sortDropDown.value); 
  sortMonsters(sortOrder)
}

function sortMonsters(sortOrder){
  switch(sortOrder){
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
    default:
      break; 
  }
  renderUpdatedMonster(monsters);
}

function defaultSort(key){
  if(isValidObjKey(monsters,key)){
    monsters = monsters.sort((a,b)=>{
      const valueA = a[key];
      const valueB = b[key];
      if(typeof valueA ==="string"){
        return valueA.localeCompare(valueB);
      }else if(typeof valueA==="number"){
        return valueA - valueB; 
      }
    });
  }
}

function reverseSort(key){
  if(isValidObjKey(monsters,key)){
    monsters = monsters.sort((a,b)=>{
      const valueA = a[key];
      const valueB = b[key];
      if(typeof valueA ==="string"){
        return valueB.localeCompare(valueA);
      }else if(typeof valueA==="number"){
        return valueB - valueA; 
      }
    });
  }
}

function sortByLoHiRank(){
  monsters = monsters.sort((a,b)=>{
    const rankA = a.health + a.damage; 
    const rankB = b.health + b.damage; 
    return rankA - rankB
  })
}

function sortByHiLoRank(){
  monsters = monsters.sort((a,b)=>{
    const rankA = a.health + a.damage; 
    const rankB = b.health + b.damage; 
    return rankB - rankA
  })
}

// function zaSort(){
//   monsters = monsters.sort((a,b)=>b.name.localeCompare(a.name));
// }

// function zaSort(){
//   monsters = monsters.sort((a,b)=>b.name.localeCompare(a.name));
// }