import pg from "pg";
const { Client } = pg;

const getDbClient = () => {
  return new Client({
    user: "postgres",
    database: "document-database",
    port: 5432,
    host: "document-database",
    password: "university",
    ssl: false,
  });
};

export const getDocuments = async () => {
  const client = getDbClient();

  try {
    await client.connect();

    const res = await client.query("SELECT * FROM documents;");

    return {
      documents: res.rows,
    };
  } catch (err) {
    console.error(err);
    return { documents: [] };
  } finally {
    await client.end();
  }
};

export const saveDocumentInRepository = async (file, uploaderIp) => {
  const client = getDbClient();
  // adjust for all browsers and devices
  const adaptedFileSize =
    file?.size ||
    file?.arrayBuffer?.length ||
    file?.arrayBuffer?.byteLength ||
    file?.buffer?.length ||
    file?.buffer?.byteLength ||
    file?.length ||
    file?.byteLength ||
    0;

  file;
  try {
    await client.connect();

    // if we have time we can display why systems like this require sql escaping
    const insertQueryValues = `('${uploaderIp}', '${file.originalname}',${adaptedFileSize})`;

    const res = await client.query(
      `INSERT INTO documents (uploader_ip, name, size) VALUES ${insertQueryValues};`
    );

    return res;
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
};
