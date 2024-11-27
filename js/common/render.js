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
