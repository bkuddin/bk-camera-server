const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
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
    const database = client.db("bkCameras");
    const camerasCollection = database.collection("cameras");
    const ordersCollection = database.collection("orders");

    // API POST
    app.post("/addCameras", async (req, res) => {
      const camera = req.body;
      const result = await camerasCollection.insertOne(camera);
      console.log(result);
      res.json(result);
    });

    // API GET For Explore Page
    app.get("/allCameras", async (req, res) => {
      const cursor = camerasCollection.find({});
      const cameras = await cursor.toArray();
      res.send(cameras);
    });

    // API GET For Cameras Page
    app.get("/cameras", async (req, res) => {
      const cursor = camerasCollection.find({});
      const cameras = await cursor.limit(8).toArray();
      res.send(cameras);
    });

    // API GET For Single ID
    app.get("/allCameras/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await camerasCollection.findOne(query);
      console.log(result);
      res.json(result);
    });

    // API POST for Order

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });
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
