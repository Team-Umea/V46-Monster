//Place as much render code here as possible
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
  setTimeout(() => {
    if (parent.firstElementChild.getAttribute("spinner")) {
      renderError(parent, "Timeout error");
    }
  }, 3000);
}

function removeEl(element, delay) {
  const delayInSeconds = delay * 1000;
  setTimeout(() => {
    element.remove();
  }, delayInSeconds);
}
