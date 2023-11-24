import axios from "axios";

import type { TDocument } from "../types";

export const getDocuments = async () => {
  // js runs in the browser, so it can't access the docker socket https://stackoverflow.com/a/56375180
  return (
    axios
      // TODO: API URL
      .get<{ documents: TDocument[] }>("http://localhost:3000/api/v1/documents")
      .then((res) => {
        if (!Array.isArray(res.data.documents)) {
          throw new Error(`Documents are not an array: ${res.data.documents}.`);
        }

        return res.data.documents;
      })
      .catch((err) => {
        console.error(err);
        return [];
      })
  );
};
