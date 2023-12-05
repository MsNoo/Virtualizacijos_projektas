import express from "express";

export const documentController = express.Router();

const tempDb = {
  documents: [
    {
      id: 0,
      url: "https:google.com",
      name: "free-office.pdf",
      size: 4942442,
    },
    {
      id: 1,
      url: "https:google.com",
      name: "google-excel-hacks.docx",
      size: 2222221942,
    },
    { id: 2, url: "https:google.com", name: "not-a-virus.sh", size: 19422 },
  ],
};

documentController.get("/", (_, res) => {
  // TODO: GET S3 aws-sdk v3
  return res.status(200).json(tempDb).end();
});

documentController.post("/", (req, res) => {
  const files = req.files;

  if (!files) {
    return res.status(400).json({ message: "No files provided." }).end();
  }

  const newFiles = files.map((file, i) => {
    return {
      id: tempDb.documents.length + i,
      url: "s3 url bus",
      name: file.originalname,
      size: file.size || file?.buffer?.bytelength || file?.buffer?.length,
    };
  });

  tempDb.documents.push(...newFiles);

  return res
    .status(200)
    .json({ message: "Successfully added documents" })
    .end();
});
