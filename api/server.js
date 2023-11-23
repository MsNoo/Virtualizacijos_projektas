import express from "express";
import cors from "cors";

const PORT = 3_000;
const app = express();

app.use(express.json());
app.use(cors());

// TODO: move to controller structure
app.get("/api/v1/documents", (_, res) => {
  // TODO: GET S3 aws-sdk v3
  res
    .status(200)
    .json({
      documents: [
        { url: "https:google.com", name: "free-office.pdf", size: 4942442 },
        {
          url: "https:google.com",
          name: "google-excel-hacks.docx",
          size: 2222221942,
        },
        { url: "https:google.com", name: "not-a-virus.sh", size: 19422 },
      ],
    })
    .end();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}.`);
});
