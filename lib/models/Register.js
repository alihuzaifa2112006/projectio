const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,

    },
    email:{
        type:String,
        required: true,
        unique: true,

    },
    number:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type:String,
        enum:['admin']
     
    },
}, {timestamps: true});


module.exports = RegisterSchema;