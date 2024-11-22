import { fetchAllMonsters } from './fetchEndpoints.js';
import {save,load,createIconContainer} from "./utility.js";
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
      populateMonster(fetchedMonsters,visibleMonsters)
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
  fetchedMonsters = monsters;
  populateMonster(fetchedMonsters, visibleMonsters);
}

function populateMonster(array, num){
  const monsterContainer = document.getElementById("monsterContainer");
  monsterContainer.innerHTML = "";
  for(let i = 0; i < num; i++){
    const monster = document.createElement("div");
    const name = document.createElement("h2");
    const specs = document.createElement("p");
    
    const strengths = document.createElement("div");
    const weaknesses = document.createElement("div");

    const strengthsHeader = document.createElement("h3");
    const weaknessesHeader = document.createElement("h3");

    const ablitiesContainer = document.createElement("div");

    const strengthsContent = document.createElement("div");
    const weaknessesContent = document.createElement("div");

    const statsContainer = document.createElement("div");
    const health = createIconContainer("iconContainer",array[i].health,"../icons/heart.svg",`${name} has ${array[i].health} of health`, `${name} has ${array[i].health} of health`)
    const damage = createIconContainer("iconContainer",array[i].damage,"../icons/skull.svg",`${name} has ${array[i].damage} of damage`, `${name} has ${array[i].damage} of damage`,"Right")
    
    const priceContainer = document.createElement("div");
    const priceHeader = document.createElement("h4");
    const price = createIconContainer("iconContainer",array[i].price,"../icons/diamond.svg",`${name} costs ${array[i].priec} diamonds`, `${name} costs ${array[i].priec} diamonds`);

    strengthsHeader.innerText="Strengths"
    weaknessesHeader.innerText="Weaknesses"
    
    monster.classList.add("monsterCard");
    name.classList.add("monsterName");
    specs.classList.add("monsterSpec");
    ablitiesContainer.classList.add("abilitesContainer")
    strengths.classList.add("monsterStr","abilitesContent");
    weaknesses.classList.add("monsterWeak","abilitesContent");
    statsContainer.classList.add("monsterStatsContainer");
    priceContainer.classList.add("monsterPriceContainer");

    name.innerText = array[i].name;
    specs.innerText = array[i].specs;
    priceHeader.innerText="Price"

    strengths.appendChild(strengthsHeader); 
    weaknesses.appendChild(weaknessesHeader);

    array[i].strengths.forEach((str) =>{
      const strengthText = document.createElement("p");
      strengthText.innerText = str;
      strengthText.classList.add("strText");
      strengthsContent.appendChild(strengthText);
    });
    array[i].weaknesses.forEach((weak) =>{
      const weakText = document.createElement("p");
      weakText.innerText = weak;
      weakText.classList.add("strText");
      weaknessesContent.appendChild(weakText);
    });

    strengths.appendChild(strengthsContent); 
    weaknesses.appendChild(weaknessesContent)

    monster.appendChild(name);
    monster.appendChild(specs);
    statsContainer.appendChild(health); 
    statsContainer.appendChild(damage);
    monster.appendChild(statsContainer); 
    ablitiesContainer.appendChild(strengths);
    ablitiesContainer.appendChild(weaknesses)
    monster.appendChild(ablitiesContainer);
    priceContainer.appendChild(priceHeader); 
    priceContainer.appendChild(price); 
    monster.appendChild(priceContainer);
    monsterContainer.appendChild(monster);
  }
}
