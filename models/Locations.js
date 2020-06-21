const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const locationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  locationId: {
    type: String,
    required: [true, "LocationId is required"],
    unique: true,
    trim: true,
    maxlength: [10, "LocationId must be less 10 chars"],
  },
  address: {
    type: String,
    required: [true, "address is required"],
  },
  location: {
    type: {
      String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
  },
});
// Geocode & create location
locationSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
  };

  // reomve address from db
  this.address = undefined;
  next();
});
module.exports = mongoose.model("Location", locationSchema);
