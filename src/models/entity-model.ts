import mongoose, { Schema } from "mongoose";
import { supportedMimeTypes } from "../constants";

const EntitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    mimeType: { type: String, required: false, enum: supportedMimeTypes },
    type: {
      type: String,
      required: false,
      default: "general",
      enum: ["general"],
    },
  },
  { timestamps: true, collection: "entities" }
);

const EntityModel = mongoose.model("entity", EntitySchema);

export default EntityModel;
