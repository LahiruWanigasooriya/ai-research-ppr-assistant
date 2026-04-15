# How to Run the Research AI Application

This application consists of three main parts:
1. **AI Engine** (Python FastAPI)
2. **Backend** (Node.js/Express)
3. **Frontend** (React/Vite)

## Running the Application

You can start all three parts of the application simultaneously with a single command from the root directory of the project.

### Prerequisites
Make sure you have installed the required dependencies by running:
```bash
npm install
```
This is required because the `concurrently` package is used to run all the parts together.

### Run Command
To start the AI engine, backend, and frontend at the same time, open a terminal in the root directory (`c:\Users\lahir\Downloads\research-ai-app - Copy`) and run:

```bash
npm run dev
```

This will use the `concurrently` package to execute the following scripts at once:
- `start:ai`: Starts the Python FastAPI backend on port 8000 using uvicorn.
- `start:backend`: Starts the Node.js Express server.
- `start:frontend`: Starts the React development server.

## Troubleshooting

If you encounter issues starting the application, you can try running each part individually to see where the error occurs:

- **Terminal 1 (AI Engine):**
  ```bash
  npm run start:ai
  ```

- **Terminal 2 (Backend):**
  ```bash
  npm run start:backend
  ```

- **Terminal 3 (Frontend):**
  ```bash
  npm run start:frontend
  ```
