const express = require("express");
const router = express.Router({ mergeParams: true });
const Product = require("../models/Products");
const advancedResults = require("../middleware/queries");
const {
  getProducts,
  getProduct,
  addProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const {
  addOrder,
  updateOrder,
  removeOrder,
  getOrderByProduct,
} = require("../controllers/orders");

const { getReviewByProduct, addReview } = require("../controllers/reviews");

const OrdersRouter = require("./Orders");
const ReviewsRouter = require("./Reviews");

const { acceessRoles, protect } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Product, "orders"), getProducts)
  .post(addProduct);
router.route("/:id").get(getProduct);
router.route("/:id/image").put(protect, acceessRoles("admin"), uploadImage);
router.route("/:id").put(protect, acceessRoles("admin"), updateProduct);
router.route("/:id").delete(protect, acceessRoles("admin"), deleteProduct);

router
  .route("/:productId/order")
  .post(protect, acceessRoles("admin", "user"), addOrder)
  .put(protect, acceessRoles("admin", "user"), updateOrder)
  .delete(protect, acceessRoles("admin", "user"), removeOrder)
  .get(protect, acceessRoles("admin", "user"), getOrderByProduct);

router
  .route("/:productId/review")
  .get(getReviewByProduct)
  .post(protect, acceessRoles("user"), addReview);

module.exports = router;
