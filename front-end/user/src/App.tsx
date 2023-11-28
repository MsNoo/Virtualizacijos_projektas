import { type FC, type ChangeEvent, useState, useEffect } from "react";

import type { TDocument } from "./types";
import { getDocuments, getCredits } from "./utils";
import { getFormattedSize } from "./utils/getFormattedSize";

// TODO: fronta +-susibuildint, palikt nginx+react front-end kaip atskira ir prisidet dar backend expresiuka su s3 upload endpointu
// export/docker env var AWS auth -> leis naudot aws-sdk -> expresse s3 upload endpointai -> fronta subuildint ir delete react dir kad tiesiog axiosas butu ir rodytu updated + delete mygtuka
// TODO: nginx 404 refresh fix
// TODO: vu docker: data storage, virtual segregation networks
// TODO: translations simple example
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

  useEffect(() => {
    // TODO: nginx reverse to use http://api https://stackoverflow.com/a/77060234
    getDocuments().then(setDocuments);
  }, [getDocuments]);

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

      <main>
        <h2 id="subtitle">
          Mažinkite bendruomenės išlaidas dalindamiesi elektroninėje erdvėje su
          elitiniais nariais!
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
            </div>
          ))}
        </section>

        {/* TODO: MUI Grid  */}
        <div id="all-documents-container">
          {_documents.map((document) => (
            <div id="document-container" key={document.name + document.url}>
              <p className="bold">{document.name}</p>
              <p className="fetched-document-size">{document.size}B</p>
            </div>
          ))}
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
