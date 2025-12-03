# Online Coding Interviews

Platform for real-time technical interviews with collaborative coding, task library, and secure browser-based code execution.

## Key Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously with instant updates (WebSocket).
- **Shareable Rooms**: Create a unique link (`/room/:roomId`) and share it with candidates.
- **Multi-language Support**: Syntax highlighting and execution for **JavaScript** and **Python**.
- **Secure Code Execution**: 
  - Code is executed entirely in the browser (Client-side).
  - **JavaScript**: Runs in a sandboxed Web Worker.
  - **Python**: Runs via **Pyodide** (WASM), ensuring security without server-side risks.
- **Task Library**: Built-in library of interview questions (Algorithms, Arrays, Strings) for both languages.
- **Smart Language Switching**: Switching languages preserves the context of the current task (e.g., switches from JS "Sort Array" to Python "Sort Array").
- **Rich UI**: Chat, Participant list, Dark/Light mode, Execution Output panel.

## Technology Stack

### Frontend
- **React 18** + **Vite** (Fast, modern build tool)
- **TypeScript** (Type safety)
- **Shadcn UI** + **Tailwind CSS** (Modern, accessible components)
- **PrismJS** (Syntax highlighting)
- **Pyodide** (Python WASM interpreter)
- **Vitest** + **React Testing Library** (Unit & Component testing)

### Backend
- **FastAPI** (High-performance Python framework)
- **WebSocket** (Real-time communication)
- **SQLAlchemy** + **SQLite** (Room persistence)
- **OpenAPI** (API Specification)
- **Pytest** (Backend testing)

### DevOps & Infrastructure
- **Docker** & **Docker Compose** (Containerization)
- **GitHub Actions** (CI/CD pipeline)
- **Render** (Deployment configuration)

## Project Architecture

- **Frontend Routing**: `frontend/src/App.tsx` (React Router v7 future flags enabled)
- **Room Logic**: `frontend/src/hooks/useRoom.ts` (Manages WebSocket state, code sync, and execution)
- **Code Execution**: `frontend/src/utils/executor.ts` (Handles Web Worker & Pyodide)
- **Backend API**: `backend/app/api/routes.py` (REST endpoints)
- **Socket Manager**: `backend/app/main.py` (WebSocket connection handling)
- **Database Models**: `backend/app/models/database.py`

## Getting Started

### Option 1: Run with Docker Compose (Recommended)

Run both Frontend and Backend services simultaneously:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001

### Option 2: Run Locally with Concurrently

Run both services in a single terminal using `concurrently`:

```bash
# From the root directory
npm install
npm run dev
```

This will start:
- Backend on port 3001
- Frontend on port 8080

### Option 3: Run Locally (Separate Terminals)

#### Backend

```bash
cd backend
# Install dependencies (using pip or uv)
pip install fastapi uvicorn pydantic SQLAlchemy pytest

# Run server
uvicorn app.main:app --reload --port 3001
```

#### Frontend

```bash
cd frontend
# Install dependencies
npm install

# Run development server
npm run dev
```

## Testing

This project includes comprehensive testing for both client and server.

### Frontend Tests
Run unit and component tests using Vitest:

```bash
cd frontend
npm test
```

### Backend Tests
Run unit and integration tests using Pytest:

```bash
cd backend
pytest
```

Includes:
- **Unit Tests**: `backend/tests/`
- **Integration Tests**: `backend/tests_integration/` (API & WebSocket interactions)

## API Documentation

The backend provides a REST API and WebSocket endpoints.

### HTTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rooms` | Create a new room. Returns room ID and initial state. |
| `GET` | `/api/rooms/{roomId}` | Get room details (code, language, task). |
| `PUT` | `/api/rooms/{roomId}/code` | Update code in the room. |
| `PUT` | `/api/rooms/{roomId}/language` | Update programming language (`javascript`, `python`). |
| `PUT` | `/api/rooms/{roomId}/task` | Update task description and title. |
| `GET` | `/api/rooms/{roomId}/participants` | Get list of online participants. |
| `POST` | `/api/rooms/{roomId}/execute` | (Legacy) Server-side execution stub. |

### WebSocket API

URL: `ws://localhost:3001/ws/rooms/{roomId}`

Messages (JSON):
- **Join**: `{ "type": "join", "name": "User" }`
- **Code Update**: `{ "type": "code_update", "code": "..." }`
- **Language Update**: `{ "type": "language_update", "language": "python" }`
- **Task Update**: `{ "type": "task_update", "task": "...", "title": "..." }`
- **Chat**: `{ "type": "chat_message", "text": "Hello" }`
- **Output**: `{ "type": "output_update", "output": "..." }`

Full OpenAPI specification is available in `backend/openapi.yaml`.

## Deployment

The project is configured for deployment on **Render** using a single container approach.
- **Configuration**: `render.yaml`
- **Dockerfile**: Multi-stage build that compiles the frontend and serves it via FastAPI static mounting.

## CI/CD

Automated pipeline configured via GitHub Actions (`.github/workflows/ci.yml`):
1.  **Test**: Runs Frontend and Backend tests on every push/PR.
2.  **Build**: Verifies the Docker build process.

## Interactive Docs

- **Swagger UI**: http://localhost:3001/api/docs
- **ReDoc**: http://localhost:3001/api/redoc
