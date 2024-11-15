const monsterContainer = document.getElementById('monsters');
const teamsContainer = document.getElementById('chosenTeam');

let teams = [];
let monsterDb;

function init(){
  let data;
  try {
    data = JSON.parse(localStorage.getItem('monsters'));
  } catch (error) {
    console.log(error);
  }
  if (data && data != undefined){
    monsterDb = data;
    populateHTML();
  } else {
    fetchMonsters();
  }
}


function fetchMonsters(){
  fetch('aimonsters.json')
  .then(response => {
      return response.json();
  })
  .then(data => {
    generateMonstersJSON(data);
    populateHTML();
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
  });
}

class Team {
  constructor(teamName, monsters) { 
    this.teamName = teamName;
    this.monsters = monsters;
  }

  getTeamName() {
    return this.teamName;
  }

  getMonters() {
    return this.monsters;
  }

  addMonster(monster) {
    this.monsters.push(monster);
  }
}

class Monster {
  constructor(id, name, speciality, image) {
    this.id = id;
    this.name = name;
    this.speciality = speciality;
    this.image = image;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getSpeciality() {
    return this.speciality;
  }

  getImage() {
    return this.image;
  }

  setName(name) {
    this.name = name;
  }

  setSpeciality(speciality) {
    this.speciality = speciality;
  }

  setImage(image) {
    this.image = image;
  }
}

//Monsters => HTML
function populateHTML(){
  monsterDb.forEach(monster => {
    const li = document.createElement('li');
    const name = document.createElement('h2');
    const spec = document.createElement('p');
    const img = document.createElement('img');
    const button = document.createElement('button');

    name.innerText = monster.name;
    spec.innerText = monster.speciality;
    img.setAttribute('src', monster.image);
    img.setAttribute('alt', 'This is an image of monster ' + monster.name);
    button.innerText = 'Add to team';
    button.addEventListener('click', () => {
      const buttonText =  button.innerText;

      if(buttonText==="Add to team"){
        if(teams.length<4){
          addMonsterToTeam(monster);
          deleteMonster(monster);
          li.remove();
          moveMonster(li);
        }
      }else if(buttonText==="Remove from team"){
        addMonsterToDB(monster);
        shrinkTeam(monster);
        li.remove();
        moveMonsterBackToDBUl(li);
      }
    })

    li.appendChild(name);
    li.appendChild(img);
    li.appendChild(spec);
    li.appendChild(button);
    monsterContainer.appendChild(li);
  });
}

//Moves HTML of a Monster to a team 

function moveMonsterBackToDBUl(monster){
  console.log(monster);
  monster.lastElementChild.innerText = "Add to team";
  monsterContainer.appendChild(monster);
}

function moveMonster(monster){
    test = monster;
    monster.lastElementChild.innerText = "Remove from team";
    teamsContainer.appendChild(monster);
}

function addMonsterToTeam(monster){
  teams.push(monster);
}

function addMonsterToDB(monster){
  monsterDb.push(monster);
}

function deleteMonster(monster){
  monsterDb = monsterDb.filter((element) => {
    return element.id !== monster.id;
  })

  //Update local storage after delet
  saveToLocalStorage('monsters', monsterDb);
}

function shrinkTeam(monster){
  teams = teams.filter((element) => {
    return element.id !== monster.id;
  })
}

function saveToLocalStorage(key, value){
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error, 'pathetic');
  }
  
}

function generateMonstersJSON(data) {
  monsterDb = [];
  for (let i = 0; i < data.length; i++) {
    const id = i + 1;
    const name = data[i].name;
    const speciality = data[i].speciality;
    const image = `monsters/monster${i + 1}.webp`;
    const monster = new Monster(id, name, speciality, image);
    monsterDb.push(monster);
  }
  console.log(monsterDb);
  saveToLocalStorage('monsters', monsterDb);
}

function createRandomTeams() {
  if (monsterDb.length >= 2) {
    const shuffleDb = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const shuffledDb = shuffleDb([...monsterDb]);

    const totalMonsters = shuffledDb.length;
    let numberOfTeams = Math.floor(totalMonsters / 2);

    if (totalMonsters % 2 !== 0 && totalMonsters >= numberOfTeams * 2 + 2) {
      numberOfTeams++;
    }

    let teamsize = Math.floor(totalMonsters / numberOfTeams);
    let remainder = totalMonsters % numberOfTeams;

    let currentIndex = 0;

    for (let i = 0; i < numberOfTeams; i++) {
      let currentTeamSize = teamsize + (remainder > 0 ? 1 : 0);
      if (i < remainder) {
        remainder--;
      }

      const teamName = `Team${teams.length + 1}`;
      const monsters = shuffledDb.slice(currentIndex, currentIndex + currentTeamSize);
      const team = new Team(teamName, monsters);
      teams.push(team);
      currentIndex += currentTeamSize;
    }
  } else {
    console.log("Not enough monsters");
  }
}


window.onload = ((event)=>{
  init();
})