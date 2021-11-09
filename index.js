const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ieoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Async Function

async function run() {
  try {
    await client.connect();
    console.log("Database connect sucessfully");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// ---------------------------------
// ---------------------------------
// ---------------------------------
// ---------------------------------

app.get("/", (req, res) => {
  res.send("BK Camera");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
