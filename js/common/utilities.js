//Place the most dynamics functions here that are independet of html elements
import {apiConfigKey} from "./localStorageKeys.js"

export async function loadEndpoints(){
  const filePath = "../../json/apiConfig.json"; 
  const loadedEndpoints = load(apiConfigKey);

  if(!loadedEndpoints){
    try{
      const response = await fetch(filePath); 
      const endpoints = await response.json(); 
      save(apiConfigKey, endpoints);
      return endpoints; 
    }catch(error){
      console.error(error);
      return null;
    }
  }
  return loadedEndpoints
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
