import { Schema, model, Document } from "mongoose";

export interface Utente extends Document {
  address: string;
  username: string;
  email?: string;
  profilePicture?: string;
  nonce: string;
  createdAt: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<Utente>({
  address: {
    //chiave primaria
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    default: "user-" + Math.floor(Math.random() * 10000),
  },
  email: { type: String, trim: true, sparse: true },
  profilePicture: { type: String, default: "" },
  nonce: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  lastLogin: { type: Date, default: Date.now, required: true },
});

export const UserModel = model<Utente>("User", UserSchema);
