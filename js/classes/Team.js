//Class for teams
export class Team {
  constructor(teamName) {
    this.name = teamName;
    this.monsters = [];
    this.paidFor = false;
    // this.totalRank = this.calcTeamRank();
    // this.totalRating = this.calcTeamRating();
    // this.totalHealth = this.calcTeamHealth();
    // this.totalDamage = this.calcTeamDamage();
    // this.teamValue = this.calcTeamValue();
    this.strongestMonster;
    this.weakestMonster;
    this.totalRank = 0;
    this.totalRating = 0;
    this.totalHealth = 0;
    this.totalDamage = 0;

    this.teamValue = 0;
    this.teamCost = 0;
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

    this.numRounds = 0;
    this.wonRounds = 0;
    this.drawnRounds = 0;
    this.lostRounds = 0;
    this.teamBodyVisible = true;

    this.calc();
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

  getNumRounds() {
    return this.numRounds;
  }

  getWonRounds() {
    return this.wonRounds;
  }

  getDrawnRounds() {
    return this.drawnRounds;
  }

  getLostRounds() {
    return this.lostRounds;
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

    this.calc();
  }

  loadMonsters(monsters) {
    this.monsters = monsters;

    const teamCost = monsters.reduce((acc, curr) => acc + curr.price, 0);
    this.teamCost = teamCost;

    this.calc();
  }

  setPaidFor(paidFor) {
    this.paidFor = paidFor;
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

  setNumRounds(numRounds) {
    this.numRounds = numRounds;
  }

  setWonRounds(wonRounds) {
    this.wonRounds = wonRounds;
  }

  setDrawnRounds(drawnRounds) {
    this.drawnRounds = drawnRounds;
  }

  setLostRounds(lostRounds) {
    this.lostRounds = lostRounds;
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
    this.calc();
  }

  calc() {
    this.totalRank = this.calcTeamRank();
    this.totalRating = this.calcTeamRating();
    this.totalHealth = this.calcTeamHealth();
    this.totalDamage = this.calcTeamDamage();
    this.teamValue = this.calcTeamValue();
    this.strongestMonster = this.findStrongestMonster();
    this.weakestMonster = this.findWeakestMonster();
  }

  calcTeamRank() {
    const monsters = this.monsters;
    const rank = monsters.reduce((acc, curr) => acc + curr.rank, 0);
    return rank;
  }

  calcTeamRating() {
    const monsters = this.monsters;
    const rating = monsters.reduce((acc, curr) => acc + curr.health + curr.damage, 0);
    return rating;
  }

  calcTeamHealth() {
    const monsters = this.monsters;
    const health = monsters.reduce((acc, curr) => acc + curr.health, 0);
    return health;
  }

  calcTeamDamage() {
    const monsters = this.monsters;
    const damage = monsters.reduce((acc, curr) => acc + curr.damage, 0);
    return damage;
  }

  calcTeamValue() {
    const monsters = this.monsters;

    const price = monsters.reduce((acc, curr) => acc + curr.price, 0);
    const startHP = monsters.reduce((acc, curr) => acc + curr.health, 0);
    const remainingHP = monsters.reduce((acc, curr) => acc + curr.remainingHP, 0);

    const healthDifference = startHP - remainingHP;
    const healthPriceFactor = price * 0.02;

    const healthPriceInfluence = healthDifference * healthPriceFactor;

    const teamValue = Math.floor((price - healthPriceInfluence) * 0.7);

    return teamValue;
  }

  findStrongestMonster() {
    const monsters = this.monsters;
    if (monsters.length > 0) {
      const sortedByStrongest = monsters.sort((a, b) => {
        const rankA = a.rank;
        const rankB = b.rank;
        return rankA - rankB;
      });
      return sortedByStrongest[0];
    }
    return null;
  }

  findWeakestMonster() {
    const monsters = this.monsters;
    if (monsters.length > 0) {
      const sortedByWeakest = monsters.sort((a, b) => {
        const rankA = a.rank;
        const rankB = b.rank;
        return rankB - rankA;
      });
      return sortedByWeakest[0];
    }
    return null;
  }

  static fromJSON(json) {
    const newTeam = new Team(json.name);
    newTeam.loadMonsters(json.monsters);
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
    newTeam.setNumRounds(json.numRounds);
    newTeam.setWonRounds(json.wonRounds);
    newTeam.setDrawnRounds(json.drawnRounds);
    newTeam.setLostRounds(json.lostRounds);
    newTeam.setTeamBodyVisible(json.teamBodyVisible);
    return newTeam;
  }
}
