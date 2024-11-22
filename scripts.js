const url = "https://monsterapi.onrender.com";
const allMonstersEndpoint = `${url}/allMonsters`;
const monsterEndpoint = `${url}/monsters`;
const freeMonstersEndpoint = `${url}/freeMonsters`;
const randomMonstersEndpoint = `${url}/randomMonsters`;
const monsterByIdEndpoint = `${url}/monsterById`;
const monstersByStrengthsEndpoint = `${url}/monstersByStrengths`;
const monstersByWeaknessEndpoint = `${url}/monstersByWeaknesses`;

let temp = "https://monsterapi.onrender.com/monsterById?id=15";

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchAllMonsters();
  fetchMonsters(5)
  fetchFreeMonsters();
  fetchMonsters(5)
  fetchMonsterById(15);
  fetchMonstersByStrengths(["speed"]);
  fetchMonstersByWeaknesses(["water", "fire"]);
}

function fetchAllMonsters() {
  fetch(allMonstersEndpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.monsters);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function fetchMonsters(num) {
  const query = `${monsterEndpoint}?num=${num}`;
  fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.monsters);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function fetchFreeMonsters() {
  fetch(freeMonstersEndpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.freeMonsters);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchRandomMonstes(num) {
  const query = `${randomMonstersEndpoint}?num=${num}`;
  fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.monsters);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function fetchMonsterById(id) {
  const query = `${monsterByIdEndpoint}?id=${id}`;
  fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.monster);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchMonstersByWeaknesses(weaknesses) {
  const queryParams = weaknesses.map((weakness) => `weaknesses=${encodeURIComponent(weakness)}`).join("&");
  const query = `${monstersByWeaknessEndpoint}?${queryParams}`;

  fetch(query)
    .then((response) => {
      if (!response.ok) {
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.monsters);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchMonstersByStrengths(strengths) {
  const queryParams = strengths.map((strength) => `strengths=${encodeURIComponent(strength)}`).join("&");
  const query = `${monstersByStrengthsEndpoint}?${queryParams}`;

  fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if(data.ok){
        console.log(data.monsters);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
