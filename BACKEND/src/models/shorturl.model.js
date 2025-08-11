import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  full_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
    index: true,
  },
  qrCodeDataUrl: {
    type: String, 
    required: false, 
  },isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;