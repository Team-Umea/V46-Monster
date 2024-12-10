//Place the most dynamics functions here that are independet of html elements
import { APICONFIG_LSK } from "./localStorageKeys.js";

export async function loadEndpoints() {
  const filePath = "../../json/apiConfig.json";
  const loadedEndpoints = load(APICONFIG_LSK);

  if (!loadedEndpoints) {
    try {
      const response = await fetch(filePath);
      const endpoints = await response.json();
      save(APICONFIG_LSK, endpoints);
      return endpoints;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return loadedEndpoints;
}

export async function readJSON(path) {
  try {
    const response = await fetch(path);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  const loaded = JSON.parse(localStorage.getItem(key));

  if (loaded === null) {
    return null;
  }

  const keys = Object.keys(loaded);

  const hasSavedAtProp = keys.includes("savedAt");
  const hasTtlProp = keys.includes("ttl");

  if (hasSavedAtProp && hasTtlProp) {
    const currentDate = new Date();
    const savedAt = loaded.savedAt;
    const ttl = loaded.ttl;

    const dataIsLiving = !compareWithTempDate(currentDate, savedAt, ttl);

    if (dataIsLiving) {
      return loaded;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  }

  return loaded;
}

export function remove(key) {
  localStorage.removeItem(key);
}

export function useCachedData(key) {
  const loaded = load(key);

  if (loaded) {
    const currentDate = new Date();
    const savedAt = loaded.savedAt;
    const ttl = loaded.ttl;

    const dataIsLiving = !compareWithTempDate(currentDate, savedAt, ttl);

    if (dataIsLiving) {
      const data = loaded.data;
      return data;
    } else {
      return null;
    }
  }
}

export function filterObject(obj, unwantedProperty) {
  const data = Object.fromEntries(Object.entries(obj).filter(([key]) => key !== unwantedProperty));
  const firstKey = Object.keys(data)[0];
  const filteredObj = data[firstKey];

  return filteredObj;
}

export function compareWithTempDate(date1, date2, timeLimitInSeconds) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d2.setSeconds(d2.getSeconds() + timeLimitInSeconds);

  return d1 > d2;
}

export function changeCSSClass(styleSheeetIndex, className, properties) {
  const styleSheet = document.styleSheets[styleSheeetIndex];

  for (let i = 0; i < styleSheet.cssRules.length; i++) {
    const rule = styleSheet.cssRules[i];

    if (rule.selectorText === `.${className}`) {
      for (const [property, value] of Object.entries(properties)) {
        rule.style[property] = value;
      }
      break;
    }
  }
}

export function capitalize(str) {
  return str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
}

export function isValidObjKey(arr, key) {
  return arr.every((item) => key in item);
}

export function extractLetters(str) {
  return str.replace(/[^a-zA-Z]/g, "");
}

export function extractNumbersFromEnd(str) {
  const match = str.match(/\d+$/);
  return match ? match[0] : "";
}

export function generateUniqueName(arr, name) {
  const noneUnique = arr.filter((team) => {
    return extractLetters(team.name) === extractLetters(name);
  });
  if (noneUnique && noneUnique.length > 0) {
    const lastElement = noneUnique.length - 1;
    const sortedNames = noneUnique.sort((a, b) => Number(extractNumbersFromEnd(a.getTeamName()) - Number(extractNumbersFromEnd(b.getTeamName())))).map((team) => team.getTeamName());
    const name = sortedNames[lastElement];
    const noneUniqueLetters = extractLetters(name);
    const digits = Number(extractNumbersFromEnd(name));
    const unique = digits + 1;
    const uniqueName = noneUniqueLetters.concat(unique);
    return {
      nonUnique: true,
      name: uniqueName,
    };
  }
  return {
    nonUnique: false,
    name: name,
  };
}

export function formatLargeNumber(num) {
  // Convert the number to a string and split it into parts.
  const numString = num.toString();

  // Use a regular expression to format the number.
  const formattedString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return formattedString;
}

export function redirect(path) {
  window.location.href = path;
}

export function reload() {
  location.reload(true);
}
