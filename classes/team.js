export class Team {
    constructor(teamName) {
      this.teamName = teamName;
      this.monsters = [];
    }
  
    getTeamName() {
      return this.teamName;
    }
  
    setMonsters(monsters) {
      this.monsters = monsters;
    }
  
    getMonsters() {
      return this.monsters;
    }
  
    addMonster(monster) {
      this.monsters.push(monster);
    }
  }