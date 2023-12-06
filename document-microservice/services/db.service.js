import pg from "pg";
const { Client } = pg;

const tempDb = {
  documents: [],
};

export const getDocuments = async () => {
  const client = new Client({
    user: "postgres",
    database: "document-database",
    port: 5432,
    host: "127.0.0.1",
    password: "university",
    ssl: false,
  });

  await client.connect();

  try {
    const res = await client.query("select * from documents      ");

    console.info(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
  // TODO: axios ne localhost o db url
  return tempDb;
};
