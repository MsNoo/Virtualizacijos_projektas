import { getS3Client, uploadFile } from "./s3.service.js";
import { getDocuments } from "./db.service.js";

export const saveDocuments = async (files) => {
  const s3Client = getS3Client("us-west-2");
  const { documents } = getDocuments();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const uploadedFile = await uploadFile(
      file,
      file.originalname,
      process.env.S3_BUCKET_NAME,
      s3Client
    );

    documents.push({
      id: documents.length + i,
      urlKey: uploadedFile.Key,
      name: file.originalname,
      size: file.size || file?.buffer?.bytelength || file?.buffer?.length,
    });
  }

  // TODO: save to table
};
