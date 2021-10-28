const express = require("express");
const app = express();
const port = 5000;
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdeet.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("insertDB");
    const servicesCollection = database.collection("haiku");

    // get api

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // get single service

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // post api

    app.post("/services", async (req, res) => {
      const service = req.body;

      console.log("Hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // delete api

    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Car Mechanics Server");
});

app.listen(port, () => {
  console.log("Running genius server on port:", port);
});
