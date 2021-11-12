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
      const usersCollection = database.collection('users');

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        });

      
       // GET Single product
        app.get('/product/:id', async (req, res) => {
            const name = req.params.name;
           
            const query = { name: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.json(product);
        })
      
      


   app.post('/product', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json(result)
   });
      
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     let isAdmin = false;
        //     if (user?.role === 'admin') {
        //         isAdmin = true;
        //     }
        //     res.json({ admin: isAdmin });
        // })
      
      
       app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            
            res.json(result);
        });
        

app.get("/ClientReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
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