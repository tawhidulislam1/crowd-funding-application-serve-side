const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("website is running.........");
});


//foundation
//Z4OKlujI34dPH2BE
const uri = "mongodb+srv://foundation:Z4OKlujI34dPH2BE@cluster0.zhrby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const CampaignCollection = client.db("campaignDB").collection("campaign");

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


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`coffee website is running on port  : ${port}`);
  });
  