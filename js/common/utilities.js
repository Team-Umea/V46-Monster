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
