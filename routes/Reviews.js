const express = require("express");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middleware/queries");

const Review = require("../models/Reviews");

const {
  getReviews,
  updateReviews,
  // deleteReviews,
  getReview,
} = require("../controllers/reviews");

const { acceessRoles, protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, { path: "product", select: "name" }),
    getReviews
  );

router
  .route("/:id")
  .put(protect, acceessRoles("user"), updateReviews)
  // .delete(protect, acceessRoles("user"), deleteReviews)
  .get(getReview);

module.exports = router;
