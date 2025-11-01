import mongoose, { Schema } from "mongoose";

const EntitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    mimeType: { type: String, required: false, enum: ["application/pdf"] },
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
