import { fetchAllMonsters } from './fetchEndpoints.js';
import {save,load,createIconContainer,getValueInObj,generateUniqueTeamName} from "./utility.js";
import { Team } from '../classes/team.js';
const apiConfigKey = "apiconfigure"

let fetchedMonsters = [];
let visibleMonsters = 10; 
let teams = []; 

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchEndpoints();
  initCreateTeamForm();
  initLoadMoreMonstersBtn();
}

function initLoadMoreMonstersBtn(){
  const loadMoreBtn = document.getElementById("loadMoreMonsters");

  loadMoreBtn.addEventListener("click",()=>{
    if(fetchedMonsters&& visibleMonsters<fetchedMonsters.length){
      visibleMonsters+=10;
      renderMonsters(fetchedMonsters,visibleMonsters)
    }
  })

  return loadMoreBtn; 
}

function initCreateTeamForm() {
  const container = document.getElementById("createTeam");
  const form = container.getElementsByTagName("form")[0];
  const input = container.getElementsByTagName("input")[0];
  const message = container.getElementsByTagName("p")[0];

  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  input.addEventListener("input", () => {
    //reset message on typing
    message.innerText = "";
    message.setAttribute("class", "hidden");
    container.setAttribute("class", "minimize");

    //get rid of all white spaces
    const trimedValue = input.value.replace(/\s+/g, "");
    const lastCh = trimedValue.slice(-1).toLowerCase();

    //only allow letters and digits
    const isLetter = lastCh >= "a" && lastCh <= "z";
    const isDigit = digits.includes(lastCh);
    input.value = trimedValue;

    if (!isDigit && !isLetter) {
      input.value = input.value.slice(0, -1);
      message.setAttribute("class", "error");
      message.innerText = "Error! Only letters and digits allowed";
      //remove message after 2s
      setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "hidden");
        container.setAttribute("class", "minimize");
      }, 2000);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const teamName = input.value;
    if (teamName !== "") {
      const checkName = generateUniqueTeamName(teams,teamName);

      const controlledName = checkName.name;
      if (!checkName.unique) {
        message.setAttribute("class", "success");
        message.innerText = `${teamName} successfully changed to ${controlledName} due to team name duplicates`;
      } else {
        message.setAttribute("class", "success");
        message.innerText = `${controlledName} successfully created`;
      }
      addTeam(controlledName);
      input.value = "";
    } else {
      message.setAttribute("class", "error");
      message.innerText = "Error! Name must not be empty";
    }
    if (message.innerText !== "") {
      setTimeout(() => {
        message.innerText = "";
        message.setAttribute("class", "hidden");
        container.setAttribute("class", "minimize");
      }, 3000);
    }
  });
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
  renderMonsters(fetchedMonsters, visibleMonsters);
}

function renderMonsters(array, num){
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

function addTeam(teamName) {

  const teamsContainer = document.getElementById("teamsContainer");

  const newTeam = new Team(teamName);
  teams.push(newTeam);

  const teamContainer = document.createElement("div");
  const teamHeader = document.createElement("h2");
  const teamList = document.createElement("ul");
  const deleteBtn = document.createElement("img");

  teamContainer.setAttribute("class", "teamDiv");
  teamHeader.innerText = teamName;
  teamList.setAttribute("id", teamName);

  deleteBtn.setAttribute("src", "/icons/trashBin.svg");
  deleteBtn.setAttribute("alt", `Delete ${teamName}`);
  deleteBtn.setAttribute("title", `Delete ${teamName}`);
  deleteBtn.setAttribute("class", "deleteTeamBtn");

  deleteBtn.addEventListener("click", () => {
    const src = deleteBtn.getAttribute("src");

    if (src.includes("trash")) {
      deleteBtn.setAttribute("src", "/icons/checkMark.svg");
      deleteBtn.setAttribute("alt", `Confirm delete of ${teamName}`);
      deleteBtn.setAttribute("title", `Confirm delete of ${teamName}`);
    } else {
      teamContainer.remove();
      deleteTeam(newTeam);
    }
  });

  teamContainer.appendChild(teamHeader);
  teamContainer.appendChild(teamList);
  teamContainer.appendChild(deleteBtn);
  teamsContainer.appendChild(teamContainer);

  initDropZone(teamList);
}

function initDropZone(dropZone) {
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);
    dropZone.appendChild(draggedElement);
  });
}

function searchMonsters(query,option,array){
  option = document.getElementById("dropDown").value;
  query = document.getElementById("searchBox").value;

  const result = array.forEach((monster)=>{

    if(getValueInObj(monster.monster, option).includes(query)){
      monster.monster.visible = true;
    }
    else{
      monster.monster.visible = false;
    }
  });
  renderMonsters(result, visibleMonsters);
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
  renderMonsters(fetchedMonsters, visibleMonsters);
}


