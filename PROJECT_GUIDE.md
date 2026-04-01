# AI Chat Assistant

A full-stack practice project built with React, Node.js, Express, MongoDB, Docker, and Jenkins. It includes authentication, persistent chat history, containerized deployment, and a free demo mode so the app can be shown without a paid AI API key.

## What This Project Demonstrates

- Full-stack development with a React frontend and Express backend
- JWT authentication with protected routes
- MongoDB data modeling for users and chat history
- Dockerfiles for frontend and backend services
- Docker Compose orchestration with MongoDB and health checks
- Jenkins pipelines that test, build, and push Docker images
- A cost-free demo mode for interview and portfolio use

## Tech Stack

- Frontend: React, Axios
- Backend: Node.js, Express, Mongoose, JWT, bcrypt
- Database: MongoDB
- AI: Anthropic Claude or local mock replies
- DevOps: Docker, Docker Compose, Jenkins, Docker Hub

## Project Structure

```text
ai-chat-assistant/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- AppShell.js
|   |   |-- api.js
|   |   |-- styles.css
|   |   `-- utils/
|   |-- Dockerfile
|   `-- nginx.conf
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- server.js
|   |-- tests/
|   `-- Dockerfile
|-- docker-compose.yml
|-- Jenkinsfile.backend
|-- Jenkinsfile.frontend
`-- PROJECT_GUIDE.md
```

## Demo Mode vs Real AI

This project supports two modes:

- `AI_MODE=mock`
  Use this for practice, interviews, and free demos. The backend returns a local mock reply and does not call Anthropic.
- `AI_MODE=anthropic`
  Use this when you want the real Claude response flow. This requires `ANTHROPIC_API_KEY`.

If `ANTHROPIC_API_KEY` is missing, the app can still run in demo mode.

## Local Setup

### Option 1: Run with Docker Compose

1. Copy `.env.example` to `.env`
2. Update the values if needed
3. Start the stack

```bash
docker compose up --build
```

Frontend: `http://localhost:3001`

### Option 2: Run Frontend and Backend Separately

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Root `.env` for Docker Compose:

```env
AI_MODE=mock
ANTHROPIC_API_KEY=
JWT_SECRET=replace-with-a-strong-secret
CLIENT_ORIGIN=http://localhost:3001
MONGO_URI=mongodb://mongo:27017/ai-chat
```

Backend `.env` example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-chat
JWT_SECRET=replace-with-a-strong-secret
CLIENT_ORIGIN=http://localhost:3001
AI_MODE=mock
ANTHROPIC_API_KEY=
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Backend health status |
| GET | `/api/meta` | App mode metadata |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/chat` | Get all chats for the current user |
| POST | `/api/chat/new` | Create a new chat |
| GET | `/api/chat/:id` | Get one chat with messages |
| POST | `/api/chat/:id/message` | Send a message and receive an AI reply |
| DELETE | `/api/chat/:id` | Delete a chat |

## Testing

The backend includes basic automated tests for validation and chat helper utilities.

```bash
cd backend
npm test
```

## CI/CD

There are two Jenkins pipelines:

- `Jenkinsfile.frontend`
  Installs dependencies, builds the React app, builds the Docker image, and pushes both the build-number tag and `latest`
- `Jenkinsfile.backend`
  Installs dependencies, runs backend tests, builds the Docker image, and pushes both the build-number tag and `latest`

## Production Notes

- MongoDB is bound to `127.0.0.1` in Docker Compose so it is not exposed publicly by default
- The frontend container proxies `/api` requests to the backend through Nginx
- Set a strong `JWT_SECRET` before deploying
- Use `AI_MODE=mock` for a free portfolio deployment or configure Anthropic for live AI responses
- For cloud deployment, keep secrets in environment variables or a secrets manager

## Interview Summary

This project started as a practice app and was improved to look more like a professional portfolio piece. The strongest talking points are:

- component-based React frontend
- validated Express API with reusable middleware
- MongoDB persistence for users and chats
- Docker-based deployment flow
- Jenkins CI/CD for image publishing
- free demo mode plus real AI integration support
