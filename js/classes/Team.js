//Class for teams
export class Team {
  constructor(teamName) {
    this.name = teamName;
    this.monsters = [];
    this.paidFor = false;
    this.teamCost = 0;
    this.teamValue = 0;
    this.teamProfit = 0;
    this.wonFights = 0;
    this.drawnFights = 0;
    this.lostFights = 0;
    this.totalPoints = 0;
    this.teamBodyVisible = true;
  }

  getTeamName() {
    return this.name;
  }

  getMonsters() {
    return this.monsters;
  }

  getPaidFor() {
    return this.paidFor;
  }

  getTeamCost() {
    return this.teamCost;
  }

  getTeamValue() {
    return this.teamValue;
  }

  getTeamProfit() {
    const teamValue = this.teamValue;
    return teamValue === 0 ? 0 : teamValue / 4;
  }

  getTeamBodyVisible() {
    return this.teamBodyVisible;
  }

  setTeamName(name) {
    this.name = name;
  }

  setMonsters(monsters) {
    this.monsters = monsters;

    const teamCost = monsters.reduce((acc, curr) => acc + curr.price, 0);
    this.teamCost = teamCost;
  }

  setPaidFor(paidFor) {
    this.paidFor = paidFor;
  }

  setTeamValue(allMonsters) {
    const monsters = this.monsters;
    const allMonsterData = allMonsters.map((monster) => monster.monster);
    const monsterIDs = monsters.map((monster) => monster.id);

    const originalMonsters = [...allMonsterData].filter((monster) => monsterIDs.includes(monster.id));

    const originalTeamRating = originalMonsters.reduce((acc, curr) => curr.health + curr.damage + acc, 0);
    const originalTeamPrice = originalMonsters.reduce((acc, curr) => curr.price + acc, 0);

    const currentTeamRating = monsters.reduce((acc, curr) => curr.health + curr.damage + acc, 0);
    const currentTeamPrice = monsters.reduce((acc, curr) => curr.price + acc, 0);

    const ratingPriceFactor = originalTeamPrice * 0.04;
    const priceDiffPriceFactor = originalTeamPrice * 0.02;

    const ratingDifference = originalTeamRating - currentTeamRating;
    const priceDifference = originalTeamPrice - currentTeamPrice;

    const ratingInfluence = ratingDifference * ratingPriceFactor;
    const priceInfluence = priceDifference * priceDiffPriceFactor;

    const newTeamValue = originalTeamPrice - ratingInfluence - priceInfluence;

    this.teamValue = newTeamValue;
  }

  setTeamBodyVisible(teamBodyVisible) {
    this.teamBodyVisible = teamBodyVisible;
  }

  deleteMonster(id) {
    this.monsters = [...this.monsters].filter((monster) => monster.id !== id);
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

  static fromJSON(json) {
    const newTeam = new Team(json.name);
    newTeam.setMonsters(json.monsters);
    newTeam.setPaidFor(json.paidFor);
    newTeam.setVisible(json.visible);
    newTeam.setTeamBodyVisible(json.teamBodyVisible);
    return newTeam;
  }
}
