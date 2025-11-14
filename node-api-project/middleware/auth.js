const jwt = require('jsonwebtoken');
const User  = require('../models/users.model');
// const dotenv = require('dotenv');
// dotenv.config();

const auth = async (req,res,next)=>{
    try {
        const bearerHader = req.headers['authorization'];
        if(typeof bearerHader != 'undefined' ) {
            const token = bearerHader.split(' ')[1]
            const user = jwt.verify(token,process.env.JWT_SECRET);
            console.log(user);
            req.token = user;
            next();
        }else{
            return res.status(401).json({msg:'No token provided'});
        }
    } catch (err) {
         res.status(403).json({msg:'invalid or expired token'});
    }
}

module.exports = auth
