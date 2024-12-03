import { MonsterCard } from "./MonsterCard.js";
import { ToggleIcon } from "./ToggleIcon.js";

export class TeamCard {
  constructor(teamName, monsters, allMonsters) {
    this.teamName = teamName;
    this.monsters = monsters;
    this.allMonsters = allMonsters;
    this.linkedBtns = [];
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

  linkBtns() {
    const linkedBtns = this.linkedBtns;

    if (linkedBtns && linkedBtns.length > 0) {
      linkedBtns.forEach((linkedBtn) => {
        linkedBtns.forEach((btn) => {
          linkedBtn.addLinkedToggleIcons(btn);
        });
      });
    }
  }

  teamControls() {
    const btnContainer = document.createElement("div");
    btnContainer.setAttribute("class", "teamControls");

    function log() {
      console.log("Clicked");
    }

    const linkedBtns = this.linkedBtns;

    const buyBtn = new ToggleIcon("cart", "Buy team", log);
    const shuffleBtn = new ToggleIcon("shuffle", "Get 4 random monsters", log);
    const deleteBtn = new ToggleIcon("trash", "Delete team", log);

    linkedBtns.push(buyBtn);
    linkedBtns.push(shuffleBtn);
    linkedBtns.push(deleteBtn);

    this.linkBtns();

    const buyEl = buyBtn.getIconToggle();
    const shuffleEl = shuffleBtn.getIconToggle();
    const deleteEl = deleteBtn.getIconToggle();

    btnContainer.appendChild(buyEl);
    btnContainer.appendChild(shuffleEl);
    btnContainer.appendChild(deleteEl);
    return btnContainer;
  }

  teamMonsters() {
    const monsterContainer = document.createElement("div");
    monsterContainer.setAttribute("class", "teamMonsters");

    const monsters = this.monsters;
    const allMonsters = this.allMonsters;
    const linkedBtns = this.linkedBtns;

    monsters.forEach((monster) => {
      const monsterCard = new MonsterCard(monster, allMonsters, [], true);
      const assembledMonsterCard = monsterCard.assembleMonsterCard();

      function log() {
        console.log("Clicked");
      }

      const removeMonsterBtn = new ToggleIcon("x", "Buy team", log);
      linkedBtns.push(removeMonsterBtn);

      const removeMonsterBtnEl = removeMonsterBtn.getIconToggle();
      removeMonsterBtnEl.classList.add("smallIconToggle", "removeMonster");

      assembledMonsterCard.appendChild(removeMonsterBtnEl);

      monsterContainer.appendChild(assembledMonsterCard);
    });

    this.linkBtns();

    return monsterContainer;
  }
}
