import pg from "pg";
const { Client } = pg;

const tempDb = {
  documents: [],
};

const getDbClient = () => {
  return new Client({
    user: "postgres",
    database: "document-database",
    port: 5432,
    // TODO:  ne localhost o db url
    host: "127.0.0.1",
    password: "university",
    ssl: false,
  });
};

export const getDocuments = async () => {
  const client = getDbClient();

  try {
    await client.connect();

    const res = await client.query("select * from documents      ");

    console.info(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
  return tempDb;
};

export const saveDocument = async (files) => {
  const client = getDbClient();

  try {
    await client.connect();

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
