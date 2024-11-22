import { fetchAllMonsters } from './fetchEndpoints.js';
import {save,load} from "./utility.js";
const apiConfigKey = "apiconfigure"

let fetchedMonsters = [];

let visibleMonsters = 10; 

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchEndpoints();
  initLoadMoreMonstersBtn().setAttribute("id","1")
}

function initLoadMoreMonstersBtn(){
  const loadMoreBtn = document.getElementById("loadMoreMonsters");

  loadMoreBtn.addEventListener("click",()=>{
    if(fetchedMonsters&& visibleMonsters<fetchedMonsters.length){
      visibleMonsters+=10;
      // populateMonster(fetchedMonsters,visibleMonsters)
    }
  })

  return loadMoreBtn; 
}

function fetchEndpoints() {
  const loadApiEndpoints = load(apiConfigKey);

  if(!loadApiEndpoints){
    const apiConfigPath = "../json/apiConfig.json"
    fetch(apiConfigPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(endpoints => {
          save(apiConfigKey, endpoints); 
          fetchAllMonsters(endpoints.allMonstersEndpoint)
          .then(monsters=>{
            console.log("Monster fetched: ",monsters)
            assignAndPopulate(monsters);
          });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
  }else{
    const endpoints = load(apiConfigKey); 
    fetchAllMonsters(endpoints.allMonstersEndpoint)
    .then(monsters=>{
      console.log("Monster loaded: ",monsters)
      assignAndPopulate(monsters);
    });
  }
}

function assignAndPopulate(monsters){
  fetchedMonsters = monster;
  populateMonster(fetchedMonsters, visibleMonsters);
}

function populateMonster(array, num){
  const monsterContainer = document.getElementById("monsterContainer");
  monsterContainer.innerHTML = "";
  for(let i = 0; i < num; i++){
    const monster = document.createElement("div");
    const name = document.createElement("h2");
    const speciality = document.createElement("p");
    
    const strengths = document.createElement("div");
    const weaknesses = document.createElement("div");
    const health = document.createElement("p");
    const damage = document.createElement("p");
    const price = document.createElement("p");
    
    monster.classList.add("monsterCard");
    name.classList.add("monsterName");
    name.classList.add("monsterSpec");
    name.classList.add("monsterStr");
    name.classList.add("monsterWeak");
    name.classList.add("monsterHealth");
    name.classList.add("monsterDamage");
    name.classList.add("monsterPrice");

    name.innerText = array[i].name;
    speciality.innerText = array[i].specs;
    damage.innerText = array[i].damage;
    health.innerText = array[i].health;
    price.innerText = array[i].price;


    array[i].strengths.forEach((str) =>{
      const strengthText = document.createElement("p");
      strengthText.innerText = str;
      strengthText.classList.add("strText");
      strengths.appendChild(strengthText);
    });
    array[i].weaknesses.forEach((weak) =>{
      const weakText = document.createElement("p");
      weakText.innerText = weak;
      weakText.classList.add("strText");
      weaknesses.appendChild(weakText);
    });

    monster.appendChild(name);
    monster.appendChild(specialty);
    monster.appendChild(health);
    monster.appendChild(damage);
    monster.appendChild(strengths);
    monster.appendChild(weaknesses);
    monster.appendChild(price);
    monsterContainer.appendChild(monster);
  }
}
