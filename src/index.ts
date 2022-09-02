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

app.get("/", (req, res) => {
  res.send("hello!");
});

const dbConfig: ClientConfig = {
  connectionString: getEnvVarOrFail("DATABASE_URL"),
  ssl: { rejectUnauthorized: false }, //this only for heroku, or render (internal)
};

const client = new Client(dbConfig);
client.connect(); //TODO: await this!

// GET /items
app.get("/items", async (req, res) => {
  try {
    const dbResult = await client.query("select now()");
    console.log("ran query, got", dbResult.rows);
    res.send({ data: dbResult.rows });

    //TODO: this might be a problem if the conn is closed before dbResult.rows is sent to the client.
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
      console.error(error);
    } else {
      console.error(message);
    }
    res.status(500).json({ error: message });
  }
});

function getEnvVarOrFail(varName: string) {
  const val = process.env[varName];
  if (!val) {
    throw new Error("Missing env var: " + varName);
  }
  return val;
}

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
