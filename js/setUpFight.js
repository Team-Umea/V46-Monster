import { TEAMS_LSK,SELECTEDFIGHTTEAM_LSK, OPPOSINGFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { save, load, redirect } from "./common/utilities.js";
import {useChangeEvent, useClickEvent} from "./common/useEvent.js"
import { serveData } from "./common/fetch.js";
import { Team } from "./classes/Team.js";

const selectedTeamEl = document.getElementById("selectedTeam");
const userTeamSelectEl = document.getElementById("availableTeams");
const opposingTeamListEl = document.getElementById("opposingTeamList");

const teams = load(TEAMS_LSK).map(team=>team.name) || [];
const selectedTeam = load(SELECTEDFIGHTTEAM_LSK)||""; 

window.addEventListener("DOMContentLoaded",()=>{
    init();
})

function init(){
    populateUserTeamSelect();
    populateOpposingTeamList();
    setSelectedTeam();
    useChangeEvent(userTeamSelectEl, selectTeam)
}

function setSelectedTeam(){    
    if(selectedTeam){
        selectedTeamEl.innerText = `Selected Team '${selectedTeam}'`        
        userTeamSelectEl.value = selectedTeam
    }
}

function selectTeam(){
    const team = userTeamSelectEl.value;
    selectedTeamEl.innerText = `Selected Team '${team}'`        
    save(SELECTEDFIGHTTEAM_LSK, team);
}

async function getOpposingTeam(level){
    const opposingTeam = new Team(`AI ${level}`);
    const opposingTeamMonsters = await serveData("generateTeam",`&level=${level}`, opposingTeamListEl);
    opposingTeam.setMonsters(opposingTeamMonsters);
    
    save(OPPOSINGFIGHTTEAM_LSK, opposingTeam);

    setTimeout(() => {
        redirect("fight.html");
    }, 100);
}

function populateUserTeamSelect(){
    userTeamSelectEl.innerHTML="";

    teams.forEach(team=>{
        const teamOptionEl = document.createElement("option"); 
        teamOptionEl.setAttribute("class","userTeamOption");
        teamOptionEl.setAttribute("value",team);
        teamOptionEl.innerText = team; 

        userTeamSelectEl.appendChild(teamOptionEl);
    })
}

function populateOpposingTeamList(){
    opposingTeamListEl.innerHTML = ""; 

    for (let i = 0; i < 10; i++) {
        const level = i+1;
        const listItem = document.createElement("li"); 
        const teamLevelBtn = document.createElement("button"); 

        listItem.setAttribute("class","opposingTeamListItem"); 
        teamLevelBtn.setAttribute("class","opposingTeamLevlBtn primary-btn"); 

        teamLevelBtn.innerText = `Level ${level}`;

        useClickEvent(teamLevelBtn,()=>{
            getOpposingTeam(level);
        });

        listItem.appendChild(teamLevelBtn);
        opposingTeamListEl.appendChild(listItem);
    }
}