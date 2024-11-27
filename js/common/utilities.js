//Place the most dynamics functions here that are independet of html elements
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
