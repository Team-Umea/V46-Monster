//Place as much render code here as possible
import { getError } from "./error.js";
import { formatLargeNumber } from "./utilities.js";

export function renderDataAsUl(parent, parentClass, data) {
  parent.innerHTML = "";
  if (data && data.length > 0) {
    const ul = document.createElement("ul");
    ul.setAttribute("class", parentClass);
    data.forEach((item) => {
      const li = document.createElement("li");
      li.innerText = item;
      ul.appendChild(li);
    });
    parent.appendChild(ul);
  }
}

export function renderSelect(parent, data) {
  parent.innerHTML = "";
  if (data) {
    data.forEach((item, index) => {
      const option = document.createElement("option");
      option.setAttribute("value", index);
      option.innerText = item;
      parent.appendChild(option);
    });
  }
}

export function renderError(parent, error, clasName) {
  parent.innerHTML = "";
  const p = document.createElement("p");
  p.innerText = error;
  p.setAttribute("class", clasName ? `error ${clasName}` : "error");
  removeEl(p, 3);
  parent.appendChild(p);
}

export function renderSpinner(parent) {
  parent.innerHTML = "";
  const spinner = document.createElement("div");
  spinner.setAttribute("class", "spinner");
  parent.appendChild(spinner);

  // parent.timeoutId = setTimeout(() => {
  //   if (parent.firstElementChild&&parent.firstElementChild.getAttribute("class") === "spinner" && parent.children.length === 1) {
  //     getError(504, parent);
  //     spinner.remove();
  //   }
  // }, 5000);
}

export function imgAsBtn(src, altTtile) {
  const container = document.createElement("div");
  const icon = document.createElement("img");

  container.setAttribute("title", altTtile);

  icon.setAttribute("src", `../../res/icons/${src}.svg`);
  icon.setAttribute("alt", altTtile);

  container.appendChild(icon);
  return container;
}

export function renderIconWithNumber(value, src, altAndTitle, dir) {
  const iconContainer = document.createElement("div");
  const icon = document.createElement("img");
  const iconText = document.createElement("p");

  iconContainer.setAttribute("class", "iconContainer");
  iconContainer.setAttribute("title", altAndTitle);

  icon.setAttribute("src", src);
  icon.setAttribute("alt", altAndTitle);
  icon.setAttribute("class", "icon");

  iconText.innerText = formatLargeNumber(value);

  if (!dir || dir.toLowerCase() === "left") {
    iconContainer.appendChild(icon);
    iconContainer.appendChild(iconText);
  } else {
    iconContainer.appendChild(iconText);
    iconContainer.appendChild(icon);
  }

  return iconContainer;
}

// export function toggleIcon(src, altTitle, callback) {
//   const wrapper = document.createElement("div");
//   const icon = document.createElement("img");

//   wrapper.setAttribute("role", "button");
//   wrapper.setAttribute("class", "icon-btn icon-btn");

//   if (typeof src === "string" && typeof altTitle === "string") {
//     wrapper.addEventListener("click", () => {
//       callback();
//     });

//     icon.setAttribute("src", src);
//     icon.setAttribute("alt", altTitle);
//     icon.setAttribute("title", altTitle);
//     icon.setAttribute("class", "icon");

//     wrapper.appendChild(icon);
//   } else {
//     const baseSrc = src[0];
//     const baseAltTile = altTitle[0];
//     const toggleSrc = src[1];
//     const toggleAltTitle = altTitle[1];

//     wrapper.addEventListener("click", () => {
//       const currentSrc = icon.getAttribute("src");

//       if (currentSrc.includes(baseSrc)) {
//         icon.setAttribute("src", toggleSrc);
//         icon.setAttribute("alt", toggleAltTitle);
//         icon.setAttribute("title", toggleAltTitle);
//       } else {
//         callback();
//         icon.setAttribute("src", baseSrc);
//         icon.setAttribute("alt", baseAltTile);
//         icon.setAttribute("title", baseAltTile);
//       }
//     });

//     icon.setAttribute("src", baseSrc);
//     icon.setAttribute("alt", baseAltTile);
//     icon.setAttribute("title", baseAltTile);
//     icon.setAttribute("class", "icon");

//     wrapper.appendChild(icon);
//   }

//   return wrapper;
// }

export function valueWithHeader(value, headerText) {
  const container = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");

  container.setAttribute("class", "valueWithHeader");

  h2.innerText = headerText;
  p.innerText = value;

  container.appendChild(h2);
  container.appendChild(p);

  return container;
}

export function eyeToggle(clasName, altTitleHide, altTitleShow, callbackHide, callbackShow) {
  const icon = document.createElement("img");

  icon.setAttribute("class", `${clasName} icon icon-scale`);
  icon.setAttribute("src", "../../res/icons/eyeOff.svg");
  icon.setAttribute("alt", altTitleHide);
  icon.setAttribute("title", altTitleHide);

  icon.addEventListener("click", () => {
    const isHidden = icon.getAttribute("src").includes("eyeOn");

    if (isHidden) {
      icon.setAttribute("src", "../../res/icons/eyeOff.svg");
      icon.setAttribute("alt", altTitleShow);
      icon.setAttribute("title", altTitleShow);
      if (callbackShow) {
        callbackShow();
      }
    } else {
      icon.setAttribute("src", "../../res/icons/eyeOn.svg");
      icon.setAttribute("alt", altTitleHide);
      icon.setAttribute("title", altTitleHide);
      if (callbackHide) {
        callbackHide();
      }
    }
  });
  return icon;
}

export function progressBar(pro, neu, reg) {
  const progressBarEl = document.createElement("div");
  const progressEl = document.createElement("div");
  const neutralEl = document.createElement("div");
  const regressEl = document.createElement("div");

  progressBarEl.setAttribute("class", "progressBar");
  progressEl.setAttribute("class", "progress");
  neutralEl.setAttribute("class", "neutral");
  regressEl.setAttribute("class", "regress");

  let progress = pro;
  let neutral = neu;
  let regress = reg;

  if (!pro || pro < 0) {
    progress = 0;
  }

  if (!neu || neu < 0) {
    neutral = 0;
  }

  if (!reg || reg < 0) {
    regress = 0;
  }

  let progressWidth = "0";
  let neutralWidth = "100%";
  let regressWidth = "0";

  const total = progress + neutral + regress;

  let progressShare = 0;
  let neutralShare = 100;
  let regressShare = 0;

  if (total > 0) {
    progressShare = Math.ceil((progress / total) * 100);
    neutralShare = Math.ceil((neutral / total) * 100);
    regressShare = Math.ceil((regress / total) * 100);
  }

  progressWidth = `${progressShare}%`;
  neutralWidth = `${neutralShare}%`;
  regressWidth = `${regressShare}%`;

  progressEl.style.width = progressWidth;
  neutralEl.style.width = neutralWidth;
  regressEl.style.width = regressWidth;

  progressBarEl.appendChild(progressEl);
  progressBarEl.appendChild(neutralEl);
  progressBarEl.appendChild(regressEl);

  return progressBarEl;
}

export function averageValueIcon(value, mainSrc, subSrc, altTitle) {
  const container = document.createElement("div");
  const mainIcon = document.createElement("img");
  const subIcon = document.createElement("img");
  const averageValue = document.createElement("p");

  container.setAttribute("class", "averageValueIcon");
  container.setAttribute("alt", altTitle);
  container.setAttribute("title", altTitle);

  mainIcon.setAttribute("class", "mainIcon");
  mainIcon.setAttribute("src", `../../res/icons/${mainSrc}.svg`);
  subIcon.setAttribute("class", "subIcon");
  subIcon.setAttribute("src", `../../res/icons/${subSrc}.svg`);

  averageValue.setAttribute("class", "averageValue");
  averageValue.innerText = formatLargeNumber(value);

  container.append(mainIcon, subIcon, averageValue);

  return container;
}

function removeEl(element, delay) {
  const delayInSeconds = delay * 1000;
  setTimeout(() => {
    element.remove();
  }, delayInSeconds);
}
