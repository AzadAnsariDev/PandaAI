import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { 
        type: String,
        required: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
        type: String, 
        required: true ,
        select: false
    },
    verified: {
        type: Boolean,
        default: false 
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function(){ 
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10)
})



const userModel = model("User", userSchema);

export default userModel;
