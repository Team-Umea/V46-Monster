import { MonsterCard } from "./MonsterCard.js";
import { ToggleIcon } from "./ToggleIcon.js";

export class TeamCard {
  constructor(teamName, monsters, allMonsters) {
    this.teamName = teamName;
    this.monsters = monsters;
    this.allMonsters = allMonsters;
    this.linkedBtns = [];
    this.teamCost = this.calcTeamCost();
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

    function log() {
      console.log("Clicked");
    }

    const teamName = this.teamName;
    const teamCost = this.teamCost;
    const linkedBtns = this.linkedBtns;

    const buyBtn = new ToggleIcon("cart", `Buy ${teamName} for ${teamCost} credits`, log);
    const shuffleBtn = new ToggleIcon("shuffle", `Fill ${teamName} with 4 random monsters`, log);
    const deleteBtn = new ToggleIcon("trash", `Delete ${teamName}`, log);

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
    const teamName = this.teamName;

    monsters.forEach((monster) => {
      const monsterCard = new MonsterCard(monster, allMonsters, [], true).assembleMonsterCard();
      const monsterName = monster.name;

      function log() {
        console.log("Clicked");
      }

      const removeMonsterBtn = new ToggleIcon("x", `Remove ${monsterName} from ${teamName}`, log);
      linkedBtns.push(removeMonsterBtn);

      const removeMonsterBtnEl = removeMonsterBtn.getIconToggle();
      removeMonsterBtnEl.classList.add("smallIconToggle", "removeMonster");

      monsterCard.appendChild(removeMonsterBtnEl);

      monsterContainer.appendChild(monsterCard);
    });

    this.linkBtns();

    return monsterContainer;
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

  calcTeamCost() {
    const monsters = this.monsters;
    const totalCost = monsters.reduce((acc, curr) => acc + curr.price, 0);

    return totalCost;
  }
}
