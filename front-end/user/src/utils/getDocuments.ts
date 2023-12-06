import axios from "axios";

import type { TDocument } from "../types";

export const getDocuments = async () => {
  return axios
    .get<{ documents: TDocument[] }>(
      `${process.env.REACT_APP_DOCUMENT_MICROSERVICE_URL}/api/v1/documents`
    )
    .then((res) => {
      if (!Array.isArray(res.data.documents)) {
        return [];
      }

      return res.data.documents;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};
