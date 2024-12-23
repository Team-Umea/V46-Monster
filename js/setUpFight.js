import { TEAMS_LSK,SELECTEDFIGHTTEAM_LSK, OPPOSINGFIGHTTEAM_LSK } from "./common/localStorageKeys.js";
import { save, load, redirect } from "./common/utilities.js";
import {useChangeEvent, useClickEvent} from "./common/useEvent.js"
import { serveData } from "./common/fetch.js";
import { Team } from "./classes/Team.js";
import {MonsterFighCard} from "./classes/MonsterFighCard.js"

const selectedTeamEl = document.getElementById("selectedTeam");
const userTeamSelectEl = document.getElementById("availableTeams");
const userTeamMonstersEl = document.getElementById("userTeamMonsters");
const fightBtn = document.getElementById("fightBtn");
const opposingTeamListEl = document.getElementById("opposingTeamList");
const opposingTeamMonstersEl = document.getElementById("opposingTeamMonters");

const teams = load(TEAMS_LSK).map(team=>team.name) || [];
const selectedTeam = load(SELECTEDFIGHTTEAM_LSK)||""; 

let userTeamMonsters = load(TEAMS_LSK).find(team=>team.name===selectedTeam).monsters || [];

window.addEventListener("DOMContentLoaded",()=>{
    init();
})

function init(){
    populateUserTeamSelect();
    populateOpposingTeamList();
    renderMonsters(userTeamMonstersEl,userTeamMonsters);
    setSelectedTeam();
    useClickEvent(fightBtn,()=>redirect("fight.html"));
    useChangeEvent(userTeamSelectEl, selectTeam);
}

function setSelectedTeam(){    
    if(selectedTeam){
        selectedTeamEl.innerText = `Selected Team '${selectedTeam}'`        
        userTeamSelectEl.value = selectedTeam
    }
}

function selectTeam(){
    const teamName = userTeamSelectEl.value;
    selectedTeamEl.innerText = `Selected Team '${teamName}'` 
    
    userTeamMonsters = load(TEAMS_LSK).find(team=>team.name===teamName).monsters || [];
    
    save(SELECTEDFIGHTTEAM_LSK, teamName);
    renderMonsters(userTeamMonstersEl, userTeamMonsters);
}

async function getOpposingTeam(level){
    const opposingTeam = new Team(`AI ${level}`);
    const opposingTeamMonsters = await serveData("generateTeam",`&level=${level}`, opposingTeamMonstersEl, undefined, undefined, true);
    opposingTeam.setMonsters(opposingTeamMonsters);
    
    save(OPPOSINGFIGHTTEAM_LSK, opposingTeam);

    renderMonsters(opposingTeamMonstersEl, opposingTeamMonsters);
    fightBtn.classList.remove("hidden");
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

function renderMonsters(parent, monsters){
    parent.innerHTML ="";

    monsters.forEach(monster=>{
        parent.appendChild(new MonsterFighCard(monster).card());
    });
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

function renderOpposingTeamMonsters(){
    opposingTeamMonstersEl.innerHTML ="";

    userTeamMonsters.forEach(monster=>{
        const monsterCard = new MonsterFighCard(monster).card(); 
        userTeamMonstersEl.appendChild(monsterCard);
    });
}