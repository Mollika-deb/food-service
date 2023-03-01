const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ineyp7q.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        const serviceCollection = client.db('FoodItems').collection('services');
        const reviewCollection = client.db('FoodItems').collection('reviews');

        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);

        })

        app.get('/allservices', async (req, res) => {
            const query = {};
            const coursor = serviceCollection.find(query);
            const services = await coursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.get('/reviews', async(req, res)=>{
            let query = {};
            
            if(req.query.itemId){
                        query = {
                            itemId: req.query.itemId 
                        }
                    }
                    const coursor = reviewCollection.find(query);
                        const review = await coursor.toArray();
                        res.send(review);
            
        })
        app.get('/myreviews', async(req, res)=>{
            console.log(req.query)
            let query = {};
            
          
            if(req.query.email){
                        query = {
                            email: req.query.email 
                        }
                    }
                    const coursor = reviewCollection.find(query);
                        const myReview = await coursor.toArray();
                        res.send(myReview);
            
        })

        app.post('/additem', async (req, res) => {
            const item = req.body;
            const addItem = await serviceCollection.insertOne(item);
            res.send(addItem);
        });

        // app.delete('/myreviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id)};
        //     const result = await reviewCollection.deleteOne(query);
        //     res.send(result);
            
        // })

       
    }
    catch{

    }
}
run().catch(err =>console.log(err))


app.get('/',(req, res)=>{
    res.send("food server is running")
})

app.listen(port, ()=>{
    console.log(`food serve is runing on ${port}`)
})