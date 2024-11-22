// const url = "https://monsterapi.onrender.com";
// const allMonstersEndpoint = `${url}/allMonsters`;
// const monsterEndpoint = `${url}/monsters`;
// const freeMonstersEndpoint = `${url}/freeMonsters`;
// const randomMonstersEndpoint = `${url}/randomMonsters`;
// const monsterByIdEndpoint = `${url}/monsterById`;
// const monstersByStrengthsEndpoint = `${url}/monstersByStrengths`;
// const monstersByWeaknessEndpoint = `${url}/monstersByWeaknesses`;

// let temp = "https://monsterapi.onrender.com/monsterById?id=15";

const apiConfigKey = "apiconfigure"

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchEndpoints();
}

function fetchEndpoints() {
  const loadApiEndpoints = load(apiConfigKey);

  if(!loadApiEndpoints){
    const path = "apiConfig.json"
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(endpoints => {
          save(apiConfigKey, endpoints); 
          console.log("Endpoints fetched from apiConfig.json: ", endpoints)

          fetchAllMonsters(endpoints.allMonstersEndpoint);
          fetchMonsters(endpoints.monsterEndpoint,5)
          fetchFreeMonsters(endpoints.freeMonstersEndpoint);
          fetchRandomMonstes(endpoints.randomMonstersEndpoint,5)
          fetchMonsterById(endpoints.monsterByIdEndpoint,15);
          fetchMonstersByStrengths(endpoints.monstersByStrengthsEndpoint,["speed"]);
          fetchMonstersByWeaknesses(endpoints.monstersByWeaknessEndpoint,["water", "fire"]);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
  }else{
    const endpoints = load(apiConfigKey); 
    console.log("Endpoints loaded: ", endpoints);

    fetchAllMonsters(endpoints.allMonstersEndpoint);
    fetchMonsters(endpoints.monsterEndpoint,5)
    fetchFreeMonsters(endpoints.freeMonstersEndpoint);
    fetchRandomMonstes(endpoints.randomMonstersEndpoint,5)
    fetchMonsterById(endpoints.monsterByIdEndpoint,15);
    fetchMonstersByStrengths(endpoints.monstersByStrengthsEndpoint,["speed"]);
    fetchMonstersByWeaknesses(endpoints.monstersByWeaknessEndpoint,["water", "fire"]);
  }
}

function fetchAllMonsters(endpoint) {
  fetch(endpoint)
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

function fetchMonsters(endpoint,num) {
  const query = `${endpoint}?num=${num}`;
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

function fetchFreeMonsters(endpoint) {
  fetch(endpoint)
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

function fetchRandomMonstes(endpoint,num) {
  const query = `${endpoint}?num=${num}`;
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

function fetchMonsterById(endpoint,id) {
  const query = `${endpoint}?id=${id}`;
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

function fetchMonstersByWeaknesses(endpoint,weaknesses) {
  const queryParams = weaknesses.map((weakness) => `weaknesses=${encodeURIComponent(weakness)}`).join("&");
  const query = `${endpoint}?${queryParams}`;

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

function fetchMonstersByStrengths(endpoint,strengths) {
  const queryParams = strengths.map((strength) => `strengths=${encodeURIComponent(strength)}`).join("&");
  const query = `${endpoint}?${queryParams}`;

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

function save(key,value){
  localStorage.setItem(key,JSON.stringify(value));
}

function load(key){
  try{
    return JSON.parse(localStorage.getItem(key))
  }catch(error){
    console.log(`${key} does not exists in local storage`)
    return "";
  }
}
