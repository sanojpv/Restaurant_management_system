
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    position: {
      type: String,
      enum: ["waiter", "chef", "delivery boy", "receptionist"],
      required: [true, "Position is required"],
    },
    userRole: {
      type: String,
      enum: ["staff"],
      default: "staff",
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
