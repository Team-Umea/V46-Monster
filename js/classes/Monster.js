import { convertInstancesToStr } from "../common/utilities.js";

//Class for monster
export class Monster {
  constructor(monster) {
    this.monster = monster;

    this.id = monster.id;
    this.name = monster.name;
    this.specs = monster.specs;
    this.health = monster.health;
    this.damage = monster.damage;
    this.rank = monster.rank;
    this.remainingHP = monster.remainingHP;
    this.sufferedDamage = monster.sufferedDamage;
    this.distributedDamage = monster.distributedDamage;
    this.points = monster.points;
    this.wonFights = monster.wonFights;
    this.drawnFights = monster.drawnFights;
    this.lostFights = monster.lostFights;
    this.wonRounds = monster.wonRounds;
    this.drawnRounds = monster.drawnRounds;
    this.lostRounds = monster.lostRounds;
    this.wonAgainst = monster.wonAgainst;
    this.drawnAgainst = monster.drawnAgainst;
    this.lostAgainst = monster.lostAgainst;
    this.price = monster.price;
    this.elements = monster.elements;
    this.img = monster.img;

    this.lostHP = 0;
    this.percentHP = "100%";
    this.winRate = "0%";
    this.numFights = 0;
    this.numRounds = 0;

    this.calc();
  }

  calc() {
    this.lostHP = this.calcLostHp();
    this.percentHP = this.calcPercentHp();
    this.winRate = this.calcWinRate();
    this.numFights = this.calcNumFights();
    this.numRounds = this.calcNumRounds();

    this.wonAgainst = convertInstancesToStr(this.wonAgainst);
    this.drawnAgainst = convertInstancesToStr(this.drawnAgainst);
    this.lostAgainst = convertInstancesToStr(this.lostAgainst);
  }

  calcLostHp() {
    const hp = this.health;
    const remainingHP = this.remainingHP;
    const lostHp = hp - remainingHP;

    return lostHp;
  }

  calcPercentHp() {
    const hp = this.health;
    const remaining = this.remainingHP;

    const percentage = Math.floor((remaining / hp) * 100);

    return isNaN(percentage) ? "100%" : `${percentage}%`;
  }

  calcWinRate() {
    const wonFights = this.wonFights;
    const drawnFights = this.drawnFights;
    const lostFights = this.lostFights;
    const wonRounds = this.wonRounds;
    const drawnRounds = this.drawnRounds;
    const lostRounds = this.lostRounds;

    const sum = wonFights + drawnFights + lostFights + wonRounds + drawnRounds + lostRounds;
    const wins = wonFights + wonRounds;

    const winRate = Math.floor((wins / sum) * 100);

    return isNaN(winRate) ? "0%" : `${winRate}%`;
  }

  calcNumFights() {
    const wonFights = this.wonFights;
    const drawnFights = this.drawnFights;
    const lostFights = this.lostFights;

    const numFights = wonFights + drawnFights + lostFights;

    return numFights;
  }

  calcNumRounds() {
    const wonRounds = this.wonRounds;
    const drawnRounds = this.drawnRounds;
    const lostRounds = this.lostRounds;

    const numRounds = wonRounds + drawnRounds + lostRounds;

    return numRounds;
  }
}
