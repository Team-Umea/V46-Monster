//Fetch logic to fetch from ozzodevmonsterapi.azurewebsites.net goes here
import { loadEndpoints, filterObject } from "./utilities.js";
import { getError } from "./error.js";
import { renderSpinner } from "./render.js";

export async function fetchFromApi(requestedEndpoint, apiParams, parent) {
  const endpoints = await loadEndpoints();

  if (!(requestedEndpoint in endpoints)) {
    getError(404, parent);
  }

  if (endpoints) {
    const endpoint = endpoints[requestedEndpoint];
    const url = apiParams ? `${endpoint}?${apiParams}` : endpoint;

    try {
      renderSpinner(parent);
      const response = await fetch(url);
      if (!response.ok) {
        return getError(response.status, parent);
      }

      const data = await response.json();

      return {
        ok: data.ok,
        data: filterObject(data, "ok"),
      };
    } catch (error) {
      return getError(504, parent);
    }
  } else {
    return getError(0, parent);
  }
}
