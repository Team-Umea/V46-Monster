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
  const loadMoreBtn = document.getElementById("lodMoreMonsters");

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
            fetchedMonsters = monsters;
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
      fetchedMonsters = monsters;
    });
  }
}


