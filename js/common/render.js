//Place as much render code here as possible
import { getError } from "./error.js";

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

  icon.setAttribute("src", src);
  icon.setAttribute("alt", altTtile);
  icon.setAttribute("title", altTtile);

  container.appendChild(icon);
  return container;
}

export function renderIconWithNumber(value, src, altAndTitle, dir) {
  const iconContainer = document.createElement("div");
  const icon = document.createElement("img");
  const iconText = document.createElement("p");

  iconContainer.setAttribute("class", "iconContainer");

  icon.setAttribute("src", src);
  icon.setAttribute("alt", altAndTitle);
  icon.setAttribute("title", altAndTitle);
  icon.setAttribute("class", "icon");

  iconText.innerText = value;

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

function removeEl(element, delay) {
  const delayInSeconds = delay * 1000;
  setTimeout(() => {
    element.remove();
  }, delayInSeconds);
}
