const express = require('express');
const router = express.Router();
const User  = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/register',async(req,res)=>{
    try {
        const {username,email,password} = req.body;
        const existingUser = await User.findOne({ $or:[{username},{email}] });
        if(existingUser) return res.status(400).json({msg:'Username or Email already exists'});
        const hasedPassword = await bcrypt.hash(password,10);

        const user = new User({
            username,
            email,
            password:hasedPassword
        });
        const saveUser =  await user.save();
        res.status(201).json(saveUser);
    } catch (err) {
        res.status(500).json({msg:err.msg});
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username})
        if(!user) return res.status(404).json({msg:'User Not Found'}) 

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg:'Invalid Credentials'})

        const token = jwt.sign(
            {userId:user._id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )
        res.json({token});
    } catch (err) {
        res.status(500).json({msg:err.msg});
    }
    
})

router.post('/logout',async(req,res)=>{
    res.json({msg:'Logged out Successfully .'})
})


module.exports = router

