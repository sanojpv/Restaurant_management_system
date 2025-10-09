import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },role: { 
        type: String, 
        enum: ["waiter", "chef", "delivery boy", "receptionist"], 
        required: true 
    },
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
