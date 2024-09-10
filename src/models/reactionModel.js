import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const ReactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  schemaOptions
);

addDateGetters(ReactionSchema);

const Reaction = mongoose.model("Reaction", ReactionSchema);
export default Reaction;
