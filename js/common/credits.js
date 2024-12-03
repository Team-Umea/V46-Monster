//Js code för user credits
import { CREDITS_LSK } from "./localStorageKeys.js";
import { renderIconWithNumber } from "./render.js";
import { load, save } from "./utilities.js";

const startCredits = 1000000;

let credits = load(CREDITS_LSK) || startCredits;

const headerControls = document.getElementById("headerControls");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadCredits();
}

function loadCredits() {
  if (CREDITS_LSK) {
    const loadedCredits = load(CREDITS_LSK);
    if (loadedCredits) {
      credits = loadedCredits;
    } else {
      credits = startCredits;
      save(CREDITS_LSK, credits);
    }
  } else {
    credits = startCredits;
    save(CREDITS_LSK, credits);
  }
  renderCredits();
}

function updateCredits(usedCredits) {
  credits -= usedCredits;
  save(CREDITS_LSK, credits);
  renderCredits();
}

function renderCredits() {
  const creditsIconContainer = renderIconWithNumber(credits, "../../res/icons/diamond.svg", "Your credits");

  const prevCreditsIconContainer = headerControls.children[1];

  if (prevCreditsIconContainer) {
    headerControls.children[1].remove();
  }

  headerControls.appendChild(creditsIconContainer);
}
