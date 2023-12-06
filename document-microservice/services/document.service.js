import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { getDocuments, saveDocument } from "./db.service.js";
import { getS3Client, uploadFile } from "./s3.service.js";

export const saveDocuments = async (files) => {
  const s3Client = getS3Client("us-west-2");
  const { documents } = await getDocuments();

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

export const getSignedDocuments = async () => {
  const s3Client = getS3Client("us-west-2");
  const { documents } = await getDocuments();

  try {
    const signedDocuments = Promise.all(
      documents.map(async (document) => {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: document.name,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 7_200 });

        // await saveDocument();

        return {
          ...document,
          url,
        };
      })
    );

    return { signedDocuments };
  } catch (error) {
    throw Error(error);
  }
};
