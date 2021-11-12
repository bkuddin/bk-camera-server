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
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    // API POST (Admin)
    app.post("/addCameras", async (req, res) => {
      const camera = req.body;
      const result = await camerasCollection.insertOne(camera);
      console.log(result);
      res.json(result);
    });

    // API GET For Explore Page (Admin)
    app.get("/allCameras", async (req, res) => {
      const cursor = camerasCollection.find({});
      const cameras = await cursor.toArray();
      res.send(cameras);
    });

    // API Delete : For Manage Cameras Page (Admin)
    app.delete("/allCameras/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await camerasCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });

    // API PUT: for Manage Cameras Update

    app.put("/allCameras/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;

      console.log(updatedInfo);

      const result = await camerasCollection.updateOne(
        { _id: id },
        {
          $set: {
            brand: updatedInfo.brand,
            model: updatedInfo.model,
            options: updatedInfo.options,
            brief: updatedInfo.brief,
            description: updatedInfo.description,
            price: updatedInfo.price,
            img: updatedInfo.img,
          },
        }
      );
      console.log(result);
      res.json(result);
    });

    // API GET For Cameras Page (Limit Version; Admin)
    app.get("/cameras", async (req, res) => {
      const cursor = camerasCollection.find({});
      const cameras = await cursor.limit(8).toArray();
      res.send(cameras);
    });

    // API GET: For showing a Single ID information in details, (Here in this project we show via Order page)
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

    // API GET: For Manage Order Page (Admin)
    app.get("/allOrders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // API Delete : For Manage Order Page (Admin)
    app.delete("/allOrders/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });
    // API PUT : For Manage Order Page (Admin)
    app.put("/statusUpdate/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      console.log(req.params.id);
      const result = await ordersCollection.updateOne(filter, {
        $set: {
          status: req.body.status,
        },
      });
      res.send(result);
      console.log(result);
    });

    // API GET for My Order Page, through specific email (User)
    app.get("/orders/:email", async (req, res) => {
      console.log(req.params.email);

      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      // console.log(result);
      res.json(result);
    });

    // Delete API for My Order Page, (user)
    app.delete("/orders/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });

    // API POST for Make Review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    // API GET For Reviews Page
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // API POST for Save User
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // API PUT for Update User (Upsert Case especially for Google sign-in)
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });

    // API PUT Make Admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.json(result);
    });

    // API GET For users
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }

      res.send({ admin: isAdmin });
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
