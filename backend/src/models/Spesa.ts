import { Schema, model, Document, Types } from "mongoose";

export interface Spesa extends Document {
  title: string;
  description: string;
  category: string;
  projectId: Types.ObjectId;
  amount: number;
  preventivo: string;
  proof: string;
  proofHash: string;
  votes: {
    votesFor: number;
    votesAgainst: number;
    voters: Map<
      string,
      { vote: "for" | "against"; timestamp: Date; motivation?: string, hashVote: string }
    >;
  };
  requestId: number;
  hashTransaction: string;
  hashCreation: string;
  executed: boolean;
  executionDate: Date;
  status: "votazione" | "approvata" | "rifiutata"
  createdAt: Date;
  updatedAt: Date;
}

const SpesaSchema = new Schema<Spesa>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    proof: { type: String },
    proofHash: { type: String},
    preventivo: { type: String },
    votes: {
      votesFor: { type: Number, default: 0 },
      votesAgainst: { type: Number, default: 0 },
      voters: {
        type: Map,
        of: {
          vote: { type: String, enum: ["for", "against"], required: true },
          timestamp: { type: Date, default: Date.now },
          motivation: { type: String },
            hashVote: { type: String, required: true },
        },
        default: {},
      },
    },
    requestId: { type: Number, required: true },
    hashTransaction: { type: String },
    hashCreation: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["votazione", "approvata", "rifiutata"],
      default: "votazione",
    },
    executed: { type: Boolean, default: false },
    executionDate: { type: Date },
  },
  { timestamps: true }
);

export const SpesaModel = model<Spesa>("Spesa", SpesaSchema);
