# Documentation and API Docs

## Server Class

### Overview

The `Server` class is responsible for setting up an express server, configuring middleware, and initializing WebSocket servers. The server serves as the back-end framework for handling HTTP requests and WebSocket connections.

## WebSocket Endpoints

- `/ws1` - WebSocket Server 1 is responsible for letting the front-end know when an emergency is triggered.

## Astar Class

### Overview

The `Astar` class provides methods for the A* pathfinding algorithm.

### Static Methods

#### `manhattanDistance(current: myNode, goal: myNode): number`
- **Description:** Calculates the Manhattan distance between two nodes.
- **Parameters:**
  - `current` - The current node.
  - `goal` - The goal node.
- **Returns:** `number`

#### `aStar(start: myNode, goals: myNode[], maze: number[][]): myNode[]`
- **Description:** Performs the A* pathfinding algorithm on a given maze.
- **Parameters:**
  - `start` - The start node.
  - `goals` - An array of goal nodes.
  - `maze` - The maze represented as a 2D array.
- **Returns:** `myNode[]`

#### `runAStar(startNode: myNode, goalNodes: myNode[], maze: number[][]): Promise<myNode[]>`
- **Description:** Runs the A* pathfinding algorithm asynchronously.
- **Parameters:**
  - `startNode` - The start node.
  - `goalNodes` - An array of goal nodes.
  - `maze` - The maze represented as a 2D array.
- **Returns:** `Promise<myNode[]>`

## Endpoint Definitions

### EmailService Controller

 **Subpath:** `/email`

- **URL:** `/sendPath`
- **Method:** `POST`
- **Description:** Sends a path via email.
- **Parameters:** 
  - `user` (string) - The user's name.
  - `path` (string) - The path to send.
  
### EscapeRoute Controller

 **Subpath:** `/userlocation`

- **URL:** `/userRoute`
- **Method:** `GET`
- **Description:** Provides an escape route for a user.
- **Parameters:** 
  - `floorplanName` (string) - The name of the floor plan.
  - `userX` (number) - The user's x-coordinate.
  - `userY` (number) - The user's y-coordinate.
  - `targetX` (number) - The emergency location's x-coordinate.
  - `targetY` (number) - The emergency location's y-coordinate.

### Floorplan Controller 
 
 **Subpath:** `/floorplan`

- **URL:** `/getAllPlans`
- **Method:** `GET`
- **Description:** Retrieves all floor plans.

- **URL:** `/getPlanByName`
- **Method:** `GET`
- **Description:** Retrieves a floor plan by its name.
- **Parameters:** 
  - `name` (string) - The name of the floor plan.

- **URL:** `/savePlan`
- **Method:** `POST`
- **Description:** Saves a floor plan.

- **URL:** `/deletePlan`
- **Method:** `DELETE`
- **Description:** Deletes a floor plan.

- **URL:** `/getPlanIds`
- **Method:** `GET`
- **Description:** Retrieves all plan IDs.

### LocationProcessor Controller

 **Subpath:** `/userlocation`

- **URL:** `/userlocation`
- **Method:** `GET`
- **Description:** Retrieves the user's location on a specified floor.
- **Parameters:** 
  - `name` (string) - The name of the floor.

### Trigger Controller

 **Subpath:** `/trigger`

- **URL:** `/trigger-alert`
- **Method:** `GET`
- **Description:** Triggers an alert message to all WebSocket clients.

### User Controller

 **Subpath:** `/users`

- **URL:** `/`
- **Method:** `GET`
- **Description:** Retrieves all users.
