import { save, load } from "./utilities.js";
import { themeKey } from "./localStorageKeys.js";

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
  if (loadedTheme && loadedTheme === "light") {
    theme = "dark";
  }
  save(themeKey, theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === "light") {
    body.setAttribute("class", "theme-light");
  } else {
    body.setAttribute("class", "theme-dark");
  }
}
