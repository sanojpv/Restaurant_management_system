import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
   role: { 
    type: String, 
    enum: ["admin", "staff", "customer"], 
    default: "customer" 
  }
},{timestamps:true});

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
