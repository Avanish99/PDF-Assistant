import React, { useMemo, useState } from "react";

import {
  askDocument,
  deleteDocument,
  summarizeDocument,
  uploadDocument,
} from "./api.js";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [document, setDocument] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const canAsk = useMemo(
    () => Boolean(document?.document_id && question.trim() && !isAsking),
    [document, question, isAsking],
  );

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setError("");
    setStatus("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setError("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a PDF first.");
      return;
    }

    setError("");
    setStatus("Uploading ...");
    setIsUploading(true);
    setSummary("");
    setMessages([]);

    try {
      const uploadedDocument = await uploadDocument(selectedFile);
      setDocument(uploadedDocument);
      setStatus("Document indexed. Creating summary...");
      await runSummary(uploadedDocument.document_id);
    } catch (uploadError) {
      setError(uploadError.message);
      setStatus("");
    } finally {
      setIsUploading(false);
    }
  }

  async function runSummary(documentId = document?.document_id) {
    if (!documentId) return;

    setError("");
    setIsSummarizing(true);

    try {
      const data = await summarizeDocument(documentId);
      setSummary(data.answer);
      setStatus("Ready. Ask a question about the document.");
    } catch (summaryError) {
      setError(summaryError.message);
      setStatus("");
    } finally {
      setIsSummarizing(false);
    }
  }

  async function handleAsk(event) {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!canAsk || !trimmedQuestion) return;

    setQuestion("");
    setError("");
    setIsAsking(true);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmedQuestion },
      { role: "assistant", text: "Searching the document..." },
    ]);

    try {
      const data = await askDocument(document.document_id, trimmedQuestion);
      setMessages((current) => [
        ...current.slice(0, -1),
        { role: "assistant", text: data.answer },
      ]);
    } catch (askError) {
      setMessages((current) => [
        ...current.slice(0, -1),
        { role: "assistant", text: askError.message },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  async function handleReset() {
    const documentId = document?.document_id;

    setSelectedFile(null);
    setDocument(null);
    setSummary("");
    setQuestion("");
    setMessages([]);
    setStatus("");
    setError("");

    if (documentId) {
      deleteDocument(documentId).catch(() => {});
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">AI PDF SUMMARY</p>
        <h1>
          Summarize PDFs.
          <span> Ask grounded questions.</span>
        </h1>
        <p className="hero-copy">
          Upload a document, let the backend index it, then use RAG to summarize
          and ask questions from the PDF only.
        </p>
      </section>

      <section className="layout">
        <form className="panel upload-panel" onSubmit={handleUpload}>
          <div>
            <p className="step">01 / Upload</p>
            <h2>Choose a FILE</h2>
           
          </div>

          <label className="file-picker">
            <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} />
            <span className="file-icon">PDF</span>
            <strong>{selectedFile ? selectedFile.name : "Click to select a PDF"}</strong>
            <small>Upload limit is controlled by the backend.</small>
          </label>

          <button className="primary-button" disabled={isUploading} type="submit">
            {isUploading ? "Indexing..." : "Upload and summarize"}
          </button>

          {document && (
            <button className="ghost-button" onClick={handleReset} type="button">
              Clear current document
            </button>
          )}

          {status && <p className="status">{status}</p>}
          {error && <p className="error">{error}</p>}
        </form>

        <section className="panel result-panel">
          <div className="result-header">
            <div>
              <p className="step">02 / Summary</p>
              <h2>{document ? document.filename : "No document yet"}</h2>
            </div>
            <button
              className="secondary-button"
              disabled={!document || isSummarizing}
              onClick={() => runSummary()}
              type="button"
            >
              {isSummarizing ? "Summarizing..." : "Regenerate"}
            </button>
          </div>

          <article className={summary ? "answer-box" : "answer-box empty"}>
            {summary || "Upload a PDF to generate a summary here."}
          </article>
        </section>
      </section>

      <section className="panel chat-panel">
        <div>
          <p className="step">03 / RAG Q&A</p>
          <h2>Ask the document</h2>
          <p className="muted">
            Answers are generated from retrieved PDF chunks through your backend.
          </p>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="message assistant">
              Try: “What are the key takeaways?” or “What action items are mentioned?”
            </div>
          ) : (
            messages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))
          )}
        </div>

        <form className="question-form" onSubmit={handleAsk}>
          <textarea
            disabled={!document}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              document
                ? "Ask a question about the PDF..."
                : "Upload a PDF before asking questions."
            }
            rows="2"
            value={question}
          />
          <button className="send-button" disabled={!canAsk} type="submit">
            {isAsking ? "..." : "Ask"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
