import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({

    customerId:{type:mongoose.Schema.Types.ObjectId,ref:"customer",required:true},
})