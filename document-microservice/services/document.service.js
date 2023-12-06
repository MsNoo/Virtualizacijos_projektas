import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { getDocuments, saveDocument } from "./db.service.js";
import { getS3Client, uploadFile } from "./s3.service.js";

export const saveDocuments = async (files) => {
  const s3Client = getS3Client("us-west-2");

  for (const file of files) {
    await uploadFile(
      file,
      file.originalname,
      process.env.S3_BUCKET_NAME,
      s3Client
    );

    await saveDocument();
  }

  console.info(`Added ${Object.keys(files).length} documents.`);
};

export const getSignedDocuments = async () => {
  const s3Client = getS3Client("us-west-2");
  const { documents } = await getDocuments();

  try {
    const signedDocuments = await Promise.all(
      documents.map(async (document) => {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: document.name,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 7_200 });

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
