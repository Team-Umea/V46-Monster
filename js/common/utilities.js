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

export function cache(key, value, ttl) {
  if ((key, value, ttl)) {
    const loaded = load(key);
    if (loaded) {
      const currentDate = new Date();
      const savedAt = loaded.savedAt;
      const ttl = loaded.ttl;

      const ttlExpired = compareWithTempDate(currentDate, savedAt, ttl);
      if (ttlExpired) {
        const dataWithTtl = { data: filteredData, savedAt: new Date(), ttl };
        save(key, dataWithTtl);
      }
    } else {
      const dataWithTtl = { data: filteredData, savedAt: new Date(), ttl };
      save(key, dataWithTtl);
    }
  }
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

export function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.log(`${key} does not exists in local storage`);
    return "";
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
