import { save, load } from "./utilities";
import { themeKey } from "./localStorageKeys";

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  toggleTheme();
  setEventListener();
}

function setEventListener() {
  themeToggle.addEventListener("click", () => {
    toggleTheme();
  });
}

function toggleTheme() {
  const loadedTheme = load(themeKey);
  let theme = "light";
  if (loadedTheme && loadedTheme === "dark") {
    theme = "dark";
  }
  save(theme, themeKey);
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === "light") {
    body.setAttribute("class", "theme-light");
  } else {
    body.setAttribute("class", "theme-dark");
  }
}
