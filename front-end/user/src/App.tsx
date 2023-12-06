import { type FC, type ChangeEvent, useState, useEffect } from "react";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";

import type { TDocument } from "./types";
import {
  getDocuments,
  uploadDocuments,
  getCredits,
  getFormattedSize,
} from "./utils";
import { documentGridColumns } from "./utils/documentGridColumns";

// export/docker env var AWS auth -> leis naudot aws-sdk -> expresse s3 upload endpointai -> fronta subuildint ir delete react dir kad tiesiog axiosas butu ir rodytu updated + delete mygtuka
// TODO: vu docker: data storage
export const App: FC = () => {
  const [_documents, setDocuments] = useState<any[]>([]);
  const [_selectedDocuments, setSelectedDocuments] = useState<TDocument[]>([]);
  const _credits = getCredits();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelectedFiles = Array.from(event.target.files || []);

    setSelectedDocuments((prevSelectedDocuments) => [
      ...prevSelectedDocuments,
      ...newSelectedFiles,
    ]);
  };

  const handleRemoveSelectedDocument = (document: TDocument) => {
    setSelectedDocuments((prevSelectedDocuments) =>
      prevSelectedDocuments.filter(
        (prevSelectedDocument) => prevSelectedDocument.name !== document.name
      )
    );
  };

  const refreshDocuments = async () => {
    const documents = await getDocuments();

    setDocuments(documents);
  };

  const handleSelectedDocumentsUpload = async () => {
    const formData = new FormData();

    _selectedDocuments.forEach((document) => {
      formData.append("files", document);
    });

    await uploadDocuments(formData);

    setSelectedDocuments([]);

    await refreshDocuments();
  };

  useEffect(() => {
    // TODO: nginx reverse to use http://api https://stackoverflow.com/a/77060234
    refreshDocuments();
  }, []);

  return (
    <div
      className="App"
      aria-label="virtualisation project main view container"
    >
      <header>
        <h1 id="header-title" aria-label="file sharing site title">
          Slaptoji dokumentų saugykla
        </h1>
      </header>

      <main id="view-container">
        <h2 id="subtitle">
          Saugokime gamtą dalindamiesi dokumentais elektroninėje erdvėje
        </h2>

        <input
          onChange={handleInputChange}
          id="file-upload-input"
          type="file"
          multiple
        />

        <section id="documents-list">
          {_selectedDocuments.map((document, index) => (
            <div id="selected-upload-document-container" key={index}>
              <p className="document-name">{document.name}&nbsp;</p>
              <p className="document-size">{getFormattedSize(document.size)}</p>
              <p className="document-delete-button">
                <IconButton
                  onClick={() => handleRemoveSelectedDocument(document)}
                >
                  <GridDeleteIcon />
                </IconButton>
              </p>
            </div>
          ))}

          {_selectedDocuments.length ? (
            <Button variant="outlined" onClick={handleSelectedDocumentsUpload}>
              Upload
            </Button>
          ) : null}
        </section>

        <div id="all-documents-container">
          <DataGrid
            rows={_documents}
            columns={documentGridColumns}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
          />
        </div>
      </main>

      <footer>
        <p id="footer-credits" aria-label="file sharing site credits">
          {_credits}
        </p>
      </footer>
    </div>
  );
};
