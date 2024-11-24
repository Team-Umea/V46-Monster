export class Team {
  constructor(teamName) {
    this.teamName = teamName;
    this.monsters = [];
    this.paidFor = false;
    this.createdAt = new Date();
    this.visible = true;
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

  getCreatedAt() {
    return this.createdAt;
  }

  setCreatedAt(createdAt) {
    this.createdAt = createdAt;
  }

  getVisible() {
    return this.visible;
  }

  setVisible(visible) {
    this.visible = visible;
  }

  static fromJSON(json) {
    const newTeam = new Team(json.teamName);
    newTeam.setMonsters(json.monsters);
    newTeam.setPaidFor(json.paidFor);
    newTeam.setCreatedAt(json.createdAt);
    newTeam.setVisible(json.visible);
    return newTeam;
  }
}
