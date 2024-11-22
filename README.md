# Monster API Documentation

This is the API for managing monsters. The API provides several endpoints to retrieve and filter monster data.
The API is live on this domain https://monsterapi.onrender.com

## Base URL

## Endpoints

### 1. Get All Monsters

- **Endpoint**: `/allMonsters`
- **Method**: `GET`
- **Description**: Retrieve a list of all monsters.
- **Response**:
  - **200 OK**: Returns a list of monsters.
    ```json
    {
      "ok": true,
      "monsters": [
        { "id": 1, "name": "Shadow Stalker", ... },
        { "id": 2, "name": "Water Wraith", ... }
      ]
    }
    ```
  - **500 Internal Server Error**: If there is an issue loading monsters.

### 2. Get Free Monsters

- **Endpoint**: `/freeMonsters`
- **Method**: `GET`
- **Description**: Retrieve a list of monsters that are free (price = 0).
- **Response**:
  - **200 OK**: Returns a list of free monsters.
    ```json
    {
      "ok": true,
      "freeMonsters": [
        { "id": 7, "name": "Venomous Serpent", ... },
        ...
      ]
    }
    ```
  - **500 Internal Server Error**: If there is an issue loading monsters.

### 3. Get Monster by ID

- **Endpoint**: `/monsterById`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (required): The ID of the monster to retrieve.
- **Description**: Retrieve a monster by its ID.
- **Response**:
  - **200 OK**: Returns the monster details.
    ```json
    {
      "ok": true,
      "monster": { "id": 1, "name": "Shadow Stalker", ... }
    }
    ```
  - **400 Bad Request**: If the `id` parameter is missing or invalid.
    ```json
    {
      "ok": false,
      "message": "Id parameter missing or invalid"
    }
    ```
  - **404 Not Found**: If no monster is found with the given ID.
    ```json
    {
      "ok": false,
      "message": "Monster not found"
    }
    ```

### 4. Get Monsters by Strengths

- **Endpoint**: `/monstersByStrengths`
- **Method**: `GET`
- **Query Parameters**:
  - `strengths` (required): A strength or an array of strengths to filter monsters.
- **Description**: Retrieve monsters that possess the specified strengths.
- **Response**:
  - **200 OK**: Returns a list of monsters with the specified strengths.
    ```json
    {
      "ok": true,
      "monsters": [
        { "id": 1, "name": "Shadow Stalker", ... },
        ...
      ]
    }
    ```
  - **400 Bad Request**: If the `strengths` parameter is missing or invalid.
    ```json
    {
      "ok": false,
      "message": "Strengths parameter missing or invalid"
    }
    ```

### 5. Get Monsters by Weaknesses

- **Endpoint**: `/monstersByWeaknesses`
- **Method**: `GET`
- **Query Parameters**:
  - `weaknesses` (required): A weakness or an array of weaknesses to filter monsters.
- **Description**: Retrieve monsters that have the specified weaknesses.
- **Response**:
  - **200 OK**: Returns a list of monsters with the specified weaknesses.
    ```json
    {
      "ok": true,
      "monsters": [
        { "id": 3, "name": "Fire Imp", ... },
        ...
      ]
    }
    ```
  - **400 Bad Request**: If the `weaknesses` parameter is missing or invalid.
    ```json
    {
      "ok": false,
      "message": "Weaknesses parameter missing or invalid"
    }
    ```

### 6. Get Random Monsters

- **Endpoint**: `/randomMonsters`
- **Method**: `GET`
- **Query Parameters**:
  - `num` (optional): The number of random monsters to retrieve.
- **Description**: Retrieve a specified number of random monsters.
- **Response**:
  - **200 OK**: Returns a list of random monsters.
    ```json
    {
      "ok": true,
      "monsters": [
        { "id": 5, "name": "Fire Dragon", ... },
        { "id": 2, "name": "Ice Golem", ... }
      ]
    }
    ```
  - **400 Bad Request**: If the `num` parameter is missing or invalid.
    ```json
    {
      "ok": false,
      "message": "Num parameter missing or invalid"
    }
    ```

### 7. Health Check

- **Endpoint**: `/health`
- **Method**: `GET`
- **Description**: Check the health status of the server.
- **Response**:
  - **200 OK**: Returns a simple message indicating the server is healthy.
    ```text
    Server is healthy
    ```

## Notes

- All endpoints return JSON responses.
- Ensure that the parameters are correctly formatted when making requests.
- Use tools like Postman or cURL to test the API endpoints.