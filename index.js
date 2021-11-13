const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ridwg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run()
{
    try
    {
        await client.connect();
        const database = client.db('biker_den');
      const reviewCollection = database.collection('review');
        const productCollection = database.collection('product');
         const orderCollection = database.collection("orders");
      const usersCollection = database.collection('users');

        // get products
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        });

      
       // GET Single product
            app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleProduct = await productCollection.findOne(query);
      // console.log('load user with id: ', id);
      res.send(singleProduct);
    });
      
      


   app.post('/product', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json(result)
   });
      
       
      


// POST Orders API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
        
    //      // Checking is user are Admin
    // app.get("/users/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const user = await usersCollection.findOne(query);
    //   let isAdmin = false;
    //   if (user?.role === "admin") {
    //     isAdmin = true;
    //   }
    //   res.json({ admin: isAdmin });
    // });
        
        
         // GET All User Orders
    app.get("/myOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });
        
    // GET Single User Orders
    app.get("/myOrders/:email", async (req, res) => {
      const result = await orderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
        
        
        

        
            // GET All User Orders
    app.get("/myOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });
        
         // GET Single User Orders
    app.get("/myOrders/:email", async (req, res) => {
      const result = await orderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
        
        
          // Update Order Status
    app.put("/updateStatus/:id", (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body.status;
      console.log(updatedStatus);
      const filter = { _id: ObjectId(id) };
      console.log(updatedStatus);
      orderCollection
        .updateOne(filter, {
          $set: { status: updatedStatus },
        })
        .then((result) => {
          res.send(result);
        });
    });


      // USER POST API
       app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result)
            res.json(result);
       });
        
            // USER UPDATE API
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
      res.json(result);
    });
        


        //GET Reviews API
app.get("/clientReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

        
        
    // POST Single Review API
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });
        
        
        
          app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
        const requesterAccount = await usersCollection.findOne({
          email: requester,
        });
        if (requesterAccount.role === "admin") {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: "admin" } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      } else {
        res
          .status(403)
          .json({ message: "you do not have access to make admin" });
      }
    });
        
        
        
        

    }
    finally
    {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello biker!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})