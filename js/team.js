//Js code for team page
import { MonsterCard } from "./classes/MonsterCard.js";
import { Team } from "./classes/Team.js";
import { save,load } from "./common/utilities.js";
import { TEAMS_LSK,ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { serveData } from "./common/fetch.js";
import { ALLMONSTERS_TTL } from "./common/ttl.js";

const allMonstersCon = document.getElementById("allMonstersContainer");

let allMonsters = [];

const teamsArr = [];

window.addEventListener("DOMContentLoaded", () => {
  
  init();

  });

function init(){
    initCreateTeamForm();
    getAllMonsters();
}

async function getAllMonsters(){

  const monsterData = await serveData("allMonsters", undefined, allMonstersCon, ALLMONSTERS_LSK, ALLMONSTERS_TTL);
  const mappedData = monsterData.map((monster)=>{
    return {monster:monster, visible:true};
  });
  allMonsters = mappedData;

  loadTeams();

  renderTeams();



  
}

function initCreateTeamForm() {
    const container = document.getElementById("createTeam");
    const form = container.getElementsByTagName("form")[0];
    const input = container.getElementsByTagName("input")[0];
    const message = container.getElementsByTagName("p")[0];
  
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  
    input.addEventListener("input", () => {
      message.innerText = "";
      message.setAttribute("class", "hidden");
      container.setAttribute("class", "minimize");
  
      const trimedValue = input.value.replace(/\s+/g, "");
      const lastCh = trimedValue.slice(-1).toLowerCase();
  
      const isLetter = lastCh >= "a" && lastCh <= "z";
      const isDigit = digits.includes(lastCh);
      input.value = trimedValue;
  
      if (!isDigit && !isLetter) {
        input.value = input.value.slice(0, -1);
        message.setAttribute("class", "error");
        message.innerText = "Error! Only letters and digits allowed";
  
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
        const checkName = generateUniqueTeamName(teamsArr, teamName);
  
        let controlledName = "";
        console.log(checkName);
        if (checkName.nonUnique) {
          controlledName = checkName.name;
          message.setAttribute("class", "success");
          message.innerText = `${teamName} successfully changed to ${controlledName} due to team name duplicates`;
        } else {
          controlledName = teamName;
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

  function addTeam(teamName) {
    const newTeam = new Team(teamName);
    teamsArr.push(newTeam);
    updateTeams();
  }

  function updateTeams(){
    save(TEAMS_LSK,teamsArr);
    renderTeams();
  }

  function loadTeams(){
    const loadedTeams = load(TEAMS_LSK);
    if(loadedTeams){
        loadedTeams.forEach((loadedTeam) => {
            teamsArr.push(Team.fromJSON(loadedTeam));

        });
        renderTeams();
    }
  }
  function renderTeams(){
    teamsContainer.innerHTML = "";
    if(teamsArr.length > 0){
        teamsArr.forEach((team)=>{
            const teamDiv = document.createElement("div");
            const teamText = document.createElement("h2");
            const monContainer = document.createElement("div");

            teamText.innerText = team.name;

            teamDiv.appendChild(teamText);
            monContainer.setAttribute("class", "monContainer")
            teamDiv.setAttribute("id", team.name);
            teamDiv.setAttribute("class", "teamDiv");
            if(team.monsters.length > 0){
                team.monsters.forEach((monster)=>{
                    const monsterCard = new MonsterCard(monster, allMonsters,[],true);
                    const assembledMonsterCard = monsterCard.assembleMonsterCard();

                    monContainer.appendChild(assembledMonsterCard);

                })
            }
            teamDiv.appendChild(monContainer);
            teamsContainer.appendChild(teamDiv);
        })
    }

  }
  function extractLetters(str) {
    return str.replace(/[^a-zA-Z]/g, "");
  }

  function extractNumbersFromEnd(str) {
    const match = str.match(/\d+$/);
    return match ? match[0] : "";
  }

 function generateUniqueTeamName(teams, teamName) {

    const noneUnique = teams.filter((team) => {
      return extractLetters(team.name) === extractLetters(teamName);
    });
    if (noneUnique && noneUnique.length > 0) {
      const lastElement = noneUnique.length - 1;
      const sortedNames = noneUnique.sort((a, b) => Number(extractNumbersFromEnd(a.getTeamName()) - Number(extractNumbersFromEnd(b.getTeamName())))).map((team) => team.getTeamName());
      const name = sortedNames[lastElement];
      const noneUniqueLetters = extractLetters(name);
      const digits = Number(extractNumbersFromEnd(name));
      const unique = digits + 1;
      const uniqueName = noneUniqueLetters.concat(unique);
      return {
        nonUnique: true,
        name: uniqueName,
      };
    }return{
      nonUnique:false,
      name: teamName,
    }
}