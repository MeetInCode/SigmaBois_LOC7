"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  // Fetch documents from collection on page load
  useEffect(() => {
    fetch("http://127.0.0.1:5328/api/list_documents")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setDocuments(data.documents.documents);
        }
      })
      .catch((err) => setError("Error fetching documents: " + err.message));
  }, []);

  return (
    <div>
      <h1>Collection Documents</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li key={doc.$id} className="border p-2 my-2 rounded shadow">
              <pre>{JSON.stringify(doc, null, 2)}</pre>
            </li>
          ))
        ) : (
          <p>No documents found.</p>
        )}
      </ul>
    </div>
  );
}
