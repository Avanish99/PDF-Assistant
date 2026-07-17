**PDF Assistant**



A FastAPI based backend application that allows users to upload PDF documents, create vector embeddings, retrieve relevant content using Retrieval-Augmented Generation (RAG), and generate accurate summaries and answers using OpenAI models.



**Features:**

* Upload PDF documents
* Extract text from PDFs
* Intelligent text chunking
* Generate embeddings for semantic search
* Store and retrieve vectors efficiently
* Retrieval-Augmented Generation (RAG)
* AI-powered PDF summarization
* Question answering based on uploaded PDFs
* RESTful API built with FastAPI



Project Structure

PDF-Summary/

│

├── backend/

│ │

│ ├── app/

│ │ ├── chunking.py

│ │ ├── config.py

│ │ ├── embeddings.py

│ │ ├── pdf\_loader.py

│ │ ├── rag.py

│ │ ├── vector\_search.py

│ │

│ │

│ ├── requirements.txt

│ ├── .env.example

│ └── .gitignore

│

├── frontend/

│ │

│ ├── src/

│ │ ├── components/

│ │ ├── pages/

│ │ ├── services/

│ │ ├── assets/

│ │ ├── App.jsx

│ │ └── main.jsx

│ │

│ ├── public/

│ ├── package.json

│ ├── package-lock.json

│ ├── .env.example

│ └── .gitignore

│

├── README.md

└── LICENSE



This is full stack React + FastAPI structure.





\## Frontend



\- React.js

\- Vite

\- JavaScript/TypeScript

\- Axios (API communication)

\- CSS/Tailwind CSS



\## Backend



\- Python

\- FastAPI

\- OpenAI API

\- PyMuPDF

\- Embeddings

\- Vector Search



Clone the repository:



git clone https://github.com/Avanish99/PDF-Assistant.git

cd PDF-ASsistant



Create a virtual environment:



python -m venv venv



Activate it:



Windows



venv\\Scripts\\activate



macOS/Linux



source venv/bin/activate



Install dependencies:



pip install -r backend/requirements.txt



Environment Variables



Create a .env file inside the backend directory using .env.example as a template.



Example:



GROQ\_API\_KEY=your\_api\_key

GROQ\_MODEL=llama-3.3-70b-versatile



**API Workflow**

1. Upload a PDF.
2. Extract text from the document.
3. Split text into chunks.
4. Generate embeddings.
5. Store vectors.
6. Retrieve relevant chunks.
7. Generate AI-powered summaries and answers.



Author



Avanish Y



GitHub: https://github.com/Avanish99

