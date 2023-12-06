import { type FC, type ChangeEvent, useState, useEffect } from "react";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { IconButton } from "@mui/material";

import type { TDocument } from "./types";
import {
  getDocuments,
  uploadDocuments,
  getCredits,
  getFormattedSize,
} from "./utils";
import { documentGridColumns } from "./utils/documentGridColumns";

export const App: FC = () => {
  const [_documents, setDocuments] = useState<TDocument[]>([]);
  const [_isLoading, setIsLoading] = useState<boolean>(false);
  const [_selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const _credits = getCredits();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelectedFiles = Array.from(event.target.files || []);

    setSelectedDocuments((prevSelectedDocuments) => [
      ...prevSelectedDocuments,
      ...newSelectedFiles,
    ]);
  };

  const handleRemoveSelectedDocument = (document: File) => {
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

    setIsLoading(true);

    await uploadDocuments(formData);

    setIsLoading(false);

    setSelectedDocuments([]);

    await refreshDocuments();
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  return (
    <div
      className="App"
      aria-label="virtualisation project main view container"
    >
      <header>
        <h1 id="header-title" aria-label="file sharing site title">
          Slaptoji Failų Talpykla
        </h1>
      </header>

      <main id="view-container">
        <h2 id="subtitle">
          Mažinkite bendruomenės išlaidas dalindamiesi elektroninėje erdvėje su
          elitiniais nariais!
        </h2>

        <input
          type="file"
          onChange={handleInputChange}
          multiple
          id="file-upload-input"
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
            <LoadingButton
              onClick={handleSelectedDocumentsUpload}
              loading={_isLoading}
              variant="outlined"
            >
              Upload
            </LoadingButton>
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
