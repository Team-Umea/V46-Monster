const teams = [];
const monsterDb = [];

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

function generateMonsters() {
  for (let i = 0; i < 10; i++) {
    const id = i + 1;
    const name = `Monster${i + 1}`;
    const speciality = `Spec${i + 1}`;
    const image = `images/monster${i + 1}.png`;
    const monster = new Monster(id, name, speciality, image);
    const monsterAsJSON = JSON.stringify(monster);
    monsterDb.push(monsterAsJSON);
  }
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

generateMonsters();
createRandomTeams();

console.log("Teams", teams);
