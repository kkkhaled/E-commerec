const Location = require("../models/Locations");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/ascyncHandler");
// get all locations
// route /api/v1/locations
exports.getLocations = asyncHandler(async (req, res, next) => {
  /* if (req.params.userId) {
    let loc = await Location.find({ user: req.params.userId });
    if (!loc) {
      return next(new ErrorResponse(`no location found please add onre`, 404));
    }
    return res
      .status(200)
      .json({ success: true, length: loc.length, data: loc });
  }*/
  loc = await Location.find();
  res.status(200).json({ success: true, length: loc.length, data: loc });
});
//getlocations for specific user
//route /api/v1/location/user
exports.gettUserLocation = asyncHandler(async (req, res, next) => {
  const locs = await Location.find({ user: req.user.id });
  if (!locs) {
    return next(new ErrorResponse(`no locs for his user please add one`, 404));
  }
  res.status(200).json({ succes: true, data: locs });
});
// getlocation by specificid
// api/v1/location/:id
exports.getLocationById = asyncHandler(async (req, res, next) => {
  const loc = await Location.findById(req.params.id);
  if (!loc) {
    return next(new ErrorResponse(`no location found please add onre`, 404));
  }
  res.status(200).json({ success: true, length: loc.length, data: loc });
});
// create locatiion for specific user
//route /api/v1/locations
exports.addLocation = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user.id;
  const loc = await Location.create(req.body);
  res.status(201).json({ success: true, length: loc.length, data: loc });
});
//update locaion
// route /api/v1/location/:id
exports.updateLocation = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user.id;
  let loc = await Location.findById(req.params.id);
  if (!loc) {
    return next(new ErrorResponse(`no location found please add onre`, 404));
  }
  loc = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, length: loc.length, data: loc });
});
//delete locaion
// route /api/v1/location/:id
exports.deleteLocation = asyncHandler(async (req, res, next) => {
  let loc = await Location.findById(req.params.id);
  if (!loc) {
    return next(new ErrorResponse(`no location found please add onre`, 404));
  }
  await loc.remove();
  res.status(200).json({ success: true, data: {} });
});
