import { fetchAllMonsters } from './fetchEndpoints.js';
import {save,load,createIconContainer,getValueInObj} from "./utility.js";
const apiConfigKey = "apiconfigure"

let fetchedMonsters = [];

let visibleMonsters = 10; 



window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchEndpoints();
  initLoadMoreMonstersBtn().setAttribute("id","1");
  initSearchBox();
  initSearch();
  initSortDropdown();
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

function initSearchBox(){
  let searchCategory = "name";
  const searchBox = document.getElementById("searchBox");
  
  searchBox.addEventListener("input" , (e) => {
    
    searchMonsters(searchBox.value, fetchedMonsters);
  
  });
}

function initSearch(){
  const category = document.getElementById("searchCategory");
  const inputs = Array.from(category.getElementsByTagName("input"));
  inputs.forEach((input)=>{
    const index = inputs.indexOf(input);
    input.addEventListener("click", (e) =>{
      switch(index){
        case 0:
          searchCategory = "name";
          break;
        case 1:
          searchCategory = "strengths";
          break;
        case 2:
          searchCategory = "weaknesses";
          break;
      }
    });
  })
}
function initSortDropdown(){
  const dropDown = document.getElementById("sortDropdown");
  dropDown.addEventListener("change",(e)=>{
    sortMonsters(dropDown.value);
  });
}
function searchMonsters(query,array){
  query = document.getElementById("searchBox").value;

  const result = array.forEach((monster)=>{

    if(getValueInObj(monster.monster, searchCategory).includes(query)){
      monster.monster.visible = true;
    }
    else{
      monster.monster.visible = false;
    }
  });
  populateMonster(result, visibleMonsters);
}

function sortMonsters(option){
  switch(option){
    case 0:
      //alphabetical
      fetchedMonsters = fetchedMonsters.sort((a,b) => a.monster.name.localeCompare(b.monster.name));
      break
    case 1:
      //alphabetical reverse
      fetchedMonsters = fetchedMonsters.sort((a,b) => b.monster.name.localeCompare(a.monster.name));
      break
    case 2:
      //highest price first
      fetchedMonsters = fetchedMonsters.sort((a,b) => a.monster.price - b.monster.price);
      break
    case 3:
      //lowest price first
      fetchedMonsters = fetchedMonsters.sort((a,b) => b.monster.price - a.monster.price);
      break
    case 4:
      //highest hp first
      fetchedMonsters = fetchedMonsters.sort((a,b) => a.monster.health - b.monster.health);
      break
    case 5:
      //lowest hp first
      fetchedMonsters = fetchedMonsters.sort((a,b) => b.monster.health - a.monster.health);
      break
    
    case 6:
      //highest dmg first
      fetchedMonsters = fetchedMonsters.sort((a,b) => a.monster.damage - b.monster.damage);
      break
    case 7:
      //lowest dmg first
      fetchedMonsters = fetchedMonsters.sort((a,b) => b.monster.damage - a.monster.damage);
      break
    
  }
  populateMonster(fetchedMonsters, visibleMonsters);
}


