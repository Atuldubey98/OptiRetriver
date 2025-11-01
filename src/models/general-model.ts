import mongoose, {Schema} from "mongoose";
import { generalDocModel } from "../constants";

const GeneralSchema = new Schema(generalDocModel, { timestamps: true });

const GeneralModel = mongoose.model('general_docs', GeneralSchema);

export default GeneralModel;