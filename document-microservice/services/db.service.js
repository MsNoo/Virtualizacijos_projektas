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
  } finally {
    await client.end();
  }
};

export const saveDocument = async (files) => {
  const client = getDbClient();

  await client.connect();
  try {
    const res = await client.query(
      "INSERT INTO documents (uploader_ip, name, size) VALUES ('12.42.13.15', 'aws_guide.pdf',44242);"
    );

    return res;
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
};
