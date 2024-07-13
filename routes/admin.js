const express = require('express');
const admin = require('../middlewares/admin');
const {Product} = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const adminRouter = express.Router();

// add admin add product
adminRouter.post('/admin/add-product',admin,async (req,res) =>{
    try{
       const {name, description,images, quantity,price,category} = req.body;

       let product = new Product({
         name,
        description,
        images,
        quantity,
        price,
        category
        });

       product = await product.save();
       res.json(product);
    }catch(e){
       res.status(500).json({error: e.message});
    }
});

// get all your products
adminRouter.get('/admin/get-products',admin,async (req,res) =>{
   try{
      const products = await Product.find({}) ;
      res.json(products);

   }catch(e){
      res.status(500).json({error: e.message});
   }
});

// delete the product
adminRouter.post('/admin/delete-product', admin, async(req, res)=>{

  try{
     const {id} = req.body;
     let product = await Product.findByIdAndDelete(id);
     
     res.json(product);
 
  }catch(e){
   res.status(500).json({error: e.message});
  }

});


// get all your orders
adminRouter.get('/admin/get-orders',admin,async (req,res) =>{
   try{
      const orders = await Order.find({}) ;
      res.json(orders);

   }catch(e){
      res.status(500).json({error: e.message});
   }
});

// change order status the product
adminRouter.post('/admin/change-order-status', admin, async(req, res)=>{

   try{
      const {id,status} = req.body;
      let order = await Order.findById(id);
      order.status = status;
      order = await order.save();
      res.json(order);
  
   }catch(e){
    res.status(500).json({error: e.message});
   }
 
 });

adminRouter.get('/admin/analytics', admin, async(req, res)=>{
   try{
     
      const orders = await Order.findById({});
       let totalEarning = 0;

       for(let i=0; i< orders.length; i++){
         for(let j=0; j<  orders[i].products.length; j++){
            totalEarning += orders[i].products[j].quantity * orders[i].products[j].product.price;
         }
       }
    // CATEGORY WISE ORDER FETCHING
    let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
    let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
    let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
    let booksEarnings = await fetchCategoryWiseProduct("Books");
    let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

    let earnings = {
      totalEarnings,
      mobileEarnings,
      essentialEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings,
    };

    res.json(earnings);
  
   }catch(e){
    res.status(500).json({error: e.message});
   }
 
});


async function fetchCategoryWiseProduct(category) {
   let earnings = 0;
   let categoryOrders = await Order.find({
     "products.product.category": category,
   });
 
   for (let i = 0; i < categoryOrders.length; i++) {
     for (let j = 0; j < categoryOrders[i].products.length; j++) {
       earnings +=
         categoryOrders[i].products[j].quantity *
         categoryOrders[i].products[j].product.price;
     }
   }
   return earnings;
 }
 

 // update product 
 adminRouter.put('/admin/products-update', admin, async( req, res)=>{
    try{
       const{id,name,description,quantity,price,category,images } = req.body;
       let product = await Product.findById(id);
        
       product.name = name;
       product.description= description;
       product.images = images;
       product.quantity = quantity;
       product.price =price;
       product.category = category;

       product = await product.save();
       res.json(product);
    }catch(e){
      res.status(500).json({error: e.message});
    }
 });


// get all user 
adminRouter.get('/admin/get-users', admin, async(req ,res) =>{
   try{

      const user = await User.find({});
      res.json(user);
   }catch(e){
      res.status(500).json({error: e.message});
   }
});

// delete id user
adminRouter.delete('/admin/delete-user',admin, async(req, res)=>{
   try{

      const {id} = req.body;
      let user = await User.findByIdAndDelete(id);
      res.json(user);
   }catch(e){
      res.status(500).json({error: e.message});
   }
});



module.exports = adminRouter;