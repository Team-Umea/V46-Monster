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
  if (theme === "light") {
    themeToggle.setAttribute("src", "../../res/icons/moon.svg");
    themeToggle.setAttribute("alt", "Swith to dark mode");
    themeToggle.setAttribute("title", "Swith to dark mode");
    themeToggle.setAttribute("class", "icon icon-scale");
  } else {
    themeToggle.setAttribute("src", "../../res/icons/sun.svg");
    themeToggle.setAttribute("alt", "Swith to light mode");
    themeToggle.setAttribute("title", "Swith to light mode");
    themeToggle.setAttribute("class", "icon icon-scale icon-white");
  }
}
