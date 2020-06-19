const express = require("express");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middleware/queries");
const Order = require("../models/Orders");

const { getOrders, getOrder } = require("../controllers/orders");
const { acceessRoles, protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Order, { path: "product", select: "name price count" }),
    getOrders
  );
router.route("/:id").get(getOrder);
//router.route("/:id").get(getOrder).put(updateOrder).delete(removeOrder);

module.exports = router;
