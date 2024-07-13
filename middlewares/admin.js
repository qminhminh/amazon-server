const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async( req, res,next) => {
    try{
        // check x auth token
        const token = req.header('x-auth-token') ;
        if(!token) return res.status(401).json({msg: 'NO auth token'});

        // check password
        const verified= jwt.verify(token,'passwordKey');
        if(!verified) return res.status(401).json({msg: 'Token verification failed, auth denied!'});
        
        // check user and seller
        const user = await User.findById(verified.id);
        if(user.type == 'user' || user.type == 'seller'){
            return res.status(401).json({msg: 'You are not a Admin'});
        }
        req.user = verified.id;
        req.token = token;
        next();
     
    }catch(e){
        res.status(500).json({error: e.message});
    }
}

module.exports = admin;