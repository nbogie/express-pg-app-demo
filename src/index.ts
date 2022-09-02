import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client, ClientConfig } from "pg";

const app = express();

// read in contents of .env file as environment variables
dotenv.config();

//Configure middleware:
/** Parses JSON data in a request body automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

const dbConfig: ClientConfig = {
  connectionString: getEnvVarOrFail("DATABASE_URL"),
  ssl: { rejectUnauthorized: false }, //this only for heroku, or render (internal)
};

const client = new Client(dbConfig);

app.get("/", (req, res) => {
  res.send("hello!");
});

// GET /items
app.get("/items", async (req, res) => {
  try {
    const dbResult = await client.query("select * from films");
    console.log(`Ran query, got ${dbResult.rowCount} row(s)`);
    res.send({ data: dbResult.rows });
  } catch (error) {
    logErrorMessage(error);
    res.status(500).json({ error: getErrorMessageOrDefault(error) });
  }
});

function getErrorMessageOrDefault(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function logErrorMessage(error: unknown) {
  console.error(error);
}

function getEnvVarOrFail(varName: string) {
  const val = process.env[varName];
  if (!val) {
    throw new Error("Missing env var: " + varName);
  }
  return val;
}

async function connectAndStart() {
  //we don't want to start listening til we have a successful connection
  await client.connect();
  console.log("Established connection to db");
  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
}

connectAndStart();
