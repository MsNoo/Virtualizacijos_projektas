import express from "express";

import {
  getSignedDocuments,
  saveDocuments,
} from "../services/document.service.js";

export const documentController = express.Router();

documentController.get("/", async (_, res) => {
  const documents = await getSignedDocuments();

  return res.status(200).json(documents).end();
});

documentController.post("/", async (req, res) => {
  const files = req.files;

  if (!files) {
    return res.status(400).json({ message: "No files provided." }).end();
  }

  await saveDocuments(files);

  return res
    .status(201)
    .json({ message: `Added ${Object.keys(files).length} documents.` })
    .end();
});
