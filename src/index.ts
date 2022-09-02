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

// GET /items
app.get("/items", (req, res) => {
  res.json([]);
});

function getEnvVarOrFail(varName: string) {
  const val = process.env[varName];
  if (!val) {
    throw new Error("Missing env var: " + varName);
  }
  return val;
}

const connectionStringInternal = getEnvVarOrFail("DATABASE_URL_INTERNAL");
const connectionStringExternal = getEnvVarOrFail("DATABASE_URL_EXTERNAL");

app.get("/testI1", async (req, res) => {
  doAllWithDBConfig(
    req,
    res,
    {
      connectionString: connectionStringInternal,
      ssl: true,
    },
    "internal, ssl on"
  );
});

app.get("/testI2", async (req, res) => {
  doAllWithDBConfig(
    req,
    res,
    {
      connectionString: connectionStringInternal,
      ssl: false,
    },
    "internal, ssl false"
  );
});

app.get("/testI3", async (req, res) => {
  doAllWithDBConfig(
    req,
    res,
    {
      connectionString: connectionStringInternal,
      ssl: { rejectUnauthorized: false },
    },
    "internal, ssl rU"
  );
});

app.get("/testX1", async (req, res) => {
  doAllWithDBConfig(
    req,
    res,
    {
      connectionString: connectionStringExternal,
      ssl: true,
    },
    "external, ssl true"
  );
});

app.get("/testX2", async (req, res) => {
  doAllWithDBConfig(
    req,
    res,
    {
      connectionString: connectionStringExternal,
      ssl: false,
    },
    "ext, ssl false"
  );
});

app.get("/testX3", async (req, res) => {
  doAllWithDBConfig(
    req,
    res,
    {
      connectionString: connectionStringExternal,
      ssl: { rejectUnauthorized: false },
    },
    "ext ssl RU"
  );
});

async function doAllWithDBConfig(
  req: any,
  res: any,
  dbConfig: ClientConfig,
  testLabel: string
) {
  //DON'T DO THIS!
  //We're intentionally testing the db connection INSIDE of the route handler to allow
  //multiple config tests on the server
  let client;

  try {
    console.log({ dbConfig });

    client = new Client(dbConfig);
    await client.connect();
    const dbResult = await client.query("select now()");
    console.log(dbResult.rows);
    res.send({ msg: testLabel, data: dbResult.rows });

    //TODO: this might be a problem if the conn is closed before dbResult.rows is sent to the client.
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
      console.error(error);
    } else {
      console.error(message);
    }
    res.status(500).json({ test: "IN TEST: " + testLabel, error: message });
  } finally {
    if (client) {
      await client.end();
    }
  }
}
app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
