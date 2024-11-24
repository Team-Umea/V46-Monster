export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.log(`${key} does not exists in local storage`);
    return "";
  }
}

export function createIconContainer(className, value, src, alt, title, dir) {
  const iconContainer = document.createElement("div");
  const icon = document.createElement("img");
  const iconText = document.createElement("p");

  iconContainer.setAttribute("class", className);

  icon.setAttribute("src", src);
  icon.setAttribute("alt", alt);
  icon.setAttribute("title", title);

  iconText.innerText = value;

  if (!dir || dir.toLowerCase() === "left") {
    iconContainer.appendChild(icon);
    iconContainer.appendChild(iconText);
  } else {
    iconContainer.appendChild(iconText);
    iconContainer.appendChild(icon);
  }

  return iconContainer;
}

export function createBtnIcon(btnColor, src, altTile) {
  const btn = document.createElement("button");
  const icon = document.createElement("img");

  btn.setAttribute("class", `btn ${btnColor}`);

  icon.setAttribute("src", src);
  icon.setAttribute("alt", altTile);
  icon.setAttribute("title", altTile);
  icon.setAttribute("class", "icon icon-white");

  btn.appendChild(icon);
  return btn;
}

export function getValueInObj(obj, key) {
  return obj[key];
}

export function generateUniqueTeamName(teams, teamName) {
  console.log("Teams: ", teams);
  const noneUnique = teams.filter((team) => extractLetters(team.getTeamName()) === extractLetters(teamName));

  if (noneUnique && noneUnique.length > 0) {
    const lastElement = noneUnique.length - 1;
    const sortedNames = noneUnique.sort((a, b) => Number(extractNumbersFromEnd(a.getTeamName()) - Number(extractNumbersFromEnd(b.getTeamName())))).map((temm) => temm.getTeamName());
    const name = sortedNames[lastElement];
    const noneUniqueLetters = extractLetters(name);
    const digits = Number(extractNumbersFromEnd(name));
    const unique = digits + 1;
    const uniqueName = noneUniqueLetters.concat(unique);
    return {
      unique: false,
      name: uniqueName,
    };
  }

  return {
    unique: true,
    name: teamName,
  };
}

export function extractLetters(str) {
  return str.replace(/[^a-zA-Z]/g, "");
}

export function extractNumbersFromEnd(str) {
  const match = str.match(/\d+$/);
  return match ? match[0] : "";
}
