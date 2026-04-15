# Research AI Application

A full-stack project featuring a React frontend, an Node.js/Express backend proxy, and a Python-based AI engine for processing research documents and queries.

## Architecture & Tech Stack

This application consists of three main components:

### 1. Frontend
A modern single-page application focused on uploading documents and interacting with the AI.
- **Framework:** React + Vite
- **Dependencies:** `axios`, `lucide-react`, `react`, `react-dom`

### 2. Backend
A Node.js server that handles file uploads and acts as a proxy between the frontend and the AI engine.
- **Framework:** Express.js
- **Dependencies:** `express`, `cors`, `dotenv`, `axios`, `multer` (for handling multipart data/uploads), `form-data`

### 3. AI Engine
A Python-based component for handling advanced ML inference, NLP, or retrieval augmented generation workflows.
- **Current State:** Notebook-based (`main.ipynb`) / FastAPI backend
- **Execution Environment:** Python Virtual Environment (`venv`)

---

## Setup Instructions

Please follow the steps below to set up each component of the application on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed (v16+ recommended).
- [Python 3.8+](https://www.python.org/downloads/) installed.

### Global/Root Dependencies
To manage the concurrent startup of all services, install the root dependencies:
```bash
# In the root directory (ai-research-ppr-assistant)
npm install
```

### 1. Frontend Setup
Navigate to the `frontend` folder and install its dependencies:
```bash
cd frontend
npm install
```

### 2. Backend Setup
Navigate to the `backend` folder, install dependencies, and (optionally) define your environment variables:
```bash
cd backend
npm install
```
*Note: Make sure your `.env` file in the `backend` folder is configured with the correct AI engine URLs and ports.*

### 3. AI Engine Setup
If you are planning to run the AI backend as an API server alongside the MERN stack:
1. Navigate to the `ai-engine` folder.
2. Initialize or activate the virtual environment:
   ```bash
   cd ai-engine
   # On Windows:
   venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn python-multipart
   # Add any specific AI packages like langchain, openai, etc.
   ```
4. *Important:* Make sure you have a `main.py` file with your FastAPI app instance defined if you intend to run it as a server via Uvicorn.

---

## Running the Application

You can start all services concurrently using the single root command:

```bash
# Run this from the root directory
npm run dev
```

This uses the `concurrently` package to execute three parallel NPM scripts:
1. `npm run start:ai` -> Runs `uvicorn main:app --port 8000` inside your `ai-engine` virtual environment.
2. `npm run start:backend` -> Runs the Express server (`node server.js`).
3. `npm run start:frontend` -> Runs the Vite development server.

### Troubleshooting

If you encounter issues during the `npm run dev` startup (such as missing files or missing dependencies), you can start the components individually to find the exact error:
- **Terminal 1:** `npm run start:ai`
- **Terminal 2:** `npm run start:backend`
- **Terminal 3:** `npm run start:frontend`
