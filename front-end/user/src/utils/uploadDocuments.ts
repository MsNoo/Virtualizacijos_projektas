import axios from "axios";

export const uploadDocuments = async (formData: FormData) => {
  return axios
    .post(
      `${process.env.REACT_APP_DOCUMENT_MICROSERVICE_URL}/api/v1/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch(console.error);
};
