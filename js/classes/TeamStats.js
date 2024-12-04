import { useClickEvent } from "../common/useEvent.js";

export class TeamStat {
  constructor(team, updateTeamCallback) {
    this.team = team;

    this.teamName = team.getTeamName();
    this.totalRating = this.calcTeamRating();
    this.teamBodyVisible = team.getTeamBodyVisible();

    this.updateTeamCallback = updateTeamCallback;

    this.headerContainerEl = null;
    this.bodyContainerEl = null;
    this.toggleEl = null;
  }

  container() {
    const container = document.createElement("li");
    container.setAttribute("class", "teamStatContainer");
    return container;
  }

  headerContainer() {
    const headerContainerEl = document.createElement("div");
    headerContainerEl.setAttribute("class", "teamStatHeaderContainer");

    this.headerContainerEl = headerContainerEl;
    return this.headerContainerEl;
  }

  toggle() {
    const toggle = document.createElement("img");
    toggle.setAttribute("class", "teamStatToggle icon alignRight");

    const teamName = this.teamName;

    toggle.setAttribute("src", "../../res/icons/downArrow.svg");
    toggle.setAttribute("alt", `Show stats for '${teamName}'`);
    toggle.setAttribute("title", `Show stats for '${teamName}'`);

    this.toggleEl = toggle;

    const toggleStats = this.toggleStats.bind(this);

    useClickEvent(toggle, toggleStats);

    return toggle;
  }

  header() {
    const header = document.createElement("h2");
    header.setAttribute("class", "teamStatHeader alignCenter");

    const name = this.teamName;

    header.innerText = name;

    return header;
  }

  bodyContainer() {
    const bodyContainerEl = document.createElement("div");
    bodyContainerEl.setAttribute("class", "teamStatBodyContainer");

    const teamBodyVisible = this.teamBodyVisible;

    this.bodyContainerEl = bodyContainerEl;

    if (teamBodyVisible) {
      this.showStats();
    } else {
      this.hideStats();
    }

    return this.bodyContainerEl;
  }

  teamRating() {
    const rating = document.createElement("p");
    rating.setAttribute("class", "teamRating");

    const totalRating = this.totalRating;
    rating.innerText = totalRating;

    return rating;
  }

  toggleStats() {
    const toggle = this.toggleEl;
    const src = toggle.getAttribute("src");
    const isExtended = src.includes("upArrow");

    if (isExtended) {
      this.hideStats();
    } else {
      this.showStats();
    }

    this.updateTeamCallback();
  }

  showStats() {
    const toggle = this.toggleEl;
    const bodyContainer = this.bodyContainerEl;
    const team = this.team;
    const teamName = this.teamName;

    team.setTeamBodyVisible(true);

    toggle.setAttribute("src", "../../res/icons/upArrow.svg");
    toggle.setAttribute("alt", `Hide stats for '${teamName}'`);
    toggle.setAttribute("title", `Hide stats for '${teamName}'`);

    bodyContainer.setAttribute("class", "teamStatBodyContainer");
  }

  hideStats() {
    const toggle = this.toggleEl;
    const bodyContainer = this.bodyContainerEl;
    const team = this.team;
    const teamName = this.teamName;

    team.setTeamBodyVisible(false);

    toggle.setAttribute("src", "../../res/icons/downArrow.svg");
    toggle.setAttribute("alt", `Show stats for '${teamName}'`);
    toggle.setAttribute("title", `Show stats for '${teamName}'`);

    bodyContainer.setAttribute("class", "teamStatBodyContainer hidden");
  }

  calcTeamRating() {
    const team = this.team;
    const monsters = team.getMonsters();
    const rating = monsters.reduce((acc, curr) => acc + curr.health + curr.damage, 0);
    return rating;
  }
}
