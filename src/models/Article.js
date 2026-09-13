const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PUBLISHED", "FAILED"],
      default: "PENDING",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    normalizedTitle: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);