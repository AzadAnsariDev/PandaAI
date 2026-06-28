import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const chatSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
  },
  { timestamps: true }
);


const chatModel = model('Chat', chatSchema);
export default chatModel
