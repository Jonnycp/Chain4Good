import { Schema, Types, model, Document } from "mongoose";

export interface Donazione extends Document {
  project: Types.ObjectId;
  donor: Types.ObjectId;
  messaggio?: string;
  amount: number;
  symbol: string;
  hashTransaction: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<Donazione>({
  project: { type: Types.ObjectId, ref: "Project", required: true, index: true },
  donor: { type: Types.ObjectId, ref: "User", required: true, index: true },
  messaggio: { type: String, default: "" },
  amount: { type: Number, required: true },
  symbol: { type: String, required: true, default: "EURC" },
  hashTransaction: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

DonationSchema.index({ project: 1, createdAt: -1 }); //indice composto: ordinati per progetto e data da più recenti

export const DonationModel = model<Donazione>("Donation", DonationSchema);
