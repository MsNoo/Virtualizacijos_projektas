import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileParser from "express-multipart-file-parser";
dotenv.config();

import { documentController } from "./controllers/document.controller.js";

const PORT = 5001;
const app = express();

app.use(fileParser);
app.use(express.json());
app.use(cors());

app.use("/api/v1/documents", documentController);

app.listen(PORT, () => {
  console.log(`document-microservice listening on ${PORT}.`);
});
