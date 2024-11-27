import { save, load } from "./utilities.js";
import { themeKey } from "./localStorageKeys.js";

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  const loadedTheme = load(themeKey);
  applyTheme(loadedTheme || "light");
  setEventListener();
}

function setEventListener() {
  themeToggle.addEventListener("click", () => {
    toggleTheme();
  });
}

function toggleTheme() {
  const currentTheme = load(themeKey) || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  save(themeKey, newTheme);
  applyTheme(newTheme);
}

function applyTheme(theme) {
  body.setAttribute("class", `theme-${theme}`);
}
