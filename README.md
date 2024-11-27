Monster API Documentation
This is the API for managing monsters. The API provides several endpoints to retrieve and filter monster data. The API is live on this domain: [https://ozzodevmonsterapi.azurewebsites.net/]

Base URL:https://ozzodevmonsterapi.azurewebsites.net/
Endpoints

1. Get All Monsters
   Endpoint: /allMonsters
   Method: GET
   Description: Retrieve a list of all monsters.
   Response:
   200 OK: Returns a list of monsters.
   json

{
"ok": true,
"monsters": [
{ "id": 1, "name": "Shadow Stalker", ... },
{ "id": 2, "name": "Water Wraith", ... }
]
}
500 Internal Server Error: If there is an issue loading monsters.

2. Get Specified Number of Monsters
   Endpoint: /monsters
   Method: GET
   Query Parameters:
   num (required): The number of monsters to retrieve (positive integer).
   Description: Retrieve a specified number of monsters.
   Response:
   200 OK: Returns a list of specified monsters.
   json

{
"ok": true,
"monsters": [
{ "id": 1, "name": "Shadow Stalker", ... },
...
]
}
400 Bad Request: If the num parameter is missing or invalid.
json

{
"ok": false,
"message": "Num parameter missing or invalid"
}

3. Get Free Monsters
   Endpoint: /freeMonsters
   Method: GET
   Description: Retrieve a list of monsters that are free (price = 0).
   Response:
   200 OK: Returns a list of free monsters.
   json

{
"ok": true,
"freeMonsters": [
{ "id": 7, "name": "Venomous Serpent", ... },
...
]
}
500 Internal Server Error: If there is an issue loading monsters.

4. Get Monster by ID
   Endpoint: /monsterById
   Method: GET
   Query Parameters:
   id (required): The ID of the monster to retrieve.
   Description: Retrieve a monster by its ID.
   Response:
   200 OK: Returns the monster details.
   json

{
"ok": true,
"monster": { "id": 1, "name": "Shadow Stalker", ... }
}
400 Bad Request: If the id parameter is missing or invalid.
json

{
"ok": false,
"message": "Id parameter missing or invalid"
}
404 Not Found: If no monster is found with the given ID.
json

{
"ok": false,
"message": "Monster not found"
}

5. Get List of Elements
   Endpoint: /elements
   Method: GET
   Description: Retrieve a list of elements with their names and ratings.
   Response:
   200 OK: Returns a list of elements.
   json

{
"ok": true,
"elements": [
{ "name": "Fire", "rating": 5 },
...
]
}
500 Internal Server Error: If there are any issues loading elements.

6. Get Abilities
   Endpoint: /abilities
   Method: GET
   Description: Returns a list of abilities. No parameters needed. Returns a JSON object with 'ok' status and an array of ability objects, or a 500 error if there are no abilities available.
   Response:
   200 OK: Returns a list of abilities.
   json

Copy
{
"ok": true,
"abilities": [
{ "id": 1, "name": "Fireball", ... },
...
]
}
500 Internal Server Error: If there are no abilities available.

7. Generate a Random Team
   Endpoint: /generateTeam
   Method: GET
   Query Parameters:
   level (required): The level of the monsters to include in the team.
   Description: Generates a random team of 4 monsters based on the specified level.
   Response:
   200 OK: Returns a team of monsters.
   json

{
"ok": true,
"team": [
{ "id": 1, "name": "Shadow Stalker", ... },
...
]
}
400 Bad Request: If the level is missing or invalid.
json

{
"ok": false,
"message": "Not enough fighters available for the requested level."
}

8. Initiate a Battle
   Endpoint: /fight
   Method: GET
   Query Parameters:
   team1 (required): Comma-separated monster IDs for the first team.
   team2 (required): Comma-separated monster IDs for the second team.
   Description: Initiates a battle between two teams of monsters.
   Response:
   200 OK: Returns the result of the battle.
   json

{
"ok": true,
"battle": {
"battleID": "2024:11:27:12:00:00@1/2/3/4",
"battleWinners": ["Shadow Stalker", "Water Wraith"],
"teamWon": "Team 1",
"team1Points": 3,
"team2Points": 1,
"battle": [...],
"team1": [...],
"team2": [...]
}
}
400 Bad Request: If the teams are invalid or missing.
json

{
"ok": false,
"message": "Invalid teams"
}

Notes
All endpoints return JSON responses.
Ensure that the parameters are correctly formatted when making requests.
Use tools like Postman or cURL to test the API endpoints.
