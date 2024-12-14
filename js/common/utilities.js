//Place the most dynamics functions here that are independet of html elements
import { APICONFIG_LSK, USER_LSK, TEAMS_LSK } from "./localStorageKeys.js";
import { Team } from "../classes/Team.js";

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

export function isValidObjKey(arr, key) {
  return arr.every((item) => key in item);
}

export function extractLetters(str) {
  return str.replace(/[^a-zA-Z]/g, "");
}

export function extractNumbers(str) {
  const match = str.match(/\d+$/);
  return match ? match[0] : "";
}

export function isDigit(char) {
  return /^\d$/.test(char);
}

export function isLetter(char) {
  return /^[\p{L}]$/u.test(char);
}

export function capitalize(str) {
  return str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
}

export function findMissingDigit(target, arr) {
  const digits = new Set();

  arr.forEach((item) => {
    const match = extractLetters(item.toLowerCase()) === extractLetters(target.toLowerCase());
    if (match) {
      const number = extractNumbers(item);

      if (number !== "") {
        digits.add(Number(extractNumbers(item)));
      } else {
        digits.add(0);
      }
    }
  });

  const maxDigit = Math.max(...Array.from(digits));

  for (let i = 0; i <= maxDigit; i++) {
    if (!digits.has(i)) {
      return i;
    }
  }

  return maxDigit + 1;
}

export function generateUniqueName(arr, newName) {
  const sortedNames = [...arr, newName].sort((a, b) => Number(extractNumbers(a) - Number(extractNumbers(b)))).map((item) => item.toLowerCase());

  const isFirstInstance = !arr.map((item) => item.toLowerCase()).includes(extractLetters(newName));

  if (!isFirstInstance && sortedNames) {
    const uniqueID = findMissingDigit(newName, sortedNames);
    let name = extractLetters(newName);

    name += uniqueID;

    return {
      noneUnique: true,
      name: name,
    };
  }
  return {
    noneUnique: false,
    name: newName,
  };
}

export function formatLargeNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function redirect(path) {
  window.location.href = path;
}

export function reload() {
  location.reload(true);
}

export function sortInstances(arr) {
  const instancesOfItems = arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  const entriesArray = Object.keys(instancesOfItems).map((key) => ({
    [key]: instancesOfItems[key],
  }));

  const sortedInstances = entriesArray.sort((a, b) => {
    const countA = Object.values(a)[0];
    const countB = Object.values(b)[0];

    if (countB - countA !== 0) {
      return countB - countA;
    }

    const keyA = Object.keys(a)[0];
    const keyB = Object.keys(b)[0];
    return keyA.localeCompare(keyB);
  });

  return sortedInstances;
}

export function convertInstancesToStr(arr) {
  return sortInstances(arr).map((item) => `${Object.values(item)[0]}x ${Object.keys(item)[0]}`);
}

export function loadTeams() {
  const teams = [];
  const loadedTeams = load(TEAMS_LSK);
  const loadedUser = load(USER_LSK);

  if (loadedTeams) {
    loadedTeams.forEach((loadedTeam) => {
      teams.push(Team.fromJSON(loadedTeam));
    });
    const sortedTeams = sortTeams(teams, loadedUser.teamSort || 0);
    return sortedTeams;
  }

  return teams;
}

export function sortTeams(teams, sortOrder) {
  let sortedTeams = [];

  switch (sortOrder) {
    case 0:
      sortedTeams = [...teams].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      break;
    case 1:
      sortedTeams = [...teams].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      break;
    case 2:
      sortedTeams = [...teams].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
    case 3:
      sortedTeams = [...teams].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      break;
    case 4:
      sortedTeams = [...teams].sort((a, b) => {
        const ratingDifference = b.totalRating - a.totalRating;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 5:
      sortedTeams = [...teams].sort((a, b) => {
        const ratingDifference = a.totalRating - b.totalRating;
        const rankDifference = ratingDifference === 0 ? a.totalRank - b.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 6:
      sortedTeams = [...teams].sort((a, b) => {
        const battleDifference = b.numBattels - a.numBattels;
        const ratingDifference = battleDifference === 0 ? b.totalRating - a.totalRating : battleDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 7:
      sortedTeams = [...teams].sort((a, b) => {
        const battleDifference = a.numBattels - b.numBattels;
        const ratingDifference = battleDifference === 0 ? b.totalRating - a.totalRating : battleDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 8:
      sortedTeams = [...teams].sort((a, b) => {
        const winRateDifference = b.winRate - a.winRate;
        const ratingDifference = winRateDifference === 0 ? b.totalRating - a.totalRating : winRateDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 9:
      sortedTeams = [...teams].sort((a, b) => {
        const winRateDifference = a.winRate - b.winRate;
        const ratingDifference = winRateDifference === 0 ? b.totalRating - a.totalRating : winRateDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 10:
      sortedTeams = [...teams].sort((a, b) => {
        const priceDifference = b.teamCost - a.teamCost;
        const ratingDifference = priceDifference === 0 ? b.totalRating - a.totalRating : priceDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 11:
      sortedTeams = [...teams].sort((a, b) => {
        const priceDifference = a.teamCost - b.teamCost;
        const ratingDifference = priceDifference === 0 ? b.totalRating - a.totalRating : priceDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 12:
      sortedTeams = [...teams].sort((a, b) => {
        const isPaidForDifference = Number(b.paidFor) - Number(a.paidFor);
        const ratingDifference = isPaidForDifference === 0 ? b.totalRating - a.totalRating : isPaidForDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 13:
      sortedTeams = [...teams].sort((a, b) => {
        const isPaidForDifference = Number(a.paidFor) - Number(b.paidFor);
        const ratingDifference = isPaidForDifference === 0 ? b.totalRating - a.totalRating : isPaidForDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 14:
      sortedTeams = [...teams].sort((a, b) => {
        const numMonsterDifference = b.monsters.length - a.monsters.length;
        const ratingDifference = numMonsterDifference === 0 ? b.totalRating - a.totalRating : numMonsterDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    case 15:
      sortedTeams = [...teams].sort((a, b) => {
        const numMonsterDifference = a.monsters.length - b.monsters.length;
        const ratingDifference = numMonsterDifference === 0 ? b.totalRating - a.totalRating : numMonsterDifference;
        const rankDifference = ratingDifference === 0 ? b.totalRank - a.totalRank : ratingDifference;
        const az = rankDifference === 0 ? a.name.localeCompare(b.name) : rankDifference;
        const dateDifference = az === 0 ? a.createdAt - b.createdAt : az;
        return dateDifference;
      });
      break;
    default:
      break;
  }

  return sortedTeams;
}
