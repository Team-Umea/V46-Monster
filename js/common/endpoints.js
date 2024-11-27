//Fetch logic to fetch from ozzodevmonsterapi.azurewebsites.net goes here
import { loadEndpoints, filterObject } from "./utilities.js";

export async function fetchFromApi(requestedEndpoint, apiParams) {
  const endpoints = await loadEndpoints();

  if (apiParams && typeof apiParams !== "string") {
    return {
      message: alertStatus("Invalid parameters inputed, must be one string"),
      hasError: true,
    };
  }

  if (endpoints && requestedEndpoint in endpoints) {
    const endpoint = endpoints[requestedEndpoint];
    const url = apiParams ? `${endpoint}?${apiParams}` : endpoint;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          message: alertStatus(`HTTP error! status: ${response.status}`),
          hasError: true,
        };
      }

      const data = await response.json();

      if (!data.ok) {
        return {
          message: alertStatus("The server encountered an unexpected condition."),
          hasError: true,
        };
      }

      return {
        data: filterObject(data, "ok"),
        hasError: false,
      };
    } catch (error) {
      return {
        message: alertStatus(`Network error: ${error.message}`),
        hasError: true,
      };
    }
  } else {
    return {
      message: alertStatus("No endpoints found or invalid endpoint requested"),
      hasError: true,
    };
  }
}

function alertStatus(message) {
  console.error(message);
  return message;
}
