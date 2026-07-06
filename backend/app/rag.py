import os
import tempfile
from pathlib import Path

from fastapi import UploadFile
from openai import OpenAI

from app.config import Settings


class PdfRagService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = OpenAI(api_key=settings.openai_api_key)

    def index_pdf(self, upload: UploadFile) -> str:
        suffix = Path(upload.filename or "document.pdf").suffix or ".pdf"
        temporary_path: str | None = None
        vector_store_id: str | None = None

        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary:
                temporary_path = temporary.name
                while chunk := upload.file.read(1024 * 1024):
                    temporary.write(chunk)

            vector_store = self.client.vector_stores.create(
                name=upload.filename or "PDF document"
            )
            vector_store_id = vector_store.id

            with open(temporary_path, "rb") as pdf:
                self.client.vector_stores.files.upload_and_poll(
                    vector_store_id=vector_store_id,
                    file=pdf,
                )

            return vector_store_id
        except Exception:
            if vector_store_id:
                try:
                    self.client.vector_stores.delete(vector_store_id)
                except Exception:
                    pass
            raise
        finally:
            upload.file.close()
            if temporary_path and os.path.exists(temporary_path):
                os.remove(temporary_path)

    def summarize(self, document_id: str) -> str:
        response = self.client.responses.create(
            model=self.settings.openai_model,
            instructions=(
                "You are a precise document summarizer. Use only information retrieved "
                "from the uploaded PDF. If information is unavailable, say so. Return "
                "clear Markdown and do not invent facts."
            ),
            input=(
                "Summarize this PDF using these sections:\n"
                "1. Overview\n"
                "2. Key points\n"
                "3. Important facts or evidence\n"
                "4. Conclusions\n"
                "5. Action items, if any"
            ),
            tools=[
                {
                    "type": "file_search",
                    "vector_store_ids": [document_id],
                    "max_num_results": 20,
                }
            ],
        )
        return response.output_text

    def ask(self, document_id: str, question: str) -> str:
        response = self.client.responses.create(
            model=self.settings.openai_model,
            instructions=(
                "Answer using only information retrieved from the uploaded PDF. "
                'If the answer is absent, say "I could not find that in the document." '
                "Do not use outside knowledge or invent details. Return concise Markdown."
            ),
            input=question,
            tools=[
                {
                    "type": "file_search",
                    "vector_store_ids": [document_id],
                    "max_num_results": 10,
                }
            ],
        )
        return response.output_text

    def delete_document(self, document_id: str) -> None:
        self.client.vector_stores.delete(document_id)
