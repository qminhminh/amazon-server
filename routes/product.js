const express =require('express');
const auth = require('../middlewares/auth');
const {Product} = require('../models/product');
const productRouter = express.Router();


// get choose category products of home ''
productRouter.get('/api/products',auth, async (req, res) =>{
   try{
      const products = await Product.find({category: req.query.category});
      res.json(products);

   }catch(e){
    res.status(500).json({error : e.message});
   }
});

//search 
productRouter.get('/api/products/search/:name',auth, async (req, res) =>{
    try{
        const products = await Product.find({
            name: { $regex: req.params.name, $options: "i" },
          });
       res.json(products);
 
    }catch(e){
     res.status(500).json({error : e.message});
    }
 });

 // create post request router to rate the product 
 productRouter.post('/api/rate-product',auth, async (req, res)=>{
   try{
        const {id, rating} = req.body;
        let product = await Product.findById(id);

        for( let i = 0 ; i< product.ratings.length; i++){
           if(product.ratings[i].userId == req.user){
             product.ratings.splice(i,1);
             break;
           }
        }

        const ratignSchema = {
           userId: req.user,
           rating,
        };

        product.ratings.push(ratignSchema);
        product = await product.save();
        res.json(product);
        
   }catch(e){
      res.status(500).json({error : e.message});
   }
 });
 
 // deal of day
 productRouter.get('/api/deal-of-day',auth,async (req,res)=>{
  try{
    let products = await Product.find({});
    products.sort((a,b) =>{
      let aSum = 0;
      let bSum = 0;

      for(let i=0 ; i < a.ratings.length; i++){
         aSum += a.ratings[i].rating;
      }

      for(let i=0 ; i < b.ratings.length; i++){
         bSum += a.ratings[i].rating;
      }

      return aSum < bSum ? 1 : -1;

    });

    res.json(products[0]);
  }catch(e){
    res.status(500).json({error: e.message});
  }
 });

module.exports = productRouter;