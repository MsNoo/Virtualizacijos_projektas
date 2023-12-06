import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const getS3Client = (region = "us-west-2") => {
  return new S3Client({
    region,
    apiVersion: "2006-03-01",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const uploadFile = async (file, name, bucket, client) => {
  const { mimetype, buffer } = file;

  try {
    const s3Upload = new Upload({
      client,
      params: {
        ServerSideEncryption: "AES256",
        ContentType: mimetype,
        Bucket: bucket,
        Body: buffer,
        Key: name,
      },
    });

    console.info("Uploading file...");

    const res = await s3Upload.done();

    console.info("Success in uploading.");

    return res;
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
};
