# Resort Map Application

An interactive map for reserving poolside lounge chairs at a hotel.

## Features

- Interactive map showing lounge chairs (W), pool (p), roads (#), restrooms (c), and empty spaces (.).
- Book lounge chairs by clicking on available ones.
- Validation against guest list.
- Real-time updates of chair availability.

## Running the Application

To start both backend and frontend (It will also install dependencies):

```bash
npm start
```

You can specify custom map and bookings files (where path_to is path to your files):

```bash
npm start -- --map path_to/map.ascii --bookings path_to/bookings.json
```

The backend runs on http://localhost:3001, frontend on http://localhost:3000.

## API

- GET /api/map: Returns the current map state.
- POST /api/book: Books a chair. Body: {row, col, room, guestName}

## Technologies

- Backend: Node.js, Express
- Frontend: React, TypeScript

## Testing

Automated tests cover both backend API behavior and frontend UI interactions.

### Run all tests

From the repository root:

```bash
npm test
```

### Run backend tests only

```bash
cd backend
npm test
```

### Run frontend tests only

```bash
cd frontend
npm test
```

## LLM / Agent Usage

This project includes automated tests written with guidance from an AI assistant. The key prompts used were:

- "Create automated tests covering core backend and frontend functionality, validating booking logic, REST API behavior, map updates, and UI responses to typical user actions. Document how to run all tests in the README."
- "Refactor backend code to allow unit testing of the API without needing to start the server"

These prompts helped guide the creation of Jest + Supertest tests for the backend and React Testing Library tests for the frontend.
