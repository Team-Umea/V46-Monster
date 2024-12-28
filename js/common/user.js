import { USER_LSK } from "./localStorageKeys.js";
import { load, save } from "./utilities.js";
import { renderIconWithNumber } from "./render.js";

export let user;

const newUser = {
  credits: 1000000,
  xp: 0,
  rank: 10,
  monsterSort: 0,
  teamSort: 0,
  monsterPortalVisible: false,
  teamPortalVisible: true,
};

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadUser();
}

function loadUser() {
  const loaded = load(USER_LSK);

  if (loaded) {
    user = loaded;
  } else {
    user = newUser;
  }
  save(USER_LSK, user);

  renderCredits(user.credits);
}

export function updateUser(property, value) {
  if (property in user) {
    user[property] = value;
    save(USER_LSK, user);
    if (property === "credits") {
      renderCredits(value);
    }
  }
}

export function renderCredits(credits) {
  const userCreditsContainer = document.getElementById("headerControls");
  const creditsIconContainer = renderIconWithNumber(credits, "../../res/icons/diamond.svg", "Your credits");

  creditsIconContainer.classList.add("userCredits");

  Array.from(userCreditsContainer.children).forEach((child) => {
    if (child.children.length === 2) {
      child.remove();
    }
  });

  userCreditsContainer.appendChild(creditsIconContainer);
}
