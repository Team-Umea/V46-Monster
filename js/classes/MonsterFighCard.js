import { renderIconWithNumber } from "../common/render.js";

export class MonsterFighCard {
  constructor(monster) {
    this.monster = monster;
    this.imagePath = `https://ozzodevmonsterapi.azurewebsites.net${monster.img}`;
  }

  card() {
    const monster = this.monster;
    const monsterName = monster.name;
    const monsterPrice = monster.price;
    const monsterHealth = monster.remainingHP;
    const monsterRank = monster.rank;
    const monsterDamage = monster.damage;
    const monsterImg = this.imagePath;

    const card = document.createElement("div");
    const name = document.createElement("h2");
    const stats = document.createElement("div");
    const price = renderIconWithNumber(monsterPrice, "../res/icons/diamond.svg", "");
    const health = renderIconWithNumber(monsterHealth, "../res/icons/heart.svg", "");
    const rank = renderIconWithNumber(monsterRank, "../res/icons/ribbon.svg", "");
    const damage = renderIconWithNumber(monsterDamage, "../res/icons/barbell.svg", "");

    card.setAttribute("class", "monsterFighCard");
    name.setAttribute("class", "name");
    stats.setAttribute("class", "stats");
    price.classList.add("price", "stat");
    health.classList.add("health", "stat");
    rank.classList.add("rank", "stat");
    damage.classList.add("damage", "stat");

    name.innerText = monsterName;
    card.style.backgroundImage = `url(${monsterImg})`;

    stats.append(health, rank, damage, price);

    card.append(name, stats);

    return card;
  }
}
