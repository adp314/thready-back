import { Schema, model, Types } from "mongoose";

const threadSchema = new Schema({
  title: { type: String, required: true, trim: true },
  text: { type: String, required: true},
  likes: { type: Number, default: 0 },
  banner: {},
  tags: [{ type: String, enum: [
    "Sports", "Nature", "Tec", "Tv & Movies", "Music",
    "Food", "Business", "Health", "Travel"]}],
  createdAt: { type: Date, default: Date.now() },
  creator: { type: Types.ObjectId, ref: "User" },
  creatorName: [{ type: String, ref: "User" }]
});

export const ThreadModel = model("Thread", threadSchema);