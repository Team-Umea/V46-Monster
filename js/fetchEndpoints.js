export function fetchAllMonsters(endpoint) {
  return fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.monsters;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

export function fetchMonsters(endpoint, num) {
  const query = `${endpoint}?num=${num}`;
  return fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.monsters;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

export function fetchFreeMonsters(endpoint) {
  return fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.freeMonsters;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function fetchRandomMonsters(endpoint, num) {
  const query = `${endpoint}?num=${num}`;
  return fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.monsters;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

export function fetchMonsterById(endpoint, id) {
  const query = `${endpoint}?id=${id}`;
  return fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.monster;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function fetchMonstersByWeaknesses(endpoint, weaknesses) {
  const queryParams = weaknesses.map((weakness) => `weaknesses=${encodeURIComponent(weakness)}`).join("&");
  const query = `${endpoint}?${queryParams}`;

  return fetch(query)
    .then((response) => {
      if (!response.ok) {
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.monsters;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function fetchMonstersByStrengths(endpoint, strengths) {
  const queryParams = strengths.map((strength) => `strengths=${encodeURIComponent(strength)}`).join("&");
  const query = `${endpoint}?${queryParams}`;

  return fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.ok) {
        return data.monsters;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
