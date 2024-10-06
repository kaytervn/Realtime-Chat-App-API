import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
import { deleteFileByUrl } from "../services/apiService.js";

const StorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    musicUrl: {
      type: String,
      default: null,
    },
  },
  schemaOptions
);

StorySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.imageUrl);
      await deleteFileByUrl(this.musicUrl);
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Story = mongoose.model("Story", StorySchema);
export default Story;
