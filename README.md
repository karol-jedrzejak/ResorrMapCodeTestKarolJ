# Resort Map Application

An interactive map for reserving poolside lounge chairs at a hotel.

## Features

- Interactive map showing lounge chairs (W), pool (p), roads (#), restrooms (c), and empty spaces (.).
- Book lounge chairs by clicking on available ones.
- Validation against guest list.
- Real-time updates of chair availability.

## Installation

Clone the repository and install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Running the Application

To start both backend and frontend:

```bash
npm start
```

You can specify custom map and bookings files:

```bash
npm start -- --map path/to/map.ascii --bookings path/to/bookings.json
```

The backend runs on http://localhost:3001, frontend on http://localhost:3000.

## API

- GET /api/map: Returns the current map state.
- POST /api/book: Books a chair. Body: {row, col, room, guestName}

## Technologies

- Backend: Node.js, Express
- Frontend: React, TypeScript