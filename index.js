const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("website is running.........");
});

//foundation
//Z4OKlujI34dPH2BE
const uri =
  "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhrby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const CampaignCollection = client.db("campaignDB").collection("campaign");
    const donatedCollection = client.db("campaignDB").collection("donated");

    app.get("/campaign", async (req, res) => {
      const curser = CampaignCollection.find();
      const result = await curser.toArray();
      res.send(result);
    });

    app.post("/addCampaign", async (req, res) => {
      const newCampaign = req.body;
      console.log(newCampaign);
      const result = await CampaignCollection.insertOne(newCampaign);
      res.send(result);
    });

    app.get("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CampaignCollection.findOne(query);
      res.send(result);
    });


    app.delete("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CampaignCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCampaign = req.body;
      const Campaign = {
        $set: {
          title: updateCampaign.title,
          image: updateCampaign.image,
          type: updateCampaign.type,
          description: updateCampaign.description,
          minDonation: updateCampaign.minDonation,
          deadline: updateCampaign.deadline,
        },
      };
      const result = await CampaignCollection.updateOne(filter, Campaign, options);
      res.send(result);
    });


    /// Dontaed

    
    app.get("/newDonated", async (req, res) => {
      const curser = donatedCollection.find();
      const result = await curser.toArray();
      res.send(result);
    });

    app.post("/newDonated", async (req, res) => {
      const newDonated = req.body;
      console.log(newDonated);
      delete newDonated._id;
      const result = await donatedCollection.insertOne(newDonated);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`coffee website is running on port  : ${port}`);
});
