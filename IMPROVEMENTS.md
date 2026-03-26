# Backend

Firstly i improved the Backend. I separated the code into sections SOLID & Design Patters. There is a route files than handles the routing and call functions in controller. The controller use service which holds logic of the app. There is also a bunch of utility functions, loaders to load data from files and models containing the info about type of data. I also implemented cache.

# Frontend

Secondly i improved the Frontend. Firstly i extracted components from the main file (map, message and form). Then i added api file containing routes to the backend. Then i separated actions into hook and add model with types. Lastly i separated mapper into separate utility file.

# Tests

After updating Frontend & Backend i starter working on improvement of tests. I created 13 tests for the backend and 42 for the frontend.

Backend (2 test suites)
✅ MapService Unit Tests (6 tests)
    - Map loading, caching, parsing
    - Cabana booking mechanics
    - State persistence
    - Error handling'

✅ API Integration Tests (7 tests)
    - GET /api/map validation
    - POST /api/book validation
    - Room/position/guest validation
    - Previous booking release logic

Frontend (4 test suites)
✅ Component Unit Tests (32 tests)
    - MapGrid: 8 tests (rendering, selection, styling)
    - BookingForm: 7 tests (rendering, submission, validation)
    - MessageDisplay: 5 tests (rendering, colors)
    - App: 1 test (basic rendering)
✅ Hook Unit Tests (12 tests)
    - useBooking: Map loading, cell selection, booking flow
✅ Integration Tests (7 tests)
    - App initialization flow
    - Cabana selection workflow
    - Cancellation handling
    - Complete booking flow