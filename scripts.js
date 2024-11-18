const monsterContainer = document.getElementById("monsters");
const teamsContainer = document.getElementById("teamsContainer");
const resetButton = document.getElementById("resetTeam");
const addButtonText = "Add to team";
const removeButtonText = "Remove from team";

let teams = [];
let monsterDb;

function init() {
  let monsters;
  let localTeams;
  try {
    monsters = JSON.parse(localStorage.getItem("monsters"));
    localTeams = JSON.parse(localStorage.getItem("teams"));
  } catch (error) {
    console.log(error);
  }
  if (monsters && monsters != undefined) {
    monsterDb = monsters;
    populateHTML(monsterDb, monsterContainer, addButtonText);
  } else {
    fetchMonsters();
  }

  teams = localTeams || [];
  toggleResetTeanBtn();
  initResetButton();
  initCreateTeamForm();
  populateHTML(teams, teamsContainer, removeButtonText);
}

function initResetButton() {
  resetButton.addEventListener("click", () => {
    teams.forEach((item) => {
      monsterDb.push(item);
    });
    teams = [];
    monsterDb.sort((a, b) => a.id - b.id);
    saveProgress();
    teamsContainer.innerHTML = "";
    populateHTML(monsterDb, monsterContainer, addButtonText);
    toggleResetTeanBtn();
  });
}

function toggleResetTeanBtn() {
  if (teams.length > 0) {
    resetButton.classList.remove("hidden");
  } else {
    resetButton.classList.add("hidden");
  }
}

function fetchMonsters() {
  fetch("aimonsters.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      generateMonstersJSON(data);
      populateHTML(monsterDb, monsterContainer, addButtonText);
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
    });
}

function initCreateTeamForm() {
  const container = document.getElementById("createTeam");
  const form = container.getElementsByTagName("form")[0];
  const input = container.getElementsByTagName("input")[0];
  const message = container.getElementsByTagName("p")[0];

  console.log(form);

  input.addEventListener("input", () => {
    const trimedValue = input.value.replace(/\s+/g, "");
    input.value = trimedValue;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const teamName = input.value;
    if (teamName !== "") {
      message.setAttribute("class", "success");
      message.innerText = `${teamName} successfully created`;
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

class Team {
  constructor(teamName) {
    this.teamName = teamName;
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
function addTeam() {
  const teamContainer = document.createElement("div");
  const teamName = document.createElement("h2");
  const teamList = document.createElement("ul");

  const newTeam = new Team(prompt("What do you want to name your team?"));
  teamList.setAttribute("id", newTeam.getTeamName());
  teamContainer.setAttribute("class", "teamDiv");

  teamName.innerText = newTeam.getTeamName();
  teamContainer.appendChild(teamName);
  teamContainer.appendChild(teamList);
  teamsContainer.appendChild(teamContainer);
}
//Monsters => HTML
function populateHTML(array, parent, buttonText) {
  parent.innerHTML = "";
  array.forEach((monster) => {
    const li = document.createElement("li");
    const name = document.createElement("h2");
    const spec = document.createElement("p");
    const img = document.createElement("img");
    const button = document.createElement("button");

    name.innerText = monster.name;
    spec.innerText = monster.speciality;
    img.setAttribute("src", monster.image);
    img.setAttribute("alt", "This is an image of monster " + monster.name);
    button.innerText = buttonText;
    button.addEventListener("click", () => {
      const buttonText = button.innerText;

      if (buttonText === "Add to team") {
        if (teams.length < 4) {
          addMonsterToTeam(monster);
          deleteMonster(monster);
          li.remove();
          moveMonster(li);
        }
      } else if (buttonText === "Remove from team") {
        addMonsterToDB(monster);
        shrinkTeam(monster);
        li.remove();
        moveMonsterBackToDBUl(li);
      }

      //Anytime anything changes we save to local storage.
      toggleResetTeanBtn();
      saveProgress();
    });

    li.appendChild(name);
    li.appendChild(img);
    li.appendChild(spec);
    li.appendChild(button);
    parent.appendChild(li);
  });
}

//Moves HTML of a Monster to a team

function moveMonsterBackToDBUl(monster) {
  monster.lastElementChild.innerText = addButtonText;
  monsterContainer.appendChild(monster);
}

function moveMonster(monster) {
  monster.lastElementChild.innerText = removeButtonText;
  teamsContainer.appendChild(monster);
}

function addMonsterToTeam(monster) {
  teams.push(monster);
}

function addMonsterToDB(monster) {
  monsterDb.push(monster);
}

function deleteMonster(monster) {
  monsterDb = monsterDb.filter((element) => {
    return element.id !== monster.id;
  });
}

function shrinkTeam(monster) {
  teams = teams.filter((element) => {
    return element.id !== monster.id;
  });
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

function saveProgress() {
  saveToLocalStorage("teams", teams);
  saveToLocalStorage("monsters", monsterDb);
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
  saveToLocalStorage("monsters", monsterDb);
}

window.onload = (event) => {
  init();
};
