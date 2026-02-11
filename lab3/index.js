import express from 'express'
import mongoose from 'mongoose';
import Product from './models/product.model.js';

const app = express()
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/api/products', async (req, res)=>{
  try{
    const products =  await Product.find({});
    res.status(200).json(products);
  }catch(err){
    res.status(500).send({message: err.message});
  }
});

app.post('/api/products', async (req, res)=>{
  try{
    const product = await Product.create(req.body);
    res.status(200).json(product);
  }catch(err){
    res.status(500).send({message: err.message});
  }
});

mongoose.connect("mongodb+srv://mycodes61:Mcds1461%40@backenddb.jkmniuw.mongodb.net/Node-API?appName=backendDB")
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000')
    })
  })
  .catch(err => console.log('Database connection failed:', err));
