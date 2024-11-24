export class Team {
  constructor(teamName) {
    this.teamName = teamName;
    this.monsters = [];
    this.paidFor = false;
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

  deleteMonster(monster) {
    this.monsters = this.monsters.filter((m) => m.monster.name !== monster.monster.name);
  }

  getPaidFor() {
    return this.paidFor;
  }

  setPaidFor(status) {
    this.paidFor = status;
  }

  static fromJSON(json) {
    const newTeam = new Team(json.teamName);
    newTeam.setMonsters(json.monsters);
    newTeam.setPaidFor(json.paidFor);
    return newTeam;
  }
}
