import { TEAMS_LSK,SELECTEDFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { save, load } from "./common/utilities.js";
import {useChangeEvent} from "./common/useEvent.js"

const selectedTeamEl = document.getElementById("selectedTeam");
const userTeamSelectEl = document.getElementById("availableTeams");

const teams = load(TEAMS_LSK).map(team=>team.name) || [];
const selectedTeam = load(SELECTEDFIGHTTEAM_LSK)||""; 

window.addEventListener("DOMContentLoaded",()=>{
    init();
})

function init(){
    populateUserTeamSelect();
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