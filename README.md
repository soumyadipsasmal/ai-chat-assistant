# 🤖 AI Chat Assistant

A full-stack AI chat application powered by Claude AI.

## 🏗️ Project Structure

```
ai-chat-app/
├── frontend/          ← React app
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
├── backend/           ← Node.js + Express
│   ├── src/
│   │   ├── index.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Chat.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       └── chat.routes.js
│   ├── .env
│   └── package.json
└── README.md
```

## ⚙️ Environment Variables

Add your Anthropic API key in `backend/.env`:
```
ANTHROPIC_API_KEY=your-api-key-here
```

Get your API key from: https://console.anthropic.com

## 🎯 YOUR DEVOPS TASKS (Do it yourself!)

### Task 1 - Dockerfiles
- [ ] Create `frontend/Dockerfile`
- [ ] Create `backend/Dockerfile`

### Task 2 - Docker Compose
- [ ] Create `docker-compose.yml` with:
  - frontend service (port 3000)
  - backend service (port 5000)
  - mongo service (port 27017)

### Task 3 - Jenkins Pipelines
- [ ] Create `Jenkinsfile.frontend`
- [ ] Create `Jenkinsfile.backend`
- [ ] Set up pipelines in Jenkins

### Task 4 - Push to Docker Hub
- [ ] Build and push frontend image
- [ ] Build and push backend image

### Task 5 - GitHub
- [ ] Push project to GitHub
- [ ] Set up webhooks for auto-trigger

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/chat | Get all chats |
| POST | /api/chat/new | Create new chat |
| GET | /api/chat/:id | Get chat messages |
| POST | /api/chat/:id/message | Send message to AI |
| DELETE | /api/chat/:id | Delete chat |

Good luck! 💪
> Important: this README still contains the original assignment brief. See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for the updated architecture, setup, Docker flow, and interview summary.
