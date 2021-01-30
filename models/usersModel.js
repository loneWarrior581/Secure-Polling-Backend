const { Mongoose } = require("mongoose")

const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:5},
    displayName:{type:String}
})

module.exports=mongoose.model("user",userSchema);