//Class for teams
import { sortInstances } from "../common/utilities.js";
import { Monster } from "./Monster.js";

export class Team {
  constructor(teamName) {
    this.name = teamName;
    this.monsters = [];
    this.paidFor = false;
    this.elements = [];

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

    this.lostHp = 0;
    this.remainingHP = 0;
    this.sufferedDamage = 0;
    this.distributedDamage = 0;

    this.wonAgainst = [];
    this.lostAgainst = [];

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

  getMonsterTeamRank(id) {
    const monsters = this.monsters;
    if (monsters.length > 0) {
      const sortedByStrongest = [...monsters].sort((a, b) => {
        const rankA = a.rank;
        const rankB = b.rank;
        return rankA - rankB;
      });
      return sortedByStrongest.indexOf(monsters.find((monster) => monster.id === id)) + 1;
    }
    return null;
  }

  setTeamName(name) {
    this.name = name;
  }

  setMonsters(monsters) {
    this.monsters = monsters.map((m) => new Monster(m));

    const teamCost = monsters.reduce((acc, curr) => acc + curr.price, 0);
    this.teamCost = teamCost;

    this.calc();
  }

  loadMonsters(monsters) {
    this.monsters = monsters.map((m) => new Monster(m));

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
    this.calc();
  }

  addMonsterToTeam(monster) {
    const duplicates = this.monsters.filter((m) => m.id === monster.id);
    if (this.monsters.length < 4 && duplicates.length === 0) {
      this.monsters.push(new Monster(monster));
    }

    const monsters = this.monsters;

    const teamCost = monsters.reduce((acc, curr) => acc + curr.price, 0);
    this.teamCost = teamCost;
    this.calc();
  }

  shiftMonsters(id) {
    const monsters = this.monsters;
    const numMonsters = monsters.length;
    let shifted = [...monsters];

    const monster = monsters.find((m) => m.id === id);
    const monsterIndex = monsters.indexOf(monster);

    const nextMonster = monsterIndex < numMonsters - 1 ? monsters[monsterIndex + 1] : monsters[0];
    const nextMonsterIndex = monsterIndex < numMonsters - 1 ? monsterIndex + 1 : 0;

    shifted[monsterIndex] = nextMonster;
    shifted[nextMonsterIndex] = monster;

    this.monsters = shifted;
  }

  calc() {
    this.totalRank = this.calcTeamRank();
    this.totalRating = this.calcTeamRating();
    this.totalHealth = this.calcTeamHealth();
    this.totalDamage = this.calcTeamDamage();
    this.teamValue = this.calcTeamValue();
    this.lostHp = this.calcLostHp();
    this.remainingHP = this.calcRemainingHP();
    this.sufferedDamage = this.calcSufferedDamage();
    this.distributedDamage = this.calcDistributedDamage();
    this.wonAgainst = this.calcWonAgainst();
    this.lostAgainst = this.calcLostAgainst();
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

  calcLostHp() {
    const monsters = this.monsters;
    const maxHp = monsters.reduce((acc, curr) => acc + curr.health, 0);
    const lostHp = maxHp - monsters.reduce((acc, curr) => acc + curr.remainingHP, 0);
    return lostHp;
  }

  calcRemainingHP() {
    const monsters = this.monsters;
    const maxHp = monsters.reduce((acc, curr) => acc + curr.health, 0);
    const lostHp = monsters.reduce((acc, curr) => acc + curr.remainingHP, 0);
    const remainingHP = Math.floor((lostHp / maxHp) * 100);
    return remainingHP === NaN ? 100 : remainingHP;
  }

  calcSufferedDamage() {
    const monsters = this.monsters;
    const sufferedDamage = monsters.reduce((acc, curr) => acc + curr.sufferedDamage, 0);
    return sufferedDamage;
  }

  calcDistributedDamage() {
    const monsters = this.monsters;
    const distributedDamage = monsters.reduce((acc, curr) => acc + curr.distributedDamage, 0);
    return distributedDamage;
  }

  calcWonAgainst() {
    return sortInstances(["a", "a", "a", "b", "b", "c"]);
    // const monsters = this.monsters;
    // const wonAgainst = monsters.reduce((acc,curr)=>[...acc,curr.wonAgainst],[]);
    // return wonAgainst;
  }

  calcLostAgainst() {
    return sortInstances(["g", "g", "g", "h", "h", "i"]);
    // const monsters = this.monsters;
    // const lostAgainst = monsters.reduce((acc,curr)=>[...acc,curr.lostAgainst],[]);
    // return lostAgainst;
  }

  getAllMonsterElements(allElements) {
    const teamMonsters = this.monsters;

    const elements = teamMonsters.map((monster) => monster.elements).flat();

    const instancesOfElements = elements.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const entriesArray = Object.keys(instancesOfElements).map((key) => ({
      [key]: instancesOfElements[key],
    }));

    const sortedInstances = entriesArray.sort((a, b) => {
      const countA = Object.values(a)[0];
      const countB = Object.values(b)[0];

      if (countB - countA !== 0) {
        return countB - countA;
      }

      const keyA = Object.keys(a)[0];
      const keyB = Object.keys(b)[0];
      return keyA.localeCompare(keyB);
    });

    const sortElementsWithRating = sortedInstances.map((element) => {
      const elementName = Object.keys(element)[0];
      const rating = allElements.find((teamElement) => teamElement.name === elementName).rating;
      return { ...element, rating: rating };
    });

    return sortElementsWithRating;
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
