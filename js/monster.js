//Js code for monster page
import { serveData, serveFetchedData } from "./common/fetch.js";
import { useClickEvent, useScrollEvent, useChangeEvent,useInputEvent } from "./common/useEvent.js";
import { MONSTERS_LSK, ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { isValidObjKey } from "./common/utilities.js";

const fetchBtn = document.getElementById("fetchMonsters");
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
let visibleMonsters = 20;
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
  Array.from(searchBtns).forEach(btn=>{
    useClickEvent(btn, setSearchCategory)
  }); 
  useInputEvent(searchBox, searchMonsters)
  processMonsters();
}

async function processMonsters() { 
  renderLoadingSkeletons(visibleMonsters);
  const monsterData = await serveData("monsters", `&num=${visibleMonsters}`, monsterContainer, MONSTERS_LSK, ttl);
  if(monsterData.length>0){
    assignMonsters(monsterData);
    renderMonsters(monsters);
  }
}

function assignMonsters(data){
  const mappedData = data.map(data=>({monster:data, visible:true}));
  const oldMonsters = monsters; 
  monsters = [...oldMonsters, ...mappedData];
  defaultSort("name");
  setSearchCategory();
  searchMonsters();
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
    const monsterObj = monsters[index]
    const monster = monsterObj.monster; 
    const id = monster.id;

    card.setValues(monster, allMonsters, tempTeams, id);
    card.assembleMonsterCard(); 
  })
}

function renderUpdatedMonster(monsters){
  monsterContainer.innerHTML=""; 
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsters.forEach(monsterObj=>{
    const isVisible = monsterObj.visible;
    if(isVisible){
      const monster = monsterObj.monster;
      const id = monster.id; 
      const monsterCard = new MonsterCard(monster,allMonsters, tempTeams, id); 
      const assembledMonsterCard = monsterCard.assembleMonsterCard();
      monsterContainer.appendChild(assembledMonsterCard);
    }
  })

}

function appendMonsters() {
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  console.log(monsters.length, monsterCards.length)

  monsterCards.forEach((card,index) => {
    const monsterObj = monsters[index];
    const monster = monsterObj.monster; 
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

    // const everyMonster = monsters.concat(newMonsters);
    assignMonsters(newMonsters);

    // newMonsters.forEach(monster=>{
    //   monsters.push(monster);
    // })

    appendMonsters(newMonsters);
  }
}

function setSortOrder(){
  const sortOrder = Number(sortDropDown.value); 
  sortMonsters(sortOrder)
  console.log("Hello is I changed? ", sortOrder);
}

function setSearchCategory(){
  const selectedBtn = Array.from(searchBtns).find(btn=>btn.checked);
  searchCategory = selectedBtn.value; 
}

// function showAllMonsters(){
//   monsters.forEach(monster=>monster.visible=true); 
//   renderMonsters(monsters); 
// }

function searchMonsters(){
  const searchQuery = searchBox.value.trim().toLowerCase();
  monsters.forEach(monsterObj=>{
    const monster = monsterObj.monster; 

    if(searchCategory!=="rank"){
      if(searchCategory in monster){

        const value = monster[searchCategory]; 
        let valueStrHasQuery; 
        let valueArrHasQuery;

        if(typeof value === "string"||typeof value === "number"){
          valueStrHasQuery = value.toString().trim().toLowerCase().includes(searchQuery);
        }else{
          valueArrHasQuery=value.some(item=>item.toLowerCase().includes(searchQuery));
        }

        if(valueStrHasQuery||valueArrHasQuery){
          monsterObj.visible=true; 
        }else{
          monsterObj.visible=false; 
        }
      }
    }else{
      const rankList = allMonsters.sort((a, b) => {
        const ratingA = a.health + a.damage;
        const ratingB = b.health + a.damage;
        return ratingA - ratingB;
      });
  
      const rank = rankList.indexOf(rankList.find(m=>m.id===monster.id));
      const descending = (rankList.length - rank).toString();

      if(descending.includes(searchQuery)){
        monsterObj.visible=true; 
      }else{
          monsterObj.visible=false; 
      }
    }
  })

  renderUpdatedMonster(monsters);
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
  const tempMonsters = monsters.map(monster=>monster.monster);
  if(isValidObjKey(tempMonsters,key)){
    monsters = monsters.sort((a,b)=>{
      const valueA = a.monster[key];
      const valueB = b.monster[key];
      if(typeof valueA ==="string"){
        return valueA.localeCompare(valueB);
      }else if(typeof valueA==="number"){
        return valueA - valueB; 
      }
    });
  }
}

function reverseSort(key){
  const tempMonsters = monsters.map(monster=>monster.monster);
  if(isValidObjKey(tempMonsters,key)){
    monsters = monsters.sort((a,b)=>{
      const valueA = a.monster[key];
      const valueB = b.monster[key];
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
    const rankA = a.monster.health + a.monster.damage; 
    const rankB = b.monster.health + b.monster.damage; 
    return rankA - rankB
  })
}

function sortByHiLoRank(){
  monsters = monsters.sort((a,b)=>{
    const rankA = a.monster.health + a.monster.damage; 
    const rankB = b.monster.health + b.monster.damage; 
    return rankB - rankA
  })
}