//Handle all error that may occur when fetch from api
import { readJSON } from "./utilities.js";

export async function getError(status, parent) {
  const filePath = "../../json/errorMessages.json";
  const messages = await readJSON(filePath);
  const errorMessageExits = status in messages;
  if (errorMessageExits) {
    const requestedMessage = messages[status];
    const parsedMessage = parseMessage(requestedMessage);
    renderErrorMesage(parsedMessage, parent);
    return parsedMessage;
  }
  return "An unexpected error occurred";
}

function parseMessage(messageAsJSON) {
  let header = "";
  let content = "";
  let stepsHeader = "";
  let step1 = "";
  let step2 = "";
  let step3 = "";
  let footer = "";
  if (messageAsJSON) {
    header = messageAsJSON.split("/HEADER/")[0];
    content = messageAsJSON.split("/CONTENT/")[1];
    stepsHeader = messageAsJSON.split("/STEPS/")[1];
    step1 = messageAsJSON.split("/STEP1/")[1];
    step2 = messageAsJSON.split("/STEP2/")[1];
    step3 = messageAsJSON.split("/STEP3/")[1];
    footer = messageAsJSON.split("/FOOTER/")[1];
  }
  return {
    header,
    content,
    stepsHeader,
    steps: [step1, step2, step3],
    footer: footer,
  };
}

function renderErrorMesage(message, parent) {
  parent.innerHTML = "";

  const container = document.createElement("div");
  const header = message.header;
  const content = message.content;
  const stepsHeader = message.stepsHeader;
  const steps = message.steps;
  const footer = message.footer;

  const headerH2 = document.createElement("h2");
  const contentH3 = document.createElement("h3");
  const stepsHeaderH4 = document.createElement("h4");
  const stepsOl = document.createElement("ol");
  const footerP = document.createElement("p");

  container.setAttribute("class", "errorContainer");
  headerH2.setAttribute("class", "errorHeader");
  contentH3.setAttribute("class", "errorContent");
  stepsHeaderH4.setAttribute("class", "errorStepsHeader");
  stepsOl.setAttribute("class", "errorSteps");
  footerP.setAttribute("class", "errorFooter");

  headerH2.innerText = header;
  contentH3.innerText = content;
  stepsHeaderH4.innerText = stepsHeader;
  footerP.innerText = footer;

  steps.forEach((advice) => {
    const adviceLi = document.createElement("li");
    adviceLi.innerText = advice;
    stepsOl.appendChild(adviceLi);
  });

  container.appendChild(headerH2);
  container.appendChild(contentH3);
  container.appendChild(stepsHeaderH4);
  container.appendChild(stepsOl);
  container.appendChild(footerP);

  parent.appendChild(container);
}
