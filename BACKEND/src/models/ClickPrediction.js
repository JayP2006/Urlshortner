import mongoose from "mongoose";

const PredictionPointSchema = new mongoose.Schema(
  {
    time: { type: Date, required: true },
    predictedClicks: { type: Number, required: true },
  },
  { _id: false }
);

const ClickPredictionSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    horizonHours: {
      type: Number,
      default: 24,
    },
    points: [PredictionPointSchema],
  },
  { timestamps: true }
);

ClickPredictionSchema.index({ urlId: 1, generatedAt: -1 });

const ClickPrediction = mongoose.model("ClickPrediction", ClickPredictionSchema);
export default ClickPrediction;
