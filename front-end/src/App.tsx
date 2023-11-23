import { useState } from "react";

// TODO: fronta +-susibuildint ir tada persimest ivetoj react tsg express nes ten ir node pasieks
// export/docker env var AWS auth -> leis naudot aws-sdk -> expresse s3 upload endpointai -> fronta subuildint ir delete react dir kad tiesiog axiosas butu ir rodytu updated + delete mygtuka
type TDocument = File;

export const App = () => {
  const [documents, setDocuments] = useState<TDocument[]>([]);

  return (
    <div className="App">
      <main>
        <h1
          style={{
            padding: "2rem 1rem",
            boxShadow: "0px 12px 22px 1px rgba(0, 0,100, .25)",
            textTransform: "capitalize",
            marginBottom: "4rem",
            background:
              "linear-gradient(90deg, rgba(202,105,222,1) 0%, rgba(119,222,221,1) 35%, rgba(122,212,155,1) 100%)",
          }}
        >
          Slaptoji Failų Talpykla
        </h1>

        <h2 style={{ marginBottom: "4rem", fontWeight: 300 }}>
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
          type="file"
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            setDocuments((prevDocuments) => [...prevDocuments, ...files]);
          }}
        />

        <section style={{ marginTop: "6rem" }}>
          {documents.map((document, index) => (
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
              <p style={{ fontSize: "20px", marginRight: "0.3REM" }}>
                {document.name}&nbsp;
              </p>
              <p
                style={{
                  color: "rgb(0,0,0,0.35)",
                  fontSize: "20px",
                }}
              >
                <i> {(document.size / 1024 / 1024).toFixed(1)} MB</i>
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer style={{ marginTop: "12rem" }}>
        <p
          style={{
            textAlign: "center",
            borderTop: "1px solid rgb(0,0,0,1)",
            paddingTop: "2rem",
            width: "max-content",
            margin: "0 auto",
            fontSize: "1.2rem",
            color: "rgb(0,0,0,0.885)",
          }}
        >
          © {new Date().getFullYear()} Jonas Girdzijauskas, Akvilė Mickevičūtė,
          Tadas Kastanauskas, Renata Marcinauskaitė
        </p>
      </footer>
    </div>
  );
};
