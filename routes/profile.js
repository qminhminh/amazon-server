const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const profileRouter = express.Router();


//update profile
profileRouter.put('/api/update-profile',auth, async(req, res)=>{
  try{
    const{id} = req.params;
  
    const user = await User.findById(req.user);
  
    res.json(user);
  }catch(e){
     res.json(500).json({error: e.message});
  }

});


module.exports = profileRouter;