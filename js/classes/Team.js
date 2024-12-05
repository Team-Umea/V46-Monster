//Class for teams
export class Team {
  constructor(teamName) {
    this.name = teamName;
    this.monsters = [];
    this.paidFor = false;
    this.teamCost = 0;
    this.teamValue = 0;
    this.teamProfit = 0;
    this.numBattels = 0;
    this.wonBattels = 0;
    this.drawnBattels = 0;
    this.lostBattels = 0;
    this.totalPoints = 0;
    this.numFights = 0;
    this.wonFights = 0;
    this.drawnFights = 0;
    this.lostFights = 0;
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

  getNumBattels() {
    return this.numBattels;
  }

  getWonBattels() {
    return this.wonBattels;
  }

  getDrawnBattels() {
    return this.drawnBattels;
  }

  getLostBattels() {
    return this.lostBattels;
  }

  getTotalPoints() {
    return this.totalPoints;
  }

  getNumFights() {
    return this.numFights;
  }

  getWonFights() {
    return this.wonFights;
  }

  getDrawnFights() {
    return this.drawnFights;
  }

  getLostFights() {
    return this.lostFights;
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

  setNumBattels(numBattels) {
    this.numBattels = numBattels;
  }

  setWonBattels(wonBattels) {
    this.wonBattels = wonBattels;
  }

  setDrawnBattels(drawnBattels) {
    this.drawnBattels = drawnBattels;
  }

  setLostBattels(lostBattels) {
    this.lostBattels = lostBattels;
  }

  setTotalPoints(totalPoints) {
    this.totalPoints = totalPoints;
  }

  setNumFights(numFights) {
    this.numFights = numFights;
  }

  setWonFights(wonFights) {
    this.wonFights = wonFights;
  }

  setDrawnFights(drawnFights) {
    this.drawnFights = drawnFights;
  }

  setLostFights(lostFights) {
    this.lostFights = lostFights;
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
    newTeam.setNumBattels(json.numBattels);
    newTeam.setWonBattels(json.wonBattels);
    newTeam.setDrawnBattels(json.drawnBattels);
    newTeam.setLostBattels(json.lostBattels);
    newTeam.setTotalPoints(json.totalPoints);
    newTeam.setNumFights(json.numFights);
    newTeam.setWonFights(json.wonFights);
    newTeam.setDrawnFights(json.drawnFights);
    newTeam.setLostFights(json.lostFights);
    newTeam.setTeamBodyVisible(json.teamBodyVisible);
    return newTeam;
  }
}
