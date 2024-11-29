//Js code for fight page
import { serveData } from "./common/fetch.js";

const fightContainer = document.getElementById("fightContainer");

let team1 = await createRandomTeam(1, 10);
let team2 = await createRandomTeam(1, 10);
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