import mongoose from "mongoose";

export const generalDocModel = {
  content: { type: String, required: true },
  embeddings: { type: [Number], required: true },
  entity: { type: mongoose.Schema.ObjectId, required: true, ref: "entity" },
};

export const supportedMimeTypes = [
  "application/pdf",
];