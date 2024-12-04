//Class for teams
export class Team {
  constructor(teamName) {
    this.name = teamName;
    this.monsters = [];
    this.paidFor = false;
    this.teamCost = 0;
    this.teamBodyVisible = true;
  }

  getPaidFor() {
    return this.paidFor;
  }

  setPaidFor(paidFor) {
    this.paidFor = paidFor;
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

  getTeamCost() {
    return this.teamCost;
  }

  setMonsters(monsters) {
    this.monsters = monsters;

    const teamCost = monsters.reduce((acc, curr) => acc + curr.price, 0);
    this.teamCost = teamCost;
  }

  deleteMonster(id) {
    this.monsters = [...this.monsters].filter((monster) => monster.id !== id);
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

    const monsters = this.monsters;
    const teamCost = monsters.reduce((acc, curr) => acc + curr.price, 0);
    this.teamCost = teamCost;
  }

  getTeamBodyVisible() {
    return this.teamBodyVisible;
  }

  setTeamBodyVisible(teamBodyVisible) {
    this.teamBodyVisible = teamBodyVisible;
  }

  static fromJSON(json) {
    const newTeam = new Team(json.name);
    newTeam.setMonsters(json.monsters);
    newTeam.setPaidFor(json.paidFor);
    newTeam.setVisible(json.visible);
    newTeam.setTeamBodyVisible(json.teamBodyVisible);
    return newTeam;
  }
}
