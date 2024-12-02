//Js code for fight page
import { serveData } from "./common/fetch.js";
import { Team } from "./classes/Team.js";
import { TEAMS_LSK } from "./common/localStorageKeys.js";
import { load } from "./common/utilities.js";

const fightContainer = document.getElementById("fightContainer");
const fightBtn = document.getElementById("fightBtn");
const team1Selector = document.getElementById("team1Selector");
const team2Selector = document.getElementById("team2Selector");
let teams = [];
async function exampleFight(){
    let team1 = await createRandomTeam(3, 4);
    let team2 = await createRandomTeam(3, 4);
    let param = await buildParam(team1, team2);

    const data = await serveData("fight", param, fightContainer);
    console.log(data);

    let fightWinner = document.createElement('h2');
    fightWinner.setAttribute('class', 'winner')
    fightWinner.innerText = `${data['teamWon']} won!`;


    const details = `
    <div class="detail"><strong>Battle ID:</strong> ${data.battleID}</div>
    <div class="detail"><strong>Battle Winners:</strong> ${data.battleWinners}</div>
    <div class="detail"><strong>Team Points (Team 1):</strong> ${data.team1Points}</div>
    <div class="detail"><strong>Team Points (Team 2):</strong> ${data.team2Points}</div>
    <div class="detail"><strong>Remaining HP:</strong> ${JSON.stringify(data.remainingHP)}</div>
    <div class="detail"><strong>Team Stats:</strong></div>
    <div class="detail"><strong>Team 1:</strong> ${JSON.stringify(data.teamStats.team1)}</div>
    <div class="detail"><strong>Team 2:</strong> ${JSON.stringify(data.teamStats.team2)}</div>
    <div class="detail"><strong>Team Won:</strong> ${data.teamWon}</div>
    `;

    fightContainer.innerHTML += details;



    fightContainer.append(fightWinner);
    
    console.log(fightWinner);
}


window.addEventListener("DOMContentLoaded", () => {
  
    init();
  
    });
function init(){
    loadTeams();
    addTeamsToSelect();
    exampleFight();
  }
function loadTeams(){
    const loadedTeams = load(TEAMS_LSK);
    if(loadedTeams){
        loadedTeams.forEach((loadedTeam) => {
            teams.push(Team.fromJSON(loadedTeam));

        });
    }
  }
function addTeamsToSelect(){


    team1Selector.setAttribute("class", "teamSelect");
    team2Selector.setAttribute("class", "teamSelect");

    const firstOption1 = document.createElement("option");
    const firstOption2 = document.createElement("option");

    const team1Text = "Choose team 1";

    firstOption1.innerText = team1Text;
    team1Selector.appendChild(firstOption1);

    const team2Text = "Choose team 2";

    firstOption2.innerText = team2Text;
    team2Selector.appendChild(firstOption2);

    teams.forEach((team, index) => {
      const option = document.createElement("option");
      option.setAttribute("value", index);
      option.setAttribute("class", "monsterSelectOption");
      option.innerText = team.getTeamName();
      option.value = team.getTeamName();
      team1Selector.appendChild(option);
    });
    teams.forEach((team, index) => {
        const option = document.createElement("option");
        option.setAttribute("value", index);
        option.setAttribute("class", "monsterSelectOption");
        option.innerText = team.getTeamName();
        option.value = team.getTeamName();
        team2Selector.appendChild(option);
      });
    
}

async function startFight(){
    let team1 = teams.find((team)=> team.getTeamName() ===team1Selector.options[team1Selector.selectedIndex].value);
    let team2 = teams.find((team)=> team.getTeamName() === team2Selector.options[team2Selector.selectedIndex].value);

    fightContainer.innerHTML = "";
    let param = await buildParam(team1.monsters, team2.monsters);
    const data = await serveData("fight", param, fightContainer);

    let fightWinner = document.createElement('h2');
    fightWinner.setAttribute('class', 'winner');
    fightWinner.innerText = `${data['teamWon']} won!`;
    const details = `
    <div class="detail"><strong>Battle ID:</strong> ${data.battleID}</div>
    <div class="detail"><strong>Battle Winners:</strong> ${data.battleWinners}</div>
    <div class="detail"><strong>Team Points (Team 1):</strong> ${data.team1Points}</div>
    <div class="detail"><strong>Team Points (Team 2):</strong> ${data.team2Points}</div>
    <div class="detail"><strong>Remaining HP:</strong> ${JSON.stringify(data.remainingHP)}</div>
    <div class="detail"><strong>Team Stats:</strong></div>
    <div class="detail"><strong>Team 1:</strong> ${JSON.stringify(data.teamStats.team1)}</div>
    <div class="detail"><strong>Team 2:</strong> ${JSON.stringify(data.teamStats.team2)}</div>
    <div class="detail"><strong>Team Won:</strong> ${data.teamWon}</div>
    `;

    fightContainer.innerHTML += details;



    fightContainer.append(fightWinner);
    
    console.log(fightWinner);
}

fightBtn.addEventListener("click", ()=>{
    startFight();
})

// Create Random Team based on Int (1-10 range for levels)
async function createRandomTeam(low, high){
    return await serveData("generateTeam", `&level=${getRandomInt(low,high)}`, fightContainer);
}

//Create parameters to send to API with team1, team2.
async function buildParam(team1, team2){
    let param;
    let team1params = '';
    let team2params = '';
    param = 'team1=';

    console.log(team1);
    console.log(team2);
    for (let i = 0; i < team1.length || i < team2.length; i++) {
        if (i < team1.length) {
            team1params += team1[i].id; // Concatenate team1's id
            team1params += ','; // Add a comma
        }

        if (i < team2.length) {
            team2params += Number(team2[i].id); // Concatenate team2's id
            team2params += ','; // Add a comma
        }
    }

    // Optional: Remove the trailing comma from the parameters
    team1params = team1params.slice(0, -1);
    team2params = team2params.slice(0, -1);

    // Return or use the parameters as needed
    return param + team1params + '&team2=' + team2params;
}

//Random Int 1-10 range for levels
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

