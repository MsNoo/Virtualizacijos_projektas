import express from "express";

export const documentController = express.Router();

documentController.get("/", (_, res) => {
  // TODO: GET S3 aws-sdk v3

  console.error(3331);
  return res
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
