import mongoose, { Schema } from "mongoose";
import { generalDocModel } from "../constants";

const InvoiceDocs = new Schema(
  generalDocModel,
  { timestamps: true }
);

const InvoiceModel = mongoose.model("invoice_docs", InvoiceDocs);

export default InvoiceModel;
