import { Schema, model, Document, Types } from "mongoose";

export const CATEGORY_ENUM = [
  "medical",
  "education",
  "environment",
  "community",
  "arts",
  "sport",
  "emergency",
] as const;

export interface Progetto extends Document {
  title: string;
  category: (typeof CATEGORY_ENUM)[number];
  location: string;
  descrizione: string;
  usoFondi: string[];
  ente: Types.ObjectId;
  coverImage: string;
  endDate: Date;
  targetAmount: number;
  currentAmount: number;
  vaultAddress: string;
  currency: string;
  status: "raccolta" | "attivo" | "completato" | "annullato";
  createdAt: Date;
  updatedAt: Date
}

const ProjectSchema = new Schema<Progetto>({
  title: { type: String, required: true, trim: true, index: true },
  category: {
    type: String,
    required: true,
    enum: CATEGORY_ENUM,
  },
  location: { type: String, required: true, trim: true },
  descrizione: { type: String, required: true, trim: true },
  usoFondi: { type: [String], required: true },
  ente: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coverImage: { type: String, required: true },
  endDate: { type: Date, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0, required: true },
  vaultAddress: { type: String, required: true, unique: true, index: true },
  currency: {type: String, required: true, default: "EURC"},
  status: {
    type: String,
    required: true,
    enum: ["raccolta", "attivo", "completato", "annullato"],
    default: "raccolta",
  }
}, { timestamps: true });

export const ProjectModel = model<Progetto>("Project", ProjectSchema);
