//Class for teams
export class Team {
  constructor(teamName) {
    this.name = teamName;
    this.monsters = [];
    this.paidFor = false;
  }

  getPaidFor() {
    return this.paidFor;
  }

  setPaidFor(status) {
    this.paidFor = status;
  }

  getTeamName() {
    return this.name;
  }
  setTeamName(name) {
    this.name = name;
  }

  getMonsters() {
    return this.monsters;
  }

  setMonsters(monsters) {
    this.monsters = monsters;
  }

  getVisible() {
    return this.visible;
  }

  setVisible(visible) {
    this.visible = visible;
  }

  addMonsterToTeam(monster) {
    const duplicates = this.monsters.filter((m) => m.id === monster.id);
    if (this.monsters.length < 4 && duplicates.length === 0) {
      this.monsters.push(monster);
    }
  }

  static fromJSON(json) {
    const newTeam = new Team(json.name);
    newTeam.setMonsters(json.monsters);
    newTeam.setPaidFor(json.paidFor);
    newTeam.setVisible(json.visible);
    return newTeam;
  }
}
