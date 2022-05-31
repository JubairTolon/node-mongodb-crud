const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');

//use middleware
app.use(cors());
app.use(express.json());

////////mongoDB connection ////////////

//userName: dbuserTolon
//pass: aw2UmJjp7pUbSuIq

const uri = "mongodb+srv://dbuserTolon:aw2UmJjp7pUbSuIq@cluster0.c1o1r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        //get users : finding multiple users and sent to client server
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        //get users : finding single user and sent to client server
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })
        //update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })



        //DELETE a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        //manually data insert to DB
        /* const user = { id: 1, name: 'tolon', age: 27 };
        const result = await userCollection.insertOne(user);
        console.log(`user inserted with id: ${result.insertedId}`); */

        //POST user: insert data from client site
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });
    }
    finally {
        //    await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log("crud server in running");
})