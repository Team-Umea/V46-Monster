import { useClickEvent } from "../common/useEvent.js";

export class TeamStat {
  constructor(team) {
    this.team = team;

    this.teamName = team.getTeamName();

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

    this.bodyContainerEl = bodyContainerEl;
    return this.bodyContainerEl;
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
  }

  showStats() {
    const toggle = this.toggleEl;
    const bodyContainer = this.bodyContainerEl;
    const teamName = this.teamName;

    toggle.setAttribute("src", "../../res/icons/upArrow.svg");
    toggle.setAttribute("alt", `Hide stats for '${teamName}'`);
    toggle.setAttribute("title", `Hide stats for '${teamName}'`);

    bodyContainer.setAttribute("class", "teamStatBodyContainer");
  }

  hideStats() {
    const toggle = this.toggleEl;
    const bodyContainer = this.bodyContainerEl;
    const teamName = this.teamName;

    toggle.setAttribute("src", "../../res/icons/downArrow.svg");
    toggle.setAttribute("alt", `Show stats for '${teamName}'`);
    toggle.setAttribute("title", `Show stats for '${teamName}'`);

    bodyContainer.setAttribute("class", "teamStatBodyContainer hidden");
  }
}
