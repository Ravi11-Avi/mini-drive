# 🗂️ Mini Drive

> A lightweight, full-stack cloud file storage app — upload, manage, and access your files from anywhere.

<p align="left">
  <img alt="React" src="https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white&labelColor=20232a">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&labelColor=20232a">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&labelColor=20232a">
  <img alt="Vercel" src="https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white&labelColor=20232a">
  <img alt="Render" src="https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white&labelColor=20232a">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-lightgrey">
</p>

🌐 **Live Demo:** [mini-drive-phi.vercel.app](https://mini-drive-phi.vercel.app)

---

## 📖 Overview

**Mini Drive** is a Google Drive-inspired file storage application built with the **MERN stack**. Users can sign up, upload files, organise them, and access them from any device. The frontend is a fast Vite/React SPA deployed on Vercel; the backend is a Node.js/Express REST API deployed on Render, with files and metadata persisted in MongoDB Atlas.

## ✨ Features

| Feature | Status |
|---|---|
| 🔐 User authentication (JWT) | ✅ |
| 📤 File upload & storage | ✅ |
| 📁 File listing & management | ✅ |
| 🔒 Secure per-user file access | ✅ |
| 🌐 Cloud deployment (Vercel + Render) | ✅ |
| 📂 Folder/directory support | 🛣️ Roadmap |
| 🔗 Shareable file links | 🛣️ Roadmap |
| 🔍 File search | 🛣️ Roadmap |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT + Bcrypt |
| File Handling | Multer |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Dev tooling | Concurrently |

---

## 🏗️ System Architecture

Mini Drive follows a **3-tier client–server architecture** with a decoupled frontend and backend, both independently deployed to cloud platforms.

```mermaid
flowchart TB
    subgraph Client["🖥️ React Client (Vercel)"]
        UI[React UI - Vite SPA]
        Auth[Auth Context / JWT]
        UI --> Auth
    end

    subgraph Server["⚙️ Express API (Render)"]
        Routes[REST API Routes]
        Middleware[Auth Middleware - JWT Verify]
        Controllers[Controllers]
        FileHandler[Multer - File Handler]
        Routes --> Middleware --> Controllers
        Controllers --> FileHandler
    end

    subgraph Storage["🗄️ MongoDB Atlas"]
        Users[(Users Collection)]
        Files[(Files Metadata Collection)]
    end

    subgraph FileStore["📦 File Storage"]
        Disk[Local / Cloud Storage]
    end

    Client -->|HTTP REST Requests + Bearer Token| Server
    Controllers -->|Read/Write user & file metadata| Storage
    FileHandler -->|Store binary file| FileStore
    FileStore -.->|File URL reference| Files

    style Client fill:#1e293b,stroke:#38bdf8,color:#fff
    style Server fill:#1a2e1a,stroke:#339933,color:#fff
    style Storage fill:#1a2a1a,stroke:#47A248,color:#fff
    style FileStore fill:#2d1f3d,stroke:#a78bfa,color:#fff
```

---

## 🔄 Data Flow

### 1. User Authentication

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant FE as React Frontend
    participant API as Express API
    participant DB as MongoDB Atlas

    U->>FE: Enters email + password
    FE->>API: POST /api/auth/login
    API->>DB: Find user by email
    DB-->>API: User document
    API->>API: Bcrypt verify password
    API-->>FE: { token: JWT }
    FE->>FE: Store JWT in localStorage
    FE-->>U: Redirect to dashboard
```

### 2. File Upload Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant API as Express API
    participant MG as MongoDB
    participant FS as File Storage

    U->>FE: Selects file & clicks Upload
    FE->>API: POST /api/files/upload (multipart/form-data + JWT)
    API->>API: Verify JWT middleware
    API->>FS: Multer saves file to disk/cloud
    FS-->>API: File path / URL
    API->>MG: Save file metadata (name, size, type, owner, url)
    MG-->>API: Saved document
    API-->>FE: { success: true, file: {...} }
    FE-->>U: File appears in dashboard
```

---

## 📂 Project Structure

```
mini-drive/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, env config
│   │   ├── controllers/     # Auth & file logic
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── models/          # Mongoose schemas (User, File)
│   │   ├── routes/          # API route definitions
│   │   └── index.js         # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Dashboard, Login, Signup
│   │   ├── context/         # Auth context / state
│   │   ├── api/             # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── dist/                # Vercel build output
│   └── package.json
│
├── vercel.json              # Vercel frontend build config
├── package.json             # Root: concurrently dev script
└── .gitignore
```
> 💡 Adjust to match your actual file names if they differ.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/Ravi11-Avi/mini-drive.git
cd mini-drive
```

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mini-drive
JWT_SECRET=your_super_secret_key
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run Both Together (from root)

```bash
# In the root directory
npm install        # installs concurrently
npm run dev        # starts both frontend & backend simultaneously
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🌐 Deployment

| Platform | Service | URL |
|---|---|---|
| Vercel | Frontend | [mini-drive-phi.vercel.app](https://mini-drive-phi.vercel.app) |
| Render | Backend | [mini-drive-ndlx.onrender.com](https://mini-drive-ndlx.onrender.com) |

### Deploy Frontend (Vercel)

Push to `main` — Vercel auto-builds from `frontend/package.json` → `frontend/dist` (configured in `vercel.json`).

### Deploy Backend (Render)

Set these environment variables in Render's dashboard:

```env
MONGO_URI=...
JWT_SECRET=...
PORT=5000
```

> ⚠️ Render free tier spins down after 15 minutes of inactivity. First request may be slow.

---

## 🧪 Testing

No automated test suite yet. Use this checklist before pushing changes:

- [ ] Register a new user
- [ ] Log in with valid credentials
- [ ] Receive JWT and access the dashboard
- [ ] Upload a file successfully
- [ ] View uploaded files in the dashboard
- [ ] Try accessing another user's file — should be blocked (403)
- [ ] Log out and confirm protected routes redirect to login

**Planned:** Unit tests with [Vitest](https://vitest.dev/), API integration tests with [Supertest](https://github.com/ladjs/supertest).

---

## 🛣️ Roadmap

- [ ] Folder / directory support
- [ ] Shareable file links (public/private)
- [ ] File search & filtering
- [ ] File preview (images, PDFs)
- [ ] AWS S3 or Cloudinary for scalable file storage
- [ ] Automated test suite

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👤 Author

**Aviansh (Ravi11-Avi)**
🌐 [Portfolio](https://ravi11-avi.github.io/Portfolio/) · 🐙 [GitHub](https://github.com/Ravi11-Avi)
