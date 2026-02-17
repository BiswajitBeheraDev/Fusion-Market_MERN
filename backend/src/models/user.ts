import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  googleId: string
  name: string
  email: string
  avatar: string
}

const UserSchema: Schema = new Schema(
  {
    googleId: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model<IUser>("User", UserSchema)
