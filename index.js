const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

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
        const user = { id: 1, name: 'tolon', age: 27 };
        const result = await userCollection.insertOne(user);
        console.log(`user inserted with id: ${result.insertedId}`)
    }
    finally {
        //    await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running node crud server');
})

app.listen(port, () => {
    console.log("crud server in running");
})