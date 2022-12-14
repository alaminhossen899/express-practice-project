const express = require("express");
const mongoose = require("mongoose");
const bcryptData = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();


const userSchema = require("../schemas/userSchema");


/** Create User model */
const User = new mongoose.model("User",userSchema); /** 1st paramter model name, alawys singular it will create table plular like laravel migration */

/** signup api */
authRouter.post('/signup',async(req,res)=>{
  try {
    const hashPassword = await bcryptData.hash(req.body.password,10);

    const user = new User({
      name:req.body.name,
      username:req.body.username,
      password:hashPassword,
      status:req.body.status || 0,
    });

    await user.save();

    res.status(200).json({
      message:"user successfully registered",
      success:true
    })

  } catch (error) {
    res.status(500).json({
      error:error.message,
      success:false
    });
  }
  
});



/** Login api */
authRouter.post('/login',async(req,res)=>{
  try {
    const user =await User.find({username:req.body.username});
    
    if(user && user.length>0){
        const isValidPassword = await bcryptData.compare(req.body.password,user[0].password);
        
        if(isValidPassword){
          // generate token
          const token = jwt.sign({
            username: user[0].username,
            userId: user[0]._id,
          },process.env.JWT_SECRET, {
            expiresIn: '2 days'
        });

        res.status(200).json({
          success:true,
          api_token :token,
          message:"Login Success",
        })

        }else{
          res.status(401).json({
            error:"Incorrect password or username !",
            success:false
          });
        }
    }
    else{
      res.status(401).json({
        error:"Authentication failed!",
        success:false
      });
    }

  } catch (error) {
    res.status(500).json({
      error:error.message,
      success:false
    });
  }
  
});


module.exports = authRouter