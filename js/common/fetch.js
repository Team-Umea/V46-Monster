//Fetch logic to fetch from ozzodevmonsterapi.azurewebsites.net goes here
import { loadEndpoints, filterObject, save, useCachedData } from "./utilities.js";
import { getError } from "./error.js";
import { renderSpinner } from "./render.js";

async function fetchData(requestedEndpoint, apiParams, parent, key, ttl, useSpinner) {
  const endpoints = await loadEndpoints();

  // return getError(504, parent);

  if (!(requestedEndpoint in endpoints)) {
    return getError(404, parent);
  }

  if (endpoints) {
    const endpoint = endpoints[requestedEndpoint];
    const url = apiParams ? `${endpoint}?${apiParams}` : endpoint;

    try {
      if (useSpinner) {
        renderSpinner(parent);
      }

      const response = await fetch(url);
      if (!response.ok) {
        return getError(response.status, parent);
      }

      const data = await response.json();
      const filteredData = filterObject(data, "ok");

      if ((key, ttl)) {
        const dataWithTtl = { data: filteredData, savedAt: new Date(), ttl };
        save(key, dataWithTtl);
      }

      return {
        ok: data.ok,
        data: filteredData,
      };
    } catch (error) {
      return getError(504, parent);
    }
  } else {
    return getError(0, parent);
  }
}

export function serveFetchedData(requestedEndpoint, apiParams, parent, key, ttl, renderSpinner) {
  return fetchData(requestedEndpoint, apiParams, parent, key, ttl, renderSpinner)
    .then((data) => {
      if (data.ok) {
        return data.data;
      }
      return [];
    })
    .catch(() => {
      getError(0, parent);
      return [];
    });
}

export async function serveData(requestedEndpoint, apiParams, parent, key, ttl, useSpinner) {
  if (key) {
    const loaded = useCachedData(key);
    if (loaded) {
      console.log("Data is cacehed and will be loaded for endpoint: ", requestedEndpoint);
      return loaded;
    }
    console.log("Data had expired so we need to refetch data for endpoint: ", requestedEndpoint);
    const fetchedData = await serveFetchedData(requestedEndpoint, apiParams, parent, key, ttl, useSpinner);
    return fetchedData;
  }
  console.log("No key found hence data will be fetched for endpoint: ", requestedEndpoint);
  const fetchedData = await serveFetchedData(requestedEndpoint, apiParams, parent, key, ttl, useSpinner);
  return fetchedData;
}
