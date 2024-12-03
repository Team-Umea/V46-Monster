export class ToggleIcon {
  constructor(src, altTitle, callback) {
    this.iconFolder = "../../res/icons/";
    this.checkMark = `${this.iconFolder}check.svg`;
    this.src = `${this.iconFolder}${src}.svg`;
    this.altTitle = altTitle;
    this.callback = callback;
    this.linkedToggleIcons = [];
    this.icon = null;
  }

  getIconToggle() {
    const wrapper = document.createElement("div");
    const icon = document.createElement("img");
    this.icon = icon;

    const checkMark = this.checkMark;
    const baseSrc = this.src;
    const baseAltTitle = this.altTitle;
    const callback = this.callback;
    const toggleAltTitle = "Click to confirm";

    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("class", "icon-btn icon-btn");

    icon.setAttribute("src", baseSrc);
    icon.setAttribute("alt", baseAltTitle);
    icon.setAttribute("title", baseAltTitle);
    icon.setAttribute("class", "icon");

    wrapper.addEventListener("click", () => {
      const currentSrc = icon.getAttribute("src");
      this.resetLinkedToggleIcons();

      if (!currentSrc.includes("check")) {
        icon.setAttribute("src", checkMark);
        icon.setAttribute("alt", toggleAltTitle);
        icon.setAttribute("title", toggleAltTitle);
      } else {
        callback();
        icon.setAttribute("src", baseSrc);
        icon.setAttribute("alt", baseAltTitle);
        icon.setAttribute("title", baseAltTitle);
      }
    });

    wrapper.appendChild(icon);
    return wrapper;
  }

  resetLinkedToggleIcons() {
    const linkedToggleIcons = this.linkedToggleIcons;
    if (linkedToggleIcons && linkedToggleIcons.length) {
      linkedToggleIcons.forEach((toggleIcon) => {
        const baseSrc = toggleIcon.getBaseSrc();
        const baseAltTitle = toggleIcon.getBaseAltTitle();
        const icon = toggleIcon.getIcon();

        if (icon) {
          icon.setAttribute("src", baseSrc);
          icon.setAttribute("alt", baseAltTitle);
          icon.setAttribute("title", baseAltTitle);
        }
      });
    }
  }

  setLinkedToggleIcons(linkedToggleIcons) {
    this.linkedToggleIcons = linkedToggleIcons;
  }

  addLinkedToggleIcons(linkedToggleIcon) {
    this.linkedToggleIcons.push(linkedToggleIcon);
  }

  getBaseSrc() {
    return this.src;
  }

  getBaseAltTitle() {
    return this.altTitle;
  }

  getIcon() {
    return this.icon;
  }
}
