//Js code for teamControls page
import { useClickEvent } from "./common/useEvent.js";

const navigator = document.getElementById("prevNavigator");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(navigator, navigate);
}

function navigate() {
  window.location.href = "team.html";
}
