const express = require("express");
const router = express.Router();

const {
  getLocations,
  getLocationById,
  addLocation,
  deleteLocation,
  updateLocation,
  gettUserLocation,
} = require("../controllers/locations");
const { protect } = require("../middleware/auth");

router.route("/").get(getLocations).post(protect, addLocation);
router
  .route("/:id")
  .get(getLocationById)
  .put(protect, updateLocation)
  .delete(protect, deleteLocation);

router.route("/user").get(protect, gettUserLocation);

module.exports = router;
