import { type FC, type ChangeEvent, useState } from "react";

import type { TDocument } from "./types";

// TODO: fronta +-susibuildint, palikt react front-end kaip atskira ir prisidet dar backend expresiuka su s3 upload endpointu
// export/docker env var AWS auth -> leis naudot aws-sdk -> expresse s3 upload endpointai -> fronta subuildint ir delete react dir kad tiesiog axiosas butu ir rodytu updated + delete mygtuka

export const App: FC = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<TDocument[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelectedFiles = Array.from(event.target.files || []);

    setSelectedDocuments((prevSelectedDocuments) => [
      ...prevSelectedDocuments,
      ...newSelectedFiles,
    ]);
  };

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

        {/* TODO: list all fetched selectedDocuments */}
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
