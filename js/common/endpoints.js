//Fetch logic to fetch from ozzodevmonsterapi.azurewebsites.net goes here
import { loadEndpoints } from "./utilities.js";

fetchFromApi("/temp", "monsters", alertStatus);

export async function fetchFromApi(requestedEndpoint, requestedData, callback) {
  const endpoints = await loadEndpoints();

  if (endpoints && requestedEndpoint in endpoints) {
    const endpoint = endpoints[requestedEndpoint];
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        return {
          message: callback(`HTTP error! status: ${response.status}`),
          hasError: true,
        };
      }

      const data = await response.json();

      if (!data.ok) {
        return {
          message: callback("The server encountered an unexpected condition."),
          hasError: true,
        };
      }

      if (!(requestedData in data)) {
        return {
          message: callback("Requested data not found."),
          hasError: true,
        };
      }
      return {
        data: data[requestedData],
        hasError: false,
      };
    } catch (error) {
      return {
        message: callback(`Network error: ${error.message}`),
        hasError: true,
      };
    }
  } else {
    return {
      message: callback("No endpoints found or invalid endpoint requested"),
      hasError: true,
    };
  }
}

function alertStatus(message) {
  console.error(message);
  return message;
}
