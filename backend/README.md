# FastAPI PDF RAG Backend

Backend-only API for uploading a PDF, generating a summary, and asking questions
whose answers are grounded in the uploaded document.

## 1. Install Python

Install Python 3.11 or newer from https://www.python.org/downloads/.

During installation on Windows, select **Add Python to PATH**.

## 2. Create the environment

Run these commands from this project folder:

```powershell
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Open `.env` and replace the placeholder with your OpenAI API key.

## 3. Start FastAPI

```powershell
uvicorn app.main:app --reload
```

API documentation:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
- Health check: http://127.0.0.1:8000/health

## API flow

### Upload and index a PDF

`POST /documents` using multipart form data with a field named `file`.

Example response:

```json
{
  "document_id": "vs_...",
  "filename": "example.pdf",
  "status": "ready"
}
```

### Generate a summary

`POST /summary`

```json
{
  "document_id": "vs_..."
}
```

### Ask a question

`POST /ask`

```json
{
  "document_id": "vs_...",
  "question": "What are the main conclusions?"
}
```

### Delete the remote document store

`DELETE /documents/{document_id}`

Call this endpoint when a user removes a document so its OpenAI vector store is
also deleted.

## How the RAG flow works

1. FastAPI receives the PDF.
2. The PDF is temporarily saved locally.
3. OpenAI creates and indexes a vector store.
4. `file_search` retrieves relevant PDF passages.
5. The model produces a grounded summary or answer.
6. The temporary local PDF is deleted after indexing.

Scanned PDFs without selectable text may require OCR before upload.
