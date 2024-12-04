export class ToggleIcon {
  constructor(src, altTitle, message, confirmCallback, baseCallback) {
    this.iconFolder = "../../res/icons/";
    this.checkMark = `${this.iconFolder}check.svg`;
    this.src = `${this.iconFolder}${src}.svg`;
    this.altTitle = altTitle;
    this.message = message;
    this.confirmCallback = confirmCallback;
    this.baseCallback = baseCallback;
    this.linkedToggleIcons = [];
    this.icon = document.createElement("img");
    this.wrapper = document.createElement("div");
  }

  getIconToggle() {
    const wrapper = this.wrapper;
    const icon = this.icon;

    const checkMark = this.checkMark;
    const baseSrc = this.src;
    const baseAltTitle = this.altTitle;
    const confirmCallback = this.confirmCallback;
    const baseCallback = this.baseCallback;
    const toggleAltTitle = "Click to confirm";

    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("class", "icon-btn icon-btn");
    wrapper.setAttribute("title", baseAltTitle);

    icon.setAttribute("src", baseSrc);
    icon.setAttribute("alt", baseAltTitle);
    icon.setAttribute("class", "icon");

    wrapper.addEventListener("click", () => {
      const currentSrc = icon.getAttribute("src");
      this.resetLinkedToggleIcons();

      if (!currentSrc.includes("check")) {
        icon.setAttribute("src", checkMark);
        icon.setAttribute("alt", toggleAltTitle);
        icon.setAttribute("title", toggleAltTitle);

        if (!baseCallback) {
          let timeoutId;

          const updateAttributes = () => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
              icon.setAttribute("src", baseSrc);
              icon.setAttribute("alt", baseAltTitle);
              icon.setAttribute("title", baseAltTitle);
            }, 3000);
          };
          updateAttributes();
        } else {
          baseCallback();
        }
      } else {
        if (confirmCallback) {
          confirmCallback();
        }

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
    const message = this.message;

    if (message) {
      message.innerText = "";
    }

    if (linkedToggleIcons && linkedToggleIcons.length) {
      linkedToggleIcons.forEach((toggleIcon) => {
        const baseSrc = toggleIcon.getSrc();
        const baseAltTitle = toggleIcon.getAltTitle();
        const icon = toggleIcon.getIcon();

        const children = toggleIcon.wrapper.children;

        for (let i = 1; i < children.length; i++) {
          const child = children[i];
          child.remove();
        }

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

  getSrc() {
    return this.src;
  }

  getAltTitle() {
    return this.altTitle;
  }

  getIcon() {
    return this.icon;
  }
}
