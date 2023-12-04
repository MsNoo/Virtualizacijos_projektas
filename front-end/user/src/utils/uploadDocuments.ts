import axios from "axios";

export const uploadDocuments = async (formData: FormData) => {
  return axios
    .post("http://localhost:5001/api/v1/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res;
    })
    .catch(console.error);
};
