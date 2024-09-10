import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const ReactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: null,
      unique: true,
    },
  },
  schemaOptions
);

addDateGetters(ReactionSchema);

const Reaction = mongoose.model("Reaction", ReactionSchema);
export default Reaction;
