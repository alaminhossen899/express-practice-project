const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        enum:[0,1,2],
        default:1
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});

module.exports = userSchema