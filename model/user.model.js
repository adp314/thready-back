import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true, trim: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  threadsCreated: [ { type: Types.ObjectId, ref: "Thread" } ],
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  createdAt: { type: Date, default: Date.now() },
  profileImg: {type: String, default: "https://res.cloudinary.com/adpinto314/image/upload/v1670882116/thready_profile_pictures/file_y06cl6.png"},
});

export const UserModel = model("User", userSchema);
