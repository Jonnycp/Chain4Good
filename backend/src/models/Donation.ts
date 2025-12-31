import { Schema, model, Document } from "mongoose";

export interface Donazione extends Document {
  project: Schema.Types.ObjectId;
  donor: Schema.Types.ObjectId;
  amount: number;
  symbol: string;
  hashTransaction: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<Donazione>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  donor: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  amount: { type: Number, required: true },
  symbol: { type: String, required: true, default: "EURC" },
  hashTransaction: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

DonationSchema.index({ project: 1, createdAt: -1 }); //indice composto: ordinati per progetto e data da più recenti

export const DonationModel = model<Donazione>("Donation", DonationSchema);
