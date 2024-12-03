import { MonsterCard } from "./MonsterCard.js";
import { ToggleIcon } from "./ToggleIcon.js";
import { CREDITS_LSK } from "../common/localStorageKeys.js";
import { load } from "../common/utilities.js";
import { renderIconWithNumber } from "../common/render.js";

export class TeamCard {
  constructor(teamName, monsters, allMonsters) {
    this.teamName = teamName;
    this.monsters = monsters;
    this.allMonsters = allMonsters;
    this.linkedBtns = [];
    this.teamCost = this.calcTeamCost();
    this.teamMessage = this.teamMsg();
    this.userCredits = this.loadUserCredits();
    this.teamControlBtnContainer = document.createElement("div");
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

  teamMsg() {
    const message = document.createElement("p");
    message.setAttribute("class", "teamMessage");

    message.innerText = "";
    return message;
  }

  getTeamMsg() {
    return this.teamMessage;
  }

  setTeamMsg(text, className) {
    const teamMessage = this.teamMessage;

    if (text !== undefined && text !== null) {
      teamMessage.setAttribute("class", `teamMessage ${className}`);
      teamMessage.innerText = text;

      setTimeout(() => {
        teamMessage.setAttribute("class", "teamMessage");
        teamMessage.innerText = "";
      }, 5000);
    }
  }

  checkUserCredits() {
    const teamCost = this.teamCost;
    const teamName = this.teamName;
    // const userCredits = this.userCredits;

    let userCredits = this.userCredits;
    userCredits = 4000000;

    const hasEnoughCredits = userCredits >= teamCost;
    let message = "";
    let className = "";

    if (hasEnoughCredits) {
      message = `Total price of buying '${teamName}' is ${teamCost} credits. Your balance is ${userCredits} credits. Click checkmark to confirm`;
      className = "success";
      this.enoughCredits();
    } else {
      message = `You do not have enough credits to buy '${teamName}'. Total cost is ${teamCost} credits but you only have ${userCredits} credits`;
      className = "error";
      this.notEnoughCredits();
    }

    this.setTeamMsg(message, className);
  }

  notEnoughCredits() {
    const toggleIcon = this.linkedBtns[0];

    const icon = toggleIcon.getIcon();
    const baseSrc = toggleIcon.getSrc();
    const baseAltTitle = toggleIcon.getAltTitle();

    const teamName = this.teamName;

    icon.setAttribute("src", "../../res/icons/ban.svg");
    icon.setAttribute("alt", `You don't have enough credits to buy ${teamName}`);
    icon.setAttribute("title", `You don't have enough credits to buy ${teamName}`);

    setTimeout(() => {
      icon.setAttribute("src", baseSrc);
      icon.setAttribute("alt", baseAltTitle);
      icon.setAttribute("title", baseAltTitle);
    }, 5000);
  }

  enoughCredits() {
    const toggleIcon = this.linkedBtns[0];
    const icon = toggleIcon.getIcon();

    const buyBtnEl = this.teamControlBtnContainer.children[0];

    const baseSrc = toggleIcon.getSrc();
    const baseAltTitle = toggleIcon.getAltTitle();

    const teamCost = this.teamCost;

    let priceDisplayer = renderIconWithNumber(teamCost, "../../res/icons/diamond.svg", "");

    buyBtnEl.appendChild(priceDisplayer);

    buyBtnEl.addEventListener("click", () => {
      if (priceDisplayer) {
        this.setTeamMsg("", "");
        buyBtnEl.remove();
      }
    });

    setTimeout(() => {
      priceDisplayer.remove();
      priceDisplayer = null;

      icon.setAttribute("src", baseSrc);
      icon.setAttribute("alt", baseAltTitle);
      icon.setAttribute("title", baseAltTitle);
    }, 5000);
  }

  teamControls() {
    const teamControlBtnContainer = this.teamControlBtnContainer;
    teamControlBtnContainer.setAttribute("class", "teamControls");

    function log() {
      console.log("Clicked");
    }

    const teamName = this.teamName;
    const teamCost = this.teamCost;
    const linkedBtns = this.linkedBtns;
    const teamMessage = this.teamMessage;

    const showPrice = this.checkUserCredits.bind(this);

    const buyBtn = new ToggleIcon("cart", `Buy ${teamName} for ${teamCost} credits`, teamMessage, undefined, showPrice);
    const shuffleBtn = new ToggleIcon("shuffle", `Fill ${teamName} with 4 random monsters`, teamMessage, log);
    const deleteBtn = new ToggleIcon("trash", `Delete ${teamName}`, teamMessage, log);

    linkedBtns.push(buyBtn);
    linkedBtns.push(shuffleBtn);
    linkedBtns.push(deleteBtn);

    this.linkBtns();

    const buyEl = buyBtn.getIconToggle();
    const shuffleEl = shuffleBtn.getIconToggle();
    const deleteEl = deleteBtn.getIconToggle();

    buyEl.classList.add("alignLeft");
    shuffleEl.classList.add("alignCenter");
    deleteEl.classList.add("alignRight");

    teamControlBtnContainer.appendChild(buyEl);
    teamControlBtnContainer.appendChild(shuffleEl);
    teamControlBtnContainer.appendChild(deleteEl);
    return teamControlBtnContainer;
  }

  teamMonsters() {
    const monsterContainer = document.createElement("div");
    monsterContainer.setAttribute("class", "teamMonsters");

    const monsters = this.monsters;
    const allMonsters = this.allMonsters;
    const linkedBtns = this.linkedBtns;
    const teamName = this.teamName;
    const teamMessage = this.teamMessage;

    monsters.forEach((monster) => {
      const monsterCard = new MonsterCard(monster, allMonsters, [], true).assembleMonsterCard();
      const monsterName = monster.name;

      function log() {
        console.log("Clicked");
      }

      const removeMonsterBtn = new ToggleIcon("x", `Remove ${monsterName} from ${teamName}`, teamMessage, log);
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

  loadUserCredits() {
    return load(CREDITS_LSK);
  }
}
