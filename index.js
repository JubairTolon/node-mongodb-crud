const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        //get user : finding multiple users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
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