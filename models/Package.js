const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Destination title
  price: { type: Number, required: true }, // Price of the package
  type: { type: String, default: "Round Trip" }, // Type of travel
  image: { type: String, required: true }, // Image file name
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Package", PackageSchema);
