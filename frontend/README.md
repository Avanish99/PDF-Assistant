# AI PDF Summary Frontend

React frontend for the FastAPI PDF RAG backend.

## Setup

From this folder:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL shown in your terminal, usually:

```text
http://localhost:5173
```

## Backend

Start the FastAPI backend first:

```powershell
cd ..\backend
uvicorn app.main:app --reload
```

The frontend expects the backend at:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Change this in `.env` if your backend runs somewhere else.

## Features

- Upload PDF to `POST /documents`
- Generate summary from `POST /summary`
- Ask RAG questions through `POST /ask`
- Clear the current document and call `DELETE /documents/{document_id}`
