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

  const teamsHeader = document.createElement("h2");
  teamsHeader.innerText = "Your Teams";
  teamsContainer.appendChild(teamsHeader);
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
      const checkName = generateUniqueTeamName(teamName);

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

function generateUniqueTeamName(teamName) {
  const noneUnique = teams.filter((team) => extractLetters(team.getTeamName()) === extractLetters(teamName));

  if (noneUnique && noneUnique.length > 0) {
    const lastElement = noneUnique.length - 1;
    const sortedNames = noneUnique.sort((a, b) => Number(extractNumbersFromEnd(a.getTeamName()) - Number(extractNumbersFromEnd(b.getTeamName())))).map((temm) => temm.getTeamName());
    const name = sortedNames[lastElement];
    const noneUniqueLetters = extractLetters(name);
    const digits = Number(extractNumbersFromEnd(name));
    const unique = digits + 1;
    const uniqueName = noneUniqueLetters.concat(unique);
    return {
      unique: false,
      name: uniqueName,
    };
  }

  return {
    unique: true,
    name: teamName,
  };
}

function extractLetters(str) {
  return str.replace(/[^a-zA-Z]/g, "");
}

function extractNumbersFromEnd(str) {
  const match = str.match(/\d+$/);
  return match ? match[0] : "";
}

function addTeam(teamName) {
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
      deleteBtn.setAttribute("src", "/icons/trashBin.svg");
      deleteBtn.setAttribute("alt", `Delete ${teamName}`);
      deleteBtn.setAttribute("title", `Delete ${teamName}`);
    }
  });

  teamContainer.appendChild(teamHeader);
  teamContainer.appendChild(teamList);
  teamContainer.appendChild(deleteBtn);
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
