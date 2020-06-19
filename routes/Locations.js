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
const { acceessRoles, protect } = require("../middleware/auth");

router.route("/").get(getLocations).post(addLocation).get(gettUserLocation);
router
  .route("/:id")
  .get(getLocationById)
  .put(protect, acceessRoles("user", "admin"), updateLocation)
  .delete(protect, acceessRoles("admin", "user"), deleteLocation);

module.exports = router;
