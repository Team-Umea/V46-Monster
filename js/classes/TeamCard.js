import { MonsterCard } from "./MonsterCard.js";
import { ToggleIcon } from "./ToggleIcon.js";
import { CREDITS_LSK } from "../common/localStorageKeys.js";
import { load } from "../common/utilities.js";
import { renderIconWithNumber } from "../common/render.js";
import { useClickEvent } from "../common/useEvent.js";
import { imgAsBtn } from "../common/render.js";

export class TeamCard {
  constructor(team, allMonsters, buyTeamCallback, shuffleCallback, deleteTeamCallback, removeMonsterCallback) {
    this.team = team;
    this.teamName = team.getTeamName();
    this.monsters = team.getMonsters();
    this.isPaidFor = team.getPaidFor();

    this.allMonsters = allMonsters;
    this.buyTeamCallback = buyTeamCallback;
    this.shuffleCallback = shuffleCallback;
    this.deleteTeamCallback = deleteTeamCallback;
    this.removeMonsterCallback = removeMonsterCallback;

    this.linkedBtns = [];
    this.teamCost = this.calcTeamCost();
    this.teamMessage = this.teamMsg();
    this.userCredits = this.loadUserCredits();
    this.teamControlBtnContainer = document.createElement("div");

    this.teamHeaderContainerEl = null;
    this.teamBodyContainerEl = null;
    this.sellTeamEl = null;
    this.teamToggleEl = null;
  }

  teamContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "teamContainer");
    return container;
  }

  toggleTeamVisibility() {
    const teamBodyContainer = this.teamBodyContainerEl;
    const teamToggleIcon = this.teamToggleEl.getElementsByTagName("img")[0];
    const isHidden = teamBodyContainer.getAttribute("class").includes("hidden");

    if (isHidden) {
      teamBodyContainer.setAttribute("class", "teamBodyContainer");
      teamToggleIcon.setAttribute("src", "../../res/icons/upArrow.svg");
      teamToggleIcon.setAttribute("alt", "Hide team");
      teamToggleIcon.setAttribute("title", "Hide team");
    } else {
      teamBodyContainer.setAttribute("class", "teamBodyContainer hidden");
      teamToggleIcon.setAttribute("src", "../../res/icons/downArrow.svg");
      teamToggleIcon.setAttribute("alt", "Show team");
      teamToggleIcon.setAttribute("title", "ShowTeam");
    }
  }

  teamHeaderContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "teamHeaderContainer");

    this.teamHeaderContainerEl = container;

    return container;
  }

  teamSell() {
    function log() {
      console.log("Sold Team");
    }

    const teamName = this.teamName;
    const teamMessage = this.teamMessage;

    const sell = new ToggleIcon("coin", `Sell ${teamName}`, teamMessage, log);
    const sellEl = sell.getIconToggle();
    sellEl.classList.add("sellTeam", "alignLeft");

    this.sellTeamEl = sellEl;

    return sellEl;
  }

  teamHeader() {
    const header = document.createElement("h2");
    header.setAttribute("class", "teamHeader alignCenter");
    const name = this.teamName;
    header.innerText = name;
    return header;
  }

  teamToggle() {
    const toggleWrapper = document.createElement("div");
    const icon = document.createElement("img");

    toggleWrapper.setAttribute("class", "teamToggle alignRight");

    icon.setAttribute("src", "../../res/icons/upArrow.svg");
    icon.setAttribute("alt", "Hide team");
    icon.setAttribute("title", "Hide team");
    icon.setAttribute("class", "icon");

    toggleWrapper.appendChild(icon);

    this.teamToggleEl = toggleWrapper;

    const toggleTeamVisibility = this.toggleTeamVisibility.bind(this);

    useClickEvent(toggleWrapper, toggleTeamVisibility);

    return toggleWrapper;
  }

  teamBodyContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "teamBodyContainer");

    this.teamBodyContainerEl = container;

    return container;
  }

  teamMsg() {
    const message = document.createElement("p");
    message.setAttribute("class", "teamMessage");

    message.innerText = "";
    return message;
  }

  teamControls() {
    const teamControlBtnContainer = this.teamControlBtnContainer;
    teamControlBtnContainer.setAttribute("class", "teamControls");

    const teamName = this.teamName;
    const teamCost = this.teamCost;
    const isPaidFor = this.isPaidFor;
    const linkedBtns = this.linkedBtns;
    const teamMessage = this.teamMessage;
    const numMonsters = this.monsters.length;

    const showPrice = this.checkUserCredits.bind(this);
    const shuffleTeam = this.shuffleTeam.bind(this);
    const deleteTeam = this.deleteTeam.bind(this);

    const buyBtn = new ToggleIcon("cart", `Buy ${teamName} for ${teamCost} credits`, teamMessage, undefined, showPrice);
    const shuffleBtn = new ToggleIcon("shuffle", `Fill ${teamName} with 4 random monsters`, teamMessage, shuffleTeam);
    const deleteBtn = new ToggleIcon("trash", `Delete ${teamName}`, teamMessage, deleteTeam);

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

    if (!isPaidFor) {
      teamControlBtnContainer.appendChild(buyEl);
    }

    if (!isPaidFor || numMonsters !== 4) {
      teamControlBtnContainer.appendChild(shuffleEl);
    }

    teamControlBtnContainer.appendChild(deleteEl);
    return teamControlBtnContainer;
  }

  teamMonsters() {
    const monsterContainer = document.createElement("div");
    monsterContainer.setAttribute("class", "teamMonsters");

    const monsters = this.monsters;
    const isPaidFor = this.isPaidFor;
    const allMonsters = this.allMonsters;
    const linkedBtns = this.linkedBtns;
    const teamName = this.teamName;
    const teamMessage = this.teamMessage;

    monsters.forEach((monster) => {
      const monsterCard = new MonsterCard(monster, allMonsters, [], true).assembleMonsterCard();
      const monsterName = monster.name;
      const monsterID = monster.id;

      const removeMonster = this.removeMonsterCallback.bind(this, teamName, monsterID);

      const removeMonsterBtn = new ToggleIcon("x", `Remove ${monsterName} from ${teamName}`, teamMessage, removeMonster);
      linkedBtns.push(removeMonsterBtn);

      const removeMonsterBtnEl = removeMonsterBtn.getIconToggle();
      removeMonsterBtnEl.classList.add("smallIconToggle", "removeMonster");

      if (!isPaidFor) {
        monsterCard.appendChild(removeMonsterBtnEl);
      }

      monsterContainer.appendChild(monsterCard);
    });

    this.linkBtns();

    return monsterContainer;
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

  checkUserCredits() {
    const teamCost = this.teamCost;
    const teamName = this.teamName;
    const userCredits = this.userCredits;
    const numMonsters = this.monsters.length;

    // let userCredits = this.userCredits;
    // userCredits = 4000000;

    const hasEnoughCredits = userCredits >= teamCost;
    let message = "";
    let className = "";

    if (hasEnoughCredits) {
      if (numMonsters === 4) {
        message = `Total price of buying '${teamName}' is ${teamCost} credits. Your balance is ${userCredits} credits. Click checkmark to confirm`;
        className = "success";
        this.enoughCredits();
      } else {
        message = `Please fill out all 4 slots in '${teamName}' before buy`;
        className = "error";
        this.notEnoughMonster();
      }
    } else {
      message = `You do not have enough credits to buy '${teamName}'. Total cost is ${teamCost} credits but you only have ${userCredits} credits`;
      className = "error";
      this.notEnoughCredits();
    }

    this.setTeamMsg(message, className);
  }

  notEnoughMonster() {
    const toggleIcon = this.linkedBtns[0];

    const icon = toggleIcon.getIcon();
    const baseSrc = toggleIcon.getSrc();
    const baseAltTitle = toggleIcon.getAltTitle();

    const teamName = this.teamName;

    icon.setAttribute("src", "../../res/icons/ban.svg");
    icon.setAttribute("alt", `Please fill out all 4 slots in '${teamName}' before buy`);
    icon.setAttribute("title", `Please fill out all 4 slots in '${teamName}' before buy`);

    setTimeout(() => {
      icon.setAttribute("src", baseSrc);
      icon.setAttribute("alt", baseAltTitle);
      icon.setAttribute("title", baseAltTitle);
    }, 5000);
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
    const shuffleBtnEl = this.teamControlBtnContainer.children[1];

    const baseSrc = toggleIcon.getSrc();
    const baseAltTitle = toggleIcon.getAltTitle();

    const teamCost = this.teamCost;
    const teamName = this.teamName;

    let priceDisplayer = renderIconWithNumber(teamCost, "../../res/icons/diamond.svg", "");

    buyBtnEl.appendChild(priceDisplayer);

    buyBtnEl.addEventListener("click", () => {
      if (priceDisplayer) {
        this.buyTeamCallback(teamName);
        this.setTeamMsg("", "");
        buyBtnEl.remove();
        shuffleBtnEl.remove();
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

  shuffleTeam() {
    const teamName = this.teamName;
    this.shuffleCallback(teamName);
  }

  deleteTeam() {
    const deleteTeamCallback = this.deleteTeamCallback;
    const teamName = this.teamName;

    deleteTeamCallback(teamName);
  }
}
