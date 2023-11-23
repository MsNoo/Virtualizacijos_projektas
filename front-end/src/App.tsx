import { type FC, type ChangeEvent, useState, useEffect } from "react";
import axios from "axios";

import type { TDocument } from "./types";

// TODO: fronta +-susibuildint, palikt nginx+react front-end kaip atskira ir prisidet dar backend expresiuka su s3 upload endpointu
// export/docker env var AWS auth -> leis naudot aws-sdk -> expresse s3 upload endpointai -> fronta subuildint ir delete react dir kad tiesiog axiosas butu ir rodytu updated + delete mygtuka
// TODO: nginx 404 refresh fix
export const App: FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<TDocument[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelectedFiles = Array.from(event.target.files || []);

    setSelectedDocuments((prevSelectedDocuments) => [
      ...prevSelectedDocuments,
      ...newSelectedFiles,
    ]);
  };

  useEffect(() => {
    // TODO: nginx reverse to use http://api https://stackoverflow.com/a/77060234

    // js runs in the browser, so it can't access the docker socket https://stackoverflow.com/a/56375180
    axios
      .get("http://localhost:3000/api/v1/documents")
      .then((res) => {
        if (Array.isArray(res.data.documents)) {
          setDocuments(res.data.documents);
        }
      })
      .catch((err) => {
        console.error(err);
      });
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

      <main>
        <h2 id="subtitle">
          Mažinkite bendruomenės išlaidas dalindamiesi elektroninėje erdvėje su
          elitiniais nariais!
        </h2>

        <input
          style={{
            fontSize: "1.5rem",
            padding: "1rem 2rem",
            marginBottom: "6rem",
            textAlign: "center",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            boxShadow: "0px 12px 22px 1px rgba(0, 0,100, .07)",
            borderRadius: "6px",
          }}
          onChange={handleInputChange}
          type="file"
          multiple
        />

        <section id="documents-list">
          {selectedDocuments.map((document, index) => (
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, .03)",
                padding: "2rem 1rem",
                width: "80vw",
                textAlign: "center",
                margin: "0 auto",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: "1rem",
                borderRadius: "32px",
                display: "flex",
              }}
              key={index}
            >
              <p className="document-name">{document.name}&nbsp;</p>

              <p className="document-size">
                <i>{(document.size / 1024 / 1024).toFixed(1)}&nbsp;MB</i>
              </p>
            </div>
          ))}
        </section>

        {/* TODO: MUI Grid  */}
        <div id="all-documents-container">
          {documents.map((document) => (
            <div id="document-container" key={document.name + document.url}>
              <p className="bold">{document.name}</p>
              <p className="fetched-document-size">{document.size}B</p>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p id="footer-credits" aria-label="file sharing site credits">
          © {new Date().getFullYear()}&nbsp; Jonas Girdzijauskas, Akvilė
          Mickevičūtė, Tadas Kastanauskas, Renata Marcinauskaitė
        </p>
      </footer>
    </div>
  );
};
