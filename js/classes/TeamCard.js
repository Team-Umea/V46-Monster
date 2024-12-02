import { MonsterCard } from "./MonsterCard.js";

export class TeamCard {
  constructor(teamName, monsters, allMonsters) {
    this.teamName = teamName;
    this.monsters = monsters;
    this.allMonsters = allMonsters;
  }

  teamContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "teamContainer");
    return container;
  }

  teamHeader() {
    const header = document.createElement("h2");
    header.setAttribute("class", "teamHeader");
    const name = this.teamName;
    header.innerText = name;
    return header;
  }

  teamControls() {
    const btnContainer = document.createElement("div");
    btnContainer.setAttribute("class", "teamControls");

    for (let i = 0; i < 3; i++) {
      const btn = document.createElement("button"); //change to img
      btn.setAttribute("class", "teamControlBtn");

      if (i === 0) {
        btn.innerText = "Buy";
      } else if (i === 1) {
        btn.innerText = "Shuffle";
      } else {
        btn.innerText = "Delete";
      }

      btnContainer.appendChild(btn);
    }
    return btnContainer;
  }

  teamMonsters() {
    const monsterContainer = document.createElement("div");
    monsterContainer.setAttribute("class", "teamMonsters");

    const monsters = this.monsters;
    const allMonsters = this.allMonsters;

    monsters.forEach((monster) => {
      const monsterCard = new MonsterCard(monster, allMonsters, [], true);
      const assembledMonsterCard = monsterCard.assembleMonsterCard();
      monsterContainer.appendChild(assembledMonsterCard);
    });
    return monsterContainer;
  }
}
