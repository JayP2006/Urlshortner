import mongoose from "mongoose";

const ClickStatSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ClickStatSchema.index({ urlId: 1, date: 1, hour: 1 }, { unique: true });

const ClickStat = mongoose.model("ClickStat", ClickStatSchema);
export default ClickStat;
