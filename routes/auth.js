const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const authRouter = express.Router();

// Sign UP 
authRouter.post('/api/signup',async (req,res) =>{
  try{
  console.log('Request body:', req.body);
   const {name, email, password} = req.body;
   const exitsUser = await User.findOne({email});

   // check exists
   if(exitsUser){
     return res.status(400).json({msg: "User with same email already exists"});
   }

  //bcryptjs
  const hashedPass = await bcryptjs.hash(password, 8 );

   // new User
   let user = new User({
     email,
     password: hashedPass,
     name,
   });

   user = await user.save();
   res.json(user);

  }catch(e){
    res.status(500).json({error: e.message});
  }
});

// Sign In 
authRouter.post('/api/signin', async (req, res)=>{
   try{
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if(!user){
         return res.status(400).json({msg: "User does not exist!"});
      }
      //bcryptjs
      const isMatch = bcryptjs.compare(password,user.password);
      if(!isMatch){
         return res.status(400).json({msg: "Incorrect password"});
      }
      
      const token = jwt.sign({id: user._id},"passwordKey");
      res.json({token, ...user._doc});

   }catch(e){
      res.status(500).json({error: e.message});
   }
});


// Token Valid
authRouter.post('/tokenisvalid', async (req, res)=>{
   try{
      const token = req.header('x-auth-token');
      if(!token) return res.json(false);

      const verified= jwt.verify(token,'passwordKey');
      if(!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if(!user) return res.json(false);
      res.json(true);

   }catch(e){
      res.status(500).json({error: e.message});
   }
});

authRouter.get('/', auth, async(req, res) =>{
   const user = await User.findById(req.user);
   res.json({...user._doc, token: req.token});
})

module.exports = authRouter;
